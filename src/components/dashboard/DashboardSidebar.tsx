import {
  BarChart3, Brain, Briefcase, GraduationCap, Heart,
  Home, Map, Mic, Gamepad2, Shield, Users, BookOpen, User, Crown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "Career Score", url: "/dashboard/career-score", icon: Brain },
  { title: "Roadmap", url: "/dashboard/roadmap", icon: Map },
  { title: "Interviews", url: "/dashboard/interviews", icon: Mic },
  { title: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
  { title: "Study Planner", url: "/dashboard/study", icon: BookOpen },
];

const moreItems = [
  { title: "Scholarships", url: "/dashboard/scholarships", icon: GraduationCap },
  { title: "Mentors", url: "/dashboard/mentors", icon: Users },
  { title: "Proof Layer", url: "/dashboard/proof", icon: Shield },
  { title: "Wellness", url: "/dashboard/wellness", icon: Heart },
  { title: "Gamification", url: "/dashboard/gamification", icon: Gamepad2 },
  { title: "Recruiter", url: "/dashboard/recruiter", icon: BarChart3 },
];

const profileItems = [
  { title: "My Profile", url: "/dashboard/profile", icon: User },
];

function NavGroup({ label, items }: { label: string; items: typeof mainItems }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end={item.url === "/dashboard"} className="hover:bg-primary/5 transition-colors" activeClassName="bg-primary/10 text-primary font-medium royal-border">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`px-4 py-4 flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-royal flex items-center justify-center">
            <Crown className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-display font-bold text-lg">Vedoryn</span>}
        </div>
        <NavGroup label="Main" items={mainItems} />
        <NavGroup label="More" items={moreItems} />
        <NavGroup label="Account" items={profileItems} />
      </SidebarContent>
    </Sidebar>
  );
}
