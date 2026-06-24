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

describe("components/ModelSelectCard.vue", () => {
  it("toont het merklogo voor een bekende provider", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: googleModel, selected: false },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toContain("gemini");
  });

  it("valt terug op de modelnaam zonder logo (ollama)", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: ollamaModel, selected: false },
    });
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.text()).toContain("Llama 3.2 3B");
  });

  it("reflecteert de selectie-state via aria-pressed", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: googleModel, selected: true },
    });
    expect(wrapper.get("button").attributes("aria-pressed")).toBe("true");
  });

  it("emit 'toggle' bij klik", async () => {
    const wrapper = await mountSuspended(ModelSelectCard, {
      props: { model: googleModel, selected: false },
    });
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("toggle")).toHaveLength(1);
  });
});
