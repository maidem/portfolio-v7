// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "portfolio-color-mode",
  },
  content: {
    highlight: {
      theme: "github-dark",
      preload: ["typescript", "vue", "javascript"],
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  runtimeConfig: {
    mosparoApiKey: process.env.MOSPARO_API_KEY || "",
    mosparoApiSecret: process.env.MOSPARO_API_SECRET || "",
    smtp: {
      host: process.env.SMTP_HOST || "",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
      from: process.env.SMTP_FROM || "",
      to: process.env.SMTP_TO || "",
    },
    public: {
      mosparoUrl: process.env.MOSPARO_URL || "",
      mosparoUuid: process.env.MOSPARO_UUID || "",
      mosparoPublicKey: process.env.MOSPARO_PUBLIC_KEY || "",
    },
  },
});
