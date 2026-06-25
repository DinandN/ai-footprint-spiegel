<script setup lang="ts">
// Switchable model header on the per-AI detail page: prev/next chevrons around
// the model logo + name, with the variant beneath. Emits prev/next so the page
// decides how to navigate between the compared models.

defineProps<{ name: string; variant: string; logo?: string }>();
const emit = defineEmits<{ prev: []; next: [] }>();
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex items-center gap-[14px]">
      <button
        type="button"
        class="px-3 text-muted transition-colors hover:text-ink"
        aria-label="Vorig model"
        @click="emit('prev')"
      >
        <svg class="h-[22px] w-[13px]" viewBox="0 0 13 22" fill="none" aria-hidden="true">
          <path
            d="M11 1 2 11l9 10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Vaste box (object-contain): elk model-logo neemt dezelfde ruimte in,
           zodat de kop niet verspringt bij prev/next. -->
      <img
        v-if="logo"
        :src="logo"
        :alt="name"
        class="h-[40px] w-[150px] object-contain sm:h-[60px] sm:w-[220px]"
      />
      <!-- Naam alleen als tekst tonen wanneer er geen logo is (het logo bevat de merknaam al). -->
      <span v-else class="text-[34px] font-normal leading-none text-ink sm:text-[52px]">{{ name }}</span>

      <button
        type="button"
        class="px-3 text-muted transition-colors hover:text-ink"
        aria-label="Volgend model"
        @click="emit('next')"
      >
        <svg class="h-[22px] w-[13px]" viewBox="0 0 13 22" fill="none" aria-hidden="true">
          <path
            d="m2 1 9 10-9 10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <span class="mt-1 text-[23px] text-muted">{{ variant }}</span>
  </div>
</template>
