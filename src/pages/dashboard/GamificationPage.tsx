import { motion } from "framer-motion";
import { Gamepad2, Trophy, Star, Flame, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function GamificationPage() {
  const { profile } = useAuth();
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const skillCount = profile?.skills?.length ?? 0;
  const careerScore = profile?.career_score ?? 0;
  const streak = Math.min(Math.floor(xp / 100), 30);

  const achievements = [
    { title: "First Login", desc: "Welcome to Vedoryn", unlocked: true, icon: "🎉" },
    { title: "Profile Complete", desc: "Complete onboarding", unlocked: !!profile?.onboarding_complete, icon: "✅" },
    { title: "Skill Collector", desc: `Verify ${skillCount} skills`, unlocked: skillCount >= 3, icon: "🏅" },
    { title: "Score Climber", desc: "Reach Career Score 50", unlocked: careerScore >= 50, icon: "📈" },
    { title: "Week Warrior", desc: "7-day streak", unlocked: streak >= 7, icon: "🔥" },
    { title: "Century Club", desc: "Reach Career Score 100", unlocked: careerScore >= 100, icon: "💯" },
  ];

  const xpToNext = (level + 1) * 500;
  const progress = Math.min((xp / xpToNext) * 100, 100);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3"><Gamepad2 className="w-8 h-8 text-vedoryn-orange" /> Gamification</h1>
        <p className="text-muted-foreground mt-1">Level up your career with XP, achievements, and rankings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: xp.toLocaleString(), icon: Star, color: "text-vedoryn-gold bg-vedoryn-gold/10" },
          { label: "Level", value: level, icon: TrendingUp, color: "text-primary bg-primary/10" },
          { label: "Day Streak", value: `${streak} 🔥`, icon: Flame, color: "text-vedoryn-orange bg-vedoryn-orange/10" },
          { label: "Achievements", value: `${achievements.filter(a => a.unlocked).length}/${achievements.length}`, icon: Trophy, color: "text-vedoryn-cyan bg-vedoryn-cyan/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Level progress */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Level {level} → {level + 1}</h3>
          <span className="text-sm text-muted-foreground">{xp} / {xpToNext} XP</span>
        </div>
        <div className="h-4 bg-secondary rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5 }}
            className="h-full rounded-full bg-gradient-hero" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-vedoryn-gold" /> Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map(a => (
            <motion.div key={a.title} whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl border text-center transition-all ${a.unlocked ? "border-vedoryn-gold/30 bg-vedoryn-gold/5 shadow-card" : "border-border opacity-40"}`}>
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
