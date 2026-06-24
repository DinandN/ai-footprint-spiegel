import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AboutPage from "~/pages/about.vue";

describe("pages/about.vue", () => {
  it("toont de titel en de vier secties", async () => {
    const wrapper = await mountSuspended(AboutPage);
    expect(wrapper.find("h1").text()).toContain("Over Marazzi Explainable IT");

    const headings = wrapper.findAll("h2").map((h) => h.text());
    expect(headings).toEqual([
      "Over Dit Project",
      "Wat doet dit artefact?",
      "Hoe worden de resultaten bepaald?",
      "Over het team",
    ]);
  });

  it("linkt terug naar home", async () => {
    const wrapper = await mountSuspended(AboutPage);
    const back = wrapper.find("a");
    expect(back.attributes("href")).toBe("/");
    expect(back.text()).toContain("Terug naar Home");
  });
});
