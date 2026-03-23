import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Code, Briefcase, Mic, BookOpen, Loader2, Crown } from "lucide-react";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";
import { useAuth } from "@/hooks/useAuth";

type Breakdown = { label: string; value: number; icon: any; color: string };

export default function CareerScorePage() {
  const { profile } = useAuth();
  const [breakdown, setBreakdown] = useState<Breakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");

  const score = profile?.career_score ?? 0;
  const skillCount = profile?.skills?.length ?? 0;
  const level = profile?.experience_level || "beginner";

  useEffect(() => {
    const baseSkill = Math.min(skillCount * 8, 95);
    const baseLevelMap: Record<string, number> = { beginner: 30, intermediate: 55, advanced: 80 };
    const baseLevel = baseLevelMap[level] ?? 40;

    setBreakdown([
      { label: "Technical Skills", value: Math.min(baseSkill + 10, 100), icon: Code, color: "bg-primary" },
      { label: "Project Quality", value: Math.round(baseLevel * 0.8), icon: Briefcase, color: "bg-accent" },
      { label: "Interview Readiness", value: Math.round(baseLevel * 0.7), icon: Mic, color: "bg-vedoryn-pink" },
      { label: "Consistency", value: Math.min((profile?.daily_hours ?? 2) * 15, 100), icon: TrendingUp, color: "bg-vedoryn-emerald" },
      { label: "Learning Speed", value: Math.round(baseLevel * 0.85), icon: BookOpen, color: "bg-vedoryn-orange" },
    ]);

    const fetchInsight = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({
            messages: [{ role: "user", content: `In 2-3 sentences, give a career score insight for someone with: score=${score}, skills=${(profile?.skills || []).join(",")}, goal=${profile?.career_goal}, level=${level}. Be encouraging and specific.` }],
            context: "mentor",
            profile: null,
          }),
        });
        if (!resp.ok) throw new Error("Failed");
        const reader = resp.body?.getReader();
        if (!reader) throw new Error("No stream");
        const decoder = new TextDecoder();
        let text = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try { const p = JSON.parse(json); if (p.choices?.[0]?.delta?.content) text += p.choices[0].delta.content; } catch {}
          }
        }
        setAiInsight(text);
      } catch {
        setAiInsight("Keep building skills and completing interviews to boost your career score!");
      } finally { setLoading(false); }
    };
    fetchInsight();
  }, [profile]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3"><Crown className="w-8 h-8 text-primary" /> Career Score</h1>
        <p className="text-muted-foreground mt-1">Your real-time career readiness metric.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-card border border-border shadow-card flex flex-col items-center relative overflow-hidden royal-border royal-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <CareerScore3D score={score} className="relative z-10" />
          <div className="relative z-10 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mt-2">
            {score >= 75 ? "👑 Competitive" : score >= 50 ? "📈 Growing" : "🌱 Getting Started"}
          </div>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mt-4 relative z-10" />
          ) : (
            <p className="relative z-10 text-center text-sm text-muted-foreground mt-4 max-w-xs">{aiInsight}</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl bg-card border border-border shadow-card royal-border">
          <h3 className="font-display font-semibold text-lg mb-6">Score Breakdown</h3>
          <div className="space-y-5">
            {breakdown.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><item.icon className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-medium">{item.label}</span></div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
                <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full ${item.color}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
