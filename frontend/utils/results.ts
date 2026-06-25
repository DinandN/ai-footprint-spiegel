// Pure view-model helpers for the results page. Auto-imported by Nuxt (utils/).
//
// The API returns only the raw footprint per model; the results page needs
// derived display values (icon counts, human comparisons). These are computed
// here so the components stay presentational and the logic stays testable.

import type { CompareResult, Footprint } from "~/composables/useCompare";

export type MetricKey = "energy" | "water" | "co2" | "cost";

export interface TileVm {
  key: MetricKey;
  label: string;
  iconId: string;
  iconKind: "bolt" | "drop" | "cloud" | "coin";
  count: number;
  valueText: string;
  compareText: string;
  active: boolean;
  champion: boolean;
}

export interface RowVm {
  modelId: string;
  name: string;
  logo: string | null;
  ok: boolean;
  error?: string;
  response: string;
  score: number | null;
  tiles: TileVm[];
}

// Points (0–25) for one metric value, given the best (lowest) value in the set.
// The best value scores 25; the rest score up to 24, scaled by how close their
// efficiency is to the best (best / own × 24). 2× the best's usage ≈ 12 points.
const MAX_METRIC_POINTS = 25;
const NON_WINNER_MAX = 24;

export function metricPoints(value: number, best: number): number {
  if (value === best) return MAX_METRIC_POINTS;
  if (best <= 0) return 0; // best uses nothing; any usage scores 0 here
  return (best / value) * NON_WINNER_MAX;
}

interface MetricDef {
  key: MetricKey;
  label: string;
  field: keyof Footprint;
  iconId: string;
  iconKind: TileVm["iconKind"];
  unit: string;
  maxIcons: number;
  decimals: number;
  // Reference for the everyday "compare" analogy. In the default ("count") mode
  // the analogy is `value / ref` of `refLabel`; in "perEuro" mode it is the
  // number of these prompts that fit in €1 (1 / value).
  ref: number;
  refLabel: string;
  refMode?: "count" | "perEuro";
}

// Conversion factors for the everyday analogies:
//   energy — a 10 W LED lamp draws 10/3600 ≈ 0,00278 Wh per second.
//   water  — one drop of water is roughly 0,05 ml.
//   co2    — a human exhales ~1 kg CO₂/day over ~22.000 breaths ≈ 0,045 g/breath.
//   cost   — shown as how many of these prompts fit in €1 (inverse of the price).
export const METRICS: MetricDef[] = [
  { key: "energy", label: "Energie", field: "energyWh", iconId: "ic-bolt", iconKind: "bolt", unit: "Wh", maxIcons: 6, decimals: 3, ref: 0.00278, refLabel: "sec lamp aan" },
  { key: "water", label: "Water", field: "waterMl", iconId: "ic-drop", iconKind: "drop", unit: "ml", maxIcons: 6, decimals: 2, ref: 0.05, refLabel: "druppels" },
  { key: "co2", label: "CO2", field: "co2Grams", iconId: "ic-cloud", iconKind: "cloud", unit: "g", maxIcons: 6, decimals: 3, ref: 0.045, refLabel: "ademteugen" },
  { key: "cost", label: "Kosten", field: "costEur", iconId: "ic-coin", iconKind: "coin", unit: "euro", maxIcons: 9, decimals: 4, ref: 1, refMode: "perEuro", refLabel: "vragen voor €1" },
];

// Provider → brand logo (mirrors ModelSelectCard).
const LOGOS: Record<string, string> = {
  google: "/img/challenger/gemini.png",
  anthropic: "/img/challenger/claude.png",
  ollama: "/img/challenger/ollama.svg",
};

// Number of glyphs for a value, scaled relative to the current result set
// (lowest = 1, highest = maxIcons). Comparison-only; absolute thresholds would
// need reference values from the Technical Design (TODO).
export function iconCount(value: number, min: number, max: number, maxIcons: number): number {
  if (!Number.isFinite(value)) return 1;
  if (max <= min) return 1;
  const norm = (value - min) / (max - min);
  return 1 + Math.round(norm * (maxIcons - 1));
}

// Group a whole number with "." thousands separators (Dutch convention).
function groupThousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Everyday comparison derived from the metric value (see METRICS for the factors).
// "perEuro" expresses cost as how many such prompts fit in €1; the others count
// how many of the everyday unit this prompt equals (minimum 1).
export function analogy(value: number, def: MetricDef): string {
  if (def.refMode === "perEuro") {
    const n = value > 0 ? Math.round(1 / value) : 0;
    return `~ ${groupThousands(n)} ${def.refLabel}`;
  }
  const n = Math.max(1, Math.round(value / def.ref));
  return `~ ${n} ${def.refLabel}`;
}

export function formatValue(value: number, def: MetricDef): string {
  return `${value.toFixed(def.decimals)} ${def.unit}`;
}

// Model with the lowest value for the active metric (the "champion"). Null when
// no specific metric is selected.
export function championModelId(
  results: CompareResult[],
  activeMetric: MetricKey | "all",
): string | null {
  if (activeMetric === "all") return null;
  const def = METRICS.find((m) => m.key === activeMetric)!;
  let best: { id: string; v: number } | null = null;
  for (const r of results) {
    if (!r.ok || !r.footprint) continue;
    const v = r.footprint[def.field] as number;
    if (best === null || v < best.v) best = { id: r.modelId, v };
  }
  return best?.id ?? null;
}

export function buildResultRows(
  results: CompareResult[],
  activeMetric: MetricKey | "all",
): RowVm[] {
  // Per-metric min/max over valid rows, used to scale the icon counts.
  const ranges = {} as Record<MetricKey, { min: number; max: number }>;
  for (const def of METRICS) {
    const vals = results
      .filter((r) => r.ok && r.footprint)
      .map((r) => r.footprint![def.field] as number);
    ranges[def.key] = {
      min: vals.length ? Math.min(...vals) : 0,
      max: vals.length ? Math.max(...vals) : 0,
    };
  }
  const champ = championModelId(results, activeMetric);

  // Summed score (max 100): sum of the per-metric points over the four metrics.
  function scoreOf(r: CompareResult): number | null {
    if (!r.ok || !r.footprint) return null;
    const total = METRICS.reduce(
      (sum, m) =>
        sum + metricPoints(r.footprint![m.field] as number, ranges[m.key].min),
      0,
    );
    return Math.round(total);
  }
  const scoreById = new Map(results.map((r) => [r.modelId, scoreOf(r)]));

  // Best on top. With a metric filter active: ascending by that metric (lowest
  // value = best). With "all": descending by total score (highest = best).
  // Failed results (no value / no score) sink to the bottom.
  const def = METRICS.find((m) => m.key === activeMetric);
  const ordered = [...results].sort((a, b) => {
    if (def == null) {
      return (scoreById.get(b.modelId) ?? -1) - (scoreById.get(a.modelId) ?? -1);
    }
    const av = a.ok && a.footprint ? (a.footprint[def.field] as number) : Infinity;
    const bv = b.ok && b.footprint ? (b.footprint[def.field] as number) : Infinity;
    return av - bv;
  });

  return ordered.map((r) => ({
    modelId: r.modelId,
    name: r.model?.name ?? r.modelId,
    logo: LOGOS[r.model?.provider ?? ""] ?? null,
    ok: r.ok,
    error: r.error,
    response: r.response ?? "",
    score: scoreById.get(r.modelId) ?? null,
    tiles:
      r.ok && r.footprint
        ? METRICS.map((def) => {
            const value = r.footprint![def.field] as number;
            return {
              key: def.key,
              label: def.label,
              iconId: def.iconId,
              iconKind: def.iconKind,
              count: iconCount(value, ranges[def.key].min, ranges[def.key].max, def.maxIcons),
              valueText: formatValue(value, def),
              compareText: analogy(value, def),
              active: activeMetric === def.key,
              champion: activeMetric === def.key && r.modelId === champ,
            };
          })
        : [],
  }));
}
