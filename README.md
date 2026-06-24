# AI Footprint Spiegel

Een lokaal gehoste kiosk-webapp die acht AI-modellen naast elkaar vergelijkt op
hun **output** én hun **duurzaamheidsimpact** (energie, water, CO₂, kosten).
Ontwikkeld als artefact voor het Lectoraat Data Intelligence (project _Optimize |
Duurzame Technologie in Beeld_) — Zuyd Hogeschool.

Dit is de eerste opzet (scaffold + kernlogica) op basis van het Technisch Ontwerp v1.0.0.

## Vergeleken modellen

| Model | Provider | Type | P_active (mld) |
| --- | --- | --- | --- |
| Gemini 2.5 Pro | Google | cloud | 200 (schatting) |
| Gemini 2.5 Flash | Google | cloud | 70 (schatting) |
| Gemini 2.5 Flash-Lite | Google | cloud | 20 (schatting) |
| Claude Opus 4.8 | Anthropic | cloud | 200 (schatting) |
| Claude Sonnet 4.6 | Anthropic | cloud | 70 (schatting) |
| Claude Haiku 4.5 | Anthropic | cloud | 20 (schatting) |
| Llama 3.2 3B | Ollama (lokaal) | local | 3 (bekend) |
| Qwen 2.5 3B | Ollama (lokaal) | local | 3 (bekend) |

## Architectuur (drielagen)

```
Gebruiker (kiosk)
      │
┌─────┴───────────────────── Lokale Server (Windows 11) ─────────────────────┐
│  Front-end  : Nuxt (Vue 3, TypeScript)        — poort 3000                  │
│      │ RESTful API                                                          │
│  Back-end   : Node.js + Express               — poort 3001                  │
│      ├─ services/  footprintCalculator (EcoLogits-methode)                  │
│      ├─ providers/ google · anthropic · ollama (nu mock-responses)          │
│      └─ db/        SQLite (modellen, factoren, cache)                       │
└──────────────────────────────────────────────────────┬────────────────────┘
                                                        │ HTTPS 443 (live calls, later)
                                            Externe AI-providers (Google, Anthropic)
```

## Status van deze opzet

- ✅ **Footprint-berekening** volledig werkend en gevalideerd tegen Tabel 3 van het TO
  (`backend/services/footprintCalculator.js`, test: `npm test`).
- ✅ **Database** met schema + seed van alle 8 modellen en hun factoren (SQLite).
- ✅ **Endpoints** uit hoofdstuk 8 functioneel bedraad.
- ✅ **Anthropic (Claude)** doet echte API-calls met de echte tokenaantallen uit
  de `usage`-response (key via `backend/.env`). Opus, Sonnet en Haiku zijn live.
- 🟡 **Google & Ollama** geven nog mock-responses terug — de echte koppelingen
  zijn als duidelijke `TODO(live)` gemarkeerd. Met `MOCK_PROVIDERS=true` in `.env`
  forceer je alle providers terug op mock (handig zonder keys / voor tests).
- 🟡 **Front-end** is een functionele stub: prompt invoeren, modellen kiezen,
  vergelijking ophalen en tonen. De definitieve kiosk-UI/styling volgt later.

## Aan de slag

### Back-end

```bash
cd backend
cp .env.example .env      # keys mogen nu leeg blijven (providers zijn mock)
npm install
npm run seed              # maakt en vult db/footprint.db
npm test                  # valideert de footprint-berekening tegen Tabel 3
npm run dev               # start API op http://localhost:3001
```

### Front-end

```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # start kiosk op http://localhost:3000
```

## Endpoints

| Methode | Endpoint | Beschrijving |
| --- | --- | --- |
| GET | `/api/models` | Alle modellen incl. metadata en footprint-factoren |
| GET | `/api/models/:id` | Eén specifiek model |
| POST | `/api/compare` | Prompt naar geselecteerde modellen, met footprint-metrics |
| GET | `/api/footprint/:modelId` | Footprint-factoren + referentieberekening van een model |
| POST | `/api/session/reset` | Reset de kiosk-sessie en wist tijdelijke gegevens |

## Berekeningsmethode

EcoLogits-gebaseerd (hoofdstuk 5 TO). Energie per verzoek:

```
E = T_out × (α × P_active + β) × PUE      α = 8,91e-5   β = 1,43e-3   (Wh/token)
```

Daarna: CO₂ = E × CI, water = E × WI, kosten uit officiële tokenprijzen (cloud) of
lokaal stroomverbruik (Ollama). Alle factoren staan centraal in
`backend/config/constants.js`.

> Let op: de kostenwaarden voor de Gemini-rijen in Tabel 3 van het TO lijken met een
> afwijkende wisselkoers te zijn berekend (≈0,846 i.p.v. 0,92). Deze implementatie
> volgt de gedocumenteerde methode (USD × 0,92); energie/CO₂/water reproduceren Tabel 3
> exact, Gemini-kosten wijken daardoor ~8% af van die tabel. Zie de test voor details.
