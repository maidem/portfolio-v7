<template>
  <div class="entry-detail-page">
    <article v-if="doc" class="entry-detail">
      <NuxtLink to="/logbuch" class="back-link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M12 7H2M6 3L2 7l4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Alle Einträge</span>
      </NuxtLink>

      <header class="entry-header">
        <p v-if="doc.date" class="entry-date">{{ formatDate(doc.date) }}</p>
        <h1 class="page-title">{{ doc.title }}</h1>
        <p v-if="doc.description" class="entry-lead">{{ doc.description }}</p>

        <ul v-if="doc.tags && doc.tags.length" class="tag-list">
          <li v-for="tag in doc.tags" :key="tag" class="tag">{{ tag }}</li>
        </ul>
      </header>

      <section class="entry-body">
        <ContentRenderer :value="doc" />
      </section>

      <nav v-if="prev || next" class="entry-nav">
        <NuxtLink
          v-if="prev"
          :to="`/logbuch/${prev.slug}`"
          class="nav-card prev"
        >
          <span class="nav-direction">← Vorheriges</span>
          <span class="nav-title">{{ prev.title }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink
          v-if="next"
          :to="`/logbuch/${next.slug}`"
          class="nav-card next"
        >
          <span class="nav-direction">Nächstes →</span>
          <span class="nav-title">{{ next.title }}</span>
        </NuxtLink>
      </nav>
    </article>

    <div v-else class="not-found">
      <h1 class="page-title">Eintrag nicht gefunden</h1>
      <p>Dieser Eintrag existiert nicht oder wurde verschoben.</p>
      <NuxtLink to="/logbuch" class="back-link">← Zur Übersicht</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ layout: "default" });

const route = useRoute();

const { data: doc } = await useAsyncData(`logbuch-${route.params.slug}`, () =>
  queryCollection("logbuch")
    .where("stem", "LIKE", `logbuch/${route.params.slug}`)
    .first(),
);

const { data: entries } = await useAsyncData("logbuch-list", () =>
  queryCollection("logbuch").order("date", "DESC").all(),
);

const currentIndex = computed(
  () =>
    entries.value?.findIndex((p: any) => p.slug === route.params.slug) ?? -1,
);

const prev = computed(() => {
  if (!entries.value || currentIndex.value <= 0) return null;
  return entries.value[currentIndex.value - 1];
});

const next = computed(() => {
  if (!entries.value || currentIndex.value >= entries.value.length - 1)
    return null;
  return entries.value[currentIndex.value + 1];
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
    : "Eintrag nicht gefunden",
});
</script>

<style scoped>
.entry-detail-page {
  padding: 1rem 0 4rem;
}
.entry-detail {
  max-width: 720px;
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
.entry-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}
.entry-date {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.entry-lead {
  margin: 1.5rem 0 1.5rem;
  max-width: 56ch;
  color: var(--color-text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}
.tag-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
}
.tag {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  position: relative;
  padding-left: 0.9rem;
}
.tag::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0.35rem;
  height: 1px;
  background: var(--color-text-muted);
}
.entry-body :deep(h2),
.entry-body :deep(h3),
.entry-body :deep(h4) {
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.entry-body :deep(h2) {
  font-size: 1.5rem;
}
.entry-body :deep(h3) {
  font-size: 1.15rem;
  color: var(--color-text-muted);
}
.entry-body :deep(p) {
  color: var(--color-text);
  line-height: 1.8;
  margin: 0 0 1rem;
}
.entry-body :deep(ul),
.entry-body :deep(ol) {
  color: var(--color-text);
  line-height: 1.8;
  margin: 0 0 1.25rem 1rem;
}
.entry-body :deep(li) {
  margin-bottom: 0.4rem;
}
.entry-body :deep(a) {
  color: var(--color-text);
  border-bottom: 1px solid var(--color-technobotanica);
  text-decoration: none;
}
.not-found {
  max-width: 560px;
}
.not-found p {
  margin: 1rem 0 2rem;
  color: var(--color-text-muted);
}
.entry-nav {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 4rem;
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
@media (min-width: 640px) {
  .entry-nav {
    grid-template-columns: 1fr 1fr;
  }
  .nav-card.next {
    text-align: right;
  }
}
</style>
