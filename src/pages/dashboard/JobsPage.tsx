import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type Job = { title: string; company: string; location: string; salary: string; match: number; skills: string[]; type?: string; experience?: string };

function matchColor(m: number) {
  if (m >= 85) return "text-vedoryn-green bg-vedoryn-green/10";
  if (m >= 70) return "text-primary bg-primary/10";
  return "text-vedoryn-orange bg-vedoryn-orange/10";
}

export default function JobsPage() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate 8 realistic job listings as JSON array. Each: {"title":"...","company":"real company name","location":"city/Remote","salary":"₹X-Y LPA","match":50-98,"skills":["skill1","skill2"],"type":"Full-time/Internship","experience":"0-2 years"}. Match to: Goal=${profile?.career_goal || "Software Engineer"}, Skills=${(profile?.skills || []).join(",")}, Level=${profile?.experience_level || "beginner"}${search ? ", Search filter: " + search : ""}. Use real Indian tech companies (TCS, Infosys, Flipkart, Razorpay, etc). Return ONLY JSON array.` }],
          context: "mentor",
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
      if (match) setJobs(JSON.parse(match[0]));
    } catch {
      setJobs([
        { title: "Software Engineer", company: "Flipkart", location: "Bangalore", salary: "₹12-18 LPA", match: 90, skills: ["React", "Node.js"], type: "Full-time", experience: "0-2 years" },
        { title: "Data Analyst Intern", company: "Razorpay", location: "Remote", salary: "₹25K/month", match: 82, skills: ["Python", "SQL"], type: "Internship", experience: "Fresher" },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3"><Briefcase className="w-8 h-8 text-vedoryn-green" /> Jobs & Internships</h1>
          <p className="text-muted-foreground mt-1">AI-matched opportunities based on your profile.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter jobs..." className="pl-9 w-48"
              onKeyDown={e => e.key === "Enter" && fetchJobs()} />
          </div>
          <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="ml-3 text-muted-foreground">Finding jobs for you...</span></div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-semibold text-lg">{job.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${matchColor(job.match)}`}>{job.match}% Match</span>
                    {job.type && <span className="px-2 py-0.5 rounded-full text-xs bg-secondary">{job.type}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-3">{job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
                    {job.experience && <span className="text-xs">{job.experience}</span>}
                  </div>
                  <div className="flex gap-2 mt-3">{job.skills.map(s => <span key={s} className="px-2 py-1 text-xs rounded-md bg-secondary font-medium">{s}</span>)}</div>
                </div>
                <Button className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90 shrink-0">
                  Apply <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
