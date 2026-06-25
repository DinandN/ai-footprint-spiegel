import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import InfoCard from "~/components/InfoCard.vue";

describe("components/InfoCard.vue", () => {
  it("rendert titel en body", async () => {
    const wrapper = await mountSuspended(InfoCard, {
      props: { title: "Een feit", body: "De uitleg eronder." },
    });
    expect(wrapper.get("h3").text()).toBe("Een feit");
    expect(wrapper.text()).toContain("De uitleg eronder.");
  });

  it("rendert slot-inhoud (bv. een badge)", async () => {
    const wrapper = await mountSuspended(InfoCard, {
      props: { title: "Titel", body: "Body" },
      slots: { default: () => "BADGE" },
    });
    expect(wrapper.text()).toContain("BADGE");
  });
});
