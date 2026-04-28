import type { RouterConfig } from "@nuxt/schema";

// Wait for the page transition (`page` name, mode: out-in) to finish before
// scrolling. This prevents the visible "jump" when navigating between pages
// of different heights while the leave animation is still running.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      const nuxtApp = useNuxtApp();
      const scroll = () => {
        if (savedPosition) return resolve(savedPosition);
        if (to.hash) {
          const el = document.querySelector(to.hash);
          if (el) {
            return resolve({
              el: to.hash,
              top: 80, // offset for sticky header
              behavior: "smooth",
            });
          }
        }
        resolve({ left: 0, top: 0 });
      };

      // Wait for the page transition end before scrolling so layout is stable.
      nuxtApp.hooks.hookOnce("page:transition:finish", scroll);
    });
  },
};
