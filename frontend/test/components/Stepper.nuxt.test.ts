import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Stepper from "~/components/Stepper.vue";

describe("components/Stepper.vue", () => {
  it("toont standaard twee stappen met labels", async () => {
    const wrapper = await mountSuspended(Stepper, { props: { current: 1 } });
    const boxes = wrapper.findAll("div.h-10.w-10");
    expect(boxes).toHaveLength(2);
    expect(wrapper.text()).toContain("Vraag & Modellen");
    expect(wrapper.text()).toContain("Vergelijking");
  });

  it("markeert alleen de huidige stap als actief", async () => {
    const wrapper = await mountSuspended(Stepper, { props: { current: 2 } });
    const boxes = wrapper.findAll("div.h-10.w-10");
    expect(boxes[0].classes()).toContain("bg-white");
    expect(boxes[1].classes()).toContain("bg-ink");
  });

  it("rendert één connector minder dan het aantal stappen", async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { current: 1, steps: ["A", "B", "C"] },
    });
    expect(wrapper.findAll("div.h-px")).toHaveLength(2);
  });
});
