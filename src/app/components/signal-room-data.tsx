/* ------------------------------------------------------------------ *
 * Signal Room — shared content + types for the software-engineering
 * portfolio. Pure data, imported by the client UI module and the route
 * pages. Every claim here traces to the resume or a role description.
 *
 * One rule worth stating: no copy in this file hardcodes a length of
 * career or a version number. Both go stale on their own schedule and
 * neither announces that it has. Years come from `lib/experience`;
 * stack chips name the tool and let the reader assume current.
 * ------------------------------------------------------------------ */

import { yearsPhrase } from "../lib/experience";
import { MEASUREMENTS, type MeasurementId } from "../lib/measurement";

export const contact = {
  email: "rezaan6@gmail.com",
  phone: "+971-56-618-4561",
  phoneHref: "tel:+971566184561",
  linkedin: "https://linkedin.com/in/rezaan6",
  github: "https://github.com/rezaan6",
  resume: "/resume",
  site: "rezaanriyaz.com",
};

export const navLinks = [
  { href: "/", num: "01", label: "Home" },
  { href: "/work", num: "02", label: "Work" },
  { href: "/projects", num: "03", label: "Projects" },
  { href: "/stack", num: "04", label: "Stack" },
  { href: "/method", num: "05", label: "Method" },
  { href: "/artifacts", num: "06", label: "Artifacts" },
  { href: "/about", num: "07", label: "About" },
];

export const archetypeChips = [
  "Frontend Architecture",
  "Performance",
  "Design Systems",
  "Testing & Release Safety",
];

export type CaseStudy = {
  company: string;
  slug: string;
  mark: string;
  tag: string;
  domain: string;
  period: string;
  color: string;
  brand?: string;
  logo: string;
  metric: string;
  headline: string;
  // Scannable summary (shown by default)
  problem: string;
  move: string;
  result: string;
  /** The hard constraint the work happened inside. */
  tradeoffShort: string;
  /** Plain before/after results — no invented percentages, no dashboard bars. */
  // `value` only for rows with no measurement entry; tagged rows read theirs
  // from lib/measurement so the figure lives in exactly one place.
  results: { label: string; value?: string; note?: string; m?: MeasurementId }[];
  // Full breakdown (revealed on the detail page)
  context: string;
  decision: string;
  tradeoff: string;
  signal: string;
  outcome: string;
  detail: string;
  // User-facing lede + truthful context chips + the engineering practices the
  // case demonstrates (grounded strictly in the role's facts).
  customerLede?: string;
  scale?: string[];
  stack?: string[];
  practices?: { lp: string; why: string }[];
  /**
   * An illustrative snippet of the pattern the case is about — written to
   * show the shape of the decision, not lifted from client code (which is
   * under NDA). Highlighted at build time; see lib/highlight.ts.
   */
  code?: { caption: string; lang?: "tsx" | "typescript" | "bash"; source: string };
};

export const caseStudies: CaseStudy[] = [
  {
    company: "Hobber",
    slug: "hobber",
    mark: "HB",
    tag: "MARKETPLACE PLATFORM · FRONTEND ARCHITECTURE",
    domain:
      "Vendor platform for entertainment, recreation, dining & tourism vendors · UAE",
    period: "Jan 2026 — Present",
    color: "#88C010",
    brand: "#88C010",
    logo: "/logos/hobber.png",
    metric: "Vendor dashboard architected 0→1",
    headline:
      "Architecting a vendor platform from an empty repo: feature slices over one sprawling dashboard.",
    problem:
      "A vendor platform needs auth, accounts, dashboards, scheduling, payouts, integrations, and team access — and none of it existed. Built as one surface, it turns into a monolith before the first release.",
    move:
      "Architected the dashboard from scratch in React and TypeScript on a modular, feature-based structure, so each domain owns its own slice and ships on its own cadence.",
    result:
      "Seven core platform modules and five vendor workflows in production on one shared component layer — with the structure still legible enough that a new domain is a new folder, not a refactor.",
    tradeoffShort: "Upfront architecture vs. time to first screen",
    results: [
      { label: "Platform modules shipped", note: "each in its own slice", m: "modules" },
      { label: "Vendor workflows built on the shared layer", value: "5" },
      {
        label: "Test layer",
        value: "0→1",
        note: "Vitest for unit and integration, Playwright for E2E",
      },
      {
        label: "Page-load baseline",
        value: "not yet measured",
        note: "no before/after to report yet",
      },
    ],
    context:
      "Hobber is a marketplace for entertainment, recreation, dining, and tourism vendors, and the vendor platform is the side those businesses actually operate on. When I joined there was no dashboard — just a list of everything it would eventually need: authentication, vendor accounts, dashboards, scheduling, payouts, integrations, and team access management. Each of those is a real domain with its own state, its own permissions, and its own backend surface. The default path is to start with one screen and keep adding to it; three months later every change touches everything.",
    decision:
      "I architected the frontend from scratch on a modular, feature-based structure: each domain owns its own slice — routes, components, state, and API layer together — and shares only an explicit, reusable UI layer underneath. React and TypeScript throughout, so the contract between slices is checked by the compiler rather than by convention. That let me build activity management, booking flows, stock scheduling, discount logic, and vendor content management as separate workflows that compose instead of colliding.",
    tradeoff:
      "Upfront architecture vs. time to first screen. Feature slicing and a shared component layer cost real days before anything is demo-able, and at a startup that is a genuinely uncomfortable trade. I took it because the platform's scope was known up front — seven modules, not one — and the alternative is paying it back with interest during the first big feature. What I protected was the boundary: shared UI stays generic, and anything domain-specific lives in its slice, even when copying it would have been faster that afternoon.",
    signal:
      "The honest read here is delivery and change cost, not a performance metric — this is an in-flight platform. I watch whether a new module lands inside its own slice without editing the others, whether the shared components get reused rather than forked, and whether TypeScript catches integration breaks at build time instead of in review. Working with backend and DevOps on APIs, authentication, and real-time features, the question I keep asking is whether a contract change ripples or stays contained.",
    outcome:
      "Authentication, vendor accounts, dashboards, scheduling, payouts, integrations, and team access management are all live as separate feature modules, with activity management, booking flows, stock scheduling, discount logic, and vendor content management built on top of the same reusable UI layer. The structure is the deliverable as much as the screens are: adding a domain is adding a folder.",
    detail:
      "What I'd do differently: I built the shared component layer slightly ahead of demand, and a couple of those early primitives were generalized for use cases that never arrived. The better rule — the one I now hold to — is to let a pattern appear twice before it becomes a shared component, and to keep the third one honest. The lesson I carry: on a greenfield platform the expensive decision is not which framework you pick, it's where you draw the boundaries, because every future feature either respects them or erodes them.",
    code: {
      caption:
        "The boundary rule the whole codebase is held to — a slice may reach down into shared UI, never sideways into another slice. Enforced by lint, not by good intentions.",
      lang: "typescript",
      source: `// features/<domain>/   owns its routes, components, state and api together
// shared/ui/             generic primitives only — no domain knowledge

// eslint.config.mjs — the architecture is a lint rule, not a document.
{
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [{
        // Both patterns are needed. A single-segment glob misses the bare
        // barrel — "@/features/payouts" — which is exactly how anyone would
        // actually reach across a slice.
        group: ["@/features/*", "@/features/*/**"],
        message:
          "Cross-slice import. Compose at the route level, or promote the " +
          "shared piece into shared/ui.",
      }],
    }],
  },
}

// Shared UI stays domain-agnostic: if a prop names a domain, it is not shared.
type ButtonProps = { variant: "primary" | "ghost"; loading?: boolean }  // ok
type RowProps    = { variant: "primary"; isPayoutRow: boolean }         // not shared
`,
    },
    customerLede:
      "Vendors run their whole business — services, schedules, pricing, payouts, and team access — from one dashboard instead of a scattered set of tools and manual back-and-forth.",
    scale: [
      "Two-sided marketplace platform",
      "UAE",
      "Greenfield — architected 0→1",
      "7 platform modules · 5 vendor workflows",
    ],
    stack: [
      "React",
      "TypeScript",
      "Feature-sliced architecture",
      "Vitest",
      "Playwright",
      "REST APIs",
      "Real-time features",
    ],
    practices: [
      {
        lp: "Architecture before the first screen",
        why: "Chose a modular, feature-based structure over a single dashboard surface, so each of the seven platform domains owns its routes, state, and API layer instead of accreting into a monolith.",
      },
      {
        lp: "Reusable beats bespoke",
        why: "Built one shared component layer under every workflow — activity management, booking, stock scheduling, discounts, and content — so vendor features compose rather than each shipping its own UI.",
      },
      {
        lp: "Types as the contract",
        why: "Used TypeScript across every slice so integration breaks between feature modules surface at build time, not in a code review or in production.",
      },
    ],
  },
  {
    company: "Axinom",
    slug: "axinom",
    mark: "AX",
    tag: "MEDIA PLATFORM · PERFORMANCE & DRM",
    domain:
      "Enterprise media platform on Mosaic, for global media clients · HQ Fürth, Germany",
    period: "Mar 2024 — Nov 2025",
    color: "#004078",
    brand: "#004078",
    logo: "/logos/axinom.png",
    metric: `${MEASUREMENTS["load-axinom"].value} page load · secure DRM playback`,
    headline:
      "Building on the platform instead of around it: Mosaic micro-frontends, Shaka Player DRM, and a 15% faster load.",
    problem:
      "Global media clients needed film and audio delivered fast, in their own language, and protected — on a platform whose capabilities already existed as micro-frontends most teams were rebuilding by hand.",
    move:
      "Led the frontend team onto Axinom's Mosaic micro-frontends (Media, Catalogue, Entitlement, DRM), wired secure playback through Shaka Player, and attacked load time at the bundle.",
    result:
      `Page load times down ${MEASUREMENTS["load-axinom"].value.replace("−","~")} through bundle optimization, lazy loading, and caching, with reliable protected playback and multi-language UIs shipped across regions.`,
    tradeoffShort: "Reuse the platform vs. build it bespoke",
    results: [
      { label: "Page load time", note: "bundle, lazy-load, caching", m: "load-axinom" },
      { label: "Mosaic micro-frontends integrated", value: "4", note: "Media, Catalogue, Entitlement, DRM" },
      { label: "Locales shipped", value: "multi-region", note: "i18n designed in, bundles split per locale" },
    ],
    context:
      "Axinom builds enterprise media technology, and its internal platform — Mosaic — already exposes the hard parts of media delivery as micro-frontends: Media, Catalogue, Entitlement, and DRM. I led the frontend team delivering high-performance web applications on top of it for clients including the Goethe-Institut and the Lindau Nobel Laureate Meetings, whose Mediatheque holds decades of lecture recordings from Nobel laureates and young scientists. Two things make that work harder than a normal web build. Protected content has to actually play, on real devices, through a DRM pipeline that fails loudly and unhelpfully. And the audience is international, so every string, layout, and format is a localization problem, not an afternoon of translation.",
    decision:
      "I made building on the platform the default rather than the fallback. Client film and audio content ran through Mosaic's micro-frontends and Mosaic APIs for content synchronization and metadata management, and secure playback went through Shaka Player so DRM was handled by a hardened player rather than a bespoke integration. i18n was designed in from the start instead of retrofitted. On top of that I treated load time as a first-class deliverable — bundle optimization, lazy loading, and caching improvements — rather than something to look at after launch.",
    tradeoff:
      "Reuse the platform vs. build it bespoke. Mosaic's micro-frontends come with their own conventions and integration seams, and there were moments a hand-rolled component would have been quicker for one client. I chose the platform anyway: bespoke media delivery means owning DRM edge cases and metadata sync forever, and that debt lands on whoever inherits the codebase. Where the platform genuinely didn't fit, we extended rather than forked — and I weighed each of those against the maintenance cost out loud, in client and internal reviews.",
    signal:
      `Page load time was the number I could defend, measured before and after the bundle work, and it moved ${MEASUREMENTS["load-axinom"].value.replace("−","~")}. Alongside it I watched playback reliability through the Shaka Player integration, cross-region rendering once i18n was live, and the CI/CD pipelines I kept stable with DevOps — because a performance win that ships unreliably isn't a win. Delivery health was tracked in Azure DevOps and JIRA, with the process documented in Confluence.`,
    outcome:
      `Multiple products delivered 0→1 through full development, testing, and production release cycles; ${MEASUREMENTS["load-axinom"].value.replace("−","~")} faster page loads from bundle optimization, lazy loading, and caching; seamless multi-language experiences across regions; and reliable playback of protected content via Shaka Player and DRM workflows. Alongside the delivery work I strengthened the security posture by identifying vulnerabilities and adding validation and authentication layers, and mentored junior developers while enforcing coding standards.`,
    detail:
      "What I'd do differently: I measured page load as an aggregate for too long. Averages hide the regions and devices where the experience is materially worse, and on an international media product that's exactly where the users you're localizing for live — I'd segment by region and device from the first measurement, not the third. The broader lesson: on a platform like Mosaic, the engineering skill isn't writing more code, it's knowing which capability already exists and integrating it cleanly enough that the next team doesn't rewrite it.",
    code: {
      caption:
        "Route-level splitting with the playback path deliberately excluded — the lazy boundary is a product decision, not a default.",
      lang: "tsx",
      source: `// Everything the user has not asked for yet is deferred...
const Catalogue = dynamic(() => import("./catalogue"), { loading: () => <RowSkeleton /> })
const Settings  = dynamic(() => import("./settings"))

// ...but never anything on the critical path to first frame. A lazy player
// chunk turns a 200ms stall into a "video is broken" support ticket.
import { Player } from "./player"          // eager, always
import { acquireLicense } from "./drm"     // eager, always

// Locale bundles load on demand: shipping every language to every user is a
// cost paid by people who will never see the other strings.
const messages = await import("../locales/" + locale + ".json")`,
    },
    customerLede:
      "Viewers of global media clients get protected film and audio that starts reliably, loads about 15% faster, and reads in their own language.",
    scale: [
      "Enterprise media platform on Mosaic",
      "HQ Fürth, Germany",
      "Clients: Goethe-Institut · Lindau Nobel Laureate Meetings",
      "Led the frontend team",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "SCSS",
      "GraphQL",
      "Shaka Player / DRM",
      "Azure Blob Storage",
      "Azure DevOps",
    ],
    practices: [
      {
        lp: "Performance is a feature",
        why: `Treated load time as a deliverable rather than a post-launch cleanup, cutting it ${MEASUREMENTS["load-axinom"].value.replace("−","~")} through bundle optimization, lazy loading, and caching improvements.`,
      },
      {
        lp: "Build on the platform",
        why: "Delivered client content through Mosaic's Media, Catalogue, Entitlement, and DRM micro-frontends and its APIs instead of hand-rolling content sync and metadata management.",
      },
      {
        lp: "Security is part of the build",
        why: "Implemented secure DRM workflows with Shaka Player and proactively identified vulnerabilities, adding validation and authentication layers rather than deferring them.",
      },
    ],
  },
  {
    company: "Kodez",
    slug: "kodez",
    mark: "KZ",
    tag: "ENTERPRISE CMS · DESIGN SYSTEM & TDD",
    domain:
      "Enterprise CMS for service management & logistics, integrating global clients · HQ Melbourne, Australia",
    period: "Mar 2021 — Feb 2024",
    color: "#F87850",
    brand: "#F87850",
    logo: "/logos/kodez.png",
    metric: `${MEASUREMENTS["load-kodez"].value} load · ${MEASUREMENTS["dev-time"].value} dev time · ${MEASUREMENTS.coverage.value} coverage`,
    headline:
      `A CMS built to be changed: a Storybook design system, ${MEASUREMENTS.coverage.value} Cypress coverage, and ${MEASUREMENTS.releases.value} releases without a freeze.`,
    problem:
      `A React CMS spanning ${MEASUREMENTS.tables.value} SQL tables and enterprise integrations, sitting next to a legacy Laravel and jQuery codebase — every release risked a regression somewhere nobody was looking.`,
    move:
      "Built the CMS 0→1 on a microarchitecture with SOLID boundaries, a Storybook component library as the shared spine, and TDD with Cypress as the gate on every release.",
    result:
      `${MEASUREMENTS.coverage.value} automated coverage, ${MEASUREMENTS["load-kodez"].value.replace("−","~")} faster page loads, ${MEASUREMENTS["dev-time"].value.replace("−","~")} less frontend development time, and ${MEASUREMENTS.releases.value} production releases while migrating the legacy stack incrementally.`,
    tradeoffShort: "Standardize on the system vs. per-project freedom",
    results: [
      { label: "Page load time", note: "code-splitting, lazy loading, asset optimization", m: "load-kodez" },
      { label: "Frontend development time", note: "after the Storybook library landed", m: "dev-time" },
      { label: "Technical debt", note: "legacy Laravel/jQuery migration", m: "tech-debt" },
      { label: "Flow coverage, critical paths", note: "Cypress, gated in CI", m: "coverage" },
      { label: "Production releases", m: "releases" },
    ],
    context:
      `Kodez builds an enterprise CMS for service management and logistics. The client I worked across was Amtek in Australia, whose operation runs on enterprise vendor systems (Fiserv, Toshiba, NTT DATA, Park Assist and City), so the CMS had to integrate cleanly with all of them. The surface is large — database operations spanning ${MEASUREMENTS.tables.value} SQL tables — and it sat alongside a legacy Laravel and jQuery application that still had users. Meanwhile the startup itself grew from 10 to 60+ people. Two forces pull against each other in that setup: the codebase needs to change constantly for clients, and every change is a chance to break something that someone is paid to rely on.`,
    decision:
      `I architected and delivered the CMS from 0→1 to MVP as a React microarchitecture applying SOLID principles, then made two investments that most teams defer. First, a Storybook-based reusable component library — the shared spine, so a new screen is composed rather than authored. Second, Test-Driven Development with Cypress, taken seriously enough to reach ${MEASUREMENTS.coverage.value} automated coverage and wired into CI/CD, so a release is gated by evidence rather than by whoever remembered to click through it. Redux handled state flow, TanStack React Query handled fetching, caching, and synchronization, and Node.js BFF layers cut API latency.`,
    tradeoff:
      `Standardizing on the system vs. per-project freedom. A shared library and an enforced test gate slow down the first version of any given screen — engineers occasionally wanted a bespoke component and got a slightly more general one instead. I made that trade deliberately: at ${MEASUREMENTS.releases.value} releases and a company scaling past 60, consistency is what keeps velocity from decaying. The migration was the same call in a different costume — I moved the legacy Laravel and jQuery application to React and ExpressJS incrementally rather than in a big-bang rewrite, accepting a period of two coexisting stacks to avoid freezing client delivery.`,
    signal:
      `Three numbers, all of them things I could show. Automated test coverage — ${MEASUREMENTS.coverage.value}, running in CI/CD, which is what made frequent releases safe. Page load time, which came down ${MEASUREMENTS["load-kodez"].value.replace("−","~")} through code-splitting, lazy loading, and asset optimization, with AWS S3 serving assets. And frontend development time, which dropped ${MEASUREMENTS["dev-time"].value.replace("−","~")} once the Storybook library was the default way to build. Cross-browser behavior was validated on BrowserStack, and API contracts stayed documented in Swagger, with sprint work tracked in JIRA and Confluence.`,
    outcome:
      `${MEASUREMENTS.releases.value} production releases delivered — new features, defect fixes, and database optimization across ${MEASUREMENTS.tables.value} SQL tables. Page loads ${MEASUREMENTS["load-kodez"].value.replace("−","~")} faster, frontend development ${MEASUREMENTS["dev-time"].value.replace("−","~")} faster, ${MEASUREMENTS.coverage.value} automated Cypress coverage, and a legacy Laravel and jQuery application migrated to React and ExpressJS without a delivery freeze. REST integrations against the client's vendor stack (Fiserv, Toshiba, NTT DATA, Park Assist, City) stayed interoperable throughout.`,
    detail:
      `What I'd do differently: I sold the component library on consistency when I should have sold it on speed. Engineers adopt a design system when it visibly saves them an afternoon, not when it's described as the right thing to do — I'd publish the before/after build time for a real screen in week one and let the number do the arguing. The lesson I carry: release cadence isn't a function of moving fast, it's a function of how cheaply you can prove you didn't break anything. TDD and Storybook weren't overhead on the ${MEASUREMENTS.releases.value} releases; they are what made shipping at that rate feel safe.`,
    code: {
      caption:
        "How a component earns its way into the shared library — the promotion rule, expressed as the story file it has to ship with.",
      lang: "tsx",
      source: `// A component is not "done" until every state it can reach is reachable
// in Storybook. This is what made the library adoptable rather than aspirational.
export default { title: "shared/DataTable", component: DataTable } satisfies Meta

export const Default:  Story = { args: { rows: sample } }
export const Loading:  Story = { args: { rows: [], loading: true } }
export const Empty:    Story = { args: { rows: [] } }
export const Errored:  Story = { args: { error: new Error("Fetch failed") } }
export const TenThousandRows: Story = { args: { rows: many(10_000) } }  // virtualized?

// The gate that made ${MEASUREMENTS.releases.value} releases safe: a bug gets a failing test before a fix.
it("keeps a service unbookable when price is missing", () => {
  expect(isBookable({ status: "bookable", price: undefined })).toBe(false)
})`,
    },
    customerLede:
      "Client service and logistics teams work in a CMS that loads about 40% faster and keeps working release after release, across integrations with the vendor systems their operation runs on.",
    scale: [
      "Enterprise CMS · service mgmt + logistics",
      "HQ Melbourne, Australia",
      `${MEASUREMENTS.tables.value} SQL tables`,
      "Team scaled 10 → 60+",
    ],
    stack: [
      "React",
      "TypeScript",
      "SCSS",
      "Material UI",
      "Redux",
      "TanStack Query",
      "Storybook",
      "Cypress",
      "Node.js / Express",
      "AWS S3",
    ],
    practices: [
      {
        lp: "Tests are how you ship fast",
        why: `Introduced TDD with Cypress to ${MEASUREMENTS.coverage.value} automated coverage inside CI/CD, which is what made ${MEASUREMENTS.releases.value} production releases safe rather than merely frequent.`,
      },
      {
        lp: "Reusable beats bespoke",
        why: "Built a Storybook component library as the shared spine of the CMS, cutting frontend development time ~30% across projects.",
      },
      {
        lp: "Performance is a feature",
        why: `Cut page load time ${MEASUREMENTS["load-kodez"].value.replace("−","~")} with code-splitting, lazy loading, and asset optimization, with assets served from AWS S3.`,
      },
      {
        lp: "Migrate incrementally, never freeze",
        why: "Moved a legacy Laravel and jQuery application I had worked in myself to React and ExpressJS in steps — instead of a big-bang rewrite that would have stopped client delivery.",
      },
    ],
  },
  {
    company: "RaSoft",
    slug: "rasoft",
    mark: "RS",
    tag: "INTERNAL SYSTEMS · 0-TO-1",
    domain: "Employment Management System & company web presence · Sri Lanka",
    period: "Dec 2018 — Feb 2021",
    color: "#E11D48",
    brand: "#E11D48",
    logo: "/logos/rasoft.svg",
    metric: `EMS delivered 0→1 · ${MEASUREMENTS.conversion.value} conversion`,
    headline:
      "Where the engineering habits started: owning an EMS end-to-end at a seed-stage startup.",
    problem:
      "A seed-stage startup needed an Employment Management System that did not exist yet, and a company site that was losing people before they ever got in touch.",
    move:
      "Took the EMS from concept to production as the end-to-end UI owner in React, and rebuilt the company site around responsiveness and accessibility.",
    result:
      `The EMS shipped to production, and the site revamp lifted UX and conversion ${MEASUREMENTS.conversion.value.replace("+","~")} while the same push contributed to ~20% growth in client acquisition.`,
    tradeoffShort: "Rapid delivery vs. scalable architecture",
    results: [
      { label: "Conversion after the UI revamp", note: "responsive redesign + accessibility", m: "conversion" },
      { label: "EMS", value: "concept → production", note: "end-to-end UI ownership" },
    ],
    context:
      "RaSoft is where I started — first as a Frontend Engineer Intern in December 2018, then as a Frontend Engineer through February 2021. It was seed-stage, which in practice means there is no separate frontend team, no design system, and no one else to hand the hard part to. Two problems sat in front of me. The company's own website was underperforming: the UI was dated, it wasn't responsive, and people dropped out before they ever made contact. And internally, employment management had no system at all — it needed to be designed and built.",
    decision:
      "I took end-to-end ownership of the UI rather than picking up tickets. On the site, I revamped the interface around responsive layout and accessibility, on the theory that most of the lost conversions were friction rather than persuasion. On the EMS, I delivered the whole thing from concept to production in React.js, JavaScript, HTML, and SCSS — designing the interactions with the backend engineers rather than waiting for a spec. In a startup that small, the choice on every feature is speed versus a structure that survives the next six months, and I made that call consciously each time instead of always defaulting to speed.",
    tradeoff:
      "Rapid delivery vs. scalable architecture. The honest answer is that I leaned slightly toward architecture and shipped a little slower than I could have — refactoring components rather than duplicating them, and improving performance at the component level while features were still landing. At seed stage that's a defensible but not free choice: some things reached users later than they might have. What I'd defend is the direction, because the EMS was going to be lived in daily, and the site was the company's front door.",
    signal:
      `The site had a number: UX and conversion improved ${MEASUREMENTS.conversion.value.replace("+","~")} after the responsive redesign and accessibility work — reported internally, over the months after launch, and it was one of several things changing at once. The EMS was the other half of the job: an internal system that did not exist, designed and built end to end.`,
    outcome:
      `A complete Employment Management System delivered from concept to production with end-to-end UI development, and a company site rebuilt for responsiveness and accessibility that lifted conversion ${MEASUREMENTS.conversion.value.replace("+","~")}. Along the way I ran code reviews and pair-programming sessions to hold quality, improved performance through refactoring and component-level optimization, and got real exposure to Agile/Scrum through sprint planning and retrospectives.`,
    detail:
      "What I'd do differently: I optimized components before I had any measurement, which is guessing with extra steps. Now I'd profile first and let the numbers pick the target — a habit that later turned into the 40% and 15% load-time wins at Kodez and Axinom, both of which started from a measurement rather than an instinct. The lesson I carry from RaSoft: pair programming and code review were where I actually learned to write maintainable code, and both cost time that always felt like it could be spent shipping. It couldn't.",
    code: {
      caption:
        "The lesson from this role, written as the rule I have followed since — the measurement picks the target, not the instinct.",
      lang: "bash",
      source: `# What I did here: optimized components on instinct, measured nothing.
# What I do now, in this order:

$ npx vite-bundle-visualizer                 # what actually ships, and to whom
$ npx lighthouse <url> --only-categories=performance
$ node --cpu-prof server.js                  # where the time really goes

# Only then: code-split, lazy-load, cache. Measure again, and report the
# before/after against the baseline — not as a causal claim.
`,
    },
    customerLede:
      "Staff got an actual system for employment management instead of ad-hoc process, and visitors to the company site could find and contact the business on any device.",
    scale: [
      "Seed-stage startup · Sri Lanka",
      "Intern → Frontend Engineer",
      "EMS built concept → production",
      "End-to-end UI ownership",
    ],
    stack: ["React.js", "JavaScript", "HTML", "SCSS", "Agile / Scrum"],
    practices: [
      {
        lp: "Own it end to end",
        why: "Delivered the Employment Management System from concept to production as the sole end-to-end UI owner, rather than implementing a spec handed down.",
      },
      {
        lp: "Accessibility is conversion",
        why: `Rebuilt the company site around responsive layout and accessibility improvements, lifting UX and conversion ${MEASUREMENTS.conversion.value.replace("+","~")}.`,
      },
      {
        lp: "Review is where quality happens",
        why: "Ran code reviews and pair-programming sessions at a seed-stage startup where nothing forced them, to keep the codebase maintainable as it grew.",
      },
    ],
  },
];

export const methodSteps = [
  {
    label: "Architect",
    title: "Draw the boundaries before the first component.",
    body: "I model the domains first — what owns what state, where the API surface sits, which pieces are genuinely shared. Feature slices with SOLID boundaries, so a new domain is a new folder instead of a refactor. This is the cheapest decision in the project and the most expensive one to reverse.",
    artifact: "ADR · feature-slice map · component boundaries",
  },
  {
    label: "Build",
    title: "Compose from the system, don't author from scratch.",
    body: "A screen should be assembled out of components that already exist and are already documented. TypeScript carries the contract between slices, Storybook holds the primitives, and server state stays separate from client state so data-fetching bugs don't turn into rendering bugs.",
    artifact: "Storybook library · typed API layer · state model",
  },
  {
    label: "Harden",
    title: "Prove it, then ship it.",
    body: "Tests are what make frequent releases safe rather than merely frequent. TDD with Cypress on the paths that actually matter, wired into CI/CD as a gate — plus cross-browser validation, because 'works on my machine' is a bug report waiting to be filed.",
    artifact: "Cypress E2E · CI quality gates · BrowserStack matrix",
  },
  {
    label: "Measure",
    title: "Profile first, optimize second.",
    body: "Every load-time win I can point to started from a measurement, not an instinct. Bundle analysis, code-splitting, lazy loading, caching — then measure again and report the before/after against a defined baseline rather than claiming causality.",
    artifact: "Bundle audit · Core Web Vitals · before/after read",
  },
];

/* ----------------------------- projects ---------------------------- */

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  /** The one thing the build was actually for — stated plainly. */
  learned: string;
  /**
   * Secondary tier: smaller API-integration builds, kept because they are the
   * only public code touching AI and crypto surfaces. Listed compactly and
   * labelled for what they are rather than dressed up as portfolio pieces.
   */
  minor?: boolean;
  tech: string[];
  github?: string;
  external?: string;
  featured?: boolean;
  category: "Web" | "Desktop";
  year: string;
};

// Personal / open-source builds, migrated from the previous portfolio's
// project content. `featured` entries have a real screenshot in /public.
export const projects: Project[] = [
  {
    slug: "web-scraper",
    title: "Amazon Price Scraper",
    blurb:
      "A Next.js and Firebase Functions app that scrapes Amazon store data through the Bright Data API. The interesting part is the async shape: a scrape is kicked off, a webhook fires when Bright Data finishes, and the result lands in Firestore — so the client subscribes to a real-time document instead of polling a request it can't wait on.",
    learned:
      "Designing a UI around a job that finishes out-of-band — pending, partial, failed, and stale are the actual product states.",
    tech: [
      "Next.js",
      "TypeScript",
      "Firebase Functions",
      "Firestore (real-time)",
      "Webhooks",
      "TailwindCSS",
    ],
    github: "https://github.com/rezaan6/bright-data-web-scraper",
    external: "https://bright-data-web-scraper-rezaan6.vercel.app/",
    featured: true,
    category: "Web",
    year: "2023",
  },
  {
    slug: "streaming-platform",
    title: "Streaming Platform",
    blurb:
      "A full MERN streaming app — an ExpressJS and Mongoose API handling accounts, favourites, and reviews behind JWT auth, with a React client validating through Formik and Yup. Deployed split, server on Render and client on Vercel, which forced the CORS, cookie, and environment handling to be real rather than assumed.",
    learned:
      "Running a genuinely split deployment — the auth and CORS problems only appear once client and API are on different origins.",
    tech: [
      "React",
      "ExpressJS",
      "Mongoose",
      "JWT auth",
      "Formik + Yup",
      "Material UI",
      "Render + Vercel",
    ],
    github: "https://github.com/rezaan6/streaming-platform",
    // No live demo. This is the one project here that streams video, which makes
    // it by far the most bandwidth-expensive thing to host, and it was the one
    // that burned through the account's allowance. The deployment is gone, and
    // it isn't worth re-exposing for the twenty seconds a reader spends on it —
    // the repo's README carries screenshots and the write-up.
    category: "Web",
    year: "2023",
  },
  {
    slug: "admin-dashboard",
    title: "Admin Dashboard",
    blurb:
      "A MERN analytics dashboard over client, sales, and management data, with Nivo for the visualisations and Redux Toolkit holding filter and date-range state. Built mostly to work out how much dashboard state belongs in a global store versus derived on render — the answer turned out to be almost none of it.",
    learned:
      "Where dashboard state actually belongs: filters in the URL, data in the cache, almost nothing in a global store.",
    tech: [
      "React",
      "ExpressJS",
      "MongoDB",
      "Redux Toolkit",
      "Nivo",
      "Material UI",
    ],
    github: "https://github.com/rezaan6/admin-dashboard",
    external: "https://admin-dashboard-rezaan6.vercel.app/",
    featured: true,
    category: "Web",
    year: "2023",
  },
  {
    slug: "chatbot",
    title: "AI Chatbot",
    blurb:
      "A chat interface over the OpenAI API with Google auth — model selection, conversation create/delete, streaming responses, and toast feedback on every action.",
    learned:
      "UI for a response that arrives token by token: streaming state, cancellation, and what the screen shows while the model is still thinking.",
    tech: ["Next.js", "TypeScript", "OpenAI API", "Firebase", "NextAuth"],
    github: "https://github.com/rezaan6/open-ai-chatbot",
    external: "https://open-ai-chatbot-rezaan6.vercel.app/",
    minor: true,
    category: "Web",
    year: "2023",
  },
  {
    slug: "image-generator",
    title: "AI Image Generator",
    blurb:
      "A DALL·E interface for generating, previewing, downloading and publishing images from a text prompt, with generated assets stored on Cloudinary behind an Express API.",
    learned:
      "Long-running generation as a UI problem — prompt state, the wait, failure, and retry all needed designing before the happy path mattered.",
    tech: ["React", "Vite", "TypeScript", "OpenAI API", "Cloudinary", "ExpressJS"],
    github: "https://github.com/rezaan6/open-ai-dalle-image-generator",
    external: "https://open-ai-dalle-image-generator-rezaan6.vercel.app/",
    minor: true,
    category: "Web",
    year: "2023",
  },
  {
    slug: "cryptoverse",
    title: "CryptoVerse",
    blurb:
      "A cryptocurrency dashboard over live market data — coins, exchanges, and news, with Redux Toolkit for state and ChartJs for price history.",
    learned:
      "Rendering volatile market data without the UI thrashing: polling cadence, chart re-render cost, and formatting numbers that change every second.",
    tech: ["React", "Redux Toolkit", "ChartJs", "Rapid API", "Ant Design"],
    github: "https://github.com/rezaan6/rapid-api-cryptoverse",
    external: "https://rapid-api-cryptoverse-rezaan6.vercel.app/",
    minor: true,
    category: "Web",
    year: "2022",
  },
];

/* ----------------------------- artifacts --------------------------- */

export type Artifact = {
  type: string;
  company?: string;
  title: string;
  blurb: string;
  body: string;
};

export const artifacts: Artifact[] = [  {
    type: "ADR",
    company: "Hobber",
    title: "Feature-sliced architecture for the vendor dashboard",
    blurb:
      "The architecture decision record behind the Hobber vendor platform — why seven domains got their own slices instead of one dashboard surface, and what the boundary rules are.",
    body: `ADR-001 — Feature-sliced architecture for the vendor dashboard

STATUS   Accepted
OWNER    Rezaan Riyaz — Senior Frontend Engineer (Lead), Hobber
CONTEXT  Greenfield vendor platform (UAE marketplace: entertainment, recreation, dining, tourism)

CONTEXT
The vendor platform needs authentication, vendor accounts, dashboards, scheduling,
payouts, integrations, and team access management. That is seven domains, each with
its own state, permissions, and backend surface — plus vendor workflows on top
(activity management, booking, stock scheduling, discount logic, content management).
Built as one dashboard surface, cross-domain coupling arrives before the first release.

DECISION
Organize the frontend by feature slice, not by technical layer. Each domain owns its
routes, components, state, and API access together. Slices do not import from each
other; anything genuinely shared is promoted into an explicit UI layer underneath.
React + TypeScript throughout, so cross-slice contracts are compiler-checked.

BOUNDARY RULES
- A slice may import from the shared UI layer. It may not import from another slice.
- Shared UI stays domain-agnostic. If it needs to know about payouts, it isn't shared.
- A pattern is copied twice before it is promoted. Premature generalization is debt.
- Cross-domain flows compose at the route level, not inside a slice.

CONSEQUENCES
+ A new domain is a new folder, not a refactor.
+ Integration breaks surface at build time via TypeScript, not in review.
- Real cost up front, before anything is demo-able. Accepted knowingly.
- Some duplication is tolerated until a pattern has proven itself.

ALTERNATIVES CONSIDERED
A — Single dashboard surface, split later. Fastest to first screen; the "later"
    never has a good week to happen.
B — Layer-first structure (components/, hooks/, services/). Familiar, but a feature
    change touches four directories and reviewers lose the thread.

TRADE-OFF ON RECORD
Upfront architecture vs. time to first screen. Taken because the scope was known
to be seven modules on day one, not discovered later.`,
  },  {
    type: "COMPONENT SPEC",
    company: "Kodez",
    title: "Reusable component library — the API contract",
    blurb:
      `How a component earns its place in the Storybook library: the props contract, the accessibility floor, and what disqualifies a component from being shared. The spine that cut frontend dev time ${MEASUREMENTS["dev-time"].value.replace("−","~")}.`,
    body: `COMPONENT SPEC — Storybook library, Kodez CMS

OWNER   Rezaan Riyaz — Senior Frontend Engineer
STACK   React · TypeScript · SCSS · Material UI · Storybook
RESULT  ~30% reduction in frontend development time across projects

WHY THIS EXISTS
The CMS spans ${MEASUREMENTS.tables.value} SQL tables and enterprise integrations, and the company scaled from
10 to 60+ people. Without a shared spine, every new screen is authored from scratch
and the product drifts. The library is how a screen becomes composition instead of
authorship.

WHEN A COMPONENT IS PROMOTED
- The pattern has appeared at least twice, in two different domains.
- Its behavior can be described without naming a feature.
- It has a story in Storybook covering default, loading, empty, and error states.

THE PROPS CONTRACT
- Typed, required-by-default. Optional props need a documented default.
- No feature-specific props. A prop named "isPayoutRow" disqualifies the component.
- Controlled by default; uncontrolled only where the DOM already owns the state.
- Styling by variant token, never by passing raw class names through.

ACCESSIBILITY FLOOR (non-negotiable)
- Reachable and operable by keyboard, with a visible focus ring.
- Correct role and accessible name; state exposed via ARIA, not colour alone.
- Contrast meets WCAG AA in both themes.

WHAT DISQUALIFIES A COMPONENT
Business logic inside it. Direct data fetching. Knowledge of the route it renders on.
Any of those make it a feature, and features live in their own slice.

DEFINITION OF DONE
Story published · props documented · a11y checked · used in two places.`,
  },  {
    type: "STATE MODEL",
    company: "Hobber",
    title: "Server state vs. client state in the vendor dashboard",
    blurb:
      "The rule that keeps data-fetching bugs from becoming rendering bugs — what belongs in the cache, what belongs in the component, and why the two are never the same store.",
    body: `STATE MODEL — Hobber vendor dashboard

OWNER   Rezaan Riyaz — Senior Frontend Engineer (Lead)
STACK   React · TypeScript · feature-sliced architecture

THE RULE
Server state and client state are different problems and do not share a store. Server
state is a cache of something you do not own, with staleness and revalidation. Client
state is what the user is doing right now, and it is yours. Merging them is how a
network hiccup turns into a rendering bug.

SERVER STATE — cached, keyed, revalidated
Vendor accounts, services, schedules, pricing, payouts, integrations, team members.
Owned by the query layer: cache key, staleness policy, invalidation on mutation.
Never copied into component state "just to make the form work".

CLIENT STATE — local by default
Form drafts, filter selections, which panel is open, optimistic pending flags. Lives
as close to the component that owns it as possible. Lifted only when a sibling truly
needs it; put in a slice-level store only when a route does.

DERIVED STATE — computed, never stored
Vendor readiness, whether a service is bookable, totals. If it can be computed from
server state, computing it is cheaper than keeping two versions in sync.

MUTATION FLOW
Mutate → invalidate the affected cache keys → let the query layer refetch. The screen
reflects what the server actually accepted, not what the client hoped it would.

WHY IT MATTERS HERE
Scheduling, payouts, and discount logic are financially consequential. A stale read on
a payout screen is not a cosmetic bug, so the correctness rule is: when server and
client disagree, the server wins and the UI says so.`,
  },  {
    type: "PERF BUDGET",
    company: "Axinom",
    title: "Page-load budget — how the 15% came out",
    blurb:
      "The performance one-pager for the Axinom media build: what was measured, the three levers that moved it (bundle, lazy-load, caching), and the guardrails that stopped a fast page from becoming a broken one.",
    body: `PERF BUDGET — Media web applications, Axinom (Mosaic)

OWNER   Rezaan Riyaz — Senior Frontend Engineer (Lead)
RESULT  ${MEASUREMENTS["load-axinom"].value.replace("−","~")} reduction in page load time
READ AS Before/after against a defined baseline — not a controlled experiment

WHY THIS EXISTS
Global media clients, protected content, and multi-language UIs. Load time is the
first thing every one of those users experiences, and it was being treated as a
post-launch concern. This page makes it a deliverable with a number attached.

WHAT WAS MEASURED
- Page load time (the headline number, measured before and after)
- Bundle composition — what is actually being shipped, and to whom
- Time to interactive on the routes that carry playback

THE THREE LEVERS
01 · BUNDLE OPTIMIZATION
     Analyse first, cut second. Remove what is shipped but unused; split what is
     needed but not immediately.
02 · LAZY LOADING
     Defer everything below the fold and every route the user has not asked for.
     Playback surfaces load first; catalogue browsing can wait 200ms.
03 · CACHING
     Cache what does not change per request. Metadata from the Mosaic APIs is the
     obvious candidate; entitlement decisions are not.

GUARDRAILS
- Do not win load time by degrading playback reliability or DRM correctness.
- Do not lazy-load anything on the critical path to first frame.
- i18n bundles are split per locale, never shipped as one combined payload.
- Do not read the average alone — it hides the regions and devices where the
  experience is materially worse.

WHAT I'D ADD NEXT
Segment the measurement by region and device from the first read, not the third.
On an international product, the aggregate is the least informative number available.`,
  },  {
    type: "TEST STRATEGY",
    company: "Kodez",
    title: `TDD with Cypress — ${MEASUREMENTS.coverage.value} on the paths that matter`,
    blurb:
      `The testing strategy that made ${MEASUREMENTS.releases.value} production releases safe: what gets a test, what deliberately does not, and where the gate sits in CI/CD.`,
    body: `TEST STRATEGY — Kodez CMS

OWNER   Rezaan Riyaz — Senior Frontend Engineer
RESULT  ${MEASUREMENTS.coverage.value} flow coverage on critical paths · ${MEASUREMENTS.releases.value} production releases

THE PREMISE
Release throughput is not a function of moving fast. It is a function of how cheaply
you can prove you did not break anything. TDD and CI gates were not overhead on the
${MEASUREMENTS.releases.value} releases — they are what made shipping at that rate safe.

THE PYRAMID, AS ACTUALLY BUILT
- Unit (Jest): pure logic, formatters, reducers, data transforms. Fast, plentiful.
- Component: rendering and interaction against the Storybook primitives.
- E2E (Cypress): the flows a client would notice breaking. Fewer, slower, decisive.

WHAT ALWAYS GETS AN E2E TEST
- Authentication and permissions.
- Anything that writes to the ${MEASUREMENTS.tables.value} table schema.
- Every integration surface in the client's vendor stack (Fiserv, Toshiba, NTT DATA, Park Assist, City).
- Any path a defect has already been filed against. A bug gets a test before a fix.

WHAT DELIBERATELY DOES NOT
Presentational-only components with a Storybook story. Third-party library internals.
Anything whose test would restate the implementation line for line.

THE GATE
Tests run in CI/CD on every pull request. A red pipeline blocks merge; there is no
"we'll fix it after". Cross-browser behaviour is validated separately on BrowserStack,
because a green suite on one engine is not a claim about the others.

TDD, HONESTLY
Test-first on logic and on bug fixes, where it genuinely shapes the design. Test-after
on exploratory UI, where writing the assertion first would be inventing a spec I do
not have yet. Claiming otherwise would be theatre.`,
  },  {
    type: "MIGRATION PLAN",
    company: "Kodez",
    title: "Laravel/jQuery → React + Express, without a freeze",
    blurb:
      "How a legacy application moved to a modern stack incrementally — the strangler approach, what shipped in which order, and the rule that kept two coexisting stacks from doubling the work.",
    body: `MIGRATION PLAN — legacy Laravel/jQuery → React + ExpressJS

OWNER   Rezaan Riyaz — Senior Frontend Engineer, Kodez
RESULT  Legacy stack retired incrementally · zero delivery freeze

THE CONSTRAINT
The legacy application had users and client commitments. A big-bang rewrite means
months with nothing shipped and a cutover weekend nobody sleeps through. Not available.

THE APPROACH — STRANGLE, DON'T REPLACE
New surfaces are built in React from day one. Existing surfaces are migrated when they
are being changed anyway, so migration rides along with work that was already funded.
The legacy app keeps running until its last route is gone.

ORDERING
01 · Routes already scheduled for a feature change — migration is nearly free.
02 · High-traffic, high-latency paths — the 40% load-time work lives here.
03 · Integration-heavy screens — moved once the API layer was behind ExpressJS.
04 · Low-traffic legacy screens — last, and some deliberately never.

THE RULE THAT KEPT IT HONEST
One source of truth per feature. A screen is either legacy or migrated, never half.
Two implementations of the same thing is not a migration, it is two products.

BACKEND SIDE
Node.js BFF layers in front of the existing services, so the React client talks to one
coherent API instead of the legacy shape. This is what made screen-by-screen migration
possible without renegotiating every backend contract.

RISK CONTROLS
- Every migrated route ships behind the same Cypress gate as new work.
- Cross-browser validated on BrowserStack before the legacy route is retired.
- Swagger kept current, so the contract is readable by both stacks.

TRADE-OFF ON RECORD
A period of two coexisting stacks — more surface area, more context-switching — in
exchange for never stopping client delivery. Taken deliberately.`,
  },
];

export const timeline = [
  {
    year: "2026",
    company: "Hobber",
    role: "Senior Frontend Engineer — Lead",
    place: "HQ Abu Dhabi, UAE",
    // One line. The title carries the seniority; this carries the substance.
    scope:
      "Architected a vendor marketplace platform 0→1 — seven feature-sliced modules on one shared React + TypeScript component layer.",
  },
  {
    year: "2024",
    company: "Axinom",
    role: "Senior Frontend Engineer — Lead",
    place: "HQ Fürth, Germany",
    scope:
      `Led the frontend team on an enterprise media platform — Mosaic micro-frontends, Shaka Player DRM, i18n, and ${MEASUREMENTS["load-axinom"].value.replace("−","~")} faster page loads.`,
  },
  {
    year: "2021",
    company: "Kodez",
    role: "Senior Frontend Engineer",
    place: "HQ Melbourne, Australia",
    scope:
      `Built an enterprise CMS 0→1 and the standards a company scaling 10 → 60+ built against — Storybook system, ${MEASUREMENTS.coverage.value} Cypress coverage, ${MEASUREMENTS.releases.value} releases.`,
  },
  {
    year: "2018",
    company: "RaSoft",
    role: "Frontend Engineer",
    place: "HQ Colombo, Sri Lanka",
    scope:
      `Joined as an intern and left owning the UI end to end — an employment system from concept to production, and a site revamp that lifted conversion ${MEASUREMENTS.conversion.value.replace("+","~")}.`,
  },
];

export const principles: { label: string; body: string }[] = [
  {
    label: "Architecture before the first screen",
    body: "Where you draw the boundaries is the cheapest decision in a project and the most expensive one to reverse. Feature slices with SOLID edges, so a new domain is a new folder rather than a refactor.",
  },
  {
    label: "Reusable beats bespoke",
    body: "A screen should be composed, not authored. The Storybook library at Kodez cut frontend development time ~30% — but only after a pattern had proven itself twice. Premature generalization is just debt with better manners.",
  },
  {
    label: "Performance is a feature",
    body: `Profile first, optimize second. Every load-time win I can point to — ${MEASUREMENTS["load-kodez"].value.replace("−","~")} at Kodez, ${MEASUREMENTS["load-axinom"].value.replace("−","~")} at Axinom — started from a measurement, not an instinct. And never read the average alone; it hides the users having the worst time.`,
  },
  {
    label: "Tests are how you ship fast",
    body: `Release throughput isn't a function of moving fast, it's a function of how cheaply you can prove you didn't break anything. ${MEASUREMENTS.coverage.value} Cypress coverage in CI wasn't overhead on ${MEASUREMENTS.releases.value} releases — it's why there were ${MEASUREMENTS.releases.value} releases.`,
  },
];

// The stack I build with — grouped by what each tool is for, from architecture
// through delivery. Tools with a `slug` use a local SVG (public/logos/tools)
// carrying its real brand colour; tools without an available brand icon use a
// coloured `mono` initial in the same treatment (honest and consistent rather
// than a mismatched or fabricated logo).
type Tool = {
  name: string;
  group: string;
  use: string;
  slug?: string;
  mono?: string;
  color?: string; // brand colour for the monogram fallback
  howIUse?: string;
  sample?: string;
};

export const tools: Tool[] = [
  {
    name: "React",
    slug: "react",
    group: "Core frontend",
    use: "Component architecture & rendering",
    howIUse:
      `React is where most of my ${yearsPhrase()} live — I think in component boundaries and rendering behaviour before I think in screens. That means being deliberate about reconciliation and memoization, keeping controlled and uncontrolled components from mixing, and isolating components so one slow subtree doesn't drag a page down. At Hobber I used it to architect a vendor dashboard as independent feature slices; at Kodez it carried a CMS through ${MEASUREMENTS.releases.value} production releases without the render layer becoming the bottleneck.`,
    sample: `Feature slice — the boundary rule
features/payouts/     routes · components · state · api  (owns its domain)
features/scheduling/  routes · components · state · api
shared/ui/            generic primitives only — no domain knowledge
Rule: a slice imports from shared/ui, never from another slice.`,
  },
  {
    name: "Next.js",
    slug: "nextdotjs",
    group: "Core frontend",
    use: "App Router, SSR/CSR & routing",
    howIUse:
      `I use Next.js when the rendering strategy is itself a product decision — which parts must be server-rendered for SEO and first paint, which are client-interactive, and where the hydration boundary sits. At Axinom that mattered for media applications where load time was a deliverable: route-level code-splitting and deferred client bundles were a large part of the ${MEASUREMENTS["load-axinom"].value.replace("−","~")} improvement. I work across both the App Router and Pages, and I treat the server/client boundary as an explicit design choice rather than a default.`,
    sample: `Rendering decision, per route
/catalogue     server-rendered  — SEO + fast first paint
/player        client            — DRM + playback state
/account/*     client, lazy      — behind auth, not on the critical path
Guardrail: nothing on the path to first frame is lazy-loaded.`,
  },
  {
    name: "TypeScript",
    slug: "typescript",
    group: "Core frontend",
    use: "Type-safe contracts across the codebase",
    howIUse:
      "TypeScript is how I make architectural boundaries enforceable instead of aspirational. In a feature-sliced codebase the contract between slices is a type, so an integration break surfaces at build time rather than in review or production. I type API responses at the edge and let inference carry from there, keep unions narrow so impossible states are unrepresentable, and avoid the escape hatches — an `any` in a shared component is a boundary quietly dissolving.",
    sample: `Make the impossible state unrepresentable
type VendorService =
  | { status: "draft";     price?: never }
  | { status: "bookable";  price: Money }   // bookable implies a price
// The compiler now rejects a bookable service with no price.`,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwindcss",
    group: "Styling & design systems",
    use: "Utility-first styling & design tokens",
    howIUse:
      "I use Tailwind where speed of iteration matters and the design tokens are already settled, keeping the utility soup contained by pushing repeated combinations into components rather than into `@apply`. The discipline is the same as any design system: variants live in the component's API, not in class strings passed down through props, so a card can't be restyled arbitrarily from three call sites.",
    sample: `Variant lives in the component, not the call site
<Card tone="warning" density="compact" />   ✅ typed variant
<Card className="bg-amber-50 p-2" />        ❌ style leaking in`,
  },
  {
    name: "SCSS / Sass",
    slug: "sass",
    group: "Styling & design systems",
    use: "Structured stylesheets at enterprise scale",
    howIUse:
      "SCSS carried the styling on the larger enterprise builds — the Kodez CMS and the Axinom media applications — where the codebase predates utility-first CSS and consistency has to come from variables, mixins, and a strict nesting discipline. I keep nesting shallow to avoid specificity wars, put every colour and spacing value behind a token, and treat a hard-coded hex in a component as a review comment.",
    sample: `Tokens first, components second
$space: (xs: 4px, sm: 8px, md: 16px, lg: 24px);
@mixin focus-ring { outline: 2px solid var(--accent); outline-offset: 2px; }
// No component defines a colour or a spacing value inline.`,
  },
  {
    name: "Material UI",
    slug: "mui",
    group: "Styling & design systems",
    use: "Component foundation & theming",
    howIUse:
      "At Kodez, Material UI was the foundation the CMS was built on, and the part that earned its licence was MUI X Data Grid Pro — the CMS's tables sat over a schema far too large to send to the client, so filtering, sorting and pagination all had to happen server-side with the grid driving the query rather than the row set. That makes theming the important skill — mapping the client's design language onto the theme rather than overriding components one by one. I wrap MUI primitives in our own components so the application never imports MUI directly; that way a library change is scoped to the wrapper layer rather than to 200 screens. The honest exceptions are the theme and DataGrid, whose APIs surface in application code however carefully you wrap them.",
    sample: `Wrap, don't import directly
shared/ui/Button.tsx   →  wraps MUI Button, exposes our variants only
app/**/*               →  imports shared/ui/Button
Blast radius of a library change: the wrapper layer, not 200 screens.
Known exceptions: the theme, and DataGrid — both leak into app code.`,
  },
  {
    name: "shadcn/ui",
    slug: "shadcnui",
    group: "Styling & design systems",
    use: "Component foundation on Radix + Tailwind",
    howIUse:
      "shadcn/ui is the foundation the Hobber component layer is built on, and the reason I chose it is that it isn't a dependency — the components are copied into the repo, so they can be changed rather than fought with. That matters on a platform with seven feature slices: when a select needs different keyboard behaviour for one domain, I edit the component instead of wrapping it in three layers of props. Radix underneath means the accessibility work — focus management, roles, escape handling — is already correct before I touch it, which is the part teams usually get wrong when they hand-roll.",
    sample: `Owned, not imported — so it can be changed
components/ui/select.tsx    // in the repo, editable
components/vendor/…         // slices compose it, never fork it
// a dependency you can't edit becomes three props deep`,
  },
  {
    name: "Storybook",
    slug: "storybook",
    group: "Styling & design systems",
    use: "Component library & documentation",
    howIUse:
      "Storybook is where a component library becomes real — if a component isn't documented with its default, loading, empty, and error states, it isn't shareable, it's just code somebody else might find. At Kodez I built the reusable library on it and that cut frontend development time roughly 30%, mostly because engineers stopped rebuilding things that already existed. It also makes accessibility and cross-browser checks cheap, since every state is reachable without navigating the app to reach it.",
    sample: `A component isn't done until these stories exist
Button:  Default · Loading · Disabled · Icon-only (a11y name?)
Table:   Default · Empty · Error · 10k rows (virtualized?)
Promotion rule: pattern seen twice, in two domains, before it's shared.`,
  },
  {
    name: "Redux Toolkit",
    slug: "redux",
    group: "State & data",
    use: "Predictable client state",
    howIUse:
      "I reach for Redux Toolkit when client state is genuinely global and the transitions need to be auditable — at Kodez it streamlined state management and made data flow consistent across a CMS large enough that ad-hoc context passing had stopped scaling. The rule I hold to is that it stores client state only; anything that is really a cached copy of server data belongs in the query layer, because putting it in Redux means hand-writing cache invalidation forever.",
    sample: `What belongs in the store
✅ session, permissions, cross-route UI mode, multi-step wizard progress
❌ the vendor list, the schedule, anything the server owns
Server data lives in the query cache — not duplicated here.`,
  },
  {
    name: "TanStack Query",
    slug: "reactquery",
    group: "State & data",
    use: "Server-state caching & synchronization",
    howIUse:
      "TanStack Query is my default for server state — at Kodez I used it for efficient data fetching, caching, and synchronization across distributed systems, which removed most of the hand-rolled loading and refetch logic that used to be scattered through components. I design the cache keys deliberately so invalidation after a mutation is precise rather than a blanket refetch, and I let the library own staleness so the UI reflects what the server actually accepted.",
    sample: `Mutate → invalidate → refetch
useMutation(updatePricing, {
  onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor", id, "services"] })
})
Precise key = one refetch, not a page-wide reload.`,
  },
  {
    name: "GraphQL",
    slug: "graphql",
    group: "State & data",
    use: "Typed API queries",
    howIUse:
      "At Axinom, GraphQL was part of how the frontend talked to the platform, and the value there is the same as TypeScript's: the contract is explicit and checkable. I keep queries colocated with the components that need them and request only the fields actually rendered, because an over-fetched query is a performance regression that no bundle analyzer will ever show you.",
    sample: `Ask for what you render, nothing more
query CatalogueRow($id: ID!) {
  asset(id: $id) { id title duration thumbnailUrl }   # not the full asset
}
Over-fetching is invisible in the bundle and expensive on the wire.`,
  },
  {
    name: "Node.js",
    slug: "nodedotjs",
    group: "Backend & platform",
    use: "BFF layers & API services",
    howIUse:
      "I use Node.js on the backend-for-frontend layer — at Kodez, collaborating with the backend team on BFF layers improved API performance and reduced latency, and it was also what made the legacy migration tractable, because the React client could talk to one coherent API instead of the legacy shape. It's the seam where I reshape backend responses into what the UI actually needs, rather than pushing that work into every component.",
    sample: `BFF: one call instead of four
GET /bff/vendor/:id/overview
  → account + services + schedule + payout status, shaped for the screen
Client makes one request; the waterfall disappears.`,
  },
  {
    name: "Express",
    slug: "express",
    group: "Backend & platform",
    use: "API endpoints & middleware",
    howIUse:
      "Express is the framework behind most of the services I've written — the BFF layers at Kodez, the API for the migrated stack, and the backends on several of my own projects. I keep route handlers thin and push logic into services so the HTTP layer stays testable, and I treat validation and error shape as part of the contract rather than something the client works around.",
    sample: `Thin handler, real errors
router.post("/services", validate(ServiceSchema), async (req, res, next) => {
  try { res.status(201).json(await services.create(req.body)) }
  catch (e) { next(e) }          // one error shape, one place
})`,
  },
  {
    name: "MySQL",
    slug: "mysql",
    group: "Backend & platform",
    use: "Relational data & query performance",
    howIUse:
      `I'm comfortable enough in SQL to be useful in the part of the stack most frontend engineers avoid — at Kodez, behind Sequelize, I worked on optimizing database operations across a schema spanning ${MEASUREMENTS.tables.value} tables, which is where you learn that a slow screen is often a data-layer problem rather than a rendering one. I'd rather rule that out with the backend team than assume the client is at fault.`,
    sample: `Check the plan before blaming the UI
EXPLAIN SELECT ... ;      -- type: ALL means a full table scan
→ the "slow dashboard" was one missing composite index.`,
  },
  {
    name: "MongoDB",
    slug: "mongodb",
    group: "Backend & platform",
    use: "Document storage for product builds",
    howIUse:
      "MongoDB with Mongoose backs several of my own products — the admin dashboard, the streaming platform, the image generator — where the data is document-shaped and the schema is still moving. I still define schemas explicitly rather than relying on the flexibility, because 'schemaless' in practice means the schema lives in application code where nobody can read it.",
    sample: `Schemaless still needs a schema
const Service = new Schema({
  vendorId: { type: ObjectId, ref: "Vendor", index: true, required: true },
  price:    { type: Number, min: 0 },
}, { timestamps: true })`,
  },
  {
    name: "Vitest",
    slug: "vitest",
    group: "Testing & quality",
    use: "Unit & integration tests",
    howIUse:
      "Vitest is what I set the Hobber test layer up on, from an empty repository. It shares the application's resolve and transform config, so there is no second build setup drifting out of sync with the first — one alias map, one plugin list. What it does not do is prove the production bundle: tests run through esbuild in test mode, while the release build adds tree-shaking, minification and chunking on top. That gap is real, and it is why bundle size is a merge gate rather than something I trust a green suite to catch. Below the unit tests I use it for integration tests at the slice boundaries, because in a feature-sliced codebase the contract between slices is exactly where a regression will hide.",
    sample: `Assert the contract, not the internals
test("reserve() holds a slot without exposing how", async () => {
  const slot = await bookings.reserve({ serviceId, start })
  expect(slot.status).toBe("held")   // the slice's public promise
})
// the import boundary is the lint rule's job, not this test's`,
  },
  {
    name: "Playwright",
    slug: "playwright",
    group: "Testing & quality",
    use: "End-to-end tests",
    howIUse:
      "Playwright covers the Hobber vendor workflows end to end — the paths where a silent break costs a vendor money rather than costing them a click. I'm deliberate about what earns an E2E test, because they are the slowest and most brittle tests in the suite: authentication and permissions, anything that writes, and anything a defect has already been filed against. When one does fail, the trace tells you what the run actually did, which is the difference between a flaky test you retry and a bug you fix.",
    sample: `E2E covers what costs money if it breaks
await page.getByRole("button", { name: "Confirm booking" }).click()
await expect(page.getByText("Booking confirmed")).toBeVisible()
// payouts, permissions, writes — not every button on the page`,
  },
  {
    name: "Jest",
    slug: "jest",
    group: "Testing & quality",
    use: "Unit & component tests",
    howIUse:
      "Jest covers the base of the pyramid — pure logic, reducers, formatters, data transforms — the tests that are fast enough to run on every save and plentiful enough to catch the boring mistakes. I write them test-first for logic and for bug fixes, where the assertion genuinely shapes the design, and I avoid tests that just restate the implementation, because those only ever break when you refactor correctly.",
    sample: `A bug gets a failing test before it gets a fix
it("keeps a service unbookable when price is missing", () => {
  expect(isBookable({ status: "bookable", price: undefined })).toBe(false)
})   // reproduce → then repair`,
  },
  {
    name: "Cypress",
    slug: "cypress",
    group: "Testing & quality",
    use: "End-to-end & regression testing",
    howIUse:
      `Cypress is what made frequent releases safe at Kodez — I introduced TDD with it and drove automated coverage ${MEASUREMENTS.coverage.value} on the critical paths, wired into CI/CD as a merge gate. I'm selective about what earns an E2E test: authentication and permissions, anything that writes to the database, every enterprise integration surface, and any path a defect has already been filed against. Everything else is cheaper to cover lower down the pyramid.`,
    sample: `The gate, not the suite size
Blocking specs: auth · permissions · writes · client integrations
Red pipeline = no merge. No "we'll fix it after."
${MEASUREMENTS.coverage.value} coverage on critical paths across ${MEASUREMENTS.releases.value} production releases.`,
  },
  {
    name: "Postman",
    slug: "postman",
    mono: "PM",
    color: "#FF6C37",
    group: "Testing & quality",
    use: "API contract testing & debugging",
    howIUse:
      "Postman is where I pin down an API contract before I build against it — running the endpoint, checking the real response shape against what the docs claim, and confirming the error and empty cases actually come back the way the UI needs them to. At Kodez that mattered constantly with enterprise REST integrations, where the contract in Swagger and the contract in production were not always the same thing, and finding that in Postman is far cheaper than finding it in a component.",
    sample: `Verify before you build against it
GET /vendors/:id/services
  → 200 shape matches the type?  → 404 shape?  → empty array vs null?
Contract confirmed in Postman before the typed client is written.`,
  },
  {
    name: "Vite",
    slug: "vite",
    group: "Build & delivery",
    use: "Fast builds & dev server",
    howIUse:
      "Vite is my default for new builds where the framework doesn't dictate otherwise — the dev-server feedback loop is short enough to change how you work, not just how long you wait. I use its bundle analysis output as the starting point for performance work, because the first question in any load-time investigation is what is actually being shipped.",
    sample: `Start every perf investigation here
vite build --mode production && npx vite-bundle-visualizer
→ what's shipped, to whom, and what can be split or dropped.`,
  },
  {
    name: "Webpack",
    slug: "webpack",
    group: "Build & delivery",
    use: "Bundle optimization & code-splitting",
    howIUse:
      `Webpack is where a lot of the real performance work happened — the ${MEASUREMENTS["load-axinom"].value.replace("−","~")} load-time reduction at Axinom and the ${MEASUREMENTS["load-kodez"].value.replace("−","~")} at Kodez both came out of bundle analysis, code-splitting, and lazy loading rather than anything visible in the UI. I treat an unexplained bundle-size increase as a merge blocker, because bundle growth is the one regression that never shows up in a test suite.`,
    sample: `Split by route, defer by need
- granular chunks, so one dependency bump doesn't invalidate the rest
- route chunks loaded on navigation
- heavy libs (charts, editors) dynamic-imported at point of use
Unexplained size increase → blocked, not noted.`,
  },
  {
    name: "AWS",
    slug: "amazonwebservices",
    group: "Build & delivery",
    use: "S3 & asset delivery",
    howIUse:
      "At Kodez I deployed static assets to S3 for storage and delivery. Cache headers and CDN behaviour move the number more than most application-code changes do. I make cache policy an explicit decision per asset class rather than an accident of defaults, so a hashed bundle and an HTML document are never treated the same way.",
    sample: `Cache policy is a decision, not a default
/static/*  (hashed)   → immutable, 1 year
/index.html           → no-cache, revalidate every load
Hashed assets never revalidate; the document always does.`,
  },
  {
    name: "Vercel",
    slug: "vercel",
    group: "Build & delivery",
    use: "Preview deploys & hosting",
    howIUse:
      "Vercel hosts most of my own products and is where I lean on preview deployments hardest — a reviewable URL per pull request turns 'looks fine in the diff' into something a designer or a stakeholder can actually click. Combined with automated CI/CD deployment, it removes the release-day ceremony that makes teams ship less often.",
    sample: `Preview per PR
PR #482 → preview URL → design + a11y check happen before merge
Merge → production. No release-day ceremony.`,
  },
  {
    name: "Docker",
    slug: "docker",
    group: "Build & delivery",
    use: "Reproducible environments",
    howIUse:
      "Docker is how I keep 'works on my machine' out of the conversation — a containerized environment means the same Node version, the same dependencies, and the same service topology for everyone and for CI. On the platform side I've worked in Docker-based environments alongside Nginx, with a working knowledge of Kubernetes fundamentals for how those containers get scheduled.",
    sample: `Same environment everywhere
docker compose up   → app + api + db, identical locally and in CI
No "which Node version are you on?" during a debugging session.`,
  },
  {
    name: "GitHub",
    slug: "github",
    group: "Build & delivery",
    use: "Code review, Actions & CI/CD",
    howIUse:
      "GitHub is where the quality gates actually live for me: Actions running the test suite and the lint pass on every pull request, branch protection so a red pipeline can't be merged around, and code review as the place standards are enforced rather than documented. I've also used automated PR workflows and CI/CD deployment automation to take the manual steps out of releasing.",
    sample: `Branch protection is the standard
required checks: lint · typecheck · jest · cypress(critical)
required review: 1 approval, author can't self-approve
Everything else is a suggestion; this is the floor.`,
  },
  {
    name: "Figma",
    slug: "figma",
    group: "Collaboration",
    use: "Design handoff & component specs",
    howIUse:
      "I've translated Figma frameworks into pixel-perfect, responsive interfaces at both Kodez and Axinom, and the part that matters is what happens before the build: agreeing the component boundaries, the empty and error states, and the responsive variants on the frames, so the handoff is a shared spec rather than a screenshot. As the person implementing it, I'm also the one who flags where a design will fight the design system.",
    sample: `Handoff comment, before the ticket opens
"This is Card + Badge from the library — variant: compact.
 Missing: empty state, error state, and the 320px layout.
 Long-string check: this label runs ~40% longer in German."`,
  },
  {
    name: "Jira",
    slug: "jira",
    group: "Collaboration",
    use: "Sprints, tickets & release tracking",
    howIUse:
      "Jira is where I've tracked sprint work across Kodez and Axinom — backlog management, sprint planning, reviews, and retrospectives — and where a release version ties a set of tickets to something that actually shipped. I write tickets with acceptance criteria explicit enough that the test is obvious, because a ticket that needs a conversation to interpret will get interpreted differently by everyone.",
    sample: `Acceptance criteria = the test, written first
AC1: service with no price cannot be set bookable (blocked + reason shown)
AC2: price saved → bookable toggle enabled without a page reload
AC3: keyboard-only path through the whole flow`,
  },
  {
    name: "Confluence",
    slug: "confluence",
    group: "Collaboration",
    use: "Documentation & engineering standards",
    howIUse:
      "Confluence is where I've documented processes and architecture decisions at Axinom and Kodez, and the rule I hold to is that the audience is the next engineer, not the current one. One canonical page per system, updated after the release rather than before it, so it reflects what shipped instead of what was planned — I also authored the frontend onboarding documentation, which is the fastest way to find out which parts of your architecture aren't actually explainable.",
    sample: `The test for a doc
Could a new engineer ship a small change from this page alone?
If not, it's a note, not documentation.
Written after the release — describing what shipped, not what was planned.`,
  },
  {
    name: "Azure DevOps",
    slug: "azuredevops",
    mono: "AZ",
    color: "#0078D7",
    group: "Collaboration",
    use: "Task tracking, repos & release management",
    howIUse:
      "At Axinom, Azure DevOps carried task tracking, version control, and release management, which kept delivery visible across distributed teams in several countries. I coordinated closely with DevOps there to keep CI/CD pipelines stable and deployments smooth across environments — the pipeline being reliable is what lets everyone else stop thinking about it.",
    sample: `Pipeline stages, environment by environment
build → test → deploy(dev) → deploy(staging) → deploy(prod, gated)
Distributed team across countries: the board is the status,
not a message in Slack.`,
  },
  {
    name: "Claude",
    slug: "claude",
    group: "AI-native engineering",
    use: "Agent orchestration & MCP workflows",
    howIUse:
      "I run AI-first development workflows with Claude agents — orchestrating multi-agent work with sub-agent delegation for anything that fans out across a codebase, and connecting them through Model Context Protocol integrations so the work happens against real repos, docs, and services rather than a pasted snippet. It accelerates execution around a decision I've already made; it doesn't get to make the decision, and nothing merges unread.",
    sample: `Where delegation pays
fan-out: sweep a codebase · apply a migration file-by-file · review from N angles
MCP: agent talks to the repo, docs, and services — not a pasted snippet
Line I hold: architecture and trade-offs stay mine. No unread merges.`,
  },
  {
    name: "ChatGPT",
    slug: "openai",
    group: "AI-native engineering",
    use: "Code generation, synthetic data & debugging",
    howIUse:
      "I use ChatGPT across the delivery lifecycle — generating synthetic datasets for testing, scaling, and edge-case validation, which is genuinely where it earns its keep because those are the cases I wouldn't have thought to write. Alongside that it speeds up debugging, documentation generation, and rapid prototyping to make an architectural option concrete before I commit to it.",
    sample: `Synthetic data for the cases you'd never write
generate: 10k vendors × {timezone drift, DST boundary, price = 0,
          partial pricing, 200-char names, RTL locale}
→ three real bugs the hand-written fixtures never reached.`,
  },
];

// Craft — text-scannable so keyword screens (and recruiters) see the
// engineering toolkit, not just tool logos. Grounded in the actual work.
export const methods = [
  "Feature-sliced architecture",
  "Design systems & Storybook",
  "Core Web Vitals & bundle budgets",
  "TDD with Cypress & Jest",
  "SSR/CSR & hydration trade-offs",
  "i18n & WCAG accessibility",
  "REST & GraphQL integration",
  "Incremental legacy migration",
  "AI-assisted delivery & MCP",
];
