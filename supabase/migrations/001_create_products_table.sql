-- Create products table for artisan listings
CREATE TABLE IF NOT EXISTS public.products (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  price decimal(10, 2) NOT NULL,
  description text,
  video_path text,
  image_url text,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only view their own products
CREATE POLICY "Users can view own products"
  ON public.products
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own products
CREATE POLICY "Users can insert own products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own products
CREATE POLICY "Users can update own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can only delete their own products
CREATE POLICY "Users can delete own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = user_id);
