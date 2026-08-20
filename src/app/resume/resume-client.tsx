"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { navLinks } from "../components/signal-room-data";
import { yearsOfExperience, yearsPhrase } from "../lib/experience";
import { KIND_LABEL, MEASUREMENTS, type MeasurementId } from "../lib/measurement";

/* ------------------------------------------------------------------ *
 * Resume — digital-first, single column.
 *
 * Deliberately wider than A4 (232mm on screen) because it's read in a
 * browser far more often than it's printed: a wider measure puts most
 * bullets on one or two lines instead of three, which is what makes a
 * dense resume readable. Printing reflows to a true A4 via @media print
 * (see globals.css), so "Download PDF" still yields a selectable,
 * ATS-parseable A4 document.
 *
 * Scan order this layout is built for: name/title → headline numbers →
 * current role → stack → depth.
 * ------------------------------------------------------------------ */

type Role = {
  company: string;
  location: string;
  descriptor: string;
  title: string;
  period: string;
  stack: string[];
  points: string[];
};

type StackGroup = { label: string; items: string[] };

const CONTACT = [
  "UAE — open to relocation, onsite & remote",
  "+971-56-618-4561",
  "rezaan6@gmail.com",
  "linkedin.com/in/rezaan6",
  "github.com/rezaan6",
  "rezaanriyaz.com",
];

// Keyed off the visible string so the list above stays the single source of the
// text, and so a copy/paste export never picks up markup it can't represent.
const CONTACT_HREF: Record<string, string> = {
  "+971-56-618-4561": "tel:+971566184561",
  "rezaan6@gmail.com": "mailto:rezaan6@gmail.com",
  "linkedin.com/in/rezaan6": "https://linkedin.com/in/rezaan6",
  "github.com/rezaan6": "https://github.com/rezaan6",
};

// Short words rather than icon files or pictographs. An SVG sprite would cost a
// request and add nothing legible at ~10px, and the symbol characters this used to
// use (☏ ✉ ⌘) are not in the fonts the PDF renderer has — they came out as empty
// boxes in the generated file, because the glyph was silently coming from a macOS
// system font that the build container does not have. Words also parse: an ATS
// reading "Tel +971…" gets a label, where "☏ +971…" gets a character it will drop.
const CONTACT_GLYPH: Record<string, string> = {
  "+971-56-618-4561": "Tel",
  "rezaan6@gmail.com": "Email",
  "linkedin.com/in/rezaan6": "in",
  "github.com/rezaan6": "GitHub",
};

// Every verb in the first draft of this was a deciding verb — lead, make the
// structural decisions, take responsibility — and none was a building verb.
// Read in the six seconds a screener gives a summary, directly above two titles
// ending "— Lead", that profiles an architect and invites the "over-levelled for
// this role" pass on the hands-on senior roles that are the actual target. The
// hands-on clause comes first for that reason, and it is not a new claim: the
// Hobber bullet below already says the frontend is his end to end.
const POSITIONING = () =>
  `Senior Frontend Engineer with ${yearsPhrase()} owning large React codebases from architecture through production — hands-on as the primary engineer, and leading frontend teams. I work cross-functionally with design, backend and DevOps, and I'm the one who flags where a design will fight the design system. I make the structural decisions a codebase has to live with, and take responsibility for how it performs and how safely it ships.`;

// The five-second scan payload. Every figure is a before/after read against
// a defined baseline — never a causal claim.
// Only the label lives here. The figure itself comes from lib/measurement,
// so changing −40% there changes it on the résumé, in the case tables and in
// the endnotes at once — they used to be three separate copies.
const METRICS: { label: string; m: MeasurementId }[] = [
  { label: "platforms architected 0→1 — Hobber, Kodez", m: "platforms" },
  { label: "page load time, Kodez CMS", m: "load-kodez" },
  { label: "test coverage, Jest + Cypress", m: "coverage" },
  { label: "production releases shipped", m: "releases" },
];

// The site can open a panel; a PDF cannot. Superscript markers on the four
// tiles point at an endnote block after Education, which is on screen as well
// as in print — one artifact, not a screen version and a print version that
// drift. This is the same text the site's disclosures show.
// Each note leads with its figure *and* its label. The figure alone isn't
// always enough — the platforms count is literally "2", which on its own reads
// like the ordinal marker this replaced.
const ENDNOTES = METRICS.map((x) => ({ id: x.m, label: x.label, ...MEASUREMENTS[x.m] }));

const EXPERIENCE: Role[] = [
  {
    company: "Hobber",
    location: "Abu Dhabi, UAE",
    descriptor:
      "Marketplace platform for entertainment, recreation, dining & tourism vendors",
    title: "Senior Frontend Engineer — Lead",
    period: "Jan 2026 — Present",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "shadcn/ui",
      "Feature-sliced architecture",
      "REST",
      "SignalR",
      "Google Maps API",
    ],
    points: [
      "Sole frontend engineer on the Hobber vendor platform — the frontend is mine end to end, architected from an empty repository in React and TypeScript on a modular, feature-sliced structure.",
      "Shipped seven core platform modules — authentication, vendor accounts, dashboards, scheduling, payouts, integrations, and team access — as independent slices over one shared component layer built on shadcn/ui and Radix primitives.",
      "Built the vendor workflows on top: activity management, booking flows, stock scheduling, discount logic, and content management.",
      // Was "cross-slice contracts enforced by TypeScript at build time". That is
      // not what enforces it: TypeScript compiles a cross-slice import perfectly
      // happily. The control is an ESLint no-restricted-imports rule on the import
      // direction; TypeScript checks the contract where slices actually compose,
      // at the route. Conflating a lint rule with a compiler guarantee is the
      // fastest way to lose a senior interviewer on this exact topic.
      "Set the architectural boundaries the codebase is held to, so a new domain is a new folder rather than a refactor — cross-slice imports blocked by a lint rule rather than a convention, and the contracts type-checked where slices compose.",
      "Set up the testing layer from scratch — Vitest for unit and integration, Playwright for end-to-end across the vendor workflows.",
      "Built real-time vendor messaging on SignalR against the .NET backend, and the location and routing surfaces on the Google Maps API.",
      "Partner with backend and DevOps engineers on API contracts — pinned against Swagger before building — authentication systems, and platform features.",
    ],
  },
  {
    company: "Axinom",
    location: "Colombo, Sri Lanka (HQ Fürth, Germany)",
    descriptor: "Enterprise media technology delivered on the Mosaic platform",
    title: "Senior Frontend Engineer — Lead",
    period: "Mar 2024 — Nov 2025",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "SCSS",
      "Shaka Player / DRM",
      "Zustand",
      "React Hook Form",
      "Zod",
      "Azure Blob Storage",
      "i18n",
      "Azure DevOps",
    ],
    points: [
      "Led the frontend team building high-performance web applications for clients including the Goethe-Institut and the Lindau Nobel Laureate Meetings, delivering two client products 0→1 — the Goethe-Institut and Lindau builds — through full development, testing and production release cycles.",
      `Reduced page load time ${MEASUREMENTS["load-axinom"].value.replace("−","~")} through bundle optimization, lazy loading, and caching improvements.`,
      "Built on Axinom's Mosaic micro-frontends (Media, Catalogue, Entitlement, DRM) and its APIs for content synchronization and metadata management, rather than hand-rolling media delivery.",
      "Implemented secure DRM playback with Shaka Player, building the player interface as our own event-driven components on top of its defaults rather than inheriting browser-native controls and caption rendering — which look and behave differently on every engine.",
      "Held playback and layout across a browser matrix spanning Chrome, Edge, Firefox and Safari on macOS, Windows, iOS, iPadOS and Android — including that every iOS browser is WebKit underneath, so a defect reported against iOS Chrome is a Safari defect.",
      "Designed i18n in from the start for multi-language experiences across regions.",
      "Delivered large media assets out of Azure Blob Storage through the Azure SDK for the Goethe-Institut build — files big enough that the browser could not simply hold one, so the transfer had to be handled rather than requested.",
      "Worked directly with designers to translate Figma into pixel-perfect, responsive interfaces, holding SEO and WCAG-aligned accessibility across every customer-facing surface.",
      "Owned client-facing technical communication — requirements, feasibility, UX trade-offs, and scope — mentored junior engineers, enforced coding standards, and kept CI/CD stable with DevOps across environments.",
    ],
  },
  {
    company: "Kodez",
    location: "Colombo, Sri Lanka (HQ Melbourne, Australia)",
    descriptor: "Enterprise CMS for service management and logistics",
    title: "Senior Frontend Engineer",
    period: "Mar 2021 — Feb 2024",
    stack: [
      "React",
      "TypeScript",
      "Storybook",
      "Cypress",
      "Redux",
      "Zustand",
      "TanStack Query",
      "React Hook Form",
      "MUI X Data Grid",
      "Node.js / Express",
      "Sequelize",
      "MySQL",
      "Atomic Design",
      "AWS",
    ],
    points: [
      `Architected and delivered a React CMS from 0→1 to MVP as domain modules with SOLID boundaries — each feature owning its components, state and API access, depending only on the shared UI layer beneath it — then led ${MEASUREMENTS.releases.value} production releases on it.`,
      // Second, not fifth. This is the hardest thing on the role and the closest
      // match to what most senior React openings actually are — an inherited
      // codebase, not an empty one. Below the page-load bullet it was read after
      // a skimmer had already filed the role as "greenfield CMS".
      "Migrated a legacy Laravel, jQuery and Bootstrap application to React and ExpressJS incrementally without freezing client delivery — I had worked in that codebase before replacing it, which is why the seams were obvious — and built Node.js BFF layers with the backend team to reduce API latency.",
      `Introduced test-driven development with Jest and Cypress end-to-end gates, driving overall automated coverage to ${MEASUREMENTS.coverage.value} with every critical path behind the merge gate in CI/CD — which is what let releases stay frequent without a regression freeze.`,
      `Built a Storybook-based reusable component library that cut frontend development time ${MEASUREMENTS["dev-time"].value.replace("−","~")} across projects.`,
      `Reduced page load time ${MEASUREMENTS["load-kodez"].value.replace("−","~")} through code-splitting, lazy loading, and asset optimization, with assets served from AWS S3.`,
      `Built REST integrations against the client's enterprise vendor stack — Amtek (Australia), running on Fiserv, Toshiba, NTT DATA, Park Assist and City systems — across a ${MEASUREMENTS.tables.value} table schema.`,
      "Translated Figma designs into responsive interfaces; set frontend standards and ran code reviews as the company scaled from 10 to 60+ people.",
    ],
  },
  {
    company: "RaSoft",
    location: "Colombo, Sri Lanka",
    descriptor: "Seed-stage startup — internal systems and web products",
    title: "Frontend Engineer",
    period: "Dec 2018 — Feb 2021",
    stack: ["React.js", "JavaScript", "SCSS", "Agile / Scrum"],
    points: [
      "Joined as a Frontend Engineer Intern in December 2018 and moved into the full role in June 2019 — first end-to-end UI ownership at a seed-stage startup.",
      "Delivered an Employment Management System from concept to production as the end-to-end UI owner, in React.js, JavaScript, HTML, and SCSS.",
      `Rebuilt the company website around responsive layout and accessibility, lifting UX and conversion ${MEASUREMENTS.conversion.value.replace("+","~")}.`,
      "Improved application performance through refactoring and component-level optimization, and ran code reviews and pair-programming sessions to keep the codebase maintainable as it grew.",
    ],
  },
];

// Grouped chips rather than comma-separated prose: a recruiter scans this,
// and an ATS still reads every token.
const STACK: StackGroup[] = [
  {
    label: "React & Next.js",
    items: [
      "React",
      "Next.js (App + Pages Router)",
      "Server Components",
      "SSR / CSR / ISR",
      "Hydration",
      "Suspense",
      "Error boundaries",
      "Memoization & render isolation",
    ],
  },
  {
    label: "Language & frameworks",
    items: [
      "TypeScript",
      "JavaScript",
      "Zod",
      "Typed API boundaries",
      "Angular (legacy systems)",
    ],
  },
  {
    label: "UI, interaction & design systems",
    items: [
      "Design-system fidelity & Figma handoff",
      "Design collaboration & handoff",
      "Storybook",
      "Design tokens & theming",
      "Tailwind CSS",
      "SCSS",
      "Material UI",
      "shadcn/ui",
      "Radix UI",
      "Atomic Design",
    ],
  },
  {
    label: "State & data",
    items: [
      "TanStack Query",
      "Redux Toolkit",
      "Zustand",
      "React Hook Form",
      "REST",
      "GraphQL",
      "Algolia search",
      "Cache invalidation",
    ],
  },
  {
    label: "Performance",
    items: [
      "Core Web Vitals (LCP, CLS, INP)",
      "Bundle analysis",
      "Code-splitting",
      "Lazy loading",
      "Caching strategies",
      "Lighthouse",
    ],
  },
  {
    label: "Testing & quality",
    items: [
      "Vitest",
      "Playwright",
      "Jest",
      "Cypress",
      "TDD",
      "E2E & integration",
      "CI quality gates",
      "WCAG accessibility",
      "BrowserStack",
    ],
  },
  {
    label: "Security",
    items: [
      "XSS prevention",
      "Secure authentication flows",
      "Token handling",
      "Content validation",
      "Secure API integration patterns",
      "Dependency risk awareness",
    ],
  },
  {
    label: "Backend & delivery",
    items: [
      "Node.js",
      "ExpressJS (BFF)",
      "PHP / Laravel",
      "MySQL",
      "Sequelize",
      "MongoDB",
      "AWS S3",
      "Docker",
      "GitHub Actions",
      "Vercel",
      "Azure Blob Storage",
      "Jira",
      "Azure DevOps",
    ],
  },
  {
    label: "AI-assisted delivery",
    items: [
      "Agent orchestration",
      "MCP integrations",
      "Synthetic test data",
      "Automated PR & deploy workflows",
    ],
  },
];

const EDUCATION: { degree: string; school: string; note?: string }[] = [
  {
    degree: "BSc (Hons) Computer Science & Software Engineering — First Class",
    school: "University of Bedfordshire · 2022",
    // Kept here rather than in the skills chips: it dates the work to 2022 and
    // frames it as academic, which is what it was.
    note: "Dissertation: BlockVote — blockchain-based e-voting on Ethereum (Solidity, Truffle, React, MetaMask)",
  },
  {
    degree: "Higher National Diploma — Computing (Software Engineering)",
    school: "Pearson · 2020",
  },
  {
    degree: "Higher National Diploma — Mechatronics Engineering",
    school: "Cardiff Metropolitan University · 2019",
  },
];

const buildResumeText = () =>
  [
    "MOHAMMED REZAAN RIYAZ",
    `Senior Frontend Engineer — React · Next.js · TypeScript · ${yearsOfExperience()}+ Years`,
    "",
    CONTACT.join("\n"),
    "",
    "SUMMARY",
    POSITIONING(),
    "",
    "HIGHLIGHTS",
    METRICS.map((m) => `- ${MEASUREMENTS[m.m].value} ${m.label}`).join("\n"),
    "",
    "EXPERIENCE",
    EXPERIENCE.map(
      (r) => `${r.company}, ${r.location} — ${r.title}
${r.period}
${r.descriptor}
Stack: ${r.stack.join(", ")}
${r.points.map((pt) => `- ${pt}`).join("\n")}`,
    ).join("\n\n"),
    "",
    "CORE STACK",
    STACK.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n"),
    "",
    "MEASUREMENT NOTES",
    ENDNOTES.map((e) => {
      const lim = "limit" in e && e.limit ? " " + e.limit : "";
      return `${e.value} ${e.label} — ${KIND_LABEL[e.kind]}. ${e.basis}${lim}`;
    }).join("\n"),
    "",
    "EDUCATION",
    EDUCATION.map((e) => `${e.degree} — ${e.school}${e.note ? "\n  " + e.note : ""}`).join("\n"),
  ].join("\n");

/* ----------------------------- sections ---------------------------- */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-neutral-300 pb-1.5 font-[family-name:var(--font-heading)] text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
      {children}
    </h2>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-[3px] text-[9.8px] leading-none text-neutral-700 print:border-neutral-400">
      {children}
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * The phone résumé.
 *
 * The sheet below this is a fixed 232mm and was scaled to fit — which on a
 * 390px phone meant multiplying 10.9px body text by 0.408, so the document
 * a recruiter reaches from the most-clicked link on the site rendered at
 * about four and a half pixels. It was legible only by pinch-zooming a
 * transform-scaled page, and /resume is the destination of every "Resume"
 * CTA on the site.
 *
 * So below the breakpoint the sheet is not scaled, it is not rendered:
 * this reflows the same arrays into one column at normal type sizes. There
 * is no second copy of the content — CONTACT, METRICS, EXPERIENCE, STACK,
 * EDUCATION and ENDNOTES are the same module-level data the sheet reads,
 * so the two cannot drift.
 *
 * The PDF generator renders at 1800px wide, so it always gets the sheet.
 * ------------------------------------------------------------------ */
function MobileResume() {
  return (
    <article className="w-full rounded-2xl bg-white px-5 py-7 text-[15px] leading-[1.6] text-neutral-800 shadow-sm">
      <h1 className="font-[family-name:var(--font-heading)] text-[26px] font-bold leading-tight tracking-[-0.01em] text-neutral-950">
        Mohammed Rezaan Riyaz
      </h1>
      <p className="mt-2 font-[family-name:var(--font-heading)] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#023047]">
        Senior Frontend Engineer
      </p>
      <p className="mt-1.5 text-[13px] text-neutral-600">
        React · Next.js · TypeScript · {yearsPhrase()}
      </p>

      <ul className="mt-5 space-y-1.5 text-[13.5px]">
        {CONTACT.map((line) => {
          const href = CONTACT_HREF[line];
          return (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="w-12 shrink-0 text-neutral-500">
                {CONTACT_GLYPH[line] ?? ""}
              </span>
              {href ? (
                <a href={href} className="text-[#023047] underline decoration-neutral-300 underline-offset-2">
                  {line}
                </a>
              ) : (
                <span className="text-neutral-700">{line}</span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[14.5px] leading-[1.65] text-neutral-700">{POSITIONING()}</p>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        {METRICS.map((metric) => (
          <div key={metric.m} className="rounded-xl bg-neutral-50 px-3 py-2.5">
            <dt className="font-[family-name:var(--font-heading)] text-[19px] font-bold leading-none text-[#023047]">
              {MEASUREMENTS[metric.m].value}
            </dt>
            <dd className="mt-1.5 text-[11.5px] leading-[1.35] text-neutral-600">{metric.label}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-8 border-b border-neutral-300 pb-1.5 font-[family-name:var(--font-heading)] text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
        Experience
      </h2>
      {EXPERIENCE.map((role) => (
        <section key={role.company} className="mt-5">
          <p className="font-[family-name:var(--font-heading)] text-[16px] font-semibold text-neutral-950">
            {role.company}
          </p>
          <p className="text-[13px] text-neutral-600">
            {role.location} · {role.period}
          </p>
          <p className="mt-1 text-[14px] font-medium text-[#023047]">{role.title}</p>
          <p className="mt-0.5 text-[12.5px] uppercase tracking-[0.06em] text-neutral-500">
            {role.descriptor}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {role.stack.map((s) => (
              <li key={s} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11.5px] text-neutral-700">
                {s}
              </li>
            ))}
          </ul>
          <ul className="mt-3 space-y-2 text-[14px] leading-[1.6]">
            {role.points.map((p) => (
              <li key={p} className="flex gap-2">
                <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2 className="mt-8 border-b border-neutral-300 pb-1.5 font-[family-name:var(--font-heading)] text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
        Core stack
      </h2>
      {STACK.map((group) => (
        <div key={group.label} className="mt-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
            {group.label}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li key={item} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[12px] text-neutral-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2 className="mt-8 border-b border-neutral-300 pb-1.5 font-[family-name:var(--font-heading)] text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
        Education
      </h2>
      {EDUCATION.map((e) => (
        <div key={e.degree} className="mt-4">
          <p className="text-[14px] font-medium text-neutral-900">{e.degree}</p>
          <p className="text-[13px] text-neutral-600">{e.school}</p>
          {e.note ? <p className="mt-1 text-[12.5px] leading-[1.5] text-neutral-500">{e.note}</p> : null}
        </div>
      ))}

      <h2 className="mt-8 border-b border-neutral-300 pb-1.5 font-[family-name:var(--font-heading)] text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
        Measurement notes
      </h2>
      <p className="mt-3 text-[12.5px] leading-[1.6] text-neutral-500">
        What each figure is, and where it stops — a count, a reading and a judgement are
        not the same kind of claim.
      </p>
      <dl className="mt-3 space-y-3">
        {ENDNOTES.map((note) => (
          <div key={note.id}>
            <dt className="text-[12.5px] font-semibold text-neutral-700">
              {MEASUREMENTS[note.id].value} {note.label} · {KIND_LABEL[note.kind]}
            </dt>
            <dd className="mt-0.5 text-[12.5px] leading-[1.55] text-neutral-500">
              {note.basis}
              {"limit" in note && note.limit ? ` ${note.limit}` : ""}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function ResumePage() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [isNarrow, setIsNarrow] = useState(false);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>();
  const resumeRef = useRef<HTMLElement | null>(null);

  // The document is a fixed 232mm wide, so any viewport narrower than that can only
  // see it scaled — and scaling 10.9px body text is how /resume ended up rendering
  // at 4.45 effective pixels on a 390px phone. The breakpoint sits just above the
  // sheet's own width: at 900px it renders at ~0.99 and needs no help, and below
  // that MobileResume reflows the same data instead. The sheet is not mounted at
  // all when narrow, so nothing is scaled into illegibility.
  const NARROW_PX = 900;
  useEffect(() => {
    const PAGE_PX = 877; // 232mm at 96dpi
    const fit = () => {
      setIsNarrow(window.innerWidth < NARROW_PX);
      setScale(Math.min(1, Math.max(0.3, (window.innerWidth - 32) / PAGE_PX)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (scale >= 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- only applies while scaled down
      setScaledHeight(undefined);
      return;
    }
    const id = requestAnimationFrame(() =>
      setScaledHeight(Math.ceil((resumeRef.current?.scrollHeight ?? 1400) * scale)),
    );
    return () => cancelAnimationFrame(id);
  }, [scale]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildResumeText());
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  };

  return (
    <main className="resume-shell min-h-screen bg-zinc-100 px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto flex w-full max-w-[250mm] flex-col items-center gap-4">
        {/* Toolbar — excluded from print. */}
        <div
          className="signal-room sticky top-3 z-30 w-full overflow-hidden rounded-[10px] border border-[var(--sr-hairline)] shadow-[0_12px_30px_rgba(24,24,27,0.08)] print:hidden"
          data-theme="light"
        >
          <div className="flex items-center gap-3 bg-[var(--sr-panel)] px-4 py-2.5">
            {/* Below sm this was a 147px window onto 620px of links: only HOME and
                WORK fitted and PROJECTS was clipped to a bare "P", which reads as a
                rendering bug rather than an affordance. One back link instead — the
                full nav returns at sm. */}
            <Link
              href="/"
              className="shrink-0 rounded-full px-2.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.1em] text-[var(--sr-muted)] transition hover:bg-[var(--sr-bg-alt)] hover:text-[var(--sr-text)] sm:hidden"
            >
              ← Back to site
            </Link>
            <nav className="hidden items-center gap-1 overflow-x-auto sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-full px-2.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-muted)] transition duration-200 hover:bg-[var(--sr-bg-alt)] hover:text-[var(--sr-text)]"
                >
                  {link.label}
                </Link>
              ))}
              <span className="shrink-0 rounded-full bg-[var(--sr-accent-soft)] px-2.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.14em] text-[var(--sr-accent)]">
                Resume
              </span>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span aria-live="polite" role="status" className="sr-only">
                {copyState === "copied"
                  ? "Resume text copied to clipboard"
                  : copyState === "error"
                    ? "Copy failed"
                    : ""}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy resume as plain text"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sr-hairline)] px-3 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
              >
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" />
                </svg>
                <span className="hidden sm:inline">
                  {copyState === "copied" ? "Copied" : copyState === "error" ? "Failed" : "Copy"}
                </span>
              </button>
              {/* Was window.print(), which handed the reader whatever their browser
                  decided to produce — their margins, their paper size, their headers.
                  This file is generated from this same route by
                  scripts/resume-pdf.mjs, so it cannot drift from what's on screen.
                  A paginated A4 version is still built and sits at /resume-a4.pdf for
                  ATS uploads, but it isn't surfaced here — two download buttons made
                  the reader choose before they had any reason to care. */}
              <a
                href="/resume.pdf"
                download="Mohammed-Rezaan-Riyaz-Resume.pdf"
                title="One continuous page, generated from this document"
                className="inline-flex items-center rounded-full bg-[var(--sr-accent-solid)] px-4 py-1.5 text-[12px] font-semibold text-[var(--sr-accent-ink)] transition hover:opacity-90 print:hidden"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>

        {isNarrow ? <MobileResume /> : null}

        <div
          className={`w-full overflow-hidden print:contents ${isNarrow ? "hidden" : ""}`}
          style={scaledHeight && !isNarrow ? { height: `${scaledHeight}px` } : undefined}
        >
          <div
            className="origin-top-left print:contents"
            style={
              scale < 1
                ? { width: "232mm", transform: `scale(${scale})` }
                : { width: "232mm", margin: "0 auto" }
            }
          >
            <div className="resume-paper-frame print:contents">
              <article
                ref={resumeRef}
                className="resume-page bg-white text-[10.9px] leading-[1.5] text-neutral-800"
              >
                {/* ---------------------------- header --------------------------- */}
                <header className="border-b-2 border-neutral-900 px-11 pb-6 pt-9">
                  <div className="flex items-end justify-between gap-8">
                    <div>
                      <h1 className="font-[family-name:var(--font-heading)] text-[34px] font-bold leading-none tracking-[-0.01em] text-neutral-950">
                        Mohammed Rezaan Riyaz
                      </h1>
                      <p className="mt-2.5 font-[family-name:var(--font-heading)] text-[13px] font-semibold uppercase tracking-[0.22em] text-[#023047]">
                        Senior Frontend Engineer
                      </p>
                      <p className="mt-1.5 text-[11.5px] tracking-[0.04em] text-neutral-600">
                        React · Next.js · TypeScript · {yearsPhrase()}
                      </p>
                    </div>
                    {/* Four of these six lines are addressable — a phone number, an
                        email and two profiles — and they were rendered as dead text.
                        A résumé is read in a browser and as a PDF, and in both an
                        anchor is clickable, so the recruiter reaches LinkedIn in one
                        click instead of retyping a URL. The visible text is unchanged
                        so the plain-text export and the printed page read identically;
                        only the link and a small leading glyph are added. */}
                    <ul className="space-y-[3px] text-right text-[10px] leading-[1.45] text-neutral-700">
                      {CONTACT.map((c) => {
                        const href = CONTACT_HREF[c];
                        const glyph = CONTACT_GLYPH[c];
                        const body = (
                          <>
                            {glyph ? (
                              <span aria-hidden="true" className="mr-1.5 inline-block text-neutral-500">
                                {glyph}
                              </span>
                            ) : null}
                            {c}
                          </>
                        );
                        return (
                          <li key={c}>
                            {href ? (
                              <a
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel={href.startsWith("http") ? "noreferrer" : undefined}
                                className="text-neutral-700 underline-offset-2 hover:text-[#023047] hover:underline print:no-underline"
                              >
                                {body}
                              </a>
                            ) : (
                              body
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <p className="mt-6 max-w-[165mm] text-[11.6px] leading-[1.62] text-neutral-700">
                    {POSITIONING()}
                  </p>
                </header>

                {/* --------------------------- highlights ------------------------ */}
                <section className="grid grid-cols-4 border-b border-neutral-200 bg-neutral-50 print:bg-white">
                  {/* The outer edges of this strip carry the document's own margin
                      (px-11) rather than the tile padding, so the first figure sits
                      on the same left spine as the name above it and every bullet
                      below. Interior tiles stay at px-6 — matching the outer padding
                      all the way across would push the middle figures apart and make
                      the row read as four separate cards. */}
                  {METRICS.map((m, i) => (
                    <div
                      key={m.label}
                      className={[
                        "py-5",
                        i === 0 ? "pl-11" : "pl-6",
                        i === METRICS.length - 1 ? "pr-11" : "pr-6",
                        i > 0 ? "border-l border-neutral-200" : "",
                      ].join(" ")}
                    >
                      <p className="font-[family-name:var(--font-heading)] text-[23px] font-bold leading-none tracking-[-0.01em] text-[#023047]">
                        {/* No superscript marker. Each note below leads with its
                            own figure — "−40% · Before/after reading" — so the
                            value is the label, and an ordinal was a second
                            numbering scheme to follow for no gain. */}
                        {MEASUREMENTS[m.m].value}
                      </p>
                      <p className="mt-2 text-[9.8px] leading-[1.4] text-neutral-600">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </section>

                {/* --------------------------- experience ------------------------ */}
                <section className="px-11 pb-8 pt-8">
                  <SectionHeading>Experience</SectionHeading>

                  <div className="space-y-7">
                    {EXPERIENCE.map((role) => (
                      <div key={role.company} className="break-inside-avoid">
                        <div className="flex items-baseline justify-between gap-6">
                          <h3 className="font-[family-name:var(--font-heading)] text-[14.5px] font-bold text-neutral-950">
                            {role.company}
                            <span className="font-medium text-neutral-500">
                              {" · "}
                              {role.location}
                            </span>
                          </h3>
                          <p className="shrink-0 font-[family-name:var(--font-heading)] text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                            {role.period}
                          </p>
                        </div>

                        <p className="mt-1 text-[12px] font-semibold text-[#023047]">
                          {role.title}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-neutral-500">
                          {role.descriptor}
                        </p>

                        <ul className="mt-2.5 flex flex-wrap gap-1.5">
                          {role.stack.map((s) => (
                            <Chip key={s}>{s}</Chip>
                          ))}
                        </ul>

                        <ul className="mt-3 space-y-1.5">
                          {role.points.map((pt) => (
                            <li key={pt} className="flex gap-2.5">
                              <span
                                aria-hidden="true"
                                className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full bg-[#023047]"
                              />
                              <span className="flex-1">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* --------------------------- core stack ------------------------ */}
                <section className="break-inside-avoid border-t border-neutral-200 px-11 pb-8 pt-7">
                  <SectionHeading>Core Stack</SectionHeading>
                  <div className="grid grid-cols-2 gap-x-9 gap-y-4">
                    {STACK.map((group) => (
                      <div key={group.label}>
                        <p className="mb-1.5 font-[family-name:var(--font-heading)] text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                          {group.label}
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {group.items.map((item) => (
                            <Chip key={item}>{item}</Chip>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* --------------------------- education ------------------------- */}
                <section className="break-inside-avoid border-t border-neutral-200 px-11 pb-9 pt-7">
                  <SectionHeading>Education</SectionHeading>
                  <div className="grid grid-cols-3 gap-6">
                    {EDUCATION.map((e) => (
                      <div key={e.degree}>
                        <p className="text-[11.5px] font-semibold text-neutral-950">
                          {e.degree}
                        </p>
                        <p className="mt-0.5 text-[10.3px] text-neutral-600">{e.school}</p>
                        {e.note ? (
                          <p className="mt-1.5 text-[9.8px] italic leading-[1.45] text-neutral-500">
                            {e.note}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>

                {/* ------------------------ measurement notes -------------------- */}
                <section className="break-inside-avoid border-t border-neutral-200 px-11 pb-9 pt-7">
                  <SectionHeading>Measurement Notes</SectionHeading>
                  <p className="mb-3 text-[9.6px] leading-[1.5] text-neutral-500">
                    What each figure is, and where it stops — a count, a reading
                    and a judgement are not the same kind of claim.
                  </p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {ENDNOTES.map((e) => (
                      <div key={e.id} className="break-inside-avoid">
                        <p className="text-[9.8px] font-semibold text-neutral-800">
                          {e.value} {e.label}
                          <span className="font-normal text-neutral-500">
                            {" · "}
                            {KIND_LABEL[e.kind]}
                          </span>
                        </p>
                        <p className="mt-0.5 text-[9.3px] leading-[1.5] text-neutral-600">
                          {e.basis}
                          {"limit" in e && e.limit ? (
                            <span className="text-neutral-500"> {e.limit}</span>
                          ) : null}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </article>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
