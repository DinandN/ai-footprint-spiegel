<script setup lang="ts">
// Step 1 of the compare flow: pick the models (one card per provider; switch the
// variant within a provider with the chevron) and enter the prompt, then send
// the comparison and continue to the results page.

import type { Model } from "~/composables/useCompare";

interface ProviderGroup {
  provider: string;
  variants: Model[];
}

const {
  models,
  prompt,
  selectedIds,
  loading,
  examples,
  loadModels,
  loadExamples,
  toggleModel,
  runCompare,
} = useCompare();

// Load the model list and the "Verras me" pool; both fail silently if the
// back-end is not (yet) reachable (verrasMe falls back to FALLBACK_EXAMPLES).
await loadModels().catch(() => {});
await loadExamples?.().catch(() => {});

const MIN_MODELS = 2;
const MAX_CHARS = 2000;

// One card per provider: group the flat model list, keeping the API order.
const groups = computed<ProviderGroup[]>(() => {
  const map = new Map<string, Model[]>();
  for (const model of models.value) {
    if (!map.has(model.provider)) map.set(model.provider, []);
    map.get(model.provider)!.push(model);
  }
  return [...map.entries()].map(([provider, variants]) => ({ provider, variants }));
});

// Which variant is currently shown per provider (defaults to the first).
const activeVariant = ref<Record<string, string>>({});
watchEffect(() => {
  for (const group of groups.value) {
    if (!activeVariant.value[group.provider]) {
      activeVariant.value[group.provider] = group.variants[0]?.id;
    }
  }
});

function activeModel(group: ProviderGroup): Model {
  return (
    group.variants.find((m) => m.id === activeVariant.value[group.provider]) ??
    group.variants[0]
  );
}

// Dropdown choice: make `id` the active variant of this provider. If the
// provider was part of the comparison, move that selection to the new variant.
function selectVariant(group: ProviderGroup, id: string) {
  const current = activeModel(group);
  if (current.id === id) return;
  activeVariant.value[group.provider] = id;
  if (selectedIds.value.includes(current.id)) {
    toggleModel(current.id);
    if (!selectedIds.value.includes(id)) toggleModel(id);
  }
}

// Fallback for the "Verras me" button when the server pool is unavailable.
// Keep in sync with backend/db/exampleQuestions.js — the response cache is keyed
// by the exact prompt text, so these are the prompts that get pre-cached.
const FALLBACK_EXAMPLES = [
  "Leg quantumcomputing uit in één alinea voor een middelbare scholier.",
  "Schrijf een kort gedicht over de zee bij zonsondergang.",
  "Wat zijn drie praktische tips om thuis energie te besparen?",
  "Geef een recept voor een snelle vegetarische maaltijd.",
  "Vat de Franse Revolutie samen in vijf zinnen.",
];

const canSubmit = computed(
  () =>
    prompt.value.trim().length > 0 && selectedIds.value.length >= MIN_MODELS,
);

function verrasMe() {
  // Draw from the server-grown pool; fall back to the built-in list. Avoid
  // repeating the prompt that is already in the box when there's a choice.
  const pool = examples?.value?.length ? examples.value : FALLBACK_EXAMPLES;
  const options =
    pool.length > 1 ? pool.filter((p) => p !== prompt.value) : pool;
  prompt.value = options[Math.floor(Math.random() * options.length)];
}

async function onSubmit() {
  if (!canSubmit.value) return;
  await runCompare();
  await navigateTo("/vergelijking");
}
</script>

<template>
  <section class="afs-page-inner pb-10 pt-10 text-center lg:pt-[58px]">
    <!-- Stepper: stap 1 actief -->
    <Stepper :current="1" class="mb-10 lg:mb-[59px]" />

    <!-- Modellen -->
    <h1 class="afs-section-title">Modellen</h1>
    <p class="afs-section-sub mt-1 max-w-[800px]">
      Selecteer een of meerdere modellen die vergeleken moeten worden
    </p>

    <!-- Model-keuzekaarten -->
    <div
      class="mx-auto mt-10 flex max-w-[1560px] flex-wrap justify-center gap-[30px] lg:mt-[55px]"
    >
      <ModelSelectCard
        v-for="group in groups"
        :key="group.provider"
        :model="activeModel(group)"
        :variants="group.variants"
        :selected="selectedIds.includes(activeModel(group).id)"
        @toggle="toggleModel(activeModel(group).id)"
        @select-variant="selectVariant(group, $event)"
      />
    </div>

    <!-- Stel je vraag -->
    <div class="mx-auto mt-14 max-w-[787px] lg:mt-[100px]">
      <h2 class="afs-section-title">Stel Je AI-Vraag</h2>
      <p class="afs-section-sub mt-[13px] max-w-[800px]">
        Typ je vraag zoals je die normaal zou stellen.<br />
        Wij sturen deze naar de door jou gekozen modellen.
      </p>

      <div class="mt-[27px]">
        <textarea
          v-model="prompt"
          :maxlength="MAX_CHARS"
          placeholder="Type je vraag hier..."
          class="block h-[201px] w-full resize-none rounded-cf border-2 border-muted bg-card px-4 py-[14px] text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div
        class="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-0"
      >
        <button
          type="button"
          class="afs-btn-verras order-1 w-full sm:w-[145px]"
          @click="verrasMe"
        >
          🎲 Verras me
        </button>
        <span class="order-2 text-right text-[12.8px] text-muted">
          {{ prompt.length }}/{{ MAX_CHARS }} Karakters
        </span>
      </div>
    </div>

    <!-- Validatie + verzenden -->
    <div class="mt-[26px]">
      <p
        v-if="selectedIds.length < MIN_MODELS"
        class="mb-[14px] text-base text-error"
      >
        Selecteer minimaal {{ MIN_MODELS }} AI-modellen
      </p>
      <div class="flex justify-center">
        <button
          type="button"
          class="afs-btn-cf afs-btn-cf-primary disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canSubmit || loading"
          @click="onSubmit"
        >
          <span>{{ loading ? "Bezig..." : "Stuur Vraag op naar AIs" }}</span>
          <IconArrow class="h-[22px] w-[22px] flex-none" />
        </button>
      </div>
    </div>
  </section>
</template>
