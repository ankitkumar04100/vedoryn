import { motion } from "framer-motion";
import { BookOpen, CheckSquare, Clock, Calendar } from "lucide-react";

const todayTasks = [
  { task: "Complete Data Visualization Module", time: "2h", done: false },
  { task: "Practice 5 SQL problems", time: "1h", done: true },
  { task: "Read: Feature Engineering Chapter 3", time: "45min", done: false },
  { task: "Review flashcards (Statistics)", time: "20min", done: true },
];

const weekPlan = [
  { day: "Mon", hours: 4, focus: "Visualization" },
  { day: "Tue", hours: 3, focus: "SQL Practice" },
  { day: "Wed", hours: 4, focus: "Statistics" },
  { day: "Thu", hours: 3, focus: "Projects" },
  { day: "Fri", hours: 5, focus: "ML Basics" },
  { day: "Sat", hours: 2, focus: "Review" },
  { day: "Sun", hours: 1, focus: "Rest" },
];

export default function StudyPlannerPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-vedoryn-orange" /> Study Planner
        </h1>
        <p className="text-muted-foreground mt-1">AI-generated daily schedule to maximize your learning.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Today's Tasks
          </h3>
          <div className="space-y-3">
            {todayTasks.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${t.done ? "bg-vedoryn-green/5" : "bg-secondary/50"}`}>
                <CheckSquare className={`w-5 h-5 shrink-0 ${t.done ? "text-vedoryn-green" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <span className={`text-sm font-medium ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.task}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t.time}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Completed: <span className="font-semibold text-vedoryn-green">{todayTasks.filter(t => t.done).length}/{todayTasks.length}</span>
          </div>
        </motion.div>

        {/* Week Plan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-card"
        >
          <h3 className="font-display font-semibold text-lg mb-4">Weekly Plan</h3>
          <div className="space-y-3">
            {weekPlan.map((d) => (
              <div key={d.day} className="flex items-center gap-4">
                <span className="w-10 text-sm font-bold">{d.day}</span>
                <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.hours / 5) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-score"
                  />
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
