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
    </article>

    <div v-else class="not-found">
      <h1 class="page-title">Eintrag nicht gefunden</h1>
      <p>Dieser Eintrag existiert nicht oder wurde verschoben.</p>
      <NuxtLink to="/logbuch" class="back-link">← Zur Übersicht</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const route = useRoute();

const { data: doc } = await useAsyncData(`logbuch-${route.params.slug}`, () =>
  queryCollection("logbuch")
    .where("stem", "LIKE", `logbuch/${route.params.slug}`)
    .first(),
);

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
</style>
