<template>
  <div class="logbuch-page">
    <header class="logbuch-header">
      <h1 class="page-title">Logbuch</h1>
      <p class="lead">
        Notizen, Lessons Learned und Hintergrundgedanken zu aktuellen Arbeiten.
      </p>
    </header>

    <section v-if="entries && entries.length" class="entries">
      <article v-for="entry in entries" :key="entry.slug" class="entry">
        <p class="entry-date">{{ formatDate(entry.date) }}</p>
        <h2 class="entry-title">
          <NuxtLink :to="`/logbuch/${entry.slug}`">{{ entry.title }}</NuxtLink>
        </h2>
        <p v-if="entry.description" class="entry-desc">
          {{ entry.description }}
        </p>

        <ul v-if="entry.tags && entry.tags.length" class="tag-list">
          <li v-for="tag in entry.tags" :key="tag" class="tag">{{ tag }}</li>
        </ul>

        <NuxtLink :to="`/logbuch/${entry.slug}`" class="more">
          <span>Mehr lesen</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </NuxtLink>
      </article>
    </section>

    <p v-else class="empty">Aktuell sind keine Einträge verfügbar.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
useHead({ title: "Logbuch – Maik Demuth" });

const { data: entries } = await useAsyncData("logbuch", () =>
  queryCollection("logbuch").order("date", "DESC").all(),
);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
</script>

<style scoped>
.logbuch-page {
  padding: 1rem 0 4rem;
}
.logbuch-header {
  margin-bottom: 4rem;
  max-width: 760px;
}
.lead {
  margin-top: 1.25rem;
  max-width: 56ch;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.7;
}
.entries {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border);
}
.entry {
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--color-border);
  max-width: 60ch;
}
.entry-date {
  margin: 0 0 0.75rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.entry-title {
  margin: 0 0 0.85rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
}
.entry-title a {
  color: var(--color-text);
  text-decoration: none;
  background-image: linear-gradient(
    to right,
    var(--color-technobotanica),
    var(--color-technobotanica)
  );
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 0.12em;
  transition: background-size 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  padding-bottom: 0.05em;
}
.entry-title a:hover {
  background-size: 100% 0.12em;
}
.entry-desc {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}
.tag-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
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
.more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--color-text);
  transition: gap 0.25s ease;
}
.more:hover {
  gap: 0.85rem;
}
.empty {
  color: var(--color-text-muted);
}
</style>
