
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS provider_order_id text,
  ADD COLUMN IF NOT EXISTS provider_payment_id text,
  ADD COLUMN IF NOT EXISTS provider_signature text;

CREATE INDEX IF NOT EXISTS orders_provider_order_id_idx ON public.orders(provider_order_id);

-- RPC: attach a Razorpay order_id to an existing order
CREATE OR REPLACE FUNCTION public.attach_razorpay_order(_order_number text, _provider_order_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_updated int;
BEGIN
  UPDATE public.orders
     SET provider = 'razorpay',
         provider_order_id = _provider_order_id
   WHERE order_number = _order_number
     AND payment_method = 'UPI';
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

-- RPC: mark order paid after verified signature (called from edge function w/ service_role)
CREATE OR REPLACE FUNCTION public.mark_razorpay_paid(
  _provider_order_id text,
  _provider_payment_id text,
  _provider_signature text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_order_number text;
BEGIN
  UPDATE public.orders
     SET payment_status = 'paid',
         provider_payment_id = _provider_payment_id,
         provider_signature = _provider_signature
   WHERE provider_order_id = _provider_order_id
   RETURNING order_number INTO v_order_number;
  RETURN v_order_number;
END;
$$;
