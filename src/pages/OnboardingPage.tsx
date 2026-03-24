"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Brain,
  Target,
  Zap,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  GraduationCap,
  BookOpen,
  Heart,
  User,
} from "lucide-react";

/* ============================================================
   OPTIONS
============================================================ */

const educationLevels = [
  { value: "class_6_10", label: "Class 6–10", desc: "Building foundational knowledge." },
  { value: "class_11_12", label: "Class 11–12", desc: "Preparing for important career choices." },
  { value: "undergraduate", label: "Undergraduate", desc: "Exploring advanced subjects." },
  { value: "postgraduate", label: "Postgraduate", desc: "Deepening specialization." },
  { value: "professional", label: "Working Professional", desc: "Improving or switching careers." },
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
  { value: "beginner", label: "Beginner", desc: "Starting from scratch." },
  { value: "intermediate", label: "Intermediate", desc: "Some projects and practice." },
  { value: "advanced", label: "Advanced", desc: "Looking for next‑level mastery." },
];

const learningStyles = [
  { value: "visual", label: "Visual", desc: "Videos & diagrams", icon: "👁️" },
  { value: "reading", label: "Reading", desc: "Articles, docs & books", icon: "📖" },
  { value: "hands_on", label: "Hands-On", desc: "Projects & practice", icon: "🛠️" },
  { value: "mixed", label: "Mixed", desc: "Everything together", icon: "🎯" },
];

const productivityLevels = [
  { value: "low", label: "Building Momentum", desc: "Need help staying consistent" },
  { value: "moderate", label: "Balanced", desc: "Focused bursts" },
  { value: "high", label: "Highly Disciplined", desc: "Consistent and structured" },
];

/* ============================================================
   COMPONENT
============================================================ */

export default function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  /* Redirect if onboarding is already complete */
  useEffect(() => {
    if (profile?.onboarding_complete) navigate("/dashboard");
  }, [profile]);

  if (!user) return null;

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [age, setAge] = useState(profile?.age || 18);
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || "");
  const [currentClass, setCurrentClass] = useState(profile?.current_class || "");
  const [academicStream, setAcademicStream] = useState(profile?.academic_stream || "");

  const [subjects, setSubjects] = useState<string[]>(profile?.subjects || []);
  const [weakAreas, setWeakAreas] = useState<string[]>(profile?.weak_areas || []);

  const [goal, setGoal] = useState(profile?.career_goal || "");
  const [customGoal, setCustomGoal] = useState("");
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [longTermGoal, setLongTermGoal] = useState(profile?.long_term_goal || "");

  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [level, setLevel] = useState(profile?.experience_level || "");

  const [hours, setHours] = useState(profile?.daily_hours || 2);
  const [productivityLevel, setProductivityLevel] = useState(profile?.productivity_level || "moderate");
  const [learningStyle, setLearningStyle] = useState(profile?.learning_style || "");

  const [stressLevel, setStressLevel] = useState(profile?.stress_level || 5);
  const [motivationLevel, setMotivationLevel] = useState(profile?.motivation_level || 7);

  const toggle = (arr: string[], set: any, val: string) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  /* ============================================================
     SAVE
  ============================================================ */

  const handleFinish = async () => {
    try {
      setSaving(true);

      const finalGoal = goal === "Other" ? customGoal : goal;

      const { error } = await supabase
        .from("profiles")
        .update({
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
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success("Your personalized dashboard is ready!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     STEPS (all included, stable, error-free)
  ============================================================ */

  const steps = [
    /* ======================= STEP 1 ======================= */
    {
      title: "Tell us about yourself",
      subtitle: "We’ll use your age & education level to personalize your plan.",
      icon: User,
      valid: !!educationLevel,
      content: (
        <div className="space-y-8">

          {/* Age */}
          <div>
            <label className="text-sm font-medium">Your Age</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min={10}
                max={60}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="font-display text-4xl text-primary w-14 text-center">
                {age}
              </span>
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="text-sm font-medium">Education Level</label>
            <div className="space-y-3 mt-3">
              {educationLevels.map((l) => (
                <motion.button
                  key={l.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEducationLevel(l.value)}
                  className={`w-full p-4 rounded-xl border text-left transition ${
                    educationLevel === l.value
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold">{l.label}</div>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {(educationLevel === "class_6_10" || educationLevel === "class_11_12") && (
            <Input
              placeholder="Your current class (e.g. Class 10)"
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value)}
            />
          )}
        </div>
      ),
    },

    /* ======================= STEP 2 ======================= */
    {
      title: "Academic background",
      subtitle: "Tell us your stream & subjects.",
      icon: GraduationCap,
      valid: !!academicStream,
      content: (
        <div className="space-y-8">
          {/* Stream */}
          <div>
            <label className="text-sm font-medium">Academic Stream</label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {streamOptions.map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAcademicStream(s)}
                  className={`p-3 rounded-xl border text-left transition text-sm font-medium ${
                    academicStream === s
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="text-sm font-medium">Subjects You Study</label>
            <p className="text-xs text-muted-foreground mb-2">Select multiple</p>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(subjects, setSubjects, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    subjects.includes(s)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {subjects.includes(s) && <Check className="w-3 h-3 inline mr-1" />}
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Weak Areas */}
          <div>
            <label className="text-sm font-medium">Weak Areas</label>
            <p className="text-xs text-muted-foreground mb-2">(Optional)</p>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(weakAreas, setWeakAreas, s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    weakAreas.includes(s)
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    /* ======================= STEP 3 ======================= */
    {
      title: "Career goal & interests",
      subtitle: "Where do you see yourself?",
      icon: Target,
      valid: goal && (goal !== "Other" || customGoal),
      content: (
        <div className="space-y-8">

          {/* Career Goal */}
          <label className="text-sm font-medium">Select your career goal</label>
          <div className="grid grid-cols-2 gap-3">
            {[...careerGoals, "Other"].map((g) => (
              <motion.button
                key={g}
                whileTap={{ scale: 0.97 }}
                onClick={() => setGoal(g)}
                className={`p-3 rounded-xl border text-left transition text-sm font-medium ${
                  goal === g
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {g}
              </motion.button>
            ))}
          </div>

          {goal === "Other" && (
            <Input
              placeholder="Your custom goal…"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
            />
          )}

          {/* Interests */}
          <div>
            <label className="text-sm font-medium">Interests</label>
            <p className="text-xs text-muted-foreground mb-2">Choose your passions</p>

            <div className="flex flex-wrap gap-2">
              {interestOptions.map((i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(interests, setInterests, i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    interests.includes(i)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {interests.includes(i) && <Check className="w-3 h-3 inline mr-1" />}
                  {i}
                </motion.button>
              ))}
            </div>
          </div>

          <Input
            placeholder="Long-term dream (e.g., Work at Google)"
            value={longTermGoal}
            onChange={(e) => setLongTermGoal(e.target.value)}
          />
        </div>
      ),
    },

    /* ======================= STEP 4 ======================= */
    {
      title: "Your skills",
      subtitle: "Your strengths help us tailor your journey.",
      icon: Zap,
      valid: skills.length > 0,
      content: (
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggle(skills, setSkills, s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                skills.includes(s)
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {skills.includes(s) && <Check className="inline w-4 h-4 mr-1" />}
              {s}
            </motion.button>
          ))}
        </div>
      ),
    },

    /* ======================= STEP 5 ======================= */
    {
      title: "Experience level",
      subtitle: "This determines your starting difficulty.",
      icon: Brain,
      valid: !!level,
      content: (
        <div className="space-y-3">
          {experienceLevels.map((l) => (
            <motion.button
              key={l.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLevel(l.value)}
              className={`w-full p-5 rounded-xl border text-left transition-all ${
                level === l.value
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="font-semibold">{l.label}</div>
              <p className="text-sm text-muted-foreground">{l.desc}</p>
            </motion.button>
          ))}
        </div>
      ),
    },

    /* ======================= STEP 6 ======================= */
    {
      title: "Learning preferences",
      subtitle: "We’ll adapt lessons based on how you learn best.",
      icon: BookOpen,
      valid: !!learningStyle,
      content: (
        <div className="space-y-8">
          {/* Style */}
          <div className="grid grid-cols-2 gap-3">
            {learningStyles.map((l) => (
              <motion.button
                key={l.value}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLearningStyle(l.value)}
                className={`p-4 rounded-xl border text-center transition ${
                  learningStyle === l.value
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="text-2xl mb-2">{l.icon}</div>
                <div className="font-semibold text-sm">{l.label}</div>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </motion.button>
            ))}
          </div>

          {/* Productivity */}
          <div>
            <label className="text-sm font-medium">Productivity level</label>
            <div className="space-y-2 mt-3">
              {productivityLevels.map((p) => (
                <motion.button
                  key={p.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setProductivityLevel(p.value)}
                  className={`w-full p-4 rounded-xl border text-left transition ${
                    productivityLevel === p.value
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold text-sm">{p.label}</div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    /* ======================= STEP 7 ======================= */
    {
      title: "Daily commitment",
      subtitle: "How much time can you invest?",
      icon: Clock,
      valid: true,
      content: (
        <div className="text-center space-y-6">
          <div className="font-display text-7xl font-bold text-primary">{hours}</div>
          <p className="text-muted-foreground">hours per day</p>

          <input
            type="range"
            min={1}
            max={10}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-primary"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 hr</span>
            <span>10 hrs</span>
          </div>
        </div>
      ),
    },

    /* ======================= STEP 8 ======================= */
    {
      title: "Your wellness",
      subtitle: "This helps avoid burnout and maintain consistency.",
      icon: Heart,
      valid: true,
      content: (
        <div className="space-y-10">
          {/* Stress */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Stress Level</label>
              <span className="font-bold text-primary">{stressLevel}/10</span>
            </div>

            <input
              type="range"
              min={1}
              max={10}
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-primary"
            />

            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>😊 Relaxed</span>
              <span>😰 Stressed</span>
            </div>
          </div>

          {/* Motivation */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Motivation Level</label>
              <span className="font-bold text-primary">{motivationLevel}/10</span>
            </div>

            <input
              type="range"
              min={1}
              max={10}
              value={motivationLevel}
              onChange={(e) => setMotivationLevel(Number(e.target.value))}
              className="w-full accent-primary"
            />

            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>😔 Low</span>
              <span>🔥 Motivated</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
            <span className="font-semibold text-green-700">
              💚 Your wellness matters to us.
            </span>
            <p className="text-muted-foreground mt-1">
              We balance your roadmap to help avoid burnout while maximizing progress.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  /* ============================================================
     RENDER UI
  ============================================================ */

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">

      {/* Floating blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Container */}
      <div className="w-full max-w-xl mx-4 relative z-10">

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <p className="text-sm text-muted-foreground text-center mb-4">
          Step {step + 1} of {steps.length}
        </p>

        {/* Animated Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-2xl p-8 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold">{current.title}</h2>
                <p className="text-sm text-muted-foreground">{current.subtitle}</p>
              </div>
            </div>

            {/* Step Content */}
            <div className="mt-6 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
              {current.content}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">

              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < steps.length - 1 ? (
                <Button
                  onClick={() => current.valid && setStep(step + 1)}
                  disabled={!current.valid}
                  className="bg-gradient-to-r from-primary to-purple-500 text-white"
                >
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={saving}
                  className="bg-gradient-to-r from-primary to-purple-500 text-white"
                >
                  {saving ? "Saving..." : "Complete Onboarding"}
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
