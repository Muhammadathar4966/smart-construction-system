import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from "recharts";
import { formatPKR } from "@/lib/format";

export default function AdminAnalytics() {
  const materials = useStore((d) => d.materials);
  const projects = useStore((d) => d.projects);

  const matByType = ["Cement", "Bricks", "Tiles", "Steel"].map((t) => {
    const list = materials.filter((m) => m.type === t);
    return {
      name: t,
      Avg: Math.round(list.reduce((s, m) => s + m.pricePerUnit, 0) / Math.max(1, list.length)),
    };
  });

  const projData = projects.map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
    Budget: p.budget,
    Progress: p.progress * (p.budget / 100),
  }));

  return (
    <div>
      <PageHeader title="Analytics" description="Insights across materials, projects and budgets." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-3">Average price by material type</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={matByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  formatter={(v: number) => formatPKR(v)}
                />
                <Bar dataKey="Avg" fill="hsl(var(--accent))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-3">Project budgets vs spend</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={projData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => formatPKR(v)} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  formatter={(v: number) => formatPKR(v)}
                />
                <Legend />
                <Line dataKey="Budget" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line dataKey="Progress" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
