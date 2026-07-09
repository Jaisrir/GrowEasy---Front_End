# GrowEasy — Import Leads via CSV (Frontend)

A simple 3-step page: **Upload → Preview → Import Result.**
Built with Next.js, TypeScript, and Tailwind CSS.

## What it does

1. **Upload** — drag & drop a CSV, or click to pick one. The file is
   sent straight to your backend: `POST /api/upload` (`multipart/form-data`,
   field name `file`). The backend parses the CSV and sends back the
   rows — no AI yet, this step is just "read the file."
2. **Preview** — shows those rows in a scrollable table with sticky
   headers.
3. **Confirm** — clicking "Confirm & Import" sends the previewed rows
   to `POST /api/import` as `{ "rows": [...] }`. This is the step
   that runs the AI mapping and saves to the database.
4. **Results** — shows the AI-mapped CRM records, skipped rows, and
   totals, returned by `/api/import`.

## Backend contract this frontend expects

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/upload` | `FormData` with a `file` field | `{ rows, totalRows, headers }` |
| POST | `/api/import` | `{ rows: [...] }` | `{ successfully_parsed, skipped_records, total_imported, total_skipped }` |

If any of these routes or field names change on your backend, the
only file you need to touch is `src/app/page.tsx` (the
`handleFileSelected` and `handleConfirm` functions) plus
`src/lib/types.ts`.

## Setup

```bash
npm install
cp .env.local.example .env.local
# then open .env.local and set NEXT_PUBLIC_API_URL to your backend's URL

npm run dev
# open http://localhost:3000
```

## Deploying

This is a plain Next.js app, so it deploys as-is to Vercel:

```bash
npm i -g vercel
vercel
```

Remember to set the `NEXT_PUBLIC_API_URL` environment variable in your
Vercel project settings to your deployed backend's URL.

## Project structure

```
src/
  app/
    page.tsx        the whole 3-step flow lives here
    layout.tsx       page shell + metadata
    globals.css      color tokens / design system
  components/
    Stepper.tsx       progress indicator
    UploadStep.tsx    drag & drop + file picker
    PreviewStep.tsx   raw CSV preview table + Confirm button
    ResultsStep.tsx   parsed / skipped results tables
  lib/
    types.ts          shared TypeScript types
```
