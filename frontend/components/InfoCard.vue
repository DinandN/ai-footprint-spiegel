<script setup lang="ts">
// Generic information card used in the "Feiten" and "Het process van je prompt"
// sections: a bold title, body copy and an optional default slot for extra
// content (e.g. an SDG badge). Positioned relative so slotted content can be
// absolutely placed in a corner.

defineProps<{ title: string; body: string }>();
</script>

<template>
  <article class="relative min-h-[200px] rounded-cf bg-form p-6">
    <h3 class="text-2xl font-semibold leading-snug text-ink">{{ title }}</h3>
    <p class="mt-[14px] text-sm leading-[1.5] text-muted">{{ body }}</p>
    <slot />
  </article>
</template>
