<script setup lang="ts">
// One metric tile: label, an icon row whose count scales with the value, a
// human comparison and the raw value. Emphasized when its metric is the active
// filter; inverted when it is the champion (lowest value for that metric).

import type { TileVm } from "~/utils/results";

defineProps<{ tile: TileVm }>();
</script>

<template>
  <div
    class="flex min-h-[202px] w-[125px] flex-col items-center rounded-cf px-[6px] pb-4 pt-3 text-center transition-colors"
    :class="[
      tile.champion ? 'bg-primary text-white' : 'bg-form',
      tile.active && !tile.champion ? 'ring-2 ring-primary' : '',
    ]"
  >
    <span
      class="text-base leading-[1.2]"
      :class="tile.champion ? 'text-white' : 'text-ink'"
      >{{ tile.label }}</span
    >

    <!-- Iconen in een compact, gecentreerd raster (max. 3 koloms, auto-breedte
         zodat ze dicht op elkaar staan). place-content-center houdt het blok
         gecentreerd en voorkomt dat de iconen uitrekken als de tegel hoger wordt. -->
    <div
      class="my-[10px] grid flex-1 grid-cols-[repeat(3,auto)] place-content-center gap-x-[6px] gap-y-[5px]"
    >
      <template v-for="n in tile.count" :key="n">
        <IconWallet v-if="tile.iconKind === 'coin'" class="h-[22px] w-[22px]" />
        <svg
          v-else
          class="block"
          :class="{
            'h-[26px] w-4': tile.iconKind === 'bolt',
            'h-6 w-[22px]': tile.iconKind === 'drop',
            'h-6 w-7 drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)]':
              tile.iconKind === 'cloud',
          }"
          viewBox="0 0 16 16"
        >
          <use :href="`#${tile.iconId}`" />
        </svg>
      </template>
    </div>

    <span
      class="text-base leading-[1.15]"
      :class="tile.champion ? 'text-white' : 'text-ink'"
      >{{ tile.compareText }}</span
    >
    <span
      class="mt-[3px] text-[12.8px]"
      :class="tile.champion ? 'text-white/90' : 'text-muted'"
      >{{ tile.valueText }}</span
    >
  </div>
</template>
