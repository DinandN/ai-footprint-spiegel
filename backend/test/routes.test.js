// HTTP-level tests for the Express API (businesslaag, chapter 8 of the TO).
//
// Offline by design: in-memory database + mock providers. The app is imported
// (server.js does not auto-listen on import) and driven on an ephemeral port via
// the built-in fetch — no extra test dependency needed.
process.env.DB_PATH = ":memory:";
process.env.MOCK_PROVIDERS = "true";

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server");

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
});

function postJson(path, body) {
  return fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("GET /api/models geeft de geseede modellen", async () => {
  const res = await fetch(`${base}/api/models`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.models));
  assert.ok(data.models.length >= 1);
});

test("GET /api/footprint/:id geeft de referentieberekening", async () => {
  const res = await fetch(`${base}/api/footprint/gemini-2.5-flash`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.model.id, "gemini-2.5-flash");
  assert.ok(Number.isFinite(data.footprint.energyWh));
});

test("POST /api/compare zonder prompt geeft 400", async () => {
  const res = await postJson("/api/compare", { modelIds: ["gemini-2.5-flash"] });
  assert.equal(res.status, 400);
});

test("POST /api/compare zonder modellen geeft 400", async () => {
  const res = await postJson("/api/compare", { prompt: "hallo" });
  assert.equal(res.status, 400);
});

test("POST /api/compare geeft resultaten met footprint", async () => {
  const res = await postJson("/api/compare", {
    prompt: "Een route-testvraag",
    modelIds: ["gemini-2.5-flash", "llama-3.2-3b"],
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.results.length, 2);
  assert.ok(data.results.every((r) => r.ok && r.footprint));
});

test("GET /api/examples groeit nadat een vraag is verstuurd", async () => {
  const q = "Route pool-groei vraag";
  const before = (await (await fetch(`${base}/api/examples`)).json()).examples;
  assert.ok(!before.includes(q));

  await postJson("/api/compare", { prompt: q, modelIds: ["llama-3.2-3b"] });

  const after = (await (await fetch(`${base}/api/examples`)).json()).examples;
  assert.ok(after.includes(q));
});

test("POST /api/session/reset slaagt", async () => {
  const res = await fetch(`${base}/api/session/reset`, { method: "POST" });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
});

test("een onbekende route geeft 404", async () => {
  const res = await fetch(`${base}/api/bestaat-niet`);
  assert.equal(res.status, 404);
});
