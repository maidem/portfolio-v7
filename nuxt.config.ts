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
  routeRules: {
    "/**": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
      },
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      meta: [
        // Block search engines and AI crawlers from indexing or training
        {
          name: "robots",
          content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
        },
        {
          name: "googlebot",
          content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
        },
        { name: "bingbot", content: "noindex, nofollow" },
        // AI/LLM training opt-out
        { name: "GPTBot", content: "noindex, nofollow" },
        { name: "ChatGPT-User", content: "noindex, nofollow" },
        { name: "Google-Extended", content: "noindex, nofollow" },
        { name: "anthropic-ai", content: "noindex, nofollow" },
        { name: "ClaudeBot", content: "noindex, nofollow" },
        { name: "CCBot", content: "noindex, nofollow" },
        { name: "PerplexityBot", content: "noindex, nofollow" },
      ],
    },
  },
  runtimeConfig: {
    // Server-only Mosparo keys. Either MOSPARO_PRIVATE_KEY (preferred) or
    // MOSPARO_API_SECRET is used as the project's private key for HMAC signing.
    // MOSPARO_PUBLIC_KEY is used both for frontend init and Basic-Auth.
    mosparoPrivateKey: process.env.MOSPARO_PRIVATE_KEY || "",
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
