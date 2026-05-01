<template>
  <div
    class="layout"
    :class="{ 'is-mounted': mounted, 'mobile-open': mobileOpen }"
  >
    <header class="topnav">
      <div class="topnav-inner">
        <NuxtLink to="/" class="site-name" @click="closeMobile"
          >Maik Demuth</NuxtLink
        >

        <nav class="nav-links nav-desktop">
          <template v-for="(link, i) in navLinks" :key="link.to + link.label">
            <span v-if="i > 0" class="nav-sep" aria-hidden="true">/</span>
            <NuxtLink :to="link.to" class="nav-link">{{ link.label }}</NuxtLink>
          </template>
        </nav>

        <div class="nav-actions">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
            aria-label="GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              />
            </svg>
          </a>

          <button
            class="theme-toggle"
            type="button"
            :aria-label="
              isDark
                ? 'Auf hellen Modus wechseln'
                : 'Auf dunklen Modus wechseln'
            "
            :aria-pressed="isDark"
            @click="toggleTheme"
          >
            <ClientOnly>
              <svg
                v-if="isDark"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              <svg
                v-else
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              <template #fallback>
                <span class="toggle-placeholder" />
              </template>
            </ClientOnly>
          </button>

          <button
            class="burger"
            :class="{ 'is-open': mobileOpen }"
            :aria-expanded="mobileOpen"
            aria-label="Menü öffnen"
            @click="mobileOpen = !mobileOpen"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <Transition name="drawer">
        <nav
          v-if="mobileOpen"
          class="nav-mobile"
          :class="{ 'has-expanded': expanded }"
        >
          <ul class="mobile-list">
            <li
              v-for="(link, i) in navLinks"
              :key="link.to + link.label"
              class="mobile-item"
              :class="{ 'is-expanded': expanded === link.to }"
            >
              <div class="mobile-row">
                <span class="mobile-index" aria-hidden="true"
                  >[{{ String(i + 1).padStart(2, "0") }}]</span
                >
                <NuxtLink
                  :to="link.to"
                  class="mobile-link"
                  @click="closeMobile"
                  >{{ link.label }}</NuxtLink
                >
                <button
                  v-if="link.expandable"
                  class="expand-btn"
                  :class="{ 'is-open': expanded === link.to }"
                  :aria-expanded="expanded === link.to"
                  :aria-label="`${link.label} Untermenü`"
                  @click="toggle(link.to)"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <line
                      x1="4"
                      y1="10"
                      x2="16"
                      y2="10"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <line
                      class="plus-v"
                      x1="10"
                      y1="4"
                      x2="10"
                      y2="16"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>

              <Transition
                name="submenu"
                @enter="onSubEnter"
                @after-enter="onSubAfterEnter"
                @leave="onSubLeave"
              >
                <ul
                  v-if="link.expandable && expanded === link.to"
                  class="submenu"
                >
                  <li v-if="!subItems(link).length" class="submenu-empty">
                    Bald verfügbar
                  </li>
                  <li
                    v-for="sub in subItems(link)"
                    :key="sub.to"
                    class="submenu-item"
                  >
                    <NuxtLink
                      :to="sub.to"
                      class="submenu-link"
                      @click="closeMobile"
                    >
                      <span>{{ sub.label }}</span>
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </li>
          </ul>
        </nav>
      </Transition>
    </header>

    <div class="hero-banner" aria-hidden="true">
      <span class="hero-text">PORTFOLIO</span>
    </div>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <span>&copy; 2026 Maik Demuth</span>
      <nav class="footer-links">
        <NuxtLink to="/datenschutz">Datenschutz</NuxtLink>
        <NuxtLink to="/impressum">Impressum</NuxtLink>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const mounted = ref(false);
const mobileOpen = ref(false);
const expanded = ref<string | null>(null);
const route = useRoute();

onMounted(() => {
  requestAnimationFrame(() => (mounted.value = true));
});

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
    expanded.value = null;
  },
);

// Lock body scroll while the fullscreen mobile nav is open
watch(mobileOpen, (open) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = open ? "hidden" : "";
});

const closeMobile = () => {
  mobileOpen.value = false;
  expanded.value = null;
};

const toggle = (key: string) => {
  expanded.value = expanded.value === key ? null : key;
};

// Smooth height animation hooks (mirrors FAQ pattern)
const onSubEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "0";
  element.style.opacity = "0";
  void element.offsetHeight;
  element.style.height = `${element.scrollHeight}px`;
  element.style.opacity = "1";
};
const onSubAfterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "";
  element.style.opacity = "";
};
const onSubLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = `${element.scrollHeight}px`;
  element.style.opacity = "1";
  void element.offsetHeight;
  element.style.height = "0";
  element.style.opacity = "0";
};

interface NavLink {
  to: string;
  label: string;
  expandable?: "projects" | "logbuch";
}

const navLinks: NavLink[] = [
  { to: "/", label: "Informationen" },
  { to: "/projekte", label: "Projekte", expandable: "projects" },
  { to: "/skills", label: "Skills" },
  { to: "/logbuch", label: "Logbuch", expandable: "logbuch" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/pdf-export", label: "PDF-Export" },
];

const { data: projects } = await useAsyncData("nav-projects", () =>
  queryCollection("projects").order("date", "DESC").all(),
);

const { data: logbuch } = await useAsyncData("nav-logbuch", () =>
  queryCollection("logbuch").order("date", "DESC").all(),
);

const projectSubItems = computed(() =>
  (projects.value || []).map((p: any) => ({
    to: `/projekte/${p.slug}`,
    label: p.title,
  })),
);

const logbuchSubItems = computed(() =>
  (logbuch.value || []).map((p: any) => ({
    to: `/logbuch/${p.slug}`,
    label: p.title,
  })),
);

const subItems = (link: NavLink) => {
  if (link.expandable === "projects") return projectSubItems.value;
  if (link.expandable === "logbuch") return logbuchSubItems.value;
  return [];
};

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const toggleTheme = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.layout.is-mounted {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .layout {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.topnav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: none;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}
.layout.mobile-open .topnav {
  background: var(--color-technobotanica);
  color: #0a0a0a;
}
.layout.mobile-open .site-name,
.layout.mobile-open .burger span,
.layout.mobile-open .theme-toggle {
  color: #0a0a0a;
}
.layout.mobile-open .burger span {
  background: #0a0a0a;
}
.layout.mobile-open .theme-toggle {
  border-color: #0a0a0a;
}
.topnav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-width);
  margin-inline: auto;
  padding: 0 var(--space-4);
  height: var(--nav-height);
  gap: var(--space-4);
}
.site-name {
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--color-text);
  text-decoration: none;
  white-space: nowrap;
  letter-spacing: -0.01em;
  transition: opacity 0.15s ease;
}
.site-name:hover {
  color: var(--color-text);
  opacity: 0.7;
}

.nav-desktop {
  display: none;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
}
.nav-sep {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  user-select: none;
}
.nav-link {
  padding: var(--space-2) 0;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.15s ease;
  white-space: nowrap;
  background: transparent;
}
.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-text);
}

/* Right-side actions */
.nav-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: -6px;
}

/* Theme toggle */
.theme-toggle {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-toggle:hover {
  border-color: var(--color-text);
}

.theme-toggle:active {
  transform: scale(0.94);
}

.toggle-placeholder {
  width: 18px;
  height: 18px;
  display: block;
}

/* GitHub link */
.github-link {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  text-decoration: none;
}

.github-link:hover {
  border-color: var(--color-text);
}

.github-link:active {
  transform: scale(0.94);
}

/* Burger */
.burger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.burger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: var(--color-text);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;
  transform-origin: center;
}
.burger.is-open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.burger.is-open span:nth-child(2) {
  opacity: 0;
}
.burger.is-open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ============================================================
   Mobile fullscreen overlay nav — accent color, lines build L→R
   ============================================================ */
.nav-mobile {
  position: fixed;
  inset: var(--nav-height) 0 0 0;
  width: 100vw;
  height: calc(100dvh - var(--nav-height));
  background: var(--color-technobotanica);
  color: #0a0a0a;
  overflow-y: auto;
  z-index: 99;
  padding: 1rem 0 2rem;
}
.mobile-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}
.mobile-item {
  position: relative;
}
/* Left-to-right building separator lines (between items only) */
@keyframes line-build-lr {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
.mobile-item + .mobile-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #0a0a0a;
  transform: scaleX(0);
  transform-origin: left center;
  animation: line-build-lr 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.mobile-item + .mobile-item:nth-child(2)::before {
  animation-delay: 0.06s;
}
.mobile-item + .mobile-item:nth-child(3)::before {
  animation-delay: 0.12s;
}
.mobile-item + .mobile-item:nth-child(4)::before {
  animation-delay: 0.18s;
}
.mobile-item + .mobile-item:nth-child(5)::before {
  animation-delay: 0.24s;
}
.mobile-item + .mobile-item:nth-child(6)::before {
  animation-delay: 0.3s;
}
.mobile-item + .mobile-item:nth-child(7)::before {
  animation-delay: 0.36s;
}
@media (prefers-reduced-motion: reduce) {
  .mobile-item + .mobile-item::before {
    animation: none;
    transform: scaleX(1);
  }
}
.mobile-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0 var(--space-5, 1.5rem);
  min-height: 4.5rem;
}
.mobile-index {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: #0a0a0a;
  font-variant-numeric: tabular-nums;
  align-self: center;
  opacity: 0.75;
}
.mobile-link {
  display: block;
  color: #0a0a0a;
  text-decoration: none;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.05;
  text-transform: none;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.18em;
  text-decoration-skip-ink: none;
  transition: text-decoration-color 0.25s ease;
}
.mobile-link:hover,
.mobile-link.router-link-active,
.mobile-item.is-expanded .mobile-link {
  text-decoration-color: #0a0a0a;
}
.expand-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  flex-shrink: 0;
}
.expand-btn .plus-v {
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.expand-btn.is-open .plus-v {
  transform: rotate(90deg);
  opacity: 0;
}
.submenu {
  list-style: none;
  margin: 0;
  padding: 0 var(--space-5, 1.5rem) 1.25rem
    calc(var(--space-5, 1.5rem) + 2.4rem);
  overflow: hidden;
}
.submenu-enter-active,
.submenu-leave-active {
  transition:
    height 0.35s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.3s ease;
  overflow: hidden;
}
.submenu-item + .submenu-item {
  margin-top: 0.1rem;
}
.submenu-link {
  display: block;
  padding: 0.4rem 0;
  color: #0a0a0a;
  text-decoration: none;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.85;
  transition: opacity 0.15s ease;
}
.submenu-link.router-link-active,
.submenu-link:hover {
  opacity: 1;
}
.submenu-empty {
  padding: 0.4rem 0;
  color: #0a0a0a;
  opacity: 0.6;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.85rem;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
  max-width: var(--max-width);
  width: 100%;
  margin-inline: auto;
  padding: var(--space-8) var(--space-4);
}

/* Hero Banner — Outline Portfolio Schriftzug fixed in background */
.hero-banner {
  position: fixed;
  top: var(--nav-height, 64px);
  left: 0;
  right: 0;
  /* Kein 100vw: das würde die Scrollbar-Breite einschließen
     und beim Theme-Wechsel zu einem horizontalen Shift führen.
     left/right:0 reicht für volle Breite des Viewport ohne Scrollbar. */
  padding: var(--space-6) 0 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  z-index: 0;
  /* Eigener Stacking-/Paint-Context, damit das Element nicht
     gemeinsam mit dem html-Repaint neu komponiert wird. */
  isolation: isolate;
}
.hero-text {
  display: block;
  width: 100%;
  font-family: "Poppins", "JetBrains Mono", sans-serif;
  font-weight: 900;
  font-size: clamp(4rem, 19vw, 22rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-align: center;
  /* Fixe, theme-unabhängige Stroke-Farbe verhindert Repaint-Sprung
     beim Color-Mode-Wechsel. Mid-Gray funktioniert auf hellem
     wie dunklem Hintergrund. */
  color: transparent;
  -webkit-text-stroke: 1px #8a8a8a;
  text-stroke: 1px #8a8a8a;
  white-space: nowrap;
  opacity: 0.45;
  /* Konsistentes Glyph-Rendering, damit der Schriftzug beim
     Theme-Wechsel nicht durch wechselndes Subpixel-AA „springt". */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
  font-synthesis: none;
  /* Verhindert, dass die geerbte color-Transition vom html-Element
     die Outline während des Theme-Wechsels reanimiert. */
  transition: none;
}
@media (max-width: 639px) {
  .hero-banner {
    display: none;
  }
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  max-width: var(--max-width);
  width: 100%;
  margin-inline: auto;
  padding: var(--space-6) var(--space-4);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}
.footer-links {
  display: flex;
  gap: var(--space-4);
}
.footer-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}
.footer-links a:hover {
  color: var(--color-text);
}

@media (min-width: 768px) {
  .nav-desktop {
    display: flex;
  }
  .burger,
  .nav-mobile {
    display: none;
  }
  .nav-actions {
    margin-left: 0;
  }
}
@media (min-width: 640px) {
  .topnav-inner {
    padding: 0 var(--space-6);
  }
  .main-content {
    padding: var(--space-10) var(--space-6);
  }
  .footer {
    padding: var(--space-6);
  }
}
</style>
