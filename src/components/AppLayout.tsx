import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationsPanel } from "./NotificationsPanel";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout() {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-3 sm:px-5">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground hidden sm:block">Welcome back</p>
              <h1 className="text-sm sm:text-base font-semibold truncate">
                {user?.name} · <span className="text-muted-foreground capitalize font-normal">{user?.role}</span>
              </h1>
            </div>
            <NotificationsPanel />
          </header>
          <main className="flex-1 p-4 sm:p-6 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
