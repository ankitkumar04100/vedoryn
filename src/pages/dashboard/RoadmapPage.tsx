import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, CheckCircle2, Circle, Lock, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type RoadmapStep = { title: string; status: string; desc: string; resources?: string };

export default function RoadmapPage() {
  const { profile } = useAuth();
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const generateRoadmap = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `Generate a personalized career roadmap as a JSON array. Each item: { "title": "...", "status": "done"|"current"|"locked", "desc": "detailed description", "resources": "recommended resources" }. Generate exactly 8 steps. Make first 2-3 "done", one "current", rest "locked". Tailor to: Goal=${profile?.career_goal || "Software Engineer"}, Skills=${(profile?.skills || []).join(",")}, Level=${profile?.experience_level || "beginner"}, Stream=${(profile as any)?.academic_stream || "Computer Science"}. Return ONLY the JSON array, no markdown.` },
          ],
          context: "roadmap",
          profile: profile ? { career_goal: profile.career_goal, skills: profile.skills, experience_level: profile.experience_level } : null,
        }),
      });
      if (!resp.ok) throw new Error("Failed to generate roadmap");

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullText += content;
          } catch {}
        }
      }

      const jsonMatch = fullText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSteps(parsed);
      } else {
        throw new Error("Could not parse roadmap");
      }
    } catch (err: any) {
      setError(err.message);
      // Fallback
      setSteps([
        { title: "Foundation Skills", status: "current", desc: "Build core fundamentals for your chosen career path", resources: "Start with online courses and documentation" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generateRoadmap(); }, []);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Map className="w-8 h-8 text-vedoryn-cyan" /> Career Roadmap
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personalized path to{" "}
            <span className="text-primary font-semibold">{profile?.career_goal || "your goal"}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={generateRoadmap} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Regenerate
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">AI is generating your personalized roadmap...</span>
        </div>
      ) : (
        <>
          <div className="bg-card rounded-2xl border border-border shadow-card p-4 inline-flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-vedoryn-green" /> <span>Completed</span></div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-primary animate-pulse" /> <span>Current</span></div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-muted" /> <span>Upcoming</span></div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className={`relative pl-16 ${step.status === "locked" ? "opacity-50" : ""}`}>
                  <div className="absolute left-4 top-1">
                    {step.status === "done" ? <CheckCircle2 className="w-5 h-5 text-vedoryn-green" /> :
                     step.status === "current" ? <Circle className="w-5 h-5 text-primary fill-primary animate-pulse" /> :
                     <Lock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className={`p-5 rounded-xl border ${step.status === "current" ? "bg-primary/5 border-primary/30 shadow-glow" : "bg-card border-border"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                      {step.status === "done" && <span className="text-xs font-medium text-vedoryn-green">✓ Complete</span>}
                      {step.status === "current" && <span className="text-xs font-medium text-primary">In Progress</span>}
                    </div>
                    <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    {step.resources && (
                      <p className="text-xs text-primary mt-2 font-medium">📚 {step.resources}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
