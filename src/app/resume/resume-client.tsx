"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { navLinks } from "../components/signal-room-data";
import { yearsOfExperience, yearsPhrase } from "../lib/experience";

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

const POSITIONING = () =>
  `Senior Frontend Engineer with ${yearsPhrase()} owning large React codebases from architecture through production. I lead frontend teams, work cross-functionally with design, backend and DevOps, and turn Figma into pixel-perfect, accessible interfaces. I make the structural decisions a codebase has to live with, and take responsibility for how it performs and how safely it ships.`;

// The five-second scan payload. Every figure is a before/after read against
// a defined baseline — never a causal claim.
const METRICS = [
  { value: "2", unit: "platforms", label: "architected 0→1" },
  { value: "−40%", unit: "", label: "page load time, Kodez CMS" },
  { value: "90%", unit: "", label: "automated coverage, critical paths" },
  { value: "40+", unit: "", label: "production releases shipped" },
];

const EXPERIENCE: Role[] = [
  {
    company: "Hobber",
    location: "HQ Abu Dhabi, UAE",
    descriptor:
      "Marketplace platform for entertainment, recreation, dining & tourism vendors",
    title: "Lead Frontend Engineer",
    period: "Jan 2026 — Present",
    stack: ["React", "TypeScript", "Feature-sliced architecture", "REST", "Real-time"],
    points: [
      "Lead frontend development of the Hobber vendor platform, architecting the vendor dashboard from an empty repository in React and TypeScript on a modular, feature-sliced structure.",
      "Shipped seven core platform modules — authentication, vendor accounts, dashboards, scheduling, payouts, integrations, and team access — as independent slices over one shared component layer.",
      "Built the vendor workflows on top: activity management, booking flows, stock scheduling, discount logic, and content management.",
      "Set the architectural boundaries the codebase is held to, so a new domain is a new folder rather than a refactor, with cross-slice contracts enforced by TypeScript at build time.",
      "Set up the testing layer from scratch — Vitest for unit and integration, Playwright for end-to-end across the vendor workflows.",
      "Partner with backend and DevOps engineers on API contracts, authentication systems, and real-time platform features.",
    ],
  },
  {
    company: "Axinom",
    location: "HQ Fürth, Germany",
    descriptor: "Enterprise media technology delivered on the Mosaic platform",
    title: "Lead Frontend Engineer",
    period: "Mar 2024 — Nov 2025",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "SCSS",
      "Shaka Player / DRM",
      "i18n",
      "Azure DevOps",
    ],
    points: [
      "Led the frontend team building high-performance web applications for clients including the Goethe-Institut and the Lindau Nobel Laureate Meetings, delivering multiple products 0→1 through full development, testing, and production release cycles.",
      "Reduced page load time ~15% through bundle optimization, lazy loading, and caching improvements.",
      "Built on Axinom's Mosaic micro-frontends (Media, Catalogue, Entitlement, DRM) and its APIs for content synchronization and metadata management, rather than hand-rolling media delivery.",
      "Implemented secure DRM playback with Shaka Player, and designed i18n in from the start for multi-language experiences across regions.",
      "Worked directly with designers to translate Figma into pixel-perfect, responsive interfaces, holding SEO and WCAG-aligned accessibility across every customer-facing surface.",
      "Owned client-facing technical communication — requirements, feasibility, UX trade-offs, and scope — mentored junior engineers, enforced coding standards, and kept CI/CD stable with DevOps across environments.",
    ],
  },
  {
    company: "Kodez",
    location: "HQ Melbourne, Australia",
    descriptor: "Enterprise CMS for service management and logistics",
    title: "Senior Frontend Engineer",
    period: "Mar 2021 — Feb 2024",
    stack: [
      "React",
      "TypeScript",
      "Storybook",
      "Cypress",
      "Redux",
      "TanStack Query",
      "Material UI",
      "Node.js / Express",
      "AWS",
    ],
    points: [
      "Architected and delivered a React CMS from 0→1 to MVP as a microarchitecture applying SOLID principles, then led 40+ production releases on it.",
      "Introduced TDD with Cypress and drove automated coverage past 90% on critical paths, gated in CI/CD — the reason release throughput stayed safe at that volume.",
      "Built a Storybook-based reusable component library that cut frontend development time ~30% across projects.",
      "Reduced page load time ~40% through code-splitting, lazy loading, and asset optimization, with assets served from AWS S3 behind CloudFront.",
      "Migrated a legacy PHP/jQuery application to React and ExpressJS incrementally, cutting technical debt ~25% without freezing client delivery — and built Node.js BFF layers with the backend team to reduce API latency.",
      "Built REST integrations against the client's enterprise vendor stack — Amtek (Australia), running on Fiserv, Toshiba, NTT DATA, Park Assist and City systems — across a 250+ table schema.",
      "Translated Figma designs into pixel-perfect, responsive interfaces; set frontend standards and ran code reviews as the team scaled from 10 to 60+ engineers.",
    ],
  },
  {
    company: "RaSoft",
    location: "HQ Colombo, Sri Lanka",
    descriptor: "Seed-stage startup — internal systems and web products",
    title: "Frontend Engineer (from Frontend Engineer Intern)",
    period: "Dec 2018 — Feb 2021",
    stack: ["React.js", "JavaScript", "SCSS", "Agile / Scrum"],
    points: [
      "Delivered an Employment Management System from concept to production as the end-to-end UI owner, in React.js, JavaScript, HTML, and SCSS.",
      "Rebuilt the company website around responsive layout and accessibility, lifting UX and conversion ~15%; the same push contributed to ~20% growth in client acquisition.",
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
      "SSR / CSR / ISR",
      "Hydration",
      "Suspense",
      "Error boundaries",
      "Memoization & render isolation",
      "Reconciliation",
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
      "Pixel-perfect Figma implementation",
      "Design collaboration & handoff",
      "Interaction & motion design",
      "Storybook",
      "Design tokens & theming",
      "Tailwind CSS",
      "SCSS",
      "Material UI",
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
      "PostgreSQL",
      "MongoDB",
      "AWS (S3, CloudFront)",
      "Docker",
      "GitHub Actions",
      "Vercel",
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
    degree: "Pearson BTEC Level 5 HND — Computing (Software Engineering)",
    school: "British College of Applied Studies · 2020",
  },
  {
    degree: "Higher Diploma — Mechatronics Engineering",
    school: "ICBT, moderated by Cardiff Metropolitan University · 2019",
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
    METRICS.map((m) => `- ${m.value}${m.unit ? " " + m.unit : ""} ${m.label}`).join("\n"),
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

export default function ResumePage() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>();
  const resumeRef = useRef<HTMLElement | null>(null);

  // The document is a fixed 232mm wide; scale it down to fit narrow viewports
  // rather than letting it clip or reflow into something unreadable.
  useEffect(() => {
    const PAGE_PX = 877; // 232mm at 96dpi
    const fit = () =>
      setScale(Math.min(1, Math.max(0.3, (window.innerWidth - 32) / PAGE_PX)));
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
            <nav className="flex items-center gap-1 overflow-x-auto">
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
              <button
                type="button"
                onClick={() => window.print()}
                title="Opens the print dialog — choose “Save as PDF”. Reflows to A4."
                className="rounded-full bg-[var(--sr-accent-solid)] px-4 py-1.5 text-[12px] font-semibold text-[var(--sr-accent-ink)] transition hover:opacity-90"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <div
          className="w-full overflow-hidden print:contents"
          style={scaledHeight ? { height: `${scaledHeight}px` } : undefined}
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
                    <ul className="space-y-[3px] text-right text-[10px] leading-[1.45] text-neutral-700">
                      {CONTACT.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-6 max-w-[165mm] text-[11.6px] leading-[1.62] text-neutral-700">
                    {POSITIONING()}
                  </p>
                </header>

                {/* --------------------------- highlights ------------------------ */}
                <section className="grid grid-cols-4 border-b border-neutral-200 bg-neutral-50 print:bg-white">
                  {METRICS.map((m, i) => (
                    <div
                      key={m.label}
                      className={`px-6 py-5 ${i > 0 ? "border-l border-neutral-200" : ""}`}
                    >
                      <p className="font-[family-name:var(--font-heading)] text-[23px] font-bold leading-none tracking-[-0.01em] text-[#023047]">
                        {m.value}
                        {m.unit ? (
                          <span className="ml-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
                            {m.unit}
                          </span>
                        ) : null}
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
              </article>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
