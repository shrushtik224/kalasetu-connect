# KalaSetu - Database Setup & Implementation Guide

## ✅ What's Been Implemented

Your artisan product uploads are now fully integrated with the Supabase database. Here's what was set up:

### 1. **Database Schema** 
Created a `products` table with the following fields:
- `id`: Unique product identifier
- `user_id`: Artisan's user ID (linked to auth.users)
- `name`: Product name
- `price`: Product price (decimal)
- `description`: Full product description
- `video_path`: Path to uploaded video file (optional)
- `image_url`: URL to product image (optional)
- `status`: Product status (draft/published/archived)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### 2. **Security Features**
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only view/create/edit/delete their own products
- ✅ Foreign key constraint: Products linked to authenticated users
- ✅ Automatic timestamps for tracking

### 3. **Product Upload Flows**

#### Flow 1: Manual Listing
```
ManualListing page → User enters details → Click "List Item" 
→ Product saved to database → Navigate to dashboard
```

#### Flow 2: Video Recording
```
RecordingScreen → Video uploaded to storage → Transcribed to text 
→ ProcessingScreen → Extract data → ListingReview page 
→ User reviews/edits → Click "Confirm & Publish" 
→ Product saved to database → Navigate to dashboard
```

### 4. **Key Files Modified/Created**

#### New Files:
- `supabase/migrations/001_create_products_table.sql` - Database schema
- `src/integrations/supabase/products.ts` - Product utility functions

#### Updated Files:
- `src/integrations/supabase/types.ts` - Added products table types
- `src/pages/artisan/ManualListing.tsx` - Database insert on submit
- `src/pages/artisan/ListingReview.tsx` - Database insert on publish

---

## 🚀 Setup Instructions

### Step 1: Run the Database Migration

You have two options to create the products table:

**Option A: Using Supabase SQL Editor (Recommended)**
1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy the entire contents of `supabase/migrations/001_create_products_table.sql`
5. Click "Run" to execute

**Option B: Using Terminal (if Supabase CLI is installed)**
```bash
supabase db push
```

### Step 2: Verify in Supabase
1. Go to your Supabase dashboard
2. Click on "Tables" in the left sidebar
3. You should see the `products` table with all the columns listed above
4. Check "Authentication" > "Policies" to verify RLS policies are enabled

---

## 📝 How to Use

### Manual Listing Flow:
1. Artisan navigates to "विवरण लिखें" (Enter Details)
2. Fills in product name, price, and description
3. Clicks "लिस्ट करें" (List Item)
4. Product is automatically saved to database
5. Success message shows

### Video Recording Flow:
1. Artisan records product video
2. Video is uploaded and transcribed
3. AI extracts product details (name, price, description)
4. Artisan reviews the extracted data on the Review page
5. Can edit any field before publishing
6. Clicks "हाँ, यह सही है" (Yes, Confirm & Publish)
7. Product is saved to database

---

## 🧪 Testing

### Test Manual Listing:
```
1. Login as artisan
2. Go to Create New Listing
3. Fill in: Name="Test Product", Price="500", Description="Test item"
4. Click "List Item"
5. Verify success toast appears
6. Check Supabase dashboard > products table
7. New row should appear with your data
```

### Test Video Recording:
```
1. Login as artisan
2. Go to Record Product
3. Record a short video (say "This is a 100 rupee item")
4. Wait for transcription
5. Review and edit details if needed
6. Click "Yes, Confirm & Publish"
7. Verify success toast and product appears in dashboard
8. Check Supabase products table for the new entry
```

---

## 🔍 Accessing Stored Products

To view products in your dashboard, you can extend the ArtisanDashboard component:

```typescript
import { getUserProducts } from "@/integrations/supabase/products";

// In your dashboard component:
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const data = await getUserProducts(user.id);
    setProducts(data);
  };
  
  if (user?.id) fetchProducts();
}, [user?.id]);
```

---

## 🛠️ Product Management Functions

The `src/integrations/supabase/products.ts` file provides these functions:

### Insert Product
```typescript
import { insertProduct } from "@/integrations/supabase/products";

await insertProduct(userId, {
  name: "Product Name",
  price: 500,
  description: "Product description",
  video_path: "path/to/video.mp4",
  image_url: "path/to/image.jpg",
  status: "published"
});
```

### Get User Products
```typescript
import { getUserProducts } from "@/integrations/supabase/products";

const products = await getUserProducts(userId);
```

### Update Product
```typescript
import { updateProduct } from "@/integrations/supabase/products";

await updateProduct(productId, {
  name: "Updated Name",
  price: 600
});
```

### Delete Product
```typescript
import { deleteProduct } from "@/integrations/supabase/products";

await deleteProduct(productId);
```

---

## ⚠️ Important Notes

1. **User Authentication**: Products are automatically linked to the logged-in user's ID
2. **RLS Security**: Each user can only see their own products
3. **Error Handling**: Check browser console for detailed error messages
4. **Storage Buckets**: Ensure "videos" bucket exists in Supabase Storage
5. **Timestamps**: `created_at` and `updated_at` are automatically managed by Supabase

---

## 🐛 Troubleshooting

### Error: "Missing Supabase URL or Key"
- Check your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the development server

### Error: "Unauthorized" on product insert
- Verify RLS policies are enabled on the products table
- Check that user is authenticated before calling insert

### Error: "Table does not exist"
- Run the SQL migration from `supabase/migrations/001_create_products_table.sql`
- Verify in Supabase dashboard that the table was created

### Products not showing up
- Check Supabase dashboard > products table
- Verify the user_id matches your authenticated user ID
- Check browser console for any JavaScript errors

---

## 📊 Database Diagram

```
auth.users
    ↓ (one-to-many)
products
    - id (primary key)
    - user_id (foreign key → auth.users.id)
    - name
    - price
    - description
    - video_path
    - image_url
    - status
    - created_at
    - updated_at
```

---

## ✨ Next Steps (Optional Enhancements)

1. **Dashboard Display**: Show artisan's products in ArtisanDashboard
2. **Product Editing**: Add edit functionality for existing products
3. **Product Analytics**: Track views, likes, and sales
4. **Buyer Feed**: Display products from all artisans for buyers to browse
5. **Inventory Management**: Add stock tracking for products
6. **Order Management**: Track orders and sales

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error details
2. Verify Supabase credentials in `.env` file
3. Ensure database migrations were run successfully
4. Check user authentication status
5. Review RLS policies on products table

---

**Setup Complete! Your products are now being saved to the database. 🎉**
