import { describe, it, expect } from "vitest";
import {
  iconCount,
  analogy,
  formatValue,
  buildResultRows,
  championModelId,
  metricPoints,
  METRICS,
} from "~/utils/results";
import type { CompareResult } from "~/composables/useCompare";

const energyDef = METRICS.find((m) => m.key === "energy")!;
const waterDef = METRICS.find((m) => m.key === "water")!;
const costDef = METRICS.find((m) => m.key === "cost")!;

function result(
  id: string,
  provider: string,
  footprint: Partial<CompareResult["footprint"]> | null,
): CompareResult {
  return {
    modelId: id,
    ok: footprint !== null,
    model: { id, name: id, provider },
    response: "antwoord",
    footprint: footprint
      ? {
          energyWh: 0,
          co2Grams: 0,
          waterMl: 0,
          costEur: 0,
          inputTokens: 0,
          outputTokens: 0,
          ...footprint,
        }
      : undefined,
    error: footprint === null ? "kapot" : undefined,
  };
}

describe("utils/results", () => {
  it("iconCount schaalt van 1 (laagste) tot maxIcons (hoogste)", () => {
    expect(iconCount(0, 0, 10, 6)).toBe(1);
    expect(iconCount(10, 0, 10, 6)).toBe(6);
    expect(iconCount(2, 0, 10, 6)).toBe(2);
    expect(iconCount(5, 5, 5, 6)).toBe(1); // gelijke min/max
  });

  it("analogy gebruikt het label en is minimaal 1", () => {
    expect(analogy(0.12, waterDef)).toBe("~ 2 druppels"); // 0,12 ml / 0,05 ≈ 2
    expect(analogy(0, waterDef)).toBe("~ 1 druppels");
  });

  it("analogy toont kosten als aantal vragen voor €1 (met duizendtallen)", () => {
    expect(analogy(0.0001, costDef)).toBe("~ 10.000 vragen voor €1"); // 1 / 0,0001
    expect(analogy(0, costDef)).toBe("~ 0 vragen voor €1");
  });

  it("formatValue formatteert met de juiste decimalen en eenheid", () => {
    expect(formatValue(0.003, energyDef)).toBe("0.003 Wh");
  });

  it("championModelId kiest het model met de laagste waarde", () => {
    const list = [
      result("a", "google", { energyWh: 5 }),
      result("b", "anthropic", { energyWh: 2 }),
    ];
    expect(championModelId(list, "energy")).toBe("b");
    expect(championModelId(list, "all")).toBeNull();
  });

  it("buildResultRows zet de winnaar (laagste) bovenaan en markeert de champion", () => {
    const list = [
      result("a", "google", { energyWh: 5 }),
      result("b", "anthropic", { energyWh: 2 }),
    ];
    const rows = buildResultRows(list, "energy");
    expect(rows).toHaveLength(2);
    expect(rows[0].modelId).toBe("b"); // laagste energie → bovenaan
    expect(rows[1].modelId).toBe("a");
    expect(rows[0].tiles).toHaveLength(4);
    expect(rows[0].logo).toContain("claude"); // b = anthropic

    const energyTop = rows[0].tiles.find((t) => t.key === "energy")!;
    expect(energyTop.active).toBe(true);
    expect(energyTop.champion).toBe(true); // de winnaar bovenaan is de champion
  });

  it("buildResultRows sorteert bij 'all' op totaalscore (hoogste bovenaan)", () => {
    const list = [
      result("a", "google", { energyWh: 5 }),
      result("b", "anthropic", { energyWh: 2 }),
    ];
    const rows = buildResultRows(list, "all");
    expect(rows[0].modelId).toBe("b"); // hoogste totaalscore bovenaan
    expect(rows[1].modelId).toBe("a");
  });

  it("buildResultRows zet mislukte resultaten onderaan bij een actieve metric", () => {
    const list = [
      result("ok", "google", { energyWh: 5 }),
      result("fail", "anthropic", null),
    ];
    const rows = buildResultRows(list, "energy");
    expect(rows[0].modelId).toBe("ok");
    expect(rows[1].modelId).toBe("fail");
  });

  it("buildResultRows geeft geen tegels voor een mislukt resultaat", () => {
    const rows = buildResultRows([result("x", "google", null)], "all");
    expect(rows[0].ok).toBe(false);
    expect(rows[0].tiles).toHaveLength(0);
    expect(rows[0].error).toBe("kapot");
  });

  it("metricPoints geeft 25 aan de beste en schaalt de rest naar het percentage", () => {
    expect(metricPoints(2, 2)).toBe(25); // gelijk aan de beste
    expect(metricPoints(4, 2)).toBe(12); // 2x zoveel verbruik → 50% → 12
    expect(metricPoints(5, 0)).toBe(0); // beste verbruikt 0, jij niet → 0
  });

  it("buildResultRows berekent de gesummeerde score (max 100)", () => {
    const list = [
      result("best", "google", {
        energyWh: 2,
        waterMl: 2,
        co2Grams: 2,
        costEur: 2,
      }),
      result("half", "anthropic", {
        energyWh: 4,
        waterMl: 4,
        co2Grams: 4,
        costEur: 4,
      }),
    ];
    const rows = buildResultRows(list, "all");
    const best = rows.find((r) => r.modelId === "best")!;
    const half = rows.find((r) => r.modelId === "half")!;
    expect(best.score).toBe(100); // beste in alle 4 → 4 × 25
    expect(half.score).toBe(48); // 50% in alle 4 → 4 × 12
  });

  it("buildResultRows geeft geen score aan een mislukt resultaat", () => {
    const rows = buildResultRows([result("x", "google", null)], "all");
    expect(rows[0].score).toBeNull();
  });
});
