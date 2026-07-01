import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import FactCard from "~/components/FactCard.vue";

describe("components/FactCard.vue", () => {
  it("toont de highlight wanneer die is meegegeven", async () => {
    const wrapper = await mountSuspended(FactCard, {
      props: {
        highlight: "10x",
        title: "meer water gebruik",
        body: "...",
        source: "Bron: X",
      },
    });
    const big = wrapper.find("h3 span");
    expect(big.exists()).toBe(true);
    expect(big.text()).toBe("10x");
  });

  it("laat de highlight-span weg zonder highlight-prop", async () => {
    const wrapper = await mountSuspended(FactCard, {
      props: { title: "189 Datacenters", body: "...", source: "Bron: CBS" },
    });
    expect(wrapper.find("h3 span").exists()).toBe(false);
  });

  it("rendert de bron in regular 12.8", async () => {
    const wrapper = await mountSuspended(FactCard, {
      props: { title: "t", body: "b", source: "Bron: Y" },
    });
    const source = wrapper.findAll("p").at(-1)!;
    expect(source.classes()).toContain("text-[12.8px]");
    expect(source.classes()).toContain("font-normal");
  });

  it("rendert de CTA uit de default slot", async () => {
    const wrapper = await mountSuspended(FactCard, {
      props: { title: "t", body: "b", source: "s" },
      slots: { default: "Lees meer" },
    });
    expect(wrapper.text()).toContain("Lees meer");
  });
});
