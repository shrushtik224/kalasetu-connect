import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Edit2, Package, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { insertProduct } from "@/integrations/supabase/products";
import type { ProductDetails } from "@/integrations/sarvam/client";

interface LocationState {
  extractedData?: {
    name?: string;
    price?: string | number;
    description?: string;
    materials?: string[];
    confidence?: number;
  };
  imageUrl?: string;
  videoPath?: string;
  transcript?: string;
  productDetails?: ProductDetails;
}

const ListingReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get data passed from ProcessingScreen
  const { extractedData, imageUrl: passedImageUrl, videoPath, productDetails } = (location.state || {}) as LocationState;

  // Use productDetails from Sarvam AI if available, otherwise fallback to extractedData
  const initialName = productDetails?.productName || extractedData?.name || "New Item";
  const initialPrice = productDetails?.productPrice || extractedData?.price || "";
  const initialDescription = productDetails?.productDescription || extractedData?.description || "";

  const [productName, setProductName] = useState(initialName);
  const [price, setPrice] = useState(String(initialPrice));
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState<string>(passedImageUrl || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [stock, setStock] = useState(1);



  const handlePublish = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "त्रुटि (Error)",
        description: "User not authenticated. Please login again.",
        duration: 4000,
      });
      return;
    }

    setIsPublishing(true);

    try {
      // Insert product into database
      await insertProduct(user.id, {
        name: productName,
        price: parseFloat(price) || 0,
        description: description,
        image_url: imageUrl || undefined,
        video_path: videoPath || undefined,
        status: "published",
        stock: stock || 1,
      });

      toast({
        title: "🎉 सफलता! (Success!)",
        description: "Your product is live to the world!",
        duration: 4000,
      });

      setTimeout(() => {
        navigate("/artisan/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error publishing product:", error);
      toast({
        variant: "destructive",
        title: "त्रुटि (Error)",
        description: error.message || "Failed to publish product. Please try again.",
        duration: 4000,
      });
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <h1 className="font-serif text-xl text-center text-foreground">
          क्या यह सही है?
        </h1>
        <p className="text-sm text-center text-muted-foreground">
          Is this correct?
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          {/* Video Thumbnail */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-square rounded-xl overflow-hidden shadow-card mb-6"
          >
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Product"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-success text-primary-foreground">
                <Check className="w-3 h-3 mr-1" />
                AI Processed
              </Badge>
            </div>
          </motion.div>

          {/* AI Detected Fields */}
          <div className="space-y-4">
            {/* Product Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Product Name / उत्पाद का नाम
                </label>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              {isEditing ? (
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="text-lg font-medium"
                  autoFocus
                  onBlur={() => setIsEditing(false)}
                />
              ) : (
                <p className="text-lg font-medium text-foreground">{productName}</p>
              )}
            </motion.div>

            {/* Detected Materials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <label className="text-sm font-medium text-muted-foreground block mb-3">
                Detected Material / पहचानी गई सामग्री
              </label>
              <div className="flex flex-wrap gap-2">
                {extractedData?.materials?.map((mat: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-muted text-foreground px-3 py-1">
                    {mat}
                  </Badge>
                )) || <Badge variant="secondary">Unknown</Badge>}
              </div>
            </motion.div>

            {/* Suggested Price */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Suggested Price / सुझाई गई कीमत
              </label>
              <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="text-2xl font-serif font-bold text-primary">₹</span>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-2xl font-serif font-bold text-primary border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on similar items and your craft quality. You can adjust this manually.
              </p>
            </motion.div>

            {/* Description (Transcript) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Description / विवरण
                </label>
                <button
                  onClick={() => setIsEditingDescription(!isEditingDescription)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              {isEditingDescription ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[100px] bg-muted/20 border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                  onBlur={() => setIsEditingDescription(false)}
                />
              ) : (
                <p className="text-sm text-foreground leading-relaxed">{description}</p>
              )}
            </motion.div>

            {/* Stock Quantity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.58 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <Package className="w-4 h-4" />
                Stock Available / स्टॉक उपलब्ध
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStock(Math.max(1, stock - 1))}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center hover:bg-muted/60 transition-colors"
                >
                  <Minus className="w-4 h-4 text-foreground" />
                </button>
                <Input
                  type="number"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center text-xl font-serif font-bold w-24 border-0 bg-muted/20 focus-visible:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setStock(stock + 1)}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center hover:bg-muted/60 transition-colors"
                >
                  <Plus className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                How many pieces do you have ready to sell?
              </p>
            </motion.div>

            {/* AI Confidence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 py-2"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-success' : 'bg-muted'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                AI Confidence: 85%
              </span>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Action */}
      <div className="p-4 border-t border-border bg-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-md mx-auto"
        >
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-success hover:bg-success/90 text-primary-foreground shadow-soft hover:shadow-elevated transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5 mr-2" />
            {isPublishing ? "प्रकाशित कर रहा है..." : "हाँ, यह सही है (Yes, Confirm & Publish)"}
          </Button>
          <button
            onClick={() => navigate("/artisan/dashboard")}
            disabled={isPublishing}
            className="w-full mt-3 text-center text-muted-foreground hover:text-foreground transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            रद्द करें (Cancel)
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ListingReview;
