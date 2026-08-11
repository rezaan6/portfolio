# rezaanriyaz.com — Senior Frontend Engineer portfolio

Personal portfolio and resume for **Mohammed Rezaan Riyaz** — Senior Frontend Engineer
(React · Next.js · TypeScript), based in the UAE.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Motion | `motion` (Framer Motion successor) |
| Language | TypeScript 5.9 |
| Hosting | Vercel |

Node **≥ 22** (see `.nvmrc` — developed on 24.11.0).

## Getting started

```bash
nvm use          # 24.11.0
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run audit` | `npm audit` at moderate+ severity |

## Routes

| Route | Contents |
|---|---|
| `/` | Hero, impact numbers, case accordion, role lenses, method, focus areas |
| `/work` | Four company case studies, written as engineering decisions |
| `/work/[slug]` | Case detail — decision arc, UI reference build, practices |
| `/projects` | Personal and open-source builds (featured + archive) |
| `/method` | The Architect → Build → Harden → Measure loop |
| `/artifacts` | Engineering documents (ADR, perf budget, test strategy, …) |
| `/about` | Path, principles, stack, contact |
| `/resume` | A4 resume — print to PDF, or copy as plain text |

## Content model

All site content is data, not markup. Editing copy means editing one of these:

- **`src/app/components/signal-room-data.tsx`** — the single content source:
  contact, nav, case studies, projects, artifacts, timeline, principles, tools, craft.
- **`src/app/components/artifact-docs.tsx`** — the structured engineering documents,
  keyed by artifact `type`, rendered by `artifact-doc.tsx`.
- **`src/app/components/prototype-data.tsx`** — per-case UI reference builds,
  keyed by case-study slug.
- **`src/app/resume/resume-client.tsx`** — resume data + A4 print layout.

`src/app/components/signal-room.tsx` holds the UI; it reads from the data above.

## Notes

- Light theme is the default; the toggle persists to `localStorage` and animates
  via the View Transitions API where supported.
- The resume prints to a real, selectable, ATS-parseable PDF via `@media print`
  (`Download PDF` opens the print dialog), so the PDF is always generated from
  the live page and can never drift out of date.
- Case-study prototypes are reference builds drawn in code — production client
  applications are under NDA, and no client code or data is in this repo.
- Reported metrics are before/after reads against a defined baseline, not causal claims.
