import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ModelHeader from "~/components/ModelHeader.vue";

describe("components/ModelHeader.vue", () => {
  it("toont het logo (met naam als alt) en de variant; geen losse naam-tekst", async () => {
    const wrapper = await mountSuspended(ModelHeader, {
      props: {
        name: "Gemini",
        variant: "Flash 3.5 – Google",
        logo: "/img/challenger/gemini.png",
      },
    });
    const img = wrapper.get("img");
    expect(img.attributes("src")).toBe("/img/challenger/gemini.png");
    expect(img.attributes("alt")).toBe("Gemini");
    expect(wrapper.text()).toContain("Flash 3.5 – Google");
    expect(wrapper.text()).not.toContain("Gemini"); // naam-tekst vervalt zodra er een logo is
  });

  it("toont de naam als tekst wanneer er geen logo is", async () => {
    const wrapper = await mountSuspended(ModelHeader, {
      props: { name: "Llama", variant: "Llama 3.2 3B – Ollama" },
    });
    expect(wrapper.text()).toContain("Llama");
  });

  it("emit prev en next bij klik op de chevrons", async () => {
    const wrapper = await mountSuspended(ModelHeader, {
      props: { name: "Gemini", variant: "x" },
    });
    const buttons = wrapper.findAll("button");
    await buttons[0].trigger("click");
    await buttons[1].trigger("click");
    expect(wrapper.emitted("prev")).toHaveLength(1);
    expect(wrapper.emitted("next")).toHaveLength(1);
  });
});
