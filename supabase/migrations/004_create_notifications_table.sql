-- Create notifications table for artisan notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id bigserial PRIMARY KEY,
  artisan_id uuid NOT NULL,
  order_id bigint NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_at timestamp with time zone,
  CONSTRAINT fk_artisan_id FOREIGN KEY (artisan_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_artisan_id ON public.notifications(artisan_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON public.notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Artisans can view their own notifications
CREATE POLICY "Artisans can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = artisan_id);

-- System can insert notifications (we'll use service role for this)
CREATE POLICY "Enable insert for all users"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Artisans can update their own notifications (mark as read)
CREATE POLICY "Artisans can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = artisan_id);
