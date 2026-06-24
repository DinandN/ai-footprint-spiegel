<script setup lang="ts">
// Result screen: shows each model's response next to its footprint metrics.

const { prompt, results, error, resetSession } = useCompare();

async function onReset() {
  await resetSession();
  await navigateTo("/");
}
</script>

<template>
  <main class="container">
    <p class="muted">Prompt: "{{ prompt }}"</p>

    <p v-if="error" style="color: #b91c1c">{{ error }}</p>

    <div v-if="results.length" style="display: grid; gap: 1rem">
      <ModelCard
        v-for="result in results"
        :key="result.modelId"
        :result="result"
      />
    </div>
    <p v-else class="muted">Nog geen resultaten. Start een vergelijking.</p>

    <button style="margin-top: 1.5rem; padding: 0.75rem 1.5rem" @click="onReset">
      Opnieuw beginnen
    </button>
  </main>
</template>
