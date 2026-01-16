import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import madhubaniVase from "@/assets/madhubani-vase.jpg";

const ListingReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [productName, setProductName] = useState("Hand-painted Madhubani Terra Vase");
  const [price, setPrice] = useState("1,200");
  const [isEditing, setIsEditing] = useState(false);

  const handlePublish = () => {
    toast({
      title: "🎉 सफलता! (Success!)",
      description: "Your product is live to the world!",
      duration: 4000,
    });
    setTimeout(() => {
      navigate("/artisan/dashboard");
    }, 2000);
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
              src={madhubaniVase}
              alt="Product"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
              0:28
            </div>
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
                <Badge variant="secondary" className="bg-muted text-foreground px-3 py-1">
                  Natural Clay
                </Badge>
                <Badge variant="secondary" className="bg-muted text-foreground px-3 py-1">
                  Herbal Dyes
                </Badge>
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground px-3 py-1">
                  Madhubani Art
                </Badge>
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
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-bold text-primary">₹</span>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-2xl font-serif font-bold text-primary border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on similar items and your craft quality
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
            className="w-full h-14 text-lg font-semibold rounded-xl bg-success hover:bg-success/90 text-primary-foreground shadow-soft hover:shadow-elevated transition-all"
          >
            <Check className="w-5 h-5 mr-2" />
            हाँ, यह सही है (Yes, Confirm & Publish)
          </Button>
          <button
            onClick={() => navigate("/artisan/dashboard")}
            className="w-full mt-3 text-center text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            रद्द करें (Cancel)
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ListingReview;
