# OrderLens AI

**Turn customer feedback into product decisions.**

OrderLens AI is an independent product-discovery workspace that helps teams explore customer reviews, identify recurring pain points, prioritize opportunities, and turn feedback into a measurable MVP experiment.

**[Live Demo](https://orderlens-ai.hatchable.site) · [GitHub Repository](https://github.com/Suhaniverma2004/orderlens-ai)**

> **Project status:** Portfolio prototype. OrderLens combines browser-based heuristic analysis with Gemini-powered review classification and an AI Copilot. AI outputs are advisory and should be verified against source reviews. Demo feedback is fictional.

## Features

- **Feedback inbox:** Search and filter customer comments by inferred theme.
- **CSV import:** Load review data locally in the browser using common feedback and review-text column names.
- **Heuristic analysis:** Explore baseline keyword-based themes and sentiment estimates.
- **Gemini AI Review:** Classify up to 5 reviews per request with themes, sentiment, confidence, rationale, signals, and human-review flags.
- **OrderLens Copilot:** Ask questions about up to 20 representative review records and receive evidence excerpts, review IDs, suggested actions, and data limitations.
- **Opportunity prioritization:** Compare illustrative ICE-style impact, confidence, and ease scores.
- **MVP brief builder:** Draft a problem statement, proposed scope, experiment plan, success criteria, risks, and instrumentation.
- **Exports:** Download insight summaries, AI analysis reports, priorities, and MVP briefs.
- **Large-file safeguards:** Imports are capped at 5,000 data rows, and the inbox displays up to 200 matching comments.
- **Local persistence:** Saved classifications persist in the same browser and device.

## Try the live demo

1. Open the [OrderLens AI demo](https://orderlens-ai.hatchable.site).
2. Import a CSV containing customer feedback.
3. Use **AI Review** to classify a small batch of reviews.
4. Open **Copilot** and ask a question about the loaded feedback.
5. Explore **Prioritize** and build an **MVP brief**.

Start with a small CSV sample. AI classifications are suggestions, not validated ground truth.

## CSV format

A CSV file should include a column containing customer review text. Common supported headers include `feedback`, `review`, `review_text`, `review_description`, `comment`, and `text`.

Example:

```csv
id,review_text
TEST-001,My delivery arrived late and the food was cold.
TEST-002,Support resolved my refund quickly.
TEST-003,The app crashes when I try to pay.
```

## Architecture

| Path | Responsibility |
| --- | --- |
| `public/index.html` | Browser interface and client-side feedback workflow |
| `public/sample-feedback.csv` | Sample feedback dataset |
| `api/analyze-feedback.js` | Gemini-powered review classification |
| `api/copilot.js` | AI Copilot responses grounded in supplied reviews |
| `api/health-check.js` | Backend health endpoint |
| `hatchable.toml` | Hatchable AI provider and secret configuration |

## Technology

- HTML, CSS, and JavaScript
- CSV processing and browser storage
- Hatchable hosting and server-side API handlers
- Hatchable AI gateway with `gemini-3.5-flash-lite`

## AI behavior and limitations

- AI Review accepts 1–5 reviews per request.
- Copilot receives at most 20 representative review records per request.
- The supplied review sample may not represent the entire dataset.
- Model-generated themes, sentiment, confidence, and recommendations can be incorrect.
- Prioritization scores are illustrative planning assumptions.
- Classifications stored in browser storage are not shared across devices.
- The prototype does not provide a persistent shared workspace, authentication, or a durable conversation database.

When AI features are used, review text is sent to the hosted backend and AI provider for processing. Never commit API keys or private customer data to the repository.

## Backend configuration

The deployed Hatchable project uses a server-side `GOOGLE_API_KEY` secret and the Hatchable AI gateway. Configure credentials through the hosting platform's secret settings; do not place real credentials in frontend code or source control.

The AI endpoints depend on the Hatchable runtime and are not expected to run unchanged through a basic static local web server.

## Roadmap

- Evaluate classification quality against a labelled review dataset.
- Improve representative sampling and CSV column mapping.
- Add temporal analysis and trend comparisons.
- Explore secure persistence and shared team workflows.

## Portfolio context

OrderLens AI is an independent portfolio project demonstrating product discovery, feedback analysis, AI integration, evidence-grounded recommendations, and MVP experiment planning. It is not affiliated with any delivery platform.

## Quality checks

Run the dependency-free automated test suite with Node.js 22 or later:

```bash
node --test tests/*.test.cjs
```

The suite exercises request validation, response normalization, batch limits, provider failures, malformed model responses, Copilot evidence filtering, the health route, and frontend/API wiring. AI gateway calls are mocked, so tests do not require or consume a Gemini API key.

GitHub Actions runs these tests and checks API JavaScript syntax on pushes and pull requests to `main`. A green CI run verifies the mocked/unit-test paths; it is not a live Gemini integration test.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for request flow, trust boundaries, and deployment limitations.
