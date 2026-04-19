import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { formatPKR } from "@/lib/format";

export default function AdminProjects() {
  const projects = useStore((d) => d.projects);
  const usersById = useStore((d) => Object.fromEntries(d.users.map((u) => [u.id, u])));

  return (
    <div>
      <PageHeader title="All Projects" description="Monitor every project across the platform." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-semibold">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.type} · {p.area} sqft</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="font-medium truncate">{usersById[p.ownerId]?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contractor</p>
                <p className="font-medium truncate">{usersById[p.contractorId ?? ""]?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-semibold">{formatPKR(p.budget)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quality</p>
                <p className="font-medium">{p.quality}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress</span><span>{p.progress}%</span>
              </div>
              <Progress value={p.progress} className="h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
