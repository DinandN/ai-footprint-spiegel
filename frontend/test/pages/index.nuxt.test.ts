import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import IndexPage from "~/pages/index.vue";

describe("pages/index.vue", () => {
  it("toont de hero-titel", async () => {
    const wrapper = await mountSuspended(IndexPage);
    expect(wrapper.find("h1").text()).toContain("voetafdruk");
  });

  it("rendert drie feiten in de facts-band", async () => {
    const wrapper = await mountSuspended(IndexPage);
    expect(wrapper.findAll("h3")).toHaveLength(3);
  });

  it("linkt de hero-CTA's naar /challenger en /about", async () => {
    const wrapper = await mountSuspended(IndexPage);
    const hrefs = wrapper.findAll("a").map((a) => a.attributes("href"));
    expect(hrefs).toContain("/challenger");
    expect(hrefs).toContain("/about");
  });
});
