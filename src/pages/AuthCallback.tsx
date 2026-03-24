"use client";

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ensureProfile } from "@/hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleAuth() {
      try {
        // Get the logged‑in user after OAuth redirect
        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        const user = data?.user;
        if (!user) {
          toast.error("Unable to complete sign‑in. Please try again.");
          return navigate("/auth");
        }

        // Ensure profile row exists
        await ensureProfile(user.id);

        toast.success("Successfully signed in! Welcome to Vedoryn 👑");
        navigate("/onboarding");
      } catch (err: any) {
        toast.error(err?.message || "OAuth login failed");
        navigate("/auth");
      }
    }

    handleAuth();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-muted-foreground animate-pulse text-sm">
        Completing sign‑in…
      </p>
    </div>
  );
}
