import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    // Run tests in a real Nuxt runtime so auto-imports + composables work.
    environment: "nuxt",
    environmentOptions: {
      nuxt: { domEnvironment: "happy-dom" },
    },
  },
});
