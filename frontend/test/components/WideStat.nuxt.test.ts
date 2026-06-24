import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import WideStat from "~/components/WideStat.vue";

describe("components/WideStat.vue", () => {
  it("toont big, label en bron", async () => {
    const wrapper = await mountSuspended(WideStat, {
      props: { big: "77%", lbl: "Fortune 500-bedrijven", src: "KPMG 2024" },
    });
    const text = wrapper.text();
    expect(text).toContain("77%");
    expect(text).toContain("Fortune 500-bedrijven");
    expect(text).toContain("KPMG 2024");
  });
});
