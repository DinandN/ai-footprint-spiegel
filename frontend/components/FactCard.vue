<script setup lang="ts">
// One statistic in the facts band: an (optionally highlighted) heading, body
// text, a source line, and an optional CTA passed via the default slot.

withDefaults(
  defineProps<{
    highlight?: string;
    title: string;
    body: string;
    source: string;
  }>(),
  { highlight: "" },
);
</script>

<template>
  <div>
    <h3 class="mb-[18px] text-[25px] font-normal leading-[1.1] text-ink">
      <span v-if="highlight" class="text-[31.25px]">{{ highlight }}</span>
      {{ title }}
    </h3>
    <p class="mb-4 max-w-full text-base leading-[1.3] text-muted md:max-w-[52%]">
      {{ body }}
    </p>
    <p class="m-0 text-[12.8px] font-normal text-muted">
      {{ source }}
    </p>
    <slot />
  </div>
</template>
