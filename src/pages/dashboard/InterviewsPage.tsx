import { motion } from "framer-motion";
import { Mic, Play, Clock, Send, CheckCircle2, XCircle, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const interviewTypes = [
  { title: "Technical", desc: "Data structures, algorithms, system design", icon: "💻" },
  { title: "Behavioral", desc: "Situational, leadership, teamwork", icon: "🤝" },
  { title: "Domain", desc: "Role-specific deep-dive questions", icon: "🎯" },
  { title: "HR Round", desc: "Salary, culture fit, expectations", icon: "📋" },
];

const roleOptions = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "Product Manager", "DevOps Engineer",
  "ML Engineer", "UI/UX Designer", "Mobile Developer",
];

type Evaluation = {
  score: number;
  feedback: string;
  model_answer: string;
  strengths: string[];
  improvements: string[];
};

export default function InterviewsPage() {
  const { profile } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(profile?.career_goal || "");
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questionsAsked, setQuestionsAsked] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);

  const generateQuestion = async () => {
    setLoading(true);
    setEvaluation(null);
    setAnswer("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: {
          action: "generate_question",
          interviewType: selectedType,
          roleTarget: selectedRole,
          questionsAsked,
          profile: profile ? { skills: profile.skills, experience_level: profile.experience_level } : null,
        },
      });
      if (error) throw error;
      setCurrentQuestion(data.question);
      setQuestionsAsked(prev => [...prev, data.question]);
      setQuestionNumber(prev => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-interview", {
        body: {
          action: "evaluate_answer",
          interviewType: selectedType,
          roleTarget: selectedRole,
          question: currentQuestion,
          answer: answer.trim(),
          profile: profile ? { skills: profile.skills, experience_level: profile.experience_level } : null,
        },
      });
      if (error) throw error;
      setEvaluation(data);
      setScores(prev => [...prev, data.score]);
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate");
    } finally {
      setEvaluating(false);
    }
  };

  const startInterview = async () => {
    setStarted(true);
    setScores([]);
    setQuestionsAsked([]);
    setQuestionNumber(0);
    await generateQuestion();
  };

  const avgScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) : 0;

  if (started) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <Mic className="w-7 h-7 text-vedoryn-pink" /> {selectedType} Interview — {selectedRole}
            </h1>
            <p className="text-sm text-muted-foreground">Question {questionNumber} • Avg Score: {avgScore}/100</p>
          </div>
          <Button variant="outline" onClick={() => { setStarted(false); setEvaluation(null); }}>End Interview</Button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {scores.map((s, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${s >= 7 ? "bg-vedoryn-green" : s >= 5 ? "bg-vedoryn-orange" : "bg-destructive"}`} />
          ))}
          {loading && <div className="h-2 flex-1 rounded-full bg-secondary animate-pulse" />}
        </div>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-2xl bg-card border border-border shadow-card flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground">AI is generating your question...</span>
          </motion.div>
        ) : (
          <>
            {/* Question */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="text-xs font-medium text-primary mb-2">Question {questionNumber}</div>
              <p className="text-lg font-medium">{currentQuestion}</p>
            </motion.div>

            {/* Answer */}
            {!evaluation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Be as detailed as you would in a real interview."
                  className="w-full h-40 p-4 rounded-xl border border-border bg-card text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={submitAnswer} disabled={evaluating || !answer.trim()} className="mt-3 bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                  {evaluating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Evaluating...</> : <><Send className="w-4 h-4 mr-2" />Submit Answer</>}
                </Button>
              </motion.div>
            )}

            {/* Evaluation */}
            {evaluation && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${evaluation.score >= 7 ? "bg-vedoryn-green/10 text-vedoryn-green" : evaluation.score >= 5 ? "bg-vedoryn-orange/10 text-vedoryn-orange" : "bg-destructive/10 text-destructive"}`}>
                      {evaluation.score}/10
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg">Evaluation</h3>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < evaluation.score ? "text-vedoryn-gold fill-vedoryn-gold" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{evaluation.feedback}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-vedoryn-green/5 border border-vedoryn-green/20">
                      <h4 className="text-sm font-semibold text-vedoryn-green flex items-center gap-1 mb-2"><CheckCircle2 className="w-4 h-4" />Strengths</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {evaluation.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-vedoryn-orange/5 border border-vedoryn-orange/20">
                      <h4 className="text-sm font-semibold text-vedoryn-orange flex items-center gap-1 mb-2"><XCircle className="w-4 h-4" />To Improve</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {evaluation.improvements?.map((s, i) => <li key={i}>• {s}</li>)}
                      </ul>
                    </div>
                  </div>

                  {evaluation.model_answer && (
                    <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <h4 className="text-sm font-semibold text-primary mb-1">💡 Model Answer</h4>
                      <p className="text-xs text-muted-foreground">{evaluation.model_answer}</p>
                    </div>
                  )}
                </div>

                <Button onClick={generateQuestion} className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
                  Next Question <Play className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Mic className="w-8 h-8 text-vedoryn-pink" /> AI Interviews
        </h1>
        <p className="text-muted-foreground mt-1">Practice with real AI-powered interviews and get detailed feedback.</p>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg mb-4">Choose Interview Type</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {interviewTypes.map((type) => (
            <motion.button key={type.title} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.title)}
              className={`p-5 rounded-xl border text-left transition-all ${selectedType === type.title ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-card hover:border-primary/30"}`}>
              <div className="text-3xl mb-3">{type.icon}</div>
              <h4 className="font-display font-semibold">{type.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-display font-semibold text-lg mb-4">Select Target Role</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {roleOptions.map(r => (
              <button key={r} onClick={() => setSelectedRole(r)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedRole === r ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {r}
              </button>
            ))}
          </div>
          {selectedRole && (
            <Button onClick={startInterview} className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
              <Play className="w-4 h-4 mr-2" /> Start {selectedType} Interview for {selectedRole}
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
