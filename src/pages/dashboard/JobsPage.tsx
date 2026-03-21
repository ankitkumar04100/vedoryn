import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const jobs = [
  { title: "Frontend Developer", company: "TechCorp", location: "Remote", salary: "₹8-12 LPA", match: 92, skills: ["React", "TypeScript", "Tailwind"] },
  { title: "Data Analyst", company: "DataFlow", location: "Bangalore", salary: "₹6-10 LPA", match: 85, skills: ["Python", "SQL", "Tableau"] },
  { title: "Full Stack Developer", company: "BuildIt", location: "Hybrid", salary: "₹10-15 LPA", match: 78, skills: ["React", "Node.js", "PostgreSQL"] },
  { title: "ML Engineer", company: "AI Labs", location: "Mumbai", salary: "₹12-18 LPA", match: 65, skills: ["Python", "TensorFlow", "MLOps"] },
  { title: "Backend Developer", company: "ScaleUp", location: "Remote", salary: "₹9-14 LPA", match: 88, skills: ["Node.js", "Express", "MongoDB"] },
];

function matchColor(m: number) {
  if (m >= 85) return "text-vedoryn-green bg-vedoryn-green/10";
  if (m >= 70) return "text-primary bg-primary/10";
  return "text-vedoryn-orange bg-vedoryn-orange/10";
}

export default function JobsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-vedoryn-green" /> Jobs & Internships
        </h1>
        <p className="text-muted-foreground mt-1">AI-matched opportunities based on your career readiness.</p>
      </div>

      <div className="space-y-4">
        {jobs.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display font-semibold text-lg">{job.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${matchColor(job.match)}`}>
                    {job.match}% Match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-3">{job.company}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {job.skills.map((s) => (
                    <span key={s} className="px-2 py-1 text-xs rounded-md bg-secondary font-medium">{s}</span>
                  ))}
                </div>
              </div>
              <Button className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90 shrink-0">
                Apply <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
