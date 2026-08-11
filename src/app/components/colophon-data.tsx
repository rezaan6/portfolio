import type { CodeLang } from "../lib/highlight";

/* Content for the colophon. Unlike every other case on this site, all of
   this is verifiable — the repository is public to anyone I send it to. */

export const REPO = "https://github.com/rezaan6/swe-portfolio";

/**
 * Lighthouse on the production build (desktop, navigation). Only the three
 * categories that were 100 on every run are claimed here — a number a reader
 * can't reproduce is worse than no number.
 */
export const SCORES = [
  { label: "Accessibility", value: 100 },
  { label: "Best Practices", value: 100 },
  { label: "SEO", value: 100 },
];

/** Stated plainly rather than hidden, because it is the honest read. */
export const KNOWN_ISSUE = {
  label: "Cumulative Layout Shift",
  value: "0.15",
  note: "Above the 0.1 target on a cold cache — a webfont swap, and the one number on this page I am not yet happy with. Warm loads and unthrottled traces measure 0.00, so it is a first-paint problem, not a steady-state one.",
};

export const STACK_FACTS = [
  { k: "Framework", v: "Next.js 16 · App Router · Turbopack" },
  { k: "UI", v: "React 19 · Tailwind CSS 4" },
  { k: "Language", v: "TypeScript 5.9, strict" },
  { k: "Motion", v: "motion 13 — every animation honours reduced-motion" },
  { k: "Rendering", v: "14 routes, all prerendered at build time" },
  { k: "Dependencies", v: "6 runtime packages · npm audit: 0 vulnerabilities" },
];

export type Decision = {
  n: string;
  title: string;
  problem: string;
  choice: string;
  snippet?: keyof typeof COLOPHON_SNIPPETS;
  tradeoff?: string;
};

export const DECISIONS: Decision[] = [
  {
    n: "01",
    title: "Content is data, not markup",
    problem:
      "A portfolio is edited far more often than it is rebuilt. If copy lives inside JSX, every wording change is a code change, and the risk of breaking a layout while fixing a typo is real.",
    choice:
      "Every string on this site lives in one typed data module. The UI reads from it and renders it. Adding a case study is adding an object to an array — the components never change.",
    snippet: "contentModel",
    tradeoff:
      "A layer of indirection, and the types have to be maintained. Worth it the first time a whole section is reordered without touching a component.",
  },
  {
    n: "02",
    title: "Syntax highlighting runs at build time, not in the browser",
    problem:
      "Code blocks need a tokenizer. The obvious approach — highlight on the client — ships roughly a megabyte of grammars and themes to render text that is already known when the site is built.",
    choice:
      "Shiki runs in server components only. Pages await it during the build and pass pre-rendered HTML to the client, so the highlighter never enters the bundle. Both themes are emitted at once as CSS custom properties, which makes the light/dark toggle a variable swap rather than a re-highlight.",
    snippet: "highlighting",
    tradeoff:
      "Code has to be known at build time — no user-supplied snippets. For a portfolio that is not a constraint, it is a guarantee.",
  },
  {
    n: "03",
    title: "The theme toggle uses the View Transitions API",
    problem:
      "A theme switch that repaints instantly is jarring, and one that cross-fades every property fights the component-level transitions already running.",
    choice:
      "The toggle takes a snapshot via the View Transitions API and reveals the new theme through a circle expanding from the button you actually pressed. Browsers without support fall back to a scoped colour cross-fade, gated behind a transient data attribute so it never overrides hover or press timing.",
    snippet: "themeToggle",
    tradeoff:
      "Progressive enhancement means two code paths. The fallback is three lines of CSS, so the cost is small and the baseline never breaks.",
  },
  {
    n: "04",
    title: "Accessibility is a build gate, not a final pass",
    problem:
      "Accessibility added at the end is a list of remediations. Added during, it is mostly free.",
    choice:
      "Visible focus rings on every interactive element, a skip link, dialogs that return focus to the control that opened them, and every animation gated behind prefers-reduced-motion. The site scores 100 on Lighthouse accessibility — which is a floor, not a finish line: it catches what a machine can see, not whether the thing is usable.",
    snippet: "a11y",
  },
  {
    n: "05",
    title: "Images and fonts are handled at the boundary",
    problem:
      "Images and webfonts are the two things most likely to wreck a good Lighthouse score, and both fail quietly.",
    choice:
      "All imagery is local and served through next/image with AVIF and WebP negotiated per request. Fonts come through next/font, which self-hosts them and generates a size-adjusted fallback so the swap costs as little as possible. Screenshots were resized before they were committed — the largest is 312 KB.",
    tradeoff:
      "Local assets mean the repo carries them, and this site still runs five families — which is where the layout shift above comes from. The honest read is that the font count is one too many for the budget, and that is the next thing I would cut.",
  },
];

export const COLOPHON_SNIPPETS: Record<string, { code: string; lang?: CodeLang }> = {
  contentModel: {
    lang: "typescript",
    code: `// signal-room-data.tsx — the single source of content for the whole site.
// Components import from here; they never hold copy of their own.

export type CaseStudy = {
  company: string
  headline: string
  results: { label: string; value: string; note?: string }[]
  stack?: string[]
  code?: { caption: string; lang?: "tsx" | "typescript" | "bash"; source: string }
}

export const caseStudies: CaseStudy[] = [ /* ... */ ]

// Adding a case study is adding an object. The route, the card, the detail
// page and the static params all follow from the data.
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }))
}`,
  },

  highlighting: {
    lang: "typescript",
    code: `// lib/highlight.ts
import "server-only"                       // a client import here is a build error
import { createHighlighter } from "shiki"

let highlighterPromise: Promise<Highlighter> | null = null

const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark-default"],
    langs: ["tsx", "typescript", "bash"],
  })
  return highlighterPromise            // one instance, reused across every page
}

export async function highlightCode(code: string, lang: CodeLang = "tsx") {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark-default" },
    defaultColor: false,               // emit BOTH themes as CSS variables
  })
}

// The page is a server component, so this runs during \`next build\`:
const codeHtml = await highlightCode(cs.code.source, cs.code.lang)
return <CaseDetail cs={cs} codeHtml={codeHtml} />`,
  },

  themeToggle: {
    lang: "typescript",
    code: `// Reveal the new theme through a circle growing from the pressed button.
const handleToggle = (e: ReactMouseEvent<HTMLButtonElement>) => {
  if (reduce) return toggle(true)                       // respect the setting first

  if (typeof document.startViewTransition !== "function") {
    return toggle(true)                                 // fallback: CSS cross-fade
  }

  const r = e.currentTarget.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  // flushSync so the DOM is already in the new theme when the snapshot is taken
  const transition = document.startViewTransition(() =>
    flushSync(() => toggle(false)),
  )

  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [\`circle(0px at \${x}px \${y}px)\`,
                   \`circle(\${Math.ceil(radius)}px at \${x}px \${y}px)\`] },
      { duration: 680, easing: "cubic-bezier(0.33, 0, 0.15, 1)",
        pseudoElement: "::view-transition-new(root)" },
    )
  })
}`,
  },

  a11y: {
    lang: "css",
    code: `/* Every interactive element gets a visible focus ring — no exceptions. */
.signal-room a:focus-visible,
.signal-room button:focus-visible,
.signal-room [tabindex]:focus-visible {
  outline: 2px solid var(--sr-accent);
  outline-offset: 2px;
  border-radius: 6px;
}

/* Off-screen until focused. */
.signal-room .sr-skip-link { position: absolute; left: -9999px; }
.signal-room .sr-skip-link:focus { left: 1rem; top: 0.5rem; }

/* One rule that covers every animation on the site, including any added later. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
  },
};
