import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Share2,
  ChevronLeft,
  ShoppingCart,
  Search,
  MapPin,
  Star,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import artisanPortrait from "@/assets/artisan-portrait.jpg";
import { getAllPublishedProducts } from "@/integrations/supabase/products";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image_url: string | null;
  user_id: string;
  status: string;
  created_at: string;
}

const BuyerFeed = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllPublishedProducts();
      setProducts((data as any) || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedItems(newLiked);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <Logo size="sm" showText={false} />
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search handcrafted products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {["All", "Pottery", "Textiles", "Painting", "Jewelry", "Woodwork"].map(
            (cat, i) => (
              <button
                key={cat}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${i === 0
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                  }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-xs text-gray-400 mt-1">
              Check back soon for new handcrafted items!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => navigate(`/buyer/product/${product.id}`)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-10 h-10 text-gray-300" />
                    </div>
                  )}

                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleLike(e, product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-4 h-4 ${likedItems.has(product.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                        }`}
                    />
                  </button>

                  {/* Verified Badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Handmade
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                    {product.description || "Handcrafted with love"}
                  </p>

                  {/* Artisan info */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <img
                      src={artisanPortrait}
                      alt=""
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-[10px] text-gray-500 truncate">
                      KalaSetu Artisan
                    </span>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-base font-bold text-orange-600">
                      ₹{parseFloat(product.price).toLocaleString("en-IN")}
                    </span>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-[10px] bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/buyer/product/${product.id}`);
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Buy
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerFeed;
