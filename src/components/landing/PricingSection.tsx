import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Clock, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    originalPrice: "₹0",
    price: "₹0",
    period: "forever",
    desc: "Start exploring your career potential",
    features: ["Basic Career Score", "3 AI Interviews/month", "Career Roadmap Preview", "AI Mentor Access", "Community Access"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Royal Pro",
    originalPrice: "₹499",
    price: "₹99",
    period: "/month",
    desc: "Unlock full career intelligence — 80% OFF",
    features: ["Full Career Score Analytics", "Unlimited AI Interviews", "Smart Job Matching", "1-on-1 AI Mentor", "Resume Analyzer", "Scholarship Finder", "Priority Support"],
    cta: "Go Pro — 2 Months Free",
    highlight: true,
    badge: "👑 80% OFF",
  },
  {
    name: "Maharaja Elite",
    originalPrice: "₹1,499",
    price: "₹299",
    period: "/month",
    desc: "Maximum career acceleration — 80% OFF",
    features: ["Everything in Pro", "1-on-1 Mentor Sessions", "Recruiter Visibility", "Verified Profile Badge", "Advanced Analytics", "Priority Placements", "Dedicated Support"],
    cta: "Go Elite — 2 Months Free",
    highlight: false,
    badge: "💎 80% OFF",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Pricing</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
            Invest in Your{" "}
            <span className="text-gradient-royal">Future</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 p-4 rounded-2xl bg-gradient-royal text-primary-foreground text-center shadow-royal">
          <div className="flex items-center justify-center gap-2 font-semibold">
            <Crown className="w-5 h-5" />
            All paid plans include 2 months FREE trial — no charge until trial ends
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-80 mt-1">After trial, subscription auto-renews at discounted price. Cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}
              className={`rounded-2xl p-8 relative ${plan.highlight ? "bg-gradient-royal text-primary-foreground shadow-royal scale-105" : "bg-card border border-border royal-border"}`}>
              {plan.badge && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-2">
                {plan.originalPrice !== plan.price && (
                  <span className={`text-lg line-through mr-2 ${plan.highlight ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {plan.originalPrice}
                  </span>
                )}
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{plan.desc}</p>
              <Link to="/auth">
                <Button className={`w-full font-semibold ${plan.highlight ? "bg-background text-foreground hover:bg-background/90" : "bg-gradient-royal text-primary-foreground hover:opacity-90"}`}>
                  {plan.cta}
                </Button>
              </Link>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 shrink-0" />{f}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
