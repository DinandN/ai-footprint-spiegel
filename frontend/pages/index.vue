<script setup lang="ts">
// Start screen: enter a prompt, pick models, then run the comparison.

const { models, prompt, selectedIds, loading, loadModels, toggleModel, runCompare } =
  useCompare();

await loadModels();

async function onCompare() {
  await runCompare();
  await navigateTo("/vergelijking");
}

const canCompare = computed(
  () => prompt.value.trim().length > 0 && selectedIds.value.length > 0,
);
</script>

<template>
  <main class="container">
    <section>
      <label for="prompt"><strong>Je prompt</strong></label>
      <textarea
        id="prompt"
        v-model="prompt"
        rows="4"
        placeholder="Stel hier je vraag aan de AI-modellen..."
        style="width: 100%; padding: 0.75rem; margin-top: 0.5rem"
      />
    </section>

    <section style="margin-top: 1.5rem">
      <strong>Kies modellen om te vergelijken</strong>
      <ul style="list-style: none; padding: 0; margin-top: 0.5rem">
        <li v-for="model in models" :key="model.id" style="margin: 0.25rem 0">
          <label>
            <input
              type="checkbox"
              :checked="selectedIds.includes(model.id)"
              @change="toggleModel(model.id)"
            />
            {{ model.name }}
            <span class="muted">({{ model.provider }} · {{ model.type }})</span>
          </label>
        </li>
      </ul>
    </section>

    <button
      :disabled="!canCompare || loading"
      style="margin-top: 1rem; padding: 0.75rem 1.5rem"
      @click="onCompare"
    >
      {{ loading ? "Bezig..." : "Vergelijk" }}
    </button>
  </main>
</template>
