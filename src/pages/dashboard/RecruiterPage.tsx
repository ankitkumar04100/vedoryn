import { motion } from "framer-motion";
import { BarChart3, Users, Filter, TrendingUp, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function RecruiterPage() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");

  // Dynamic stats from profile
  const userScore = profile?.career_score ?? 0;
  const userSkills = profile?.skills || [];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3"><BarChart3 className="w-8 h-8 text-vedoryn-green" /> Recruiter Dashboard</h1>
        <p className="text-muted-foreground mt-1">See how recruiters view your profile and improve visibility.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Your Score", value: String(userScore), icon: TrendingUp, color: "text-primary bg-primary/10" },
          { label: "Verified Skills", value: String(userSkills.length), icon: Filter, color: "text-vedoryn-green bg-vedoryn-green/10" },
          { label: "Profile Strength", value: userScore >= 70 ? "Strong" : userScore >= 40 ? "Good" : "Building", icon: Users, color: "text-vedoryn-cyan bg-vedoryn-cyan/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">How Recruiters See You</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                {(profile?.display_name || "U").charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{profile?.display_name || "Your Name"}</h4>
                <p className="text-sm text-muted-foreground">{profile?.career_goal || "Set your career goal"}</p>
                <div className="flex gap-2 mt-2">
                  {userSkills.slice(0, 5).map(s => <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-secondary font-medium">{s}</span>)}
                  {userSkills.length > 5 && <span className="text-xs text-muted-foreground">+{userSkills.length - 5}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-primary">{userScore}</div>
                <div className="text-xs text-muted-foreground">Career Score</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {userScore >= 70
              ? "🟢 Your profile is competitive. Recruiters actively look for candidates with your score range."
              : userScore >= 40
              ? "🟡 Your profile is growing. Complete more interviews and projects to boost visibility."
              : "🔴 Keep building! Add skills, complete the onboarding, and practice interviews to improve."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
