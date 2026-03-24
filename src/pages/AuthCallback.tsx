"use client";

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ensureProfile } from "@/hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function run() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data.user;
        if (!user) {
          toast.error("Authentication failed");
          return navigate("/auth");
        }

        await ensureProfile(user.id);

        toast.success("Signed in successfully!");
        navigate("/onboarding");  
      } catch (err: any) {
        toast.error(err.message || "Login error");
        navigate("/auth");
      }
    }

    run();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground animate-pulse text-sm">
        Completing login…
      </p>
    </div>
  );
}
