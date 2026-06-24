<script setup lang="ts">
// Shows one model's response and its four footprint metrics.

import type { CompareResult } from "~/composables/useCompare";

defineProps<{ result: CompareResult }>();

function fmt(value: number | undefined, digits = 2): string {
  if (value === undefined) return "–";
  return value.toFixed(digits);
}
</script>

<template>
  <article
    style="
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
    "
  >
    <header style="display: flex; justify-content: space-between">
      <strong>{{ result.model?.name ?? result.modelId }}</strong>
      <span v-if="result.cached" class="muted">uit cache</span>
    </header>

    <p v-if="!result.ok" style="color: #b91c1c">Fout: {{ result.error }}</p>

    <template v-else>
      <p style="white-space: pre-wrap">{{ result.response }}</p>

      <FootprintChart v-if="result.footprint" :footprint="result.footprint" />

      <dl
        v-if="result.footprint"
        style="
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-top: 0.75rem;
        "
      >
        <div>
          <dt class="muted">Energie</dt>
          <dd>{{ fmt(result.footprint.energyWh) }} Wh</dd>
        </div>
        <div>
          <dt class="muted">CO₂</dt>
          <dd>{{ fmt(result.footprint.co2Grams) }} g</dd>
        </div>
        <div>
          <dt class="muted">Water</dt>
          <dd>{{ fmt(result.footprint.waterMl) }} mL</dd>
        </div>
        <div>
          <dt class="muted">Kosten</dt>
          <dd>€ {{ fmt(result.footprint.costEur, 5) }}</dd>
        </div>
      </dl>
    </template>
  </article>
</template>
