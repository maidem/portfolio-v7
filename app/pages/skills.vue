<template>
  <div class="skills-page">
    <header class="skills-header">
      <h1 class="page-title">Skills</h1>
      <p class="lead">
        Eine Übersicht der Technologien und Werkzeuge, mit denen ich täglich
        arbeite — gruppiert nach Bereich.
      </p>
    </header>

    <section class="skills-list">
      <article
        v-for="(group, gi) in skillGroups"
        :key="group.category"
        class="skill-row"
      >
        <header class="skill-meta">
          <span class="row-index" aria-hidden="true">{{
            String(gi + 1).padStart(2, "0")
          }}</span>
          <h2 class="skill-category">{{ group.category }}</h2>
        </header>
        <ul class="skill-items">
          <li v-for="skill in group.items" :key="skill" class="skill-tag">
            <span class="dot" aria-hidden="true" />
            <span class="tag-label">{{ skill }}</span>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ layout: "default" });
useHead({ title: "Skills – Maik Demuth" });

interface SkillGroup {
  category: string;
  items: string[];
}

const { data: doc } = await useAsyncData("skills", () =>
  queryCollection("pages").path("/skills").first(),
);

const skillGroups = computed(
  () => (doc.value?.skillGroups || []) as SkillGroup[],
);
</script>

<style scoped>
.skills-page {
  padding: 1rem 0 4rem;
}

.skills-header {
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

.skills-list {
  display: flex;
  flex-direction: column;
}

.skill-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  padding: 2rem 0;
  align-items: start;
  position: relative;
  transition: background 0.3s ease;
}

.skill-row + .skill-row {
}

.skill-row:not(:first-child)::before {
  content: none;
}
.skill-row:not(:first-child):hover::before {
  content: none;
}

.skill-meta {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  gap: 1rem;
}

.row-index {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.skill-category {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
  line-height: 1.2;
}

.skill-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.4;
  transition:
    color 0.2s ease,
    transform 0.25s ease;
}

.skill-tag:hover {
  color: var(--color-text);
  transform: translateY(-1px);
}

.skill-tag:hover .dot {
  background: var(--color-technobotanica);
  transform: scale(1.4);
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-text-muted);
  flex-shrink: 0;
  transition:
    background 0.2s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tag-label {
  white-space: nowrap;
}

@media (min-width: 768px) {
  .skill-row {
    grid-template-columns: 240px 1fr;
    gap: 4rem;
    padding: 2.5rem 0;
    align-items: first baseline;
  }
  .skill-meta {
    position: sticky;
    top: calc(var(--nav-height, 64px) + 2rem);
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    align-items: baseline;
    align-content: start;
  }
  .skill-category {
    font-size: 1.4rem;
  }
  .skill-items {
    /* Both columns aligned via grid 'first baseline' on .skill-row */
  }
}
</style>
