<script setup lang="ts">
// Hidden SVG sprite: gradient defs + rating glyphs referenced via <use href>.
// Render once per page that shows metric tiles.
</script>

<template>
  <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="gradEnergy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E2C000" />
        <stop offset="64%" stop-color="#CCAD00" />
        <stop offset="100%" stop-color="#7C6900" />
      </linearGradient>
      <linearGradient id="gradWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#5B94E9" />
        <stop offset="75%" stop-color="#4774B7" />
        <stop offset="100%" stop-color="#335383" />
      </linearGradient>
      <linearGradient id="gradCloud" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C4C4C4" />
        <stop offset="100%" stop-color="#9B9B9B" />
      </linearGradient>
      <symbol id="ic-bolt" viewBox="0 0 16 16">
        <path
          fill="url(#gradEnergy)"
          d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
        />
      </symbol>
      <symbol id="ic-drop" viewBox="0 0 16 16">
        <path
          fill="url(#gradWater)"
          d="M8 16a6 6 0 0 0 6-6c0-1.655-1.225-3.18-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6z"
        />
      </symbol>
      <symbol id="ic-cloud" viewBox="0 0 16 16">
        <path
          fill="url(#gradCloud)"
          d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
        />
      </symbol>
    </defs>
  </svg>
</template>
