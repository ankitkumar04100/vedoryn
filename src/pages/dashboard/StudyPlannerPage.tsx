import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckSquare, Clock, Calendar, Loader2, RefreshCw, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Task = { id: string; task: string; time: string; done: boolean };
type DayPlan = { day: string; hours: number; focus: string };

export default function StudyPlannerPage() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate a study plan as JSON: { "tasks": [{"id":"1","task":"...","time":"...","done":false}], "weekPlan": [{"day":"Mon","hours":N,"focus":"..."}] }. Create 5-6 daily tasks and 7-day week plan for someone studying ${profile?.career_goal || "tech"} with skills: ${(profile?.skills || []).join(",")}. Daily hours available: ${profile?.daily_hours || 3}. Return ONLY JSON.` }],
          context: "mentor",
          profile: profile ? { career_goal: profile.career_goal, skills: profile.skills, experience_level: profile.experience_level } : null,
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
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try { const p = JSON.parse(json); if (p.choices?.[0]?.delta?.content) fullText += p.choices[0].delta.content; } catch {}
        }
      }
      const match = fullText.match(/\{[\s\S]*\}/);
      if (match) {
        const data = JSON.parse(match[0]);
        setTasks(data.tasks || []);
        setWeekPlan(data.weekPlan || []);
      }
    } catch {
      setTasks([
        { id: "1", task: "Review core concepts", time: "1h", done: false },
        { id: "2", task: "Practice problems", time: "1.5h", done: false },
        { id: "3", task: "Build a mini project", time: "2h", done: false },
      ]);
      setWeekPlan([
        { day: "Mon", hours: 3, focus: "Theory" }, { day: "Tue", hours: 3, focus: "Practice" },
        { day: "Wed", hours: 4, focus: "Projects" }, { day: "Thu", hours: 3, focus: "Review" },
        { day: "Fri", hours: 4, focus: "Deep Dive" }, { day: "Sat", hours: 2, focus: "Revision" },
        { day: "Sun", hours: 1, focus: "Rest" },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { generatePlan(); }, []);

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), task: newTask.trim(), time: "30min", done: false }]);
    setNewTask("");
    toast.success("Task added!");
  };
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">AI is creating your study plan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-vedoryn-orange" /> Study Planner
          </h1>
          <p className="text-muted-foreground mt-1">AI-generated daily schedule personalized for you.</p>
        </div>
        <Button variant="outline" size="sm" onClick={generatePlan}><RefreshCw className="w-4 h-4 mr-1" /> Regenerate</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Today's Tasks
          </h3>
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${t.done ? "bg-vedoryn-green/5" : "bg-secondary/50"}`}>
                <button onClick={() => toggleTask(t.id)}>
                  <CheckSquare className={`w-5 h-5 shrink-0 transition-colors ${t.done ? "text-vedoryn-green" : "text-muted-foreground"}`} />
                </button>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.task}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {t.time}</span>
                <button onClick={() => removeTask(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a task..." className="text-sm"
              onKeyDown={e => e.key === "Enter" && addTask()} />
            <Button size="sm" onClick={addTask}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Completed: <span className="font-semibold text-vedoryn-green">{tasks.filter(t => t.done).length}/{tasks.length}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4">Weekly Plan</h3>
          <div className="space-y-3">
            {weekPlan.map((d) => (
              <div key={d.day} className="flex items-center gap-4">
                <span className="w-10 text-sm font-bold">{d.day}</span>
                <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((d.hours / 6) * 100, 100)}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-score" />
                </div>
                <span className="text-xs text-muted-foreground w-14 text-right">{d.hours}h</span>
                <span className="text-xs font-medium w-24 text-right">{d.focus}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
