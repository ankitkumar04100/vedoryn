import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Briefcase, Mic, BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";

const careerScore = 72;

const quickStats = [
  { label: "Career Score", value: "72", icon: Brain, color: "text-primary", bg: "bg-primary/10", change: "+5" },
  { label: "Skills Tracked", value: "14", icon: TrendingUp, color: "text-vedoryn-cyan", bg: "bg-vedoryn-cyan/10", change: "+2" },
  { label: "Interviews Done", value: "8", icon: Mic, color: "text-vedoryn-pink", bg: "bg-vedoryn-pink/10", change: "+1" },
  { label: "Job Matches", value: "23", icon: Briefcase, color: "text-vedoryn-green", bg: "bg-vedoryn-green/10", change: "+6" },
];

const recentActivity = [
  { action: "Completed Python Assessment", time: "2h ago", points: "+15 XP" },
  { action: "AI Interview: Frontend Dev", time: "5h ago", points: "+25 XP" },
  { action: "Updated Resume", time: "1d ago", points: "+10 XP" },
  { action: "Finished React Roadmap Step 3", time: "2d ago", points: "+20 XP" },
];

const quickActions = [
  { label: "Practice Interview", icon: Mic, href: "/dashboard/interviews", color: "bg-vedoryn-pink/10 text-vedoryn-pink hover:bg-vedoryn-pink/20" },
  { label: "View Roadmap", icon: Target, href: "/dashboard/roadmap", color: "bg-vedoryn-cyan/10 text-vedoryn-cyan hover:bg-vedoryn-cyan/20" },
  { label: "Study Planner", icon: BookOpen, href: "/dashboard/study", color: "bg-vedoryn-orange/10 text-vedoryn-orange hover:bg-vedoryn-orange/20" },
  { label: "Browse Jobs", icon: Briefcase, href: "/dashboard/jobs", color: "bg-vedoryn-green/10 text-vedoryn-green hover:bg-vedoryn-green/20" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardOverview() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-6xl">
      <motion.div variants={item}>
        <h1 className="font-display text-3xl font-bold">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your career intelligence overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-vedoryn-green">{stat.change}</span>
            </div>
            <div className="font-display text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 3D Career Score */}
        <motion.div
          variants={item}
          className="p-6 rounded-xl bg-card border border-border shadow-card flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-vedoryn-cyan/5" />
          <h3 className="font-display font-semibold text-lg mb-2 relative z-10">Career Score</h3>
          <CareerScore3D score={careerScore} className="relative z-10 max-w-[200px]" />
          <Link to="/dashboard/career-score" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline relative z-10 mt-2">
            View Details <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="p-6 rounded-xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:translate-x-1 duration-200 ${a.color}`}
              >
                <a.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="p-6 rounded-xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{a.action}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
                <span className="text-xs font-medium text-vedoryn-green">{a.points}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
