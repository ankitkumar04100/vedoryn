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

/* -----------------------------------------------------------
   ANIMATIONS
----------------------------------------------------------- */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220 } },
};

/* -----------------------------------------------------------
   DEFAULT STARTING VALUES (SMART, REALISTIC)
----------------------------------------------------------- */
const defaultStats = {
  careerScore: 8,
  level: 1,
  xp: 20,
  skills: 3,
  hours: 2,
  streak: 0,
};

const quickActions = [
  {
    label: "Practice Interview",
    icon: Mic,
    href: "/dashboard/interviews",
    color:
      "bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-accent/20 hover:shadow-xl",
  },
  {
    label: "View Roadmap",
    icon: Target,
    href: "/dashboard/roadmap",
    color:
      "bg-vedoryn-emerald/10 text-vedoryn-emerald hover:bg-vedoryn-emerald/20 hover:shadow-emerald-500/20 hover:shadow-xl",
  },
  {
    label: "Study Planner",
    icon: BookOpen,
    href: "/dashboard/study",
    color:
      "bg-vedoryn-orange/10 text-vedoryn-orange hover:bg-vedoryn-orange/20 hover:shadow-orange-500/20 hover:shadow-xl",
  },
  {
    label: "Explore Jobs",
    icon: Briefcase,
    href: "/dashboard/jobs",
    color:
      "bg-vedoryn-green/10 text-vedoryn-green hover:bg-vedoryn-green/20 hover:shadow-green-500/20 hover:shadow-xl",
  },
];

/* -----------------------------------------------------------
   DASHBOARD COMPONENT
----------------------------------------------------------- */
export default function DashboardOverview() {
  const stats = defaultStats;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 max-w-6xl"
    >
      {/* -----------------------------------------------------------
          1. WELCOME BLOCK — DAY 1 EXPERIENCE
      ----------------------------------------------------------- */}
      <motion.div variants={item}>
        <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border shadow-xl royal-glow">
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            👑 Welcome, Explorer
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Your AI-powered career journey has begun.
          </p>

          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm shadow-inner">
            <p className="text-primary font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              “You’re at the starting stage. With just 7 days of consistency,
              you can unlock your first major milestone.”
            </p>
          </div>

          <Link
            to="/dashboard/roadmap"
            className="inline-flex items-center mt-5 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-semibold shadow-lg hover:scale-[1.03] active:scale-[0.97] transition"
          >
            Start Your First Step
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </motion.div>

      {/* -----------------------------------------------------------
          2. INITIALIZED STARTER STATS (REALISTIC)
      ----------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item} className="glass-card">
          <div className="stat-icon bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div className="stat-value">{stats.careerScore}</div>
          <div className="stat-label">Career Score</div>
        </motion.div>

        <motion.div variants={item} className="glass-card">
          <div className="stat-icon bg-vedoryn-gold/10">
            <Crown className="w-5 h-5 text-vedoryn-gold" />
          </div>
          <div className="stat-value">Level {stats.level}</div>
          <div className="stat-label">Beginner</div>
        </motion.div>

        <motion.div variants={item} className="glass-card">
          <div className="stat-icon bg-accent/10">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div className="stat-value">{stats.xp} XP</div>
          <div className="stat-label">Experience</div>
        </motion.div>

        <motion.div variants={item} className="glass-card">
          <div className="stat-icon bg-vedoryn-emerald/10">
            <TrendingUp className="w-5 h-5 text-vedoryn-emerald" />
          </div>
          <div className="stat-value">{stats.skills}</div>
          <div className="stat-label">Skills</div>
        </motion.div>
      </div>

      {/* -----------------------------------------------------------
          3. AI INSIGHT PANEL
      ----------------------------------------------------------- */}
      <motion.div variants={item}>
        <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border royal-border shadow-xl">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            🧠 AI Insights
          </h3>

          <div className="space-y-3 text-sm">
            <div className="insight-block insight-positive">
              <strong>Strength:</strong> You have strong learning potential.
            </div>

            <div className="insight-block insight-negative">
              <strong>Weakness:</strong> Your career goal is not defined yet.
            </div>

            <div className="insight-block insight-neutral">
              <strong>Suggestion:</strong> Start by selecting a career path or
              exploring your roadmap.
            </div>
          </div>
        </div>
      </motion.div>

      {/* -----------------------------------------------------------
          4. QUICK ACTION COMMAND CENTER
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">
          Quick Actions
        </h3>

        <div className="grid sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={`action-btn ${action.color}`}
            >
              <action.icon className="w-5 h-5" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* -----------------------------------------------------------
          5. ROADMAP PREVIEW
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-3">
          Your Roadmap
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="step-active" />
            <div>
              <div className="font-medium">Step 1 — Getting Started</div>
              <div className="text-muted-foreground text-xs">
                Your first guided action
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-60">
            <div className="step-locked" />
            <div>
              <div className="font-medium">Step 2 — Foundation Skills</div>
              <div className="text-muted-foreground text-xs">
                Unlock by completing Step 1
              </div>
            </div>
          </div>

          <div className="progress mt-4">
            <div className="progress-bar" style={{ width: "5%" }} />
          </div>

          <Link
            to="/dashboard/roadmap"
            className="btn-primary mt-4 inline-flex items-center"
          >
            Start Step 1
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </motion.div>

      {/* -----------------------------------------------------------
          6. ACTIVITY PANEL (DAY-1 EMPTY STATE)
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-2">
          Activity
        </h3>

        <p className="text-muted-foreground text-sm">
          No activity yet — your journey begins now.
        </p>

        <Link
          to="/dashboard/study"
          className="btn-secondary mt-3 inline-flex items-center gap-2"
        >
          Start First Task <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* -----------------------------------------------------------
          7. WELLNESS PANEL
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-2">
          Wellness & Balance
        </h3>

        <div className="space-y-2 text-sm">
          <div>Stress Level: 5/10</div>
          <div>Motivation: 7/10</div>
          <div>Productivity: Moderate</div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          “You are in a balanced state. Maintain consistency.”
        </p>
      </motion.div>

      {/* -----------------------------------------------------------
          8. GAMIFICATION PANEL
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-2">Gamification</h3>

        <div className="text-sm space-y-1">
          <div>Level: 1</div>
          <div>XP: 20 / 100</div>
          <div className="badge mt-3">🟢 Starter Badge Unlocked</div>
        </div>
      </motion.div>

      {/* -----------------------------------------------------------
          9. PROFILE SNAPSHOT
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">
          Profile Snapshot
        </h3>

        <div className="space-y-2 text-sm">
          <div>Career Goal: Not set</div>
          <div>Education: Undergraduate</div>
          <div>Daily Hours: 2h</div>
          <div>Auto Skills Added: HTML, Communication, Logic</div>
        </div>

        <Link
          to="/dashboard/profile"
          className="btn-secondary mt-4 inline-flex items-center gap-2"
        >
          Complete Profile <ArrowUpRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* -----------------------------------------------------------
          10. FIRST MISSION
      ----------------------------------------------------------- */}
      <motion.div variants={item} className="p-6 rounded-2xl bg-card/60 border border-border shadow-card">
        <h3 className="font-display font-semibold text-xl mb-3">
          🚀 Your First Mission
        </h3>

        <div className="space-y-3 text-sm">
          <button className="mission-btn">Define Career Goal</button>
          <button className="mission-btn">Take Skill Assessment</button>
          <button className="mission-btn">Start Roadmap</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
