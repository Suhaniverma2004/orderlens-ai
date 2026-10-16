# OrderLens AI

**Feedback intelligence for product teams — turn customer voice into product action.**

OrderLens AI is an independent product prototype that demonstrates a discovery workflow: ingest customer feedback, identify recurring pain points, prioritize opportunities, and draft an MVP brief with an experiment plan.

> This is a portfolio case study, not affiliated with any food-delivery company. Demo feedback is fictional. Theme clustering, sentiment labels, and prioritization scores are transparent heuristics, not validated AI outputs or business results.

## Live prototype

- App: https://orderlens-ai.hatchable.site
- Repository: https://github.com/Suhaniverma2004/orderlens-ai

The Hatchable project currently has personal/private visibility. Change it under [Hatchable project settings](https://hatchable.com/console/projects/orderlens-ai) before sharing the live app with recruiters; otherwise visitors may see a sign-in wall.

## Features

- **Feedback inbox:** search/filter customer comments by inferred theme.
- **CSV import:** process feedback files locally in the browser using a `feedback`, `review`, `comment`, or `text` column.
- **Pain-point clustering:** classify comments into delivery delays, tracking & visibility, refunds & support, checkout & pricing, and food & packaging.
- **Prioritization:** adjust impact, confidence, and ease assumptions; score combines assumptions with observed volume in the current dataset.
- **MVP brief builder:** generate a problem statement, target segment, scope, experiment outline, guardrails, risks, and instrumentation checklist.
- **Export:** download theme insights as CSV and a brief as Markdown.
- **Privacy-oriented demo:** CSV parsing runs locally; uploaded feedback is not sent to a server.

## Run locally

No build step or package install is required. Open `public/index.html` directly in a browser, or serve the `public` folder using any static HTTP server.

## Import format

A CSV needs a header named `feedback`, `review`, `comment`, or `text`. A sample is included in `public/sample-feedback.csv`.

## Product thinking demonstrated

1. Separate observed evidence (comment counts) from assumptions (impact, confidence, and ease).
2. Convert qualitative signals into a narrow MVP hypothesis.
3. Define a primary metric and guardrails before an experiment.
4. State uncertainty and validate with interviews and operational data before shipping.

## Limitations and next steps

- Theme and sentiment assignment is heuristic and selects a single primary theme per comment.
- No model-generated analysis, persistence, multi-user access, or production monitoring is claimed.
- Product scores are planning prompts, not causal estimates of impact.
- Next: evaluate clustering against a human-labeled dataset, test model-assisted analysis, add data provenance and sample-size guidance, and validate proposed experiments with stakeholders.

## Tech stack

HTML, CSS, vanilla JavaScript, browser File API, local CSV parser, Blob downloads, and Hatchable hosting for the deployed prototype.
