import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { TileVm } from "~/utils/results";
import MetricTile from "~/components/MetricTile.vue";

function tile(over: Partial<TileVm> = {}): TileVm {
  return {
    key: "energy",
    label: "Energie",
    iconId: "ic-bolt",
    iconKind: "bolt",
    count: 3,
    valueText: "0.003 Wh",
    compareText: "~ 23 sec lamp aan",
    active: false,
    champion: false,
    ...over,
  };
}

describe("components/MetricTile.vue", () => {
  it("rendert evenveel iconen als count", async () => {
    const wrapper = await mountSuspended(MetricTile, {
      props: { tile: tile({ count: 4 }) },
    });
    expect(wrapper.findAll("svg")).toHaveLength(4);
  });

  it("toont label, vergelijking en waarde", async () => {
    const wrapper = await mountSuspended(MetricTile, { props: { tile: tile() } });
    const text = wrapper.text();
    expect(text).toContain("Energie");
    expect(text).toContain("~ 23 sec lamp aan");
    expect(text).toContain("0.003 Wh");
  });

  it("benadrukt de actieve metric met een ring", async () => {
    const wrapper = await mountSuspended(MetricTile, {
      props: { tile: tile({ active: true }) },
    });
    expect(wrapper.get("div").classes()).toContain("ring-2");
  });

  it("markeert de champion met een gevulde achtergrond", async () => {
    const wrapper = await mountSuspended(MetricTile, {
      props: { tile: tile({ active: true, champion: true }) },
    });
    expect(wrapper.get("div").classes()).toContain("bg-primary");
  });
});
