import { supabase } from "./client";
import { TablesInsert } from "./types";

export interface ProductData {
  name: string;
  price: number | string;
  description: string;
  video_path?: string;
  image_url?: string;
  imageFile?: File;
  status?: string;
}

/**
 * Upload a product image to Supabase storage
 */
export const uploadProductImage = async (file: File) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product_images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Insert a product into the database
 * @param userId - User ID of the artisan
 * @param productData - Product information to save
 * @returns The inserted product record or null if failed
 */
export const insertProduct = async (
  userId: string,
  productData: ProductData
) => {
  try {
    let imageUrl = productData.image_url;

    if (productData.imageFile) {
      imageUrl = await uploadProductImage(productData.imageFile);
    }

    const insertData: TablesInsert<"products"> = {
      user_id: userId,
      name: productData.name,
      price: String(productData.price),
      description: productData.description || "",
      video_path: productData.video_path || null,
      image_url: imageUrl || null,
      status: productData.status || "published",
    };

    const { data, error } = await supabase
      .from("products")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Error inserting product:", error);
      throw new Error(error.message || "Failed to save product to database");
    }

    console.log("Product saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in insertProduct:", error);
    throw error;
  }
};

/**
 * Fetch products by user ID
 */
export const getUserProducts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch products");
    }

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Fetch all published products (for buyer feed)
 */
export const getAllPublishedProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch products");
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching published products:", error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (productId: number) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      throw new Error(error.message || "Product not found");
    }

    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

/**
 * Update a product
 */
export const updateProduct = async (
  productId: number,
  productData: Partial<ProductData>
) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update product");
    }

    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: number) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw new Error(error.message || "Failed to delete product");
    }

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
