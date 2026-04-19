import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, FolderKanban, Boxes, Wallet } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminDashboard() {
  const users = useStore((d) => d.users);
  const projects = useStore((d) => d.projects);
  const materials = useStore((d) => d.materials);

  const budgetTotal = projects.reduce((s, p) => s + p.budget, 0);

  const byType = ["House", "Commercial"].map((t) => ({
    name: t,
    Budget: projects.filter((p) => p.type === t).reduce((s, p) => s + p.budget, 0),
  }));

  const byRole = (["client", "contractor", "admin"] as const).map((r) => ({
    name: r,
    value: users.filter((u) => u.role === r).length,
  }));
  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--info))"];

  return (
    <div>
      <PageHeader title="Platform Overview" description="Everything happening across BuildSmart." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Users" value={users.length} icon={Users} accent="primary" />
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} accent="accent" />
        <StatCard label="Materials" value={materials.length} icon={Boxes} accent="info" />
        <StatCard label="Total Budget" value={formatPKR(budgetTotal)} icon={Wallet} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="font-display font-semibold mb-3">Budget distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatPKR(v)} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  formatter={(v: number) => formatPKR(v)}
                />
                <Bar dataKey="Budget" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-3">Users by role</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byRole} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {byRole.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {byRole.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground capitalize">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5 mt-4">
        <h3 className="font-display font-semibold mb-3">All projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2 hidden sm:table-cell">Type</th>
                <th className="text-left px-3 py-2 hidden md:table-cell">Budget</th>
                <th className="text-left px-3 py-2">Progress</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 hidden sm:table-cell">{p.type}</td>
                  <td className="px-3 py-2 hidden md:table-cell">{formatPKR(p.budget)}</td>
                  <td className="px-3 py-2">{p.progress}%</td>
                  <td className="px-3 py-2"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
