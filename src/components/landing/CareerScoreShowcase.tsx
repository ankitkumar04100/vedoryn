import { motion } from "framer-motion";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";

export function CareerScoreShowcase() {
  return (
    <section id="career-score" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Core Innovation</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">
              Vedoryn{" "}
              <span className="text-gradient-hero">Career Score</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A dynamic, continuously updating metric that represents your real-world career readiness.
              Unlike traditional assessments, your Career Score evolves with every action you take.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { range: "0–30", label: "Beginner", color: "bg-destructive/10 text-destructive" },
                { range: "30–60", label: "Developing", color: "bg-vedoryn-orange/10 text-vedoryn-orange" },
                { range: "60–80", label: "Competitive", color: "bg-primary/10 text-primary" },
                { range: "80–100", label: "Industry Ready", color: "bg-vedoryn-green/10 text-vedoryn-green" },
              ].map((tier) => (
                <motion.div
                  key={tier.range}
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-3 rounded-lg ${tier.color} cursor-default transition-all`}
                >
                  <div className="font-display font-bold">{tier.range}</div>
                  <div className="text-xs opacity-80">{tier.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <CareerScore3D score={72} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
