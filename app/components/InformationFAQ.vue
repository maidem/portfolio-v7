<template>
  <aside class="faq">
    <div v-if="items && items.length" class="faq-list">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="faq-item"
        :class="{ 'is-open': openItems.has(index) }"
      >
        <button
          class="faq-question"
          :aria-expanded="openItems.has(index)"
          @click="toggleItem(index)"
        >
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
        </button>
        <Transition name="faq-slide">
          <div v-if="openItems.has(index)" class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </Transition>
      </div>
    </div>
    <p v-else class="faq-empty">Keine FAQ-Einträge verfügbar.</p>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";

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

const openItems = ref<Set<number>>(new Set());

const toggleItem = (index: number) => {
  if (openItems.value.has(index)) {
    openItems.value.delete(index);
  } else {
    openItems.value.add(index);
  }
  // Trigger reactivity
  openItems.value = new Set(openItems.value);
};
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
  border: none;
  background: none;
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  transition: color 0.2s ease;
  width: 100%;
  text-align: left;
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.faq-item.is-open .icon {
  transform: rotate(180deg);
  color: var(--color-text);
}

.faq-answer {
  padding: 0 0 1.25rem;
  color: var(--color-text-muted);
  overflow: hidden;
}

.faq-answer p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

/* Smooth Transitions - GPU accelerated with bounce */
.faq-slide-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.faq-slide-leave-active {
  transition:
    opacity 0.4s ease,
    max-height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.faq-slide-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.faq-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-12px);
}

.faq-answer {
  max-height: 500px;
}

.faq-empty {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.faq-empty {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
