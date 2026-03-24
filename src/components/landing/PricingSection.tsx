import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Clock, Crown, Sparkles } from "lucide-react";

// Plans Data
const plans = [
  {
    name: "Free",
    originalPrice: "₹0",
    price: "₹0",
    period: "forever",
    desc: "Start exploring your career potential",
    features: [
      "Basic Career Score",
      "3 AI Interviews / month",
      "Career Roadmap Preview",
      "AI Mentor Access",
      "Community Access",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Royal Pro",
    originalPrice: "₹499",
    price: "₹99",
    period: "/month",
    desc: "Unlock full career intelligence — 80% OFF",
    features: [
      "Full Score Analytics",
      "Unlimited AI Interviews",
      "Smart Job Matching",
      "1-on-1 AI Mentor",
      "Resume Analyzer",
      "Scholarship Finder",
      "Priority Support",
    ],
    cta: "Go Pro — 2 Months Free",
    highlight: true,
    badge: "👑 Best Value",
  },
  {
    name: "Maharaja Elite",
    originalPrice: "₹1,499",
    price: "₹299",
    period: "/month",
    desc: "Maximum career acceleration — 80% OFF",
    features: [
      "Everything in Pro",
      "Live Mentor Sessions",
      "Recruiter Visibility",
      "Verified Profile Badge",
      "Advanced Analytics",
      "Priority Placements",
      "Dedicated Support",
    ],
    cta: "Go Elite — 2 Months Free",
    highlight: false,
    badge: "💎 80% OFF",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/5 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Pricing
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-bold mt-3 mb-4 text-foreground">
            Invest in Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Future
            </span>
          </h2>
        </motion.div>

        {/* Trial Highlight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16 p-6 rounded-3xl bg-gradient-to-r from-primary via-purple-500 to-primary text-white shadow-xl shadow-primary/20 backdrop-blur-xl"
        >
          <div className="flex items-center justify-center gap-3 font-semibold text-lg">
            <Crown className="w-5 h-5" />
            2 Months Free on All Paid Plans
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mt-2">
            No charge until trial ends. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -10, scale: plan.highlight ? 1.08 : 1.03 }}
              className={`
                relative p-8 rounded-3xl backdrop-blur-xl border
                transition-all duration-300 shadow-lg
                ${
                  plan.highlight
                    ? "bg-gradient-to-br from-primary to-purple-600 text-white border-white/20 shadow-royal"
                    : "bg-white/20 dark:bg-white/5 border-white/30 dark:border-white/10"
                }
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-accent to-purple-500 text-white text-xs font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              {/* Title */}
              <h3 className="font-display text-2xl font-bold">{plan.name}</h3>

              {/* Pricing */}
              <div className="mt-5 mb-3">
                {plan.originalPrice !== plan.price && (
                  <span
                    className={`text-sm line-through mr-2 ${
                      plan.highlight ? "text-white/60" : "text-muted-foreground"
                    }`}
                  >
                    {plan.originalPrice}
                  </span>
                )}
                <span className="font-display text-5xl font-bold">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    plan.highlight ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-sm mb-6 ${
                  plan.highlight ? "text-white/90" : "text-muted-foreground"
                }`}
              >
                {plan.desc}
              </p>

              {/* CTA Button */}
              <Link to="/auth">
                <Button
                  className={`w-full font-semibold text-lg py-5 rounded-xl shadow-md ${
                    plan.highlight
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary dark:text-primary-light shrink-0" />
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
