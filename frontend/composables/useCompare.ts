// Shared comparison state + API calls between the start and result pages.
// Uses Nuxt's useState so prompt, selection and results survive navigation.

export interface Model {
  id: string;
  name: string;
  provider: string;
  type: "cloud" | "local";
  pActiveBillions: number;
  priceInputPerMTokens: number | null;
  priceOutputPerMTokens: number | null;
}

export interface Footprint {
  energyWh: number;
  co2Grams: number;
  waterMl: number;
  costEur: number;
  inputTokens: number;
  outputTokens: number;
}

export interface CompareResult {
  modelId: string;
  ok: boolean;
  cached?: boolean;
  model?: { id: string; name: string; provider?: string; type?: string };
  response?: string;
  footprint?: Footprint;
  error?: string;
}

export function useCompare() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase as string;

  const models = useState<Model[]>("models", () => []);
  const prompt = useState<string>("prompt", () => "");
  const selectedIds = useState<string[]>("selectedIds", () => []);
  const results = useState<CompareResult[]>("results", () => []);
  const loading = useState<boolean>("loading", () => false);
  const error = useState<string | null>("error", () => null);
  // The "Verras me" pool — grows server-side as users submit prompts.
  const examples = useState<string[]>("examples", () => []);

  async function loadModels() {
    const data = await $fetch<{ models: Model[] }>(`${apiBase}/models`);
    models.value = data.models;
  }

  async function loadExamples() {
    const data = await $fetch<{ examples: string[] }>(`${apiBase}/examples`);
    examples.value = data.examples;
  }

  function toggleModel(id: string) {
    const idx = selectedIds.value.indexOf(id);
    if (idx === -1) selectedIds.value.push(id);
    else selectedIds.value.splice(idx, 1);
  }

  async function runCompare() {
    if (!prompt.value.trim() || selectedIds.value.length === 0) return;
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<{ results: CompareResult[] }>(
        `${apiBase}/compare`,
        {
          method: "POST",
          body: { prompt: prompt.value, modelIds: selectedIds.value },
        },
      );
      results.value = data.results;
    } catch (err: unknown) {
      error.value = "Vergelijking mislukt. Draait de back-end?";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function resetSession() {
    try {
      await $fetch(`${apiBase}/session/reset`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    prompt.value = "";
    selectedIds.value = [];
    results.value = [];
    error.value = null;
  }

  return {
    models,
    prompt,
    selectedIds,
    results,
    loading,
    error,
    examples,
    loadModels,
    loadExamples,
    toggleModel,
    runCompare,
    resetSession,
  };
}
