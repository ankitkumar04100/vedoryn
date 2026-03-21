import { motion } from "framer-motion";
import { Heart, AlertTriangle, TrendingDown, Smile, Frown, Meh } from "lucide-react";

const wellnessData = {
  stressScore: 35,
  burnoutRisk: "Low",
  weeklyHours: 22,
  avgSession: "2.5h",
};

const tips = [
  "Take a 15-minute break every 90 minutes",
  "Your study hours look balanced — great consistency!",
  "Consider reducing Friday study load to prevent weekend burnout",
  "Sleep quality impacts retention — aim for 7+ hours",
];

export default function WellnessPage() {
  const stressLevel = wellnessData.stressScore < 40 ? "healthy" : wellnessData.stressScore < 70 ? "moderate" : "high";

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Heart className="w-8 h-8 text-vedoryn-pink" /> Wellness Monitor
        </h1>
        <p className="text-muted-foreground mt-1">Maintain sustainable performance and avoid burnout.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Stress Score", value: `${wellnessData.stressScore}/100`, icon: stressLevel === "healthy" ? Smile : stressLevel === "moderate" ? Meh : Frown, color: stressLevel === "healthy" ? "text-vedoryn-green bg-vedoryn-green/10" : "text-vedoryn-orange bg-vedoryn-orange/10" },
          { label: "Burnout Risk", value: wellnessData.burnoutRisk, icon: AlertTriangle, color: "text-vedoryn-green bg-vedoryn-green/10" },
          { label: "Weekly Hours", value: `${wellnessData.weeklyHours}h`, icon: TrendingDown, color: "text-primary bg-primary/10" },
          { label: "Avg Session", value: wellnessData.avgSession, icon: Heart, color: "text-vedoryn-pink bg-vedoryn-pink/10" },
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

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">AI Wellness Tips</h3>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-vedoryn-green/5">
              <span className="text-vedoryn-green text-lg">💡</span>
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
