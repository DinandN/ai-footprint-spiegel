<script setup lang="ts">
// One provider card in the challenger grid. The card toggles whether this
// provider's currently-chosen model is part of the comparison; a dropdown picks
// which model within the provider is the active one. Selection + active-variant
// state is owned by the page (via useCompare) and passed in.

import type { Model } from "~/composables/useCompare";

const props = defineProps<{
  model: Model; // active variant (drives the logo + dropdown value)
  variants: Model[]; // all models of this provider (dropdown options)
  selected: boolean;
}>();
const emit = defineEmits<{ toggle: []; "select-variant": [id: string] }>();

// Provider → brand logo (in public/img/challenger/).
const LOGOS: Record<string, string> = {
  google: "/img/challenger/gemini.png",
  anthropic: "/img/challenger/claude.png",
  ollama: "/img/challenger/ollama.svg",
};

const logo = computed(() => LOGOS[props.model.provider]);

function onSelect(event: Event) {
  emit("select-variant", (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <div
    class="relative flex min-h-[166px] max-w-[500px] flex-[1_1_440px] flex-col rounded-cf bg-form"
  >
    <!-- Full-card toggle. Sits behind the content; the content lets clicks fall
         through (pointer-events-none) except the dropdown, which has its own. -->
    <button
      type="button"
      class="absolute inset-0 z-0 h-full w-full rounded-cf"
      :aria-pressed="selected"
      :aria-label="`Selecteer ${model.name}`"
      @click="$emit('toggle')"
    />

    <!-- Selection indicator -->
    <span
      class="pointer-events-none absolute right-[13px] top-[11px] z-10 h-5 w-5"
      aria-hidden="true"
    >
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

    <!-- Content -->
    <div
      class="pointer-events-none relative z-10 flex h-full flex-col justify-between px-[25px] pb-5 pt-[14px] text-left"
    >
      <!-- Brand logo (or name fallback) -->
      <div class="flex h-[70px] items-center">
        <img
          v-if="logo"
          :src="logo"
          :alt="model.provider"
          class="max-h-[70px] w-auto max-w-[232px] object-contain"
        />
        <span v-else class="text-[25px] text-ink">{{ model.name }}</span>
      </div>

      <!-- Model picker: dropdown when the provider has multiple models. -->
      <div class="leading-none">
        <div
          v-if="variants.length > 1"
          class="pointer-events-auto relative inline-block"
        >
          <select
            class="afs-variant-select"
            :value="model.id"
            :aria-label="`Kies een model van ${model.provider}`"
            @change="onSelect"
            @click.stop
            @mousedown.stop
          >
            <option v-for="variant in variants" :key="variant.id" :value="variant.id">
              {{ variant.name }}
            </option>
          </select>
          <svg
            class="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-primary"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1 1l5 5 5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span v-else class="text-[25px] text-ink">{{ model.name }}</span>
      </div>
    </div>
  </div>
</template>
