import {
  BarChart3, Brain, Briefcase, GraduationCap, Heart,
  Home, Map, Mic, Gamepad2, Shield, Users, BookOpen,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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

function NavGroup({ label, items }: { label: string; items: typeof mainItems }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end={item.url === "/dashboard"} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
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
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavGroup label="Main" items={mainItems} />
        <NavGroup label="More" items={moreItems} />
      </SidebarContent>
    </Sidebar>
  );
}
