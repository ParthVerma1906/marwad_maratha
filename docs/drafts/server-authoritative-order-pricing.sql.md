# DRAFT — Server-authoritative order pricing (REVIEW ONLY)

> Status: **NOT APPLIED. NOT A MIGRATION.** This file is intentionally outside
> `supabase/migrations/` and wrapped in Markdown so no tool executes it.
> Applying it requires explicit owner approval in a later batch.

## Summary

- Adds a **new** function `public.place_order_v2(...)`. The existing
  `public.place_order(...)` is left unchanged so current callers keep working
  until Checkout switches over.
- Prices every line from `public.products` (by `id uuid`), rejecting unknown,
  unavailable, or invalid-quantity items. Client prices/totals are ignored.
- Shipping comes from the single `public.settings` row
  (`shipping_charge`, `free_shipping_above`), falling back to ₹100 / ₹500 if
  the row is missing. Rule: subtotal `>= free_shipping_above` → free.
- Respects `settings.is_accepting_orders`.
- Inserts via the same `orders` table, so the existing `set_order_number`
  BEFORE INSERT trigger still generates `MM-YYYY-NNNN`. No new triggers.
- All work runs inside the single implicit transaction of the function call;
  any `RAISE EXCEPTION` rolls back the whole order.

Confirmed schema used (from previous turn's read-only inspection):
`products(id uuid, name text, price numeric, weight text, is_available boolean)`,
`settings(shipping_charge numeric, free_shipping_above numeric, is_accepting_orders boolean)`,
`orders(... items jsonb, total_amount numeric, payment_method text, ...)`.

## SQL (draft)

```sql
CREATE OR REPLACE FUNCTION public.place_order_v2(
  _customer_name  text,
  _phone          text,
  _whatsapp       text,
  _address        text,
  _city           text,
  _pincode        text,
  _items          jsonb,          -- [{ "product_id": uuid, "quantity": int }, ...]
  _payment_method text,
  _notes          text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  c_max_lines     constant int := 50;
  c_max_qty       constant int := 50;
  v_settings      record;
  v_ship_charge   numeric := 100;
  v_free_above    numeric := 500;
  v_line          jsonb;
  v_pid           uuid;
  v_qty           int;
  v_prod          record;
  v_priced_items  jsonb := '[]'::jsonb;
  v_subtotal      numeric := 0;
  v_shipping      numeric;
  v_total         numeric;
  v_pm            text;
  v_order_number  text;
BEGIN
  -- Customer fields
  IF _customer_name IS NULL OR length(trim(_customer_name)) = 0 THEN
    RAISE EXCEPTION 'customer_name required' USING ERRCODE = '22023';
  END IF;
  IF _phone IS NULL OR length(trim(_phone)) = 0 THEN
    RAISE EXCEPTION 'phone required' USING ERRCODE = '22023';
  END IF;
  IF _address IS NULL OR length(trim(_address)) = 0 THEN
    RAISE EXCEPTION 'address required' USING ERRCODE = '22023';
  END IF;

  -- Store open?
  SELECT shipping_charge, free_shipping_above, is_accepting_orders
    INTO v_settings
    FROM public.settings
   LIMIT 1;
  IF FOUND THEN
    IF NOT v_settings.is_accepting_orders THEN
      RAISE EXCEPTION 'not_accepting_orders' USING ERRCODE = 'P0001';
    END IF;
    v_ship_charge := coalesce(v_settings.shipping_charge, 100);
    v_free_above  := coalesce(v_settings.free_shipping_above, 500);
  END IF;

  -- Items shape
  IF _items IS NULL OR jsonb_typeof(_items) <> 'array'
     OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'items required' USING ERRCODE = '22023';
  END IF;
  IF jsonb_array_length(_items) > c_max_lines THEN
    RAISE EXCEPTION 'too_many_items' USING ERRCODE = '22023';
  END IF;
  -- Reject duplicate product_ids (client should merge quantities)
  IF (SELECT count(DISTINCT e->>'product_id') FROM jsonb_array_elements(_items) e)
     <> jsonb_array_length(_items) THEN
    RAISE EXCEPTION 'duplicate_product' USING ERRCODE = '22023';
  END IF;

  FOR v_line IN SELECT * FROM jsonb_array_elements(_items) LOOP
    BEGIN
      v_pid := (v_line->>'product_id')::uuid;
      v_qty := (v_line->>'quantity')::int;
    EXCEPTION WHEN others THEN
      RAISE EXCEPTION 'invalid_item' USING ERRCODE = '22023';
    END;
    IF v_pid IS NULL OR v_qty IS NULL OR v_qty < 1 OR v_qty > c_max_qty THEN
      RAISE EXCEPTION 'invalid_quantity' USING ERRCODE = '22023';
    END IF;

    SELECT id, name, price, weight, is_available
      INTO v_prod
      FROM public.products
     WHERE id = v_pid;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'unknown_product:%', v_pid USING ERRCODE = '22023';
    END IF;
    IF NOT v_prod.is_available THEN
      RAISE EXCEPTION 'unavailable_product:%', v_pid USING ERRCODE = '22023';
    END IF;
    IF v_prod.price IS NULL OR v_prod.price <= 0 THEN
      RAISE EXCEPTION 'unpriced_product:%', v_pid USING ERRCODE = '22023';
    END IF;

    v_subtotal := v_subtotal + v_prod.price * v_qty;
    v_priced_items := v_priced_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_prod.id,
      'name',       v_prod.name,
      'weight',     v_prod.weight,
      'unit_price', v_prod.price,
      'quantity',   v_qty,
      'line_total', v_prod.price * v_qty
    ));
  END LOOP;

  v_shipping := CASE WHEN v_subtotal >= v_free_above THEN 0 ELSE v_ship_charge END;
  v_total    := v_subtotal + v_shipping;

  v_pm := CASE WHEN upper(coalesce(_payment_method, 'COD')) IN ('UPI', 'COD')
               THEN upper(_payment_method) ELSE 'COD' END;

  INSERT INTO public.orders (
    order_number, customer_name, phone, whatsapp, address, city, pincode,
    items, total_amount, payment_method, payment_status, order_status, notes
  ) VALUES (
    '', trim(_customer_name), trim(_phone), coalesce(nullif(trim(_whatsapp), ''), trim(_phone)),
    trim(_address), _city, _pincode,
    v_priced_items, v_total, v_pm, 'pending', 'new', _notes
  )
  RETURNING order_number INTO v_order_number;   -- set by existing trigger

  RETURN jsonb_build_object(
    'order_number', v_order_number,
    'subtotal',     v_subtotal,
    'shipping',     v_shipping,
    'total',        v_total,
    'items',        v_priced_items
  );
END;
$$;

REVOKE ALL ON FUNCTION public.place_order_v2(text,text,text,text,text,text,jsonb,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order_v2(text,text,text,text,text,text,jsonb,text,text)
  TO anon, authenticated, service_role;

-- PHASE 2 (separate, later migration — only after Checkout uses v2 in production):
-- REVOKE EXECUTE ON FUNCTION public.place_order(text,text,text,text,text,text,jsonb,numeric,text,text) FROM anon, authenticated, PUBLIC;
-- COMMENT ON FUNCTION public.place_order(...) IS 'DEPRECATED: replaced by place_order_v2 (server pricing)';
```

## Checkout RPC contract

Request (`supabase.rpc("place_order_v2", {...})`):

| Arg | Type | Notes |
|---|---|---|
| `_customer_name`, `_phone`, `_address` | text | required, non-blank |
| `_whatsapp`, `_city`, `_pincode`, `_notes` | text | optional; whatsapp defaults to phone |
| `_items` | jsonb | `[{ "product_id": "<uuid>", "quantity": 1..50 }]`, 1–50 lines, no duplicate ids |
| `_payment_method` | text | `UPI` or `COD` (anything else → `COD`) |

No `_total_amount` — any client price is ignored by design.

Response (jsonb):
```json
{ "order_number": "MM-2026-0042", "subtotal": 420, "shipping": 100,
  "total": 520, "items": [{ "product_id": "…", "name": "…", "weight": "…",
  "unit_price": 210, "quantity": 2, "line_total": 420 }] }
```
Checkout must display/charge `total` from the response, not its local cart sum.

Errors (PostgREST `error.message`): `customer_name required`, `phone required`,
`address required`, `items required`, `too_many_items`, `duplicate_product`,
`invalid_item`, `invalid_quantity`, `unknown_product:<id>`,
`unavailable_product:<id>`, `unpriced_product:<id>`, `not_accepting_orders`.

Compatibility changes vs. `place_order`: new name, `_total_amount` removed,
`_items` shape is now id+quantity, returns jsonb instead of text. Old function
stays callable until Phase 2.

## Unresolved dependencies (flagged, not invented)

1. **Cart product IDs:** Checkout must send real `products.id` UUIDs. If any
   cart items come from static `productData.ts` (non-UUID ids), they will be
   rejected with `invalid_item`. Must be confirmed before switching.
2. **Razorpay amount:** `razorpay-create-order` must charge `orders.total_amount`
   looked up by order number, not a client-supplied amount. Not verified here.
3. **UPI deep link / OrderSuccess / Telegram notify** should use the returned
   `total`. Not verified here.
4. **Old RPC remains exploitable** (client-set total) until Phase 2 revoke.
5. **Settings drift:** if the owner edits shipping in Admin → Settings, v2
   follows the new values; the ₹100/₹500 fallback applies only if no row exists.
6. No stock/inventory column exists; "availability" = `is_available` only.

## Test notes (to run after approval, on a non-production branch first)

- Valid 2 items, subtotal 420 → shipping 100, total 520.
- Subtotal exactly 500 → shipping 0.
- Tampered client price is irrelevant (no price arg exists).
- Unknown UUID, `is_available=false`, quantity 0 / 51 / "abc", duplicate ids,
  empty array, 51 lines → each raises the matching error and inserts no row.
- `is_accepting_orders=false` → `not_accepting_orders`, no row.
- Returned `order_number` matches `MM-YYYY-NNNN` (trigger intact).
- anon can EXECUTE v2 but still cannot SELECT `orders`.

## Rollback

```sql
DROP FUNCTION IF EXISTS public.place_order_v2(text,text,text,text,text,text,jsonb,text,text);
```
Safe: no tables, columns, triggers, or existing rows are changed; old
`place_order` remains in place throughout Phase 1.
