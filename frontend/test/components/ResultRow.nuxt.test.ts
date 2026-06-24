import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { RowVm, TileVm } from "~/utils/results";
import ResultRow from "~/components/ResultRow.vue";
import MetricTile from "~/components/MetricTile.vue";

function tile(key: TileVm["key"]): TileVm {
  return {
    key,
    label: key,
    iconId: "ic-bolt",
    iconKind: key === "cost" ? "coin" : "bolt",
    count: 2,
    valueText: "1",
    compareText: "~ 1",
    active: false,
    champion: false,
  };
}

function okRow(over: Partial<RowVm> = {}): RowVm {
  return {
    modelId: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    logo: "/img/challenger/gemini.png",
    ok: true,
    response: "Een vrij lang antwoord dat over meerdere regels loopt. ".repeat(8),
    tiles: [tile("energy"), tile("water"), tile("co2"), tile("cost")],
    ...over,
  };
}

describe("components/ResultRow.vue", () => {
  it("rendert vier metric-tegels voor een geslaagd resultaat", async () => {
    const wrapper = await mountSuspended(ResultRow, { props: { row: okRow() } });
    expect(wrapper.findAllComponents(MetricTile)).toHaveLength(4);
  });

  it("vouwt de respons uit en weer in", async () => {
    const wrapper = await mountSuspended(ResultRow, { props: { row: okRow() } });
    const preview = wrapper.get("p");
    expect(preview.classes()).toContain("line-clamp-3");

    await wrapper.get("button").trigger("click");
    expect(wrapper.get("p").classes()).not.toContain("line-clamp-3");
  });

  it("toont een foutmelding en geen tegels bij een mislukt resultaat", async () => {
    const wrapper = await mountSuspended(ResultRow, {
      props: { row: okRow({ ok: false, error: "API down", tiles: [] }) },
    });
    expect(wrapper.text()).toContain("Fout: API down");
    expect(wrapper.findAllComponents(MetricTile)).toHaveLength(0);
  });
});
