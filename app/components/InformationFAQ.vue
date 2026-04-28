<template>
  <aside class="faq">
    <div v-if="items && items.length" class="faq-list">
      <details v-for="(item, index) in items" :key="index" class="faq-item">
        <summary class="faq-question">
          <span class="question-text">{{ item.question }}</span>
          <span class="icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 5.5L7 9.5L11 5.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </summary>
        <div class="faq-answer">
          <p>{{ item.answer }}</p>
        </div>
      </details>
    </div>
    <p v-else class="faq-empty">Keine FAQ-Einträge verfügbar.</p>
  </aside>
</template>

<script setup lang="ts">
interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items?: FAQItem[];
}

withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>

<style scoped>
.faq {
  width: 100%;
}

@media (min-width: 1024px) {
  .faq {
    position: sticky;
    top: calc(var(--nav-height, 64px) + 2rem);
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-top: 1px solid var(--color-border);
}

.faq-item:last-child {
  border-bottom: 1px solid var(--color-border);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 0;
  cursor: pointer;
  user-select: none;
  list-style: none;
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question:hover {
  color: var(--color-text-muted);
}

.question-text {
  flex: 1;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.25s ease;
}

.faq-item[open] .icon {
  transform: rotate(180deg);
  color: var(--color-text);
}

.faq-answer {
  padding: 0 0 1.25rem;
  color: var(--color-text-muted);
}

.faq-answer p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.faq-empty {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
