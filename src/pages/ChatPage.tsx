import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { store, useStore } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { role: "client" | "contractor" }

export default function ChatPage({ role }: Props) {
  const { user } = useAuth();
  const projects = useStore((d) =>
    role === "client" ? d.projects.filter((p) => p.ownerId === user!.id) : d.projects.filter((p) => p.contractorId === user!.id)
  );
  const usersById = useStore((d) => Object.fromEntries(d.users.map((u) => [u.id, u])));
  const messages = useStore((d) => d.chat);

  const [activeId, setActiveId] = useState<string | null>(projects[0]?.id ?? null);
  useEffect(() => { if (!activeId && projects[0]) setActiveId(projects[0].id); }, [projects, activeId]);
  // Mark chat notifications as seen whenever this page is open or new messages arrive
  useEffect(() => { if (user) store.markSeen(user.id, "chat"); }, [user, messages.length]);

  const active = projects.find((p) => p.id === activeId);
  const peer = active && (role === "client" ? usersById[active.contractorId ?? ""] : usersById[active.ownerId]);

  const thread = useMemo(
    () => messages.filter((m) => m.projectId === activeId).sort((a, b) => a.at.localeCompare(b.at)),
    [messages, activeId]
  );

  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim() || !active || !peer) return;
    store.sendMessage({ projectId: active.id, fromId: user!.id, toId: peer.id, text: text.trim() });
    setText("");
  };

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread.length]);

  return (
    <div>
      <PageHeader title="Chat" description={role === "client" ? "Talk to your contractor." : "Talk to your client."} />

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[480px]">
        <div className="glass-card p-2 overflow-y-auto">
          {projects.length === 0 && <p className="p-3 text-sm text-muted-foreground">No projects yet.</p>}
          {projects.map((p) => {
            const peerU = role === "client" ? usersById[p.contractorId ?? ""] : usersById[p.ownerId];
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors",
                  activeId === p.id ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                    {peerU?.name.split(" ").map((s) => s[0]).slice(0, 2).join("") ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{peerU?.name ?? "Unassigned"}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.name}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="glass-card flex flex-col overflow-hidden">
          {active && peer ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                    {peer.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{peer.name}</p>
                  <p className="text-xs text-muted-foreground">{active.name}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {thread.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">Say hi 👋</p>
                )}
                {thread.map((m) => {
                  const mine = m.fromId === user!.id;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                        mine ? "bg-gradient-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-secondary-foreground rounded-bl-sm"
                      )}>
                        {m.text}
                        <div className={cn("text-[10px] mt-0.5 opacity-70", mine ? "text-primary-foreground" : "text-muted-foreground")}>
                          {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="border-t border-border p-3 flex gap-2"
              >
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" />
                <Button type="submit" className="bg-gradient-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-sm text-muted-foreground">
              Select a project to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
