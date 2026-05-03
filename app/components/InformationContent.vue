<template>
  <section class="info">
    <div class="info-body">
      <ContentRenderer :value="content" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  content: any;
}

const props = defineProps<Props>();
</script>

<style scoped>
.info {
  flex: 1;
  min-width: 0;
}

/* The h1 is rendered by information.vue above the grid — hide the duplicate from ContentRenderer */
.info-body :deep(h1) {
  display: none;
}

.info-body {
  width: 100%;
}

@media (min-width: 900px) {
  .info-body {
    column-count: 2;
    column-gap: 3.5rem;
  }
  .info-body :deep(:where(h2, h3, h4, h5, h6)) {
    break-after: avoid-column;
    margin-top: 0;
  }
  .info-body :deep(:where(p, ul, ol)) {
    break-inside: avoid-column;
  }
  .info-body :deep(> *:first-child) {
    margin-top: 0;
  }
}

/* Nuxt Content auto-wraps headings in anchor links — keep them in heading color */
:deep(h1) a,
:deep(h2) a,
:deep(h3) a,
:deep(h4) a,
:deep(h5) a,
:deep(h6) a {
  color: inherit;
  text-decoration: inherit;
}

:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  color: var(--color-text-muted);
}

:deep(h2) {
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

:deep(h3) {
  font-size: 1.15rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

:deep(p) {
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: 1rem;
}

:deep(ul) {
  list-style-position: inside;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

:deep(li) {
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  :deep(h2) {
    font-size: 1.5rem;
  }
}
</style>
