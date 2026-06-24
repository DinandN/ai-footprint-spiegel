<script setup lang="ts">
// One model's result: a summary card (logo, summed score, expandable response)
// plus its four metric tiles.

import type { RowVm } from "~/utils/results";

defineProps<{ row: RowVm }>();

const expanded = ref(false);
</script>

<template>
  <article class="flex flex-wrap items-stretch gap-12 xl:flex-nowrap">
    <!-- Left summary -->
    <div
      class="flex min-h-[202px] w-full flex-col rounded-cf bg-form px-[26px] pb-5 pt-[18px] xl:max-w-[600px] xl:flex-[1_1_560px]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex h-[70px] items-center">
          <img
            v-if="row.logo"
            :src="row.logo"
            :alt="row.name"
            class="max-h-[70px] w-auto max-w-[232px] object-contain"
          />
          <span v-else class="text-[25px] text-ink">{{ row.name }}</span>
        </div>
        <div class="text-right">
          <span class="text-base font-bold text-ink">Gesummeerde Score</span>
          <!-- TODO: echte duurzaamheidsscore komt uit de back-end (Technical Design). -->
          <span class="mt-1 block text-[48px] font-bold leading-none text-ink sm:text-[61px]">–</span>
        </div>
      </div>

      <div v-if="row.ok" class="mt-[22px]">
        <button
          type="button"
          class="inline-flex items-center gap-[10px] text-[25px] leading-none text-ink"
          @click="expanded = !expanded"
        >
          Respons
          <svg
            class="h-4 w-[9px] flex-none transition-transform"
            :class="{ 'rotate-90': expanded }"
            viewBox="0 0 8 16"
            fill="none"
          >
            <path
              d="M1 1l6 7-6 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <p
          class="mt-2 max-w-[448px] whitespace-pre-wrap text-base leading-[1.2] text-muted"
          :class="expanded ? '' : 'line-clamp-3'"
        >
          {{ row.response }}
        </p>
      </div>
      <p v-else class="mt-[22px] text-base text-error">Fout: {{ row.error }}</p>
    </div>

    <!-- Right metric tiles -->
    <div
      v-if="row.ok"
      class="flex w-full flex-wrap justify-center gap-4 xl:w-auto xl:flex-none xl:flex-nowrap xl:justify-end xl:gap-[33px]"
    >
      <MetricTile v-for="tile in row.tiles" :key="tile.key" :tile="tile" />
    </div>
  </article>
</template>
