import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import handicraftImage from "@/assets/handicraft-display.jpg";
import artisanHandsImage from "@/assets/artisan-hands.jpg";
import siteLogo from "@/assets/logo/kalasetu-logo.jpg";

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={siteLogo} alt="KalaSetu" className="h-8 w-auto" />
            <span className="font-serif text-xl font-bold text-foreground">KalaSetu</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </button>
          </nav>
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

      {/* About Us Section */}
      <section id="about" className="py-20 bg-secondary/10 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">About KalaSetu</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              KalaSetu is a digital bridge connecting India's rural artisans directly with global appreciators of art. 
              We believe in fair trade, transparency, and preserving the rich cultural heritage of Indian craftsmanship.
              By eliminating middlemen, we ensure that the true value of art reaches the hands that create it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Globe, title: "Global Reach", desc: "Taking local crafts to the world stage" },
              { icon: Heart, title: "Fair Trade", desc: "Direct earnings for artisan families" },
              { icon: MapPin, title: "Traceable", desc: "Know the origin of every piece" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="bg-background p-6 rounded-xl shadow-soft"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">We'd love to hear from you. Reach out to us for any queries.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-muted-foreground">support@kalasetu.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-soft hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
