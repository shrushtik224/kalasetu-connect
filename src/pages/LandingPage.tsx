import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import handicraftImage from "@/assets/handicraft-display.jpg";
import artisanHandsImage from "@/assets/artisan-hands.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Logo size="sm" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-12 px-4">
        <motion.div
          className="container mx-auto max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Text */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
              Where Tradition Meets
              <span className="text-primary block">Tomorrow</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A bridge between India's master artisans and conscious buyers worldwide. 
              Every purchase tells a story, supports a family, preserves a craft.
            </p>
          </motion.div>

          {/* Split Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Buyer Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/buyer")}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={handicraftImage}
                  alt="Beautiful Indian handicrafts"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                <h2 className="font-serif text-2xl md:text-3xl mb-2">
                  Discover Authentic Crafts
                </h2>
                <p className="text-sm md:text-base opacity-90 mb-4">
                  Shop directly from India's master creators. 100% traceable.
                </p>
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-soft group-hover:shadow-elevated transition-all"
                >
                  Explore as Buyer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            {/* Artisan Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/artisan")}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={artisanHandsImage}
                  alt="Artisan hands shaping clay"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-umber/90 via-umber/40 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                <h2 className="font-serif text-2xl md:text-3xl mb-1">
                  अपनी कला बेचें
                </h2>
                <p className="text-sm font-medium mb-2 opacity-90">
                  Sell Your Art
                </p>
                <p className="text-sm md:text-base opacity-80 mb-4">
                  स्मार्टफोन से सीधा ग्लोबल मार्केट में।
                  <span className="block text-xs opacity-70">
                    Direct to global market from smartphone.
                  </span>
                </p>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl shadow-soft group-hover:shadow-elevated transition-all"
                >
                  कारीगर प्रवेश (Artisan Enter)
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Trust Badges */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12"
          >
            {[
              { number: "10,000+", label: "Artisan Families" },
              { number: "50+", label: "Craft Forms" },
              { number: "90%", label: "Goes to Artisans" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-2xl md:text-3xl text-primary font-bold">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 KalaSetu. Traditional soul, modern tech.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
