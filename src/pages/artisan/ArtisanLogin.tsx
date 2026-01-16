import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";

const ArtisanLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate("/artisan/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Logo size="sm" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            {/* Greeting */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">
                नमस्ते!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Welcome, Artisan
              </p>
            </motion.div>

            {/* Phone Icon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Smartphone className="w-12 h-12 text-primary" />
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-left text-sm font-medium text-foreground mb-2">
                  मोबाइल नंबर (Mobile Number)
                </label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 text-xl text-center rounded-xl border-2 border-border focus:border-primary transition-colors"
                  maxLength={10}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={phone.length < 10 || isLoading}
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-elevated transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    "आगे बढ़ें (Send OTP)"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              OTP आपके फोन पर भेजा जाएगा
              <span className="block text-xs">OTP will be sent to your phone</span>
            </motion.p>
          </div>

          {/* Back Link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-muted-foreground hover:text-foreground transition-colors"
          >
            ← वापस जाएं (Go Back)
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default ArtisanLogin;
