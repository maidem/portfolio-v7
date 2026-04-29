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
      <div v-for="group in skillGroups" :key="group.category" class="skill-row">
        <div class="skill-category">
          <span class="pill pill-dark">{{ group.category }}</span>
        </div>
        <div class="skill-items">
          <span
            v-for="skill in group.items"
            :key="skill"
            class="pill pill-muted"
            >{{ skill }}</span
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
useHead({ title: "Skills – Maik Demuth" });

interface SkillGroup {
  category: string;
  items: string[];
}

const skillGroups: SkillGroup[] = [
  {
    category: "CMS",
    items: ["TYPO3", "Storyblok", "Nuxt Content", "WordPress", "Strapi"],
  },
  {
    category: "Frontend",
    items: [
      "Vue 3",
      "Nuxt 4",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Pinia",
    ],
  },
  {
    category: "Backend",
    items: ["Node.js", "Nitro", "PHP", "REST APIs", "GraphQL"],
  },
  {
    category: "Datenbanken",
    items: ["PostgreSQL", "MySQL", "SQLite", "Redis"],
  },
  {
    category: "DevOps",
    items: ["Docker", "Coolify", "GitHub Actions", "Nginx", "Linux"],
  },
  {
    category: "Tools",
    items: ["Git", "VS Code", "Figma", "pnpm", "Vite"],
  },
  {
    category: "Sprachen",
    items: ["Deutsch", "Englisch"],
  },
];
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
  border-top: 1px solid var(--color-border);
}

.skill-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
  align-items: start;
}

.skill-category {
  display: flex;
  align-items: center;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

/* Clean tag styling – no pills */
.pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.5rem 0.75rem;
  border-radius: 0;
  line-height: 1;
  white-space: nowrap;
}

.pill-dark {
  background: transparent;
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--color-text);
}

.pill-muted {
  background: var(--color-surface);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  cursor: default;
}

.pill-muted:hover {
  color: var(--color-text);
  background: var(--color-bg);
  border-color: var(--color-text);
}

@media (min-width: 640px) {
  .skill-row {
    grid-template-columns: 140px 1fr;
    gap: 3rem;
    padding: 2.25rem 0;
  }

  .skill-category {
    padding-top: 0.125rem;
  }
}
</style>
