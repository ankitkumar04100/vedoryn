import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-[#0c0c0e] to-black text-white"
    >
      {/* BACKGROUND ROYAL GLOWS */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-purple-600/10 blur-[120px] animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* ------------ SECTION HEADER ------------ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Invest in Your Future, Like{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Royalty 👑
            </span>
          </h2>

          <p className="text-lg text-white/70 leading-relaxed mb-6">
            Unlock a complete AI-powered career ecosystem designed to guide,
            measure, and accelerate your growth — with real outcomes, not
            promises.
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
            <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
              ✔ 2 Months FREE Trial
            </div>
            <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
              ✔ Cancel Anytime
            </div>
            <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
              ✔ No Hidden Charges
            </div>
            <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
              ✔ Real AI + Real Opportunities
            </div>
          </div>
        </motion.div>

        {/* ------------ PRICING CARDS ------------ */}
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* ========== PLAN 1 — FREE / EXPLORER ========== */}
          <PricingCard
            name="Explorer Plan"
            price="₹0"
            period="forever"
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

          {/* ========== PLAN 2 — ROYAL PRO (CENTER, MOST POPULAR) ========== */}
          <PricingCard
            name="Royal Pro"
            price="₹99"
            original="₹499"
            period="/month"
            tagline="Complete career control powered by AI"
            valueLine="Less than ₹4/day for your future 🚀"
            highlight={true}
            badge="👑 MOST POPULAR"
            badgeColor="from-yellow-400 to-yellow-600"
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

          {/* ========== PLAN 3 — MAHARAJA ELITE ========== */}
          <PricingCard
            name="Maharaja Elite"
            price="₹299"
            original="₹1499"
            period="/month"
            tagline="Maximum acceleration. Real human + AI power."
            valueLine="Your unfair advantage in career growth ⚡"
            highlight={false}
            badge="💎 ELITE ACCESS"
            badgeColor="from-white/40 to-yellow-400"
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

        {/* ------------ VALUE BOOST MESSAGE ------------ */}
        <div className="text-center mt-20">
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            💡 One wrong career decision can cost years. <br />
            <span className="text-white font-medium">
              Vedoryn helps you make the right one — early.
            </span>
          </p>
        </div>

        {/* ------------ TRUST & SAFETY  ------------ */}
        <div className="flex flex-wrap justify-center gap-5 mt-14 text-gray-300 text-sm">
          <TrustBadge text="🔒 Secure Payments" />
          <TrustBadge text="🔁 Cancel Anytime" />
          <TrustBadge text="💬 Real Support" />
          <TrustBadge text="📊 Transparent System" />
        </div>
      </div>
    </section>
  );
}

/* ==============================================================
   REUSABLE PRICING CARD COMPONENT (ROYAL-LEVEL QUALITY)
   ============================================================== */

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
      whileHover={{ y: -12, scale: highlight ? 1.07 : 1.03 }}
      transition={{ duration: 0.3 }}
      className={`
        relative p-8 rounded-3xl backdrop-blur-xl border shadow-xl
        transition-all duration-300
        ${
          highlight
            ? "bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border-yellow-500/40 shadow-yellow-500/30 scale-105"
            : "bg-white/5 border-white/10"
        }
      `}
    >
      {/* BADGE */}
      {badge && (
        <div
          className={`
            absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold 
            bg-gradient-to-r ${badgeColor} text-black shadow-lg
          `}
        >
          {badge}
        </div>
      )}

      {/* TITLE */}
      <h3 className="font-display text-2xl font-bold mb-3">{name}</h3>

      {/* PRICE */}
      <div className="mt-3 mb-3">
        {original && (
          <span className="text-sm line-through text-white/60 mr-2">
            {original}
          </span>
        )}
        <span className="font-display text-5xl font-bold">{price}</span>
        <span className="text-sm text-white/60 ml-1">{period}</span>
      </div>

      {/* TAGLINE */}
      <p className="text-white/70 text-sm mb-3">{tagline}</p>

      {/* VALUE LINE */}
      {valueLine && (
        <p className="text-yellow-400 text-sm font-medium mb-4">
          {valueLine}
        </p>
      )}

      {/* BONUS */}
      {bonus && (
        <p className="text-green-400 text-sm font-medium mb-4">{bonus}</p>
      )}

      {/* CTA */}
      <Link to="/auth">
        <Button
          className={`w-full py-5 mb-6 font-semibold rounded-xl ${
            highlight
              ? "bg-yellow-500 text-black hover:bg-yellow-400"
              : "bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-80"
          }`}
        >
          {cta}
        </Button>
      </Link>

      {/* FEATURES */}
      <ul className="space-y-3">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-sm text-white/80">
            <Check className="w-4 h-4 text-yellow-500" /> {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* TRUST BADGES */
function TrustBadge({ text }: any) {
  return (
    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner">
      {text}
    </div>
  );
}
