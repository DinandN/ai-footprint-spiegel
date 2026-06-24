<script setup lang="ts">
// One selectable model card in the challenger grid. The whole card is a toggle;
// selection state is owned by the page (via useCompare) and passed in.

import type { Model } from "~/composables/useCompare";

const props = defineProps<{ model: Model; selected: boolean }>();
defineEmits<{ toggle: [] }>();

// Provider → brand logo (in public/img/challenger/). Local (ollama) models have
// no brand logo; they fall back to the model name as text.
// TODO: chatgpt.png is unused (no OpenAI model in the dataset).
// TODO: add brand logos for local (ollama) models if desired.
const LOGOS: Record<string, string> = {
  google: "/img/challenger/gemini.png",
  anthropic: "/img/challenger/claude.png",
};

const logo = computed(() => LOGOS[props.model.provider]);
</script>

<template>
  <button
    type="button"
    class="relative flex min-h-[166px] max-w-[500px] flex-[1_1_440px] flex-col justify-between rounded-cf bg-form px-[25px] pb-5 pt-[14px] text-left"
    :aria-pressed="selected"
    @click="$emit('toggle')"
  >
    <!-- Selection indicator -->
    <span class="absolute right-[13px] top-[11px] h-5 w-5" aria-hidden="true">
      <svg v-if="selected" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="3" fill="#0d0d0d" />
        <path
          d="M5 10.5l3 3 7-7"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg v-else viewBox="0 0 20 20" fill="none">
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="2.5"
          fill="#ffffff"
          stroke="#666666"
        />
      </svg>
    </span>

    <!-- Brand logo (or name fallback) -->
    <div class="flex h-[70px] items-center">
      <img
        v-if="logo"
        :src="logo"
        :alt="model.name"
        class="max-h-[70px] w-auto max-w-[232px] object-contain"
      />
      <span v-else class="text-[25px] text-ink">{{ model.name }}</span>
    </div>

    <!-- Model name -->
    <div class="leading-none">
      <span class="inline-flex items-center gap-2 text-[25px] text-ink">
        Model
        <!-- TODO: variant-dropdown niet gewijzigd; elke kaart is één concreet model. -->
        <svg class="h-4 w-2 flex-none text-primary" viewBox="0 0 8 16" fill="none">
          <path
            d="M1 1l6 7-6 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <div class="mt-2 text-base text-ink">{{ model.name }}</div>
    </div>
  </button>
</template>
