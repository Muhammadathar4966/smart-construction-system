import { useState } from "react";
import { store, useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Material } from "@/lib/mockData";
import { Plus, Trash2, Pencil } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { toast } from "sonner";

const TYPES: Material["type"][] = ["Cement", "Bricks", "Tiles", "Steel"];
const QUALITIES: Material["quality"][] = ["Low", "Medium", "High"];

export default function AdminMaterials() {
  const materials = useStore((d) => d.materials);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [form, setForm] = useState<Omit<Material, "id">>({
    name: "", type: "Cement", pricePerUnit: 1000, unit: "bag", quality: "Medium", brand: "",
  });

  const startNew = () => {
    setEditing(null);
    setForm({ name: "", type: "Cement", pricePerUnit: 1000, unit: "bag", quality: "Medium", brand: "" });
    setOpen(true);
  };
  const startEdit = (m: Material) => {
    setEditing(m);
    setForm(m);
    setOpen(true);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { store.updateMaterial(editing.id, form); toast.success("Material updated"); }
    else { store.addMaterial(form); toast.success("Material added"); }
    setOpen(false);
  };
  const remove = (id: string) => { store.removeMaterial(id); toast.success("Removed"); };

  return (
    <div>
      <PageHeader
        title="Materials Catalog"
        description="Add and manage construction materials available to AI."
        actions={
          <Button onClick={startNew} className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Plus className="h-4 w-4 mr-1.5" /> Add material
          </Button>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Brand</th>
                <th className="text-left px-4 py-3">Quality</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3">{m.type}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{m.brand}</td>
                  <td className="px-4 py-3">{m.quality}</td>
                  <td className="px-4 py-3">{formatPKR(m.pricePerUnit)}/{m.unit}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(m)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(m.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit material" : "Add material"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Material["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quality</Label>
                <Select value={form.quality} onValueChange={(v) => setForm({ ...form, quality: v as Material["quality"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QUALITIES.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Brand</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Price per unit (PKR)</Label>
                <Input type="number" value={form.pricePerUnit} onChange={(e) => setForm({ ...form, pricePerUnit: Number(e.target.value) })} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">
              {editing ? "Save changes" : "Add material"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
