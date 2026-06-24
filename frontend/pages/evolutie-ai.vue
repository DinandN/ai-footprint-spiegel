<script setup lang="ts">
// AI-history / evolution infographic. Mostly static editorial content; the year
// selector + prev/next pager are interactive. Per-year milestone content and the
// 9-step pager are static placeholders (no dataset available — see TODOs).

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

const YEARS = ["2022", "2023", "2024"];
const activeYear = ref("2024");

function selectYear(year: string) {
  activeYear.value = year;
}
// TODO: per-year mijlpaal-detail + pagination vereisen een dataset met alle
// mijlpalen; nu wisselt alleen de jaar-markering.
function step(dir: number) {
  const i = YEARS.indexOf(activeYear.value);
  activeYear.value = YEARS[(i + dir + YEARS.length) % YEARS.length];
}

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
          v-for="year in YEARS"
          :key="year"
          type="button"
          class="afs-yr"
          :class="{ 'afs-yr--active': activeYear === year }"
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>

      <div class="mt-6 rounded-cf bg-form p-6 lg:p-12">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <!-- left: process diagram -->
          <div class="lg:col-span-5">
            <div class="mb-4"><span class="afs-chip afs-chip--lg">Mei - Oktober</span></div>
            <div class="afs-process-box">
              <div class="afs-process">
                <span class="afs-chip">Brainstorm</span>
                <span class="afs-chip">Plan</span>
                <span class="afs-chip">Design</span>
                <span class="afs-chip">Bouw</span>
                <span class="afs-chip afs-chip--lg afs-chip--green afs-hub">AI Agent</span>
              </div>
            </div>
          </div>

          <!-- right: milestone detail (TODO: per-year content from a dataset) -->
          <div class="lg:col-span-7">
            <h3 class="afs-t-h2 mb-4 text-black">
              AI-agenten — Autonome taakuitvoering
            </h3>
            <p class="afs-t-body max-w-[680px]">
              GPT-4o (mei), Claude 3.5 Sonnet (jun.) en Gemini 1.5 Pro markeren het
              tijdperk van de AI-agent. Systemen plannen, zoeken en voeren
              meerstapstaken zelfstandig uit. McKinsey schat dat 60–70% van
              kenniswerk automatiseerbaar wordt.
            </p>

            <div class="mt-6 max-w-[680px]">
              <div class="afs-t-body mb-2 text-black">Arbeidsmarkt Impact</div>
              <div class="afs-progress-line"><span /></div>
              <div class="afs-t-cap relative mt-2 h-[1.4em]">
                <span class="absolute left-0">0%</span>
                <span class="absolute left-[88%] -translate-x-1/2">95%</span>
                <span class="absolute right-0">100%</span>
              </div>
            </div>

            <p class="afs-t-src mt-6 max-w-[680px]">
              Bronnen: OpenAI product announcements (mei 2024); McKinsey Global
              Institute "The economic potential of generative AI" (jun. 2023);
              Reuters ChatGPT 200M users (aug. 2024).
            </p>
          </div>
        </div>
      </div>

      <!-- nav cluster + pager -->
      <div class="mt-12">
        <div class="flex items-center justify-center gap-4">
          <button type="button" class="afs-nav-square" aria-label="vorige" @click="step(-1)">
            <IconArrowLeft class="h-6 w-6" />
          </button>
          <!-- TODO: pagination weerspiegelt 9 mijlpalen zodra die als data bestaan. -->
          <div class="afs-dots">
            <i /><i /><i /><i /><i /><i /><i /><i class="afs-on" /><i />
          </div>
          <button type="button" class="afs-nav-square" aria-label="volgende" @click="step(1)">
            <IconArrow class="h-6 w-6" />
          </button>
        </div>
        <div class="pageno mt-2 text-center text-base text-muted">9/9</div>
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
