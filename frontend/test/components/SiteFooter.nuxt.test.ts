import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SiteFooter from "~/components/SiteFooter.vue";

describe("components/SiteFooter.vue", () => {
  it("toont het huidige jaar in de copyright-regel", async () => {
    const wrapper = await mountSuspended(SiteFooter);
    expect(wrapper.text()).toContain(String(new Date().getFullYear()));
  });

  it("rendert drie social-links", async () => {
    const wrapper = await mountSuspended(SiteFooter);
    expect(wrapper.findAll("a[aria-label]")).toHaveLength(3);
  });
});
