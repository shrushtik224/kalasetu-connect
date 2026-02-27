import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Package, IndianRupee, TrendingUp, Calendar, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { getUserProducts } from "@/integrations/supabase/products";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string | null;
  image_url: string | null;
  video_path: string | null;
  status: string;
  created_at: string;
}

const ArtisanMySales = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.id) return;
      try {
        const data = await getUserProducts(user.id);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const activeProducts = products.filter(p => p.status === "published");
  const soldProducts = products.filter(p => p.status === "sold");

  const totalEarnings = soldProducts.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
  const thisMonthProducts = products.filter(p => {
    const created = new Date(p.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  });
  const thisMonthEarnings = thisMonthProducts
    .filter(p => p.status === "sold")
    .reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/artisan/dashboard")}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-serif font-semibold">मेरी बिक्री</h1>
          <p className="text-xs text-muted-foreground">My Sales</p>
        </div>
        <Logo size="sm" showText={false} />
      </header>

      {/* Stats Overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-3 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">कुल सामान</span>
            </div>
            <p className="text-xl font-serif font-bold text-primary">{products.length}</p>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-3 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">सक्रिय</span>
            </div>
            <p className="text-xl font-serif font-bold text-accent">{activeProducts.length}</p>
            <p className="text-xs text-muted-foreground">Active Listings</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <Tabs defaultValue="products" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="products" className="text-xs">
              <Package className="w-3 h-3 mr-1" />
              मेरे सामान
            </TabsTrigger>
            <TabsTrigger value="sold" className="text-xs">
              <IndianRupee className="w-3 h-3 mr-1" />
              बिक्री
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="flex-1 overflow-y-auto space-y-3 mt-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">मेरे उत्पाद</p>
              <p className="text-xs text-muted-foreground">{products.length} products</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">कोई उत्पाद नहीं</p>
                <p className="text-sm text-muted-foreground mt-1">No products yet. Record a video to add your first product!</p>
                <Button
                  onClick={() => navigate("/artisan/record")}
                  className="mt-4 bg-primary"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Record Video
                </Button>
              </motion.div>
            ) : (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-card rounded-xl shadow-soft overflow-hidden"
                >
                  <div className="flex">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-muted">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${product.status === "published"
                              ? "bg-green-100 text-green-700"
                              : product.status === "sold"
                                ? "bg-primary/10 text-primary"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {product.status === "published" ? "सक्रिय" : product.status === "sold" ? "बिक गया" : product.status}
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-serif font-bold text-primary">₹{parseFloat(product.price).toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{formatDate(product.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Sold Items Tab */}
          <TabsContent value="sold" className="flex-1 overflow-y-auto space-y-3 mt-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">बिके हुए सामान</p>
              <p className="text-xs text-muted-foreground">{soldProducts.length} sold</p>
            </div>

            {soldProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">अभी तक कोई बिक्री नहीं</p>
                <p className="text-sm text-muted-foreground mt-1">No sales yet. Your products will appear here once sold.</p>
              </motion.div>
            ) : (
              soldProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-card rounded-xl shadow-soft overflow-hidden"
                >
                  <div className="flex">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-muted">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm font-serif font-bold text-primary">₹{parseFloat(item.price).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtisanMySales;
