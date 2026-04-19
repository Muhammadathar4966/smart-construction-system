import { useMemo } from "react";
import { useStore } from "@/lib/store";
import type { User } from "@/lib/mockData";

export interface NotificationItem {
  id: string;
  category: "chat" | "progress" | "status";
  title: string;
  body: string;
  at: string; // ISO
  href?: string;
}

/**
 * Compute unread notifications for the current user, scoped by role.
 * - Client: chat (msgs to me), progress (updates on my projects), status (status changes on my projects)
 * - Contractor: chat (msgs to me), status (status changes on assigned projects)
 * - Admin: status changes on all projects, plus latest progress updates platform-wide
 */
export function useNotifications(user: User | null) {
  const projects = useStore((d) => d.projects);
  const chat = useStore((d) => d.chat);
  const progress = useStore((d) => d.progress);
  const statusEvents = useStore((d) => d.statusEvents);
  const lastSeen = useStore((d) => (user ? d.lastSeen[user.id] ?? {} : {}));
  const usersById = useStore((d) => Object.fromEntries(d.users.map((u) => [u.id, u])));

  return useMemo(() => {
    if (!user) return { items: [] as NotificationItem[], counts: { chat: 0, progress: 0, status: 0, total: 0 } };

    const myProjectIds = new Set(
      projects
        .filter((p) =>
          user.role === "admin"
            ? true
            : user.role === "client"
              ? p.ownerId === user.id
              : p.contractorId === user.id
        )
        .map((p) => p.id)
    );

    const seenChat = lastSeen.chat ?? "1970-01-01T00:00:00Z";
    const seenProgress = lastSeen.progress ?? "1970-01-01T00:00:00Z";
    const seenStatus = lastSeen.status ?? "1970-01-01T00:00:00Z";

    const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "Project";

    // Chat: messages addressed to me, unread
    const chatItems: NotificationItem[] =
      user.role === "admin"
        ? []
        : chat
            .filter((m) => m.toId === user.id && m.at > seenChat)
            .map((m) => ({
              id: `chat-${m.id}`,
              category: "chat",
              title: `New message from ${usersById[m.fromId]?.name ?? "Someone"}`,
              body: m.text,
              at: m.at,
              href: user.role === "client" ? "/client/chat" : "/contractor/chat",
            }));

    // Progress: new updates on relevant projects
    const progressItems: NotificationItem[] =
      user.role === "contractor"
        ? []
        : progress
            .filter((u) => myProjectIds.has(u.projectId) && new Date(u.date).toISOString() > seenProgress)
            .map((u) => ({
              id: `prog-${u.id}`,
              category: "progress",
              title: `Progress update · ${projectName(u.projectId)}`,
              body: u.description,
              at: new Date(u.date).toISOString(),
              href: user.role === "client" ? "/client/progress" : "/admin/projects",
            }));

    // Status changes
    const statusItems: NotificationItem[] = statusEvents
      .filter((e) => myProjectIds.has(e.projectId) && e.at > seenStatus)
      .map((e) => ({
        id: `stat-${e.id}`,
        category: "status",
        title: `Status: ${e.status} · ${projectName(e.projectId)}`,
        body: `Project moved to ${e.status}.`,
        at: e.at,
        href:
          user.role === "client"
            ? "/client/projects"
            : user.role === "contractor"
              ? "/contractor/projects"
              : "/admin/projects",
      }));

    const items = [...chatItems, ...progressItems, ...statusItems].sort((a, b) =>
      b.at.localeCompare(a.at)
    );

    return {
      items,
      counts: {
        chat: chatItems.length,
        progress: progressItems.length,
        status: statusItems.length,
        total: items.length,
      },
    };
  }, [user, projects, chat, progress, statusEvents, lastSeen, usersById]);
}
