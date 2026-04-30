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
          <span class="q-index" aria-hidden="true">{{
            String(index + 1).padStart(2, "0")
          }}</span>
          <span class="question-text">{{ item.question }}</span>
          <span class="icon" aria-hidden="true">
            <!-- Plus when closed -->
            <svg
              v-if="!openItems.has(index)"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <line
                x1="7"
                y1="2"
                x2="7"
                y2="12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <line
                x1="2"
                y1="7"
                x2="12"
                y2="7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <!-- Minus when open -->
            <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line
                x1="2"
                y1="7"
                x2="12"
                y2="7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>
        <Transition
          name="faq-slide"
          @enter="onEnter"
          @after-enter="onAfterEnter"
          @leave="onLeave"
        >
          <div v-if="openItems.has(index)" class="faq-answer-wrapper">
            <div class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
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

// Smooth height animation hooks
const onEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "0";
  element.style.opacity = "0";
  // Force reflow
  void element.offsetHeight;
  element.style.height = `${element.scrollHeight}px`;
  element.style.opacity = "1";
};

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "";
  element.style.opacity = "";
};

const onLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = `${element.scrollHeight}px`;
  element.style.opacity = "1";
  // Force reflow
  void element.offsetHeight;
  element.style.height = "0";
  element.style.opacity = "0";
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
  gap: 0.25rem;
}

.faq-item {
  border: none;
}

.faq-item + .faq-item {
  margin-top: 0.25rem;
}

.faq-question {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  cursor: pointer;
  user-select: none;
  border: none;
  background: none;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  transition: color 0.2s ease;
  width: 100%;
  text-align: left;
}

.q-index {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  min-width: 1.75rem;
  transition: color 0.2s ease;
}

.faq-item.is-open .q-index {
  color: var(--color-technobotanica);
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
  transition: color 0.2s ease;
}

.faq-item.is-open .icon {
  color: var(--color-text);
}

.faq-answer-wrapper {
  overflow: hidden;
}

.faq-answer {
  padding: 0 0 1.5rem calc(1.75rem + 1.5rem);
  color: var(--color-text-muted);
}

.faq-answer p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--color-text-muted);
  max-width: 65ch;
}

/* Smooth height transitions via JS hooks */
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition:
    height 0.35s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.3s ease;
  overflow: hidden;
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
