import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Crown, Clock } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="
        py-32 relative overflow-hidden 
        bg-background text-foreground
      "
    >
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="
          absolute top-20 left-10 w-96 h-96 
          bg-primary/20 dark:bg-primary/10 
          blur-3xl animate-float
        " />

        <div
          className="
            absolute bottom-10 right-10 
            w-[26rem] h-[26rem] 
            bg-purple-500/20 dark:bg-purple-500/10 
            blur-[110px] animate-float
          "
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="container mx-auto px-4">

        {/* ----------------- HEADER ----------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="
            font-display text-4xl md:text-6xl font-bold mb-6
            text-foreground
          ">
            Invest in Your Future, Like{" "}
            <span className="
              text-transparent bg-clip-text 
              bg-gradient-to-r from-yellow-500 to-yellow-600
              dark:from-yellow-400 dark:to-yellow-500
            ">
              Royalty 👑
            </span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Unlock a complete AI-powered career ecosystem designed to guide, measure,
            and accelerate your growth — with real outcomes, not promises.
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
            {[
              "✔ 2 Months FREE Trial",
              "✔ Cancel Anytime",
              "✔ No Hidden Charges",
              "✔ Real AI + Real Opportunities",
            ].map((t) => (
              <div
                key={t}
                className="
                  bg-muted/40 backdrop-blur-xl
                  px-4 py-1.5 rounded-full 
                  border border-border
                  text-foreground/90
                "
              >
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ----------------- PRICING CARDS ----------------- */}
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

          {/* PLAN 1 — FREE */}
          <PricingCard
            name="Explorer Plan"
            price="₹0"
            period="/forever"
            tagline="Start your journey with guided AI insights"
            highlight={false}
            features={[
              "Basic Career Intelligence Overview",
              "Limited AI Roadmap Preview",
              "3 AI Mock Interviews / month",
              "AI Mentor (Basic Mode)",
              "Community Access",
              "Starter Study Planner",
            ]}
            cta="👉 Begin Free Journey"
          />

          {/* PLAN 2 — ROYAL PRO */}
          <PricingCard
            name="Royal Pro"
            price="₹99"
            original="₹499"
            period="/month"
            tagline="Complete career control powered by AI"
            valueLine="Less than ₹4/day for your future 🚀"
            highlight={true}
            badge="👑 MOST POPULAR"
            badgeColor="from-yellow-500 to-yellow-600"
            features={[
              "Full Career Intelligence Dashboard",
              "Unlimited AI Mock Interviews",
              "Smart Job + Internship Matching",
              "AI Mentor (Advanced Mode)",
              "Resume Analyzer (Real Feedback)",
              "Scholarship Finder (Live Data)",
              "Personalized AI Roadmaps",
              "Progress Tracking + Insights",
              "Priority Support",
            ]}
            bonus="🎁 Includes 2 Months FREE Trial"
            cta="👉 Go Pro — Start Free Trial"
          />

          {/* PLAN 3 — MAHARAJA ELITE */}
          <PricingCard
            name="Maharaja Elite"
            price="₹299"
            original="₹1499"
            period="/month"
            tagline="Maximum acceleration. Real human + AI power."
            valueLine="Your unfair advantage in career growth ⚡"
            highlight={false}
            badge="💎 ELITE ACCESS"
            badgeColor="from-yellow-400 to-yellow-200"
            features={[
              "Everything in Royal Pro",
              "1-on-1 Human Mentor Sessions",
              "Verified Profile Badge",
              "Recruiter Visibility Dashboard",
              "Advanced Career Analytics",
              "Priority Job Placement Signals",
              "Dedicated Support Channel",
              "Early Access to New Features",
            ]}
            cta="👉 Go Elite — Unlock Full Power"
          />
        </div>

        {/* ----------------- VALUE MESSAGE ----------------- */}
        <div className="text-center mt-20">
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            💡 One wrong career decision can cost years.  
            <br />
            <span className="text-foreground font-medium">
              Vedoryn helps you make the right one — early.
            </span>
          </p>
        </div>

        {/* ----------------- TRUST BADGES ----------------- */}
        <div className="flex flex-wrap justify-center gap-5 mt-14 text-sm">
          {[
            "🔒 Secure Payments",
            "🔁 Cancel Anytime",
            "💬 Real Support",
            "📊 Transparent System",
          ].map((t) => (
            <div
              key={t}
              className="
                px-4 py-2 rounded-full 
                bg-muted/40 backdrop-blur-xl 
                border border-border 
                text-foreground/80
              "
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   REUSABLE ROYAL PRICING CARD
================================================================ */
function PricingCard({
  name,
  price,
  original,
  period,
  tagline,
  valueLine,
  highlight,
  badge,
  badgeColor,
  features,
  bonus,
  cta,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: highlight ? 1.06 : 1.03 }}
      className={`
        relative p-8 rounded-3xl backdrop-blur-xl border
        transition-all duration-300 shadow-xl
        ${
          highlight
            ? "bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 dark:from-yellow-400/20 dark:to-yellow-700/20 border-yellow-500/40 shadow-yellow-500/20"
            : "bg-muted/30 border-border"
        }
      `}
    >
      {/* Badge */}
      {badge && (
        <div
          className={`
            absolute -top-3 right-4 px-3 py-1 rounded-full 
            bg-gradient-to-r ${badgeColor}
            text-black text-xs font-bold shadow-md
          `}
        >
          {badge}
        </div>
      )}

      {/* Title */}
      <h3 className="font-display text-2xl font-bold mb-3 text-foreground">
        {name}
      </h3>

      {/* Price */}
      <div className="mt-3 mb-3">
        {original && (
          <span className="text-sm line-through text-muted-foreground mr-2">
            {original}
          </span>
        )}
        <span className="font-display text-5xl font-bold text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground ml-1">{period}</span>
      </div>

      {/* Tagline */}
      <p className="text-muted-foreground text-sm mb-3">{tagline}</p>

      {valueLine && (
        <p className="text-yellow-500 dark:text-yellow-400 text-sm font-medium mb-4">
          {valueLine}
        </p>
      )}

      {bonus && (
        <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-4">
          {bonus}
        </p>
      )}

      {/* CTA Button */}
      <Link to="/auth">
        <Button
          className={`
            w-full py-5 mb-6 font-semibold rounded-xl 
            ${
              highlight
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          `}
        >
          {cta}
        </Button>
      </Link>

      {/* Features */}
      <ul className="space-y-3">
        {features.map((f: string, i: number) => (
          <li
            key={i}
            className="flex items-center gap-3 text-sm text-foreground/90"
          >
            <Check className="w-4 h-4 text-yellow-500" /> {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
``
