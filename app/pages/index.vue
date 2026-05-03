<template>
  <div v-if="doc" class="information-page">
    <h1 class="page-title">{{ doc.title }}</h1>
    <div class="content-block">
      <InformationContent :content="doc" />
    </div>
    <section class="faq-block">
      <header class="faq-header">
        <h2 class="faq-title">Häufige Fragen</h2>
      </header>
      <InformationFAQ :items="faqDoc?.faqItems" />
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const { data: doc } = await useAsyncData("information", () =>
  queryCollection("pages").path("/information").first(),
);

const { data: faqDoc } = await useAsyncData("faq", () =>
  queryCollection("pages").path("/faq").first(),
);

useHead({
  title: doc.value?.title || "Maik Demuth",
});
</script>

<style scoped>
.information-page {
  width: 100%;
  padding: 1rem 0 4rem;
}

.information-page > .page-title {
  margin-bottom: 2rem;
}

.content-block {
  margin-top: 1.25rem;
  margin-bottom: 5rem;
}

.faq-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-top: 3rem;
}

.faq-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.faq-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

@media (min-width: 900px) {
  .faq-block {
    grid-template-columns: minmax(220px, 1fr) 3fr;
    gap: 4rem;
    align-items: start;
  }
  .faq-header {
    position: sticky;
    top: calc(var(--nav-height, 64px) + 2rem);
  }
}
</style>
