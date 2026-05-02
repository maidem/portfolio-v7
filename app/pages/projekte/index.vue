<template>
  <div class="projects-page">
    <header class="projects-header">
      <h1 class="page-title">Projekte</h1>
      <p class="lead">
        Eine kuratierte Auswahl aktueller Arbeiten — von der Architektur bis zur
        Umsetzung. Jedes Projekt steht für sorgfältiges Handwerk und klare
        Kommunikation.
      </p>
    </header>

    <section v-if="projects && projects.length" class="projects-list">
      <article
        v-for="(project, i) in topProjects"
        :key="project.slug"
        class="project"
      >
        <div class="project-index">{{ String(i + 1).padStart(2, "0") }}</div>

        <div class="project-body">
          <h2 class="project-title">
            <NuxtLink :to="projectPath(project)">{{ project.title }}</NuxtLink>
          </h2>
          <p v-if="project.description" class="project-desc">
            {{ project.description }}
          </p>

          <ul
            v-if="project.technologies && project.technologies.length"
            class="tech-list"
          >
            <li v-for="tech in project.technologies" :key="tech" class="tech">
              {{ tech }}
            </li>
          </ul>

          <NuxtLink :to="projectPath(project)" class="more">
            <span>Mehr erfahren</span>
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
        </div>
      </article>
    </section>

    <p v-else class="empty">Aktuell sind keine Projekte verfügbar.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ layout: "default" });
useHead({ title: "Projekte – Maik Demuth" });

const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("projects").order("date", "DESC").all(),
);

const topProjects = computed(() => (projects.value || []).slice(0, 3));

const projectPath = (project: any) => `/projekte/${project.slug}`;
</script>

<style scoped>
.projects-page {
  padding: 1rem 0 4rem;
}
.projects-header {
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
.projects-list {
  display: flex;
  flex-direction: column;
}
.project {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  padding: 2.25rem 0;
}
.project + .project {
}
.project-index {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
  padding-top: 0;
}
.project-body {
  max-width: 60ch;
}
.project-title {
  margin: 0 0 1rem;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.project-title a {
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
.project-title a:hover {
  background-size: 100% 0.12em;
}
.project-desc {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.7;
}
.tech-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
}
.tech {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
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
@media (min-width: 640px) {
  .project {
    grid-template-columns: 4rem 1fr;
    gap: 2rem;
    padding: 3rem 0;
  }
  .project-index {
    padding-top: 0.6rem;
  }
}
</style>
