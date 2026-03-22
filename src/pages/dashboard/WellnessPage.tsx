import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, AlertTriangle, Smile, Frown, Meh, Loader2, RefreshCw, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function WellnessPage() {
  const { profile } = useAuth();
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const stressScore = (profile as any)?.stress_level ?? 5;
  const motivationScore = (profile as any)?.motivation_level ?? 7;
  const dailyHours = profile?.daily_hours ?? 3;
  const burnoutRisk = stressScore >= 7 ? "High" : stressScore >= 4 ? "Moderate" : "Low";
  const stressLevel = stressScore < 4 ? "healthy" : stressScore < 7 ? "moderate" : "high";

  const generateTips = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate 5 personalized wellness tips as a JSON array of strings. User profile: stress=${stressScore}/10, motivation=${motivationScore}/10, daily study hours=${dailyHours}, goal=${profile?.career_goal || "career growth"}. Make tips specific, actionable, and empathetic. Return ONLY the JSON array.` }],
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
      if (match) setTips(JSON.parse(match[0]));
    } catch {
      setTips(["Take regular breaks to recharge", "Maintain 7+ hours of sleep", "Stay hydrated throughout the day", "Practice mindful breathing when stressed", "Balance study with physical activity"]);
    } finally { setLoading(false); }
  };

  useEffect(() => { generateTips(); }, []);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    const allMsgs = [...chatMessages, userMsg];
    setChatMessages(allMsgs);
    setChatInput("");
    setChatLoading(true);
    let assistantText = "";
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a compassionate wellness mentor for students. Focus on mental health, stress management, work-life balance, and preventing burnout. Be empathetic, supportive, and provide actionable advice." },
            ...allMsgs,
          ],
          context: "mentor",
          profile: null,
        }),
      });
      if (!resp.ok) throw new Error("Failed");
      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistantText += c;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
                return [...prev, { role: "assistant", content: assistantText }];
              });
            }
          } catch {}
        }
      }
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "I'm here for you. Please try again in a moment. 💚" }]);
    } finally { setChatLoading(false); }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3"><Heart className="w-8 h-8 text-vedoryn-pink" /> Wellness Monitor</h1>
          <p className="text-muted-foreground mt-1">Maintain sustainable performance and avoid burnout.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setChatOpen(!chatOpen)}>
          <MessageSquare className="w-4 h-4 mr-1" /> Wellness Mentor
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Stress Score", value: `${stressScore}/10`, icon: stressLevel === "healthy" ? Smile : stressLevel === "moderate" ? Meh : Frown, color: stressLevel === "healthy" ? "text-vedoryn-green bg-vedoryn-green/10" : stressLevel === "moderate" ? "text-vedoryn-orange bg-vedoryn-orange/10" : "text-destructive bg-destructive/10" },
          { label: "Motivation", value: `${motivationScore}/10`, icon: motivationScore >= 7 ? Smile : Meh, color: motivationScore >= 7 ? "text-vedoryn-green bg-vedoryn-green/10" : "text-vedoryn-orange bg-vedoryn-orange/10" },
          { label: "Burnout Risk", value: burnoutRisk, icon: AlertTriangle, color: burnoutRisk === "Low" ? "text-vedoryn-green bg-vedoryn-green/10" : burnoutRisk === "Moderate" ? "text-vedoryn-orange bg-vedoryn-orange/10" : "text-destructive bg-destructive/10" },
          { label: "Daily Hours", value: `${dailyHours}h`, icon: Heart, color: "text-vedoryn-pink bg-vedoryn-pink/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">AI Wellness Tips</h3>
            <Button variant="ghost" size="sm" onClick={generateTips} disabled={loading}><RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /></Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-vedoryn-green/5">
                  <span className="text-vedoryn-green text-lg">💡</span>
                  <p className="text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {chatOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-card border border-border shadow-card flex flex-col max-h-[500px]">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-vedoryn-pink" /> Wellness Mentor
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Hi! I'm your wellness mentor. How are you feeling today? 💚</p>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>
                    {m.role === "assistant" ? <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0"><ReactMarkdown>{m.content}</ReactMarkdown></div> : m.content}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="text-sm text-muted-foreground animate-pulse">Typing...</div>}
            </div>
            <form onSubmit={e => { e.preventDefault(); sendChat(); }} className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="How are you feeling?"
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <Button type="submit" size="sm" disabled={chatLoading}>Send</Button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
