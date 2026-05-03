import type { RouterConfig } from "@nuxt/schema";

// Scroll strategy:
// - savedPosition: restore immediately (browser back/forward)
// - hash links: wait for the transition to finish, then smooth-scroll to anchor
// - regular navigation: reset to top instantly BEFORE the leave animation so
//   the new page always enters at y=0 and no scroll jump is visible.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Restore scroll for back/forward browser navigation
    if (savedPosition) return savedPosition;

    if (to.hash) {
      // Wait for the full transition before smooth-scrolling to the anchor
      return new Promise((resolve) => {
        const nuxtApp = useNuxtApp();
        nuxtApp.hooks.hookOnce("page:transition:finish", () => {
          const el = document.querySelector(to.hash);
          resolve(
            el
              ? { el: to.hash, top: 80, behavior: "smooth" }
              : { left: 0, top: 0 },
          );
        });
      });
    }

    // Regular navigation: let the page transition handle scrolling via
    // onAfterLeave (see app.vue) so the scroll happens while invisible.
    return false;
  },
};
