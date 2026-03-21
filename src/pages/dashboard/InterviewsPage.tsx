import { motion } from "framer-motion";
import { Mic, Play, Clock, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const interviewTypes = [
  { title: "Technical", desc: "Data structures, algorithms, system design", icon: "💻" },
  { title: "Behavioral", desc: "Situational, leadership, teamwork", icon: "🤝" },
  { title: "Domain", desc: "Role-specific deep-dive questions", icon: "🎯" },
  { title: "HR Round", desc: "Salary, culture fit, expectations", icon: "📋" },
];

const pastInterviews = [
  { role: "Frontend Developer", score: 78, date: "Mar 18", feedback: "Strong on React, improve system design" },
  { role: "Data Analyst", score: 65, date: "Mar 15", feedback: "Good SQL, work on visualization explanations" },
  { role: "Backend Engineer", score: 82, date: "Mar 10", feedback: "Excellent problem-solving approach" },
];

export default function InterviewsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Mic className="w-8 h-8 text-vedoryn-pink" /> AI Interviews
        </h1>
        <p className="text-muted-foreground mt-1">Practice with AI and get detailed feedback to ace real interviews.</p>
      </div>

      {/* Interview Types */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">Choose Interview Type</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {interviewTypes.map((type) => (
            <motion.button
              key={type.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.title)}
              className={`p-5 rounded-xl border text-left transition-all ${
                selectedType === type.title
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="text-3xl mb-3">{type.icon}</div>
              <h4 className="font-display font-semibold">{type.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
            </motion.button>
          ))}
        </div>
        {selectedType && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Button className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
              <Play className="w-4 h-4 mr-2" /> Start {selectedType} Interview
            </Button>
          </motion.div>
        )}
      </div>

      {/* Past Interviews */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">Past Interviews</h3>
        <div className="space-y-4">
          {pastInterviews.map((interview, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-xl bg-card border border-border shadow-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-vedoryn-pink/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-vedoryn-pink" />
                </div>
                <div>
                  <h4 className="font-display font-semibold">{interview.role}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {interview.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold">{interview.score}<span className="text-sm text-muted-foreground">/100</span></div>
                <p className="text-xs text-muted-foreground max-w-[200px]">{interview.feedback}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
