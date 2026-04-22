-- ============================================
-- PHASE 1: Schema, RLS, Storage, Seed Products
-- ============================================

-- 1. ROLES SYSTEM (separate table to prevent privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT NOT NULL,
  weight TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  alt_text TEXT,
  ingredients TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_available ON public.products(is_available);

-- 3. ORDERS TABLE
CREATE SEQUENCE public.order_number_seq START 1;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  address TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL DEFAULT 'COD',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(order_status);

-- Auto-generate order number trigger
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'MM-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(nextval('public.order_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

-- 4. SETTINGS TABLE (single-row pattern)
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT 'Marwad Maratha',
  phone TEXT NOT NULL DEFAULT '+918830257574',
  whatsapp TEXT NOT NULL DEFAULT '+918830257574',
  email TEXT NOT NULL DEFAULT 'durgagurhudyoggondia@gmail.com',
  address TEXT DEFAULT 'Gokuldham Colony, Near Gaurav Furniture, Fulture Peth, Gondia, Maharashtra 441601',
  upi_id TEXT,
  shipping_charge NUMERIC NOT NULL DEFAULT 0,
  free_shipping_above NUMERIC NOT NULL DEFAULT 500,
  is_accepting_orders BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
  ON public.settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.settings (business_name) VALUES ('Marwad Maratha');

-- 5. updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. STORAGE BUCKET for product images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));

-- 7. SEED EXISTING PRODUCTS
INSERT INTO public.products (name, category, price, image_url, description, ingredients, is_popular, alt_text, weight) VALUES
('Aam Aachar', 'aachar', 299, '/images/mango-pickle.jpg', 'Traditional raw mango pickle with authentic Rajasthani spices.', ARRAY['Raw Mango','Mustard Oil','Spices'], true, NULL, '300g'),
('Aam Chunda', 'aachar', 259, '/placeholder.svg', 'Sweet and tangy grated mango pickle.', ARRAY['Raw Mango','Sugar','Spices'], false, NULL, '300g'),
('Aawla Aachar', 'aachar', 279, '/placeholder.svg', 'Nutritious Indian gooseberry pickle.', ARRAY['Amla','Oil','Spices'], false, NULL, '300g'),
('Selvat Aachar', 'aachar', 269, '/placeholder.svg', 'Traditional Selvat style pickle.', ARRAY['Mixed Vegetables','Oil','Spices'], false, NULL, '300g'),
('Nimbu Khatta', 'aachar', 249, '/placeholder.svg', 'Tangy lemon pickle.', ARRAY['Lemon','Oil','Spices'], false, NULL, '300g'),
('Nimbu Mitha', 'aachar', 249, '/placeholder.svg', 'Sweet and sour lemon pickle.', ARRAY['Lemon','Sugar','Spices'], false, 'Khatta Meetha Nimbu Chatani - Marwad Maratha Lemon Pickle', '300g'),
('Ker Aachar', 'aachar', 289, '/placeholder.svg', 'Traditional Ker berry pickle.', ARRAY['Ker Berries','Oil','Spices'], false, NULL, '300g'),
('Ker Sangari', 'aachar', 299, '/placeholder.svg', 'Classic Ker Sangari pickle.', ARRAY['Ker','Sangari','Spices'], false, NULL, '300g'),
('Dana Methi Aachar', 'aachar', 259, '/placeholder.svg', 'Fenugreek seeds pickle.', ARRAY['Fenugreek Seeds','Oil','Spices'], false, NULL, '300g'),
('Mix Aachar', 'aachar', 279, '/placeholder.svg', 'Mixed vegetable pickle.', ARRAY['Mixed Vegetables','Oil','Spices'], false, NULL, '300g'),
('Desi Mirch', 'aachar', 269, '/placeholder.svg', 'Traditional chili pickle.', ARRAY['Local Chilies','Oil','Spices'], false, 'Desi Mirch Aachar Tikha Haraa - Traditional Handmade Green Chilli Pickle', '300g'),
('Aathana Lal Mirch', 'aachar', 259, '/placeholder.svg', 'Red chili pickle.', ARRAY['Red Chilies','Oil','Spices'], false, NULL, '300g'),
('Aathana Hari Mirch', 'aachar', 259, '/placeholder.svg', 'Green chili pickle.', ARRAY['Green Chilies','Oil','Spices'], false, NULL, '300g'),
('Hari Mirch Kuta', 'aachar', 229, '/images/mirchi-pickle.jpg', 'Ground green chili pickle.', ARRAY['Green Chilies','Spices','Oil'], true, 'Athana Green Mirch Aachar - Marwad Maratha Homemade Pickle 300g', '300g'),
('Kathal Aachar', 'aachar', 289, '/placeholder.svg', 'Jackfruit pickle.', ARRAY['Jackfruit','Oil','Spices'], false, NULL, '300g'),
('Haldi Aachar', 'aachar', 269, '/placeholder.svg', 'Turmeric pickle.', ARRAY['Fresh Turmeric','Oil','Spices'], false, NULL, '300g'),
('Lassan Aachar', 'aachar', 249, '/images/garlic-pickle.jpg', 'Spicy garlic pickle.', ARRAY['Garlic','Oil','Spices'], true, 'Lassan Aachar - Marwad Maratha Spicy Garlic Pickle', '300g'),
('Moong Lassan Papad', 'papad', 199, '/placeholder.svg', 'Moong dal papad with garlic flavor.', ARRAY['Moong Dal','Garlic','Spices'], false, NULL, '500g'),
('Moong Panjabi Papad', 'papad', 189, '/placeholder.svg', 'Punjabi style moong dal papad.', ARRAY['Moong Dal','Spices'], false, NULL, '500g'),
('Chana Panjabi Papad', 'papad', 179, '/placeholder.svg', 'Punjabi style chickpea papad.', ARRAY['Chickpea Flour','Spices'], false, NULL, '500g'),
('Sabudana Plain Papad', 'papad', 169, '/placeholder.svg', 'Plain sago papad.', ARRAY['Sago','Salt'], false, NULL, '500g'),
('Aalo Bhagar Sabudana', 'papad', 189, '/placeholder.svg', 'Potato and sago papad.', ARRAY['Sago','Potato','Spices'], false, NULL, '500g'),
('Rice Papad', 'papad', 159, '/images/rice-papad.jpg', 'Traditional rice papad.', ARRAY['Rice Flour','Spices'], false, NULL, '500g'),
('Aawla Powder', 'powder', 299, '/placeholder.svg', 'Dehydrated amla powder.', ARRAY['Dried Amla'], false, NULL, '250g'),
('Aritha Powder', 'powder', 249, '/placeholder.svg', 'Natural hair cleanser powder.', ARRAY['Dried Aritha'], false, NULL, '250g'),
('Shikakai Powder', 'powder', 269, '/placeholder.svg', 'Natural hair care powder.', ARRAY['Dried Shikakai'], false, NULL, '250g'),
('Jamun Powder', 'powder', 319, '/placeholder.svg', 'Dehydrated jamun powder.', ARRAY['Dried Jamun'], false, NULL, '250g'),
('Beetroot Powder', 'powder', 289, '/placeholder.svg', 'Dehydrated beetroot powder.', ARRAY['Dried Beetroot'], false, NULL, '250g'),
('Dana Methi Powder', 'powder', 249, '/placeholder.svg', 'Fenugreek seed powder.', ARRAY['Dried Fenugreek Seeds'], false, NULL, '250g'),
('Mint Powder', 'powder', 279, '/placeholder.svg', 'Dehydrated mint powder.', ARRAY['Dried Mint Leaves'], false, NULL, '250g'),
('Big Bhakarwadi', 'namkeen', 299, '/placeholder.svg', 'Large spiral snack with spicy filling.', ARRAY['Wheat Flour','Spices','Oil'], false, NULL, '400g'),
('Jain Bhakarwadi', 'namkeen', 289, '/placeholder.svg', 'Jain-friendly spiral snack.', ARRAY['Wheat Flour','Jain Spices','Oil'], false, NULL, '400g'),
('Alsi Puri', 'namkeen', 249, '/placeholder.svg', 'Flaxseed crackers.', ARRAY['Flaxseed','Flour','Spices'], false, NULL, '400g'),
('Butter Chakoli', 'namkeen', 269, '/placeholder.svg', 'Butter-flavored spiral snack.', ARRAY['Wheat Flour','Butter','Spices'], false, NULL, '400g'),
('Mix Dal Chakoli', 'namkeen', 259, '/placeholder.svg', 'Mixed lentil spiral snack.', ARRAY['Mixed Lentils','Spices','Oil'], false, NULL, '400g'),
('Potato Chips', 'special', 149, '/images/masala-papad.jpg', 'Crispy hand-cut potato chips.', ARRAY['Potato','Oil','Salt'], true, NULL, '200g'),
('Wheat Kurodi', 'special', 179, '/placeholder.svg', 'Traditional wheat-based crunchy snack.', ARRAY['Wheat Flour','Spices'], true, NULL, '300g'),
('Wheat Sevai', 'special', 169, '/placeholder.svg', 'Traditional wheat vermicelli.', ARRAY['Wheat Flour'], false, NULL, '400g');