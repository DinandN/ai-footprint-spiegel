// Nuxt configuration. See https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },

  // Kiosk runs on port 3000 (Technical Design, security/firewall).
  devServer: { port: 3000 },

  runtimeConfig: {
    public: {
      // Base URL of the Express API. Override with NUXT_PUBLIC_API_BASE in .env.
      apiBase: "http://localhost:3001/api",
    },
  },

  css: ["~/assets/css/main.css"],
});
