import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FolderKanban, Camera, CheckCircle2, Clock, Upload } from "lucide-react";
import { formatPKR } from "@/lib/format";

export default function ContractorDashboard() {
  const { user } = useAuth();
  const projects = useStore((d) => d.projects.filter((p) => p.contractorId === user!.id));
  const updates = useStore((d) => d.progress.filter((u) => projects.some((p) => p.id === u.projectId)));
  const usersById = useStore((d) => Object.fromEntries(d.users.map((u) => [u.id, u])));

  const active = projects.filter((p) => p.status === "In Progress").length;
  const done = projects.filter((p) => p.status === "Completed").length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name.split(" ")[0]}`}
        description="Your assigned projects at a glance."
        actions={
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Link to="/contractor/upload"><Upload className="h-4 w-4 mr-1.5" /> Upload update</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Assigned" value={projects.length} icon={FolderKanban} accent="primary" />
        <StatCard label="Active" value={active} icon={Clock} accent="warning" />
        <StatCard label="Completed" value={done} icon={CheckCircle2} accent="info" />
        <StatCard label="Updates" value={updates.length} icon={Camera} accent="accent" />
      </div>

      <div className="glass-card p-5 mt-4">
        <h3 className="font-display font-semibold mb-3">Assigned projects</h3>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Client: {usersById[p.ownerId]?.name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Area</p><p className="font-medium">{p.area} sqft</p></div>
                  <div><p className="text-xs text-muted-foreground">Budget</p><p className="font-medium">{formatPKR(p.budget)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Quality</p><p className="font-medium">{p.quality}</p></div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span><span>{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
