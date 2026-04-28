<template>
  <div class="project-detail-page">
    <article v-if="doc" class="project-detail">
      <NuxtLink to="/projekte" class="back-link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M12 7H2M6 3L2 7l4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Alle Projekte</span>
      </NuxtLink>

      <header class="project-header">
        <p v-if="doc.date" class="project-date">{{ formatDate(doc.date) }}</p>
        <h1 class="page-title">{{ doc.title }}</h1>
        <p v-if="doc.description" class="project-lead">{{ doc.description }}</p>
      </header>

      <div class="meta-grid">
        <div
          v-if="doc.technologies && doc.technologies.length"
          class="meta-block"
        >
          <h3 class="meta-label">Technologien</h3>
          <ul class="tech-list">
            <li v-for="tech in doc.technologies" :key="tech" class="tech">
              {{ tech }}
            </li>
          </ul>
        </div>

        <div v-if="doc.github || doc.live" class="meta-block">
          <h3 class="meta-label">Links</h3>
          <ul class="links-list">
            <li v-if="doc.live">
              <a :href="doc.live" target="_blank" rel="noopener">
                <span>Live ansehen</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 3h6v6M3 9l6-6"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </li>
            <li v-if="doc.github">
              <a :href="doc.github" target="_blank" rel="noopener">
                <span>Quellcode</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 3h6v6M3 9l6-6"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <section class="project-body">
        <ContentRenderer :value="doc" />
      </section>

      <nav v-if="prev || next" class="project-nav">
        <NuxtLink
          v-if="prev"
          :to="`/projekte/${prev.slug}`"
          class="nav-card prev"
        >
          <span class="nav-direction">← Vorheriges</span>
          <span class="nav-title">{{ prev.title }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink
          v-if="next"
          :to="`/projekte/${next.slug}`"
          class="nav-card next"
        >
          <span class="nav-direction">Nächstes →</span>
          <span class="nav-title">{{ next.title }}</span>
        </NuxtLink>
      </nav>
    </article>

    <div v-else class="not-found">
      <h1 class="page-title">Projekt nicht gefunden</h1>
      <p>Dieses Projekt existiert nicht oder wurde verschoben.</p>
      <NuxtLink to="/projekte" class="back-link">← Zur Übersicht</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ layout: "default" });

const route = useRoute();

const { data: doc } = await useAsyncData(`project-${route.params.slug}`, () =>
  queryCollection("projects")
    .where("stem", "LIKE", `projects/${route.params.slug}`)
    .first(),
);

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").order("date", "DESC").all(),
);

const currentIndex = computed(
  () =>
    projects.value?.findIndex((p: any) => p.slug === route.params.slug) ?? -1,
);

const prev = computed(() => {
  if (!projects.value || currentIndex.value <= 0) return null;
  return projects.value[currentIndex.value - 1];
});

const next = computed(() => {
  if (!projects.value || currentIndex.value >= projects.value.length - 1)
    return null;
  return projects.value[currentIndex.value + 1];
});

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

useHead({
  title: doc.value?.title
    ? `${doc.value.title} – Maik Demuth`
    : "Projekt nicht gefunden",
});
</script>

<style scoped>
.project-detail-page {
  padding: 1rem 0 4rem;
}
.project-detail {
  max-width: 760px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 3rem;
  transition:
    color 0.2s ease,
    gap 0.25s ease;
}
.back-link:hover {
  color: var(--color-text);
  gap: 0.85rem;
}
.project-header {
  margin-bottom: 3rem;
}
.project-date {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.project-lead {
  margin: 1.5rem 0 0;
  max-width: 56ch;
  color: var(--color-text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}
.meta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem 0;
  margin-bottom: 3rem;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.meta-label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 1rem;
}
.tech-list,
.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tech {
  font-size: 0.85rem;
  color: var(--color-text);
  position: relative;
  padding-left: 0.9rem;
}
.tech::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0.35rem;
  height: 1px;
  background: var(--color-text-muted);
}
.links-list a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
  transition: border-color 0.2s ease;
}
.links-list a:hover {
  border-bottom-color: var(--color-technobotanica);
}
.project-body {
  margin-bottom: 4rem;
}
.project-body :deep(h1),
.project-body :deep(h2),
.project-body :deep(h3),
.project-body :deep(h4) {
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.project-body :deep(h2) {
  font-size: 1.5rem;
}
.project-body :deep(h3) {
  font-size: 1.15rem;
  color: var(--color-text-muted);
}
.project-body :deep(p) {
  color: var(--color-text);
  line-height: 1.8;
  margin: 0 0 1rem;
}
.project-body :deep(ul),
.project-body :deep(ol) {
  color: var(--color-text);
  line-height: 1.8;
  margin: 0 0 1.25rem 1rem;
  padding: 0;
}
.project-body :deep(li) {
  margin-bottom: 0.4rem;
}
.project-body :deep(a) {
  color: var(--color-text);
  border-bottom: 1px solid var(--color-technobotanica);
  text-decoration: none;
}
.project-body :deep(img) {
  width: 100%;
  height: auto;
  margin: 2rem 0;
  border: 1px solid var(--color-border);
}
.project-nav {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}
.nav-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  padding: 1rem 0;
  transition: opacity 0.25s ease;
}
.nav-card.next {
  text-align: left;
}
.nav-card:hover {
  opacity: 0.7;
}
.nav-direction {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.nav-title {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.3;
}
.not-found {
  max-width: 560px;
}
.not-found p {
  margin: 1rem 0 2rem;
  color: var(--color-text-muted);
}
@media (min-width: 640px) {
  .meta-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  .project-nav {
    grid-template-columns: 1fr 1fr;
  }
  .nav-card.next {
    text-align: right;
  }
}
</style>
