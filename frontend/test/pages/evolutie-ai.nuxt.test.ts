import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import EvolutiePage from "~/pages/evolutie-ai.vue";
import StatBadge from "~/components/StatBadge.vue";
import StatCard from "~/components/StatCard.vue";
import WideStat from "~/components/WideStat.vue";

describe("pages/evolutie-ai.vue", () => {
  it("rendert alle stat-componenten, tabelrijen en grafiekbalken", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    expect(wrapper.findAllComponents(StatBadge)).toHaveLength(4);
    expect(wrapper.findAllComponents(StatCard)).toHaveLength(4);
    expect(wrapper.findAllComponents(WideStat)).toHaveLength(3);
    expect(wrapper.findAll("tbody tr")).toHaveLength(6);
    expect(wrapper.findAll(".afs-col")).toHaveLength(5);
  });

  it("wisselt het actieve jaar via de selector", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const years = wrapper.findAll(".afs-yr");
    expect(years[2].classes()).toContain("afs-yr--active"); // 2024 standaard

    await years[0].trigger("click"); // 2022
    expect(years[0].classes()).toContain("afs-yr--active");
    expect(years[2].classes()).not.toContain("afs-yr--active");
  });

  it("stapt met de pager naar het volgende jaar (met wrap)", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    await wrapper.get('button[aria-label="volgende"]').trigger("click"); // 2024 -> 2022
    const years = wrapper.findAll(".afs-yr");
    expect(years[0].classes()).toContain("afs-yr--active");
  });

  it("linkt naar home en naar de mijlpalen-sectie", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const hrefs = wrapper.findAll("a").map((a) => a.attributes("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("#milestones");
  });
});
