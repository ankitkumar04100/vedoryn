import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Brain, Target, Zap, Clock, ArrowRight, Check, Sparkles } from "lucide-react";

const careerGoals = [
  "Software Engineer", "Data Scientist", "Product Manager", "UI/UX Designer",
  "DevOps Engineer", "Full Stack Developer", "Machine Learning Engineer",
  "Cybersecurity Analyst", "Cloud Architect", "Mobile Developer",
];

const skillOptions = [
  "Python", "JavaScript", "React", "Node.js", "SQL", "Java", "C++",
  "Machine Learning", "Data Analysis", "UI/UX Design", "DevOps",
  "Cloud Computing", "TypeScript", "Git", "Docker", "AWS",
];

const experienceLevels = [
  { value: "beginner", label: "Beginner", desc: "Just starting my journey" },
  { value: "intermediate", label: "Intermediate", desc: "Some projects & knowledge" },
  { value: "advanced", label: "Advanced", desc: "Strong skills, need direction" },
];

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [hours, setHours] = useState(2);
  const [saving, setSaving] = useState(false);

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const finalGoal = goal === "Other" ? customGoal : goal;
      const { error } = await supabase.from("profiles").update({
        career_goal: finalGoal,
        skills,
        experience_level: level,
        daily_hours: hours,
        onboarding_complete: true,
      }).eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Your personalized roadmap is ready!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      title: "What's your career goal?",
      subtitle: "Choose where you want to go",
      icon: Target,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[...careerGoals, "Other"].map(g => (
            <motion.button key={g} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setGoal(g)}
              className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${goal === g ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
              {g}
            </motion.button>
          ))}
          {goal === "Other" && <Input placeholder="Type your goal..." value={customGoal} onChange={e => setCustomGoal(e.target.value)} className="col-span-2 mt-2" />}
        </div>
      ),
      valid: goal && (goal !== "Other" || customGoal),
    },
    {
      title: "What skills do you have?",
      subtitle: "Select all that apply",
      icon: Zap,
      content: (
        <div className="flex flex-wrap gap-2">
          {skillOptions.map(s => (
            <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkill(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${skills.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {skills.includes(s) && <Check className="w-3 h-3 inline mr-1" />}{s}
            </motion.button>
          ))}
        </div>
      ),
      valid: skills.length > 0,
    },
    {
      title: "Your experience level?",
      subtitle: "This helps us personalize your roadmap",
      icon: Brain,
      content: (
        <div className="space-y-3">
          {experienceLevels.map(l => (
            <motion.button key={l.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => setLevel(l.value)}
              className={`w-full p-5 rounded-xl border text-left transition-all ${level === l.value ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
              <div className="font-semibold">{l.label}</div>
              <div className="text-sm text-muted-foreground">{l.desc}</div>
            </motion.button>
          ))}
        </div>
      ),
      valid: !!level,
    },
    {
      title: "Daily availability?",
      subtitle: "How many hours can you dedicate per day?",
      icon: Clock,
      content: (
        <div className="text-center space-y-6">
          <div className="font-display text-7xl font-bold text-primary">{hours}</div>
          <div className="text-muted-foreground">hours per day</div>
          <input type="range" min={1} max={10} value={hours} onChange={e => setHours(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 hr</span><span>10 hrs</span></div>
        </div>
      ),
      valid: true,
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-vedoryn-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-xl mx-4 relative z-10">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass rounded-2xl p-8 shadow-elevated"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">{current.title}</h2>
                <p className="text-sm text-muted-foreground">{current.subtitle}</p>
              </div>
            </div>
            <div className="mt-6 max-h-[400px] overflow-y-auto">{current.content}</div>
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!current.valid} className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={saving} className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                  {saving ? "Setting up..." : "Launch Dashboard"} <Sparkles className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
