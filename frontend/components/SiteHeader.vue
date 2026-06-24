<script setup lang="ts">
// App-wide top chrome: project branding + primary navigation.
// Rendered once via layouts/default.vue.
</script>

<template>
  <header class="border-b-2 border-muted bg-white">
    <div
      class="afs-page-inner flex min-h-[60px] items-center justify-between"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-[14px] text-base no-underline"
        aria-label="Naar de homepagina"
      >
        <span>
          <span class="font-semibold tracking-[.02em] text-ink">MARAZZI</span>
          <span class="font-light text-muted"> Explainable IT</span>
        </span>
        <span class="hidden h-5 w-px bg-muted sm:inline-block" />
        <span class="hidden font-light text-muted sm:inline">Zuyd Hogeschool</span>
      </NuxtLink>
      <nav class="flex gap-6 md:gap-14">
        <a
          href="https://dilab.nl/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-base font-normal text-muted no-underline transition-colors hover:text-ink"
          >Lectoraat</a
        >
        <a
          href="https://github.com/DinandN/ai-footprint-spiegel"
          target="_blank"
          rel="noopener noreferrer"
          class="text-base font-normal text-muted no-underline transition-colors hover:text-ink"
          >Repository</a
        >
      </nav>
    </div>
  </header>
</template>
