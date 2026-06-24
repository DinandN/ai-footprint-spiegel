<script setup lang="ts">
// Decorative mock of the AI-process flow shown beside the hero copy:
// a faux prompt input (loading skeleton), an "AI Denkt..." pill on a dashed
// connector, and a result card with four (static) footprint metrics.
// Purely illustrative — the real comparison lives on /challenger.

const metrics = [
  {
    key: "energy",
    label: "Energie",
    value: "0.001",
    unit: "Wh",
    note: "Aprox. 3 min lamp aan",
    iconColor: "text-energy",
    valueColor: "text-energy",
    icon: "M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z",
  },
  {
    key: "water",
    label: "Water",
    value: "5",
    unit: "ml",
    note: "Aprox. 1 glas water",
    iconColor: "text-water",
    valueColor: "text-water",
    icon: "M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z",
  },
  {
    key: "co2",
    label: "CO₂",
    value: "0.001",
    unit: "g",
    note: "Aprox. 1s autorijden",
    iconColor: "text-[#8a8f96]",
    valueColor: "text-ink",
    icon: "M7 18a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18 9.5a4 4 0 0 1-1 8H7z",
  },
  {
    key: "cost",
    label: "Kosten",
    value: "0.0001",
    unit: "Euro",
    note: "Aprox. 1/10 cent",
    iconColor: "text-cost",
    valueColor: "text-cost",
    icon: "M3 7.5A2.5 2.5 0 0 1 5.5 5H17a1 1 0 0 1 1 1v1.5H5.5a.5.5 0 0 0 0 1H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7.5zm13.5 5.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z",
  },
];
</script>

<template>
  <div class="mx-auto mt-10 w-full max-w-[750px] lg:mx-0 lg:ml-auto lg:mt-0">
    <!-- Prompt input (loading state) -->
    <div class="relative min-h-[100px] rounded-cf bg-form px-4 pt-[14px]">
      <div class="h-[18px] w-[71%] rounded-cf bg-skeleton" />
      <div class="mt-2 h-[18px] w-[41%] rounded-cf bg-skeleton" />
      <!-- DYNAMIC (mock): verstuur-knop / prompt input — louter illustratief -->
      <svg
        class="absolute bottom-[10px] right-[10px] h-8 w-8 text-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21.5 2.5L11 13" />
        <path d="M21.5 2.5l-6.5 19-4-8.5-8.5-4 19-6.5z" />
      </svg>
    </div>

    <!-- Dashed connector with the "AI Denkt..." pill -->
    <div
      class="afs-ai-connector relative flex min-h-[152px] items-center justify-center"
    >
      <div
        class="relative z-[1] inline-flex h-[50px] w-[200px] items-center gap-[10px] rounded-cf border-2 border-muted bg-card px-4"
      >
        <svg
          class="h-7 w-7 flex-none text-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65A.49.49 0 0 0 13.6 1h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.66-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.14.24.42.34.68.22l2.49-1c.52.39 1.08.73 1.69.98l.38 2.65c.04.24.25.42.49.42h4c.24 0 .45-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.26.12.54.02.68-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
          />
        </svg>
        <span class="text-base text-muted">AI Denkt...</span>
      </div>
    </div>

    <!-- Result card (static placeholder values) -->
    <!-- DYNAMIC (mock): berekende footprint-waarden — echte berekening op /challenger -->
    <div
      class="grid min-h-[200px] grid-cols-2 gap-y-6 rounded-cf bg-card px-2 py-5 sm:grid-cols-4 sm:gap-y-0 md:px-5 md:pb-[22px] md:pt-[26px]"
    >
      <div
        v-for="m in metrics"
        :key="m.key"
        class="flex flex-col items-center text-center"
      >
        <IconWallet
          v-if="m.key === 'cost'"
          class="h-10 w-10 drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
        />
        <svg
          v-else
          :class="[
            'h-10 w-10 drop-shadow-[0_4px_2px_rgba(0,0,0,0.25)]',
            m.iconColor,
          ]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path :d="m.icon" />
        </svg>
        <div class="mt-3 text-base leading-none text-muted md:text-xl">
          {{ m.label }}
        </div>
        <div
          :class="[
            'mt-[14px] text-[22px] leading-[1.05] md:text-[25px]',
            m.valueColor,
          ]"
        >
          {{ m.value }}
        </div>
        <div :class="['text-base leading-[1.1] md:text-xl', m.valueColor]">
          {{ m.unit }}
        </div>
        <div
          class="mt-[14px] text-[11px] leading-[1.1] text-muted md:text-[12.8px]"
        >
          {{ m.note }}
        </div>
      </div>
    </div>
  </div>
</template>
