
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by text;

DROP VIEW IF EXISTS public.public_order_status;
CREATE VIEW public.public_order_status
WITH (security_invoker = true) AS
SELECT
  order_number,
  payment_status,
  order_status,
  payment_method,
  total_amount,
  payment_reference,
  created_at
FROM public.orders;

GRANT SELECT ON public.public_order_status TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_payment_reference(
  _order_number text,
  _utr text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean text;
  v_updated int;
BEGIN
  IF _order_number IS NULL OR length(trim(_order_number)) = 0 THEN
    RAISE EXCEPTION 'order_number required';
  END IF;
  v_clean := regexp_replace(coalesce(_utr, ''), '\s+', '', 'g');
  IF v_clean !~ '^[0-9A-Za-z]{10,23}$' THEN
    RAISE EXCEPTION 'invalid_utr';
  END IF;

  UPDATE public.orders
     SET payment_reference = v_clean,
         payment_status = 'awaiting_verification'
   WHERE order_number = _order_number
     AND payment_method = 'UPI'
     AND payment_status IN ('pending', 'awaiting_verification');

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_payment_reference(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_payment_reference(text, text) TO anon, authenticated;
