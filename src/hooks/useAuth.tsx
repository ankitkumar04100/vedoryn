"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/* ============================================================
   PROFILE TYPE
============================================================ */

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;

  /* Onboarding Data */
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

  onboarding_complete: boolean | null;

  /* Extra App Fields */
  career_score: number | null;
  xp: number | null;
  level: number | null;
  language_preference: string | null;
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

  /* ============================================================
     AUTO-CREATE PROFILE FOR NEW USERS
  ============================================================ */
  const ensureProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) console.error("Profile fetch error:", error);

      // Create profile if missing
      if (!data) {
        const { error: insertError } = await supabase.from("profiles").insert({
          user_id: userId,
          onboarding_complete: false,
          subjects: [],
          weak_areas: [],
          interests: [],
          skills: [],
        });

        if (insertError) console.error("Profile creation error:", insertError);
      }
    } catch (err) {
      console.error("ensureProfile() failed", err);
    }
  };

  /* ============================================================
     FETCH PROFILE
  ============================================================ */
  const fetchProfile = async (userId: string) => {
    try {
      // Ensure profile exists first
      await ensureProfile(userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error) setProfile(data as Profile);
    } catch (err) {
      console.error("fetchProfile error:", err);
    }
  };

  /* ============================================================
     REFRESH PROFILE
  ============================================================ */
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  /* ============================================================
     AUTH STATE LISTENER
  ============================================================ */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await ensureProfile(currentUser.id);
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    /* INITIAL SESSION LOAD */
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await ensureProfile(currentUser.id);
        await fetchProfile(currentUser.id);
      }

      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ============================================================
     SIGN OUT
  ============================================================ */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  /* ============================================================
     GUEST FLAG
  ============================================================ */
  const isGuest = user?.is_anonymous ?? false;

  /* ============================================================
     CONTEXT PROVIDER
  ============================================================ */

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isGuest,
        signOut,
        refreshProfile,
        ensureProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ============================================================
   HOOK EXPORT
============================================================ */

export const useAuth = () => useContext(AuthContext);
