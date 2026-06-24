import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, type Ref } from "vue";
import {
  mountSuspended,
  mockNuxtImport,
} from "@nuxt/test-utils/runtime";
import { flushPromises, type DOMWrapper } from "@vue/test-utils";
import type { Model } from "~/composables/useCompare";
import ChallengerPage from "~/pages/challenger.vue";

// Mocks must live in vi.hoisted: mockNuxtImport hoists its factory above the
// module body, so it can only close over hoisted values.
const { navigateMock, useCompareMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useCompareMock: vi.fn(),
}));
// Observe navigation; mock the shared composable (not the shared components) so
// page state is deterministic per test. The real ModelSelectCard/Stepper mount.
mockNuxtImport("navigateTo", () => navigateMock);
mockNuxtImport("useCompare", () => useCompareMock);

let prompt: Ref<string>;
let selectedIds: Ref<string[]>;
let models: Ref<Model[]>;
let loading: Ref<boolean>;
let runCompare: ReturnType<typeof vi.fn>;

function findByText(wrapper: Awaited<ReturnType<typeof mountSuspended>>, text: string) {
  return wrapper
    .findAll("button")
    .find((b: DOMWrapper<Element>) => b.text().includes(text))!;
}

beforeEach(() => {
  prompt = ref("");
  selectedIds = ref<string[]>([]);
  loading = ref(false);
  // Two Anthropic variants (one card with a chevron), plus one Google and one
  // Ollama model → three provider cards.
  models = ref<Model[]>([
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      provider: "google",
      type: "cloud",
      pActiveBillions: 70,
      priceInputPerMTokens: 0.3,
      priceOutputPerMTokens: 2.5,
    },
    {
      id: "claude-opus-4-8",
      name: "Claude Opus 4.8",
      provider: "anthropic",
      type: "cloud",
      pActiveBillions: 200,
      priceInputPerMTokens: 5,
      priceOutputPerMTokens: 25,
    },
    {
      id: "claude-sonnet-4-6",
      name: "Claude Sonnet 4.6",
      provider: "anthropic",
      type: "cloud",
      pActiveBillions: 70,
      priceInputPerMTokens: 3,
      priceOutputPerMTokens: 15,
    },
    {
      id: "llama-3.2-3b",
      name: "Llama 3.2 3B",
      provider: "ollama",
      type: "local",
      pActiveBillions: 3,
      priceInputPerMTokens: null,
      priceOutputPerMTokens: null,
    },
  ]);
  runCompare = vi.fn().mockResolvedValue(undefined);
  navigateMock.mockClear();

  useCompareMock.mockReturnValue({
    models,
    prompt,
    selectedIds,
    loading,
    loadModels: vi.fn().mockResolvedValue(undefined),
    runCompare,
    toggleModel: (id: string) => {
      const i = selectedIds.value.indexOf(id);
      if (i === -1) selectedIds.value.push(id);
      else selectedIds.value.splice(i, 1);
    },
  });
});

describe("pages/challenger.vue", () => {
  it("rendert één keuzekaart per provider", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();
    // google + anthropic + ollama = 3 kaarten (niet 4 modellen).
    expect(wrapper.findAll("button[aria-pressed]")).toHaveLength(3);
  });

  it("schakelt de verzendknop pas in na invoer én minimaal 2 modellen", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();

    const submit = findByText(wrapper, "Stuur Vraag");
    await wrapper.get("textarea").setValue("Wat is duurzame AI?");

    await wrapper.findAll("button[aria-pressed]")[0].trigger("click");
    await flushPromises();
    expect(submit.attributes("disabled")).toBeDefined(); // 1 model = nog niet

    await wrapper.findAll("button[aria-pressed]")[1].trigger("click");
    await flushPromises();
    expect(submit.attributes("disabled")).toBeUndefined(); // 2 modellen = wel
  });

  it("toont de validatiemelding zolang er minder dan 2 modellen gekozen zijn", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();
    expect(wrapper.text()).toContain("Selecteer minimaal 2 AI-modellen");

    await wrapper.findAll("button[aria-pressed]")[0].trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("Selecteer minimaal 2 AI-modellen");

    await wrapper.findAll("button[aria-pressed]")[1].trigger("click");
    await flushPromises();
    expect(wrapper.text()).not.toContain("Selecteer minimaal 2 AI-modellen");
  });

  it("wisselt via de dropdown naar een andere variant binnen de provider", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();
    expect(wrapper.text()).toContain("Claude Opus 4.8");

    // Alleen de Anthropic-kaart heeft meerdere varianten → één dropdown.
    const selects = wrapper.findAll("select");
    expect(selects).toHaveLength(1);

    await selects[0].setValue("claude-sonnet-4-6");
    await flushPromises();
    expect(wrapper.text()).toContain("Claude Sonnet 4.6");
  });

  it("verplaatst de selectie mee bij het wisselen van variant", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();

    // Selecteer de Anthropic-kaart (index 1) op de Opus-variant.
    await wrapper.findAll("button[aria-pressed]")[1].trigger("click");
    await flushPromises();
    expect(selectedIds.value).toContain("claude-opus-4-8");

    // Kies een andere variant in de dropdown → selectie schuift mee naar Sonnet.
    await wrapper.get("select").setValue("claude-sonnet-4-6");
    await flushPromises();
    expect(selectedIds.value).not.toContain("claude-opus-4-8");
    expect(selectedIds.value).toContain("claude-sonnet-4-6");
  });

  it("toont een live karakter-teller", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();
    await wrapper.get("textarea").setValue("hallo");
    expect(wrapper.text()).toContain("5/2000 Karakters");
  });

  it("vult de vraag met een voorbeeld via 'Verras me'", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();

    const textarea = wrapper.get("textarea").element as HTMLTextAreaElement;
    expect(textarea.value).toBe("");

    await findByText(wrapper, "Verras").trigger("click");
    await flushPromises();
    expect(textarea.value.length).toBeGreaterThan(0);
  });

  it("verzendt en navigeert naar /vergelijking", async () => {
    const wrapper = await mountSuspended(ChallengerPage);
    await flushPromises();

    await wrapper.get("textarea").setValue("Wat is duurzame AI?");
    await wrapper.findAll("button[aria-pressed]")[0].trigger("click");
    await wrapper.findAll("button[aria-pressed]")[1].trigger("click");
    await flushPromises();

    await findByText(wrapper, "Stuur Vraag").trigger("click");
    await flushPromises();

    expect(runCompare).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/vergelijking");
  });
});
