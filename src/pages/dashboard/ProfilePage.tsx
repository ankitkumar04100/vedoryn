import { useState } from "react";
import { motion } from "framer-motion";
import { User, Brain, Target, BookOpen, Heart, Edit3, Save, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [careerGoal, setCareerGoal] = useState(profile?.career_goal || "");
  const [dailyHours, setDailyHours] = useState(profile?.daily_hours ?? 2);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        display_name: displayName,
        career_goal: careerGoal,
        daily_hours: dailyHours,
      }).eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: "Career Score", value: profile?.career_score ?? 0, icon: Brain, color: "text-primary bg-primary/10" },
    { label: "Level", value: profile?.level ?? 1, icon: Target, color: "text-vedoryn-gold bg-vedoryn-gold/10" },
    { label: "XP", value: profile?.xp ?? 0, icon: BookOpen, color: "text-vedoryn-emerald bg-vedoryn-emerald/10" },
    { label: "Daily Hours", value: `${profile?.daily_hours ?? 0}h`, icon: Heart, color: "text-accent bg-accent/10" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-primary" /> Your Profile
          </h1>
          <p className="text-muted-foreground mt-1">Your personalized career identity.</p>
        </div>
      </div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-card border border-border shadow-card royal-border royal-glow">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-royal flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {(profile?.display_name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              {editing ? (
                <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="font-semibold text-lg mb-1" />
              ) : (
                <h2 className="font-display text-2xl font-bold">{profile?.display_name || "User"}</h2>
              )}
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}>
            {editing ? <><Save className="w-4 h-4 mr-1" />{saving ? "Saving..." : "Save"}</> : <><Edit3 className="w-4 h-4 mr-1" />Edit</>}
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="p-4 rounded-xl bg-secondary/50">
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}><s.icon className="w-4 h-4" /></div>
              <div className="font-display text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-lg">Career Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Career Goal</span>
                {editing ? <Input value={careerGoal} onChange={e => setCareerGoal(e.target.value)} className="w-40 h-7 text-sm" /> : <span className="font-medium">{profile?.career_goal || "Not set"}</span>}
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Education</span><span className="font-medium capitalize">{profile?.education_level?.replace("_", " ") || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stream</span><span className="font-medium">{profile?.academic_stream || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Experience</span><span className="font-medium capitalize">{profile?.experience_level || "Beginner"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Learning Style</span><span className="font-medium capitalize">{profile?.learning_style || "Visual"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Daily Hours</span>
                {editing ? <input type="number" value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))} className="w-16 h-7 rounded border border-border bg-card px-2 text-sm" min={1} max={12} /> : <span className="font-medium">{profile?.daily_hours ?? 0}h</span>}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-semibold text-lg">Wellness</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Stress Level</span><span className="font-medium">{profile?.stress_level ?? 5}/10</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Motivation</span><span className="font-medium">{profile?.motivation_level ?? 7}/10</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Productivity</span><span className="font-medium capitalize">{profile?.productivity_level || "Moderate"}</span></div>
            </div>

            <h3 className="font-display font-semibold text-lg pt-2">Skills</h3>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map(s => (
                  <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}

            {profile?.interests && profile.interests.length > 0 && (
              <>
                <h3 className="font-display font-semibold text-lg pt-2">Interests</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map(i => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium">{i}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
