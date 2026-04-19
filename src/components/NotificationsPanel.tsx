import { Bell, MessageSquare, Camera, Activity, CheckCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useNotifications, type NotificationItem } from "@/hooks/useNotifications";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

const iconFor = (cat: NotificationItem["category"]) =>
  cat === "chat" ? MessageSquare : cat === "progress" ? Camera : Activity;

const accentFor = (cat: NotificationItem["category"]) =>
  cat === "chat"
    ? "bg-primary/15 text-primary"
    : cat === "progress"
      ? "bg-accent/15 text-accent"
      : "bg-info/15 text-info";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function NotificationsPanel() {
  const { user } = useAuth();
  const { items, counts } = useNotifications(user);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (n: NotificationItem) => {
    if (user) store.markSeen(user.id, n.category);
    setOpen(false);
    if (n.href) navigate(n.href);
  };

  const markAll = () => {
    if (user) store.markAllSeen(user.id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Notifications (${counts.total} unread)`}
          className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary transition-colors"
        >
          <Bell className="h-4 w-4" />
          {counts.total > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-accent text-accent-foreground">
              {counts.total > 9 ? "9+" : counts.total}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(360px,calc(100vw-1.5rem))] p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-[11px] text-muted-foreground">
              {counts.total > 0 ? `${counts.total} unread` : "You're all caught up"}
            </p>
          </div>
          {counts.total > 0 && (
            <Button variant="ghost" size="sm" onClick={markAll} className="h-7 px-2 text-xs">
              <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all
            </Button>
          )}
        </div>

        {counts.total > 0 && (
          <div className="flex gap-1.5 px-3 py-2 border-b border-border bg-secondary/30">
            <CategoryChip label="Chat" count={counts.chat} />
            <CategoryChip label="Progress" count={counts.progress} />
            <CategoryChip label="Status" count={counts.status} />
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-secondary mb-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.slice(0, 30).map((n) => {
                const Icon = iconFor(n.category);
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className="w-full text-left px-4 py-3 flex gap-3 hover:bg-secondary/50 transition-colors"
                    >
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                          accentFor(n.category)
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.at)}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CategoryChip({ label, count }: { label: string; count: number }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px]",
        count > 0
          ? "bg-background border border-border text-foreground"
          : "bg-transparent text-muted-foreground"
      )}
    >
      <span>{label}</span>
      <span className={cn("font-semibold", count === 0 && "opacity-50")}>{count}</span>
    </div>
  );
}
