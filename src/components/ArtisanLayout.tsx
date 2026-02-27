import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ArtisanLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setAvatarUrl(data.avatar_url || null);
      }
    };

    getProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/artisan");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Please select an image under 5MB.");
      return;
    }

    setUploading(true);
    setIsDropdownOpen(false);

    try {
      // Create a unique filename for the avatar
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      // Upload to Supabase storage (product_images bucket)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product_images")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("product_images")
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Update local state
      setAvatarUrl(publicUrl);
      console.log("Avatar uploaded successfully:", publicUrl);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      alert("Failed to upload photo: " + error.message);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input for mobile camera/gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/artisan/dashboard" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
                KalaSetu
              </Link>
            </div>
            <div className="relative ml-3 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {t.welcome}, {profile?.full_name || "Artisan"}
              </span>
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden relative">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    ) : avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-600"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  {/* Upload Photo Option */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <Camera className="w-4 h-4 text-gray-500" />
                    {t.changePhoto}
                  </button>

                  <Link
                    to="/artisan/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {t.profile}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ArtisanLayout;