# SeriesBio interactive demo

A responsive, clickable prototype for presenting SeriesBio to biotech founders and investors. The interface follows the visual direction shared in the brief: editorial white surfaces, deep forest-green product panels, and a custom abstract biotech hero image.

## Run locally

```bash
pnpm install
pnpm run dev
```

The Vite dev server uses port `5179`. You can also use `npm install` and `npm run dev`.

## Walk through the demo

1. Choose the Founder or Investor perspective from the top bar.
2. Open Discover and inspect the profiles, filters, estimated fit and match rationale.
3. Express interest in a profile. The opening LumaCell × Northstar scenario is already a mutual match.
4. Review and edit the template introduction, then send it in the simulated conversation.
5. Switch perspectives, reply, propose a 15-minute meeting, and accept it from the other side.
6. Open the deal room to review the meeting, preview fictional materials, and complete shared next steps.
7. Use the pipeline to move a confirmed meeting to follow-up, archive it, or reopen it.

Use **Restart demo** in the workspace to restore the opening match. Progress is saved in browser local storage.

## Demo boundaries

All company, fund, score, message and meeting data is fictional. Fit percentages are illustrative profile comparisons, not validated predictions. Message suggestions use local templates; no AI model, backend, account, email, calendar, transaction or document-sharing service is connected. Real profile information should be reviewed and explicitly approved before sharing.
