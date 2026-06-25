<script setup lang="ts">
// Step 2 detail view ("Vergelijk Per AI"): the footprint of one compared model
// in depth. The model header + metric bars (values/fill) are driven by
// useCompare().results; prev/next switches between the compared models. The
// metric descriptions, "Feiten", "Het process van je prompt" and the SDG sticker
// are researched, per-provider content (Google / Anthropic / Ollama-local) —
// variants of a provider share infrastructure, so the narrative is per provider
// while the numbers stay per model. Reached from /vergelijking.

import type { CompareResult, Footprint } from "~/composables/useCompare";

type Variant = "energy" | "water" | "cost" | "co2";
interface ProcessStep {
  title: string;
  body: string;
  sdg?: boolean;
}
interface ProviderContent {
  metrics: Record<Variant, string>;
  facts: { title: string; body: string }[];
  process: ProcessStep[];
  sdg: { src: string; alt: string };
  sources: string;
}

const { results } = useCompare();

// Only models that returned a footprint can be detailed here.
const models = computed(() => results.value.filter((r) => r.ok && r.footprint));

const index = ref(0);
watch(models, (list) => {
  if (index.value > list.length - 1) index.value = 0;
});

const current = computed<CompareResult | undefined>(() => models.value[index.value]);

function prevModel() {
  const n = models.value.length;
  if (n) index.value = (index.value - 1 + n) % n;
}
function nextModel() {
  const n = models.value.length;
  if (n) index.value = (index.value + 1) % n;
}

// Provider → brand logo / label (mirrors ModelSelectCard and utils/results).
const LOGOS: Record<string, string> = {
  google: "/img/challenger/gemini.png",
  anthropic: "/img/challenger/claude.png",
  ollama: "/img/challenger/ollama.svg",
};
const PROVIDER_LABEL: Record<string, string> = {
  google: "Google",
  anthropic: "Anthropic",
  ollama: "Ollama",
};

const header = computed(() => {
  const name = current.value?.model?.name ?? current.value?.modelId ?? "";
  const provider = current.value?.model?.provider ?? "";
  return {
    brand: name.split(" ")[0] || name,
    variant: provider ? `${name} – ${PROVIDER_LABEL[provider] ?? provider}` : name,
    logo: LOGOS[provider],
  };
});

interface MetricDef {
  variant: Variant;
  title: string;
  field: keyof Footprint;
  unit: string;
  decimals: number;
}
const METRIC_DEFS: MetricDef[] = [
  { variant: "energy", title: "Energie Verbruik", field: "energyWh", unit: "Wh", decimals: 3 },
  { variant: "water", title: "Waterkoeling", field: "waterMl", unit: "ml", decimals: 2 },
  { variant: "cost", title: "Kosten", field: "costEur", unit: "euro", decimals: 4 },
  { variant: "co2", title: "CO₂-uitstoot", field: "co2Grams", unit: "g", decimals: 3 },
];

// Per-provider content. Figures are sourced (see `sources`); within a provider
// the story is identical across variants — only the displayed numbers differ.
const CONTENT: Record<string, ProviderContent> = {
  google: {
    metrics: {
      energy:
        "Gemini draait op Google's eigen TPU's — chips die speciaal voor AI zijn ontworpen en zuiniger werken dan gewone GPU's, zodat er veel rekenwerk per watt mogelijk is. (De balk is een schatting die meegroeit met de lengte van het antwoord.)",
      water:
        "Datacenters koelen met water. Google's vloot draait op een PUE van 1,09 (industriegemiddelde 1,56), dus er gaat weinig stroom verloren aan overhead per vraag.",
      cost: "Cloud-modellen rekenen per token af. De zuinige TPU-infrastructuur maakt Gemini (zeker Flash-Lite) een van de goedkoopste cloud-opties per vraag.",
      co2: "Google matcht zijn stroom al acht jaar voor 100% met hernieuwbare energie (jaarbasis) en mikt op 24/7 CO₂-vrije energie in 2030 — dat drukt de netto-uitstoot per vraag.",
    },
    facts: [
      {
        title: "Schatting vs. Google's eigen meting",
        body: "Google meet voor een mediane Gemini-tekstprompt ~0,24 Wh, ~0,03 gCO₂e en ~0,26 ml water in hun eigen geoptimaliseerde serving. De balken hierboven zijn generieke schattingen (EcoLogits, geschaald op het aantal uitvoertokens) en vallen daardoor hoger uit — een goede herinnering dat dit benaderingen zijn, geen gemeten cijfers.",
      },
      {
        title: "33× zuiniger in één jaar",
        body: "Tussen mei 2024 en mei 2025 daalde de energie per mediane Gemini-prompt 33× en de CO₂-voetafdruk 44×, terwijl de antwoorden beter werden — vooral door efficiëntere modellen en software.",
      },
      {
        title: "TPU's in plaats van GPU's",
        body: "Google draait AI op zelfontworpen Tensor Processing Units. De 7e generatie is ~30× efficiënter dan de eerste Cloud-TPU uit 2018, wat het stroomverbruik per vraag flink drukt.",
      },
    ],
    process: [
      {
        title: "Jouw prompt bereikt een Google-datacenter",
        body: "Je tekst wordt omgezet in tokens en naar een TPU gestuurd — een processor die Google speciaal voor AI ontwierp. Een TPU doet hetzelfde werk als een gewone GPU, maar zuiniger.",
      },
      {
        title: "Koeling met minimale overhead",
        body: "De chips produceren warmte. Google's datacenters koelen efficiënt: de gemiddelde PUE is 1,09 tegen een industriegemiddelde van 1,56 — vrijwel alle stroom gaat naar rekenwerk, niet naar koeling.",
      },
      {
        title: "Stroom uit hernieuwbare bronnen",
        body: "Google matcht zijn elektriciteit al acht jaar op jaarbasis voor 100% met hernieuwbare energie en streeft naar 24/7 CO₂-vrije energie in 2030. Daardoor blijft de netto CO₂ per prompt extreem laag.",
        sdg: true,
      },
    ],
    sdg: { src: "/img/sdg-7.svg", alt: "SDG 7 — Betaalbare en schone energie" },
    sources:
      "Google Cloud 'Measuring the environmental impact of AI inference' (aug. 2025); MIT Technology Review (aug. 2025); Google 2025 Environmental Report (PUE 1,09; 100% hernieuwbaar; TPU-efficiëntie).",
  },
  anthropic: {
    metrics: {
      energy:
        "Claude draait multi-cloud op AWS Trainium2-, Google TPU- en NVIDIA-chips. Grotere modellen kosten meer energie per antwoord: Opus (~200 mld parameters) ruim meer dan Haiku (~20 mld).",
      water:
        "De cloud-datacenters die Claude draaien koelen deels met water. De exacte hoeveelheid per vraag is niet publiek; deze waarde volgt een gangbare datacenter-waterintensiteit uit het Technisch Ontwerp.",
      cost: "Je betaalt per token en de prijs schaalt met de modelgrootte: Opus is het duurst, Haiku het goedkoopst. De modelkeuze bepaalt dus sterk de kosten per vraag.",
      co2: "Amazon (Anthropic's primaire cloud) matchte zijn stroom al in 2023 voor 100% met hernieuwbare energie en mikt op netto-nul CO₂ in 2040; ook Google Cloud streeft naar 24/7 CO₂-vrije energie.",
    },
    facts: [
      {
        title: "Multi-cloud, drie chips",
        body: "Anthropic draait Claude op AWS Trainium2, Google Cloud TPU's én NVIDIA-GPU's en kiest per taak de meest geschikte chip. Amazon is de primaire cloud- en trainingspartner, met meer dan een miljoen Trainium2-chips.",
      },
      {
        title: "Groter model, grotere voetafdruk",
        body: "Claude Opus heeft ~10× zoveel actieve parameters als Haiku. Meer parameters betekent meer rekenwerk en dus meer energie per antwoord — kies Haiku of Sonnet als een lichtere vraag volstaat.",
      },
      {
        title: "100% hernieuwbaar bij Amazon",
        body: "Amazon matchte in 2023 al zijn stroomverbruik voor 100% met hernieuwbare energie — zeven jaar vóór de deadline — en is al jaren de grootste zakelijke inkoper van groene stroom ter wereld. Het bedrijf mikt op netto-nul CO₂ in 2040.",
      },
    ],
    process: [
      {
        title: "Jouw prompt gaat naar de cloud",
        body: "Je tekst gaat naar een datacenter van AWS of Google Cloud en wordt omgezet in tokens. Daar verwerkt een Trainium2- of TPU-chip je vraag — hardware die Anthropic kiest op prijs-prestatie en efficiëntie.",
      },
      {
        title: "Groot model, veel rekenwerk",
        body: "Claude is een groot model; vooral Opus voert per antwoord veel berekeningen uit. Dat kost meer energie dan een klein model, maar levert sterkere redeneer- en codeerprestaties.",
      },
      {
        title: "Cloud op hernieuwbare energie",
        body: "Anthropic's clouds verduurzamen snel: Amazon draait sinds 2023 op 100% hernieuwbare stroom (jaarbasis) en mikt op netto-nul in 2040; Google Cloud op 24/7 CO₂-vrije energie in 2030.",
        sdg: true,
      },
    ],
    sdg: { src: "/img/sdg-13.svg", alt: "SDG 13 — Klimaatactie" },
    sources:
      "Anthropic 'Expanding our use of Google Cloud TPUs' en de Amazon-samenwerking (2024–2025); Amazon 'meets 100% renewable energy goal' (2023) & The Climate Pledge (netto-nul 2040).",
  },
  ollama: {
    metrics: {
      energy:
        "Dit model draait lokaal op jóuw computer — geen datacenter, geen koeling-overhead (PUE 1,0). Een klein 3-miljard-model gebruikt veel minder rekenkracht dan grote cloud-modellen; lokaal draaien valt nauwelijks op je stroomrekening op.",
      water:
        "Lokaal draaien kost geen koelwater: je pc is luchtgekoeld. Daarom rekent dit artefact 0 ml water voor de lokale modellen — een groot verschil met datacenters.",
      cost: "Er zijn geen API-kosten: je betaalt alleen je eigen stroom. Tegen een Nederlands tarief is dat een fractie van een eurocent per vraag.",
      co2: "De CO₂ hangt af van je stroommix. Op de Nederlandse mix (~0,27 kg/kWh) is dat schoner dan het wereldgemiddelde (~0,42 kg/kWh) dat voor cloud geldt — en het kleine model verbruikt sowieso weinig.",
    },
    facts: [
      {
        title: "Draait op jouw eigen pc",
        body: "Llama en Qwen draaien volledig lokaal via Ollama. Er gaat geen vraag naar een datacenter: geen netwerk, geen API-key, geen koeltorens. De enige kosten zijn de stroom van je eigen apparaat.",
      },
      {
        title: "Klein model, weinig energie",
        body: "Een model van 3 miljard parameters gebruikt veel minder energie dan grote modellen. Onderzoek laat zien dat een 3B-model tot ~80% minder energie per vraag kost dan een 32B-model.",
      },
      {
        title: "Geen waterkoeling",
        body: "Datacenters verdampen water om te koelen; jouw luchtgekoelde pc niet. Voor de lokale modellen rekent dit artefact daarom 0 ml waterverbruik per vraag.",
      },
    ],
    process: [
      {
        title: "Jouw prompt blijft op je apparaat",
        body: "Je tekst wordt lokaal omgezet in tokens en verwerkt door je eigen processor of GPU. Er verlaat niets je computer — geen datacenter, en zelfs geen internetverbinding nodig.",
      },
      {
        title: "Een klein, zuinig model rekent",
        body: "Het 3-miljard-model is compact genoeg voor consumentenhardware. Het trekt kortstondig wat extra vermogen (orde van tientallen watt), vergelijkbaar met een zwaardere taak op je pc.",
      },
      {
        title: "Stroom van het lokale net",
        body: "De energie komt uit je stopcontact, dus uit de Nederlandse stroommix (~0,27 kg CO₂/kWh) — schoner dan het wereldgemiddelde voor datacenters. Zonder datacenter-overhead en zonder koelwater blijft de voetafdruk per vraag minimaal.",
        sdg: true,
      },
    ],
    sdg: { src: "/img/sdg-12.svg", alt: "SDG 12 — Verantwoorde consumptie en productie" },
    sources:
      "Footprint-methodiek (Technisch Ontwerp, hfdst. 5: PUE 1,0, 0 l water, NL-mix 0,27 kg/kWh); Husom et al. 'The Price of Prompting' (arXiv 2024) over lokaal LLM-energieverbruik.",
  },
};

const activeContent = computed<ProviderContent>(
  () => CONTENT[current.value?.model?.provider ?? ""] ?? CONTENT.google,
);

// Bars: values/fill from the real footprint, scaled to the worst (highest) value
// among the compared models; the description is the researched per-provider text.
const metrics = computed(() => {
  const cur = current.value;
  if (!cur?.footprint) return [];
  const c = activeContent.value;
  return METRIC_DEFS.map((def) => {
    const value = cur.footprint![def.field] as number;
    const values = models.value.map((r) => r.footprint![def.field] as number);
    const max = Math.max(...values);
    return {
      variant: def.variant,
      title: def.title,
      value: value.toFixed(def.decimals),
      unit: def.unit,
      fill: max > 0 ? Math.round((value / max) * 100) : 0,
      min: `0 ${def.unit}`,
      max: `${max.toFixed(def.decimals)} ${def.unit}`,
      description: c.metrics[def.variant],
    };
  });
});

const facts = computed(() => activeContent.value.facts);
const processSteps = computed(() => activeContent.value.process);
const sdg = computed(() => activeContent.value.sdg);
const sources = computed(() => activeContent.value.sources);
</script>

<template>
  <section class="afs-page-inner pb-28 pt-8">
    <!-- Terug-knop (links) + stepper (gecentreerd) -->
    <div class="relative">
      <div class="mb-6 flex justify-center md:absolute md:left-0 md:top-0 md:mb-0">
        <NuxtLink to="/vergelijking" class="afs-btn-back w-[260px]">
          <IconArrowLeft class="absolute left-[18px] h-[22px] w-[22px]" />
          <span>Terug Naar Overview</span>
        </NuxtLink>
      </div>
      <div class="flex justify-center">
        <Stepper :current="2" />
      </div>
    </div>

    <template v-if="current">
      <!-- Model-kop; prev/next loopt via de chevrons in de kop -->
      <div class="mt-12 flex justify-center md:mt-[46px]">
        <ModelHeader
          :name="header.brand"
          :variant="header.variant"
          :logo="header.logo"
          @prev="prevModel"
          @next="nextModel"
        />
      </div>

      <!-- Metric-balken -->
      <div class="mt-10 grid grid-cols-1 gap-[30px] sm:grid-cols-2 2xl:grid-cols-4">
        <FootprintBar v-for="m in metrics" :key="m.variant" v-bind="m" />
      </div>

      <!-- Feiten -->
      <div class="mt-16">
        <h2 class="afs-section-title">Feiten</h2>
        <div class="mt-[26px] grid grid-cols-1 gap-[30px] md:grid-cols-3">
          <InfoCard
            v-for="fact in facts"
            :key="fact.title"
            :title="fact.title"
            :body="fact.body"
          />
        </div>
      </div>

      <!-- Het process van je prompt -->
      <div class="mt-16">
        <h2 class="afs-section-title">Het process van je prompt</h2>
        <div class="mt-[26px] flex flex-col items-stretch gap-6 lg:flex-row lg:gap-0">
          <template v-for="(step, i) in processSteps" :key="step.title">
            <InfoCard :title="step.title" :body="step.body" class="flex-1">
              <img
                v-if="step.sdg"
                :src="sdg.src"
                :alt="sdg.alt"
                class="absolute -bottom-[84px] -right-4 h-[92px] w-[92px] rotate-6 rounded-[6px] shadow-lg lg:-right-10"
              />
            </InfoCard>
            <div
              v-if="i < processSteps.length - 1"
              class="flex flex-none items-center justify-center text-black max-lg:py-2 lg:w-[86px]"
            >
              <IconArrowBlock class="h-10 w-[54px] max-lg:rotate-90" />
            </div>
          </template>
        </div>
        <p class="afs-t-src mt-10 max-w-[900px]">Bronnen: {{ sources }}</p>
      </div>
    </template>

    <!-- Lege staat: geen vergelijking gestart -->
    <div v-else class="mx-auto mt-16 max-w-[600px] text-center">
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
