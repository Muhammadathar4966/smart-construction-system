import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { store, useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressUpdate } from "@/lib/mockData";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900",
  "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=900",
  "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900",
];

export default function ContractorUpload() {
  const { user } = useAuth();
  const projects = useStore((d) => d.projects.filter((p) => p.contractorId === user!.id));
  const myUpdates = useStore((d) =>
    d.progress
      .filter((u) => projects.some((p) => p.id === u.projectId))
      .sort((a, b) => b.date.localeCompare(a.date))
  );
  const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(SAMPLE_IMAGES[0]);
  const [status, setStatus] = useState<ProgressUpdate["status"]>("In Progress");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    store.addProgress({ projectId, date, description, mediaUrl, mediaType: "image", status });
    toast.success("Update posted");
    setDescription("");
  };

  return (
    <div>
      <PageHeader title="Upload Daily Progress" description="Share photos and notes with your client." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form onSubmit={submit} className="glass-card p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProgressUpdate["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What was done today?" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Pick a sample photo</Label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setMediaUrl(src)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    mediaUrl === src ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Real upload disabled in demo mode.</p>
          </div>
          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-elegant">
            <Upload className="h-4 w-4 mr-1.5" /> Post update
          </Button>
        </form>

        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-3">Recent updates</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {myUpdates.length === 0 && <p className="text-sm text-muted-foreground">No updates yet.</p>}
            {myUpdates.map((u) => (
              <div key={u.id} className="rounded-xl border border-border overflow-hidden">
                <img src={u.mediaUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{projectsById[u.projectId]?.name}</p>
                    <span className="text-xs text-muted-foreground">{u.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{u.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
