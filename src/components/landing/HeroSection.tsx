import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Users,
  Crown,
} from "lucide-react";
import { ParticleField } from "./ParticleField";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      
      {/* BACKGROUND PARTICLES */}
      <ParticleField />

      {/* FLOATING THEME-AWARE GRADIENT BLOBS */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl animate-float 
          bg-primary/20 dark:bg-primary/10" 
        />
        <div className="absolute bottom-1/4 right-1/4 w-[22rem] h-[22rem] rounded-full blur-3xl animate-float
          bg-purple-500/20 dark:bg-purple-500/10"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 right-1/3 w-[18rem] h-[18rem] rounded-full blur-3xl animate-float
          bg-amber-500/20 dark:bg-amber-400/10"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* TAGLINE PILL */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              inline-flex items-center gap-2 px-6 py-2 
              rounded-full 
              backdrop-blur-xl
              bg-white/40 dark:bg-white/10
              border border-white/50 dark:border-white/20
              shadow-lg
              text-primary font-medium text-sm
              mb-8
            "
          >
            <Crown className="w-4 h-4" />
            The Royal AI Career Intelligence Engine
          </motion.div>

          {/* MAIN HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="
              font-display 
              text-5xl md:text-7xl 
              font-bold
              leading-tight
              text-foreground
              mb-6
            "
          >
            From Confusion{" "}
            <span className="
              text-transparent bg-clip-text 
              bg-gradient-to-r from-primary to-purple-500 
              dark:from-primary dark:to-purple-400
            ">
              to Control
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              text-lg md:text-xl 
              text-muted-foreground 
              max-w-2xl mx-auto 
              mb-10 leading-relaxed
            "
          >
            Vedoryn transforms your career journey with AI‑driven intelligence.
            Track real progress, predict outcomes, and build your future with
            confidence, clarity, and proven data.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Start Button */}
            <Link to="/auth">
              <Button
                size="lg"
                className="
                  px-10 text-base font-semibold 
                  bg-gradient-to-r from-primary to-purple-500 
                  dark:from-primary dark:to-purple-600
                  text-white 
                  shadow-lg hover:shadow-xl 
                  hover:scale-[1.06] active:scale-[0.97]
                  transition-all duration-300
                  rounded-xl
                "
              >
                <Crown className="w-4 h-4 mr-2" />
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* How it Works */}
            <a href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="
                  px-10 text-base font-semibold 
                  backdrop-blur-xl
                  border border-foreground/20 dark:border-white/20 
                  hover:scale-[1.06] active:scale-[0.97]
                  transition-all duration-300
                  rounded-xl
                "
              >
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* STATS CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="
              grid grid-cols-3 gap-8 
              max-w-lg mx-auto mt-16
            "
          >
            {[
              { icon: TrendingUp, label: "Career Score", value: "AI-Powered" },
              { icon: Zap, label: "Real-Time", value: "Predictions" },
              { icon: Users, label: "AI Mentor", value: "24/7 Access" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="
                  p-4 rounded-xl cursor-default
                  backdrop-blur-xl 
                  border border-white/40 dark:border-white/10
                  bg-white/25 dark:bg-white/5
                  shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]
                  transition-all
                "
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
