import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, TrendingUp, Target, Briefcase, Mic, BookOpen, ArrowUpRight,
  Crown, Bell, Sparkles, HeartPulse, Activity, ShieldCheck, GraduationCap,
  Star, Swords, LineChart, Gem, HandHelping, FileText, Wand2, History,
  Flame, CalendarCheck, Zap, Clock, ExternalLink, User, CheckCircle2, Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { CareerScore3D } from "@/components/dashboard/CareerScore3D";
import { useAuth } from "@/hooks/useAuth";

/* --------------------------------------------
   Royal Motion Presets
--------------------------------------------- */
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

/* --------------------------------------------
   Lightweight Helpers
--------------------------------------------- */
const classNames = (...c: (string | undefined | false)[]) => c.filter(Boolean).join(" ");

const formatPercent = (v?: number) => `${Math.max(0, Math.min(100, Math.round(v ?? 0))).toString()}%`;

/** Simple progress bar */
const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <div className={classNames("w-full h-2 rounded-full bg-white/10 overflow-hidden", className)}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-all"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

/** Tiny spark bar (no extra charts lib) */
const SparkBar: React.FC<{ values: number[]; max?: number; className?: string }> = ({ values, max, className }) => {
  const m = max ?? Math.max(1, ...values);
  return (
    <div className={classNames("flex items-end gap-1 h-10", className)}>
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 bg-emerald-400/80 rounded-sm transition-all"
          style={{ height: `${(v / m) * 100}%` }}
        />
      ))}
    </div>
  );
};

/** Glass card shell */
const GlassCard: React.FC<React.PropsWithChildren<{ className?: string; glow?: boolean }>> = ({ className, glow, children }) => (
  <div
    className={classNames(
      "relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-md",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
      glow && "hover:shadow-[0_0_24px_0_rgba(255,215,0,0.25)]",
      "transition-all duration-200",
      className
    )}
  >
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/5 via-transparent to-emerald-400/5 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

/** Pill chip */
const Pill: React.FC<{ children: React.ReactNode; tone?: "primary" | "emerald" | "amber" | "rose" | "slate"; className?: string }> = ({ children, tone = "slate", className }) => {
  const map: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    rose: "bg-rose-500/10 text-rose-400",
    slate: "bg-white/10 text-white/80"
  };
  return <span className={classNames("px-2 py-0.5 text-xs rounded-md font-medium", map[tone], className)}>{children}</span>;
};

/* --------------------------------------------
   Hook: dashboard data (auto-refresh)
--------------------------------------------- */
type Job = { id: string; title: string; company: string; match_score: number; link: string };
type Scholarship = { id: string; title: string; eligibility: string; deadline: string; link: string };
type Recommendation = { id: string; title: string; priority: "High" | "Medium" | "Low"; impact: "High" | "Medium" | "Low"; minutes: number };
type HistoryEvent = { id: string; ts: string; type: string; label: string; delta?: string };

type DashboardPayload = {
  ai_status: "idle" | "analyzing" | "ready";
  insights: string;
  metrics: {
    career_score: number;
    skill_power: number;
    consistency: number;
    interview_strength: number;
    wellness: number;
    goal_progress: number;
    level: number;
    xp: number;
    xp_to_next: number;
    streak_days: number;
  };
  skills: string[];
  roadmap: { current_step: string; next_step: string; step_index: number; total_steps: number; progress_pct: number };
  jobs: Job[];
  scholarships: Scholarship[];
  interview: { last_score: number; last_weak_areas: string[]; trend: number[] };
  wellness: { stress_score: number; burnout_risk: "Low" | "Medium" | "High"; advice: string };
  achievements: { id: string; label: string; icon: "brain" | "sword" | "flame" | "trophy" | "star"; unlocked_at: string }[];
  proof: { verified_skills: string[]; verified_projects: string[]; trust_score: number };
  history: HistoryEvent[];
};

function useDashboardData(token?: string) {
  const [data, setData] = React.useState<DashboardPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async (signal?: AbortSignal) => {
    try {
      setError(null);
      // Try real backend first
      const res = await fetch("/api/dashboard/overview", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal
      });
      if (res.ok) {
        const json = (await res.json()) as DashboardPayload;
        setData(json);
      } else {
        // Fallback to computed demo data (still “live” and reactive)
        setData(buildFallback());
      }
    } catch {
      setData(buildFallback());
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    const id = setInterval(() => fetchData(), 20000); // auto-refresh every 20s
    return () => {
      ac.abort();
      clearInterval(id);
    };
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData() };
}

/** Fallback generator: uses time to create “live-feel” values */
function buildFallback(): DashboardPayload {
  const t = Date.now();
  const wobble = (base: number, amp: number) => base + Math.round(Math.sin(t / 30000) * amp);
  const score = Math.max(35, Math.min(82, wobble(64, 8)));

  return {
    ai_status: "analyzing",
    insights: "Your consistency improved by +12% this week. Keep going to reach 70+.",
    metrics: {
      career_score: score,
      skill_power: wobble(62, 10),
      consistency: wobble(58, 12),
      interview_strength: wobble(49, 15),
      wellness: wobble(72, 6),
      goal_progress: wobble(46, 8),
      level: 7,
      xp: 1840,
      xp_to_next: 260,
      streak_days: Math.max(0, Math.floor((t / 86400000) % 9))
    },
    skills: ["Python", "Data Structures", "SQL", "Git", "React", "Problem Solving"],
    roadmap: {
      current_step: "Build DS/Algo Foundations",
      next_step: "Implement LeetCode patterns",
      step_index: 2,
      total_steps: 6,
      progress_pct: 45
    },
    jobs: [
      { id: "j1", title: "SDE Intern", company: "InovaTech", match_score: 76, link: "https://jobs.example.com/inovatech-sde-intern" },
      { id: "j2", title: "Data Analyst Intern", company: "Insightly", match_score: 72, link: "https://jobs.example.com/insightly-da-intern" },
      { id: "j3", title: "Junior Frontend Dev", company: "WebSmiths", match_score: 69, link: "https://jobs.example.com/websmiths-fe" }
    ],
    scholarships: [
      { id: "s1", title: "Tech Excellence Grant", eligibility: "CGPA ≥ 7.0", deadline: "2026-04-20", link: "https://scholarships.example.com/tech-excellence" },
      { id: "s2", title: "AI Innovators Scholarship", eligibility: "Final-year + AI projects", deadline: "2026-05-05", link: "https://scholarships.example.com/ai-innovators" }
    ],
    interview: {
      last_score: wobble(63, 12),
      last_weak_areas: ["System Design Basics", "SQL Joins"],
      trend: [32, 45, 52, 48, 61, 66, 64]
    },
    wellness: {
      stress_score: 38,
      burnout_risk: "Low",
      advice: "You are in a good zone. Keep the 50/10 focus-break rhythm."
    },
    achievements: [
      { id: "a1", label: "First Skill Learned", icon: "brain", unlocked_at: "2026-03-01" },
      { id: "a2", label: "7 Day Streak", icon: "flame", unlocked_at: "2026-03-15" },
      { id: "a3", label: "Interview Completed", icon: "sword", unlocked_at: "2026-03-18" }
    ],
    proof: {
      verified_skills: ["Python", "Git"],
      verified_projects: ["Movie Recommender", "Portfolio Site"],
      trust_score: 73
    },
    history: [
      { id: "h1", ts: "2026-03-22T19:20:00Z", type: "task", label: "Completed: Arrays 101", delta: "+2 VCS" },
      { id: "h2", ts: "2026-03-22T10:10:00Z", type: "interview", label: "Mock Interview: DSA Round", delta: "+4 Interview" },
      { id: "h3", ts: "2026-03-21T16:30:00Z", type: "application", label: "Applied: SDE Intern @ InovaTech" }
    ]
  };
}

/* --------------------------------------------
   Icon map for achievements
--------------------------------------------- */
const AchIcon: Record<string, React.ComponentType<any>> = {
  brain: Brain,
  sword: Swords,
  flame: Flame,
  star: Star,
  trophy: Trophy
};

/* --------------------------------------------
   Main Component
--------------------------------------------- */
export default function DashboardOverview() {
  const { profile, isGuest, token } = useAuth() as any;
  const displayName = profile?.display_name || "Explorer";
  const goal = profile?.career_goal || null;

  const { data, loading, error, refetch } = useDashboardData(token);

  const careerScore = data?.metrics.career_score ?? 0;
  const level = data?.metrics.level ?? 1;
  const xp = data?.metrics.xp ?? 0;
  const xpToNext = data?.metrics.xp_to_next ?? 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={classNames(
        "space-y-8 max-w-7xl mx-auto",
        "text-white",
        "pb-12"
      )}
    >
      {/* Royal Gradient Backdrop */}
      <div className="fixed inset-0 -z-10 bg-[#0b0f14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.12),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.10),transparent_45%)]" />
      </div>

      {/* 1) TOP HEADER — ROYAL IDENTITY BAR */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            👑 Welcome to Your Darbar, <span className="text-amber-400">{isGuest ? "Guest" : displayName}</span>
          </h1>
          <p className="text-white/70 mt-1">
            Your AI-powered royal advisor is ready. Your journey to mastery continues.
          </p>

          {!profile?.onboarding_complete && !isGuest && (
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 mt-2 text-sm text-amber-300 font-medium hover:underline"
            >
              Complete onboarding for a personalized experience <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* AI Status */}
          <GlassCard className="px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-medium">
                {data?.ai_status === "analyzing" ? "Analyzing your progress…" : "AI Ready"}
              </span>
            </div>
          </GlassCard>

          {/* Notifications */}
          <NotificationsButton />

          {/* Avatar */}
          <Link
            to="/dashboard/profile"
            className="group relative"
            title="Profile"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/30 to-emerald-400/30 border border-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-white/90" />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </Link>
        </div>
      </motion.div>

      {/* 2) HERO PANEL — CAREER SCORE THRONE */}
      <motion.div variants={item}>
        <GlassCard glow className="p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex flex-col items-center">
              <h3 className="font-display font-semibold text-lg mb-2">Career Score Throne</h3>
              <CareerScore3D score={careerScore} className="max-w-[220px]" />
              <Link
                to="/dashboard/career-score"
                className="mt-3 inline-flex items-center gap-1 text-sm text-amber-300 hover:underline"
              >
                View Full Career Score Analysis <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="md:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricTile icon={Brain} label="Skill Power" value={formatPercent(data?.metrics.skill_power)} tone="emerald" />
              <MetricTile icon={Activity} label="Consistency" value={formatPercent(data?.metrics.consistency)} tone="amber" />
              <MetricTile icon={Mic} label="Interview Strength" value={formatPercent(data?.metrics.interview_strength)} tone="primary" />
              <MetricTile icon={HeartPulse} label="Wellness Balance" value={formatPercent(data?.metrics.wellness)} tone="emerald" />
              <MetricTile icon={Target} label="Goal Progress" value={formatPercent(data?.metrics.goal_progress)} tone="primary" />
              <MetricTile icon={Crown} label="Level" value={`${level}`} tone="amber" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Pill tone="amber"><Sparkles className="w-3 h-3 inline mr-1" /> AI Insight</Pill>
            <span className="text-sm text-white/80">{data?.insights}</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* 3) ROYAL STATS GRID */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Skills Mastery"
          icon={TrendingUp}
          primary={`${data?.skills.length ?? 0} Skills`}
          subtitle={data?.skills.length ? "Keep sharpening your power" : "Start building your power"}
          bar={(data?.skills.length ?? 0) * 10}
        />

        <StatCard
          title="Level Progress"
          icon={Crown}
          primary={`Level ${level}`}
          subtitle={`${xpToNext} XP to next`}
          bar={Math.min(100, Math.round((xp / (xp + xpToNext || 1)) * 100))}
        />

        <StatCard
          title="Experience (XP)"
          icon={Gem}
          primary={`${xp.toLocaleString()} XP`}
          subtitle="Earn by tasks & interviews"
          bar={Math.min(100, (xp % 1000) / 10)}
        />

        <StatCard
          title="Consistency Streak"
          icon={CalendarCheck}
          primary={`${data?.metrics.streak_days ?? 0} Days`}
          subtitle="Build unbreakable habits"
          bar={Math.min(100, (data?.metrics.streak_days ?? 0) * 12.5)}
        />

        <StatCard
          title="Wellness Score"
          icon={HeartPulse}
          primary={formatPercent(data?.metrics.wellness)}
          subtitle="Stress × Productivity"
          bar={data?.metrics.wellness ?? 0}
        />

        <StatCard
          title="Goal Progress"
          icon={Target}
          primary={formatPercent(data?.metrics.goal_progress)}
          subtitle={goal ? `Toward ${goal}` : "Set your goal to unlock full power"}
          bar={data?.metrics.goal_progress ?? 0}
        />
      </motion.div>

      {/* 4) QUICK ACTIONS — ROYAL ACTION PANEL */}
      <motion.div variants={item}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Royal Commands</h3>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Zap className="w-3.5 h-3.5" /> Quick actions to accelerate progress
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            <ActionLink to="/dashboard/interviews" label="Practice Interview" Icon={Mic} />
            <ActionLink to="/dashboard/roadmap" label="View AI Roadmap" Icon={Target} />
            <ActionLink to="/dashboard/study" label="Study Planner" Icon={BookOpen} />
            <ActionLink to="/dashboard/jobs" label="Browse Jobs" Icon={Briefcase} />
            <ActionLink to="/dashboard/scholarships" label="Scholarships" Icon={GraduationCap} />
            <ActionLink to="/dashboard/mentors" label="Find Mentor" Icon={HandHelping} />
            <ActionLink to="/dashboard/resume" label="Resume Analyzer" Icon={FileText} />
            <ActionLink to="/dashboard/mentor/ai" label="Ask AI Mentor" Icon={Wand2} />
          </div>
        </GlassCard>
      </motion.div>

      {/* 5) AI RECOMMENDATION PANEL */}
      <motion.div variants={item}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-display font-semibold text-lg">Your Next Best Actions</h3>
            </div>
            <button onClick={refetch} className="text-xs text-white/70 hover:text-white flex items-center gap-1">
              Refresh <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(buildRecommendations(data) ?? []).map((r) => (
              <Link
                key={r.id}
                to={mapRecommendationRoute(r.title)}
                className="group relative rounded-lg p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Pill tone={priorityTone(r.priority)}>Priority: {r.priority}</Pill>
                      <Pill tone={impactTone(r.impact)}>Impact: {r.impact}</Pill>
                      <Pill tone="slate"><Clock className="w-3 h-3 inline mr-1" /> {r.minutes}m</Pill>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Row: Roadmap + Jobs + Scholarships */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 6) ROADMAP PREVIEW */}
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-300" />
              <h3 className="font-display font-semibold text-lg">Roadmap Preview</h3>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Current step" value={data?.roadmap.current_step ?? "—"} />
              <Row label="Next step" value={data?.roadmap.next_step ?? "—"} />
              <Row label="Stage" value={`Step ${data?.roadmap.step_index ?? 0}/${data?.roadmap.total_steps ?? 0}`} />
              <div className="pt-1">
                <ProgressBar value={data?.roadmap.progress_pct ?? 0} />
                <div className="mt-1 text-xs text-white/70">{formatPercent(data?.roadmap.progress_pct)} complete</div>
              </div>
            </div>
            <Link to="/dashboard/roadmap" className="inline-flex items-center gap-1 mt-4 text-emerald-300 text-sm hover:underline">
              View Full Roadmap <ArrowUpRight className="w-3 h-3" />
            </Link>
          </GlassCard>
        </motion.div>

        {/* 7) JOBS / INTERNSHIPS */}
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-amber-300" />
              <h3 className="font-display font-semibold text-lg">Jobs & Internships</h3>
            </div>
            <div className="space-y-3">
              {(data?.jobs ?? []).map((j) => (
                <a
                  key={j.id}
                  href={j.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block group p-4 rounded-lg border border-white/10 hover:border-amber-400/40 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-white/70">{j.company}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone={j.match_score >= 75 ? "emerald" : j.match_score >= 60 ? "amber" : "slate"}>
                        Match {j.match_score}%
                      </Pill>
                      <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white" />
                    </div>
                  </div>
                </a>
              ))}
              {(!data?.jobs || data.jobs.length === 0) && <Empty text="No jobs found yet. Keep improving your score for better matches." />}
            </div>
          </GlassCard>
        </motion.div>

        {/* 8) SCHOLARSHIPS */}
        <motion.div variants={item}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-sky-300" />
              <h3 className="font-display font-semibold text-lg">Scholarships</h3>
            </div>
            <div className="space-y-3">
              {(data?.scholarships ?? []).map((s) => (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-white/70">{s.eligibility}</div>
                    </div>
                    <Pill tone="amber">Deadline {new Date(s.deadline).toLocaleDateString()}</Pill>
                  </div>
                </a>
              ))}
              {(!data?.scholarships || data.scholarships.length === 0) && <Empty text="No scholarships right now. Set your education info to unlock matches." />}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* 9) INTERVIEW PERFORMANCE TRACKER + 10) WELLNESS PANEL */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* INTERVIEW */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="w-5 h-5 text-emerald-300" />
              <h3 className="font-display font-semibold text-lg">Interview Performance</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg p-4 bg-white/5 border border-white/10">
                <div className="text-sm text-white/70">Last Score</div>
                <div className="text-2xl font-bold mt-1">{data?.interview.last_score ?? 0}</div>
                <div className="mt-3">
                  <SparkBar values={data?.interview.trend ?? [10, 20]} />
                </div>
              </div>
              <div className="rounded-lg p-4 bg-white/5 border border-white/10">
                <div className="text-sm text-white/70">Weak Areas</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(data?.interview.last_weak_areas ?? []).map((w) => <Pill key={w} tone="rose">{w}</Pill>)}
                </div>
                <Link to="/dashboard/interviews" className="inline-flex items-center gap-1 text-xs text-emerald-300 mt-3 hover:underline">
                  Practice now <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* WELLNESS */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="w-5 h-5 text-rose-300" />
              <h3 className="font-display font-semibold text-lg">Wellness</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <WellnessTile label="Stress" value={formatPercent(data?.wellness.stress_score)} />
              <WellnessTile label="Burnout Risk" value={data?.wellness.burnout_risk ?? "—"} />
              <WellnessTile label="Advice" value={data?.wellness.advice ?? "—"} long />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* 11) ACHIEVEMENTS + 12) PROOF LAYER */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ACHIEVEMENTS */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-300" />
              <h3 className="font-display font-semibold text-lg">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {(data?.achievements ?? []).map((a) => {
                const Icon = AchIcon[a.icon] ?? Star;
                return (
                  <div key={a.id} className="group relative">
                    <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                      <Icon className="w-8 h-8 text-amber-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-xs text-white/70 mt-1 text-center">{a.label}</div>
                  </div>
                );
              })}
              {(!data?.achievements || data.achievements.length === 0) && <Empty text="No badges yet. Complete tasks to unlock achievements." />}
            </div>
          </GlassCard>
        </motion.div>

        {/* PROOF LAYER */}
        <motion.div variants={item}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <h3 className="font-display font-semibold text-lg">Proof Layer</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg p-4 bg-white/5 border border-white/10">
                <div className="text-sm text-white/70 mb-2">Verified Skills</div>
                <div className="flex flex-wrap gap-2">
                  {(data?.proof.verified_skills ?? []).map((s) => <Pill key={s} tone="emerald"><CheckCircle2 className="w-3 h-3 inline mr-1" />{s}</Pill>)}
                </div>
              </div>
              <div className="rounded-lg p-4 bg-white/5 border border-white/10">
                <div className="text-sm text-white/70 mb-2">Verified Projects</div>
                <div className="flex flex-wrap gap-2">
                  {(data?.proof.verified_projects ?? []).map((p) => <Pill key={p} tone="primary"><CheckCircle2 className="w-3 h-3 inline mr-1" />{p}</Pill>)}
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Trust Score: <span className="font-semibold">{data?.proof.trust_score ?? 0}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* 13) PROFILE PREVIEW */}
      <motion.div variants={item}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white/80" />
              <h3 className="font-display font-semibold text-lg">Your Profile</h3>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard/profile/edit" className="text-sm text-amber-300 hover:underline">Edit Profile</Link>
              <Link to="/dashboard/profile" className="text-sm text-emerald-300 hover:underline">View Full Profile</Link>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-lg p-4 bg-white/5 border border-white/10">
              <Row label="Career Goal" value={goal ?? "Not set"} />
              <Row label="Experience Level" value={profile?.experience_level ?? "Beginner"} />
              <Row label="Daily Hours" value={`${profile?.daily_hours ?? 0} h`} />
            </div>
            <div className="rounded-lg p-4 bg-white/5 border border-white/10 md:col-span-2">
              <div className="text-sm text-white/70 mb-2">Skills</div>
              <div className="flex flex-wrap gap-2">
                {(data?.skills ?? []).slice(0, 12).map((s) => <Pill key={s} tone="primary">{s}</Pill>)}
                {((data?.skills ?? []).length > 12) && <span className="text-xs text-white/60">+{(data?.skills?.length ?? 0) - 12}</span>}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 14) USER HISTORY TIMELINE */}
      <motion.div variants={item}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-white/80" />
            <h3 className="font-display font-semibold text-lg">History</h3>
          </div>
          <div className="relative">
            <div className="absolute left-[10px] top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-4">
              {(data?.history ?? []).map((h) => (
                <div key={h.id} className="relative pl-8">
                  <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-amber-300" />
                  <div className="text-sm">
                    <span className="text-white/60 mr-2">{new Date(h.ts).toLocaleString()}</span>
                    <span className="font-medium">{h.label}</span>
                    {h.delta && <Pill tone="emerald" className="ml-2">{h.delta}</Pill>}
                  </div>
                </div>
              ))}
              {(!data?.history || data.history.length === 0) && <Empty text="No activity yet. Start with a quick action above." />}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Error / Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 px-3 py-2 rounded-md bg-white/10 border border-white/10 text-xs"
          >
            Loading royal command center…
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 px-3 py-2 rounded-md bg-rose-500/20 border border-rose-500/30 text-xs"
          >
            Could not sync with the kingdom servers. Showing live demo data.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* --------------------------------------------
   Tiny Components
--------------------------------------------- */
const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-white/60">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const WellnessTile: React.FC<{ label: string; value: React.ReactNode; long?: boolean }> = ({ label, value, long }) => (
  <div className={classNames("rounded-lg p-4 border border-white/10 bg-white/5", long && "sm:col-span-2")}>
    <div className="text-sm text-white/70">{label}</div>
    <div className={classNames("mt-1 font-semibold", long ? "text-sm" : "text-xl")}>{value}</div>
  </div>
);

const StatCard: React.FC<{ title: string; icon: React.ComponentType<any>; primary: string; subtitle: string; bar: number }> = ({ title, icon: Icon, primary, subtitle, bar }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-amber-300" />
      <div className="text-xs text-white/80">{title}</div>
    </div>
    <div className="font-display text-xl font-bold mt-1">{primary}</div>
    <div className="text-xs text-white/60">{subtitle}</div>
    <div className="mt-2">
      <ProgressBar value={bar} />
    </div>
  </div>
);

const MetricTile: React.FC<{ icon: React.ComponentType<any>; label: string; value: string; tone?: "primary" | "emerald" | "amber" }> = ({ icon: Icon, label, value, tone = "primary" }) => {
  const toneMap: Record<string, string> = {
    primary: "text-amber-300",
    emerald: "text-emerald-300",
    amber: "text-yellow-300"
  };
  return (
    <div className="rounded-lg p-4 border border-white/10 bg-white/5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
        <Icon className={classNames("w-5 h-5", toneMap[tone])} />
      </div>
      <div>
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

const ActionLink: React.FC<{ to: string; label: string; Icon: React.ComponentType<any> }> = ({ to, label, Icon }) => (
  <Link
    to={to}
    className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,215,0,0.15)]"
  >
    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-400/10 to-emerald-400/10 border border-white/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform" />
    </div>
    <div className="font-medium text-sm">{label}</div>
  </Link>
);

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-xs text-white/60 italic">{text}</div>
);

/* --------------------------------------------
   Notifications Button (popoverless light impl.)
--------------------------------------------- */
const NotificationsButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const notifications = [
    { id: "n1", label: "3 jobs match your skills", icon: Briefcase },
    { id: "n2", label: "Interview tip of the day is ready", icon: Mic },
    { id: "n3", label: "2 roadmap tasks due today", icon: Target }
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-white/90" />
        <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5">
          {notifications.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-2 w-64 rounded-lg border border-white/10 bg-[#0f1319]/95 backdrop-blur-md shadow-lg z-50"
          >
            <div className="p-2">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 text-sm cursor-default">
                    <Icon className="w-4 h-4 text-amber-300" />
                    <span>{n.label}</span>
                  </div>
                );
              })}
              <div className="mt-1 p-2 text-xs text-white/60">Stay consistent to unlock premium alerts.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --------------------------------------------
   Recommendation helpers
--------------------------------------------- */
function buildRecommendations(data?: DashboardPayload | null): Recommendation[] {
  if (!data) return [];
  const out: Recommendation[] = [
    { id: "r1", title: "Complete Python Basics", priority: "High", impact: "High", minutes: 40 },
    { id: "r2", title: "Practice 1 Interview Today", priority: "High", impact: "Medium", minutes: 30 },
    { id: "r3", title: "Apply to 3 Internships", priority: "Medium", impact: "High", minutes: 25 },
    { id: "r4", title: "Revise SQL Joins", priority: "Medium", impact: "Medium", minutes: 20 },
    { id: "r5", title: "Push project updates to GitHub", priority: "Low", impact: "Medium", minutes: 15 }
  ];
  // Optional: tune by current score & weak areas
  if ((data.interview.last_weak_areas ?? []).includes("SQL Joins")) {
    out[3].priority = "High";
    out[3].impact = "High";
  }
  return out.slice(0, 3); // show top-3
}

function mapRecommendationRoute(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("interview")) return "/dashboard/interviews";
  if (t.includes("internship") || t.includes("apply")) return "/dashboard/jobs";
  if (t.includes("python")) return "/dashboard/study";
  if (t.includes("sql")) return "/dashboard/study";
  if (t.includes("github")) return "/dashboard/proof";
  return "/dashboard";
}

function priorityTone(p: Recommendation["priority"]): "rose" | "amber" | "slate" {
  return p === "High" ? "rose" : p === "Medium" ? "amber" : "slate";
}
function impactTone(i: Recommendation["impact"]): "emerald" | "amber" | "slate" {
  return i === "High" ? "emerald" : i === "Medium" ? "amber" : "slate";
}
