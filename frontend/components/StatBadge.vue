<script setup lang="ts">
// Hero KPI badge on the evolutie-ai page.

defineProps<{ num: string; cap: string; text: string; src: string }>();
</script>

<template>
  <div class="h-full rounded-cf bg-form px-6 py-[22px]">
    <div
      class="text-[clamp(24px,2.4vw,31.25px)] font-semibold leading-[1.05] text-primary"
    >
      {{ num }}
    </div>
    <div
      class="text-[clamp(18px,1.5vw,22px)] font-medium leading-[1.2] text-black"
    >
      {{ cap }}
    </div>
    <p class="afs-t-cap mb-1 mt-2">{{ text }}</p>
    <div class="afs-t-src">{{ src }}</div>
  </div>
</template>
