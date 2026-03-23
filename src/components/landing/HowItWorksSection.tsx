import { motion } from "framer-motion";
import { Crown, TrendingUp, Zap, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Crown,
    title: "Onboard & Set Goals",
    desc: "Tell us your career goal, current skills, and availability. AI creates your personalized roadmap.",
    color: "bg-gradient-royal text-primary-foreground",
  },
  {
    icon: Zap,
    title: "Execute & Learn",
    desc: "Complete daily tasks, build projects, and practice interviews. Every action updates your score.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: TrendingUp,
    title: "Track & Predict",
    desc: "Watch your Career Score climb. AI predicts your success probability and adjusts your path.",
    color: "bg-vedoryn-orange text-primary-foreground",
  },
  {
    icon: CheckCircle2,
    title: "Get Matched & Hired",
    desc: "Receive AI-matched opportunities. Apply with a verified profile that recruiters trust.",
    color: "bg-vedoryn-emerald text-primary-foreground",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">How It Works</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
            Your Journey to{" "}
            <span className="text-gradient-royal">Career Clarity</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-start">
              <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center shrink-0 shadow-lg`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Step {i + 1}</div>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
