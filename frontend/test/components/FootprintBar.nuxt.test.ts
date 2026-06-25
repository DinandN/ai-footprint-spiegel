import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import FootprintBar from "~/components/FootprintBar.vue";

const base = {
  title: "Waterkoeling",
  value: "12",
  unit: "ml",
  fill: 66,
  min: "0 ml",
  max: "18 ml",
  description: "Twaalf milliliter water.",
} as const;

describe("components/FootprintBar.vue", () => {
  it("rendert titel, waarde, eenheid, schaal en beschrijving", async () => {
    const wrapper = await mountSuspended(FootprintBar, {
      props: { variant: "water", ...base },
    });
    const text = wrapper.text();
    expect(text).toContain("Waterkoeling");
    expect(text).toContain("12");
    expect(text).toContain("ml");
    expect(text).toContain("0 ml");
    expect(text).toContain("18 ml");
    expect(text).toContain("Twaalf milliliter water.");
  });

  it("kleurt waarde en balk volgens de variant", async () => {
    const wrapper = await mountSuspended(FootprintBar, {
      props: { variant: "energy", ...base },
    });
    expect(wrapper.html()).toContain("text-energy");
    expect(wrapper.find(".bg-energy").exists()).toBe(true);
  });

  it("zet de balkbreedte op het fill-percentage", async () => {
    const wrapper = await mountSuspended(FootprintBar, {
      props: { variant: "cost", ...base, fill: 30 },
    });
    expect(wrapper.find(".bg-cost").attributes("style")).toContain("width: 30%");
  });
});
