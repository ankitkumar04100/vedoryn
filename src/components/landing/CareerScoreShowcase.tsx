import { motion } from "framer-motion";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";

export function CareerScoreShowcase() {
  return (
    <section id="career-score" className="py-32 relative overflow-hidden">

      {/* Ambient floating glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/5 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT SIDE CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Accent pill */}
            <div
              className="
                inline-flex items-center px-4 py-1.5 rounded-full 
                bg-white/30 dark:bg-white/10 backdrop-blur-xl 
                border border-white/40 dark:border-white/10 
                text-primary text-sm font-medium shadow-md
              "
            >
              Core Innovation
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6 text-foreground leading-tight">
              Vedoryn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-purple-400">
                Career Score
              </span>
            </h2>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-lg mb-10 max-w-xl">
              A dynamic, AI-powered metric that reflects your true career readiness.
              Your score evolves in real-time based on your skills, tasks,
              consistency, interview performance, learning habits, and proven growth.
            </p>

            {/* SCORE TIERS */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { range: "0–30", label: "Beginner", color: "from-red-500/20 to-red-600/30 text-red-600 dark:text-red-400" },
                { range: "30–60", label: "Developing", color: "from-orange-400/20 to-orange-500/30 text-orange-600 dark:text-orange-400" },
                { range: "60–80", label: "Competitive", color: "from-primary/20 to-primary/30 text-primary" },
                { range: "80–100", label: "Industry Ready", color: "from-emerald-400/20 to-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
              ].map((tier, i) => (
                <motion.div
                  key={tier.range}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.07 }}
                  className={`
                    px-4 py-4 rounded-xl 
                    bg-gradient-to-br ${tier.color} 
                    border border-white/30 dark:border-white/10
                    backdrop-blur-xl shadow-lg cursor-default
                    transition-all duration-300 
                  `}
                >
                  <div className="font-display font-bold text-xl mb-1">{tier.range}</div>
                  <div className="text-sm opacity-80">{tier.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE 3D SCORE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            {/* Spotlight glow behind 3D element */}
            <div className="absolute w-80 h-80 rounded-full bg-primary/20 dark:bg-primary/10 blur-[90px] -z-10" />

            {/* 3D Component */}
            <CareerScore3D score={72} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
