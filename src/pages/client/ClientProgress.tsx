import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { store, useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";

export default function ClientProgress() {
  const { user } = useAuth();
  const myProjectIds = useStore((d) => d.projects.filter((p) => p.ownerId === user!.id).map((p) => p.id));
  const projectsById = useStore((d) => Object.fromEntries(d.projects.map((p) => [p.id, p])));
  const updates = useStore((d) =>
    d.progress
      .filter((u) => myProjectIds.includes(u.projectId))
      .sort((a, b) => b.date.localeCompare(a.date))
  );
  useEffect(() => { if (user) store.markSeen(user.id, "progress"); }, [user, updates.length]);

  return (
    <div>
      <PageHeader title="Progress Updates" description="Daily updates from your contractor." />

      {updates.length === 0 ? (
        <div className="glass-card p-10 text-center text-muted-foreground">No updates yet.</div>
      ) : (
        <div className="relative pl-6 sm:pl-8">
          <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {updates.map((u) => {
              const p = projectsById[u.projectId];
              return (
                <div key={u.id} className="relative">
                  <span className="absolute -left-[18px] sm:-left-[22px] top-4 grid h-3 w-3 place-items-center rounded-full bg-gradient-primary shadow-glow ring-4 ring-background" />
                  <div className="glass-card overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                      <div className="aspect-video sm:aspect-auto sm:h-full bg-muted">
                        <img src={u.mediaUrl} alt={u.description} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-4 sm:p-5 sm:col-span-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-xs text-muted-foreground">{new Date(u.date).toDateString()}</p>
                          <StatusBadge status={u.status as any} />
                        </div>
                        <h3 className="font-display font-semibold mt-1">{p?.name}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{u.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
