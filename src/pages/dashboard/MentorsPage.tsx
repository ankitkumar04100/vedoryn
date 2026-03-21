import { motion } from "framer-motion";
import { Users, Star, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const mentors = [
  { name: "Dr. Priya Sharma", role: "Data Science Lead @ Google", rating: 4.9, sessions: 120, price: "₹999/session", domains: ["ML", "Data Science"], avatar: "PS" },
  { name: "Rahul Verma", role: "Senior Engineer @ Microsoft", rating: 4.8, sessions: 85, price: "₹799/session", domains: ["System Design", "Backend"], avatar: "RV" },
  { name: "Ananya Gupta", role: "Product Manager @ Amazon", rating: 4.7, sessions: 64, price: "₹899/session", domains: ["Product", "Strategy"], avatar: "AG" },
  { name: "Karthik Nair", role: "Frontend Architect @ Meta", rating: 4.9, sessions: 93, price: "₹849/session", domains: ["React", "Frontend"], avatar: "KN" },
];

export default function MentorsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" /> Mentor Marketplace
        </h1>
        <p className="text-muted-foreground mt-1">Book 1-on-1 sessions with industry experts.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {mentors.map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                {m.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-vedoryn-gold"><Star className="w-3 h-3" />{m.rating}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><MessageSquare className="w-3 h-3" />{m.sessions} sessions</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {m.domains.map(d => <span key={d} className="px-2 py-0.5 text-xs rounded-md bg-secondary font-medium">{d}</span>)}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-bold">{m.price}</span>
                  <Button size="sm" className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                    <Calendar className="w-3 h-3 mr-1" /> Book
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
