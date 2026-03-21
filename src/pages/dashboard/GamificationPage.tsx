import { motion } from "framer-motion";
import { Gamepad2, Trophy, Star, Flame, Award, TrendingUp } from "lucide-react";

const stats = { xp: 2450, level: 12, streak: 7, rank: 42 };

const achievements = [
  { title: "First Interview", desc: "Complete your first AI interview", unlocked: true, icon: "🎤" },
  { title: "Week Warrior", desc: "7-day study streak", unlocked: true, icon: "🔥" },
  { title: "Skill Collector", desc: "Verify 5 skills", unlocked: true, icon: "🏅" },
  { title: "Score Climber", desc: "Reach Career Score 75", unlocked: false, icon: "📈" },
  { title: "Project Pro", desc: "Complete 3 verified projects", unlocked: false, icon: "🏗️" },
  { title: "Century Club", desc: "Reach Career Score 100", unlocked: false, icon: "💯" },
];

const leaderboard = [
  { name: "Aisha K.", score: 89, xp: 4200 },
  { name: "Rohan M.", score: 85, xp: 3800 },
  { name: "Priya S.", score: 82, xp: 3500 },
  { name: "You", score: 72, xp: 2450, isUser: true },
  { name: "Vikram P.", score: 70, xp: 2300 },
];

export default function GamificationPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-vedoryn-orange" /> Gamification
        </h1>
        <p className="text-muted-foreground mt-1">Level up your career with XP, achievements, and rankings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: stats.xp.toLocaleString(), icon: Star, color: "text-vedoryn-gold bg-vedoryn-gold/10" },
          { label: "Level", value: stats.level, icon: TrendingUp, color: "text-primary bg-primary/10" },
          { label: "Day Streak", value: `${stats.streak} 🔥`, icon: Flame, color: "text-vedoryn-orange bg-vedoryn-orange/10" },
          { label: "Global Rank", value: `#${stats.rank}`, icon: Trophy, color: "text-vedoryn-cyan bg-vedoryn-cyan/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-vedoryn-gold" /> Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map(a => (
              <div key={a.title} className={`p-3 rounded-lg border ${a.unlocked ? "border-vedoryn-gold/30 bg-vedoryn-gold/5" : "border-border opacity-50"}`}>
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-vedoryn-cyan" /> Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((u, i) => (
              <div key={u.name} className={`flex items-center gap-3 p-3 rounded-lg ${(u as any).isUser ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"}`}>
                <span className="w-6 text-center font-bold text-sm">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold">{u.name}</span>
                </div>
                <span className="text-sm font-bold">{u.score}</span>
                <span className="text-xs text-muted-foreground">{u.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
