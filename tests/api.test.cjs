const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function loadHandler(relativePath, generateText = async () => ({ text: "{}" })) {
  let source = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");
  source = source
    .replace(/^\s*import\s+\{\s*ai\s*\}\s+from\s+["']hatchable["'];?\s*/m, "")
    .replace(/\bexport\s+const\s+/g, "const ")
    .replace(/\bexport\s+default\s+async\s+function\s+handler\b/, "async function handler");
  const sandbox = {
    ai: { generateText },
    console: { error() {} },
    Date,
    JSON,
    Math,
    Number,
    Set,
    String,
    Boolean,
    Array,
    Object
  };
  vm.runInNewContext(`${source}\n;globalThis.__testHandler = handler;`, sandbox, {
    filename: relativePath,
    timeout: 1000
  });
  return sandbox.__testHandler;
}

async function invoke(handler, req = {}) {
  const result = { status: 200, body: undefined };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; }
  };
  await handler(req, res);
  return result;
}

const goodReviewResult = (id = "r1", extra = {}) => ({
  id,
  theme: "Delivery delays",
  sentiment: "negative",
  confidence: 0.91,
  rationale: "The review explicitly reports a late delivery.",
  signals: ["arrived late"],
  needs_human_review: false,
  ...extra
});

test("health endpoint returns a timestamped OK response", async () => {
  const handler = loadHandler("api/health-check.js");
  const result = await invoke(handler, { method: "GET" });
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.route, "/api/health-check");
  assert.equal(result.body.method, "GET");
  assert.ok(Number.isFinite(Date.parse(result.body.checkedAt)));
});

test("AI Review rejects empty and oversized batches", async () => {
  const handler = loadHandler("api/analyze-feedback.js");
  assert.equal((await invoke(handler, { body: { reviews: [] } })).status, 400);
  assert.equal((await invoke(handler, { body: { reviews: Array.from({length: 6}, (_, i) => ({id: String(i), text: "review"})) } })).status, 400);
});

test("AI Review rejects batches without non-empty text", async () => {
  const handler = loadHandler("api/analyze-feedback.js");
  const result = await invoke(handler, { body: { reviews: [{ id: "x", text: "   " }] } });
  assert.equal(result.status, 400);
  assert.match(result.body.error, /non-empty/i);
});

test("AI Review cleans inputs and returns normalized classification data", async () => {
  let capturedPrompt = "";
  const handler = loadHandler("api/analyze-feedback.js", async ({ prompt }) => {
    capturedPrompt = prompt;
    return { text: JSON.stringify({ results: [
      goodReviewResult("r1", { confidence: 1.8, theme: "made-up theme", sentiment: "surprise", needs_human_review: false })
    ] }) };
  });
  const result = await invoke(handler, { body: { reviews: [{ id: "r1", text: "  " + "late ".repeat(300) }] } });
  assert.equal(result.status, 200);
  assert.equal(result.body.results.length, 1);
  assert.equal(result.body.results[0].theme, "Other / unclassified");
  assert.equal(result.body.results[0].sentiment, "mixed");
  assert.equal(result.body.results[0].confidence, 1);
  assert.equal(result.body.results[0].needs_human_review, false);
  assert.match(capturedPrompt, /late /);
  const embedded = capturedPrompt.slice(capturedPrompt.lastIndexOf("Reviews: ") + 9);
  const sent = JSON.parse(embedded);
  assert.equal(sent[0].text.length, 1200);
});

test("AI Review forces human review for low-confidence results", async () => {
  const handler = loadHandler("api/analyze-feedback.js", async () => ({
    text: JSON.stringify({ results: [goodReviewResult("r1", { confidence: 0.2, needs_human_review: false })] })
  }));
  const result = await invoke(handler, { body: { reviews: [{ id: "r1", text: "Not sure what happened" }] } });
  assert.equal(result.status, 200);
  assert.equal(result.body.results[0].needs_human_review, true);
});

test("AI Review rejects malformed model JSON", async () => {
  const handler = loadHandler("api/analyze-feedback.js", async () => ({ text: "not-json" }));
  const result = await invoke(handler, { body: { reviews: [{ id: "r1", text: "late" }] } });
  assert.equal(result.status, 502);
  assert.match(result.body.error, /valid JSON/i);
});

test("AI Review rejects incomplete model batches", async () => {
  const handler = loadHandler("api/analyze-feedback.js", async () => ({
    text: JSON.stringify({ results: [goodReviewResult("not-the-requested-id")] })
  }));
  const result = await invoke(handler, { body: { reviews: [{ id: "r1", text: "late" }] } });
  assert.equal(result.status, 502);
  assert.match(result.body.error, /every review/i);
});

test("AI Review returns a safe error when the AI provider fails", async () => {
  const handler = loadHandler("api/analyze-feedback.js", async () => { throw new Error("private provider detail"); });
  const result = await invoke(handler, { body: { reviews: [{ id: "r1", text: "late" }] } });
  assert.equal(result.status, 502);
  assert.match(result.body.error, /analysis failed/i);
  assert.doesNotMatch(result.body.error, /private provider detail/i);
});

test("Copilot rejects missing question or missing review context", async () => {
  const handler = loadHandler("api/copilot.js");
  assert.equal((await invoke(handler, { body: { question: "", reviews: [{text:"late"}] } })).status, 400);
  assert.equal((await invoke(handler, { body: { question: "What matters?", reviews: [] } })).status, 400);
});

test("Copilot limits context and filters evidence to supplied review IDs", async () => {
  let capturedPrompt = "";
  const handler = loadHandler("api/copilot.js", async ({ prompt }) => {
    capturedPrompt = prompt;
    return { text: JSON.stringify({
      answer: "Delivery is a pain point.",
      evidence: [
        { id: "r1", excerpt: "arrived late", why: "direct evidence" },
        { id: "forged-id", excerpt: "made up", why: "not in the dataset" }
      ],
      suggested_actions: ["Measure late-delivery rate"],
      data_limitations: ["Only a sample was supplied"]
    }) };
  });
  const reviews = Array.from({ length: 21 }, (_, i) => ({ id: `r${i+1}`, text: "x".repeat(1000) }));
  const result = await invoke(handler, { body: { question: "What should we improve?", reviews } });
  assert.equal(result.status, 200);
  assert.equal(result.body.context_reviews, 20);
  assert.equal(result.body.evidence.length, 1);
  assert.equal(result.body.evidence[0].id, "r1");
  assert.equal(result.body.suggested_actions.length, 1);
  const marker = "Loaded review context (20 representative rows, not necessarily the entire dataset):\n";
  const sent = JSON.parse(capturedPrompt.slice(capturedPrompt.lastIndexOf(marker) + marker.length));
  assert.equal(sent.length, 20);
  assert.equal(sent[0].text.length, 900);
});

test("Copilot rejects malformed model JSON", async () => {
  const handler = loadHandler("api/copilot.js", async () => ({ text: "not-json" }));
  const result = await invoke(handler, { body: { question: "What hurts?", reviews: [{ id: "r1", text: "late" }] } });
  assert.equal(result.status, 502);
  assert.match(result.body.error, /parsed/i);
});

test("Copilot returns a safe error when the AI provider fails", async () => {
  const handler = loadHandler("api/copilot.js", async () => { throw new Error("private provider detail"); });
  const result = await invoke(handler, { body: { question: "What hurts?", reviews: [{ id: "r1", text: "late" }] } });
  assert.equal(result.status, 502);
  assert.match(result.body.error, /temporarily unavailable/i);
  assert.doesNotMatch(result.body.error, /private provider detail/i);
});

test("frontend contains the AI controls and their expected API routes", (t) => {
  const frontendPath = path.join(root, "public/index.html");
  if (!fs.existsSync(frontendPath)) {
    t.skip("Run inside the project repository to check public/index.html.");
    return;
  }
  const html = fs.readFileSync(frontendPath, "utf8");
  assert.match(html, /OrderLens Copilot/);
  assert.match(html, /\/api\/analyze-feedback/);
  assert.match(html, /\/api\/copilot/);
  assert.match(html, /runAIReview/);
  assert.match(html, /askCopilot/);
  assert.doesNotMatch(html, /<<<<<<<|=======|>>>>>>>/);
});
