<script setup lang="ts">
// Step 1 of the compare flow: pick one or more models and enter the prompt,
// then send the comparison and continue to the results page.

const {
  models,
  prompt,
  selectedIds,
  loading,
  loadModels,
  toggleModel,
  runCompare,
} = useCompare();

// Load the model list; fails silently if the back-end is not (yet) reachable.
await loadModels().catch(() => {});

const MAX_CHARS = 2000;

// Example prompts for the "Verras me" (surprise me) button.
const EXAMPLES = [
  "Leg quantumcomputing uit in één alinea voor een middelbare scholier.",
  "Schrijf een kort gedicht over de zee bij zonsondergang.",
  "Wat zijn drie praktische tips om thuis energie te besparen?",
  "Geef een recept voor een snelle vegetarische maaltijd.",
  "Vat de Franse Revolutie samen in vijf zinnen.",
];

const canSubmit = computed(
  () => prompt.value.trim().length > 0 && selectedIds.value.length > 0,
);

function verrasMe() {
  const i = Math.floor(Math.random() * EXAMPLES.length);
  prompt.value = EXAMPLES[i];
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
        v-for="model in models"
        :key="model.id"
        :model="model"
        :selected="selectedIds.includes(model.id)"
        @toggle="toggleModel(model.id)"
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
        v-if="selectedIds.length === 0"
        class="mb-[14px] text-base text-error"
      >
        Selecteer Minimaal 1 AI-model
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
