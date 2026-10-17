# Deployment and release checklist

## Before pushing

- [ ] Run `node --test tests/*.test.cjs`.
- [ ] Run `node --check api/analyze-feedback.js`, `node --check api/copilot.js`, and `node --check api/health-check.js`.
- [ ] Review `git diff --check` and `git status --short`.
- [ ] Confirm no `.env` file, real API key, private customer data, or credentials are staged.

## Hatchable configuration

- [ ] Configure `GOOGLE_API_KEY` only in Hatchable's server-side secret settings.
- [ ] Confirm the AI gateway/provider configuration is enabled for the project.
- [ ] Do not place the key in `public/index.html`, README, screenshots, or source control.
- [ ] Keep `hatchable.toml` configuration aligned with the deployed project's actual provider/secret settings.

## Post-deployment smoke test

1. Open the live app and load the sample dataset.
2. Run AI Review with a small batch (the endpoint accepts 1–5 reviews).
3. Ask Copilot a question (it receives up to 20 representative records).
4. Open `/api/health-check` and confirm a JSON response with `ok: true`.
5. Check the browser console and hosting logs for failed API requests.
6. Verify error paths leave the heuristic dashboard usable.

## What automated CI proves—and what it does not

CI uses a mocked AI gateway to test request validation, output normalization, provider failure behavior, evidence filtering, and frontend/API wiring. It does not call the live Gemini service, verify the deployed secret, measure model accuracy, or prove end-to-end availability. Perform the live smoke test after deployment.

## Privacy and limitations

Review text is sent to the hosted AI service when AI features are used. Use synthetic/demo feedback for portfolio demonstrations unless you have permission and approval to process real customer data. Copilot works from a sample and can be wrong; check cited reviews before acting.
