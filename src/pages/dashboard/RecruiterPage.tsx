import { motion } from "framer-motion";
import { BarChart3, Users, Filter, TrendingUp } from "lucide-react";

const candidates = [
  { name: "Aisha Khan", score: 89, skills: ["React", "Node.js", "TypeScript"], verified: 5, status: "Available" },
  { name: "Rohan Mehta", score: 85, skills: ["Python", "ML", "SQL"], verified: 4, status: "Available" },
  { name: "Priya Singh", score: 82, skills: ["Java", "Spring", "AWS"], verified: 4, status: "Interviewing" },
  { name: "Vikram Patel", score: 78, skills: ["React", "Python", "Docker"], verified: 3, status: "Available" },
];

export default function RecruiterPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-vedoryn-green" /> Recruiter Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Data-driven hiring with verified candidate profiles.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Verified Candidates", value: "1,240", icon: Users, color: "text-primary bg-primary/10" },
          { label: "Avg Career Score", value: "68", icon: TrendingUp, color: "text-vedoryn-cyan bg-vedoryn-cyan/10" },
          { label: "Match Accuracy", value: "94%", icon: Filter, color: "text-vedoryn-green bg-vedoryn-green/10" },
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

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Top Candidates</h3>
        </div>
        <div className="divide-y divide-border">
          {candidates.map(c => (
            <div key={c.name} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="flex gap-2 mt-1">
                    {c.skills.map(s => <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-secondary">{s}</span>)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-bold">{c.score}</div>
                <div className="text-xs text-muted-foreground">{c.verified} verified skills</div>
                <span className={`text-xs font-medium ${c.status === "Available" ? "text-vedoryn-green" : "text-vedoryn-orange"}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
