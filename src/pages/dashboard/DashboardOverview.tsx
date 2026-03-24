"use client";

import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Briefcase,
  Mic,
  BookOpen,
  ArrowUpRight,
  Crown,
  Activity,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";
import { useAuth } from "@/hooks/useAuth";

/* ============================================================
   ANIMATION PRESETS
============================================================ */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220 } },
};

/* ============================================================
   AI-Generated Dynamic Insight
============================================================ */

function generateInsight(profile: any) {
  if (!profile) return "Start your journey to unlock insights.";

  const xp = profile.xp ?? 0;
  const skills = profile.skills?.length ?? 0;
  const level = profile.level ?? 1;
  const dailyHours = profile.daily_hours ?? 1;
  const motivation = profile.motivation_level ?? 5;

  if (skills === 0) return "Add skills to unlock your personalized insights.";

  if (xp < 50) return "Great start! Keep building XP to unlock more insights.";

  if (motivation >= 8)
    return "🔥 High motivation detected — accelerate your roadmap!";

  if (dailyHours >= 4)
    return "Your dedication is impressive. This pace will push you ahead.";

  if (skills > 8)
    return "You’ve built diverse skills — time to specialize for mastery.";

  if (level >= 3)
    return "Leveling up fast — your learning velocity is above average.";

  return "Stay consistent — your progress curve is rising.";
}

/* ============================================================
   QUICK ACTIONS
============================================================ */

const quickActions = [
  {
    label: "Practice Interview",
    icon: Mic,
    href: "/dashboard/interviews",
    color:
      "bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-accent/20 hover:shadow-lg",
  },
  {
    label: "View Roadmap",
    icon: Target,
    href: "/dashboard/roadmap",
    color:
      "bg-vedoryn-emerald/10 text-vedoryn-emerald hover:bg-vedoryn-emerald/20 hover:shadow-emerald-500/20 hover:shadow-lg",
  },
  {
    label: "Study Planner",
    icon: BookOpen,
    href: "/dashboard/study",
    color:
      "bg-vedoryn-orange/10 text-vedoryn-orange hover:bg-vedoryn-orange/20 hover:shadow-orange-500/20 hover:shadow-lg",
  },
  {
    label: "Browse Jobs",
    icon: Briefcase,
    href: "/dashboard/jobs",
    color:
      "bg-vedoryn-green/10 text-vedoryn-green hover:bg-vedoryn-green/20 hover:shadow-green-500/20 hover:shadow-lg",
  },
];

/* ============================================================
   DASHBOARD COMPONENT
============================================================ */

export default function DashboardOverview() {
  const { profile, isGuest } = useAuth();

  const careerScore = profile?.career_score ?? 0;
  const displayName = profile?.display_name || "Explorer";
  const skillCount = profile?.skills?.length ?? 0;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;

  const dynamicInsight = generateInsight(profile);

  const quickStats = [
    {
      label: "Career Score",
      value: String(careerScore),
      icon: Brain,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Skills",
      value: String(skillCount),
      icon: TrendingUp,
      color: "text-vedoryn-emerald",
      bg: "bg-vedoryn-emerald/10",
    },
    {
      label: "Level",
      value: String(level),
      icon: Crown,
      color: "text-vedoryn-gold",
      bg: "bg-vedoryn-gold/10",
    },
    {
      label: "XP",
      value: String(xp),
      icon: Activity,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 max-w-6xl"
    >
      {/* ============================================================
          1. WELCOME SECTION (Royal AI Insight)
      ============================================================ */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          👑 Welcome back{isGuest ? ", Guest" : `, ${displayName}`}!
        </h1>

        <p className="text-muted-foreground text-sm">{dynamicInsight}</p>

        {!profile?.onboarding_complete && !isGuest && (
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 mt-2 text-sm text-primary font-medium hover:underline"
          >
            Complete onboarding for a personalized experience{" "}
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        )}
      </motion.div>

      {/* ============================================================
          2. DYNAMIC STATS GRID
      ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.04, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow cursor-default 
                       backdrop-blur-xl royal-glow"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="font-display text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ============================================================
          3. SCORE CARD + ACTION PANEL + PROFILE CARD
      ============================================================ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Career Score */}
        <motion.div
          variants={item}
          className="p-6 rounded-xl bg-card border border-border shadow-card
                     flex flex-col items-center relative overflow-hidden royal-border"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <h3 className="font-display font-semibold text-lg mb-2 relative z-10">
            Career Score
          </h3>

          <CareerScore3D
            score={careerScore}
            className="relative z-10 max-w-[200px]"
          />

          <Link
            to="/dashboard/career-score"
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline relative z-10 mt-2"
          >
            View Details <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={item}
          className="p-6 rounded-xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.href}
                className={`${a.color} flex items-center gap-3 px-4 py-3 rounded-lg 
                           transition-all hover:translate-x-1 duration-200`}
              >
                <a.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Profile Snapshot */}
        <motion.div
          variants={item}
          className="p-6 rounded-xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-4">
            Your Profile
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goal</span>
              <span className="font-medium">
                {profile?.career_goal || "Not set"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium capitalize">
                {profile?.experience_level || "Beginner"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Hours</span>
              <span className="font-medium">
                {profile?.daily_hours ?? 0}h
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Skills</span>
              <span className="font-medium">{skillCount} tracked</span>
            </div>

            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {profile.skills.slice(0, 6).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary font-medium"
                  >
                    {s}
                  </span>
                ))}
                {profile.skills.length > 6 && (
                  <span className="text-xs text-muted-foreground">
                    +{profile.skills.length - 6}
                  </span>
                )}
              </div>
            )}
          </div>

          <Link
            to="/dashboard/profile"
            className="mt-4 inline-flex items-center text-sm text-primary font-medium hover:underline"
          >
            View Full Profile <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
