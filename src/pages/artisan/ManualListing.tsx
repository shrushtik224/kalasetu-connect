import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { insertProduct } from "@/integrations/supabase/products";

const ManualListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "त्रुटि (Error)",
        description: "Please select an image file (JPG, PNG, etc.)",
        duration: 4000,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "त्रुटि (Error)",
        description: "Image size should be less than 5MB",
        duration: 4000,
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const userId = user?.id || "anon_user";
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "त्रुटि (Error)",
        description: "User not authenticated. Please login again.",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    
    try {
      let imageUrl: string | undefined;

      // Upload image if selected
      if (selectedImage) {
        setUploading(true);
        imageUrl = await uploadImage(selectedImage);
        setUploading(false);
      }

      // Insert product into database
      await insertProduct(user.id, {
        name: productName,
        price: parseFloat(price),
        description: description,
        image_url: imageUrl,
        status: "published",
      });

      toast({
        title: "सफलता! (Success!)",
        description: "Your product has been listed successfully!",
        duration: 4000,
      });
      
      setTimeout(() => {
        navigate("/artisan/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error listing product:", error);
      toast({
        variant: "destructive",
        title: "त्रुटि (Error)",
        description: error.message || "Failed to list product. Please try again.",
        duration: 4000,
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
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
          <h1 className="text-lg font-serif font-semibold">विवरण लिखें</h1>
          <p className="text-xs text-muted-foreground">Enter Details</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto space-y-6"
        >
          {/* Image Picker */}
          <div
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center bg-muted/5 text-muted-foreground cursor-pointer hover:bg-muted/10 transition-colors relative overflow-hidden"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">फोटो अपलोड करें (Upload Photo)</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">उत्पाद का नाम (Product Name)</label>
              <Input
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="जैसे: मधुबनी पेंटिंग"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">कीमत (Price) ₹</label>
              <Input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">विवरण (Description)</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="अपने उत्पाद के बारे में बताएं..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading || uploading}
              className="w-full h-12 text-lg font-semibold mt-6 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading || uploading ? "सहेज रहा है..." : "लिस्ट करें (List Item)"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ManualListing;