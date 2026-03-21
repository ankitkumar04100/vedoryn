import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Briefcase, Mic, BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";
import { useAuth } from "@/hooks/useAuth";

const quickActions = [
  { label: "Practice Interview", icon: Mic, href: "/dashboard/interviews", color: "bg-vedoryn-pink/10 text-vedoryn-pink hover:bg-vedoryn-pink/20" },
  { label: "View Roadmap", icon: Target, href: "/dashboard/roadmap", color: "bg-vedoryn-cyan/10 text-vedoryn-cyan hover:bg-vedoryn-cyan/20" },
  { label: "Study Planner", icon: BookOpen, href: "/dashboard/study", color: "bg-vedoryn-orange/10 text-vedoryn-orange hover:bg-vedoryn-orange/20" },
  { label: "Browse Jobs", icon: Briefcase, href: "/dashboard/jobs", color: "bg-vedoryn-green/10 text-vedoryn-green hover:bg-vedoryn-green/20" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function DashboardOverview() {
  const { profile, isGuest } = useAuth();
  const careerScore = profile?.career_score ?? 0;
  const displayName = profile?.display_name || "Explorer";
  const skillCount = profile?.skills?.length ?? 0;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;

  const quickStats = [
    { label: "Career Score", value: String(careerScore), icon: Brain, color: "text-primary", bg: "bg-primary/10" },
    { label: "Skills", value: String(skillCount), icon: TrendingUp, color: "text-vedoryn-cyan", bg: "bg-vedoryn-cyan/10" },
    { label: "Level", value: String(level), icon: Mic, color: "text-vedoryn-pink", bg: "bg-vedoryn-pink/10" },
    { label: "XP", value: String(xp), icon: Briefcase, color: "text-vedoryn-green", bg: "bg-vedoryn-green/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
      <motion.div variants={item}>
        <h1 className="font-display text-3xl font-bold">
          Welcome{isGuest ? ", Guest" : `, ${displayName}`}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {profile?.career_goal
            ? `Tracking your path to ${profile.career_goal}`
            : "Set your career goal to get personalized insights"}
        </p>
        {!profile?.onboarding_complete && !isGuest && (
          <Link to="/onboarding" className="inline-flex items-center gap-2 mt-2 text-sm text-primary font-medium hover:underline">
            Complete onboarding for a personalized experience <ArrowUpRight className="w-3 h-3" />
          </Link>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <motion.div key={stat.label} variants={item} whileHover={{ scale: 1.03, y: -2 }} transition={{ type: "spring", stiffness: 300 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow cursor-default">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="font-display text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item}
          className="p-6 rounded-xl bg-card border border-border shadow-card flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-vedoryn-cyan/5" />
          <h3 className="font-display font-semibold text-lg mb-2 relative z-10">Career Score</h3>
          <CareerScore3D score={careerScore} className="relative z-10 max-w-[200px]" />
          <Link to="/dashboard/career-score" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline relative z-10 mt-2">
            View Details <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:translate-x-1 duration-200 ${a.color}`}>
                <a.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4">Your Profile</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Goal</span><span className="font-medium">{profile?.career_goal || "Not set"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Level</span><span className="font-medium capitalize">{profile?.experience_level || "Beginner"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Daily Hours</span><span className="font-medium">{profile?.daily_hours ?? 0}h</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Skills</span><span className="font-medium">{skillCount} tracked</span></div>
            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {profile.skills.slice(0, 6).map(s => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-secondary font-medium">{s}</span>
                ))}
                {profile.skills.length > 6 && <span className="text-xs text-muted-foreground">+{profile.skills.length - 6}</span>}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
