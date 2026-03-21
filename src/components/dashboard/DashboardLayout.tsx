import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIMentor } from "@/components/AIMentor";
import { useAuth } from "@/hooks/useAuth";
import { Brain, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { user, profile, loading, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-sm">Vedoryn</span>
            </div>
            <div className="flex items-center gap-3">
              {isGuest && (
                <span className="text-xs px-2 py-1 rounded-full bg-vedoryn-orange/10 text-vedoryn-orange font-medium">Guest Mode</span>
              )}
              {profile?.display_name && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {profile.display_name}
                </span>
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
