-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT DO NOTHING;

-- Make images bucket public for reading
CREATE POLICY "Public Access - Images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload - Images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own images
CREATE POLICY "User Delete - Images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );
