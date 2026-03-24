"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

/* ============================================================
   PROFILE TYPE
============================================================ */
type Profile = {
  id: string;
  user_id: string;
  avatar_url: string | null;
  display_name: string | null;
  onboarding_complete: boolean | null;

  age: number | null;
  education_level: string | null;
  current_class: string | null;
  academic_stream: string | null;

  subjects: string[] | null;
  weak_areas: string[] | null;

  career_goal: string | null;
  long_term_goal: string | null;
  interests: string[] | null;
  skills: string[] | null;

  experience_level: string | null;
  daily_hours: number | null;
  productivity_level: string | null;
  learning_style: string | null;

  stress_level: number | null;
  motivation_level: number | null;

  xp: number | null;
  career_score: number | null;
  level: number | null;
};

/* ============================================================
   CONTEXT TYPE
============================================================ */
type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  ensureProfile: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isGuest: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  ensureProfile: async () => {},
});

/* ============================================================
   MAIN PROVIDER
============================================================ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------
     AUTO-CREATE PROFILE IF MISSING
  ------------------------------------------------------------ */
  const ensureProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!data) {
        await supabase.from("profiles").insert({
          user_id: userId,
          onboarding_complete: false,
          subjects: [],
          weak_areas: [],
          interests: [],
          skills: [],
        });
      }
    } catch (err) {
      console.error("ensureProfile error:", err);
    }
  };

  /* ------------------------------------------------------------
     LOAD PROFILE
  ------------------------------------------------------------ */
  const fetchProfile = async (userId: string) => {
    await ensureProfile(userId);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    setProfile(data as Profile);
  };

  /* ------------------------------------------------------------
     REFRESH
  ------------------------------------------------------------ */
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  /* ------------------------------------------------------------
     AUTH STATE LISTENER
  ------------------------------------------------------------ */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setSession(session);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setSession(data.session);

      if (currentUser) await fetchProfile(currentUser.id);

      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ------------------------------------------------------------
     SIGN OUT
  ------------------------------------------------------------ */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isGuest: user?.is_anonymous ?? false,
        signOut,
        refreshProfile,
        ensureProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { ensureProfile };
