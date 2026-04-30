<template>
  <div v-if="doc" class="information-page">
    <div class="content-block">
      <InformationContent :content="doc" />
    </div>
    <section class="faq-block">
      <header class="faq-header">
        <span class="faq-eyebrow">FAQ</span>
        <h2 class="faq-title">Häufige Fragen</h2>
      </header>
      <InformationFAQ :items="doc.faqItems" />
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const { data: doc } = await useAsyncData("information", () =>
  queryCollection("pages").path("/information").first(),
);

useHead({
  title: doc.value?.title || "Maik Demuth",
});
</script>

<style scoped>
.information-page {
  width: 100%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.faq-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-top: 3rem;
  border-top: 1px solid var(--color-border);
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
