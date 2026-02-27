import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/ui/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const BuyerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Check if user is already logged in + clear stale sessions
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[BuyerAuth] Auth state:", event, session?.user?.email ?? "no user");
      if (session?.user) {
        navigate("/buyer");
      }
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.log("[BuyerAuth] Stale session detected, clearing...");
        supabase.auth.signOut().catch(() => { });
      } else if (session?.user) {
        navigate("/buyer");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = (): boolean => {
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors[0].message);
        return false;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors[0].message);
        return false;
      }
    }

    if (!isLogin && !name.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        console.log("[BuyerAuth] Attempting sign in for:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("[BuyerAuth] Login error:", error);
          const msg = error.message || String(error);
          if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch")) {
            toast.error("Cannot connect to the server. Please check your internet connection.");
          } else if (msg.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please try again.");
          } else if (msg.includes("Email not confirmed")) {
            toast.error("Please confirm your email address to log in. Check your inbox.");
          } else {
            toast.error(msg);
          }
          return;
        }

        console.log("[BuyerAuth] Sign in success:", data?.user?.email);
        toast.success("Welcome back!");
        navigate("/buyer");
      } else {
        console.log("[BuyerAuth] Attempting sign up for:", email);
        const redirectUrl = `${window.location.origin}/buyer`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: name,
            }
          }
        });

        if (error) {
          console.error("[BuyerAuth] Signup error:", error);
          const msg = error.message || String(error);
          if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch")) {
            toast.error("Cannot connect to the server. Please check your internet connection.");
          } else if (msg.includes("already registered") || msg.includes("already been registered")) {
            toast.error("This email is already registered. Please sign in instead.");
            setIsLogin(true);
          } else {
            toast.error(msg);
          }
          return;
        }

        // Detect the silent failure: Supabase returns success but empty identities
        // when user already exists + email confirmation is enabled
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          console.warn("[BuyerAuth] Empty identities - user likely already exists");
          toast.error("An account with this email may already exist. Please try signing in.");
          setIsLogin(true);
          return;
        }

        // Check if user was auto-confirmed (session exists immediately)
        if (data?.session) {
          console.log("[BuyerAuth] Auto-confirmed, user is logged in!");
          toast.success("Account created! Welcome!");
          navigate("/buyer");
        } else {
          console.log("[BuyerAuth] Sign up success, email confirmation needed.");
          toast.success("Account created! Please check your email for a confirmation link.");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error("[BuyerAuth] Unexpected error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Welcome back, explorer!" : "Join our community of craft lovers"}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-2xl shadow-card p-8">
            {/* Toggle */}
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${isLogin
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${!isLogin
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="pl-10 h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-soft hover:shadow-elevated transition-all mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "New to KalaSetu? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Trust Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to support authentic Indian craftsmanship
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default BuyerAuth;
