import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Phone, Mail, Edit2, Camera, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import artisanPortrait from "@/assets/artisan-portrait.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const ArtisanProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setAvatarUrl(data.avatar_url || null);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Please select an image under 5MB.");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("product_images")
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw new Error(updateError.message);

      setAvatarUrl(publicUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      console.log("Avatar updated:", publicUrl);
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      alert("Failed to upload: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Fallback mock data if profile not loaded yet
  const artisan = {
    name: profile?.full_name || "Artisan",
    location: profile?.location || "India",
    phone: profile?.phone || user?.phone || "+91 XXXXX XXXXX",
    email: user?.email || "artisan@kalasetu.com",
    craft: profile?.craft || "Traditional Craft",
    experience: profile?.experience || "Experienced",
    bio: profile?.bio || "An artisan on KalaSetu platform creating traditional handmade crafts.",
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleAvatarUpload}
      />

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
          <h1 className="text-lg font-serif font-semibold">{t.profileTitle}</h1>
          <p className="text-xs text-muted-foreground">{t.profile}</p>
        </div>
        <Logo size="sm" showText={false} />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-elevated">
                {uploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <img
                    src={avatarUrl || artisanPortrait}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Camera / edit button overlaid on the avatar */}
              <Button
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`absolute bottom-0 right-0 w-9 h-9 rounded-full shadow-md transition-all ${uploadSuccess
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-accent hover:bg-accent/90"
                  }`}
              >
                {uploadSuccess ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </Button>
            </div>

            <h2 className="mt-4 text-xl font-serif font-bold text-foreground">
              {artisan.name}
            </h2>
            <p className="text-sm text-muted-foreground">{artisan.email}</p>

            {/* Upload hint */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Camera className="w-3 h-3" />
              {t.tapChangePhoto}
            </button>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                  <p className="font-medium">{artisan.location}</p>
                </div>
              </div>
            </motion.div>

            {/* Craft */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.craft}</p>
                  <p className="font-medium">{artisan.craft}</p>
                </div>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">★</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.experience}</p>
                  <p className="font-medium">{artisan.experience}</p>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl p-4 shadow-soft space-y-3"
            >
              <p className="text-sm font-medium text-muted-foreground">{t.contact}</p>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{artisan.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{artisan.email}</p>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">{t.about}</p>
              <p className="text-sm leading-relaxed">{artisan.bio}</p>
            </motion.div>
          </div>

          {/* Upload Photo Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Button
              className="w-full"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.uploading}
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  {t.uploadPhoto}
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ArtisanProfile;
