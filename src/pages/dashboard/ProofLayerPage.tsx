import { motion } from "framer-motion";
import { Shield, Award, Github, Globe, CheckCircle2 } from "lucide-react";

const badges = [
  { title: "Python Verified", level: "Advanced", verified: true, icon: "🐍" },
  { title: "React Developer", level: "Intermediate", verified: true, icon: "⚛️" },
  { title: "SQL Expert", level: "Advanced", verified: true, icon: "🗃️" },
  { title: "Machine Learning", level: "Beginner", verified: false, icon: "🧠" },
  { title: "System Design", level: "Intermediate", verified: false, icon: "🏗️" },
];

const projects = [
  { title: "E-Commerce Analytics Dashboard", tech: ["React", "Python", "SQL"], impact: "High", verified: true },
  { title: "Sentiment Analysis Tool", tech: ["Python", "NLP", "Flask"], impact: "Medium", verified: true },
  { title: "Portfolio Website", tech: ["React", "Tailwind"], impact: "Low", verified: false },
];

export default function ProofLayerPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-vedoryn-cyan" /> Proof Layer
        </h1>
        <p className="text-muted-foreground mt-1">Your verified skills, projects, and achievements.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-vedoryn-gold" /> Skill Badges
          </h3>
          <div className="space-y-3">
            {badges.map(b => (
              <div key={b.title} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <span className="text-2xl">{b.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{b.title}</span>
                    {b.verified && <CheckCircle2 className="w-3 h-3 text-vedoryn-green" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{b.level}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.verified ? "bg-vedoryn-green/10 text-vedoryn-green" : "bg-muted text-muted-foreground"}`}>
                  {b.verified ? "Verified" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Github className="w-5 h-5" /> Projects
          </h3>
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.title} className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold">{p.title}</h4>
                  {p.verified && <CheckCircle2 className="w-3 h-3 text-vedoryn-green" />}
                </div>
                <div className="flex gap-2 mb-2">
                  {p.tech.map(t => <span key={t} className="px-2 py-0.5 text-xs rounded-md bg-secondary">{t}</span>)}
                </div>
                <span className={`text-xs font-medium ${p.impact === "High" ? "text-vedoryn-green" : p.impact === "Medium" ? "text-vedoryn-orange" : "text-muted-foreground"}`}>
                  Impact: {p.impact}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
