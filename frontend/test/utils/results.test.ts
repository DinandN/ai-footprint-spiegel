import { describe, it, expect } from "vitest";
import {
  iconCount,
  analogy,
  formatValue,
  buildResultRows,
  championModelId,
  METRICS,
} from "~/utils/results";
import type { CompareResult } from "~/composables/useCompare";

const energyDef = METRICS.find((m) => m.key === "energy")!;
const waterDef = METRICS.find((m) => m.key === "water")!;

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
    expect(analogy(0.12, waterDef)).toBe("~ 2 glazen");
    expect(analogy(0, waterDef)).toBe("~ 1 glazen");
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

  it("buildResultRows levert tegels per geslaagd model en markeert de champion", () => {
    const list = [
      result("a", "google", { energyWh: 5 }),
      result("b", "anthropic", { energyWh: 2 }),
    ];
    const rows = buildResultRows(list, "energy");
    expect(rows).toHaveLength(2);
    expect(rows[0].tiles).toHaveLength(4);
    expect(rows[0].logo).toContain("gemini");

    const energyA = rows[0].tiles.find((t) => t.key === "energy")!;
    const energyB = rows[1].tiles.find((t) => t.key === "energy")!;
    expect(energyA.active).toBe(true);
    expect(energyB.champion).toBe(true); // b heeft de laagste energie
    expect(energyA.champion).toBe(false);
  });

  it("buildResultRows geeft geen tegels voor een mislukt resultaat", () => {
    const rows = buildResultRows([result("x", "google", null)], "all");
    expect(rows[0].ok).toBe(false);
    expect(rows[0].tiles).toHaveLength(0);
    expect(rows[0].error).toBe("kapot");
  });
});
