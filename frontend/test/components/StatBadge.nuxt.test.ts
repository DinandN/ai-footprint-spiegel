import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import StatBadge from "~/components/StatBadge.vue";

describe("components/StatBadge.vue", () => {
  it("toont num, cap, tekst en bron", async () => {
    const wrapper = await mountSuspended(StatBadge, {
      props: {
        num: "200M+",
        cap: "ChatGPT Weekgebruikers",
        text: "Veel mensen gebruiken het.",
        src: "(aug. 2024)",
      },
    });
    const text = wrapper.text();
    expect(text).toContain("200M+");
    expect(text).toContain("ChatGPT Weekgebruikers");
    expect(text).toContain("Veel mensen gebruiken het.");
    expect(text).toContain("(aug. 2024)");
  });
});
