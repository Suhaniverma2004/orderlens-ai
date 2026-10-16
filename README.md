# OrderLens AI

**Turn customer feedback into product decisions.**

OrderLens AI is a lightweight product-discovery prototype that helps teams explore customer feedback, spot recurring pain points, prioritize opportunities, and turn a promising signal into an MVP brief and experiment plan.

**[Live demo](https://orderlens-ai.hatchable.site) · [Source code](https://github.com/Suhaniverma2004/orderlens-ai)**

> **Project status:** Independent portfolio prototype. Feedback themes and sentiment are assigned with transparent keyword heuristics, and prioritization scores are illustrative planning aids—not model-generated findings or validated business outcomes. OrderLens AI is not affiliated with Swiggy, Zomato, or another delivery platform.

## Why this project?

Customer feedback is often spread across reviews and support comments. OrderLens AI demonstrates a practical workflow for moving from qualitative signals to a testable product opportunity—while keeping observed feedback volume separate from human judgment about impact, confidence, and effort.

## Features

- **Feedback inbox** — browse, search, and filter comments by inferred theme.
- **CSV import** — import feedback locally in your browser; common review-text headers such as `review`, `review_text`, `review_description`, `feedback`, `comment`, and `text` are supported.
- **Pain-point themes** — heuristic grouping for delivery delays, tracking and visibility, refunds and support, checkout and pricing, and food and packaging.
- **Opportunity prioritization** — adjust impact, confidence, and ease assumptions and compare an illustrative score alongside feedback volume.
- **MVP brief builder** — draft a problem statement, target user, proposed scope, experiment outline, success criteria, guardrails, risks, and instrumentation.
- **Exports** — download insight summaries as CSV and the MVP brief as Markdown.
- **Large-file safeguards** — CSV parsing runs in a background browser worker; imports are capped at 5,000 data rows and the inbox displays up to 200 matching comments at a time.

## Try the live demo

1. Open the [OrderLens AI demo](https://orderlens-ai.hatchable.site).
2. Start in **Overview** to see the sample workflow.
3. Open **Feedback inbox** and import a CSV with a recognizable review-text column.
4. Explore the inferred themes and adjust assumptions in **Prioritize**.
5. Use **MVP brief** to draft a hypothesis and experiment plan.

The built-in sample feedback is fictional and exists to demonstrate the workflow. For a first real-data test, use a small CSV sample before trying a larger export.

## CSV format

The app expects a header row and at least one review row. A minimal file can look like this:

```csv
review,rating,appVersion
"Delivery was much later than the ETA",1,4.37.2
"Refund status was unclear",2,4.37.2
"The tracking page did not update",1,4.36.1
```

The review-text field can be named `feedback`, `review`, `review_text`, `review_description`, `comment`, `content`, or `text` (and several similar review/comment headers). Other columns may be retained in the CSV, but the prototype currently analyzes the text field rather than using ratings, dates, or app versions in its scoring.

**Large files:** To keep the browser responsive, the importer processes up to the first **5,000 data rows**. The inbox renders at most **200 matching rows** at once. For larger datasets, create a smaller CSV sample first. Performance still depends on the browser and file size.

## Run locally

No build step, package installation, API key, or backend service is required.

1. Clone or download this repository.
2. Open `public/index.html` in a modern browser, or serve the `public` directory with any static HTTP server.
3. Import a small CSV from **Feedback inbox**.

Example using Python from the repository root:

```bash
python -m http.server 8000 --directory public
```

Then visit [http://localhost:8000](http://localhost:8000).

## Privacy and data handling

- CSV parsing and analysis happen in the browser; imported feedback is not sent to an OrderLens AI backend.
- The app does not currently persist uploaded feedback between sessions.
- Only import data you are authorized to use. Public app reviews can still contain personal information; use only the fields needed for your analysis.

## Tech stack

- HTML5 and CSS
- Vanilla JavaScript
- Browser File API and Web Workers
- Client-side CSV parsing
- Blob-based CSV and Markdown exports
- Hatchable hosting for the live prototype

## Limitations

- Theme classification and sentiment labels use keyword heuristics, not a trained AI model.
- Each comment is assigned a single primary theme; mixed feedback can be misclassified.
- The prototype does not use ratings, dates, or app versions to adjust the analysis.
- Priority scores are directional planning aids, not statistical estimates or proof of impact.
- There is no backend, database, multi-user workflow, or durable data persistence.

## Roadmap

- Evaluate theme assignment against a human-labelled sample and report precision/recall.
- Improve mixed-sentiment and multi-theme handling.
- Add configurable column mapping and clearer import diagnostics.
- Compare themes across rating, app version, and time where the dataset supports it.
- Explore optional model-assisted analysis with clear provenance and validation.

## Project structure

```text
.
├── public/
│   ├── index.html            # Single-page application
│   ├── sample-feedback.csv   # Example CSV
│   └── README.txt            # In-app usage notes
├── .gitignore
├── PUSH_TO_GITHUB.md
└── README.md
```

## Portfolio context

This project demonstrates product thinking across qualitative research, problem framing, prioritization, MVP definition, and experiment design, alongside a small client-side implementation. The goal is to make assumptions visible and keep the path from feedback to a testable decision explicit.
