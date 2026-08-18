# Senior Frontend Engineer portfolio — Mohammed Rezaan Riyaz

React · Next.js · TypeScript. Open to roles — onsite or remote, and I relocate.

**Live:** https://rezaanriyaz.com

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

**One number in one place.** Every figure lives in `src/app/lib/measurement.ts` with its
value, what it is, and where it stops — typed as a count, a reading, an estimate, a
reported figure or a tool report, because those are not the same kind of claim. The
résumé tiles, the case tables and the ⓘ disclosures all read from it. They used to carry
their own copies, and the coverage figure had drifted into five spellings across four
files before anyone noticed.

**Two guards, both added after the thing they guard against shipped.** `prebuild` fails
the build on any quoted string containing `${`, because three template literals once
rendered to the page as those exact characters and neither typecheck nor lint nor build
has an opinion about a string containing a dollar sign. And the résumé PDF is produced by
the build rather than committed, because a committed build output goes stale in silence.

**The editorial rules are tests.** There is barely any behaviour here — the site is data
and layout — so the suite asserts the rules this repo has actually broken rather than
chasing a coverage number, which is the position its own test strategy takes. Every
artifact type must have a document that can render it; every figure must state a basis,
and a reading or an estimate must state its limit; no percentage may be hardcoded where
it could drift from `lib/measurement`; no version number may reach a reader; no quoted
string may contain a template literal. Each of those is a defect that shipped once and was
found by reading output, late. 58 tests, under a second.

**One value, one place.** The page-hero panel height is `--sr-hero-min-h`, read by both
components that render one. It used to be a literal written into each, which is how
`/about` came to sit 63px taller than the other five pages — a difference nobody notices
on one page and everybody feels flicking between them. Raising the token moves all six
together, deliberately.

**Claims are auditable.** Every figure is a before/after read against a defined baseline,
never a causal claim. Where a number could not be traced to an instrument it was removed
rather than softened — several were.

---

## Stack

| | |
|---|---|
| Framework | Next.js (App Router, Turbopack) |
| UI | React (Server Components), Tailwind CSS |
| Motion | `motion` |
| Highlighting | Shiki — build-time, server-only |
| Language | TypeScript |
| Hosting | Vercel |

Versions are deliberately not listed. `package.json` is the source of truth and it tracks
latest; a number in a table is a second copy that goes stale the day after it's written.

**Nine production dependencies** — `clsx`, `motion`, `next`, `react`, `react-dom`,
`server-only`, `shiki`, and Vercel's `@vercel/analytics` and `@vercel/speed-insights`.
~10.1k lines of TypeScript across 34 files and 9 routes, plus 278 lines of tests in 3
files. `npm audit` reports zero vulnerabilities. Measure performance yourself rather than trust a badge in a README; CLS
in particular is sensitive to a cold font cache.

The two Vercel packages are the point of a note elsewhere on the site: the observability
panel says the honest gap in my stack was runtime signal — lab numbers tell you what you
shipped, not what anyone experienced — and that the order to close it starts with field
timings. This is that, on the one product I own outright. Both defer until the page is
interactive.

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
| `npm run build` | Renders the résumé to PDF, then builds. Ordering matters — see below |
| `npm run build:fast` | Build without regenerating the PDF |
| `npm run resume:pdf` | Render `/resume` to `public/resume.pdf` + `resume-a4.pdf` |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run audit` | `npm audit` at moderate+ severity |
| `npm test` | Vitest, once |
| `npm run test:watch` | Vitest, watching |

## Routes

| Route | Contents |
|---|---|
| `/` | Hero, impact numbers, case accordion, role lenses, method, focus areas |
| `/work` | Four company case studies, written as engineering decisions |
| `/work/[slug]` | Case detail — decision arc, UI reference build, practices |
| `/projects` | Personal and open-source builds |
| `/stack` | Tools grouped by purpose, each with how it shows up in real work |
| `/method` | The Architect → Build → Harden → Measure loop |
| `/artifacts` | Nine engineering documents — ADR, component spec, state model, incident review, perf, test strategy, accessibility baseline, API contract, migration plan |
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
- **`src/app/lib/measurement.ts`** — every figure on the site, with its basis and its
  limit. One number in one place, so the résumé, the case tables and the ⓘ disclosures
  cannot disagree. They used to.
- **`src/app/lib/experience.ts`** — the single date every "years of experience" figure
  derives from.

## Constraints worth stating

- **No client code is in this repository.** Production work at Hobber, Axinom and Kodez is
  under NDA. The case-study prototypes are reference builds written from scratch; they
  contain no client code, data, or interface.
- **Icons** are [Simple Icons](https://simpleicons.org) (CC0), stored locally rather than
  fetched from a CDN, each pinned to its brand colour. The tab icon is `src/app/icon.svg` —
  drawn as a path rather than exported, so it is a few hundred bytes and sharp at every
  size. A favicon is read at 16px, which permits one letterform and no detail.
- The light theme is default; the toggle persists to `localStorage` and animates via the
  View Transitions API where supported.
- **The résumé PDF is generated during the build, not committed.** `npm run build` renders
  the real `/resume` route in headless Chrome and writes `public/resume.pdf` *before*
  `next build` collects `public/` — a file written after the final build is not picked up.
  It was a committed file once and went stale silently, so the download disagreed with the
  page it was linked from. Now editing the résumé and deploying is sufficient. One page,
  selectable text, ATS-parseable.

- The résumé has two layouts, not one stylesheet stretched. The sheet is a fixed 232mm
  document; below 900px it is not scaled but replaced by a reflow reading the same arrays,
  because scaling 10.9px type to fit a phone produced 4.5px text on the page every
  "Resume" link points at.

## Licence

The code is here to read. The written content, case studies and résumé are personal and
not licensed for reuse.
