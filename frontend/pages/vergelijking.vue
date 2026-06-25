<script setup lang="ts">
// Step 2 of the compare flow: the results. Each model gets a summary card and
// four metric tiles; a metric filter emphasizes a column and marks the champion
// (lowest value for that metric). Reads results from useCompare (set on step 1).

import type { MetricKey } from "~/utils/results";

const { results, error } = useCompare();

const activeMetric = ref<MetricKey | "all">("all");

const TABS: { key: MetricKey | "all"; label: string }[] = [
  { key: "all", label: "Alles (overzicht)" },
  { key: "energy", label: "Energie" },
  { key: "water", label: "Water" },
  { key: "co2", label: "CO2" },
  { key: "cost", label: "Kosten" },
];

// The four metric tabs (without "all") align above the four metric tiles.
const metricTabs = TABS.filter((t) => t.key !== "all");

const rows = computed(() => buildResultRows(results.value, activeMetric.value));

async function onBack() {
  await navigateTo("/challenger");
}
</script>

<template>
  <section class="afs-page-inner pb-20 pt-8 text-center lg:pt-10">
    <MetricIconDefs />

    <!-- Stepper: stap 2 (Vergelijking) actief -->
    <Stepper :current="2" class="mb-8 lg:mb-[42px]" />

    <h1 class="afs-section-title">One AI to Rule Them All</h1>
    <p class="afs-section-sub mt-[6px] max-w-[760px]">
      Drie modellen, een winnaar; die kies jij. Kies jouw champion op basis van
      een gekozen metric
    </p>

    <template v-if="rows.length">
      <div class="mx-auto mt-7 max-w-[1250px] text-left lg:mt-[33px]">
        <!-- Metric-filters: 'Alles' rechts uitgelijnd boven de respons-kaart; de
             vier metric-tabs rechts, uitgelijnd boven hun tegels (zelfde breedte
             + gap als de ResultRow-metrics). -->
        <div class="mb-7 flex flex-wrap items-center gap-12 xl:flex-nowrap">
          <div class="flex w-full justify-end xl:max-w-[600px] xl:flex-[1_1_560px]">
            <button
              type="button"
              class="afs-metric-tab"
              :class="{ 'afs-metric-tab--active': activeMetric === 'all' }"
              @click="activeMetric = 'all'"
            >
              Alles (overzicht)
            </button>
          </div>
          <div
            class="flex w-full flex-wrap justify-center gap-4 xl:w-auto xl:flex-none xl:flex-nowrap xl:justify-end xl:gap-[33px]"
          >
            <button
              v-for="tab in metricTabs"
              :key="tab.key"
              type="button"
              class="afs-metric-tab w-[125px]"
              :class="{ 'afs-metric-tab--active': activeMetric === tab.key }"
              @click="activeMetric = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Model-rijen -->
        <div class="flex flex-col gap-[23px]">
          <ResultRow v-for="row in rows" :key="row.modelId" :row="row" />
        </div>

        <!-- Onderste acties -->
        <div class="mt-[30px] flex flex-col gap-4 md:flex-row md:justify-between">
          <button type="button" class="afs-btn-cf afs-btn-cf-back" @click="onBack">
            <svg
              class="h-[22px] w-[22px] flex-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 12H5" />
              <path d="M11 5l-7 7 7 7" />
            </svg>
            <span>Terug Naar Antwoorden</span>
          </button>
          <NuxtLink to="/vergelijking-per-ai" class="afs-btn-cf afs-btn-cf-primary">
            <span>Vergelijk Per AI</span>
            <IconArrow class="h-[22px] w-[22px] flex-none" />
          </NuxtLink>
        </div>
      </div>
    </template>

    <!-- Lege staat -->
    <div v-else class="mx-auto mt-10 max-w-[600px]">
      <p v-if="error" class="mb-3 text-base text-error">{{ error }}</p>
      <p class="text-muted">Nog geen resultaten. Start een vergelijking.</p>
      <div class="mt-6 flex justify-center">
        <NuxtLink to="/challenger" class="afs-btn-cf afs-btn-cf-primary">
          <span>Naar de vergelijking</span>
          <IconArrow class="h-[22px] w-[22px] flex-none" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
