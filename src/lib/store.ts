// Lightweight in-memory store with localStorage persistence + pub/sub.
import { useEffect, useState } from "react";
import {
  ChatMessage, Material, ProgressUpdate, Project, User,
  seedChat, seedMaterials, seedProgress, seedProjects, seedUsers,
} from "./mockData";

export type SeenMap = {
  chat?: string;     // ISO timestamp
  progress?: string; // ISO timestamp
  status?: string;   // ISO timestamp
};

type DB = {
  users: User[];
  projects: Project[];
  materials: Material[];
  progress: ProgressUpdate[];
  chat: ChatMessage[];
  passwords: Record<string, string>; // email -> password (mock only)
  currentUserId: string | null;
  // Track project status change events as ISO timestamps per project
  statusEvents: { id: string; projectId: string; status: Project["status"]; at: string }[];
  // Per-user "last seen" timestamps for each notification category
  lastSeen: Record<string, SeenMap>;
};

const KEY = "buildsmart_db_v1";

const defaultDB: DB = {
  users: seedUsers,
  projects: seedProjects,
  materials: seedMaterials,
  progress: seedProgress,
  chat: seedChat,
  passwords: {
    "client@demo.com": "demo1234",
    "contractor@demo.com": "demo1234",
    "admin@demo.com": "demo1234",
    "sara@demo.com": "demo1234",
    "omar@demo.com": "demo1234",
  },
  currentUserId: null,
  statusEvents: [],
  lastSeen: {},
};

function load(): DB {
  if (typeof window === "undefined") return defaultDB;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultDB);
    return { ...structuredClone(defaultDB), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultDB);
  }
}

let db: DB = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  listeners.forEach((l) => l());
}

export const store = {
  get: () => db,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  reset() {
    db = structuredClone(defaultDB);
    persist();
  },
  // Auth
  login(email: string, password: string): User | null {
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (db.passwords[user.email] !== password) return null;
    db.currentUserId = user.id;
    persist();
    return user;
  },
  signup(name: string, email: string, password: string, role: User["role"]): User | null {
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return null;
    const user: User = { id: `u${Date.now()}`, name, email, role };
    db.users.push(user);
    db.passwords[email] = password;
    db.currentUserId = user.id;
    persist();
    return user;
  },
  logout() {
    db.currentUserId = null;
    persist();
  },
  currentUser(): User | null {
    return db.users.find((u) => u.id === db.currentUserId) ?? null;
  },
  // Projects
  addProject(p: Omit<Project, "id" | "createdAt" | "status" | "progress">): Project {
    const proj: Project = {
      ...p,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: "Planning",
      progress: 0,
    };
    db.projects.push(proj);
    persist();
    return proj;
  },
  updateProject(id: string, patch: Partial<Project>) {
    const prev = db.projects.find((p) => p.id === id);
    db.projects = db.projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
    if (prev && patch.status && patch.status !== prev.status) {
      db.statusEvents.push({
        id: `se${Date.now()}`,
        projectId: id,
        status: patch.status,
        at: new Date().toISOString(),
      });
    }
    persist();
  },
  // Materials
  addMaterial(m: Omit<Material, "id">): Material {
    const mat = { ...m, id: `m${Date.now()}` };
    db.materials.push(mat);
    persist();
    return mat;
  },
  updateMaterial(id: string, patch: Partial<Material>) {
    db.materials = db.materials.map((m) => (m.id === id ? { ...m, ...patch } : m));
    persist();
  },
  removeMaterial(id: string) {
    db.materials = db.materials.filter((m) => m.id !== id);
    persist();
  },
  // Progress
  addProgress(u: Omit<ProgressUpdate, "id">) {
    const up = { ...u, id: `pr${Date.now()}` };
    db.progress.push(up);
    // Bump project progress
    const proj = db.projects.find((p) => p.id === u.projectId);
    if (proj) {
      const prevStatus = proj.status;
      proj.progress = Math.min(100, proj.progress + 6);
      proj.status = proj.progress >= 100 ? "Completed" : "In Progress";
      if (proj.status !== prevStatus) {
        db.statusEvents.push({
          id: `se${Date.now()}`,
          projectId: proj.id,
          status: proj.status,
          at: new Date().toISOString(),
        });
      }
    }
    persist();
    return up;
  },
  // Chat
  sendMessage(m: Omit<ChatMessage, "id" | "at">) {
    const msg: ChatMessage = { ...m, id: `c${Date.now()}`, at: new Date().toISOString() };
    db.chat.push(msg);
    persist();
    return msg;
  },
  // Admin
  setUserRole(id: string, role: User["role"]) {
    db.users = db.users.map((u) => (u.id === id ? { ...u, role } : u));
    persist();
  },
  // Notifications: mark a category seen for a given user
  markSeen(userId: string, category: keyof SeenMap) {
    const prev = db.lastSeen[userId] ?? {};
    db.lastSeen[userId] = { ...prev, [category]: new Date().toISOString() };
    persist();
  },
  markAllSeen(userId: string) {
    const now = new Date().toISOString();
    db.lastSeen[userId] = { chat: now, progress: now, status: now };
    persist();
  },
};

export function useStore<T>(selector: (db: DB) => T): T {
  const [val, setVal] = useState(() => selector(store.get()));
  useEffect(() => {
    const unsub = store.subscribe(() => setVal(selector(store.get())));
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return val;
}
