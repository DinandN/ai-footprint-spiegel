import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { Model } from "~/composables/useCompare";
import ModelSelectCard from "~/components/ModelSelectCard.vue";

const googleModel: Model = {
  id: "gemini-2.5-flash",
  name: "Gemini 2.5 Flash",
  provider: "google",
  type: "cloud",
  pActiveBillions: 70,
  priceInputPerMTokens: 0.3,
  priceOutputPerMTokens: 2.5,
};

const ollamaModel: Model = {
  id: "llama-3.2-3b",
  name: "Llama 3.2 3B",
  provider: "ollama",
  type: "local",
  pActiveBillions: 3,
  priceInputPerMTokens: null,
  priceOutputPerMTokens: null,
};

const claudeOpus: Model = {
  id: "claude-opus-4-8",
  name: "Claude Opus 4.8",
  provider: "anthropic",
  type: "cloud",
  pActiveBillions: 200,
  priceInputPerMTokens: 5,
  priceOutputPerMTokens: 25,
};

const claudeSonnet: Model = {
  id: "claude-sonnet-4-6",
  name: "Claude Sonnet 4.6",
  provider: "anthropic",
  type: "cloud",
  pActiveBillions: 70,
  priceInputPerMTokens: 3,
  priceOutputPerMTokens: 15,
};

describe("components/ModelSelectCard.vue", () => {
  it("toont het merklogo voor een bekende provider", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: googleModel, variants: [googleModel], selected: false },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toContain("gemini");
  });

  it("toont een logo voor Ollama-modellen", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: ollamaModel, variants: [ollamaModel], selected: false },
    });
    expect(wrapper.find("img").attributes("src")).toContain("ollama");
  });

  it("reflecteert de selectie-state via aria-pressed", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: googleModel, variants: [googleModel], selected: true },
    });
    expect(wrapper.get("button[aria-pressed]").attributes("aria-pressed")).toBe(
      "true",
    );
  });

  it("emit 'toggle' bij klik op de kaart", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: googleModel, variants: [googleModel], selected: false },
    });
    await wrapper.get("button[aria-pressed]").trigger("click");
    expect(wrapper.emitted("toggle")).toHaveLength(1);
  });

  it("toont een dropdown alleen bij meerdere varianten", async () => {
    const one = await mountSuspended(ModelSelectCard, {
      props: { model: claudeOpus, variants: [claudeOpus], selected: false },
    });
    expect(one.find("select").exists()).toBe(false);

    const many = await mountSuspended(ModelSelectCard, {
      props: {
        model: claudeOpus,
        variants: [claudeOpus, claudeSonnet],
        selected: false,
      },
    });
    const select = many.find("select");
    expect(select.exists()).toBe(true);
    expect(select.findAll("option")).toHaveLength(2);
  });

  it("emit 'select-variant' (niet 'toggle') bij een keuze in de dropdown", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: {
        model: claudeOpus,
        variants: [claudeOpus, claudeSonnet],
        selected: false,
      },
    });
    await wrapper.get("select").setValue("claude-sonnet-4-6");
    expect(wrapper.emitted("select-variant")?.[0]).toEqual(["claude-sonnet-4-6"]);
    expect(wrapper.emitted("toggle")).toBeUndefined();
  });
});
