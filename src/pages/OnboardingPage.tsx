import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Brain, Target, Zap, Clock, ArrowRight, Check, Sparkles,
  GraduationCap, BookOpen, Heart, Settings, User,
} from "lucide-react";

const educationLevels = [
  { value: "class_6_10", label: "Class 6–10", desc: "Middle school / High school" },
  { value: "class_11_12", label: "Class 11–12", desc: "Senior secondary" },
  { value: "undergraduate", label: "Undergraduate", desc: "Bachelor's degree" },
  { value: "postgraduate", label: "Postgraduate", desc: "Master's / PhD" },
  { value: "professional", label: "Working Professional", desc: "Already employed" },
];

const streamOptions = [
  "Science (PCM)", "Science (PCB)", "Commerce", "Arts / Humanities",
  "Computer Science", "Engineering", "Medicine", "Law", "Business", "Design",
];

const careerGoals = [
  "Software Engineer", "Data Scientist", "Product Manager", "UI/UX Designer",
  "DevOps Engineer", "Full Stack Developer", "Machine Learning Engineer",
  "Cybersecurity Analyst", "Cloud Architect", "Mobile Developer",
  "Doctor", "Lawyer", "Business Analyst", "Civil Services",
];

const skillOptions = [
  "Python", "JavaScript", "React", "Node.js", "SQL", "Java", "C++",
  "Machine Learning", "Data Analysis", "UI/UX Design", "DevOps",
  "Cloud Computing", "TypeScript", "Git", "Docker", "AWS",
  "Communication", "Leadership", "Problem Solving", "Critical Thinking",
];

const subjectOptions = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "English", "Economics", "Accounting", "History", "Psychology",
  "Statistics", "Electronics", "Mechanical", "Civil", "Business Studies",
];

const interestOptions = [
  "Artificial Intelligence", "Web Development", "App Development",
  "Data Science", "Cybersecurity", "Cloud Computing", "Game Development",
  "Blockchain", "IoT", "Robotics", "Research", "Entrepreneurship",
  "Content Creation", "Digital Marketing", "Finance",
];

const experienceLevels = [
  { value: "beginner", label: "Beginner", desc: "Just starting my journey" },
  { value: "intermediate", label: "Intermediate", desc: "Some projects & knowledge" },
  { value: "advanced", label: "Advanced", desc: "Strong skills, need direction" },
];

const learningStyles = [
  { value: "visual", label: "Visual", desc: "Videos, diagrams, charts", icon: "👁️" },
  { value: "reading", label: "Reading", desc: "Articles, docs, books", icon: "📖" },
  { value: "hands_on", label: "Hands-On", desc: "Projects, coding, labs", icon: "🛠️" },
  { value: "mixed", label: "Mixed", desc: "All of the above", icon: "🎯" },
];

const productivityLevels = [
  { value: "low", label: "Building Up", desc: "Need help staying consistent" },
  { value: "moderate", label: "Moderate", desc: "Work in focused bursts" },
  { value: "high", label: "High", desc: "Very disciplined and consistent" },
];

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step data
  const [age, setAge] = useState<number>(18);
  const [educationLevel, setEducationLevel] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [academicStream, setAcademicStream] = useState("");

  const [subjects, setSubjects] = useState<string[]>([]);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);

  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [longTermGoal, setLongTermGoal] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [level, setLevel] = useState("");

  const [hours, setHours] = useState(2);
  const [productivityLevel, setProductivityLevel] = useState("moderate");
  const [learningStyle, setLearningStyle] = useState("");

  const [stressLevel, setStressLevel] = useState(5);
  const [motivationLevel, setMotivationLevel] = useState(7);

  const toggle = (arr: string[], set: React.Dispatch<React.SetStateAction<string[]>>, val: string) =>
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const finalGoal = goal === "Other" ? customGoal : goal;
      const { error } = await supabase.from("profiles").update({
        age,
        education_level: educationLevel,
        current_class: currentClass,
        academic_stream: academicStream,
        subjects,
        weak_areas: weakAreas,
        career_goal: finalGoal,
        interests,
        long_term_goal: longTermGoal,
        skills,
        experience_level: level,
        daily_hours: hours,
        productivity_level: productivityLevel,
        learning_style: learningStyle,
        stress_level: stressLevel,
        motivation_level: motivationLevel,
        onboarding_complete: true,
      } as any).eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Your personalized dashboard is ready! 🚀");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      title: "Tell us about yourself",
      subtitle: "Age & education level",
      icon: User,
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Age</label>
            <div className="flex items-center gap-4">
              <input type="range" min={10} max={50} value={age} onChange={e => setAge(Number(e.target.value))}
                className="flex-1 accent-primary" />
              <span className="font-display text-3xl font-bold text-primary w-12 text-center">{age}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">Education Level</label>
            <div className="space-y-2">
              {educationLevels.map(l => (
                <motion.button key={l.value} whileTap={{ scale: 0.98 }}
                  onClick={() => setEducationLevel(l.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${educationLevel === l.value ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
                  <div className="font-semibold text-sm">{l.label}</div>
                  <div className="text-xs text-muted-foreground">{l.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
          {(educationLevel === "class_6_10" || educationLevel === "class_11_12") && (
            <Input placeholder="Current class (e.g. Class 9, Class 12)" value={currentClass} onChange={e => setCurrentClass(e.target.value)} />
          )}
        </div>
      ),
      valid: !!educationLevel,
    },
    {
      title: "Academic details",
      subtitle: "Stream & subjects",
      icon: GraduationCap,
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Academic Stream</label>
            <div className="grid grid-cols-2 gap-2">
              {streamOptions.map(s => (
                <motion.button key={s} whileTap={{ scale: 0.98 }}
                  onClick={() => setAcademicStream(s)}
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${academicStream === s ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">Subjects you study</label>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map(s => (
                <motion.button key={s} whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(subjects, setSubjects, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${subjects.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {subjects.includes(s) && <Check className="w-3 h-3 inline mr-1" />}{s}
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">Weak areas (optional)</label>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map(s => (
                <motion.button key={s} whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(weakAreas, setWeakAreas, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${weakAreas.includes(s) ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: !!academicStream,
    },
    {
      title: "Career goal & interests",
      subtitle: "Where do you want to go?",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {[...careerGoals, "Other"].map(g => (
              <motion.button key={g} whileTap={{ scale: 0.98 }}
                onClick={() => setGoal(g)}
                className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${goal === g ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
                {g}
              </motion.button>
            ))}
            {goal === "Other" && <Input placeholder="Your career goal..." value={customGoal} onChange={e => setCustomGoal(e.target.value)} className="col-span-2" />}
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(s => (
                <motion.button key={s} whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(interests, setInterests, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${interests.includes(s) ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {interests.includes(s) && <Check className="w-3 h-3 inline mr-1" />}{s}
                </motion.button>
              ))}
            </div>
          </div>
          <Input placeholder="Long-term vision (e.g., Lead engineer at Google)" value={longTermGoal} onChange={e => setLongTermGoal(e.target.value)} />
        </div>
      ),
      valid: goal && (goal !== "Other" || customGoal),
    },
    {
      title: "Your current skills",
      subtitle: "Select all that apply",
      icon: Zap,
      content: (
        <div className="flex flex-wrap gap-2">
          {skillOptions.map(s => (
            <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => toggle(skills, setSkills, s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${skills.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {skills.includes(s) && <Check className="w-3 h-3 inline mr-1" />}{s}
            </motion.button>
          ))}
        </div>
      ),
      valid: skills.length > 0,
    },
    {
      title: "Experience level",
      subtitle: "Helps personalize your roadmap",
      icon: Brain,
      content: (
        <div className="space-y-3">
          {experienceLevels.map(l => (
            <motion.button key={l.value} whileTap={{ scale: 0.99 }}
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
      title: "Learning preferences",
      subtitle: "How do you learn best?",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {learningStyles.map(l => (
              <motion.button key={l.value} whileTap={{ scale: 0.98 }}
                onClick={() => setLearningStyle(l.value)}
                className={`p-4 rounded-xl border text-center transition-all ${learningStyle === l.value ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
                <div className="text-2xl mb-2">{l.icon}</div>
                <div className="font-semibold text-sm">{l.label}</div>
                <div className="text-xs text-muted-foreground">{l.desc}</div>
              </motion.button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">Productivity level</label>
            <div className="space-y-2">
              {productivityLevels.map(p => (
                <motion.button key={p.value} whileTap={{ scale: 0.99 }}
                  onClick={() => setProductivityLevel(p.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${productivityLevel === p.value ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
                  <div className="font-semibold text-sm">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: !!learningStyle,
    },
    {
      title: "Daily availability",
      subtitle: "How many hours can you dedicate?",
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
    {
      title: "Mental wellness check",
      subtitle: "This helps us keep you balanced",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Stress Level</label>
              <span className="text-sm font-bold text-primary">{stressLevel}/10</span>
            </div>
            <input type="range" min={1} max={10} value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>😊 Relaxed</span><span>😰 Very Stressed</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Motivation Level</label>
              <span className="text-sm font-bold text-primary">{motivationLevel}/10</span>
            </div>
            <input type="range" min={1} max={10} value={motivationLevel} onChange={e => setMotivationLevel(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>😔 Low</span><span>🔥 Super Motivated</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-vedoryn-green/10 border border-vedoryn-green/20 text-sm">
            <span className="font-semibold text-vedoryn-green">💚 Your wellness matters.</span>
            <p className="text-muted-foreground mt-1">We'll use this to pace your learning and prevent burnout.</p>
          </div>
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
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground mb-4">
          Step {step + 1} of {steps.length}
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
            <div className="mt-6 max-h-[400px] overflow-y-auto pr-1">{current.content}</div>
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
