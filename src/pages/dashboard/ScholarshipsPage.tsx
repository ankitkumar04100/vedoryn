import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, DollarSign, CheckCircle2, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type Scholarship = { name: string; org: string; amount: string; deadline: string; eligible: boolean; match: number; url?: string; description?: string };

export default function ScholarshipsPage() {
  const { profile } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate 6 real scholarships as JSON array. Each: {"name":"...","org":"...","amount":"₹XX,000","deadline":"Month Day","eligible":true/false,"match":50-98,"description":"brief description"}. Tailor to: education=${(profile as any)?.education_level || "undergraduate"}, goal=${profile?.career_goal || "tech"}, stream=${(profile as any)?.academic_stream || "CS"}, skills=${(profile?.skills || []).join(",")}. Include real Indian scholarship names (INSPIRE, KVPY, Pragati, etc). Return ONLY JSON array.` }],
          context: "scholarship",
          profile: null,
        }),
      });
      if (!resp.ok) throw new Error("Failed");
      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try { const p = JSON.parse(json); if (p.choices?.[0]?.delta?.content) fullText += p.choices[0].delta.content; } catch {}
        }
      }
      const match = fullText.match(/\[[\s\S]*\]/);
      if (match) setScholarships(JSON.parse(match[0]));
    } catch {
      setScholarships([
        { name: "INSPIRE Scholarship", org: "DST India", amount: "₹80,000/year", deadline: "Oct 31", eligible: true, match: 90, description: "For top science students" },
        { name: "Pragati Scholarship", org: "AICTE", amount: "₹50,000/year", deadline: "Dec 15", eligible: true, match: 85, description: "For women in technical education" },
        { name: "KVPY Fellowship", org: "IISc Bangalore", amount: "₹5,000-7,000/month", deadline: "Aug 31", eligible: true, match: 78, description: "For science aptitude students" },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchScholarships(); }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3"><GraduationCap className="w-8 h-8 text-vedoryn-gold" /> Scholarships</h1>
          <p className="text-muted-foreground mt-1">AI-matched scholarship opportunities for your profile.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchScholarships} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="ml-3 text-muted-foreground">Finding scholarships for you...</span></div>
      ) : (
        <div className="space-y-4">
          {scholarships.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-lg">{s.name}</h3>
                    {s.eligible && <CheckCircle2 className="w-4 h-4 text-vedoryn-green" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.org}</p>
                  {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{s.amount}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {s.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.match >= 80 ? "bg-vedoryn-green/10 text-vedoryn-green" : s.match >= 60 ? "bg-vedoryn-orange/10 text-vedoryn-orange" : "bg-muted text-muted-foreground"}`}>
                    {s.match}% Match
                  </span>
                  <Button size="sm" disabled={!s.eligible} className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                    Learn More <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
