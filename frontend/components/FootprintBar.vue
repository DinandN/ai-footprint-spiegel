<script setup lang="ts">
// One footprint metric on the per-AI detail page: a title, the big coloured
// value + unit, a progress bar scaled by `fill`, its min/max scale labels and a
// description. The colour follows the metric variant (shared app tokens).

type Variant = "energy" | "water" | "cost" | "co2";

defineProps<{
  variant: Variant;
  title: string;
  value: string;
  unit: string;
  fill: number; // bar fill, 0–100
  min: string; // scale label, left
  max: string; // scale label, right
  description: string;
}>();

const valueColor: Record<Variant, string> = {
  energy: "text-energy",
  water: "text-water",
  cost: "text-cost",
  co2: "text-ink",
};
const barColor: Record<Variant, string> = {
  energy: "bg-energy",
  water: "bg-water",
  cost: "bg-cost",
  co2: "bg-ink",
};
</script>

<template>
  <article class="flex flex-col rounded-cf bg-form p-6">
    <h3 class="text-[26px] font-medium leading-tight text-ink">{{ title }}</h3>
    <div class="mt-1 flex items-baseline gap-[6px]">
      <span class="text-[32px] font-bold leading-none" :class="valueColor[variant]">{{
        value
      }}</span>
      <span class="text-base text-ink">{{ unit }}</span>
    </div>

    <div class="mt-[18px] h-[7px] overflow-hidden rounded-full bg-skeleton">
      <div
        class="h-full rounded-full"
        :class="barColor[variant]"
        :style="{ width: `${fill}%` }"
      />
    </div>
    <div class="mt-[6px] flex justify-between text-xs text-ink">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>

    <p class="mt-4 text-sm leading-[1.45] text-muted">{{ description }}</p>
  </article>
</template>
