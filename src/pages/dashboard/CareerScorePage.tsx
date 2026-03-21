import { motion } from "framer-motion";
import { Brain, TrendingUp, Code, Briefcase, Mic, BookOpen } from "lucide-react";

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
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" /> Career Score
        </h1>
        <p className="text-muted-foreground mt-1">Your real-time career readiness metric.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Score Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-card border border-border shadow-card flex flex-col items-center"
        >
          <div className="relative mb-6">
            <svg width="220" height="220" className="-rotate-90">
              <circle cx="110" cy="110" r="45" fill="none" className="stroke-secondary" strokeWidth="10" transform="scale(2.1) translate(-58, -58)" />
              <circle
                cx="110" cy="110" r="45" fill="none" className="stroke-primary"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                transform="scale(2.1) translate(-58, -58)"
                style={{ transition: "stroke-dashoffset 2s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-6xl font-bold text-gradient-score">{score}</span>
              <span className="text-sm text-muted-foreground font-medium">out of 100</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
            Competitive Level
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 max-w-xs">
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
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
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
              <span className="text-xs font-bold mb-2">{h.score}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(h.score / 100) * 160}px` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="w-full max-w-[40px] rounded-t-lg bg-gradient-score"
              />
              <span className="text-xs text-muted-foreground mt-2">{h.month}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
