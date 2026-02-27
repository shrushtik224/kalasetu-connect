import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => { },
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("[Auth] State changed:", event, currentSession?.user?.email ?? "no user");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error("[Auth] Error getting session:", error.message);
        // Clear any stale/corrupt session data
        supabase.auth.signOut().catch(() => { });
        setSession(null);
        setUser(null);
      } else {
        console.log("[Auth] Existing session:", currentSession?.user?.email ?? "none");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("[Auth] getSession failed:", err);
      setSession(null);
      setUser(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("[Auth] Signing out...");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const signIn = async (email: string, password: string) => {
    console.log("[Auth] Attempting sign in for:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("[Auth] Sign in error:", error.message);
      } else {
        console.log("[Auth] Sign in success:", data.user?.email);
      }
      return { data, error };
    } catch (err: any) {
      console.error("[Auth] Sign in exception:", err);
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    console.log("[Auth] Attempting sign up for:", email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });
      if (error) {
        console.error("[Auth] Sign up error:", error.message);
      } else {
        console.log("[Auth] Sign up response - user:", data.user?.email, "identities:", data.user?.identities?.length);
      }
      return { data, error };
    } catch (err: any) {
      console.error("[Auth] Sign up exception:", err);
      return { data: null, error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
