<template>
  <div class="layout" :class="{ 'is-mounted': mounted }">
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
        <nav v-if="mobileOpen" class="nav-mobile">
          <ul class="mobile-list">
            <li
              v-for="link in navLinks"
              :key="link.to + link.label"
              class="mobile-item"
            >
              <div class="mobile-row">
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
                  <span class="plus" aria-hidden="true" />
                </button>
              </div>

              <Transition name="submenu">
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
                      <span class="dash" aria-hidden="true" />
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

const closeMobile = () => {
  mobileOpen.value = false;
  expanded.value = null;
};

const toggle = (key: string) => {
  expanded.value = expanded.value === key ? null : key;
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

.nav-mobile {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  background: var(--color-bg);
  max-height: calc(100dvh - var(--nav-height));
  overflow-y: auto;
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
/* Side-building separator lines (animate on mount) */
@keyframes line-build {
  from {
    transform: translateX(-50%) scaleX(0);
  }
  to {
    transform: translateX(-50%) scaleX(1);
  }
}
.mobile-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 1px;
  background: var(--color-border);
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  animation: line-build 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.mobile-item:last-child::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: 1px;
  background: var(--color-border);
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  animation: line-build 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.mobile-item:nth-child(1)::before {
  animation-delay: 0.05s;
}
.mobile-item:nth-child(2)::before {
  animation-delay: 0.1s;
}
.mobile-item:nth-child(3)::before {
  animation-delay: 0.15s;
}
.mobile-item:nth-child(4)::before {
  animation-delay: 0.2s;
}
.mobile-item:nth-child(5)::before {
  animation-delay: 0.25s;
}
.mobile-item:nth-child(6)::before {
  animation-delay: 0.3s;
}
.mobile-item:nth-child(7)::before {
  animation-delay: 0.35s;
}
.mobile-item:last-child::after {
  animation-delay: 0.4s;
}
@media (prefers-reduced-motion: reduce) {
  .mobile-item::before,
  .mobile-item:last-child::after {
    animation: none;
    transform: translateX(-50%) scaleX(1);
  }
}
.mobile-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  width: 100%;
}
.mobile-link {
  flex: 1;
  display: block;
  padding: 1.1rem 0;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 0.15em;
  text-underline-offset: 0.25em;
  text-decoration-skip-ink: none;
  transition: text-decoration-color 0.25s ease;
}
.mobile-link:hover,
.mobile-link.router-link-active {
  text-decoration-color: var(--color-technobotanica);
}
.expand-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition:
    border-color 0.2s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  flex-shrink: 0;
}
.expand-btn:hover {
  border-color: var(--color-text);
}
.expand-btn.is-open {
  transform: rotate(45deg);
  border-color: var(--color-text);
}
.plus {
  position: relative;
  width: 12px;
  height: 12px;
  display: block;
}
.plus::before,
.plus::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  background: var(--color-text);
}
.plus::before {
  width: 12px;
  height: 1.5px;
}
.plus::after {
  width: 1.5px;
  height: 12px;
}
.submenu {
  list-style: none;
  margin: 0;
  padding: 0 var(--space-4) 1rem;
}
.submenu-item + .submenu-item {
  border-top: 1px dashed var(--color-border);
}
.submenu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  line-height: 1.4;
}
.submenu-link.router-link-active,
.submenu-link:hover {
  color: var(--color-text);
}
.dash {
  display: inline-block;
  width: 0.75rem;
  height: 1px;
  background: var(--color-text-muted);
  flex-shrink: 0;
}
.submenu-empty {
  padding: 0.75rem 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.drawer-enter-active {
  transition:
    opacity 0.2s cubic-bezier(0, 0, 0.2, 1),
    transform 0.22s cubic-bezier(0, 0, 0.2, 1);
  transform-origin: top;
  will-change: opacity, transform;
  backface-visibility: hidden;
}
.drawer-leave-active {
  transition:
    opacity 0.12s cubic-bezier(0.4, 0, 1, 1),
    transform 0.15s cubic-bezier(0.4, 0, 1, 1);
  transform-origin: top;
  will-change: opacity, transform;
  backface-visibility: hidden;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.submenu-enter-active,
.submenu-leave-active {
  transition:
    opacity 0.2s ease,
    max-height 0.3s ease;
  overflow: hidden;
  max-height: 600px;
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
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
  width: 100vw;
  padding: var(--space-6) 0 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  z-index: 0;
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
  color: transparent;
  -webkit-text-stroke: 1px var(--color-border);
  text-stroke: 1px var(--color-border);
  white-space: nowrap;
  opacity: 0.65;
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
