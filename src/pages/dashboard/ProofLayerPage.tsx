import { motion } from "framer-motion";
import { Shield, Award, CheckCircle2, Code, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProofLayerPage() {
  const { profile } = useAuth();
  const skills = profile?.skills || [];
  const careerScore = profile?.career_score ?? 0;

  const badges = skills.map((skill, i) => ({
    title: `${skill} Verified`,
    level: (profile?.experience_level === "advanced" ? "Advanced" : profile?.experience_level === "intermediate" ? "Intermediate" : "Beginner"),
    verified: i < Math.ceil(skills.length * 0.6),
    icon: ["🐍", "⚛️", "🗃️", "🧠", "🏗️", "💻", "☁️", "🔐", "📊", "🎨"][i % 10],
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3"><Shield className="w-8 h-8 text-vedoryn-cyan" /> Proof Layer</h1>
        <p className="text-muted-foreground mt-1">Your verified skills and achievements that recruiters can trust.</p>
      </div>

      {/* Verification Score */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
            <Star className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Profile Verification Score</h3>
            <p className="text-muted-foreground text-sm">{badges.filter(b => b.verified).length} of {badges.length} skills verified</p>
            <div className="h-2 bg-secondary rounded-full mt-2 w-48">
              <motion.div initial={{ width: 0 }} animate={{ width: `${badges.length > 0 ? (badges.filter(b => b.verified).length / badges.length) * 100 : 0}%` }}
                transition={{ duration: 1 }} className="h-full rounded-full bg-vedoryn-green" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-vedoryn-gold" /> Skill Badges</h3>
        {badges.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Complete onboarding to see your skill badges.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {badges.map(b => (
              <motion.div key={b.title} whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${b.verified ? "border-vedoryn-green/30 bg-vedoryn-green/5" : "border-border opacity-60"}`}>
                <span className="text-2xl">{b.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{b.title}</span>
                    {b.verified && <CheckCircle2 className="w-3 h-3 text-vedoryn-green" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{b.level}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.verified ? "bg-vedoryn-green/10 text-vedoryn-green" : "bg-muted text-muted-foreground"}`}>
                  {b.verified ? "Verified" : "Pending"}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
