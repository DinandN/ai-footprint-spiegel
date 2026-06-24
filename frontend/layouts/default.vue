<script setup lang="ts">
// Default app chrome: branded header + footer around the routed page.
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-[1920px] flex-col bg-white">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
