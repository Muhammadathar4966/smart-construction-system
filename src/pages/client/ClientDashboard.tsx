import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatPKR } from "@/lib/format";
import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban, Sparkles, Wallet, Camera } from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { estimateProject } from "@/lib/ai";

export default function ClientDashboard() {
  const { user } = useAuth();
  const projects = useStore((d) => d.projects.filter((p) => p.ownerId === user!.id));
  const progress = useStore((d) => d.progress);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const active = projects.filter((p) => p.status === "In Progress").length;
  const updates = progress.filter((u) => projects.some((p) => p.id === u.projectId)).length;

  const sample = projects[0] && estimateProject(projects[0].area, projects[0].quality);
  const pieData = sample
    ? [
        { name: "Materials", value: sample.materials },
        { name: "Labor", value: sample.labor },
        { name: "Finishing", value: sample.finishing },
        { name: "Contingency", value: sample.contingency },
      ]
    : [];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--info))", "hsl(var(--muted-foreground))"];

  const barData = projects.map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
    Progress: p.progress,
  }));

  return (
    <div>
      <PageHeader
        title={`Hi, ${user?.name.split(" ")[0]} 👋`}
        description="Here's a snapshot of your projects."
        actions={
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Link to="/client/projects">New Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} accent="primary" />
        <StatCard label="Active" value={active} icon={Sparkles} accent="accent" hint="In progress" />
        <StatCard label="Total Budget" value={formatPKR(totalBudget)} icon={Wallet} accent="info" />
        <StatCard label="Updates" value={updates} icon={Camera} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Project progress</h3>
            <Link to="/client/projects" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Bar dataKey="Progress" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-3">Cost breakdown</h3>
          {sample ? (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} formatter={(v: number) => formatPKR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                {pieData.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-muted-foreground">{p.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Create a project to see estimates.</p>
          )}
        </div>
      </div>

      <div className="glass-card p-5 mt-4">
        <h3 className="font-display font-semibold mb-3">Recent projects</h3>
        <div className="space-y-3">
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{p.name}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-xs text-muted-foreground">{p.type} · {p.area} sqft · {formatPKR(p.budget)}</p>
                <Progress value={p.progress} className="mt-2 h-1.5" />
              </div>
            </div>
          ))}
          {projects.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-muted-foreground">No projects yet.</p>
      <Button asChild size="sm" className="mt-3 bg-gradient-primary text-primary-foreground">
        <Link to="/client/projects">Create your first project</Link>
      </Button>
    </div>
  );
}
