export type Role = "client" | "contractor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  contractorId?: string;
  type: "House" | "Commercial";
  area: number; // sq ft
  budget: number; // PKR
  quality: "Low" | "Medium" | "High";
  status: "Planning" | "In Progress" | "Completed";
  progress: number; // 0-100
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  type: "Cement" | "Bricks" | "Tiles" | "Steel";
  pricePerUnit: number;
  unit: string;
  quality: "Low" | "Medium" | "High";
  brand: string;
}

export interface ProgressUpdate {
  id: string;
  projectId: string;
  date: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  status: "In Progress" | "Completed";
}

export interface ChatMessage {
  id: string;
  projectId: string;
  fromId: string;
  toId: string;
  text: string;
  at: string;
}

// ---------- Seed users ----------
export const seedUsers: User[] = [
  { id: "u1", name: "Ayesha Khan", email: "client@demo.com", role: "client" },
  { id: "u2", name: "Bilal Ahmed", email: "contractor@demo.com", role: "contractor" },
  { id: "u3", name: "Admin Root", email: "admin@demo.com", role: "admin" },
  { id: "u4", name: "Sara Malik", email: "sara@demo.com", role: "client" },
  { id: "u5", name: "Omar Sheikh", email: "omar@demo.com", role: "contractor" },
];

// ---------- Seed materials ----------
export const seedMaterials: Material[] = [
  // Cement
  { id: "m1", name: "DG Cement", type: "Cement", pricePerUnit: 1250, unit: "bag", quality: "Low", brand: "DG" },
  { id: "m2", name: "Maple Leaf OPC", type: "Cement", pricePerUnit: 1380, unit: "bag", quality: "Medium", brand: "Maple Leaf" },
  { id: "m3", name: "Bestway Premium", type: "Cement", pricePerUnit: 1520, unit: "bag", quality: "High", brand: "Bestway" },
  // Bricks
  { id: "m4", name: "Standard Awwal", type: "Bricks", pricePerUnit: 18, unit: "brick", quality: "Low", brand: "Local" },
  { id: "m5", name: "Machine Bricks", type: "Bricks", pricePerUnit: 26, unit: "brick", quality: "Medium", brand: "Sahiwal" },
  { id: "m6", name: "Fly Ash Bricks", type: "Bricks", pricePerUnit: 38, unit: "brick", quality: "High", brand: "EcoBuild" },
  // Tiles
  { id: "m7", name: "Master Ceramic", type: "Tiles", pricePerUnit: 110, unit: "sqft", quality: "Low", brand: "Master" },
  { id: "m8", name: "Shabbir Porcelain", type: "Tiles", pricePerUnit: 220, unit: "sqft", quality: "Medium", brand: "Shabbir" },
  { id: "m9", name: "Italian Marble", type: "Tiles", pricePerUnit: 480, unit: "sqft", quality: "High", brand: "Imported" },
  // Steel
  { id: "m10", name: "Local Sariya", type: "Steel", pricePerUnit: 270, unit: "kg", quality: "Low", brand: "Local Mill" },
  { id: "m11", name: "Amreli Steel", type: "Steel", pricePerUnit: 305, unit: "kg", quality: "Medium", brand: "Amreli" },
  { id: "m12", name: "Mughal Premium", type: "Steel", pricePerUnit: 335, unit: "kg", quality: "High", brand: "Mughal" },
];

// ---------- Seed projects ----------
export const seedProjects: Project[] = [
  {
    id: "p1", name: "DHA Phase 6 Villa", ownerId: "u1", contractorId: "u2",
    type: "House", area: 2400, budget: 18_000_000, quality: "High",
    status: "In Progress", progress: 62, createdAt: "2025-02-12",
  },
  {
    id: "p2", name: "Gulberg Office Block", ownerId: "u4", contractorId: "u5",
    type: "Commercial", area: 6500, budget: 55_000_000, quality: "Medium",
    status: "In Progress", progress: 34, createdAt: "2025-03-04",
  },
  {
    id: "p3", name: "Bahria Family Home", ownerId: "u1", contractorId: "u5",
    type: "House", area: 1800, budget: 9_500_000, quality: "Medium",
    status: "Planning", progress: 8, createdAt: "2025-04-01",
  },
];

// ---------- Seed progress ----------
export const seedProgress: ProgressUpdate[] = [
  { id: "pr1", projectId: "p1", date: "2025-04-12", description: "Roof slab casting completed on first floor.", mediaUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900", mediaType: "image", status: "Completed" },
  { id: "pr2", projectId: "p1", date: "2025-04-10", description: "Plastering of bedrooms in progress.", mediaUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900", mediaType: "image", status: "In Progress" },
  { id: "pr3", projectId: "p1", date: "2025-04-05", description: "Electrical conduit laying started.", mediaUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900", mediaType: "image", status: "In Progress" },
  { id: "pr4", projectId: "p2", date: "2025-04-11", description: "Foundation excavation completed.", mediaUrl: "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=900", mediaType: "image", status: "Completed" },
];

// ---------- Seed chat ----------
export const seedChat: ChatMessage[] = [
  { id: "c1", projectId: "p1", fromId: "u2", toId: "u1", text: "Salam, today we finished the slab casting. Inspecting tomorrow.", at: "2025-04-12T17:20:00" },
  { id: "c2", projectId: "p1", fromId: "u1", toId: "u2", text: "Great, please send pictures after inspection.", at: "2025-04-12T17:45:00" },
  { id: "c3", projectId: "p1", fromId: "u2", toId: "u1", text: "Sure, will share by evening.", at: "2025-04-12T17:46:00" },
];
