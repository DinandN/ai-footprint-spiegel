import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, type Ref } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import type { CompareResult } from "~/composables/useCompare";
import VergelijkingPerAiPage from "~/pages/vergelijking-per-ai.vue";
import Stepper from "~/components/Stepper.vue";
import ModelHeader from "~/components/ModelHeader.vue";
import FootprintBar from "~/components/FootprintBar.vue";
import InfoCard from "~/components/InfoCard.vue";

const { useCompareMock } = vi.hoisted(() => ({ useCompareMock: vi.fn() }));
mockNuxtImport("useCompare", () => useCompareMock);

let results: Ref<CompareResult[]>;

function okResult(
  id: string,
  name: string,
  provider: string,
  energyWh: number,
): CompareResult {
  return {
    modelId: id,
    ok: true,
    model: { id, name, provider },
    response: "antwoord",
    footprint: {
      energyWh,
      co2Grams: 0.1,
      waterMl: 0.12,
      costEur: 0.0001,
      inputTokens: 10,
      outputTokens: 20,
    },
  };
}

beforeEach(() => {
  results = ref<CompareResult[]>([
    okResult("gemini-2.5-flash", "Gemini 2.5 Flash", "google", 5),
    okResult("claude-opus-4-8", "Claude Opus 4.8", "anthropic", 2),
  ]);
  useCompareMock.mockReturnValue({ results });
});

describe("pages/vergelijking-per-ai.vue", () => {
  it("toont stap 2 als actief in de stepper", async () => {
    const wrapper = await mountSuspended(VergelijkingPerAiPage);
    expect(wrapper.findComponent(Stepper).props("current")).toBe(2);
  });

  it("rendert vier metric-balken en zes informatiekaarten", async () => {
    const wrapper = await mountSuspended(VergelijkingPerAiPage);
    expect(wrapper.findAllComponents(FootprintBar)).toHaveLength(4);
    expect(wrapper.findAllComponents(InfoCard)).toHaveLength(6);
  });

  it("toont de modelkop met merknaam, variant en provider", async () => {
    const wrapper = await mountSuspended(VergelijkingPerAiPage);
    const header = wrapper.findComponent(ModelHeader);
    expect(header.props("name")).toBe("Gemini");
    expect(header.text()).toContain("Gemini 2.5 Flash – Google");
  });

  it("bladert met next/prev naar een ander model", async () => {
    const wrapper = await mountSuspended(VergelijkingPerAiPage);
    expect(wrapper.findComponent(ModelHeader).props("name")).toBe("Gemini");

    await wrapper.get('button[aria-label="Volgend model"]').trigger("click");
    expect(wrapper.findComponent(ModelHeader).props("name")).toBe("Claude");

    await wrapper.get('button[aria-label="Vorig model"]').trigger("click");
    expect(wrapper.findComponent(ModelHeader).props("name")).toBe("Gemini");
  });

  it("toont per provider de juiste content en SDG-sticker", async () => {
    const wrapper = await mountSuspended(VergelijkingPerAiPage);

    // Google (eerste model) → SDG 7 + Google-specifiek feit
    expect(wrapper.find('img[src*="sdg-7"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("TPU");

    // Anthropic → SDG 13 + Anthropic-specifiek feit
    await wrapper.get('button[aria-label="Volgend model"]').trigger("click");
    expect(wrapper.find('img[src*="sdg-13"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Trainium2");
  });

  it("linkt 'Terug Naar Overview' naar /vergelijking", async () => {
    const wrapper = await mountSuspended(VergelijkingPerAiPage);
    const link = wrapper
      .findAll("a")
      .find((a) => a.text().includes("Terug Naar Overview"));
    expect(link?.attributes("href")).toBe("/vergelijking");
  });

  it("toont een lege staat zonder resultaten", async () => {
    results.value = [];
    const wrapper = await mountSuspended(VergelijkingPerAiPage);
    await flushPromises();
    expect(wrapper.findAllComponents(FootprintBar)).toHaveLength(0);
    expect(wrapper.text()).toContain("Nog geen resultaten");
    const link = wrapper.findAll("a").find((a) => a.text().includes("Naar de vergelijking"));
    expect(link?.attributes("href")).toBe("/challenger");
  });
});
