<script setup lang="ts">
// Progress indicator for the compare flow. `current` is the 1-based active step.
// Reused on the challenger (step 1) and results (step 2) pages.

withDefaults(defineProps<{ current: number; steps?: string[] }>(), {
  steps: () => ["Vraag & Modellen", "Vergelijking"],
});
</script>

<template>
  <div class="flex items-start justify-center">
    <template v-for="(label, i) in steps" :key="label">
      <div class="flex flex-col items-center">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-[3px] border text-[25px] leading-none"
          :class="
            i + 1 === current
              ? 'border-ink bg-ink text-white'
              : 'border-muted bg-white text-muted'
          "
        >
          {{ i + 1 }}
        </div>
        <div
          class="mt-[17px] whitespace-nowrap text-base"
          :class="i + 1 === current ? 'text-ink' : 'text-muted'"
        >
          {{ label }}
        </div>
      </div>
      <div
        v-if="i < steps.length - 1"
        class="mx-[18px] mt-5 h-px w-[64px] bg-muted md:mx-8 md:w-[125px]"
      />
    </template>
  </div>
</template>
