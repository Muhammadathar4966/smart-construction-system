import {
  LayoutDashboard, FolderKanban, Sparkles, MessageSquare, Camera,
  Users, Boxes, BarChart3, Settings, LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const linksByRole = {
  client: [
    { to: "/client", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/client/projects", label: "My Projects", icon: FolderKanban },
    { to: "/client/recommend", label: "AI Recommender", icon: Sparkles },
    { to: "/client/progress", label: "Progress", icon: Camera },
    { to: "/client/chat", label: "Chat", icon: MessageSquare },
  ],
  contractor: [
    { to: "/contractor", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/contractor/projects", label: "Assigned", icon: FolderKanban },
    { to: "/contractor/upload", label: "Upload Update", icon: Camera },
    { to: "/contractor/chat", label: "Chat", icon: MessageSquare },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/materials", label: "Materials", icon: Boxes },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
} as const;

export function AppSidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const links = linksByRole[user.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4 border-b border-sidebar-border">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="capitalize">{user.role} workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((l) => (
                <SidebarMenuItem key={l.to}>
                  <SidebarMenuButton asChild tooltip={l.label}>
                    <NavLink
                      to={l.to}
                      end={"end" in l ? l.end : false}
                      className="hover:bg-sidebar-accent/60 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <l.icon className="h-4 w-4" />
                      <span>{l.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-1 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
