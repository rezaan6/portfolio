# Senior Frontend Engineer portfolio — Mohammed Rezaan Riyaz

React · Next.js · TypeScript. Based in the UAE, open to relocation and remote.

**Live:** https://swe-portfolio-gold.vercel.app

This repository is two things at once: the site that describes my work, and a sample of
it. If you are here to judge how I build rather than to read about it, the section below
is the short tour — and every claim in it is checkable against the code.

---

## The decisions worth reading

**Content is data, never markup.** Every sentence on this site lives in a typed object in
`src/app/components/signal-room-data.tsx`; `signal-room.tsx` is presentation and reads
from it. A copy change touches one file and no JSX, and TypeScript catches a case study
missing a field before the page renders it as `undefined`.

**Nothing that goes stale is written down.** "7+ years" is not a string anywhere — it is
derived from a single start date in `src/app/lib/experience.ts`, floored so it can never
overstate, and the routes quoting it revalidate hourly. Stack chips name the tool and
never the version, for the same reason: a pinned number is right for one release and
quietly wrong forever after.

**Syntax highlighting costs zero client bytes.** Shiki runs at build time behind
`server-only` (`src/app/lib/highlight.ts`) and the browser receives pre-rendered HTML.
Highlighting on the client would ship roughly a megabyte of tokenizer to render text
that is fully known at build time. Both themes render at once, so the light/dark toggle
is a CSS custom-property swap — no re-highlight, no flash.

**A layout-shift bug, found properly.** The case accordion animated `flexGrow` on mount —
a layout property — producing a CLS of 0.151 and costing 12 Lighthouse points. My first
hypothesis was font swap, and it was wrong. A `PerformanceObserver` on `layout-shift`
entries identified the actual node; `initial={false}` fixed it. The false start is in the
commit history, which is the honest version.

**Accessibility as a defect class, not a checklist.** An `<ol>` containing `<div>`
children was invalid markup that *also* left scroll reveals stuck at `opacity: 0` — one
bug with two symptoms. Footer links measured 17px tall, under the WCAG 2.5.8 minimum, and
were given height without moving the type. Where an action matters, its link is never a
bare glyph.

**Claims are auditable.** Every figure is a before/after read against a defined baseline,
never a causal claim. Where a number could not be traced to an instrument it was removed
rather than softened — several were.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Motion | `motion` |
| Highlighting | Shiki — build-time, server-only |
| Language | TypeScript 5.9 |
| Hosting | Vercel |

**Seven production dependencies.** ~9.2k lines of TypeScript across 8 routes. `npm audit`
reports zero vulnerabilities. Lighthouse is 100 across all four categories on the pages I
have measured — CLS is sensitive to a cold font cache in some environments, so measure it
yourself rather than trust a badge.

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
| `/projects` | Personal and open-source builds |
| `/stack` | Tools grouped by purpose, each with how it shows up in real work |
| `/method` | The Architect → Build → Harden → Measure loop |
| `/artifacts` | Engineering documents (ADR, perf budget, test strategy, …) |
| `/about` | Career path, principles, education, contact |
| `/resume` | Digital-first résumé — prints to A4, or copies as plain text |

## Where the content lives

Editing copy means editing one of these. None of it is in JSX.

- **`src/app/components/signal-room-data.tsx`** — the single content source: contact, nav,
  case studies, projects, artifacts, timeline, principles, tools, craft.
- **`src/app/components/artifact-docs.tsx`** — the structured engineering documents, keyed
  by artifact `type`, rendered by `artifact-doc.tsx`.
- **`src/app/components/prototype-data.tsx`** — per-case UI reference builds, keyed by
  case-study slug.
- **`src/app/resume/resume-client.tsx`** — résumé data and layout.
- **`src/app/lib/experience.ts`** — the single date every "years of experience" figure
  derives from.

## Constraints worth stating

- **No client code is in this repository.** Production work at Hobber, Axinom and Kodez is
  under NDA. The case-study prototypes are reference builds written from scratch; they
  contain no client code, data, or interface.
- **Icons** are [Simple Icons](https://simpleicons.org) (CC0), stored locally rather than
  fetched from a CDN, each pinned to its brand colour.
- The light theme is default; the toggle persists to `localStorage` and animates via the
  View Transitions API where supported.
- The résumé prints to a real, selectable, ATS-parseable PDF from the live page, so it can
  never drift out of date relative to the site.

## Licence

The code is here to read. The written content, case studies and résumé are personal and
not licensed for reuse.
