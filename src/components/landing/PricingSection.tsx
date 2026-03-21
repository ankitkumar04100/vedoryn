import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Start exploring your career potential",
    features: ["Basic Career Score", "3 AI Interviews/month", "Career Roadmap Preview", "Community Access"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    desc: "Unlock full career intelligence",
    features: ["Full Career Score Analytics", "Unlimited AI Interviews", "Smart Job Matching", "Mentor Access", "Resume Analyzer", "Scholarship Finder", "Priority Support"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Elite",
    price: "₹1,499",
    period: "/month",
    desc: "Maximum career acceleration",
    features: ["Everything in Pro", "1-on-1 Mentor Sessions", "Recruiter Visibility", "Verified Profile Badge", "Advanced Analytics", "Priority Placements", "Dedicated Support"],
    cta: "Go Elite",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Pricing</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
            Invest in Your{" "}
            <span className="text-gradient-accent">Future</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 ${
                plan.highlight
                  ? "bg-gradient-hero text-primary-foreground shadow-glow scale-105"
                  : "bg-card border border-border"
              }`}
            >
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {plan.desc}
              </p>
              <Link to="/dashboard">
                <Button
                  className={`w-full font-semibold ${
                    plan.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-gradient-hero text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
