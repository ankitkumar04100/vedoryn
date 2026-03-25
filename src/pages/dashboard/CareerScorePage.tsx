"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Brain,
  TrendingUp,
  Code,
  Briefcase,
  Mic,
  BookOpen,
  Activity,
  Sparkles,
  ArrowUpRight,
  Flame,
  Gauge,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";

/* --------------------------------------------------------------------------------
   Motion presets
-------------------------------------------------------------------------------- */
const fadeIn = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

/* --------------------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------------------- */
type BreakdownItem = { key: string; label: string; value: number; icon: React.ComponentType<any>; color: string; hint: string };
const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(n)));
const pct = (n: number) => `${clamp(n)}%`;

/* --------------------------------------------------------------------------------
   Spark Line (SVG) – no external libs
-------------------------------------------------------------------------------- */
function SparkLine({ values, className }: { values: number[]; className?: string }) {
  const w = 220;
  const h = 60;
  const max = Math.max(...values, 1);
  const step = w / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = h - (v / max) * h;
    return [x, y] as [number, number];
  });
  const d =
    points.length > 1
      ? `M ${points
          .map(([x, y], i) => (i === 0 ? `${x},${y}` : `L ${x},${y}`))
          .join(" ")}`
      : `M 0,${h} L ${w},${h}`;

  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <defs>
        <linearGradient id="glow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#glow)" strokeWidth="2.5" strokeLinecap="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.4} fill="#FDE68A" />
      ))}
    </svg>
  );
}

/* --------------------------------------------------------------------------------
   Stat Bar
-------------------------------------------------------------------------------- */
function StatBar({
  label,
  value,
  icon: Icon,
  color,
  hint,
  delay = 0,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  hint: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className="group"
      title={hint}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold">{pct(value)}</span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamp(value)}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full ${color} group-hover:opacity-90 transition`}
        />
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------------------------------
   Glow Button
-------------------------------------------------------------------------------- */
function GlowButton({
  children,
  onClick,
  to,
  tone = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  tone?: "primary" | "emerald" | "amber";
}) {
  const map: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-[0_0_28px_rgba(168,85,247,0.35)]",
    emerald:
      "bg-emerald-500/90 text-white hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]",
    amber:
      "bg-amber-500/90 text-white hover:shadow-[0_0_28px_rgba(245,158,11,0.35)]",
  };
  const cls =
    "inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold transition active:scale-[0.98]";
  if (to) {
    return (
      <a href={to} className={`${cls} ${map[tone]}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${cls} ${map[tone]}`}>
      {children}
    </button>
  );
}

/* --------------------------------------------------------------------------------
   Page Component
-------------------------------------------------------------------------------- */
export default function CareerScorePage() {
  const { profile } = useAuth();

  // HERO SCORE (0–40 for new users — mock dynamic)
  const [score, setScore] = useState<number>(() =>
    clamp(Math.floor(Math.random() * 41))
  );

  // Gamification + wellness (mock dynamic)
  const [xp, setXp] = useState<number>(() => Math.floor(Math.random() * 100));
  const [streak, setStreak] = useState<number>(() => Math.floor(Math.random() * 6)); // 0–5
  const [stress] = useState<number>(() => 4 + Math.floor(Math.random() * 4)); // 4–7
  const [focus] = useState<"Low" | "Medium" | "High">("Medium");

  // Progress & predictions (mock dynamic)
  const progress = useMemo<number[]>(
    () => [5, 10, 12, 18, 22].map((v) => v + Math.floor(Math.random() * 4)),
    []
  );
  const [predicted, setPredicted] = useState<number>(() =>
    clamp(score + Math.floor(Math.random() * 30))
  );

  // Breakdown metrics (mock dynamic)
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  useEffect(() => {
    const random40 = () => Math.floor(Math.random() * 40);
    setBreakdown([
      {
        key: "skills",
        label: "Technical Skills",
        value: random40(),
        icon: Code,
        color: "bg-primary",
        hint: "Improve by finishing 2 daily practice tasks.",
      },
      {
        key: "projects",
        label: "Project Quality",
        value: random40(),
        icon: Briefcase,
        color: "bg-accent",
        hint: "Ship small improvements weekly.",
      },
      {
        key: "interview",
        label: "Interview Readiness",
        value: random40(),
        icon: Mic,
        color: "bg-rose-500",
        hint: "Take one mock interview this week.",
      },
      {
        key: "consistency",
        label: "Consistency",
        value: random40(),
        icon: TrendingUp,
        color: "bg-emerald-500",
        hint: "Study at least 20 minutes every day.",
      },
      {
        key: "learning",
        label: "Learning Speed",
        value: random40(),
        icon: BookOpen,
        color: "bg-amber-500",
        hint: "Use focused sprints (45/15).",
      },
    ]);
  }, []);

  // AI Text (smart mock)
  const aiText = useMemo(() => {
    if (score < 20)
      return `Your journey has just begun. This is Day One — every small skill you build now creates massive growth.`;
    return `You are building momentum. Keep consistent — your growth can accelerate rapidly.`;
  }, [score]);

  // “What do you enjoy?” input (for engagement)
  const [enjoy, setEnjoy] = useState("");
  const [showGrowth, setShowGrowth] = useState(false);

  // Simulate Growth (+5 score, XP +12, prediction increase)
  const simulateGrowth = () => {
    setScore((s) => clamp(s + 5));
    setXp((x) => clamp(x + 12, 0, 100));
    setPredicted((p) => clamp(p + 7));
    setShowGrowth(true);
    setTimeout(() => setShowGrowth(false), 1700);
  };

  // Level logic
  const levelBadge = score < 20 ? "Beginner" : "Explorer";

  // Profile hints
  const displayName = profile?.display_name || "Explorer";

  return (
    <div className="space-y-10 max-w-6xl">
      {/* BACKDROP (works in light/dark) */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.12),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.10),transparent_45%)]" />
      </div>

      {/* TITLE */}
      <motion.div {...fadeIn}>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3 text-foreground">
          <Crown className="w-8 h-8 text-primary" />
          Career Score
        </h1>
        <p className="text-muted-foreground mt-1">
          Your AI-powered career readiness signal.
        </p>
      </motion.div>

      {/* HERO SCORE + AI COPY */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* HERO SCORE CARD */}
        <motion.div
          {...fadeIn}
          className="p-8 rounded-2xl bg-card border border-border shadow-card flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          {CareerScore3D ? (
            <CareerScore3D score={score} className="relative z-10" />
          ) : (
            <div className="relative z-10 w-64 h-64 rounded-full grid place-items-center border-2 border-primary/30">
              <span className="text-5xl font-bold">{score}</span>
            </div>
          )}

          <div className="relative z-10 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mt-3">
            {score >= 35 ? "👑 Emerging Competitive" : score >= 20 ? "📈 Building Momentum" : "🌱 Getting Started"}
          </div>

          <p className="relative z-10 text-center text-sm text-muted-foreground mt-4 max-w-md">
            {aiText}
          </p>

          {/* Day‑1 Engagement Question */}
          <div className="relative z-10 mt-5 w-full max-w-md">
            <label className="block text-xs text-muted-foreground mb-1">
              What is one thing you genuinely enjoy doing?
            </label>
            <div className="flex gap-2">
              <input
                value={enjoy}
                onChange={(e) => setEnjoy(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-background/60 border border-border text-foreground outline-none"
                placeholder="e.g., Solving problems, designing, writing…"
              />
              <GlowButton tone="amber" onClick={() => setEnjoy("")}>
                Save
              </GlowButton>
            </div>
          </div>

          {/* Simulate Growth */}
          <div className="relative z-10 mt-5 flex items-center gap-3">
            <GlowButton tone="primary" onClick={simulateGrowth}>
              Simulate Growth +5
            </GlowButton>
            <a href="/dashboard/roadmap" className="text-sm text-primary hover:underline flex items-center gap-1">
              Start Roadmap <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Growth banner */}
          <AnimatePresence>
            {showGrowth && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs"
              >
                +5 Growth Achieved • +12 XP
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* BREAKDOWN */}
        <motion.div
          {...fadeIn}
          className="p-8 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-6 text-foreground">
            Score Breakdown
          </h3>
          <div className="space-y-5">
            {breakdown.map((b, i) => (
              <StatBar
                key={b.key}
                label={b.label}
                value={b.value}
                icon={b.icon}
                color={b.color}
                hint={b.hint}
                delay={0.1 + i * 0.08}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* INSIGHT + PROGRESS */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI INSIGHT CARD */}
        <motion.div
          {...fadeIn}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-3 text-foreground">
            AI Insight
          </h3>

          {/* Conditional mock insight */}
          {score < 20 ? (
            <div className="space-y-2 text-sm">
              <InsightRow title="Strength" text="Curiosity detected" tone="emerald" />
              <InsightRow title="Weakness" text="Lack of structured learning" tone="rose" />
              <InsightRow title="Action" text="Start with 1 task today" tone="amber" />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <InsightRow title="Strength" text="Good learning pace" tone="emerald" />
              <InsightRow title="Weakness" text="Consistency missing" tone="rose" />
              <InsightRow title="Action" text="Maintain 2 tasks daily" tone="amber" />
            </div>
          )}
        </motion.div>

        {/* PROGRESS GRAPH + FUTURE PREDICTION */}
        <motion.div
          {...fadeIn}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-lg text-foreground">
              Progress (Last 5 sessions)
            </h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-4 h-4" /> live mock
            </span>
          </div>
          <SparkLine values={progress} className="w-full" />

          <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
            <div className="text-sm text-muted-foreground">Future Prediction (mock)</div>
            <div className="mt-1 text-foreground">
              At your current pace, you can reach{" "}
              <span className="font-semibold">{predicted}</span> in 30 days.
            </div>
          </div>
        </motion.div>
      </div>

      {/* ACTIONS + LEVEL + GAMIFICATION + WELLNESS */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* ACTION BUTTONS */}
        <motion.div
          {...fadeIn}
          className="p-6 rounded-2xl bg-card border border-border shadow-card flex flex-col gap-3"
        >
          <h3 className="font-display font-semibold text-lg text-foreground">
            Take Action
          </h3>
          <GlowButton tone="amber" onClick={simulateGrowth}>
            Improve Score
          </GlowButton>
          <GlowButton tone="primary" to="/dashboard/roadmap">
            Start Roadmap
          </GlowButton>
          <GlowButton tone="emerald" to="/dashboard/interviews">
            Practice Interview
          </GlowButton>
          <GlowButton tone="primary" to="/dashboard/study">
            Study Now
          </GlowButton>
        </motion.div>

        {/* LEVEL SYSTEM */}
        <motion.div
          {...fadeIn}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg text-foreground">
            Level
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 grid place-items-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-foreground font-semibold">{levelBadge}</div>
              <div className="text-xs text-muted-foreground">
                Keep growing to unlock “Proficient”
              </div>
            </div>
          </div>
        </motion.div>

        {/* GAMIFICATION */}
        <motion.div
          {...fadeIn}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg text-foreground">
            Gamification
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">XP</span>
              <span className="font-semibold">{xp} / 100</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clamp(xp)}%` }}
                transition={{ duration: 1.1 }}
                className="h-full bg-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-muted-foreground">Streak</span>
              <span className="font-semibold flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" />
                {streak} days
              </span>
            </div>
          </div>
        </motion.div>

        {/* WELLNESS */}
        <motion.div
          {...fadeIn}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg text-foreground">
            Wellness
          </h3>
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Stress</span>
              <span className="font-semibold">{stress}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Focus</span>
              <span className="font-semibold">{focus}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Balanced but can improve with routine.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer hint */}
      <div className="text-xs text-muted-foreground">
        Tip: Use “Simulate Growth” to preview how small actions improve your score.
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------------
   Insight Row
-------------------------------------------------------------------------------- */
function InsightRow({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: "emerald" | "amber" | "rose";
}) {
  const map = {
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  };
  return (
    <div className={`p-3 rounded-lg border ${map[tone]}`}>
      <span className="font-semibold mr-2">{title}:</span>
      <span>{text}</span>
    </div>
  );
}

/* --------------------------------------------------------------------------------
   OPTIONAL FALLBACK for CareerScore3D
   If you don't have the 3D component, you can use this:
-------------------------------------------------------------------------------- */
/*
export function CareerScore3D({ score, className }: { score: number; className?: string }) {
  const radius = 90;
  const stroke = 12;
  const size = 2 * (radius + stroke);
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <g>
          <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="text-5xl font-bold">
            {score}
          </text>
          <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="rgba(255,255,255,0.6)" className="text-xs">
            /100
          </text>
        </g>
      </svg>
    </div>
  );
}
*/
