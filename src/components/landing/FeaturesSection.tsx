import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Mic,
  Briefcase,
  GraduationCap,
  Users,
  Shield,
  Heart,
  Gamepad2,
  BarChart3,
  BookOpen,
  Map,
  Newspaper,
  FileSearch,
  LayoutDashboard,
  Layers,
} from "lucide-react";

// EXTENDED + IMPROVED FEATURE SET
const features = [
  {
    icon: Brain,
    title: "Career Score",
    desc: "A dynamic, AI‑powered 0–100 score that represents your real career readiness.",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Probability Engine",
    desc: "AI predicts success odds for any career goal using real performance data.",
    color: "text-accent",
  },
  {
    icon: Map,
    title: "AI Roadmaps",
    desc: "Auto‑generated step-by-step paths tailored to your career objective.",
    color: "text-vedoryn-orange",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    desc: "Improve with AI‑driven interview simulations + detailed performance analysis.",
    color: "text-vedoryn-pink",
  },
  {
    icon: Briefcase,
    title: "Smart Job Match",
    desc: "Find real opportunities using AI-powered skill matching and readiness ranking.",
    color: "text-vedoryn-emerald",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Finder",
    desc: "AI scans relevant scholarships and filters by your eligibility instantly.",
    color: "text-vedoryn-gold",
  },
  {
    icon: Users,
    title: "Mentor Marketplace",
    desc: "Connect with top domain experts for personalized 1-on-1 guidance.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Proof Layer",
    desc: "All your achievements verified and stored in a trustable profile.",
    color: "text-vedoryn-cyan",
  },
  {
    icon: Heart,
    title: "Wellness Monitor",
    desc: "Maintain sustainable habits with burnout detection and health tracking.",
    color: "text-vedoryn-pink",
  },
  {
    icon: Gamepad2,
    title: "Gamification",
    desc: "XP, levels, streaks, achievements, badges & leaderboards to stay motivated.",
    color: "text-vedoryn-orange",
  },
  {
    icon: BarChart3,
    title: "Recruiter Dashboard",
    desc: "Advanced hiring analytics with verified candidate profiles.",
    color: "text-vedoryn-emerald",
  },
  {
    icon: BookOpen,
    title: "Study Planner",
    desc: "AI‑generated schedules with auto-rescheduling based on progress.",
    color: "text-vedoryn-gold",
  },

  // ⭐ NEW FEATURES YOU REQUESTED
  {
    icon: LayoutDashboard,
    title: "Parents Dashboard",
    desc: "Parents can track progress, strengths, weaknesses & career readiness.",
    color: "text-purple-500",
  },
  {
    icon: Layers,
    title: "Courses System",
    desc: "Access curated courses aligned with your roadmap and skill gaps.",
    color: "text-blue-500",
  },
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    desc: "AI deeply analyzes your resume and improves ATS score instantly.",
    color: "text-green-500",
  },
  {
    icon: Newspaper,
    title: "Education News",
    desc: "Stay updated with the latest industry trends, exams & job market insights.",
    color: "text-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 -z-10 opacity-50 dark:opacity-40 pointer-events-none">
        <div className="absolute top-10 left-20 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-purple-500/10 dark:bg-purple-400/5 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Features
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-bold mt-3 mb-4 text-foreground">
            The Complete{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-purple-400">
              Career OS
            </span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything required to build a successful career — measured, guided,
            optimized, and powered by real intelligence.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {features.map((ft, i) => (
            <motion.div
              key={ft.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="
                p-6 rounded-2xl
                backdrop-blur-xl
                bg-white/30 dark:bg-white/5
                border border-white/40 dark:border-white/10
                shadow-md dark:shadow-none
                transition-all duration-300 cursor-default
                hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/20
              "
            >
              <ft.icon
                className={`w-10 h-10 mb-4 ${ft.color} transition-transform group-hover:scale-110`}
              />

              <h3 className="font-display font-semibold text-xl mb-2 text-foreground">
                {ft.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {ft.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
