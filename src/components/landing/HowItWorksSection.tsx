import { motion } from "framer-motion";
import {
  Crown,
  TrendingUp,
  Zap,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: Crown,
    title: "Onboard & Set Goals",
    desc: "Tell us your career goal, skills, availability, and interests. Vedoryn instantly builds a personalized AI roadmap tailored to your future.",
    color: "from-primary to-purple-500",
  },
  {
    icon: Zap,
    title: "Execute & Learn",
    desc: "Complete smart daily tasks, build projects, strengthen concepts, and practice interviews. Every action improves your skill graph.",
    color: "from-accent to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Track & Predict",
    desc: "Your Career Score updates dynamically. The AI engine predicts your success probability and optimizes your path in real time.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: CheckCircle2,
    title: "Get Matched & Hired",
    desc: "Receive AI‑matched job, internship, and scholarship opportunities. Apply confidently with a verified, trusted profile.",
    color: "from-emerald-500 to-green-600",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-16 left-20 w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/5 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            How It Works
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-bold mt-3 mb-6 text-foreground">
            Your Journey to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-purple-400">
              Career Clarity
            </span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A simple, intelligent, and structured path that transforms confusion
            into confidence with real, measurable progress.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto relative">

          {/* Vertical timeline line */}
          <div className="absolute left-7 md:left-10 top-0 h-full w-1 bg-gradient-to-b from-primary/30 via-purple-400/20 to-transparent rounded-full" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{
                  opacity: 0,
                  x: i % 2 === 0 ? -40 : 40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative flex gap-6 md:gap-8"
              >
                {/* Number + Icon */}
                <div className="shrink-0 flex flex-col items-center">
                  {/* Connecting line dot */}
                  <div
                    className="
                      w-6 h-6 rounded-full 
                      bg-primary/20 dark:bg-primary/10 
                      border border-primary/50 dark:border-primary/20
                      backdrop-blur-xl
                    "
                  />

                  {/* Icon container */}
                  <div
                    className={`
                      mt-4 w-16 h-16 rounded-2xl 
                      bg-gradient-to-br ${step.color}
                      flex items-center justify-center 
                      shadow-xl backdrop-blur-xl
                      border border-white/20 dark:border-white/10
                    `}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Step {i + 1}
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-base">
                    {step.desc}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
