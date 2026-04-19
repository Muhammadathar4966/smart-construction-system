import { cn } from "@/lib/utils";
import { Project } from "@/lib/mockData";

const map: Record<Project["status"], string> = {
  Planning: "bg-info/15 text-info border-info/30",
  "In Progress": "bg-warning/15 text-warning border-warning/30",
  Completed: "bg-primary/15 text-primary border-primary/30",
};

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
