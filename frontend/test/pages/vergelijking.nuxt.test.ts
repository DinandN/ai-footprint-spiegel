import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, type Ref } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { flushPromises, type DOMWrapper } from "@vue/test-utils";
import type { CompareResult } from "~/composables/useCompare";
import VergelijkingPage from "~/pages/vergelijking.vue";
import ResultRow from "~/components/ResultRow.vue";

const { navigateMock, useCompareMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useCompareMock: vi.fn(),
}));
mockNuxtImport("navigateTo", () => navigateMock);
mockNuxtImport("useCompare", () => useCompareMock);

let results: Ref<CompareResult[]>;
let error: Ref<string | null>;

function okResult(id: string, provider: string, energyWh: number): CompareResult {
  return {
    modelId: id,
    ok: true,
    model: { id, name: id, provider },
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

function findByText(
  wrapper: Awaited<ReturnType<typeof mountSuspended>>,
  text: string,
) {
  return wrapper
    .findAll("button")
    .find((b: DOMWrapper<Element>) => b.text().includes(text))!;
}

beforeEach(() => {
  results = ref<CompareResult[]>([
    okResult("gemini-2.5-flash", "google", 5),
    okResult("claude-opus-4-8", "anthropic", 2),
  ]);
  error = ref<string | null>(null);
  navigateMock.mockClear();
  useCompareMock.mockReturnValue({ results, error });
});

describe("pages/vergelijking.vue", () => {
  it("rendert een rij per resultaat", async () => {
    const wrapper = await mountSuspended(VergelijkingPage);
    await flushPromises();
    expect(wrapper.findAllComponents(ResultRow)).toHaveLength(2);
  });

  it("activeert een metric-filter bij klik", async () => {
    const wrapper = await mountSuspended(VergelijkingPage);
    await flushPromises();

    const tab = findByText(wrapper, "Energie");
    expect(tab.classes()).not.toContain("afs-metric-tab--active");

    await tab.trigger("click");
    expect(tab.classes()).toContain("afs-metric-tab--active");
  });

  it("gaat met de terug-knop naar /challenger", async () => {
    const wrapper = await mountSuspended(VergelijkingPage);
    await flushPromises();

    await findByText(wrapper, "Terug").trigger("click");
    expect(navigateMock).toHaveBeenCalledWith("/challenger");
  });

  it("toont een lege staat zonder resultaten", async () => {
    results.value = [];
    const wrapper = await mountSuspended(VergelijkingPage);
    await flushPromises();
    expect(wrapper.text()).toContain("Nog geen resultaten");
    expect(wrapper.findAllComponents(ResultRow)).toHaveLength(0);
  });
});
