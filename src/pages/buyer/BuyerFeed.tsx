import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX, Heart, Share2, CheckCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import artisanWorking from "@/assets/artisan-working.jpg";
import weaverArtisan from "@/assets/weaver-artisan.jpg";
import artisanPortrait from "@/assets/artisan-portrait.jpg";

interface FeedItem {
  id: number;
  video: string;
  artisanName: string;
  location: string;
  productTitle: string;
  price: number;
  verified: boolean;
  artisanPhoto: string;
}

const feedItems: FeedItem[] = [
  {
    id: 1,
    video: artisanWorking,
    artisanName: "Ramesh Kumar",
    location: "Bihar",
    productTitle: "Madhubani Clay Vase",
    price: 1200,
    verified: true,
    artisanPhoto: artisanPortrait,
  },
  {
    id: 2,
    video: weaverArtisan,
    artisanName: "Lakshmi Devi",
    location: "Rajasthan",
    productTitle: "Handwoven Silk Stole",
    price: 2400,
    verified: true,
    artisanPhoto: artisanPortrait,
  },
];

const BuyerFeed = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const currentItem = feedItems[currentIndex];

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentIndex < feedItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedItems(newLiked);
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
          <Logo size="sm" showText={false} />
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </header>

      {/* Video Feed */}
      <div 
        className="h-full snap-y snap-mandatory overflow-y-scroll"
        onWheel={(e) => {
          if (e.deltaY > 0) handleScroll("down");
          else handleScroll("up");
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full snap-start relative"
          >
            {/* Video/Image */}
            <img
              src={currentItem.video}
              alt={currentItem.productTitle}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-6">
              {/* Like */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLike(currentItem.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${likedItems.has(currentItem.id) ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'}`}>
                  <Heart 
                    className={`w-6 h-6 ${likedItems.has(currentItem.id) ? 'text-white fill-white' : 'text-white'}`} 
                  />
                </div>
                <span className="text-white text-xs">234</span>
              </motion.button>

              {/* Share */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs">Share</span>
              </motion.button>

              {/* Artisan Photo */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                <img 
                  src={currentItem.artisanPhoto} 
                  alt={currentItem.artisanName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-20 p-4 pb-8">
              {/* Artisan Info */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-medium">
                  {currentItem.artisanName}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white/80 text-sm">{currentItem.location}</span>
                {currentItem.verified && (
                  <span className="flex items-center gap-1 bg-success/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="text-success text-xs">Verified</span>
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h2 className="text-white text-xl font-serif mb-3">
                {currentItem.productTitle}
              </h2>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-serif font-bold text-white">
                  ₹{currentItem.price.toLocaleString()}
                </span>
                <Button
                  onClick={() => navigate(`/buyer/product/${currentItem.id}`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Scroll Indicator */}
            {currentIndex < feedItems.length - 1 && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2"
              >
                <div className="w-8 h-1 bg-white/50 rounded-full" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feed Progress */}
      <div className="fixed top-20 left-4 flex flex-col gap-1">
        {feedItems.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-8 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BuyerFeed;
