<script setup lang="ts">
// Placeholder visualization of the footprint metrics.
//
// Renders simple proportional bars so the data is visible without a charting
// library. The definitive visualization is part of the UI delivered later.

import type { Footprint } from "~/composables/useCompare";

const props = defineProps<{ footprint: Footprint }>();

// Reference maxima (roughly the largest model in Table 3) for bar scaling.
const MAX = { energyWh: 11, co2Grams: 4.5, waterMl: 20 };

const bars = computed(() => [
  { label: "Energie", pct: clamp(props.footprint.energyWh / MAX.energyWh) },
  { label: "CO₂", pct: clamp(props.footprint.co2Grams / MAX.co2Grams) },
  { label: "Water", pct: clamp(props.footprint.waterMl / MAX.waterMl) },
]);

function clamp(ratio: number): number {
  return Math.max(2, Math.min(100, ratio * 100));
}
</script>

<template>
  <div style="margin-top: 0.5rem">
    <div
      v-for="bar in bars"
      :key="bar.label"
      style="display: flex; align-items: center; gap: 0.5rem; margin: 0.2rem 0"
    >
      <span class="muted" style="width: 4rem; font-size: 0.85rem">{{
        bar.label
      }}</span>
      <div style="flex: 1; background: #eef0f3; border-radius: 4px">
        <div
          :style="{
            width: bar.pct + '%',
            height: '8px',
            background: '#2563eb',
            borderRadius: '4px',
          }"
        />
      </div>
    </div>
  </div>
</template>
