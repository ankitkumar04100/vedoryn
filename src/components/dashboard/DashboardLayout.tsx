import { Outlet, useNavigate, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIMentor } from "@/components/AIMentor";
import { useAuth } from "@/hooks/useAuth";
import { Brain, LogOut, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { user, profile, loading, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  // Redirect to onboarding if not complete and not guest
  useEffect(() => {
    if (!loading && user && profile && !profile.onboarding_complete && !isGuest) {
      navigate("/onboarding");
    }
  }, [loading, user, profile, isGuest, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-royal flex items-center justify-center animate-pulse-glow">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground font-display">Loading your royal dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border px-4 glass">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="mr-2" />
              <div className="w-8 h-8 rounded-lg bg-gradient-royal flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">Vedoryn</span>
            </div>
            <div className="flex items-center gap-3">
              {isGuest && (
                <Link to="/auth" className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                  Sign Up to Save
                </Link>
              )}
              {profile?.display_name && (
                <Link to="/dashboard/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-royal flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{profile.display_name}</span>
                </Link>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={async () => { await signOut(); navigate("/"); }} title="Sign Out">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <AIMentor />
      </div>
    </SidebarProvider>
  );
}
