## Problem

Checkout shows "Could not place order" even though the order insert is permitted. Root cause: the `orders` table RLS allows anonymous customers to `INSERT` but only admins to `SELECT`. The client calls `.insert(...).select("order_number").single()` — PostgREST tries to return the inserted row, RLS blocks the SELECT, the response comes back empty, and the code treats it as a failure (and the row is rolled back).

## Fix

1. **Database migration** — add an RLS policy that lets the inserter read back only the row they just created, so the `RETURNING` clause works for anonymous checkouts without exposing all orders to the public.

   ```sql
   CREATE POLICY "Anyone can read their just-inserted order"
   ON public.orders FOR SELECT
   TO anon, authenticated
   USING (false);
   ```

   Since `USING (false)` would still block, the correct approach is to keep SELECT admin-only and instead **generate the order number client-side OR use a SECURITY DEFINER RPC**. Cleanest option: create a `place_order` SQL function (SECURITY DEFINER) that inserts the order and returns the `order_number`. The client calls `supabase.rpc('place_order', {...})` instead of `.from('orders').insert(...).select()`.

2. **Client change in `src/pages/Checkout.tsx`** — replace the direct `.from('orders').insert(...).select().single()` call with `supabase.rpc('place_order', { ... })`, which returns the generated `order_number` without needing SELECT permission on the table.

3. Keep all existing admin SELECT/UPDATE policies untouched so customers still cannot read other orders.

## Why an RPC instead of loosening SELECT

Granting `anon` SELECT on `orders` — even narrowly — risks exposing customer PII (names, phones, addresses) through the Data API. A SECURITY DEFINER function keeps the table locked down and only returns the single field the checkout needs.

## Files touched

- New migration: create `public.place_order(...)` function with `SECURITY DEFINER`, granted to `anon` and `authenticated`.
- `src/pages/Checkout.tsx`: swap the insert block (lines ~143–178) for an `rpc('place_order', …)` call; keep the rest of the flow (Telegram notify, sessionStorage, UPI link, navigate) the same.

No other files need changes.
