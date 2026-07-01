<script setup lang="ts">
// Decorative mock of the AI-process flow shown beside the hero copy:
// a prompt input that types an example question, an "AI Denkt..." pill whose
// gear spins while thinking, and a result card whose four footprint metrics
// count up. The whole sequence loops. Purely illustrative — the real
// comparison lives on /challenger.

import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { METRICS, analogy, type MetricKey } from "~/utils/results";

// Fallback shown during SSR and if the example pool can't be fetched.
const DEFAULT_QUESTION =
  "Leg quantumcomputing uit in één alinea voor een middelbare scholier.";
const MAX_CHARS = 100;

const TYPE_MS = 42;
const PAUSE_AFTER_TYPE_MS = 500;
const THINK_MS = 1600;
const COUNT_MS = 1400;
const HOLD_MS = 2600;

type Phase = "typing" | "thinking" | "counting" | "done";

// The "Verras me" pool: built-in examples plus every prompt users submitted.
const { examples, loadExamples } = useCompare();

// Collapse whitespace and truncate over-long prompts so they fit the input box.
function prepare(raw: string): string {
  const oneLine = raw.replace(/\s+/g, " ").trim();
  return oneLine.length > MAX_CHARS
    ? oneLine.slice(0, MAX_CHARS - 1).trimEnd() + "…"
    : oneLine;
}

// Initial state is the finished cycle so SSR and the first client render match
// (no hydration flash); the loop starts by holding on this state.
const typed = ref(prepare(DEFAULT_QUESTION));
const progress = ref(1);
const phase = ref<Phase>("done");

const spinning = computed(
  () => phase.value === "thinking" || phase.value === "counting",
);

let qIndex = 0;

// A realistic example footprint — Claude Haiku 4.5 answering the quantum example
// prompt — so the mock mirrors a real result. Each metric's value formatting and
// everyday analogy are derived from the same helpers as the results page, so the
// numbers shown here match what /challenger actually computes.
const EXAMPLE_FOOTPRINT: Record<MetricKey, number> = {
  energy: 0.996,
  water: 1.793,
  co2: 0.416,
  cost: 0.00132,
};

const metrics = [
  {
    key: "energy",
    label: "Energie",
    unit: "Wh",
    iconColor: "text-energy",
    valueColor: "text-energy",
    icon: "M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z",
  },
  {
    key: "water",
    label: "Water",
    unit: "ml",
    iconColor: "text-water",
    valueColor: "text-water",
    icon: "M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z",
  },
  {
    key: "co2",
    label: "CO₂",
    unit: "g",
    iconColor: "text-[#8a8f96]",
    valueColor: "text-ink",
    icon: "M7 18a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18 9.5a4 4 0 0 1-1 8H7z",
  },
  {
    key: "cost",
    label: "Kosten",
    unit: "Euro",
    iconColor: "text-cost",
    valueColor: "text-cost",
    icon: "M3 7.5A2.5 2.5 0 0 1 5.5 5H17a1 1 0 0 1 1 1v1.5H5.5a.5.5 0 0 0 0 1H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7.5zm13.5 5.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z",
  },
].map((m) => {
  const def = METRICS.find((d) => d.key === m.key)!;
  const value = EXAMPLE_FOOTPRINT[m.key as MetricKey];
  return { ...m, target: value, decimals: def.decimals, note: analogy(value, def) };
});

let stopped = false;
const timeouts = new Set<ReturnType<typeof setTimeout>>();
let rafId = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      timeouts.delete(id);
      resolve();
    }, ms);
    timeouts.add(id);
  });
}

function countUp(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const step = (now: number) => {
      if (stopped) return resolve();
      const t = Math.min(1, (now - start) / durationMs);
      progress.value = 1 - Math.pow(1 - t, 3);
      if (t < 1) rafId = requestAnimationFrame(step);
      else resolve();
    };
    rafId = requestAnimationFrame(step);
  });
}

async function runLoop() {
  while (!stopped) {
    phase.value = "done";
    await sleep(HOLD_MS);
    if (stopped) return;

    const pool = examples.value.length ? examples.value : [DEFAULT_QUESTION];
    const question = prepare(pool[qIndex % pool.length]);
    qIndex += 1;

    typed.value = "";
    progress.value = 0;
    phase.value = "typing";
    for (let i = 1; i <= question.length; i++) {
      if (stopped) return;
      typed.value = question.slice(0, i);
      await sleep(TYPE_MS);
    }
    await sleep(PAUSE_AFTER_TYPE_MS);
    if (stopped) return;

    phase.value = "thinking";
    await sleep(THINK_MS);
    if (stopped) return;

    phase.value = "counting";
    await countUp(COUNT_MS);
  }
}

onMounted(async () => {
  const reduce = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduce) return;
  try {
    await loadExamples();
  } catch {
    // Pool falls back to DEFAULT_QUESTION; the mock is decorative.
  }
  if (stopped) return;
  runLoop();
});

onBeforeUnmount(() => {
  stopped = true;
  for (const id of timeouts) clearTimeout(id);
  timeouts.clear();
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div class="mx-auto mt-10 w-full max-w-[750px] lg:mx-0 lg:ml-auto lg:mt-0">
    <!-- Prompt input: an example question is typed in -->
    <div class="relative min-h-[100px] rounded-cf bg-form px-4 pt-[14px]">
      <p
        class="min-h-[46px] pr-9 text-base leading-[1.45] text-ink"
        :class="phase === 'typing' ? 'afs-caret' : ''"
      >{{ typed }}</p>
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
        class="relative z-[1] inline-flex h-[50px] w-[200px] items-center gap-[10px] rounded-cf border-2 bg-card px-4 transition-colors"
        :class="spinning ? 'border-primary' : 'border-muted'"
      >
        <svg
          class="h-7 w-7 flex-none transition-colors"
          :class="spinning ? 'text-primary' : 'text-icon'"
          viewBox="0 0 36 36"
          fill="currentColor"
          aria-hidden="true"
        >
          <g :class="spinning ? 'afs-gear-spin' : ''">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.1895 3C20.0497 3 20.4799 3.00027 20.7656 3.25879C21.0513 3.51738 21.0942 3.9457 21.1797 4.80176L21.2539 5.53906C21.417 7.17249 21.4981 7.98963 22.0508 8.21875C22.6035 8.44779 23.2392 7.92799 24.5098 6.88867L25.085 6.41797C25.7503 5.8737 26.0831 5.60197 26.4678 5.62109C26.8525 5.6403 27.1567 5.94384 27.7646 6.55176L29.4473 8.23438C30.0556 8.84268 30.3597 9.14737 30.3789 9.53223C30.398 9.91696 30.1256 10.2495 29.5811 10.915L29.1123 11.4893C28.0728 12.7595 27.5525 13.3945 27.7812 13.9473C28.0101 14.5 28.8269 14.5815 30.46 14.7451L31.1992 14.8193C32.055 14.9051 32.4827 14.9487 32.7412 15.2344C32.9996 15.52 33 15.9497 33 16.8096V19.1895C33 20.0497 32.9997 20.4799 32.7412 20.7656C32.4826 21.0513 32.0543 21.0942 31.1982 21.1797L30.4609 21.2539C28.8276 21.417 28.0103 21.4981 27.7812 22.0508C27.5522 22.6036 28.0727 23.2391 29.1123 24.5098L29.582 25.084C30.1264 25.7493 30.398 26.0822 30.3789 26.4668C30.3597 26.8516 30.0564 27.1564 29.4482 27.7646L27.7656 29.4473C27.1574 30.0557 26.8526 30.3597 26.4678 30.3789C26.083 30.398 25.7497 30.1258 25.084 29.5811L24.5098 29.1113C23.2391 28.0717 22.6036 27.5522 22.0508 27.7812C21.4983 28.0105 21.417 28.8275 21.2539 30.4609L21.1797 31.1982C21.0942 32.0543 21.0513 32.4826 20.7656 32.7412C20.4799 32.9997 20.0497 33 19.1895 33H16.8096C15.9497 33 15.52 32.9996 15.2344 32.7412C14.9487 32.4827 14.9051 32.055 14.8193 31.1992L14.7451 30.46C14.5815 28.8269 14.5 28.0101 13.9473 27.7812C13.3945 27.5525 12.7595 28.0728 11.4893 29.1123L10.915 29.5811C10.2495 30.1256 9.91696 30.398 9.53223 30.3789C9.14737 30.3597 8.84268 30.0556 8.23438 29.4473L6.55176 27.7646C5.94384 27.1567 5.6403 26.8525 5.62109 26.4678C5.60197 26.0831 5.8737 25.7503 6.41797 25.085L6.88867 24.5098C7.92799 23.2392 8.44779 22.6035 8.21875 22.0508C7.98963 21.4981 7.17249 21.417 5.53906 21.2539L4.80078 21.1797C3.94506 21.0942 3.51733 21.0513 3.25879 20.7656C3.00027 20.4799 3 20.0497 3 19.1895V16.8096C3 15.9497 3.00037 15.52 3.25879 15.2344C3.51731 14.9487 3.94501 14.9059 4.80078 14.8203L5.54004 14.7461C7.17314 14.5828 7.98974 14.5009 8.21875 13.9482C8.44774 13.3955 7.92797 12.7598 6.88867 11.4893L6.41797 10.9141C5.8737 10.2487 5.60197 9.9159 5.62109 9.53125C5.6403 9.14653 5.94384 8.8423 6.55176 8.23438L8.23438 6.55176C8.84262 5.94351 9.14739 5.63931 9.53223 5.62012C9.91696 5.60102 10.2494 5.87341 10.915 6.41797L11.4893 6.8877C12.7598 7.92719 13.3954 8.44673 13.9482 8.21777C14.501 7.9888 14.5827 7.17155 14.7461 5.53809L14.8203 4.80078C14.9059 3.94501 14.9487 3.51731 15.2344 3.25879C15.52 3.00038 15.9497 3 16.8096 3H19.1895ZM18 12C14.6863 12 12 14.6863 12 18C12 21.3137 14.6863 24 18 24C21.3137 24 24 21.3137 24 18C24 14.6863 21.3137 12 18 12Z"
            />
          </g>
        </svg>
        <span class="text-base text-muted">AI Denkt...</span>
      </div>
    </div>

    <!-- Result card: the metrics count up once thinking finishes -->
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
            'mt-[14px] text-[22px] leading-[1.05] md:text-[25px] tabular-nums',
            m.valueColor,
          ]"
        >
          {{ (m.target * progress).toFixed(m.decimals) }}
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

<style scoped>
.afs-caret::after {
  content: "";
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.18em;
  background: currentColor;
  animation: afs-blink 1s step-end infinite;
}

@keyframes afs-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* Rotate around the gear's own geometry centre so it spins in place. */
.afs-gear-spin {
  transform-box: fill-box;
  transform-origin: center;
  animation: afs-gear-rotate 1.5s linear infinite;
}

@keyframes afs-gear-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .afs-caret::after,
  .afs-gear-spin {
    animation: none;
  }
}
</style>
