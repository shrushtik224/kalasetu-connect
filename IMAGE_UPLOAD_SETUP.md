# Image Upload Setup Guide

## Overview
Artisans can now select product images from their gallery when listing products manually. Images are uploaded to Supabase Storage and linked to product records.

## What Changed

### ManualListing.tsx Updates:
- ✅ Image picker with gallery selection
- ✅ Image preview display
- ✅ Remove image button
- ✅ Image validation (type & size)
- ✅ Automatic image upload to Supabase Storage
- ✅ Image URL saved with product in database

### New Storage Bucket:
- `product_images` - Stores all artisan product images

---

## Setup Instructions

### Step 1: Create Storage Bucket

Open [Supabase Dashboard](https://app.supabase.com) → Your Project

**Two Options:**

#### Option A: Using SQL Editor (Recommended)
1. Go to **SQL Editor** → Click **New Query**
2. Copy and paste the contents of:
   `supabase/migrations/002_create_product_images_bucket.sql`
3. Click **Run**

#### Option B: Manual Creation
1. Go to **Storage** in left sidebar
2. Click **Create a new bucket**
3. Name it: `product_images`
4. Set it to **Public** (allow public reads)
5. Click **Create**

### Step 2: Set Storage Policies

If you created manually, add these policies:

1. Click on `product_images` bucket
2. Go to **Policies** tab
3. Add three policies:

```sql
-- Policy 1: Public Access (Anyone can view)
CREATE POLICY "Public Access - Images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product_images');

-- Policy 2: Authenticated Upload (Users can upload)
CREATE POLICY "Authenticated Upload - Images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product_images' AND
    auth.role() = 'authenticated'
  );

-- Policy 3: User Delete (Users can delete their own)
CREATE POLICY "User Delete - Images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product_images' AND
    auth.uid() = owner
  );
```

### Step 3: Verify Setup
1. Go to **Storage** → `product_images`
2. Should see green checkmark and "Public" label
3. Ready to use!

---

## How It Works

### User Flow:

```
1. Artisan opens "विवरण लिखें" (Manual Listing)
2. Click on image box or upload area
3. Select image from device gallery
4. See preview of selected image
5. Can click X button to remove image
6. Fill in name, price, description
7. Click "लिस्ट करें" (List Item)
8. Image uploaded to Storage
9. Product saved to database with image URL
10. Success toast shown
```

### Validation:
- **File Type**: Only images accepted (JPG, PNG, GIF, etc.)
- **File Size**: Maximum 5MB per image
- **Error Messages**: User-friendly Hindi/English toasts
- **Status**: Loading state during upload

---

## File Details

### Key Functions:

#### handleImageSelect
- Triggered when user picks a file
- Validates file type (must be image)
- Validates file size (max 5MB)
- Creates data URL preview
- Shows error toast if validation fails

#### handleRemoveImage
- Clears selected image
- Removes preview
- Resets file input

#### uploadImage
- Uploads file to Supabase Storage
- Path: `user_id/timestamp_filename`
- Returns public URL
- Throws error if upload fails

#### handleSubmit
- Upload image first (if selected)
- Then save product with image URL
- Shows success/error toast
- Navigates to dashboard on success

---

## Database Integration

Products table now uses:
```typescript
image_url: string | null
```

When product is saved:
```typescript
await insertProduct(user.id, {
  name: productName,
  price: parseFloat(price),
  description: description,
  image_url: imageUrl,  // ← Includes image URL if uploaded
  status: "published"
});
```

---

## Testing

### Test Image Upload:

1. **Login** as artisan
2. Go to **"विवरण लिखें"** (Manual Listing)
3. Click image area
4. Select an image from your device
5. See image preview with X button
6. Fill in: Name, Price, Description
7. Click **"लिस्ट करें"** (List Item)
8. Wait for upload... loading state
9. See success toast
10. Check Supabase:
    - **Storage** → `product_images` → see uploaded image
    - **Database** → `products` table → see image_url filled in

### Test Image Removal:

1. After selecting image, click **X** button
2. Image preview should disappear
3. Box returns to upload state
4. Submit without image (works fine)

### Test Validation:

1. Try uploading non-image file (PDF, etc.)
   - Should see error: "Please select an image file"
2. Try uploading image > 5MB
   - Should see error: "Image size should be less than 5MB"

---

## Error Handling

| Scenario | Message |
|----------|---------|
| Non-image file | "Please select an image file (JPG, PNG, etc.)" |
| File > 5MB | "Image size should be less than 5MB" |
| Storage bucket missing | "Failed to upload image. Please try again." |
| Network error | Same as above + check console |
| Not authenticated | "User not authenticated. Please login again." |
| Database error | "Failed to list product. Please try again." |

---

## Storage Folder Structure

```
product_images/
├── user_id_1/
│   ├── 1708345600000_photo.jpg
│   ├── 1708345610000_craft.png
│   └── ...
├── user_id_2/
│   ├── 1708345800000_item.jpg
│   └── ...
└── ...
```

Each image path: `{user_id}/{timestamp}_{original_filename}`

---

## Image Constraints

- **Max Size**: 5MB
- **Allowed Types**: JPG, PNG, GIF, WebP, SVG, etc.
- **Storage**: Unlimited (depends on Supabase plan)
- **Public**: Yes - anyone can view images via URL
- **Bandwidth**: Counted against Supabase limits

---

## Optional Enhancements

1. **Image Compression**: Reduce file size before upload
2. **Crop Tool**: Let users crop images
3. **Multiple Images**: Allow 3-4 images per product
4. **Image Gallery**: Show product images in buyer feed
5. **Thumbnail Generation**: Auto-create thumbnails
6. **CDN Caching**: Use Supabase CDN for faster loads

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bucket doesn't exist error | Run migration from Step 1 |
| "Not authorized" upload | Check storage policies are set |
| Image not showing | Check bucket is public |
| Image upload slow | May be network or large file |
| Image appears broken | Check permissions in storage |

---

## File Changes Summary

**New Files:**
- `supabase/migrations/002_create_product_images_bucket.sql`
- `IMAGE_UPLOAD_SETUP.md` (this file)

**Updated Files:**
- `src/pages/artisan/ManualListing.tsx`
  - Added image picker
  - Added image preview
  - Added image validation
  - Added image upload function
  - Updated submit handler

---

## Next Steps

1. ✅ Run storage bucket migration
2. ✅ Verify bucket is created
3. ✅ Test image selection and upload
4. ✅ Check Supabase Storage for uploaded images
5. 📊 View products with images in dashboard
6. 🎨 Consider adding image display in buyer feed

---

**Setup Complete! Artisans can now upload product images. 🎉**
