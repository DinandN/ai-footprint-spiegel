<script setup lang="ts">
// App-wide bottom chrome: copyright line, tagline, and social links.
// Rendered once via layouts/default.vue.

// Copyright year updates automatically (DYNAMIC: year should be generated).
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t-2 border-muted bg-white">
    <div
      class="afs-page-inner flex min-h-16 items-center justify-between gap-4 md:min-h-[50px]"
    >
      <span class="text-base text-muted">Marazzi - Explainable IT, {{ year }}©</span>
      <span class="hidden flex-1 text-center text-base text-muted md:block"
        >Samen maken we AI Duurzamer</span
      >
      <div class="flex items-center gap-[11px]">
        <a
          href="https://dilab.nl/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website"
          class="inline-flex text-icon"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/company/zuydict/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="inline-flex text-icon"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2">
            <path
              d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
            />
          </svg>
        </a>
        <a
          href="https://github.com/DinandN/ai-footprint-spiegel"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="inline-flex text-icon"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="#181717">
            <path
              d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"
            />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>
