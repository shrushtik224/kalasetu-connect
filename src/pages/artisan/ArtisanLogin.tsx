import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ArtisanLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/artisan/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("artisan_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Clear any stale auth state on mount
  useEffect(() => {
    const clearStaleSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.log("[Login] Stale session detected, clearing...");
          await supabase.auth.signOut();
        }
      } catch (e) {
        console.log("[Login] Error checking session, clearing...");
        await supabase.auth.signOut();
      }
    };
    clearStaleSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        // ========== SIGN IN ==========
        console.log("[Login] Attempting sign in...");
        const { data, error } = await signIn(email, password);

        if (error) {
          console.error("[Login] Sign in error:", error);
          const msg = error.message || String(error);

          if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch")) {
            setErrorMsg("Cannot connect to the server. Please check your internet connection and ensure your Supabase project is active.");
          } else if (msg.includes("Email not confirmed")) {
            setErrorMsg("Please confirm your email before logging in. Check your inbox for the confirmation link.");
          } else if (msg.includes("Invalid login credentials")) {
            setErrorMsg("Invalid email or password. Please check your credentials and try again.");
          } else {
            setErrorMsg("Sign in failed: " + msg);
          }
          return;
        }

        // Sign-in succeeded
        console.log("[Login] Sign in successful!");
        localStorage.setItem("artisan_email", email);
        // The onAuthStateChange listener in useAuth will update the user state,
        // which triggers the useEffect above to navigate to dashboard.
        // But also navigate explicitly as a fallback:
        navigate("/artisan/dashboard");

      } else {
        // ========== SIGN UP ==========
        console.log("[Login] Attempting sign up...");
        const { data, error } = await signUp(email, password, { data: { full_name: fullName } });

        if (error) {
          console.error("[Login] Sign up error:", error);
          const msg = error.message || String(error);

          if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch")) {
            setErrorMsg("Cannot connect to the server. Please check your internet connection and ensure your Supabase project is active.");
          } else if (msg.includes("already registered") || msg.includes("already been registered")) {
            setErrorMsg("This email is already registered. Please sign in instead.");
            setIsLogin(true);
          } else if (msg.includes("Password should be at least")) {
            setErrorMsg("Password must be at least 6 characters long.");
          } else {
            setErrorMsg("Sign up failed: " + msg);
          }
          return;
        }

        // Check for the silent failure case: Supabase returns success but with 
        // empty identities when user already exists + email confirmation is on
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          console.warn("[Login] Sign up returned empty identities - user likely already exists");
          setErrorMsg("An account with this email may already exist. Please try signing in instead.");
          setIsLogin(true);
          return;
        }

        // Check if user got auto-confirmed (session will exist)
        if (data?.session) {
          console.log("[Login] Auto-confirmed! User is logged in.");
          localStorage.setItem("artisan_email", email);
          navigate("/artisan/dashboard");
        } else {
          // Email confirmation is required
          console.log("[Login] Sign up successful, email confirmation required.");
          setErrorMsg("");
          alert("Account created! Please check your email and click the confirmation link to activate your account.");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error("[Login] Unexpected error:", error);
      setErrorMsg("Something went wrong: " + (error?.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-gray-900 overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1606103920295-9a091573f160?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.05)' // Slight scale to prevent white edges from blur
        }}
      />

      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {isLogin ? "स्वागत है" : "कलासेतु से जुड़ें"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isLogin
                  ? "अपनी कारीगर प्रोफ़ाइल प्रबंधित करने के लिए साइन इन करें"
                  : "अपनी कलाकृतियां बेचने के लिए खाता बनाएं"}
              </p>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    पूरा नाम
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  ईमेल पता
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  पासवर्ड
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? "प्रक्रिया जारी है..." : (isLogin ? "साइन इन करें" : "खाता बनाएं")}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isLogin ? "कलासेतु पर नए हैं?" : "क्या आपके पास पहले से खाता है?"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {isLogin ? "खाता बनाएं" : "साइन इन करें"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanLogin;