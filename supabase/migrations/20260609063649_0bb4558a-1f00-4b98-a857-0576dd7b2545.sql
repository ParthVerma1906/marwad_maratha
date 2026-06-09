CREATE OR REPLACE FUNCTION public.place_order(
  _customer_name text,
  _phone text,
  _whatsapp text,
  _address text,
  _city text,
  _pincode text,
  _items jsonb,
  _total_amount numeric,
  _payment_method text,
  _notes text DEFAULT NULL
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_number text;
  v_pm text;
BEGIN
  IF _customer_name IS NULL OR length(trim(_customer_name)) = 0 THEN
    RAISE EXCEPTION 'customer_name required';
  END IF;
  IF _phone IS NULL OR length(trim(_phone)) = 0 THEN
    RAISE EXCEPTION 'phone required';
  END IF;
  IF _address IS NULL OR length(trim(_address)) = 0 THEN
    RAISE EXCEPTION 'address required';
  END IF;
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;
  IF _total_amount IS NULL OR _total_amount <= 0 THEN
    RAISE EXCEPTION 'total_amount invalid';
  END IF;

  v_pm := CASE WHEN upper(coalesce(_payment_method,'COD')) IN ('UPI','COD')
               THEN upper(_payment_method) ELSE 'COD' END;

  INSERT INTO public.orders (
    order_number, customer_name, phone, whatsapp, address, city, pincode,
    items, total_amount, payment_method, payment_status, order_status, notes
  ) VALUES (
    '', _customer_name, _phone, coalesce(_whatsapp, _phone), _address, _city, _pincode,
    _items, _total_amount, v_pm, 'pending', 'new', _notes
  )
  RETURNING order_number INTO v_order_number;

  RETURN v_order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(text,text,text,text,text,text,jsonb,numeric,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(text,text,text,text,text,text,jsonb,numeric,text,text) TO anon, authenticated;