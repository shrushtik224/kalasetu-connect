import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Video,
  ShoppingBag,
  User,
  PenTool,
  Bell,
  Sparkles,
  TrendingUp,
  Package,
  ArrowRight,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import NotificationPanel from "@/components/NotificationPanel";
import artisanPortrait from "@/assets/artisan-portrait.jpg";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getUnreadNotificationCount } from "@/integrations/supabase/orders";
import { getUserProducts } from "@/integrations/supabase/products";
import { useLanguage } from "@/contexts/LanguageContext";

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }

      try {
        const count = await getUnreadNotificationCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }

      try {
        const products = await getUserProducts(user.id);
        setProductCount(products?.length || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProfile();

    // Set up real-time subscription for notifications
    if (user) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `artisan_id=eq.${user.id}`,
          },
          async () => {
            // Refresh count when any change occurs
            const count = await getUnreadNotificationCount(user.id);
            setUnreadCount(count);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/artisan-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Header */}
        <header className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <Logo size="sm" showText={false} />
            <div className="flex items-center gap-2">
              {/* Notification Bell / Close Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
                className="relative w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center hover:bg-white/80 transition-all z-50"
              >
                {notificationsPanelOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-700" />
                )}
                {!notificationsPanelOpen && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Profile Avatar */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/artisan/profile")}
                className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/60 shadow-md"
              >
                <img
                  src={profile?.avatar_url || artisanPortrait}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.button>
            </div>
          </div>

          {/* Greeting Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-5"
          >
            <p className="text-sm text-gray-500 font-medium">{greeting()} 🙏</p>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
              {profile?.full_name || "Artisan"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {profile?.location || "India"} • KalaSetu कलाकार
            </p>
          </motion.div>
        </header>

        {/* Stats Banner */}
        <section className="px-5 mt-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 p-[1px] shadow-xl"
          >
            <div className="rounded-3xl bg-gradient-to-r from-amber-600/95 via-orange-600/95 to-red-500/95 backdrop-blur-xl p-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg font-serif font-bold text-white">₹12.4K</p>
                  <p className="text-[10px] text-white/70 mt-0.5">{t.thisMonth}</p>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xl font-serif font-bold text-white">{productCount}</p>
                  <p className="text-[10px] text-white/70 mt-0.5">{t.products}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xl font-serif font-bold text-white">4.8</p>
                  <p className="text-[10px] text-white/70 mt-0.5">{t.rating}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick Actions */}
        <section className="px-5 mt-6 flex-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1"
          >
            {t.quickActions}
          </motion.p>

          <div className="grid grid-cols-1 gap-3">
            {/* Record Video — Primary CTA */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/artisan/record")}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-lg font-serif font-bold text-white">
                    {t.sellNewItem}
                  </p>
                  <p className="text-xs text-white/80 mt-0.5">
                    {t.recordVideoSell}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            {/* Manual Entry + Price Estimator Row */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/artisan/manual")}
                className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 p-4 shadow-md hover:shadow-lg hover:bg-white/90 transition-all"
              >
                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-orange-100/60 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-3 shadow-md">
                    <PenTool className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 text-left">
                    {t.manualListing}
                  </p>
                  <p className="text-[11px] text-gray-500 text-left mt-0.5">
                    {t.manualListingDesc}
                  </p>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/artisan/price-estimator")}
                className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 p-4 shadow-md hover:shadow-lg hover:bg-white/90 transition-all"
              >
                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-amber-100/60 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3 shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 text-left">
                    {t.priceEstimator}
                  </p>
                  <p className="text-[11px] text-gray-500 text-left mt-0.5">
                    {t.aiPriceEstimate}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* My Sales Banner */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/artisan/my-sales")}
              className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 p-4 shadow-md hover:shadow-lg hover:bg-white/90 transition-all"
            >
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-emerald-100/50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-gray-800">
                    {t.viewSales}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {t.viewAllProducts}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </section>

        {/* Bottom Navigation */}
        <nav className="mt-4 pb-4 px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg py-3 px-6"
          >
            <div className="flex justify-around">
              <button
                onClick={() => navigate("/artisan/dashboard")}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-orange-600">
                  {t.home}
                </span>
              </button>
              <button
                onClick={() => navigate("/artisan/my-sales")}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-[10px] text-gray-400">{t.sales}</span>
              </button>
              <button
                onClick={() => navigate("/artisan/record")}
                className="flex flex-col items-center gap-1 -mt-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-orange-600">
                  {t.record}
                </span>
              </button>
              <button
                onClick={() => navigate("/artisan/price-estimator")}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-[10px] text-gray-400">{t.priceAI}</span>
              </button>
              <button
                onClick={() => navigate("/artisan/profile")}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-[10px] text-gray-400">{t.profile}</span>
              </button>
            </div>
          </motion.div>
        </nav>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
      />
    </div>
  );
};

export default ArtisanDashboard;
