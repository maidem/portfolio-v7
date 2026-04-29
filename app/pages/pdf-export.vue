<template>
  <div class="pdf-page">
    <header class="pdf-header">
      <h1 class="page-title">Portfolio-PDF erstellen</h1>
      <p class="lead">
        Wähle alle relevanten Abschnitte aus, die für eine kompakte
        PDF-Übersicht exportiert werden sollen
      </p>
    </header>

    <section class="selector">
      <h2 class="selector-title">Inhalte auswählen</h2>
      <div class="options">
        <label
          v-for="opt in availableOptions"
          :key="opt.id"
          class="option"
          :class="{ 'is-checked': selected.includes(opt.id) }"
        >
          <input v-model="selected" type="checkbox" :value="opt.id" />
          <span class="check" aria-hidden="true">
            <svg
              v-if="selected.includes(opt.id)"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2.5 6.5L5 9L9.5 3.5"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="option-label">
            <span class="option-title">{{ opt.label }}</span>
            <span class="option-desc">{{ opt.description }}</span>
          </span>
        </label>
      </div>

      <div class="actions">
        <button type="button" class="select-all" @click="toggleAll">
          {{ allSelected ? "Auswahl aufheben" : "Alle auswählen" }}
        </button>
        <button
          type="button"
          class="export"
          :disabled="selected.length === 0 || isPreparing"
          @click="exportPdf"
        >
          <span>{{ isPreparing ? "Wird vorbereitet…" : "PDF erstellen" }}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- Print-only document -->
    <article ref="printRoot" class="print-doc" aria-hidden="true">
      <header class="doc-head">
        <h1>Maik Demuth</h1>
        <p class="doc-sub">Portfolio · {{ today }}</p>
      </header>

      <section
        v-for="entry in printEntries"
        :key="entry.id"
        class="doc-section"
      >
        <h2>{{ entry.label }}</h2>
        <div class="doc-body" v-html="entry.html" />
      </section>

      <footer class="doc-foot">
        <span>maikdemuth.de</span>
        <span>Stand: {{ today }}</span>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({ layout: "default" });
useHead({ title: "Portfolio-PDF erstellen – Maik Demuth" });

interface Option {
  id: string;
  label: string;
  description: string;
}

const availableOptions: Option[] = [
  {
    id: "information",
    label: "Informationen",
    description: "Über mich, Arbeitsweise und Werte.",
  },
  {
    id: "projekte",
    label: "Projekte",
    description: "Ausgewählte Projektreferenzen.",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Technologien und Schwerpunkte.",
  },
  {
    id: "logbuch",
    label: "Logbuch",
    description: "Erfahrungen und aktuelle Notizen.",
  },
];

const selected = ref<string[]>([]);
const printRoot = ref<HTMLElement | null>(null);
const isPreparing = ref(false);
const printEntries = ref<{ id: string; label: string; html: string }[]>([]);

const allSelected = computed(
  () => selected.value.length === availableOptions.length,
);

const toggleAll = () => {
  selected.value = allSelected.value ? [] : availableOptions.map((o) => o.id);
};

const today = computed(() =>
  new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }),
);

const exportPdf = async () => {
  if (selected.value.length === 0) return;
  isPreparing.value = true;
  try {
    const data = await $fetch<{
      entries: { id: string; label: string; html: string }[];
    }>("/api/pdf-content", {
      query: { sections: selected.value.join(",") },
    });
    printEntries.value = data.entries;
    // Wait for DOM update before printing
    await new Promise((r) => setTimeout(r, 100));
    window.print();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    alert("PDF konnte nicht erstellt werden. Bitte erneut versuchen.");
  } finally {
    isPreparing.value = false;
  }
};
</script>

<style scoped>
.pdf-page {
  max-width: 760px;
  padding: 1rem 0 4rem;
}

.pdf-header {
  margin-bottom: 3rem;
}

.lead {
  margin-top: 1.25rem;
  max-width: 56ch;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.selector-title {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}

.options {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border);
}

.option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.option:hover {
  opacity: 0.85;
}

.option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.15rem;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  background: transparent;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.option.is-checked .check {
  border-color: var(--color-text);
  background: var(--color-technobotanica);
  color: var(--color-text);
}

.option-label {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  line-height: 1.4;
}

.option-title {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 500;
}

.option-desc {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.select-all {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.select-all:hover {
  color: var(--color-text);
}

.export {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.5rem;
  background: var(--color-text);
  color: var(--color-bg);
  border: 1px solid var(--color-text);
  border-radius: 999px;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease;
}

.export:hover:not(:disabled) {
  background: transparent;
  color: var(--color-text);
}

.export:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.export svg {
  transition: transform 0.25s ease;
}

.export:hover:not(:disabled) svg {
  transform: translateX(2px);
}

/* Print-only document — hidden on screen */
.print-doc {
  display: none;
}
</style>

<style>
/* Global print rules — must be unscoped so v-html injected children apply */
@media print {
  body * {
    visibility: hidden !important;
  }
  .print-doc,
  .print-doc * {
    visibility: visible !important;
  }
  .print-doc {
    display: block !important;
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0;
    background: #fff;
    color: #111;
    font-family: var(--font-mono, ui-monospace, monospace);
  }

  @page {
    size: A4;
    margin: 22mm 18mm 22mm 18mm;
  }

  .print-doc .doc-head {
    border-bottom: 1px solid #111;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }

  .print-doc .doc-head h1 {
    font-size: 28pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
    color: #111;
  }

  .print-doc .doc-sub {
    margin: 0.4rem 0 0;
    font-size: 9pt;
    color: #555;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .print-doc .doc-section {
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 0 0 2rem;
  }

  .print-doc .doc-section h2 {
    font-size: 14pt;
    font-weight: 700;
    margin: 0 0 0.75rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #ccc;
    color: #111;
  }

  .print-doc .doc-body {
    font-size: 10.5pt;
    line-height: 1.55;
    color: #222;
  }

  .print-doc .doc-body h1,
  .print-doc .doc-body h2,
  .print-doc .doc-body h3 {
    font-weight: 700;
    margin: 1rem 0 0.4rem;
    page-break-after: avoid;
  }
  .print-doc .doc-body h1 {
    font-size: 12pt;
  }
  .print-doc .doc-body h2 {
    font-size: 11.5pt;
  }
  .print-doc .doc-body h3 {
    font-size: 11pt;
    color: #444;
  }

  .print-doc .doc-body p {
    margin: 0 0 0.7rem;
  }

  .print-doc .doc-body ul,
  .print-doc .doc-body ol {
    margin: 0 0 0.7rem 1rem;
    padding: 0;
  }

  .print-doc .doc-body li {
    margin-bottom: 0.25rem;
  }

  .print-doc .doc-body strong {
    color: #111;
  }

  .print-doc .doc-body .meta {
    font-size: 9pt;
    color: #888;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 0.5rem;
  }

  .print-doc .doc-body .tech {
    font-size: 9.5pt;
    color: #555;
    margin-top: 0.5rem;
  }

  .print-doc .doc-body .project {
    page-break-inside: avoid;
    margin-bottom: 1.25rem;
  }

  .print-doc .doc-foot {
    position: fixed;
    bottom: 10mm;
    left: 18mm;
    right: 18mm;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #888;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-top: 1px solid #ddd;
    padding-top: 0.4rem;
  }
}
</style>
