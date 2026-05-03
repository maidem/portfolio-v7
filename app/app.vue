<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="bg-fill" aria-hidden="true"></div>
    <div class="perspective-grid" aria-hidden="true">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs></defs>
        <!-- Base lines in border color -->
        <g stroke="var(--color-border)" stroke-width="0.6" fill="none">
          <!-- Radiating lines from VP (720, 0) -->
          <line x1="720" y1="0" x2="0" y2="900" />
          <line x1="720" y1="0" x2="120" y2="900" />
          <line x1="720" y1="0" x2="240" y2="900" />
          <line x1="720" y1="0" x2="360" y2="900" />
          <line x1="720" y1="0" x2="480" y2="900" />
          <line x1="720" y1="0" x2="600" y2="900" />
          <line x1="720" y1="0" x2="720" y2="900" />
          <line x1="720" y1="0" x2="840" y2="900" />
          <line x1="720" y1="0" x2="960" y2="900" />
          <line x1="720" y1="0" x2="1080" y2="900" />
          <line x1="720" y1="0" x2="1200" y2="900" />
          <line x1="720" y1="0" x2="1320" y2="900" />
          <line x1="720" y1="0" x2="1440" y2="900" />
          <!-- Horizontal lines (perspective spaced, clipped to grid triangle) -->
          <line x1="688" y1="40" x2="752" y2="40" />
          <line x1="644" y1="95" x2="796" y2="95" />
          <line x1="580" y1="175" x2="860" y2="175" />
          <line x1="488" y1="290" x2="952" y2="290" />
          <line x1="360" y1="450" x2="1080" y2="450" />
          <line x1="192" y1="660" x2="1248" y2="660" />
          <line x1="24" y1="870" x2="1416" y2="870" />
        </g>
        <!-- Cyan overlay — same lines, low opacity; CSS mask fades both groups together -->
        <g stroke="#03ffd0" stroke-width="0.8" stroke-opacity="0.3" fill="none">
          <line x1="720" y1="0" x2="0" y2="900" />
          <line x1="720" y1="0" x2="120" y2="900" />
          <line x1="720" y1="0" x2="240" y2="900" />
          <line x1="720" y1="0" x2="360" y2="900" />
          <line x1="720" y1="0" x2="480" y2="900" />
          <line x1="720" y1="0" x2="600" y2="900" />
          <line x1="720" y1="0" x2="720" y2="900" />
          <line x1="720" y1="0" x2="840" y2="900" />
          <line x1="720" y1="0" x2="960" y2="900" />
          <line x1="720" y1="0" x2="1080" y2="900" />
          <line x1="720" y1="0" x2="1200" y2="900" />
          <line x1="720" y1="0" x2="1320" y2="900" />
          <line x1="720" y1="0" x2="1440" y2="900" />
        </g>
      </svg>
    </div>
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const pageTransition = {
  name: "page",
  mode: "out-in" as const,
  onAfterLeave() {
    window.scrollTo({ top: 0, behavior: "instant" });
  },
};
</script>

<style>
@import "./assets/css/fonts.css";
@import "./assets/css/global.css";

.bg-fill {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-color: var(--color-bg);
  pointer-events: none;
}

.perspective-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  -webkit-mask-image:
    linear-gradient(
      to right,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0%,
      black 25%,
      black 75%,
      transparent 100%
    );
  -webkit-mask-composite: destination-in;
  mask-image:
    linear-gradient(
      to right,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0%,
      black 25%,
      black 75%,
      transparent 100%
    );
  mask-composite: intersect;
}

@media (max-width: 639px) {
  .perspective-grid {
    display: none;
  }
}

.perspective-grid svg {
  width: 100%;
  height: 100%;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

html.dark .perspective-grid svg {
  opacity: 0.22;
}
</style>
