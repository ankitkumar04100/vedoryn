import { motion } from "framer-motion";
import { Users, Sparkles, MessageSquare, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const mentorPersonas = [
  { name: "Career Strategist", desc: "Long-term career planning, goal setting, industry insights", icon: "🎯", context: "You are a Career Strategist mentor. Focus on long-term career planning, goal setting, and industry-level insights. Help users make strategic career decisions." },
  { name: "Interview Coach", desc: "Mock interviews, feedback, body language, communication", icon: "🎤", context: "You are an Interview Coach. Focus on interview preparation, mock questions, communication skills, body language tips, and confidence building." },
  { name: "Resume Expert", desc: "ATS optimization, formatting, personal branding", icon: "📄", context: "You are a Resume Expert. Focus on resume optimization for ATS systems, formatting best practices, personal branding, and portfolio advice." },
  { name: "Tech Advisor", desc: "Technical skills, stack choices, project guidance", icon: "💻", context: "You are a Tech Advisor. Focus on technical skill development, technology stack recommendations, architecture guidance, and coding best practices." },
];

export default function MentorsPage() {
  const { profile } = useAuth();
  const [selectedMentor, setSelectedMentor] = useState<typeof mentorPersonas[0] | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const startSession = (mentor: typeof mentorPersonas[0]) => {
    setSelectedMentor(mentor);
    setMessages([{ role: "assistant", content: `Hi! I'm your **${mentor.name}**. ${mentor.desc}. How can I help you today?` }]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: selectedMentor!.context },
            ...allMsgs.map(m => ({ role: m.role, content: m.content })),
          ],
          context: "mentor",
          profile: profile ? { career_goal: profile.career_goal, skills: profile.skills, experience_level: profile.experience_level, career_score: profile.career_score } : null,
        }),
      });
      if (!resp.ok) throw new Error("AI request failed");

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMsgs.length)
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't respond. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (selectedMentor) {
    return (
      <div className="space-y-4 max-w-4xl h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedMentor.icon}</span>
            <div>
              <h2 className="font-display font-bold text-xl">{selectedMentor.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedMentor.desc}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedMentor(null)}>Change Mentor</Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-4 rounded-xl border border-border bg-card/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                ) : m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-muted-foreground animate-pulse">Typing...</div>}
        </div>

        <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={`Ask your ${selectedMentor.name}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          <Button type="submit" disabled={loading || !input.trim()} className="bg-gradient-hero text-primary-foreground">Send</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" /> AI Mentor Hub
        </h1>
        <p className="text-muted-foreground mt-1">Chat with specialized AI mentors — available 24/7, completely free.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-vedoryn-green/10 border border-vedoryn-green/20 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-vedoryn-green" />
        <p className="text-sm"><span className="font-semibold text-vedoryn-green">Free & Unlimited!</span> Our AI mentors are powered by advanced AI and available anytime you need guidance.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {mentorPersonas.map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all cursor-pointer"
            onClick={() => startSession(m)}>
            <div className="text-4xl mb-4">{m.icon}</div>
            <h3 className="font-display font-semibold text-lg">{m.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{m.desc}</p>
            <Button className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90 w-full">
              <MessageSquare className="w-4 h-4 mr-2" /> Start Session
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
