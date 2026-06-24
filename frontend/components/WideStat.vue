<script setup lang="ts">
// Wide economic-impact stat next to the market-growth chart.

defineProps<{ big: string; lbl: string; src: string }>();
</script>

<template>
  <div class="rounded-cf bg-form px-7 py-[22px]">
    <div
      class="text-[clamp(34px,3vw,48.84px)] font-medium leading-none text-black"
    >
      {{ big }}
    </div>
    <div class="mt-2 text-[clamp(18px,1.4vw,25px)] text-muted">{{ lbl }}</div>
    <div class="mt-1 text-base text-muted">{{ src }}</div>
  </div>
</template>
