import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import StatCard from "~/components/StatCard.vue";

describe("components/StatCard.vue", () => {
  it("toont een emoji-icoon plus de cijfers", async () => {
    const wrapper = await mountSuspended(StatCard, {
      props: { big: "1.287 MWh", lbl: "Energie", sub: "huishoudens", src: "Bron", emoji: "🌎" },
    });
    expect(wrapper.text()).toContain("🌎");
    expect(wrapper.text()).toContain("1.287 MWh");
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("toont een afbeelding-icoon wanneer img is gezet", async () => {
    const wrapper = await mountSuspended(StatCard, {
      props: {
        big: "502 ton CO₂",
        lbl: "Uitstoot",
        sub: "auto's",
        src: "Bron",
        img: "/img/evolutie-ai/icon-cloud.svg",
      },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toContain("icon-cloud");
  });
});
