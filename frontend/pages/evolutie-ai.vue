<script setup lang="ts">
// AI-history / evolution infographic. The "Mijlpalen" section is a data-driven
// auto-advancing slider: year buttons (2022–2025) pick the year, the arrows step
// per quarter, and it auto-plays through the whole 2022→2025 timeline. Milestone
// content per quarter lives in MILESTONES below (sourced — see each entry).

const heroBadges = [
  {
    num: "200M+",
    cap: "ChatGPT Weekgebruikers",
    text: "Wereldwijd gebruiken miljoenen mensen ChatGPT voor werk, studie en creativiteit.",
    src: "(aug. 2024)",
  },
  {
    num: "78.6 mld Euro",
    cap: "Kapitaal geinvesteerd in AI",
    text: "Bedrijven investeren miljarden om AI sneller en krachtiger te maken.",
    src: "(2023, Stanford)",
  },
  {
    num: "150+",
    cap: "Nieuwe grote modellen",
    text: "Jaarlijks verschijnen tientallen nieuwe AI-modellen van verschillende organisaties.",
    src: "(2022–2024)",
  },
  {
    num: "~100 mln Euro",
    cap: "Trainingskosten GPT-4",
    text: "Het trainen van geavanceerde AI vereist enorme hoeveelheden rekenkracht.",
    src: "(Sam Altman, WSJ 2023)",
  },
];

type Milestone = {
  period: string; // kwartaal-label, bv. "Jan – Mrt"
  chips: string[]; // belangrijkste releases dat kwartaal
  title: string;
  body: string;
  impactLabel: string; // wat de relatieve-impactbalk weergeeft
  impactPct: number; // vulling van de balk (0–100, redactioneel/relatief)
  sources: string;
};

const YEARS = ["2022", "2023", "2024", "2025"] as const;

// Vier kwartalen per jaar. Gegevens en data geverifieerd tegen de bronnen per entry.
const MILESTONES: Record<string, Milestone[]> = {
  "2022": [
    {
      period: "Jan – Mrt",
      chips: ["InstructGPT", "Chinchilla"],
      title: "RLHF & slimmer trainen",
      body: "OpenAI laat met InstructGPT zien dat modellen via menselijke feedback (RLHF) veel beter instructies volgen. DeepMind's Chinchilla bewijst dat de juiste balans tussen data en parameters belangrijker is dan louter méér parameters.",
      impactLabel: "Onderzoeksimpact",
      impactPct: 45,
      sources:
        "Ouyang et al., OpenAI 'InstructGPT' (jan. 2022); Hoffmann et al., DeepMind 'Chinchilla' (mrt. 2022).",
    },
    {
      period: "Apr – Jun",
      chips: ["DALL·E 2", "PaLM 540B", "Imagen"],
      title: "De doorbraak van beeldgeneratie",
      body: "OpenAI's DALL·E 2 en Google's Imagen zetten tekst-naar-beeld op de kaart, terwijl Google's PaLM (540B parameters) de grens van taalmodellen verlegt.",
      impactLabel: "Publieke aandacht",
      impactPct: 55,
      sources: "OpenAI 'DALL·E 2' (apr. 2022); Google 'PaLM' (apr. 2022) & 'Imagen' (mei 2022).",
    },
    {
      period: "Jul – Sep",
      chips: ["Stable Diffusion", "Midjourney", "Whisper"],
      title: "Open-source beeld-AI voor iedereen",
      body: "Met de open release van Stable Diffusion (aug.) en de Midjourney-bèta wordt beeldgeneratie gratis en lokaal beschikbaar. OpenAI brengt Whisper uit voor spraakherkenning.",
      impactLabel: "Democratisering",
      impactPct: 60,
      sources:
        "Stability AI 'Stable Diffusion' (aug. 2022); Midjourney open bèta (jul. 2022); OpenAI 'Whisper' (sep. 2022).",
    },
    {
      period: "Okt – Dec",
      chips: ["ChatGPT", "GPT-3.5"],
      title: "ChatGPT verandert alles",
      body: "Op 30 november lanceert OpenAI ChatGPT (GPT-3.5). Het haalt 1 miljoen gebruikers in vijf dagen en circa 100 miljoen binnen twee maanden — de snelst groeiende consumenten-app ooit.",
      impactLabel: "Publieke adoptie",
      impactPct: 95,
      sources: "OpenAI 'ChatGPT' (30 nov. 2022); Reuters/UBS gebruikersschattingen (jan. 2023).",
    },
  ],
  "2023": [
    {
      period: "Jan – Mrt",
      chips: ["GPT-4", "LLaMA", "Claude", "Bard"],
      title: "De grote-modellen-wedloop barst los",
      body: "GPT-4 (14 mrt.) brengt multimodale redeneerkracht; Meta's LLaMA jaagt open onderzoek aan; Microsoft (Bing), Google (Bard) en Anthropic (Claude) stappen in de strijd.",
      impactLabel: "Concurrentie",
      impactPct: 80,
      sources:
        "OpenAI 'GPT-4' (mrt. 2023); Meta 'LLaMA' (feb. 2023); Anthropic 'Claude' (mrt. 2023).",
    },
    {
      period: "Apr – Jun",
      chips: ["PaLM 2", "Falcon", "Pauze-brief"],
      title: "Regulering en open modellen",
      body: "Een open brief roept op tot een AI-pauze en de regelgevingsdiscussie versnelt. Google lanceert PaLM 2 en open modellen als Falcon winnen terrein.",
      impactLabel: "Maatschappelijk debat",
      impactPct: 65,
      sources:
        "Future of Life 'Pause AI' (mrt. 2023); Google 'PaLM 2' (mei 2023); TII 'Falcon' (mei 2023).",
    },
    {
      period: "Jul – Sep",
      chips: ["Llama 2", "Claude 2", "Mistral 7B"],
      title: "Open modellen worden commercieel",
      body: "Meta's Llama 2 mag commercieel gebruikt worden en zet open AI in een stroomversnelling. Claude 2 introduceert een venster van 100k tokens; Mistral 7B toont Europese slagkracht.",
      impactLabel: "Open-source momentum",
      impactPct: 70,
      sources:
        "Meta 'Llama 2' (jul. 2023); Anthropic 'Claude 2' (jul. 2023); Mistral AI 'Mistral 7B' (sep. 2023).",
    },
    {
      period: "Okt – Dec",
      chips: ["Gemini 1.0", "GPT-4 Turbo", "GPTs", "EU AI Act"],
      title: "Gemini, GPT-store en wetgeving",
      body: "Op OpenAI's DevDay verschijnen GPT-4 Turbo, custom GPT's en de Assistants API. Google kondigt Gemini aan en de EU bereikt een politiek akkoord over de AI Act.",
      impactLabel: "Ecosysteem & beleid",
      impactPct: 75,
      sources:
        "OpenAI DevDay (6 nov. 2023); Google 'Gemini' (6 dec. 2023); EU AI Act-akkoord (8 dec. 2023).",
    },
  ],
  "2024": [
    {
      period: "Jan – Mrt",
      chips: ["Claude 3", "Gemini 1.5", "Sora"],
      title: "Multimodaal en lange context",
      body: "Anthropic's Claude 3 (Opus/Sonnet/Haiku) en Google's Gemini 1.5 (1M-token context) zetten nieuwe standaarden. OpenAI's Sora demonstreert tekst-naar-video en het EU-parlement neemt de AI Act aan.",
      impactLabel: "Capaciteitssprong",
      impactPct: 78,
      sources:
        "Anthropic 'Claude 3' (4 mrt. 2024); Google 'Gemini 1.5' (feb. 2024); OpenAI 'Sora' (feb. 2024); EU AI Act (mrt. 2024).",
    },
    {
      period: "Apr – Jun",
      chips: ["GPT-4o", "Claude 3.5 Sonnet", "Apple Intelligence"],
      title: "Realtime en alomtegenwoordig",
      body: "OpenAI's GPT-4o brengt realtime spraak en vision; Anthropic's Claude 3.5 Sonnet zet de toon voor coderen. Apple kondigt 'Apple Intelligence' aan en brengt AI naar honderden miljoenen apparaten.",
      impactLabel: "Consument & integratie",
      impactPct: 82,
      sources:
        "OpenAI 'GPT-4o' (13 mei 2024); Anthropic 'Claude 3.5 Sonnet' (20 jun. 2024); Apple WWDC (jun. 2024).",
    },
    {
      period: "Jul – Sep",
      chips: ["Llama 3.1 405B", "OpenAI o1"],
      title: "Open frontier & redeneermodellen",
      body: "Meta's Llama 3.1 405B is het eerste open model op frontier-niveau. OpenAI's o1 introduceert modellen die 'nadenken' vóór ze antwoorden — een nieuwe schaalas voor AI.",
      impactLabel: "Redeneervermogen",
      impactPct: 80,
      sources: "Meta 'Llama 3.1 405B' (23 jul. 2024); OpenAI 'o1-preview' (12 sep. 2024).",
    },
    {
      period: "Okt – Dec",
      chips: ["Gemini 2.0", "Computer use", "o3"],
      title: "Het tijdperk van de AI-agent",
      body: "Anthropic geeft Claude 'computer use' om zelf een computer te bedienen; Google's Gemini 2.0 Flash is gebouwd voor agents. OpenAI kondigt het krachtige o3 aan.",
      impactLabel: "Autonomie",
      impactPct: 85,
      sources:
        "Anthropic 'computer use' (22 okt. 2024); Google 'Gemini 2.0 Flash' (11 dec. 2024); OpenAI 'o3' (20 dec. 2024).",
    },
  ],
  "2025": [
    {
      period: "Jan – Mrt",
      chips: ["DeepSeek R1", "Claude 3.7", "GPT-4.5", "Gemini 2.5 Pro"],
      title: "De DeepSeek-schok",
      body: "Het open redeneermodel DeepSeek R1 evenaart OpenAI's o1 tegen een fractie van de kosten; op 27 jan. verliest Nvidia 18% (~$589 mld) beurswaarde. Anthropic brengt het hybride Claude 3.7 Sonnet, Google lanceert Gemini 2.5 Pro.",
      impactLabel: "Marktschok",
      impactPct: 92,
      sources:
        "DeepSeek 'R1' (20 jan. 2025); Anthropic 'Claude 3.7 Sonnet' (24 feb. 2025); Google 'Gemini 2.5 Pro' (mrt. 2025).",
    },
    {
      period: "Apr – Jun",
      chips: ["Claude 4", "o3 / o4-mini", "Llama 4", "Gemini 2.5"],
      title: "Frontier-modellen op stoom",
      body: "Anthropic lanceert Claude Opus 4 en Sonnet 4 (22 mei); OpenAI brengt o3 en o4-mini. Meta's Llama 4 en Google's Gemini 2.5 (met Veo 3-video) houden het tempo hoog.",
      impactLabel: "Capaciteitsrace",
      impactPct: 86,
      sources:
        "Anthropic 'Claude Opus 4 & Sonnet 4' (22 mei 2025); OpenAI 'o3/o4-mini' (16 apr. 2025); Meta 'Llama 4' (apr. 2025); Google I/O (mei 2025).",
    },
    {
      period: "Jul – Sep",
      chips: ["GPT-5", "Claude Opus 4.1", "Grok 4"],
      title: "GPT-5 en de unified router",
      body: "OpenAI lanceert GPT-5 (7 aug.): één systeem dat automatisch wisselt tussen een snelle en een diep-redenerende modus. Anthropic volgt met Claude Opus 4.1; xAI met Grok 4.",
      impactLabel: "Volwassenheid",
      impactPct: 84,
      sources:
        "OpenAI 'GPT-5' (7 aug. 2025); Anthropic 'Claude Opus 4.1' (aug. 2025); xAI 'Grok 4' (jul. 2025).",
    },
    {
      period: "Okt – Dec",
      chips: ["Gemini 3 Pro", "Claude Opus 4.5", "GPT-5.1"],
      title: "Frontier-race op topsnelheid",
      body: "Binnen één week verschijnen Google's Gemini 3 Pro (18 nov.) en Anthropic's Claude Opus 4.5 (24 nov.), gevolgd door OpenAI's GPT-5.1. De voorsprong tussen aanbieders slinkt tot dagen.",
      impactLabel: "Concurrentietempo",
      impactPct: 88,
      sources:
        "Google 'Gemini 3 Pro' (18 nov. 2025); Anthropic 'Claude Opus 4.5' (24 nov. 2025); OpenAI 'GPT-5.1' (nov. 2025).",
    },
  ],
};

const AUTOPLAY_MS = 7000;

// Eén index over de hele tijdlijn: jaar (0–3) + kwartaal (0–3).
const yearIndex = ref(0);
const quarterIndex = ref(0);

const activeYear = computed(() => YEARS[yearIndex.value]);
const quarters = computed(() => MILESTONES[activeYear.value]);
const current = computed(() => quarters.value[quarterIndex.value]);

// Stap door de volledige tijdlijn: na Q4 rolt het door naar Q1 van het volgende
// jaar (en 2025-Q4 → 2022-Q1), zodat de slider naadloos blijft lopen.
function go(dir: number) {
  let q = quarterIndex.value + dir;
  let y = yearIndex.value;
  if (q > 3) {
    q = 0;
    y = (y + 1) % YEARS.length;
  } else if (q < 0) {
    q = 3;
    y = (y - 1 + YEARS.length) % YEARS.length;
  }
  quarterIndex.value = q;
  yearIndex.value = y;
}

const playing = ref(true);
let timer: ReturnType<typeof setInterval> | undefined;

function stop() {
  if (timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}
function start() {
  stop();
  if (!playing.value) return;
  timer = setInterval(() => go(1), AUTOPLAY_MS);
}
function togglePlay() {
  playing.value = !playing.value;
  playing.value ? start() : stop();
}

// Handmatige interactie verzet de inhoud én herstart de autoplay-timer, zodat de
// gebruiker tijd krijgt om te lezen voordat de slider weer doorschuift.
function selectYear(i: number) {
  yearIndex.value = i;
  quarterIndex.value = 0;
  start();
}
function step(dir: number) {
  go(dir);
  start();
}

onMounted(start);
onBeforeUnmount(stop);

const costRows = [
  { model: "PaLM", org: "Google", year: "2022", cost: "~$9 miljoen", params: "540B" },
  { model: "LLaMA 2", org: "Meta", year: "2023", cost: "~$3 miljoen", params: "70B" },
  { model: "GPT-4", org: "OpenAI", year: "2023", cost: "~$78–100 miljoen", params: "~1,8T (geschat)" },
  { model: "Gemini Ultra", org: "Google", year: "2023", cost: "~$191 miljoen", params: "onbekend" },
  { model: "Llama 3", org: "Meta", year: "2024", cost: "~$5 miljoen", params: "70B" },
  { model: "Claude 3.5 Opus", org: "Anthropic", year: "2024", cost: "~$50–100 miljoen", params: "onbekend" },
];

const energyCards = [
  {
    big: "1.287 MWh",
    lbl: "GPT-3 training energieverbruik",
    sub: "ong. 120 Nederlandse huishoudens in 1 jaar.",
    src: "Patterson et al., Google (2021)",
    emoji: "🌎",
  },
  {
    big: "502 ton CO₂",
    lbl: "GPT-3 training uitstoot",
    sub: "ong. 112 auto's, 1 jaar rijden",
    src: "Patterson et al., “Carbon and the Cloud” (2021)",
    img: "/img/evolutie-ai/icon-cloud.svg",
    imgW: 90,
    imgH: 90,
  },
  {
    big: "10x Energie",
    lbl: "GPT-4 Training Energieverbruik",
    sub: "~0,001–0,01 kWh per query",
    src: "IEA “Electricity 2024”; Goldman Sachs (2024)",
    img: "/img/evolutie-ai/icon-gold.svg",
    imgW: 46,
    imgH: 77,
  },
  {
    big: "1.000 TWh",
    lbl: "Verwacht verbruik Datacenters 2030",
    sub: "Het energieverbruik van Japan (250 mld)",
    src: "IEA “Electricity 2024” (jan. 2024)",
    img: "/img/evolutie-ai/icon-wallet.svg",
    imgW: 78,
    imgH: 78,
  },
];

const marketBars = [
  { value: "$58", height: "22%", cls: "bg-[#E6E4EB]", year: "2021" },
  { value: "$94", height: "41%", cls: "bg-[#D2F1DC]", year: "2022" },
  { value: "$142", height: "53%", cls: "bg-[#A9E6BD]", year: "2023" },
  { value: "$184", height: "73%", cls: "afs-bar--green", year: "2024" },
  { value: "$827*", height: "100%", cls: "afs-bar--proj", year: "2030*" },
];

const economicStats = [
  { big: "77%", lbl: "Fortune 500-bedrijven die AI inzetten (2024)", src: "KPMG AI Survey 2024" },
  {
    big: "300M",
    lbl: "Banen wereldwijd beïnvloed door generatieve AI",
    src: "Goldman Sachs “The Potentially Large Effects of AI” (2023)",
  },
  { big: "€3,83 mld", lbl: "Verwachte bijdrage AI aan wereldwijd BNP (2030)", src: "PwC Global AI Study (2023)" },
];
</script>

<template>
  <!-- ============ HERO ============ -->
  <section class="afs-section relative overflow-hidden">
    <div class="afs-hero-art" />
    <div class="afs-stage relative z-[1]">
      <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <!-- left: title + intro + buttons -->
        <div class="lg:col-span-5">
          <h1 class="afs-t-display">De evolutie van<br />kunstmatige intelligentie</h1>
          <p class="afs-t-lead mt-6 max-w-[570px]">
            Van het plotselinge doorbraakmoment van ChatGPT tot
            miljardeninvesteringen, regulering en een mondiale energiediscussie,
            AI heeft in drie jaar meer veranderd dan in de twintig jaar ervoor.
          </p>
          <div class="mt-12 flex max-w-[300px] flex-col gap-4">
            <a href="#milestones" class="afs-btn-cf afs-btn-cf-primary">
              <span>Bekijk Mijlpalen</span>
              <IconArrow class="h-[22px] w-[22px] flex-none" />
            </a>
            <a href="#impact" class="afs-btn-cf afs-btn-cf-outline">
              <span>Globale Voetafdruk</span>
              <IconArrow class="h-[22px] w-[22px] flex-none" />
            </a>
            <NuxtLink to="/" class="afs-btn-cf afs-btn-cf-outline">
              <IconArrowLeft class="h-[22px] w-[22px] flex-none" />
              <span>Terug naar Home</span>
            </NuxtLink>
          </div>
        </div>

        <!-- right: 2x2 stat badges -->
        <div class="lg:col-span-7">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <StatBadge
              v-for="badge in heroBadges"
              :key="badge.cap"
              :num="badge.num"
              :cap="badge.cap"
              :text="badge.text"
              :src="badge.src"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ TIMELINE / MIJLPALEN ============ -->
  <section id="milestones" class="afs-section">
    <div class="afs-stage">
      <h2 class="afs-t-display">Mijlpalen per jaar</h2>
      <p class="afs-t-lead mt-4">
        Navigeer door de sleutelmomenten die de AI-industrie hebben gevormd.
      </p>

      <div class="afs-year-track mt-6">
        <button
          v-for="(year, i) in YEARS"
          :key="year"
          type="button"
          class="afs-yr"
          :class="{ 'afs-yr--active': yearIndex === i }"
          @click="selectYear(i)"
        >
          {{ year }}
        </button>
      </div>

      <!-- vaste minimumhoogte op desktop: inhoud wisselt binnenin, maar de pager
           en knoppen eronder verspringen niet meer per kwartaal -->
      <div
        class="mt-6 flex flex-col justify-center rounded-cf bg-form p-6 lg:min-h-[460px] lg:p-12"
        @mouseenter="stop"
        @mouseleave="start"
      >
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <!-- left: key releases of the active quarter -->
          <div class="lg:col-span-5">
            <div class="mb-4">
              <span class="afs-chip afs-chip--lg">{{ current.period }} {{ activeYear }}</span>
            </div>
            <div class="rounded-cf bg-white px-7 py-6">
              <div class="afs-t-cap mb-4 text-muted">Belangrijkste releases</div>
              <div class="flex flex-wrap gap-[10px]">
                <span
                  v-for="(chip, ci) in current.chips"
                  :key="chip"
                  class="afs-chip"
                  :class="{ 'afs-chip--green': ci === 0 }"
                >
                  {{ chip }}
                </span>
              </div>
            </div>
          </div>

          <!-- right: milestone detail for the active quarter -->
          <div class="lg:col-span-7">
            <h3 class="afs-t-h2 mb-4 text-black">{{ current.title }}</h3>
            <p class="afs-t-body max-w-[680px]">{{ current.body }}</p>

            <div class="mt-6 max-w-[680px]">
              <div class="afs-t-body mb-2 text-black">{{ current.impactLabel }}</div>
              <div class="afs-progress-line">
                <span :style="{ width: current.impactPct + '%' }" />
              </div>
              <div class="afs-t-cap relative mt-2 h-[1.4em]">
                <span class="absolute left-0">Laag</span>
                <span class="absolute right-0">Hoog</span>
              </div>
            </div>

            <p class="afs-t-src mt-6 max-w-[680px]">Bronnen: {{ current.sources }}</p>
          </div>
        </div>
      </div>

      <!-- nav cluster + pager -->
      <div class="mt-12">
        <div class="flex items-center justify-center gap-4">
          <button type="button" class="afs-nav-square" aria-label="vorige" @click="step(-1)">
            <IconArrowLeft class="h-6 w-6" />
          </button>
          <!-- één stip per kwartaal van het actieve jaar -->
          <div class="afs-dots">
            <i v-for="(m, qi) in quarters" :key="qi" :class="{ 'afs-on': qi === quarterIndex }" />
          </div>
          <button type="button" class="afs-nav-square" aria-label="volgende" @click="step(1)">
            <IconArrow class="h-6 w-6" />
          </button>
        </div>
        <div class="mt-3 flex items-center justify-center gap-4">
          <span class="pageno text-base text-muted">
            Kwartaal {{ quarterIndex + 1 }} / 4 · {{ activeYear }}
          </span>
          <button
            type="button"
            class="text-base text-muted underline underline-offset-4"
            :aria-label="playing ? 'pauzeer slider' : 'speel slider af'"
            @click="togglePlay"
          >
            {{ playing ? "Pauze" : "Afspelen" }}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ WAT AI KOST EN OPLEVERT ============ -->
  <section id="impact" class="afs-section">
    <div class="afs-stage">
      <h2 class="afs-t-display">Wat AI de wereld kost en oplevert</h2>
      <p class="afs-t-lead mt-4">
        Trainingskosten, energieverbruik, CO₂-uitstoot en economische waarde in
        harde cijfers.
      </p>

      <div class="mt-4 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div class="lg:col-span-8">
          <div class="h-full rounded-cf bg-form p-6 xl:p-12">
            <h3 class="afs-t-h2 mb-6">Trainingskosten grote modellen</h3>
            <div class="overflow-x-auto">
              <table class="afs-cost-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Organisatie</th>
                    <th>Jaar</th>
                    <th>Trainingskosten (Schatting)</th>
                    <th>Parameters</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in costRows" :key="row.model">
                    <td>{{ row.model }}</td>
                    <td>{{ row.org }}</td>
                    <td>{{ row.year }}</td>
                    <td>{{ row.cost }}</td>
                    <td>{{ row.params }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="afs-t-src mt-6">
              Bronnen: Lambda Labs (2020); Epoch AI compute estimates (2023–2024);
              Sam Altman / The Information (2023); The Information "Google's Gemini"
              (dec. 2023); SemiAnalysis training cost analyses. Alle bedragen zijn
              schattingen.
            </p>
          </div>
        </div>

        <div class="lg:col-span-4">
          <div class="h-full rounded-cf bg-form p-6 xl:p-12">
            <h3 class="afs-t-h2 mb-4">Wat zijn Parameters?</h3>
            <p class="afs-t-body text-[18px]">
              Een AI-model gebruikt parameters om signalen en informatie te
              verwerken. Bij neurale netwerken zijn het bijvoorbeeld gewichten en
              bias-waarden.
            </p>
            <div class="text-base leading-[1.5] text-muted">
              <p class="mt-4">
                Dit zijn de waarden die het model zelf leert tijdens de training.
                Ze veranderen continu terwijl het model fouten maakt en corrigeert.
                Voorbeelden zijn gewichten en bias, deze bepalen hoe sterk input
                wordt meegewogen in de uiteindelijke voorspelling.
              </p>
              <h4 class="mb-[6px] mt-4 text-[20px] font-medium text-muted">
                Waarom zijn parameters belangrijk?
              </h4>
              <p class="mb-1">Zij bepalen direct:</p>
              <ul class="m-0 list-disc pl-[1.1em]">
                <li>Hoe nauwkeurig een model voorspelt,</li>
                <li>Of een model te simpel of te complex wordt,</li>
                <li>Hoe goed het model generaliseert naar nieuwe data.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ ENERGIEVERBRUIK & CO2 ============ -->
  <section class="afs-section afs-section--flush-top">
    <div class="afs-stage">
      <h2 class="afs-t-h2 mb-6">Energieverbruik &amp; CO₂-uitstoot</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          v-for="card in energyCards"
          :key="card.lbl"
          :big="card.big"
          :lbl="card.lbl"
          :sub="card.sub"
          :src="card.src"
          :emoji="card.emoji"
          :img="card.img"
          :img-w="card.imgW"
          :img-h="card.imgH"
        />
      </div>
    </div>
  </section>

  <!-- ============ MARKTGROEI ============ -->
  <section class="afs-section afs-section--flush-top">
    <div class="afs-stage">
      <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <!-- chart -->
        <div class="lg:col-span-7">
          <div class="h-full rounded-cf bg-form p-[34px]">
            <h3 class="afs-t-h2">Marktgroei &amp; gebruikersaantallen</h3>
            <div class="mt-[18px] rounded-[4px] bg-white px-6 pt-6">
              <div class="afs-chart">
                <div v-for="bar in marketBars" :key="bar.year" class="afs-col">
                  <div class="afs-bar" :class="bar.cls" :style="{ height: bar.height }">
                    {{ bar.value }}
                  </div>
                  <div class="pt-3 text-center text-base text-muted">{{ bar.year }}</div>
                </div>
              </div>
            </div>
            <p class="afs-t-src mb-0 mt-4">
              Bronnen: IDC Worldwide AI Spending Guide (2024); Goldman Sachs (apr.
              2024). *2030 = prognose.
            </p>
          </div>
        </div>

        <!-- right: 3 wide stats -->
        <div class="lg:col-span-5">
          <div class="flex h-full flex-col gap-6">
            <WideStat
              v-for="stat in economicStats"
              :key="stat.lbl"
              :big="stat.big"
              :lbl="stat.lbl"
              :src="stat.src"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
