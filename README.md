# AI Footprint Spiegel

Een lokaal gehoste kiosk-webapp die zeven AI-modellen naast elkaar vergelijkt op
hun **output** én hun **duurzaamheidsimpact** (energie, water, CO₂, kosten).
Ontwikkeld als artefact voor het Lectoraat Data Intelligence (project _Optimize |
Duurzame Technologie in Beeld_) — Zuyd Hogeschool.

## Vergeleken modellen

| Model | Provider | Type | P_active (mld) |
| --- | --- | --- | --- |
| Gemini 2.5 Flash | Google | cloud | 70 (schatting) |
| Gemini 2.5 Flash-Lite | Google | cloud | 20 (schatting) |
| Claude Opus 4.8 | Anthropic | cloud | 200 (schatting) |
| Claude Sonnet 4.6 | Anthropic | cloud | 70 (schatting) |
| Claude Haiku 4.5 | Anthropic | cloud | 20 (schatting) |
| Llama 3.2 3B | Ollama (lokaal) | local | 3 (bekend) |
| Qwen 2.5 3B | Ollama (lokaal) | local | 3 (bekend) |

> Gemini 2.5 Pro is bewust weggelaten: het heeft geen gratis Google-tier (gratis
> quota = 0) en is dus niet zonder betaalde billing te draaien. De zeven modellen
> dekken alle drie de providers en drie grootteklassen (groot/middel/klein).

## Architectuur

```
Gebruiker (kiosk)
      │
┌─────┴───────────────────────── Lokale machine ─────────────────────────────┐
│  Front-end  : Nuxt (Vue 3, TypeScript) + Tailwind   — poort 3000            │
│      │ RESTful API                                                          │
│  Back-end   : Node.js + Express                     — poort 3001            │
│      ├─ services/  footprintCalculator (EcoLogits-methode) + score          │
│      ├─ providers/ google + anthropic + ollama                              │
│      └─ db/        SQLite (modellen, factoren, cache)                       │
└──────────────────────────────────────────────────────┬────────────────────┘
                                                        │ HTTPS (live API calls)
                                            Externe AI-providers (Google, Anthropic)
```

Cloud-modellen (Gemini, Claude) draaien via hun API; de open modellen (Llama,
Qwen) draaien lokaal via [Ollama](https://ollama.com). De footprint wordt per
verzoek berekend uit de werkelijke tokenaantallen.

## Vereisten

- **Node.js** (LTS v20 of v22 aanbevolen) en **Git**
- **Ollama** voor de twee lokale modellen (optioneel — zie hieronder)
- API-keys voor Gemini en/of Claude (optioneel — zonder keys vallen die
  providers terug op een mock-antwoord)

## Setup & starten

Cross-platform (Windows en Mac identiek):

```bash
git clone https://github.com/DinandN/ai-footprint-spiegel.git
cd ai-footprint-spiegel
npm run setup        # installeert deps, maakt .env-bestanden, haalt Ollama-modellen op
npm run dev          # start front-end (:3000) + back-end (:3001) samen
```

Open daarna **http://localhost:3000**.

> `npm run setup` is een Node-script (geen shell-magie), dus het werkt hetzelfde
> op Windows en Mac.

### API-keys (optioneel)

Zet je keys in `backend/.env` (dit bestand komt nooit in Git):

```
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

Zonder key geeft die provider een duidelijk gelabeld mock-antwoord terug. Zet
`MOCK_PROVIDERS=true` in `backend/.env` om alle providers te forceren naar mock
(handig voor ontwikkelen zonder keys of voor tests).

### Ollama (voor de lokale modellen)

Eenmalig installeren:

- **Windows:** `winget install Ollama.Ollama` (of https://ollama.com/download/windows)
- **Mac:** `brew install ollama` (of https://ollama.com/download/mac)

Zorg dat de Ollama-service draait (Windows: start automatisch na installatie;
Mac: `ollama serve` of open de Ollama-app). Haal daarna de modellen op met
`npm run pull-models` (of opnieuw `npm run setup`). Ollama draait volledig lokaal
en heeft geen internet of API-key nodig.

### Handmatig per onderdeel

```bash
# Back-end
cd backend && npm install && npm run seed && npm run dev   # http://localhost:3001

# Front-end (andere terminal)
cd frontend && npm install && npm run dev                  # http://localhost:3000
```

## Endpoints

| Methode | Endpoint | Beschrijving |
| --- | --- | --- |
| GET | `/api/models` | Alle modellen incl. metadata en footprint-factoren |
| GET | `/api/models/:id` | Eén specifiek model |
| POST | `/api/compare` | Prompt naar geselecteerde modellen, met footprint-metrics |
| GET | `/api/footprint/:modelId` | Footprint-factoren + referentieberekening van een model |
| POST | `/api/session/reset` | Reset de kiosk-sessie en wist tijdelijke gegevens |

## Berekening

EcoLogits-gebaseerd (hoofdstuk 5 van het Technisch Ontwerp). Energie per verzoek:

```
E = T_out × (α × P_active + β) × PUE      α = 8,91e-5   β = 1,43e-3   (Wh/token)
```

Daarna: CO₂ = E × CI, water = E × WI, kosten uit officiële tokenprijzen (cloud)
of lokaal stroomverbruik (Ollama). Alle omrekenfactoren staan centraal in
`backend/config/constants.js`.

### Score

Elk model krijgt een **gesummeerde score** (max 100), als som over de vier
metrics. Per metric krijgt het zuinigste model **25 punten**; de rest krijgt tot
24 punten, geschaald naar hoe dicht het bij de beste zit
(`beste / eigen waarde × 24`). Op de resultatenpagina staat de beste bovenaan:
gesorteerd op de gekozen metric, of op totaalscore in het overzicht.

## Tests

```bash
cd backend  && npm test        # footprint-berekening, gevalideerd tegen het TO
cd frontend && npm test        # componenten, pagina's en view-logica (Vitest)
```
