import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Shield, Leaf, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import madhubaniVase from "@/assets/madhubani-vase.jpg";
import artisanWorking from "@/assets/artisan-working.jpg";
import artisanPortrait from "@/assets/artisan-portrait.jpg";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const priceBreakdown = [
    { label: "Ramesh (Artisan)", amount: 1080, percentage: 90, color: "hsl(var(--rust))" },
    { label: "India Post Logistics", amount: 60, percentage: 5, color: "hsl(var(--umber))" },
    { label: "KalaSetu Platform Fee", amount: 60, percentage: 5, color: "hsl(var(--mustard))" },
  ];

  const totalPrice = 1200;

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/buyer")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-lg">Product Details</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24">
        {/* Video Section */}
        <div className="relative aspect-video bg-black">
          <img
            src={artisanWorking}
            alt="Product video"
            className="w-full h-full object-cover"
          />
          <button className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-elevated">
              <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
            </div>
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {[madhubaniVase, artisanWorking, madhubaniVase].map((img, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-transparent'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="px-4 space-y-6">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-serif text-2xl text-foreground mb-2">
              Hand-painted Madhubani Terra Vase
            </h2>
            <p className="text-3xl font-serif font-bold text-primary">
              ₹1,200
            </p>
          </motion.div>

          {/* Artisan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-4 shadow-soft flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
              <img src={artisanPortrait} alt="Ramesh" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Ramesh Kumar</span>
                <Badge className="bg-success/20 text-success border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Master Potter • Bihar, India</p>
              <p className="text-xs text-muted-foreground">3rd generation Madhubani artist</p>
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-4 shadow-soft"
          >
            <h3 className="font-serif text-lg text-foreground mb-3">Story of the Maker</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This vase is handcrafted by Ramesh Kumar, a third-generation Madhubani artist from 
              Madhubani district, Bihar. The art form, traditionally practiced on freshly plastered 
              mud walls, has been adapted to terracotta. Each piece takes 3-4 days to complete, 
              using natural clay sourced from the banks of the Ganges and herbal dyes made from 
              flowers, leaves, and bark collected from local forests.
            </p>
          </motion.div>

          {/* Transparent Pricing Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-4 shadow-soft"
          >
            <h3 className="font-serif text-lg text-foreground mb-4">
              Where Your Money Goes
            </h3>

            {/* Donut Chart */}
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {priceBreakdown.reduce((acc, item, i) => {
                    const offset = acc.offset;
                    const circumference = 2 * Math.PI * 35;
                    const strokeLength = (item.percentage / 100) * circumference;
                    
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="12"
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-500"
                      />
                    );
                    
                    acc.offset += strokeLength;
                    return acc;
                  }, { offset: 0, elements: [] as JSX.Element[] }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-serif font-bold text-foreground">₹1,200</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {priceBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground">₹{item.amount}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <div className="flex-1 bg-card rounded-xl p-4 shadow-soft text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Blockchain Verified</p>
              <p className="text-xs text-muted-foreground">Origin certified</p>
            </div>
            <div className="flex-1 bg-card rounded-xl p-4 shadow-soft text-center">
              <Leaf className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Handmade Certified</p>
              <p className="text-xs text-muted-foreground">100% artisanal</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Sticky Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button
          onClick={() => setShowCheckout(true)}
          className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-elevated transition-all"
        >
          Buy Now • ₹1,200
        </Button>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowCheckout(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-card w-full max-w-md rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl">Checkout</h3>
              <button onClick={() => setShowCheckout(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-muted rounded-xl p-4 mb-6">
              <div className="flex gap-4">
                <img 
                  src={madhubaniVase} 
                  alt="Product" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Madhubani Terra Vase</p>
                  <p className="text-sm text-muted-foreground">by Ramesh Kumar</p>
                  <p className="text-lg font-bold text-primary mt-1">₹1,200</p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="border-t border-border pt-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Shipping via India Post</p>
              <p className="text-sm text-foreground">Estimated delivery: 7-10 business days</p>
            </div>

            {/* Pay Button */}
            <Button
              className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-warm text-primary-foreground shadow-elevated"
            >
              Pay securely with Razorpay
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              🔒 Your payment is secure and encrypted
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;
