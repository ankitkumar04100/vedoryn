import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Briefcase, Mic, BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function DashboardOverview() {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (careerScore / 100) * circumference;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your career intelligence overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card"
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
        {/* Career Score Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl bg-card border border-border shadow-card flex flex-col items-center"
        >
          <h3 className="font-display font-semibold text-lg mb-4">Career Score</h3>
          <div className="relative mb-4">
            <svg width="160" height="160" className="-rotate-90">
              <circle cx="80" cy="80" r="40" fill="none" className="stroke-secondary" strokeWidth="8" transform="scale(1.8) translate(-36, -36)" />
              <circle
                cx="80" cy="80" r="40" fill="none" className="stroke-primary"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                transform="scale(1.8) translate(-36, -36)"
                style={{ transition: "stroke-dashoffset 2s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-gradient-score">{careerScore}</span>
              <span className="text-xs text-muted-foreground">Competitive</span>
            </div>
          </div>
          <Link to="/dashboard/career-score" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View Details <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${a.color}`}
              >
                <a.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{a.action}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
                <span className="text-xs font-medium text-vedoryn-green">{a.points}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
