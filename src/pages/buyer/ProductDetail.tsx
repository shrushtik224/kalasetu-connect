import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Shield,
  Leaf,
  CheckCircle,
  X,
  Loader2,
  MapPin,
  Star,
  ShoppingCart,
  Package,
  Truck,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  createOrder,
  createOrderNotification,
} from "@/integrations/supabase/orders";
import { getProductById } from "@/integrations/supabase/products";
import artisanPortrait from "@/assets/artisan-portrait.jpg";

interface ProductData {
  id: number;
  name: string;
  price: string;
  description: string;
  image_url: string | null;
  user_id: string;
  status: string;
  created_at: string;
}

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(parseInt(id));
        setProduct(data as any);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/buyer");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const price = product ? parseFloat(product.price) : 0;
  const artisanShare = Math.round(price * 0.9);
  const logistics = Math.round(price * 0.05);
  const platformFee = price - artisanShare - logistics;

  const priceBreakdown = [
    {
      label: "Artisan",
      amount: artisanShare,
      percentage: 90,
      color: "#e97320",
    },
    { label: "India Post Logistics", amount: logistics, percentage: 5, color: "#a16207" },
    { label: "KalaSetu Platform Fee", amount: platformFee, percentage: 5, color: "#f59e0b" },
  ];

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login as a buyer to place an order",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    setIsProcessing(true);
    try {
      // Create the order
      const order = await createOrder(
        user.id,
        product.id,
        product.user_id,
        price,
        1
      );

      // Create notification for the artisan
      await createOrderNotification(
        product.user_id,
        order.id,
        product.name,
        user.email?.split("@")[0] || "A customer"
      );

      setOrderPlaced(true);

      toast({
        title: "🎉 Order Placed Successfully!",
        description: `The artisan has been notified about your order for "${product.name}".`,
      });

      // Return to buyer feed after 3s
      setTimeout(() => {
        navigate("/buyer");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Package className="w-12 h-12 text-gray-300" />
          <p className="text-gray-500">Product not found</p>
          <Button onClick={() => navigate("/buyer")} variant="outline">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/buyer")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-serif text-base text-gray-800">Product Details</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
              />
            </button>
            <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Share2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-28">
        {/* Product Image */}
        <div className="relative aspect-square bg-white">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm">
              <CheckCircle className="w-3 h-3" />
              Verified Artisan
            </div>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm">
              <Leaf className="w-3 h-3 text-green-500" />
              Handmade
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4 mt-4">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-serif text-xl text-gray-900 font-bold mb-1">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-orange-600">
              ₹{price.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">4.0 (12 reviews)</span>
            </div>
          </motion.div>

          {/* Artisan Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-200">
              <img
                src={artisanPortrait}
                alt="Artisan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-gray-800">
                  KalaSetu Artisan
                </span>
                <Badge className="bg-green-100 text-green-700 border-0 text-[10px] px-1.5 py-0">
                  <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                India
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <h3 className="font-serif text-sm font-semibold text-gray-800 mb-2">
              About this Product
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description || "A beautiful handcrafted piece made with love by a skilled Indian artisan. Each piece is unique and carries the artisan's signature style."}
            </p>
          </motion.div>

          {/* Transparent Pricing Widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <h3 className="font-serif text-sm font-semibold text-gray-800 mb-3">
              Where Your Money Goes
            </h3>

            <div className="space-y-2.5">
              {priceBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-800">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="mt-1 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
              <span className="text-xs font-medium text-gray-600">Total</span>
              <span className="text-sm font-bold text-gray-900">
                ₹{price.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-3 gap-2"
          >
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <Shield className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-gray-700">Verified Origin</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <Leaf className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-gray-700">100% Handmade</p>
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <Truck className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-gray-700">Free Delivery</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Sticky Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] text-gray-500">Total Price</p>
            <p className="text-lg font-bold text-orange-600">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
          <Button
            onClick={() => setShowCheckout(true)}
            className="flex-1 h-12 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Place Order
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => !isProcessing && setShowCheckout(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white w-full max-w-md rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {orderPlaced ? (
              /* Success State */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Order Placed! 🎉
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  Your order for "{product.name}" has been confirmed.
                </p>
                <p className="text-xs text-gray-400">
                  The artisan has been notified and will start preparing your order.
                </p>
                <div className="mt-4 px-4 py-2 bg-orange-50 rounded-xl">
                  <p className="text-[10px] text-orange-600">
                    🔔 A notification has been sent to the artisan
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Checkout Form */
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Confirm Order
                  </h3>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="flex gap-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        by KalaSetu Artisan
                      </p>
                      <p className="text-base font-bold text-orange-600 mt-1">
                        ₹{price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <p className="text-xs font-medium text-gray-700">
                      Shipping via India Post
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-500 ml-6">
                    Estimated delivery: 7-10 business days
                  </p>
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Pay ₹{price.toLocaleString("en-IN")}
                    </>
                  )}
                </Button>

                <p className="text-center text-[10px] text-gray-400 mt-3">
                  🔒 Secure payment • 🔔 Artisan will be notified instantly
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;
