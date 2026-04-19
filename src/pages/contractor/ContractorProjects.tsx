import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/format";
import { Link } from "react-router-dom";

export default function ContractorProjects() {
  const { user } = useAuth();
  const projects = useStore((d) => d.projects.filter((p) => p.contractorId === user!.id));
  const usersById = useStore((d) => Object.fromEntries(d.users.map((u) => [u.id, u])));

  return (
    <div>
      <PageHeader title="Assigned Projects" description="All projects you are responsible for." />
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Budget</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 w-40">Progress</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{usersById[p.ownerId]?.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{p.type}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{formatPKR(p.budget)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3"><Progress value={p.progress} className="h-1.5" /></td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="outline" size="sm"><Link to="/contractor/upload">Update</Link></Button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No assigned projects.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
