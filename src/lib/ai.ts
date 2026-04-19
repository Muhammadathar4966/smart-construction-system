// Rule-based "AI" material recommender.
import { Material, Project } from "./mockData";

export type Recommendation = {
  type: Material["type"];
  recommended: Material;
  alternatives: Material[];
  reason: string;
  estimatedQty: number;
  estimatedCost: number;
  unit: string;
  bestValue?: boolean;
};

export type EstimationBreakdown = {
  materials: number;
  labor: number;
  finishing: number;
  contingency: number;
  total: number;
};

// Empirical per-sqft factors (rough, for demo)
const QTY_FACTORS: Record<Material["type"], number> = {
  Cement: 0.45, // bags per sqft
  Bricks: 8,    // bricks per sqft
  Tiles: 0.55,  // sqft of tile per sqft area (covered floors)
  Steel: 4,     // kg per sqft
};

export function estimateProject(area: number, quality: Project["quality"]): EstimationBreakdown {
  const baseRate =
    quality === "Low" ? 2200 : quality === "Medium" ? 3200 : 4500; // PKR/sqft
  const total = Math.round(area * baseRate);
  const materials = Math.round(total * 0.55);
  const labor = Math.round(total * 0.25);
  const finishing = Math.round(total * 0.12);
  const contingency = total - materials - labor - finishing;
  return { materials, labor, finishing, contingency, total };
}

function scoreForBudget(quality: Material["quality"], budgetTier: "Low" | "Medium" | "High") {
  const map = { Low: 1, Medium: 2, High: 3 };
  return 4 - Math.abs(map[quality] - map[budgetTier]); // closer = higher score
}

function budgetTierFromInputs(budget: number, area: number): "Low" | "Medium" | "High" {
  const perSqft = budget / Math.max(1, area);
  if (perSqft < 2700) return "Low";
  if (perSqft < 4000) return "Medium";
  return "High";
}

export function recommendMaterials(
  materials: Material[],
  project: { budget: number; area: number; quality: Project["quality"] }
): { tier: "Low" | "Medium" | "High"; results: Recommendation[] } {
  const tier = project.quality ?? budgetTierFromInputs(project.budget, project.area);
  const types: Material["type"][] = ["Cement", "Bricks", "Tiles", "Steel"];

  const results: Recommendation[] = types.map((t) => {
    const pool = materials.filter((m) => m.type === t);
    const sorted = [...pool].sort((a, b) => scoreForBudget(b.quality, tier) - scoreForBudget(a.quality, tier) || a.pricePerUnit - b.pricePerUnit);
    const recommended = sorted[0];
    const alternatives = sorted.slice(1, 3);
    const qty = Math.round(QTY_FACTORS[t] * project.area);
    const cost = qty * recommended.pricePerUnit;
    const reason =
      tier === "Low"
        ? `Selected for budget efficiency — best price-to-strength ratio.`
        : tier === "Medium"
        ? `Balanced choice — strong durability at reasonable cost.`
        : `Premium pick — top-tier quality and finish for a high-end build.`;
    return {
      type: t,
      recommended,
      alternatives,
      reason,
      estimatedQty: qty,
      estimatedCost: cost,
      unit: recommended.unit,
    };
  });

  // Mark "Best Value" (cheapest recommendation overall as a vibe)
  const minIdx = results.reduce((acc, r, i) => (r.estimatedCost < results[acc].estimatedCost ? i : acc), 0);
  results[minIdx].bestValue = true;

  return { tier, results };
}
