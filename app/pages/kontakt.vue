<template>
  <div class="contact-page">
    <header class="contact-header">
      <h1 class="page-title">Kontakt</h1>
      <p class="lead">
        Sie haben ein Projekt im Kopf oder möchten zusammenarbeiten? Schreiben
        Sie mir — ich melde mich zeitnah zurück.
      </p>
    </header>

    <form
      ref="formRef"
      class="contact-form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <!-- Honeypot -->
      <div class="hp" aria-hidden="true">
        <label>
          Website
          <input
            v-model="form.website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            data-mosparo-ignore
          />
        </label>
      </div>

      <div class="row">
        <div class="field">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            name="name"
            autocomplete="name"
            required
            :disabled="status === 'sending'"
          />
        </div>

        <div class="field">
          <label for="email">E-Mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            name="email"
            autocomplete="email"
            required
            :disabled="status === 'sending'"
          />
        </div>
      </div>

      <div class="field">
        <label for="subject">Betreff</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          name="subject"
          :disabled="status === 'sending'"
        />
      </div>

      <div class="field">
        <label for="message">Nachricht</label>
        <textarea
          id="message"
          v-model="form.message"
          rows="6"
          name="message"
          required
          :disabled="status === 'sending'"
        />
      </div>

      <!-- Mosparo anti-spam widget (client-side only, requires MOSPARO_URL env) -->
      <div v-if="mosparoEnabled" class="mosparo-wrapper">
        <div ref="mosparoContainer"></div>
      </div>

      <!-- Datenschutz Pflichtfeld -->
      <div class="field field-check">
        <label class="check-label">
          <input
            v-model="privacyAccepted"
            type="checkbox"
            data-mosparo-ignore
            :disabled="status === 'sending'"
          />
          <span>
            Ich habe die
            <NuxtLink to="/datenschutz" class="check-link"
              >Datenschutzerklärung</NuxtLink
            >
            gelesen und bin einverstanden.
          </span>
        </label>
      </div>

      <div class="actions">
        <button
          type="submit"
          class="submit"
          :disabled="status === 'sending' || !privacyAccepted"
        >
          <span>{{
            status === "sending" ? "Wird gesendet…" : "Nachricht senden"
          }}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <p
          v-if="status === 'success'"
          class="status status--success"
          role="status"
        >
          Vielen Dank — Ihre Nachricht wurde gesendet.
        </p>
        <p
          v-else-if="status === 'error'"
          class="status status--error"
          role="alert"
        >
          {{ errorMessage || "Senden fehlgeschlagen. Bitte erneut versuchen." }}
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from "vue";

definePageMeta({ layout: "default" });
useHead({ title: "Kontakt – Maik Demuth" });

const config = useRuntimeConfig();
const mosparoEnabled = computed(() => !!config.public.mosparoUrl);
const mosparoContainer = ref<HTMLElement | null>(null);
const formRef = ref<HTMLFormElement | null>(null);

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "", // honeypot
});

const privacyAccepted = ref(false);
const status = ref<"idle" | "sending" | "success" | "error">("idle");
const errorMessage = ref("");

// Mosparo widget — browser-only, initialised after mount (nuxt4-patterns: onMounted for client APIs)
onMounted(() => {
  if (!mosparoEnabled.value) return;

  const initWidget = () => {
    const container = mosparoContainer.value;
    if (!container) {
      console.warn("Mosparo: container not ready yet");
      return false;
    }
    if (!(window as any).mosparo) {
      console.warn("Mosparo: mosparo lib not loaded");
      return false;
    }
    try {
      new (window as any).mosparo(
        container,
        config.public.mosparoUrl,
        config.public.mosparoUuid,
        config.public.mosparoPublicKey,
        { loadCssFile: true },
      );
      console.log("Mosparo widget initialized successfully");
      return true;
    } catch (e) {
      console.error("Mosparo init failed:", e);
      return false;
    }
  };

  // Try with increasing delays
  const tryInit = (delay: number, retries: number) => {
    setTimeout(() => {
      if (!initWidget() && retries > 0) {
        tryInit(delay * 1.5, retries - 1);
      }
    }, delay);
  };

  if ((window as any).mosparo) {
    tryInit(50, 3);
    return;
  }

  const script = document.createElement("script");
  script.src = `${config.public.mosparoUrl}/build/mosparo-frontend.js`;
  script.onerror = () => console.error("Failed to load Mosparo script");
  script.onload = () => {
    console.log("Mosparo script loaded");
    tryInit(50, 3);
  };
  document.head.appendChild(script);
});

const onSubmit = async () => {
  if (!privacyAccepted.value) {
    status.value = "error";
    errorMessage.value = "Bitte akzeptieren Sie die Datenschutzerklärung.";
    return;
  }

  // Read tokens injected as hidden inputs by the Mosparo widget
  let mosparoSubmitToken = "";
  let mosparoValidationToken = "";

  if (mosparoEnabled.value && formRef.value) {
    mosparoSubmitToken =
      formRef.value.querySelector<HTMLInputElement>(
        '[name="_mosparo_submitToken"]',
      )?.value ?? "";
    mosparoValidationToken =
      formRef.value.querySelector<HTMLInputElement>(
        '[name="_mosparo_validationToken"]',
      )?.value ?? "";

    if (!mosparoSubmitToken || !mosparoValidationToken) {
      status.value = "error";
      errorMessage.value = "Bitte schließen Sie die Sicherheitsüberprüfung ab.";
      return;
    }
  }

  status.value = "sending";
  errorMessage.value = "";
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: { ...form, mosparoSubmitToken, mosparoValidationToken },
    });
    status.value = "success";
    form.name = "";
    form.email = "";
    form.subject = "";
    form.message = "";
    privacyAccepted.value = false;
  } catch (err: any) {
    status.value = "error";
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || "";
  }
};
</script>

<style scoped>
.contact-page {
  max-width: 720px;
  padding: 1rem 0 4rem;
}

.contact-header {
  margin-bottom: 3rem;
}

.lead {
  margin-top: 1.25rem;
  max-width: 56ch;
  color: var(--color-text-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}

@media (min-width: 640px) {
  .row {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.75rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  font-family: inherit;
  font-size: 1rem;
  color: var(--color-text);
  line-height: 1.5;
  transition: border-color 0.25s ease;
  resize: vertical;
}

.field textarea {
  min-height: 8rem;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-bottom-color: var(--color-technobotanica);
}

.field input:disabled,
.field textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions {
  display: flex;
  flex-wrap: wrap-reverse;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.actions .status {
  margin-right: auto;
}

.submit {
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
    color 0.25s ease,
    transform 0.25s ease;
}

.submit:hover:not(:disabled) {
  background: transparent;
  color: var(--color-text);
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit svg {
  transition: transform 0.25s ease;
}

.submit:hover:not(:disabled) svg {
  transform: translateX(2px);
}

.status {
  margin: 0;
  font-size: 0.85rem;
}

.status--success {
  color: var(--color-text);
}

.status--success::before {
  content: "";
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  background: var(--color-technobotanica);
  border-radius: 999px;
}

.status--error {
  color: #b91c1c;
}

/* Honeypot field (hidden from users, visible to bots) */
.hp {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Mosparo container */
.mosparo-wrapper {
  margin-top: 0.25rem;
}

/* Datenschutz Pflichtcheckbox */
.field-check .check-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1.6;
}

.field-check input[type="checkbox"] {
  flex-shrink: 0;
  width: auto;
  margin-top: 0.2rem;
  accent-color: var(--color-technobotanica);
  cursor: pointer;
  border: none;
  border-bottom: none;
  padding: 0;
}

.check-link {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: var(--color-technobotanica);
  text-underline-offset: 2px;
}

.check-link:hover {
  opacity: 0.7;
}
</style>
