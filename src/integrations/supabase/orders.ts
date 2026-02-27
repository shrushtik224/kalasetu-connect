import { supabase } from "./client";

/**
 * Create a new order
 * DB schema: orders(id, buyer_id, product_id, quantity, total_amount, order_status, created_at, updated_at)
 */
export const createOrder = async (
  buyerId: string,
  productId: number,
  artisanId: string,
  totalPrice: number | string,
  quantity: number = 1
) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        buyer_id: buyerId,
        customer_id: buyerId, // Using both just in case
        product_id: productId,
        quantity,
        total_amount: totalPrice,
        order_status: "pending",
      } as any)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Create a notification for the artisan when an order is placed
 */
export const createOrderNotification = async (
  artisanId: string,
  orderId: number,
  productName: string,
  buyerName: string = "A customer"
) => {
  try {
    const message = `🛒 New order from ${buyerName} for "${productName}"`;

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        artisan_id: artisanId,
        order_id: orderId,
        message,
        status: "unread",
      } as any)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Get notifications for an artisan
 */
export const getArtisanNotifications = async (artisanId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(`
        *,
        orders:order_id (
          id,
          buyer_id,
          product_id,
          total_price:total_amount,
          status:order_status,
          created_at,
          products:product_id (
            id,
            name,
            price,
            image_url
          )
        )
      `)
      .eq("artisan_id", artisanId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as any;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({
        status: "read",
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Update order status (e.g., mark as shipped)
 */
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Get orders for an artisan (all orders for their products)
 */
export const getArtisanOrders = async (artisanId: string) => {
  try {
    // Since artisan_id is not in orders, we filter by joining with products
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products:product_id!inner (*)
      `)
      .eq("products.user_id", artisanId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching artisan orders:", error);
    throw error;
  }
};

/**
 * Get unread notification count for artisan
 */
export const getUnreadNotificationCount = async (artisanId: string) => {
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("artisan_id", artisanId)
      .eq("status", "unread");

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    throw error;
  }
};
