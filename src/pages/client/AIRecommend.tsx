import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/lib/mockData";
import { estimateProject, recommendMaterials } from "@/lib/ai";
import { formatNum, formatPKR } from "@/lib/format";
import { Sparkles, Trophy, Download } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AIRecommend() {
  const { user } = useAuth();
  const myProjects = useStore((d) => d.projects.filter((p) => p.ownerId === user!.id));
  const materials = useStore((d) => d.materials);

  const [params] = useSearchParams();
  const initial = myProjects.find((p) => p.id === params.get("projectId")) ?? myProjects[0];

  const [budget, setBudget] = useState(initial?.budget ?? 8_000_000);
  const [area, setArea] = useState(initial?.area ?? 1800);
  const [type, setType] = useState<Project["type"]>(initial?.type ?? "House");
  const [quality, setQuality] = useState<Project["quality"]>(initial?.quality ?? "Medium");
  const [computed, setComputed] = useState<ReturnType<typeof recommendMaterials> | null>(
    initial ? recommendMaterials(materials, { budget: initial.budget, area: initial.area, quality: initial.quality }) : null
  );

  const estimate = useMemo(() => estimateProject(area, quality), [area, quality]);

  const run = () => {
    setComputed(recommendMaterials(materials, { budget, area, quality }));
    toast.success("AI recommendations updated");
  };

  return (
    <div>
      <PageHeader
        title="AI Material Recommender"
        description="Smart picks based on your budget, area and quality preference."
        actions={
          <Button variant="outline" onClick={() => toast.success("Report exported (mock)")}>
            <Download className="h-4 w-4 mr-1.5" /> Export report
          </Button>
        }
      />

      {/* Inputs */}
      <div className="glass-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label>Project type</Label>
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
                <SelectItem value="Low">Low (Economy)</SelectItem>
                <SelectItem value="Medium">Medium (Balanced)</SelectItem>
                <SelectItem value="High">High (Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Area (sq ft)</Label>
            <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Budget (PKR)</Label>
            <Input type="number" step={50000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="text-muted-foreground">Estimated cost:</span>
            <span className="font-semibold gradient-text">{formatPKR(estimate.total)}</span>
            <span className="text-muted-foreground">· Materials {formatPKR(estimate.materials)}</span>
            <span className="text-muted-foreground">· Labor {formatPKR(estimate.labor)}</span>
          </div>
          <Button onClick={run} className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Sparkles className="h-4 w-4 mr-1.5" /> Run recommendation
          </Button>
        </div>
      </div>

      {computed && (
        <>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI picked materials for a <span className="font-semibold text-foreground">{computed.tier}</span> tier build.
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {computed.results.map((r, i) => (
              <motion.div
                key={r.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5 relative overflow-hidden"
              >
                {r.bestValue && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 text-[10px] font-semibold">
                    <Trophy className="h-3 w-3" /> BEST VALUE
                  </span>
                )}
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{r.type}</p>
                <h3 className="font-display text-xl font-bold mt-1">{r.recommended.name}</h3>
                <p className="text-xs text-muted-foreground">{r.recommended.brand} · {r.recommended.quality} quality</p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Unit price</p>
                    <p className="font-semibold">{formatPKR(r.recommended.pricePerUnit)}/{r.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Qty</p>
                    <p className="font-semibold">{formatNum(r.estimatedQty)} {r.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <p className="font-semibold gradient-text">{formatPKR(r.estimatedCost)}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-primary/5 border border-primary/15 p-2.5 text-xs text-muted-foreground">
                  <span className="text-primary font-medium">Why: </span>{r.reason}
                </div>

                {r.alternatives.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Alternatives</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="text-muted-foreground">
                          <tr>
                            <th className="text-left font-normal py-1.5">Material</th>
                            <th className="text-left font-normal">Quality</th>
                            <th className="text-right font-normal">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.alternatives.map((a) => (
                            <tr key={a.id} className="border-t border-border">
                              <td className="py-1.5">{a.name}</td>
                              <td>{a.quality}</td>
                              <td className="text-right">{formatPKR(a.pricePerUnit)}/{a.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-5 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Total recommended materials cost</p>
              <p className="font-display text-3xl font-bold gradient-text">
                {formatPKR(computed.results.reduce((s, r) => s + r.estimatedCost, 0))}
              </p>
            </div>
            <Button variant="outline" onClick={() => toast.success("Saved to project (mock)")}>
              Save selection
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
