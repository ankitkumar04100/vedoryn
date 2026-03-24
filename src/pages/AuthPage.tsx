"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/hooks/useAuth"; // IMPORTANT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Crown,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* --------------------------------------------------------
     EMAIL LOGIN / SIGNUP
  -------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const user = data.user;
        await ensureProfile(user.id);

        toast.success("Welcome back, royal achiever!");
        navigate("/onboarding");
      } else {
        // SIGNUP
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin + "/auth/callback",
          },
        });

        if (error) throw error;

        const user = data.user;
        if (user) await ensureProfile(user.id);

        toast.success("Account created! Begin your royal journey.");
        navigate("/onboarding");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------
     GOOGLE LOGIN
  -------------------------------------------------------- */
  const handleGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Google sign‑in failed");
    }
  };

  /* --------------------------------------------------------
     GUEST LOGIN
  -------------------------------------------------------- */
  const handleGuest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      const user = data.user;
      await ensureProfile(user.id);

      toast.success("Welcome, Guest! Let's set up your royal profile.");
      navigate("/onboarding");
    } catch (err: any) {
      toast.error(err.message || "Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------
     UI
  -------------------------------------------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[22rem] h-[22rem] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* AUTH CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.05 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 shadow-lg mb-4"
          >
            <Crown className="w-8 h-8 text-white drop-shadow-lg" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Join Vedoryn"}
          </h1>

          <p className="text-muted-foreground mt-2 text-sm">
            {isLogin
              ? "Access your personalized career universe"
              : "Start your AI‑powered journey to success"}
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/10 shadow-xl">

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name on Sign Up */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white shadow-xl hover:scale-[1.03] active:scale-[0.96] transition-all"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            onClick={handleGoogle}
            className="w-full font-medium border-border hover:bg-accent/10"
          >
            Continue with Google
          </Button>

          {/* Guest Login */}
          <Button
            variant="ghost"
            onClick={handleGuest}
            className="w-full text-muted-foreground hover:text-foreground mt-3"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Continue as Guest
          </Button>

          {/* Switch */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline ml-1"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
