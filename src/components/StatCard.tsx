import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "primary" | "accent" | "info" | "warning";
}

const accents: Record<NonNullable<Props["accent"]>, string> = {
  primary: "from-primary/20 to-primary/5 text-primary",
  accent: "from-accent/20 to-accent/5 text-accent",
  info: "from-info/20 to-info/5 text-info",
  warning: "from-warning/20 to-warning/5 text-warning",
};

export function StatCard({ label, value, icon: Icon, hint, accent = "primary" }: Props) {
  return (
    <div className="stat-card relative overflow-hidden">
      <div className={cn("absolute -top-8 -right-8 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl opacity-60", accents[accent])} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold mt-1.5">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl border border-border", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
