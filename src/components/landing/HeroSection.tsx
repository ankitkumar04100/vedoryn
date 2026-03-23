import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap, Users, Crown } from "lucide-react";
import { ParticleField } from "./ParticleField";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <ParticleField />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-vedoryn-orange/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass royal-border text-primary text-sm font-medium mb-8">
            <Crown className="w-4 h-4" />
            Royal AI Career Intelligence
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            From Confusion{" "}
            <span className="text-gradient-royal">to Control</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Vedoryn transforms your career journey with AI-driven intelligence.
            Track your progress, predict outcomes, and take data-backed actions — all in one royal platform.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-royal text-primary-foreground font-semibold text-base px-8 hover:opacity-90 transition-all shadow-royal hover:shadow-elevated hover:scale-105 duration-300">
                <Crown className="w-4 h-4 mr-2" />
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="font-semibold text-base px-8 glass royal-border hover:scale-105 transition-all duration-300">
                See How It Works
              </Button>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
            {[
              { icon: TrendingUp, label: "Career Score", value: "AI-Powered" },
              { icon: Zap, label: "Real-Time", value: "Predictions" },
              { icon: Users, label: "AI Mentor", value: "24/7 Access" },
            ].map((stat) => (
              <motion.div key={stat.label} whileHover={{ scale: 1.1, y: -4 }} transition={{ type: "spring", stiffness: 300 }}
                className="text-center glass royal-border rounded-xl p-4 cursor-default royal-glow">
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
