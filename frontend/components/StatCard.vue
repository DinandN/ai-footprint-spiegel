<script setup lang="ts">
// Energy/CO2 stat card on the evolutie-ai page. Icon is either an emoji or an
// image (from public/img/evolutie-ai/).

withDefaults(
  defineProps<{
    big: string;
    lbl: string;
    sub: string;
    src: string;
    emoji?: string;
    img?: string;
    imgW?: number;
    imgH?: number;
  }>(),
  { emoji: "", img: "", imgW: 90, imgH: 90 },
);
</script>

<template>
  <div class="h-full rounded-cf bg-form p-7 text-center">
    <div class="mb-[6px] flex h-[90px] items-end justify-center">
      <span v-if="emoji" class="text-[64px] leading-none">{{ emoji }}</span>
      <img v-else-if="img" :src="img" :width="imgW" :height="imgH" alt="" />
    </div>
    <div
      class="text-[clamp(32px,3vw,48.84px)] font-medium leading-[1.05] text-black"
    >
      {{ big }}
    </div>
    <div class="mt-[10px] text-[20px] text-muted">{{ lbl }}</div>
    <div class="mt-[6px] text-base text-muted">{{ sub }}</div>
    <div class="mt-[10px] text-[12.8px] text-muted">{{ src }}</div>
  </div>
</template>
