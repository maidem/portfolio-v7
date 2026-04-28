<template>
  <div v-if="doc" class="information-page">
    <div class="content-wrapper">
      <InformationContent :content="doc" />
      <InformationFAQ :items="doc.faqItems" />
    </div>
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
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}
</style>
