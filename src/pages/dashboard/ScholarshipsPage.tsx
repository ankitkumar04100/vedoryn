import { motion } from "framer-motion";
import { GraduationCap, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const scholarships = [
  { name: "National STEM Scholarship", org: "Ministry of Education", amount: "₹50,000", deadline: "Apr 15", eligible: true, match: 95 },
  { name: "Women in Tech Grant", org: "TechFoundation", amount: "₹30,000", deadline: "May 1", eligible: true, match: 88 },
  { name: "Merit Excellence Award", org: "ABC University", amount: "₹1,00,000", deadline: "Apr 30", eligible: true, match: 72 },
  { name: "Research Fellowship", org: "Science Council", amount: "₹75,000", deadline: "Jun 15", eligible: false, match: 45 },
];

export default function ScholarshipsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-vedoryn-gold" /> Scholarships
        </h1>
        <p className="text-muted-foreground mt-1">AI-filtered scholarship opportunities matched to your profile.</p>
      </div>
      <div className="space-y-4">
        {scholarships.map((s, i) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-lg">{s.name}</h3>
                  {s.eligible && <CheckCircle2 className="w-4 h-4 text-vedoryn-green" />}
                </div>
                <p className="text-sm text-muted-foreground">{s.org}</p>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{s.amount}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {s.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.eligible ? "bg-vedoryn-green/10 text-vedoryn-green" : "bg-muted text-muted-foreground"}`}>
                  {s.match}% Match
                </span>
                <Button size="sm" disabled={!s.eligible} className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                  Apply
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
