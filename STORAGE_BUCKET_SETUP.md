# 🔧 Product Image Storage - Complete Setup Guide

## The Problem
You're getting "Failed to upload image" error because the storage bucket for product images doesn't exist in your Supabase project yet.

## ✅ Solution: Create Storage Bucket

### METHOD 1: Using Supabase Dashboard (EASIEST - Do This!)

**Step 1: Go to Supabase Dashboard**
- Open: https://app.supabase.com
- Select your project (KalaSetu)
- Click **Storage** in the left sidebar

**Step 2: Create New Bucket**
- Click the **"Create a new bucket"** button
- A dialog box will appear
- Enter bucket name: `product_images` (exactly this)
- **IMPORTANT**: Toggle **Make it public** to ON (this allows image viewing)
- Click **Create bucket**

You should see:
```
✓ product_images [Public]
```

**Step 3: Set Storage Policies**

1. Click on the `product_images` bucket
2. Click on the **Policies** tab at the top
3. Click **"Create Policy"** button

**Add Policy 1: Public Read Access**
```
Policy name: Public Read Access
Expression:

bucket_id = 'product_images'
```
- Click on SQL template dropdown and select **SELECT**
- Copy the expression above
- Click **Review**
- Click **Save policy**

**Add Policy 2: Authenticated Users Can Upload**
```
Policy name: Auth Users Upload
Targets: INSERT

auth.role() = 'authenticated'
```
- Click on SQL template and select **INSERT**
- Make sure it allows anyone authenticated to upload
- Click **Review** → **Save policy**

---

### METHOD 2: Using SQL (If Dashboard Method Doesn't Work)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy-paste this entire SQL:

```sql
-- Create public bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow public read access
CREATE POLICY "Public Read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product_images');

-- Policy 2: Allow authenticated upload
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product_images' AND
    auth.role() = 'authenticated'
  );

-- Policy 3: Allow delete own files
CREATE POLICY "User Delete Own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product_images' AND
    auth.uid() = owner
  );
```

4. Click **Run**

You should see: "Query executed successfully"

---

## ✅ Verification Steps

After creating bucket, verify it's working:

### Step 1: Check Bucket Exists
1. Go to **Storage** in Supabase
2. You should see `product_images` listed
3. It should show **Public** label next to it

### Step 2: Check Policies
1. Click on `product_images` bucket
2. Go to **Policies** tab
3. You should see at least 2-3 policies listed:
   - ✅ Public Read Access / Public Read
   - ✅ Authenticated Upload / Auth Users Upload
   - ✅ User Delete Own (optional)

### Step 3: Test in App
1. Go back to your KalaSetu app
2. Login as artisan
3. Go to **"विवरण लिखें"** (Manual Listing)
4. Click image area
5. Select an image from your device
6. Try uploading
7. Should now work! ✅

---

## 🆘 Troubleshooting

### Error: "Failed to upload image"

**Check 1: Bucket Exists?**
```
Storage → product_images listed? 
- No → Create it (follow steps above)
- Yes → Continue to Check 2
```

**Check 2: Bucket is Public?**
```
Storage → product_images → [Public] label visible?
- No → Click bucket name → Toggle "Make it public"
- Yes → Continue to Check 3
```

**Check 3: Policies Exist?**
```
Storage → product_images → Policies tab
- See INSERT policy? (for upload permission)
- See SELECT policy? (for public read)
- No → Add policies from SQL above
- Yes → Continue to Check 4
```

**Check 4: Authenticated User?**
```
- Logged in as artisan?
- Yes → Try uploading again
- No → Login first
```

**Check 5: Image File Valid?**
```
- Image file format? (JPG, PNG, etc.)
- File size < 5MB?
- Not valid → Select different image
```

---

## 📋 Bucket Configuration Checklist

Use this to verify everything is set up:

```
☐ Bucket Name: product_images
☐ Bucket Status: Public ✓
☐ Policy 1: SELECT (public read)
☐ Policy 2: INSERT (authenticated upload)
☐ Policy 3: DELETE (user delete own)
☐ Tested image upload: Works ✓
```

---

## 📸 Expected Behavior After Setup

### When uploading image:

1. Select image → See preview ✓
2. Click "List Item" → Upload starts (loading state)
3. Image uploads to: `product_images/{user_id}/{timestamp}_{filename}`
4. Image URL saved in database
5. Success toast appears
6. Redirect to dashboard

### In Supabase Storage:
```
product_images/
├── c1234567-89ab-cdef/ (your user ID)
│   ├── 1708345600000_photo.jpg
│   └── 1708345610000_craft.png
└── ...
```

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://app.supabase.com
- **Project Settings**: https://app.supabase.com/project/_/settings/general
- **Storage**: https://app.supabase.com/project/_/storage/buckets
- **SQL Editor**: https://app.supabase.com/project/_/sql

(Replace _ with your project ID)

---

## 💡 Why It's Needed

Your app code tries to upload images to `product_images` bucket, but if the bucket doesn't exist:

```
App tries: supabase.storage.from("product_images").upload(...)
         ↓
         Bucket missing!
         ↓
         Error: "Failed to upload image"
```

Once you create the bucket with proper policies, the upload will work perfectly!

---

## ✨ Next: Test It!

After step-by-step setup above:

1. **Reload** your app (F5)
2. **Login** as artisan
3. Go to **Manual Listing**
4. **Select image** from gallery
5. **Fill details** (name, price, description)
6. **Click "List Item"**
7. **Wait for upload** ⏳
8. **See success** ✅

If you see success toast and image appears in Supabase Storage → You're done! 🎉

---

## 📞 Still Stuck?

If error persists after setup:

1. **Check browser console** (F12 → Console tab for error details)
2. **Verify bucket name** is exactly: `product_images` (lowercase)
3. **Check policies** are saved (refresh page)
4. **Try different image** (smaller, different format)
5. **Restart app** (refresh browser)

Post the exact error message from console if you need more help!

---

**Follow these steps and the image upload will work perfectly! 🚀**
