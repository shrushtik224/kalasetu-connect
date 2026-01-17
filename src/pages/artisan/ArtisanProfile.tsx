import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Phone, Mail, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import artisanPortrait from "@/assets/artisan-portrait.jpg";

const ArtisanProfile = () => {
  const navigate = useNavigate();

  // Mock artisan data - will be replaced with real data from database
  const artisan = {
    name: "Ramesh Kumar",
    nameHindi: "रमेश कुमार",
    location: "Bihar, India",
    locationHindi: "बिहार, भारत",
    phone: "+91 98765 43210",
    email: "ramesh.artisan@email.com",
    craft: "Madhubani Painting",
    craftHindi: "मधुबनी पेंटिंग",
    experience: "15 years",
    experienceHindi: "15 साल",
    bio: "Traditional Madhubani artist specializing in folk art patterns passed down through generations.",
    bioHindi: "पारंपरिक मधुबनी कलाकार, पीढ़ियों से चली आ रही लोक कला में विशेषज्ञ।"
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
          <h1 className="text-lg font-serif font-semibold">प्रोफ़ाइल</h1>
          <p className="text-xs text-muted-foreground">Profile</p>
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
                <img
                  src={artisanPortrait}
                  alt={artisan.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent hover:bg-accent/90"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="mt-4 text-xl font-serif font-bold text-foreground">
              {artisan.nameHindi}
            </h2>
            <p className="text-sm text-muted-foreground">{artisan.name}</p>
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
                  <p className="text-sm text-muted-foreground">स्थान / Location</p>
                  <p className="font-medium">{artisan.locationHindi}</p>
                  <p className="text-sm text-muted-foreground">{artisan.location}</p>
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
                  <p className="text-sm text-muted-foreground">कला / Craft</p>
                  <p className="font-medium">{artisan.craftHindi}</p>
                  <p className="text-sm text-muted-foreground">{artisan.craft}</p>
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
                  <p className="text-sm text-muted-foreground">अनुभव / Experience</p>
                  <p className="font-medium">{artisan.experienceHindi}</p>
                  <p className="text-sm text-muted-foreground">{artisan.experience}</p>
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
              <p className="text-sm font-medium text-muted-foreground">संपर्क जानकारी / Contact</p>
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
              <p className="text-sm font-medium text-muted-foreground mb-2">परिचय / About</p>
              <p className="text-sm leading-relaxed">{artisan.bioHindi}</p>
              <p className="text-xs text-muted-foreground mt-2">{artisan.bio}</p>
            </motion.div>
          </div>

          {/* Edit Profile Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Button className="w-full" size="lg">
              <Edit2 className="w-4 h-4 mr-2" />
              प्रोफ़ाइल संपादित करें
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">Edit Profile</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ArtisanProfile;
