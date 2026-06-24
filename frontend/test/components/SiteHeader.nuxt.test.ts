import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SiteHeader from "~/components/SiteHeader.vue";

describe("components/SiteHeader.vue", () => {
  it("toont de merknaam en twee navigatielinks", async () => {
    const wrapper = await mountSuspended(SiteHeader);
    expect(wrapper.text()).toContain("MARAZZI");

    const links = wrapper.findAll("nav a");
    expect(links).toHaveLength(2);
    expect(links.map((l) => l.text())).toEqual(["Lectoraat", "Repository"]);
  });
});
