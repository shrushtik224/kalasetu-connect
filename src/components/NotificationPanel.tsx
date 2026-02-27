import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  getArtisanNotifications,
  markNotificationAsRead,
  updateOrderStatus,
  getUnreadNotificationCount,
} from "@/integrations/supabase/orders";

import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: number;
  artisan_id: string;
  order_id: number;
  message: string;
  status: string;
  created_at: string;
  read_at: string | null;
  orders?: {
    id: number;
    buyer_id: string;
    product_id: number;
    total_price: string;
    status: string;
    created_at: string;
    products?: {
      id: number;
      name: string;
      price: string;
      image_url: string;
    };
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState<number | null>(null);
  const [shippingOrder, setShippingOrder] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();

      // Set up real-time subscription for notifications
      const channel = supabase
        .channel('notification-panel-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `artisan_id=eq.${user.id}`,
          },
          () => {
            // Reload notifications when any change occurs
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, user]);

  const loadNotifications = async () => {
    if (!user) return;

    // Only show loading on initial load, not on real-time refresh to avoid flickering
    if (notifications.length === 0) setLoading(true);
    try {
      const data = await getArtisanNotifications(user.id);
      setNotifications((data as any) || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, status: "read" } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const handleShipOrder = async (orderId: number, notificationId: number) => {
    setShippingOrder(orderId);
    try {
      await updateOrderStatus(orderId, "shipped");
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId
            ? {
              ...n,
              orders: n.orders ? { ...n.orders, status: "shipped" } : n.orders,
            }
            : n
        )
      );
      toast({
        title: "Success!",
        description: "Order marked as shipped successfully",
      });
      setExpandedNotification(null);
    } catch (error) {
      console.error("Error shipping order:", error);
      toast({
        title: "Error",
        description: "Failed to mark order as shipped",
        variant: "destructive"
      });
    } finally {
      setShippingOrder(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-elevated z-40 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-lg text-foreground">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32">
                <Bell className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg border p-3 cursor-pointer transition-all ${notification.status === "unread"
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/50 border-transparent hover:border-border"
                      }`}
                    onClick={() => {
                      setExpandedNotification(
                        expandedNotification === notification.id ? null : notification.id
                      );
                      if (notification.status === "unread") {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                  >
                    {/* Notification Summary */}
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {notification.status === "unread" && (
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />
                      )}
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedNotification === notification.id && notification.orders && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-border space-y-2"
                        >
                          {/* Product Info */}
                          {notification.orders.products && (
                            <div className="flex gap-2">
                              {notification.orders.products.image_url && (
                                <img
                                  src={notification.orders.products.image_url}
                                  alt={notification.orders.products.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {notification.orders.products.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ₹{notification.orders.total_price}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Order Status */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3" />
                            <span>
                              Status:{" "}
                              <span className="capitalize font-medium text-foreground">
                                {notification.orders.status}
                              </span>
                            </span>
                          </div>

                          {/* Action Button - Show "Ship" button only if order status is still "pending" */}
                          {notification.orders.status === "pending" && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShipOrder(notification.orders!.id, notification.id);
                              }}
                              disabled={shippingOrder === notification.orders.id}
                              className="w-full mt-3 py-2 px-3 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                            >
                              {shippingOrder === notification.orders.id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Truck className="w-4 h-4" />
                                  Product Shipped Successfully
                                </>
                              )}
                            </motion.button>
                          )}

                          {notification.orders.status === "shipped" && (
                            <div className="w-full mt-3 py-2 px-3 rounded-lg bg-success/10 text-success text-sm font-medium flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              Shipped
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <Button
              onClick={loadNotifications}
              variant="outline"
              className="w-full"
            >
              Refresh
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
