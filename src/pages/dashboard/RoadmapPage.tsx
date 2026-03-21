import { motion } from "framer-motion";
import { Map, CheckCircle2, Circle, Lock } from "lucide-react";

const roadmapSteps = [
  { title: "Learn Python Fundamentals", status: "done", desc: "Variables, loops, functions, OOP" },
  { title: "Statistics & Probability", status: "done", desc: "Distributions, hypothesis testing, Bayes theorem" },
  { title: "Data Manipulation with Pandas", status: "done", desc: "DataFrames, cleaning, transformation" },
  { title: "Data Visualization", status: "current", desc: "Matplotlib, Seaborn, storytelling with data" },
  { title: "Machine Learning Basics", status: "locked", desc: "Regression, classification, clustering" },
  { title: "Deep Learning Introduction", status: "locked", desc: "Neural networks, TensorFlow, PyTorch" },
  { title: "Build ML Projects", status: "locked", desc: "End-to-end projects with real datasets" },
  { title: "Apply for Data Science Roles", status: "locked", desc: "Resume, portfolio, interview prep" },
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Map className="w-8 h-8 text-vedoryn-cyan" /> Career Roadmap
        </h1>
        <p className="text-muted-foreground mt-1">Your personalized path to <span className="text-primary font-semibold">Data Scientist</span></p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-4 inline-flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-vedoryn-green" /> <span>Completed</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" /> <span>Current</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-muted" /> <span>Upcoming</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {roadmapSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative pl-16 ${step.status === "locked" ? "opacity-50" : ""}`}
            >
              <div className="absolute left-4 top-1">
                {step.status === "done" ? (
                  <CheckCircle2 className="w-5 h-5 text-vedoryn-green" />
                ) : step.status === "current" ? (
                  <Circle className="w-5 h-5 text-primary fill-primary animate-pulse" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className={`p-5 rounded-xl border ${
                step.status === "current"
                  ? "bg-primary/5 border-primary/30 shadow-glow"
                  : "bg-card border-border"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                  {step.status === "done" && <span className="text-xs font-medium text-vedoryn-green">✓ Complete</span>}
                  {step.status === "current" && <span className="text-xs font-medium text-primary">In Progress</span>}
                </div>
                <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
