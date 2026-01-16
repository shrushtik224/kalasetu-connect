import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Video, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import artisanPortrait from "@/assets/artisan-portrait.jpg";

const ArtisanDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border">
        <Logo size="sm" showText={false} />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Welcome, Ramesh</p>
            <p className="text-xs text-muted-foreground">Bihar, India</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
            <img 
              src={artisanPortrait} 
              alt="Ramesh" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <p className="text-2xl font-serif font-bold text-primary">₹12,450</p>
              <p className="text-sm text-muted-foreground">इस महीने की कमाई</p>
              <p className="text-xs text-muted-foreground">This month's earnings</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <p className="text-2xl font-serif font-bold text-accent">8</p>
              <p className="text-sm text-muted-foreground">सामान बिका</p>
              <p className="text-xs text-muted-foreground">Items sold</p>
            </motion.div>
          </div>

          {/* Main CTA - Big Pulsing Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative mb-8"
          >
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-48 h-48 bg-primary/20 rounded-full animate-pulse-ring" />
              <div className="absolute w-56 h-56 bg-primary/10 rounded-full animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            </div>

            <Button
              onClick={() => navigate("/artisan/record")}
              className="relative w-44 h-44 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2"
            >
              <Video className="w-12 h-12" />
              <span className="text-base font-semibold">नया सामान बेचें</span>
              <span className="text-xs opacity-80">Sell New Item</span>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground mb-2"
          >
            वीडियो रिकॉर्ड करें
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-muted-foreground"
          >
            Record a video to sell your craft
          </motion.p>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-card border-t border-border py-3 px-4">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">My Sales</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ArtisanDashboard;
