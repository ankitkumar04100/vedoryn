import { motion } from "framer-motion";
import { Brain, TrendingUp, Code, Briefcase, Mic, BookOpen } from "lucide-react";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";

const score = 72;
const breakdown = [
  { label: "Technical Skills", value: 78, icon: Code, color: "bg-primary" },
  { label: "Project Quality", value: 65, icon: Briefcase, color: "bg-vedoryn-cyan" },
  { label: "Interview Readiness", value: 70, icon: Mic, color: "bg-vedoryn-pink" },
  { label: "Consistency", value: 82, icon: TrendingUp, color: "bg-vedoryn-green" },
  { label: "Learning Speed", value: 68, icon: BookOpen, color: "bg-vedoryn-orange" },
];

const history = [
  { month: "Oct", score: 45 },
  { month: "Nov", score: 52 },
  { month: "Dec", score: 58 },
  { month: "Jan", score: 63 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
];

export default function CareerScorePage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" /> Career Score
        </h1>
        <p className="text-muted-foreground mt-1">Your real-time career readiness metric.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 3D Score Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-card border border-border shadow-card flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-vedoryn-cyan/5" />
          <CareerScore3D score={score} className="relative z-10" />
          <div className="relative z-10 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mt-2">
            Competitive Level
          </div>
          <p className="relative z-10 text-center text-sm text-muted-foreground mt-4 max-w-xs">
            Your score has increased by <span className="text-vedoryn-green font-semibold">+5 points</span> this month. Keep up the momentum!
          </p>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-6">Score Breakdown</h3>
          <div className="space-y-5">
            {breakdown.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
                <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* History Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 rounded-2xl bg-card border border-border shadow-card"
      >
        <h3 className="font-display font-semibold text-lg mb-6">Score History</h3>
        <div className="flex items-end gap-6 h-48">
          {history.map((h, i) => (
            <div key={h.month} className="flex-1 flex flex-col items-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-xs font-bold mb-2"
              >
                {h.score}
              </motion.span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(h.score / 100) * 160}px` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="w-full max-w-[40px] rounded-t-lg bg-gradient-score relative group cursor-pointer"
              >
                <div className="absolute inset-0 rounded-t-lg bg-primary/0 group-hover:bg-primary/20 transition-colors" />
              </motion.div>
              <span className="text-xs text-muted-foreground mt-2">{h.month}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
