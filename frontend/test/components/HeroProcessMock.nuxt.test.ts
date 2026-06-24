import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import HeroProcessMock from "~/components/HeroProcessMock.vue";

describe("components/HeroProcessMock.vue", () => {
  it("rendert vier footprint-metrics in de result-card", async () => {
    const wrapper = await mountSuspended(HeroProcessMock);
    expect(wrapper.findAll(".grid > div")).toHaveLength(4);
  });

  it("toont de labels van alle metrics", async () => {
    const wrapper = await mountSuspended(HeroProcessMock);
    const text = wrapper.text();
    for (const label of ["Energie", "Water", "CO₂", "Kosten"]) {
      expect(text).toContain(label);
    }
  });
});
