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

  it("toont vier jaren met 2022 als standaard actief jaar", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const years = wrapper.findAll(".afs-yr");
    expect(years).toHaveLength(4);
    expect(years[0].text()).toBe("2022");
    expect(years[3].text()).toBe("2025");
    expect(years[0].classes()).toContain("afs-yr--active"); // 2022 standaard
  });

  it("wisselt het actieve jaar via de selector", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const years = wrapper.findAll(".afs-yr");

    await years[3].trigger("click"); // 2025
    expect(years[3].classes()).toContain("afs-yr--active");
    expect(years[0].classes()).not.toContain("afs-yr--active");
  });

  it("toont vier kwartaal-stippen voor het actieve jaar", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const dots = wrapper.findAll(".afs-dots i");
    expect(dots).toHaveLength(4);
    expect(dots[0].classes()).toContain("afs-on"); // Q1 standaard
  });

  it("stapt per kwartaal met de pager en wisselt de mijlpaal-inhoud", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const firstTitle = wrapper.get("#milestones h3").text();

    await wrapper.get('button[aria-label="volgende"]').trigger("click");

    const dots = wrapper.findAll(".afs-dots i");
    expect(dots[1].classes()).toContain("afs-on"); // Q2 actief
    expect(wrapper.get("#milestones h3").text()).not.toBe(firstTitle);
  });

  it("rolt na het laatste kwartaal door naar het volgende jaar", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const next = wrapper.get('button[aria-label="volgende"]');
    for (let i = 0; i < 4; i++) await next.trigger("click"); // 2022 Q1 -> 2023 Q1

    const years = wrapper.findAll(".afs-yr");
    expect(years[1].classes()).toContain("afs-yr--active"); // 2023
    expect(wrapper.findAll(".afs-dots i")[0].classes()).toContain("afs-on"); // terug op Q1
  });

  it("pauzeert en hervat de automatische slider", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const toggle = wrapper.get('button[aria-label="pauzeer slider"]');
    expect(toggle.text()).toBe("Pauze");

    await toggle.trigger("click");
    expect(wrapper.get('button[aria-label="speel slider af"]').text()).toBe("Afspelen");
  });

  it("linkt naar home en naar de mijlpalen-sectie", async () => {
    const wrapper = await mountSuspended(EvolutiePage);
    const hrefs = wrapper.findAll("a").map((a) => a.attributes("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("#milestones");
  });
});
