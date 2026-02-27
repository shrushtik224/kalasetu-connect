-- Create orders table to store buyer purchases
CREATE TABLE IF NOT EXISTS public.orders (
  id bigserial PRIMARY KEY,
  buyer_id uuid NOT NULL,
  product_id bigint NOT NULL,
  artisan_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total_price decimal(10, 2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_buyer_id FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT fk_artisan_id FOREIGN KEY (artisan_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_artisan_id ON public.orders(artisan_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders (as buyer or artisan)
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = artisan_id);

-- Buyers can insert their own orders
CREATE POLICY "Buyers can insert own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Artisans can update order status
CREATE POLICY "Artisans can update own order status"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = artisan_id);
