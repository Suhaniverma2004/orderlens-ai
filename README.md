# OrderLens AI

**Turn customer feedback into product decisions.**

OrderLens AI is an independent product-discovery workspace that helps teams explore customer reviews, identify recurring pain points, prioritize opportunities, and turn feedback into a measurable MVP experiment.

**[Live Demo](https://orderlens-ai.hatchable.site) · [GitHub Repository](https://github.com/Suhaniverma2004/orderlens-ai)**

> **Project status:** Portfolio prototype. OrderLens combines browser-based heuristic analysis with Gemini-powered review classification and an AI Copilot. AI outputs are advisory and should be verified against source reviews. Demo feedback is fictional.

## Features

- **Feedback Inbox:** Search and filter customer comments by inferred theme.
- **CSV Import:** Import review data locally in the browser, with support for common review-text column names.
- **Heuristic Analysis:** Transparent keyword-based theme and sentiment signals.
- **Gemini AI Review:** Classify up to five reviews per request with themes, sentiment, confidence, rationale, and human-review flags.
- **OrderLens Copilot:** Ask natural-language questions about the loaded feedback. The Copilot uses up to 20 evenly sampled review records and can return supporting excerpts, review IDs, recommended actions, and data limitations.
- **Opportunity Prioritization:** Adjust illustrative Impact, Confidence, and Ease scores to compare product opportunities.
- **MVP Brief Builder:** Draft problem statements, target users, experiment plans, success metrics, and guardrails.
- **Exports:** Download insight summaries, AI review reports, prioritization data, and MVP briefs.
- **Large-File Safeguards:** Sample up to 5,000 data rows and display up to 200 matching inbox records.
- **Browser Persistence:** Retain the current dataset and AI labels in local browser storage on the same device.

## Getting Started

1. Open the [live application](https://orderlens-ai.hatchable.site).
2. Explore the Overview dashboard.
3. Import a CSV in Feedback Inbox or use the sample dataset.
4. Run **AI Review (up to 5)** to classify a small batch of comments.
5. Open **Copilot** and ask questions such as:
   - What are the biggest customer pain points?
   - What product improvement should we test first?
   - What evidence is missing before making a decision?
6. Use Prioritize and MVP Brief to turn the findings into a testable product hypothesis.

The included sample comments are fictional and intended for demonstration.

## CSV Format

Provide a CSV with a header row and a review-text column.

```csv
review,rating,appVersion
"Delivery arrived much later than the ETA",1,4.37.2
"Refund status was unclear",2,4.37.2
"The tracking page did not update",1,4.36.1
```

Common supported text headers include `feedback`, `review`, `review_text`, `review_description`, `comment`, and `text`.

The current analysis primarily uses review text. Ratings, dates, and app versions do not currently drive the main theme and sentiment scoring.

## Technology Stack

- HTML5, CSS, and vanilla JavaScript
- Browser File API and Web Workers
- Browser localStorage
- CSV parsing and CSV/Markdown exports
- Hatchable hosting and serverless API functions
- Hatchable AI gateway with Google Gemini (`gemini-3.5-flash-lite`)

## Architecture

```text
.
├── api/
│   ├── analyze-feedback.js
│   ├── copilot.js
│   └── health-check.js
├── public/
│   ├── index.html
│   ├── sample-feedback.csv
│   └── README.txt
├── .gitignore
├── PUSH_TO_GITHUB.md
└── README.md
```

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health-check` | GET | Basic API health response |
| `/api/analyze-feedback` | POST | Gemini classification of 1–5 reviews |
| `/api/copilot` | POST | Answer a question using up to 20 supplied review records |

The AI endpoints return structured JSON. Copilot is instructed to treat review text as untrusted input, cite supplied review IDs, and identify insufficient evidence.

## Run Locally

To preview the static frontend, run this command from the repository root:

```bash
python -m http.server 8000 --directory public
```

Open [http://localhost:8000](http://localhost:8000).

**Note:** The Gemini features require the hosted API endpoints and Hatchable AI gateway. A static local preview does not provide the backend automatically.

## Backend Configuration

To deploy a compatible version:

1. Connect the project to Hatchable.
2. Enable the Google AI provider.
3. Configure `GOOGLE_API_KEY` as a server-side secret.
4. Deploy the frontend and API functions.
5. Test the health-check, classification, and Copilot endpoints.

Never commit API keys or expose them in frontend JavaScript.

## Privacy and Responsible Use

- CSV import, heuristic analysis, and browser persistence run locally.
- When AI Review or Copilot is used, the selected review text is sent to the hosted backend and processed by the configured Gemini provider.
- Copilot sends up to 20 sampled records per question; AI Review sends up to five records per request.
- Only upload data you are authorized to process.
- Verify AI-generated findings and supporting excerpts before using them to make product decisions.

## Limitations

- AI Review classifies at most five reviews per request; other reviews retain heuristic labels unless separately analyzed.
- Copilot sees a sample of up to 20 records, not the entire dataset, and may miss rare patterns.
- Copilot conversations are not stored as durable, shared conversation history.
- Model accuracy has not yet been established through a formal evaluation against human-labelled data.
- Prioritization scores are directional planning assumptions, not validated business outcomes.
- The project does not currently implement a database-backed shared workspace, authentication, or multi-user collaboration.

## Roadmap

- Evaluate classification quality against a human-labelled test set.
- Improve targeted sampling and context selection for Copilot.
- Add configurable CSV column mapping and import diagnostics.
- Analyze trends across ratings, app versions, and time when the data supports it.
- Explore persistent, access-controlled workspaces.

## Portfolio Context

OrderLens AI demonstrates a product workflow spanning customer-feedback analysis, evidence-based problem framing, opportunity prioritization, LLM integration, structured AI responses, and experiment design. It emphasizes the distinction between observed feedback and hypotheses that still require validation.
