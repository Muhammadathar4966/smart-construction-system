import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { store, useStore } from "@/lib/store";
import { Project } from "@/lib/mockData";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPKR } from "@/lib/format";
import { estimateProject } from "@/lib/ai";
import { Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ClientProjects() {
  const { user } = useAuth();
  const projects = useStore((d) => d.projects.filter((p) => p.ownerId === user!.id));

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<Project["type"]>("House");
  const [area, setArea] = useState(1500);
  const [budget, setBudget] = useState(8_000_000);
  const [quality, setQuality] = useState<Project["quality"]>("Medium");

  const liveEstimate = estimateProject(area, quality);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addProject({ name, type, area, budget, quality, ownerId: user!.id });
    toast.success("Project created");
    setOpen(false);
    setName(""); setArea(1500); setBudget(8_000_000); setQuality("Medium"); setType("House");
  };

  return (
    <div>
      <PageHeader
        title="My Projects"
        description="Create and manage your construction projects."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
                <Plus className="h-4 w-4 mr-1.5" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create new project</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label>Project name</Label>
                  <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="DHA Phase 6 Villa" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as Project["type"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Quality</Label>
                    <Select value={quality} onValueChange={(v) => setQuality(v as Project["quality"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Area (sq ft)</Label>
                    <Input type="number" min={200} value={area} onChange={(e) => setArea(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Budget (PKR)</Label>
                    <Input type="number" min={100000} step={50000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                  </div>
                </div>

                <div className="rounded-xl bg-secondary/60 border border-border p-3">
                  <p className="text-xs text-muted-foreground">Estimated total</p>
                  <p className="font-display text-xl font-bold gradient-text">{formatPKR(liveEstimate.total)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Materials {formatPKR(liveEstimate.materials)} · Labor {formatPKR(liveEstimate.labor)} · Finishing {formatPKR(liveEstimate.finishing)}
                  </p>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">Create project</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {projects.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-muted-foreground">No projects yet.</p>
          <Button onClick={() => setOpen(true)} className="mt-3 bg-gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-1.5" /> Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const est = estimateProject(p.area, p.quality);
            return (
              <div key={p.id} className="glass-card p-5 hover:shadow-elegant transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold truncate">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.type} · {p.area} sqft · {p.quality}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold">{formatPKR(p.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated</p>
                    <p className="font-semibold gradient-text">{formatPKR(est.total)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span><span>{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-2" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/client/recommend?projectId=${p.id}`}>
                      <Sparkles className="h-4 w-4 mr-1.5" /> AI Picks
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Link to="/client/progress">View progress</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
