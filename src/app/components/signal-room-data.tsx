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
      "Architected the dashboard from scratch in React and TypeScript as the sole frontend engineer, on a modular, feature-based structure, so each domain owns its own slice and ships on its own cadence.",
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
      `Building on the platform instead of around it: Mosaic micro-frontends, Shaka Player DRM, and a ${MEASUREMENTS["load-axinom"].value.replace("−","~")} faster load.`,
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
      `Page load time was the number I could defend, measured before and after the bundle work, and it moved ${MEASUREMENTS["load-axinom"].value.replace("−","~")}. Alongside it I watched playback through the player's own failure taxonomy and the support tickets that reached me — which is exactly the weak instrumentation I name elsewhere, cross-region rendering once i18n was live, and the CI/CD pipelines I kept stable with DevOps — because a performance win that ships unreliably isn't a win. Delivery health was tracked in Azure DevOps and JIRA, with the process documented in Confluence.`,
    outcome:
      `Two client products delivered 0→1 through full development, testing, and production release cycles; ${MEASUREMENTS["load-axinom"].value.replace("−","~")} faster page loads from bundle optimization, lazy loading, and caching; seamless multi-language experiences across regions; and reliable playback of protected content via Shaka Player and DRM workflows. Alongside the delivery work I strengthened the security posture by identifying vulnerabilities and adding validation and authentication layers, and mentored junior developers while enforcing coding standards.`,
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
      `A CMS built to be changed: a Storybook design system, ${MEASUREMENTS.coverage.value} test coverage, and ${MEASUREMENTS.releases.value} releases across three years, never a regression freeze.`,
    problem:
      `A React CMS spanning ${MEASUREMENTS.tables.value} SQL tables and enterprise integrations, sitting next to a legacy Laravel and jQuery codebase — every release risked a regression somewhere nobody was looking.`,
    move:
      "Built the CMS 0→1 on a microarchitecture with SOLID boundaries, a Storybook component library as the shared spine, and test-driven development with Jest behind a Cypress gate on every release.",
    result:
      `${MEASUREMENTS.coverage.value} automated coverage, ${MEASUREMENTS["load-kodez"].value.replace("−","~")} faster page loads, ${MEASUREMENTS["dev-time"].value.replace("−","~")} less frontend development time, and ${MEASUREMENTS.releases.value} production releases while migrating the legacy stack incrementally.`,
    tradeoffShort: "Standardize on the system vs. per-project freedom",
    results: [
      { label: "Page load time", note: "code-splitting, lazy loading, asset optimization", m: "load-kodez" },
      { label: "Frontend development time", note: "after the Storybook library landed", m: "dev-time" },
      { label: "Automated coverage, overall", note: "Jest + Cypress merged, gated in CI", m: "coverage" },
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
      `${MEASUREMENTS.releases.value} production releases delivered — new features, defect fixes, and database optimization across ${MEASUREMENTS.tables.value} SQL tables. Page loads ${MEASUREMENTS["load-kodez"].value.replace("−","~")} faster, frontend development ${MEASUREMENTS["dev-time"].value.replace("−","~")} faster, ${MEASUREMENTS.coverage.value} automated test coverage, and a legacy Laravel and jQuery application migrated to React and ExpressJS without a delivery freeze. REST integrations against the client's vendor stack (Fiserv, Toshiba, NTT DATA, Park Assist, City) stayed interoperable throughout.`,
    detail:
      `What I'd do differently: I sold the component library on consistency when I should have sold it on speed. Engineers adopt a design system when it visibly saves them an afternoon, not when it's described as the right thing to do — I'd publish the before/after build time for a real screen in week one and let the number do the arguing. The lesson I carry: release cadence isn't a function of moving fast, it's a function of how cheaply you can prove you didn't break anything. TDD and Storybook weren't overhead on the ${MEASUREMENTS.releases.value} releases; they are what made shipping on that cadence feel safe.`,
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
  // The type makes this unrepresentable in our code, so the cast is the point:
  // this is unvalidated input crossing the boundary, which is what the guard is for.
  expect(isBookable({ status: "bookable", price: undefined } as unknown as ApiService)).toBe(false)
})`,
    },
    customerLede:
      "Client service and logistics teams work in a CMS that loads about 40% faster and keeps working release after release, across integrations with the vendor systems their operation runs on.",
    scale: [
      "Enterprise CMS · service mgmt + logistics",
      "HQ Melbourne, Australia",
      `${MEASUREMENTS.tables.value} SQL tables`,
      "Company scaled 10 → 60+",
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
        why: `Introduced test-driven development with Jest and Cypress end-to-end gates to ${MEASUREMENTS.coverage.value} automated coverage inside CI/CD, which is what made ${MEASUREMENTS.releases.value} production releases safe rather than merely frequent.`,
      },
      {
        lp: "Reusable beats bespoke",
        why: `Built a Storybook component library as the shared spine of the CMS. I judge it cut frontend delivery time by roughly a third across projects.`,
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
      `The EMS shipped to production, and the site revamp lifted UX and conversion ${MEASUREMENTS.conversion.value.replace("+","~")}.`,
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
      `A complete Employment Management System delivered from concept to production with end-to-end UI development, and a company site rebuilt for responsiveness and accessibility that lifted conversion ${MEASUREMENTS.conversion.value.replace("+","~")}. Along the way I ran code reviews and pair-programming sessions to hold quality, improved performance through refactoring and component-level optimization.`,
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
    body: "Tests are what make frequent releases safe rather than merely frequent. Test-first with Jest where the assertion shapes the design, Cypress on the paths a client would notice, both wired into CI/CD as a gate — plus cross-browser validation, because 'works on my machine' is a bug report waiting to be filed.",
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
    slug: "this-site",
    title: "This site",
    blurb:
      "The one codebase here I can hand over in full, since my production work is under NDA. Server Components are the default and I only cross the boundary where crossing it buys something: the case-study route is an async Server Component that awaits its params, highlights its code with Shiki on the server behind the server-only package, and hands the client finished HTML — so the tokenizer never reaches the browser. Every route is prerendered; the ones that quote a figure derived from a date revalidate hourly, so the number stays right without a redeploy. It also carries the record of a layout-shift bug I caused and then found properly: the case accordion animated flexGrow, which is a layout property, and my first hypothesis about the cause was wrong. It is fixed; the note stays because the diagnosis is the interesting part.",
    learned:
      "Where the server/client boundary actually pays for itself — and that a client component is still prerendered, so \"use client\" spends bundle, not first paint.",
    tech: [
      "Next.js",
      "React",
      "Server Components",
      "TypeScript",
      "Tailwind CSS",
      "Shiki (build-time)",
      "ISR",
    ],
    github: "https://github.com/rezaan6/portfolio",
    featured: true,
    category: "Web",
    year: "2026",
  },
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
};

export const artifacts: Artifact[] = [  {
    type: "ADR",
    company: "Hobber",
    title: "Feature-sliced architecture for the vendor dashboard",
    blurb:
      "The architecture decision record behind the Hobber vendor platform — why seven domains got their own slices instead of one dashboard surface, and what the boundary rules are.",
  },  {
    type: "COMPONENT SPEC",
    company: "Kodez",
    title: "Reusable component library — the API contract",
    blurb:
      `How a component earns its place in the Storybook library: the props contract, the accessibility floor, and what disqualifies a component from being shared. The spine that cut frontend dev time ${MEASUREMENTS["dev-time"].value.replace("−","~")}.`,
  },  {
    type: "STATE MODEL",
    company: "Hobber",
    title: "Server state vs. client state in the vendor dashboard",
    blurb:
      "The rule that keeps data-fetching bugs from becoming rendering bugs — what belongs in the cache, what belongs in the component, and why the two are never the same store.",
  },  {
    type: "INCIDENT REVIEW",
    company: "Axinom",
    title: "Playback stopped part-way through long recordings",
    blurb:
      "A licence acquired once, at play time, and outlived by the content — a failure that could not appear on any asset short enough to sit through in development. What broke, how a viewer came to be the detector, and the gap I left open.",
  },  {
    type: "PERF BUDGET",
    company: "Axinom",
    title: `Page-load performance — how the ${MEASUREMENTS["load-axinom"].value.replace("−","~")} came out`,
    blurb:
      "The performance one-pager for the Axinom media build: what was measured, the three levers that moved it (bundle, lazy-load, caching), and the guardrails that stopped a fast page from becoming a broken one.",
  },  {
    type: "TEST STRATEGY",
    company: "Kodez",
    title: `Jest test-first, Cypress at the gate — ${MEASUREMENTS.coverage.value} overall, every critical path gated`,
    blurb:
      `The testing strategy that made ${MEASUREMENTS.releases.value} production releases safe: what gets a test, what deliberately does not, and where the gate sits in CI/CD.`,
  },  {
    type: "MIGRATION PLAN",
    company: "Kodez",
    title: "Laravel/jQuery → React + Express, across three years, never a regression freeze",
    blurb:
      "How a legacy application moved to a modern stack incrementally — the strangler approach, what shipped in which order, and the rule that kept two coexisting stacks from doubling the work.",
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
      `Built an enterprise CMS 0→1 and the standards a company scaling 10 → 60+ built against — Storybook system, ${MEASUREMENTS.coverage.value} test coverage, ${MEASUREMENTS.releases.value} releases.`,
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
    body: `A screen should be composed, not authored. The Storybook library at Kodez is what turned screens into composition, and I judge it cut frontend delivery time by roughly a third — but only after a pattern had proven itself twice. Premature generalization is just debt with better manners.`,
  },
  {
    label: "Performance is a feature",
    body: `Profile first, optimize second. Every load-time win I can point to — ${MEASUREMENTS["load-kodez"].value.replace("−","~")} at Kodez, ${MEASUREMENTS["load-axinom"].value.replace("−","~")} at Axinom — started from a measurement, not an instinct. And never read the average alone; it hides the users having the worst time.`,
  },
  {
    label: "Tests are how you ship fast",
    body: `Release throughput isn't a function of moving fast, it's a function of how cheaply you can prove you didn't break anything. ${MEASUREMENTS.coverage.value} test coverage in CI wasn't overhead on ${MEASUREMENTS.releases.value} releases — it's why there were ${MEASUREMENTS.releases.value} releases.`,
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
      `React is where most of my ${yearsPhrase()} live — I think in component boundaries and rendering behaviour before I think in screens. That means being deliberate about reconciliation and memoization, keeping controlled and uncontrolled components from mixing, and isolating components so one slow subtree doesn't drag a page down. At Hobber I used it to architect a vendor dashboard as independent feature slices; at Kodez it carried a CMS through ${MEASUREMENTS.releases.value} production releases without the render layer becoming the bottleneck. The newer model I've pushed on my own code rather than at an employer, and this site is where — Server Components as the default, and a theme toggle that has to wrap its state update in flushSync, because the View Transitions API needs the DOM mutated synchronously inside its callback and React would otherwise batch the update out from under it.`,
    sample: `Where React and the platform actually meet
const t = document.startViewTransition(() =>
  flushSync(() => toggle(false))   // batched => the "new" snapshot is the old one
)
t.ready.then(() => root.animate({ clipPath: [ /* … */ ] },
  { pseudoElement: "::view-transition-new(root)" }))
No startViewTransition → CSS cross-fade. reduce-motion → neither.`,
  },
  {
    name: "Next.js",
    slug: "nextdotjs",
    group: "Core frontend",
    use: "App Router, SSR/CSR & routing",
    howIUse:
      `I use Next.js when the rendering strategy is itself a product decision — which parts must be server-rendered for SEO and first paint, which are client-interactive, and where the hydration boundary sits. At Axinom that mattered for media applications where load time was a deliverable: route-level code-splitting and deferred client bundles were a large part of the ${MEASUREMENTS["load-axinom"].value.replace("−","~")} improvement. On the App Router I treat the boundary as something each file has to justify, and I'm precise about what it costs — a client component is still prerendered on the server, so "use client" spends bundle, not first paint. This site is the worked example: every route prerendered, the case-study route an async Server Component that awaits its params, and revalidate on the four pages quoting a figure derived from a date, so they can't go stale between deploys.`,
    sample: `Rendering is a per-route decision, then a per-file one
/work/[slug]         server · await params · generateStaticParams → 4 pages
/ /about /resume /stack   prerendered + export const revalidate = 3600
loading.tsx          9 of them — Next wraps the segment in Suspense
"use client"         only where state, an event handler or a DOM API lives
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
      "I have shipped both models in production and chose differently the second time, which is the only reason I have an opinion worth stating. At Kodez the shared spine was Material UI with SCSS, and at Axinom it was SCSS over the Mosaic surfaces — a component library you consume, where you get correct behaviour immediately and pay for it later, at the point where a design calls for something the library did not anticipate and you are wrapping and overriding a component you cannot see inside. At Hobber I chose Tailwind with shadcn/ui instead, and the deciding factor was not the utilities. It was that shadcn's components are copied into the repository rather than installed from it: when one of seven feature slices needed different keyboard behaviour, the answer was to edit the component instead of wrapping it three props deep. The trade-off is real and goes the other way — nobody upgrades those components for you, and correctness is now yours. That is the right side of the trade for a platform being built from nothing by one engineer, and I would not make the same call on a large team that needed a library to be a contract. Either way the discipline is identical: variants live in the component's API, never in class strings passed down through props.",
    sample: `Same discipline, different ownership
MUI + SCSS   (Kodez, Axinom)  → behaviour you consume, override later
shadcn + TW  (Hobber)         → component in the repo, edit not wrap
The cost of the second: no one upgrades it for you.
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
      `I read the query plan before I blame the render layer — at Kodez, behind Sequelize, I worked on optimizing database operations across a schema spanning ${MEASUREMENTS.tables.value} tables, which is where you learn that a slow screen is often a data-layer problem rather than a rendering one. I'd rather rule that out with the backend team than assume the client is at fault.`,
    sample: `Check the plan before blaming the UI
EXPLAIN SELECT ... ;      -- type: ALL means a full table scan
→ read the plan before blaming the render layer.`,
  },
  /* MongoDB has no panel on purpose. Its only evidence is side projects, and
     "schemaless still needs a schema" is a smaller version of the argument the
     MySQL panel above makes with paid-work behind it. It stays in the résumé
     skills group and the project tech chips, so a keyword screen still sees it. */
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
  // The type makes this unrepresentable in our code, so the cast is the point:
  // this is unvalidated input crossing the boundary, which is what the guard is for.
  expect(isBookable({ status: "bookable", price: undefined } as unknown as ApiService)).toBe(false)
})   // reproduce → then repair`,
  },
  {
    name: "Cypress",
    slug: "cypress",
    group: "Testing & quality",
    use: "End-to-end & regression testing",
    howIUse:
      `Cypress is what made frequent releases safe at Kodez — I introduced test-first practice with Jest alongside it, and the merged report reached ${MEASUREMENTS.coverage.value} overall, wired into CI/CD as a merge gate. I'm selective about what earns an E2E test: authentication and permissions, anything that writes to the database, every enterprise integration surface, and any path a defect has already been filed against. Everything else is cheaper to cover lower down the pyramid.`,
    sample: `The gate, not the suite size
Blocking specs: auth · permissions · writes · client integrations
Red pipeline = no merge. No "we'll fix it after."
${MEASUREMENTS.coverage.value} overall coverage, every critical path behind the merge gate, across ${MEASUREMENTS.releases.value} production releases.`,
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
  /* No Vite panel. Its bundle-analysis argument is made better by the Webpack
     panel below, against paid work with figures attached, and its one distinctive
     point — one resolve config shared with the test runner — already belongs to
     the Vitest panel. Vite stays on Hobber's stack chips and the project lists. */
  {
    name: "Shiki",
    mono: "SK",
    color: "#0b5fa5",
    group: "Build & delivery",
    use: "Build-time syntax highlighting",
    howIUse:
      "Shiki highlights every code block on this site, and the reason it's here rather than a client-side highlighter is a Server Component argument: the code is fully known at build time, so tokenizing it in the browser means shipping the grammars and themes to render text that will never change. It runs in one module guarded by the server-only package — an accidental import from a client component fails the build instead of quietly fattening the bundle — and the client receives finished HTML. Both themes render in a single pass, which is what lets the light/dark toggle be a CSS variable swap with no re-highlight and no flash. The constraint is real and worth stating: nothing user-supplied can be highlighted this way. For a portfolio that isn't a limitation, it's a guarantee.",
    sample: `Do the work once, on the server
lib/highlight.ts      import "server-only"   ← a client import is a build error
                      codeToHtml(src, { themes: { light, dark } })
work/[slug]/page.tsx  server: const codeHtml = await highlightCode(...)
case-detail.tsx       "use client": renders the string, ships no tokenizer
Check it: no Shiki JS in .next/static — only the .shiki CSS rules.`,
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
    use: "Rendering strategy per route",
    howIUse:
      "The interesting decision Vercel forces isn't hosting, it's which routes may be fully static. This site looks like it should be static everywhere, and most of it is — but a few pages print a length of career derived from a start date, so baking them at build time means the number is correct on the day I deploy and quietly wrong months later. Those routes revalidate on an interval instead; the rest are prerendered, and the case studies are generated from a known list of slugs. Static is the default and each exception is a route that would otherwise go stale without anything failing, which is the kind of bug nobody reports.",
    sample: `Static by default; revalidate where content derives from today
export const revalidate = 3600   // /, /about, /resume, /stack
generateStaticParams()           // 4 case studies, prerendered
A stale build breaks nothing loudly — which is why it needs deciding.`,
  },
  /* No Docker panel. "I've worked in Docker-based environments" is participation
     rather than a decision, and `docker compose up` is not a senior frontend
     signal. Environment parity already belongs to the GitHub panel below and to
     the BrowserStack line in TEST STRATEGY. Docker stays in the résumé skills. */
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
 Long-string check: German runs materially longer than English."`,
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
generate: vendors × {timezone drift, DST boundary, price = 0,
          partial pricing, 200-char names, RTL locale}
→ three real bugs the hand-written fixtures never reached.`,
  },
  {
    name: "Shaka Player",
    mono: "SH",
    color: "#004078",
    group: "Core frontend",
    use: "DRM playback, licences & entitlements",
    howIUse:
      "Shaka Player is where the Axinom work got genuinely difficult. Protected playback is not loading a file: the player fetches a manifest, works out which key system the device actually supports, acquires a licence for it, and only then decodes — and any of those can fail while the viewer sees one black rectangle. So the first thing I build around it is a failure taxonomy — manifest, key system, licence, decode, buffer — because \"the video is broken\" names none of them, and a report without that split is unactionable. Entitlement stays a server decision: whether this viewer may watch this title is answered by the entitlement and licence services, which at Axinom meant going through Mosaic's Entitlement and DRM services rather than a bespoke integration, because bespoke means owning DRM edge cases forever. Device variation is the other half — which key system exists, and at what robustness, depends on the browser and the hardware, so the test plan is a device matrix and my laptop is not a device. It is also where I stop optimising: the player and the licence path are never lazy-loaded, because a slow catalogue is a complaint while a title that will not play is indistinguishable from a title the viewer was never entitled to.",
    sample: `Playback fails in stages — "it's broken" names none of them
manifest → key system → licence → decode → buffer
Entitlement: asked of the server, rendered by the client — "no" too
Never lazy-loaded: the player chunk and the licence path
Test plan is a device matrix. My laptop is not a device.`,
  },
  {
    name: "Security",
    mono: "SEC",
    color: "#023047",
    group: "Security & observability",
    use: "Auth, permissions & what stays server-side",
    howIUse:
      "Most frontend security work comes down to one habit: never let the client be the thing that decides. At Hobber that runs through all seven domains — the UI reads a permission set to work out what to render, and the server re-checks the same permission on every write, because a hidden tab is a presentation choice, not a rule. Entitlement at Axinom is the sharper version of it: whether a viewer may play a title is answered by the entitlement and licence services, never by a flag the client could edit, and the frontend's job is to carry the request and render the answer — including the refusal. The payment boundary follows the same line: the browser talks to our own API, our API talks to the provider, and the provider's credentials reach neither the client nor CI. The rest is unglamorous and still the job — validate on both sides for different reasons, sanitise anything rendered as markup, keep tokens out of storage the page can read, and read what a dependency bump actually pulls in. I do this as the engineer building the feature rather than as a security specialist: the frontend half done properly, with every real decision pushed somewhere the user cannot reach.",
    sample: `The client decides what to show. The server decides what is allowed.
can("payouts.write") → hides the action          (presentation)
POST /payouts/:id    → re-checks it server-side  (the control)
Never client-trusted: entitlement, price, permission, identity.
Provider keys sit behind our own API — not in the app, not in CI.`,
  },
  {
    name: "Observability",
    mono: "OBS",
    color: "#023047",
    group: "Security & observability",
    use: "Production signal — and the gap I owned",
    howIUse:
      "This is the honest gap in my stack, so I would rather state it than dress it up. I had good build-time and release-time signal — bundle composition, before-and-after load measurements, the test suite and cross-browser results in the pipeline — and very little runtime signal. All of that is lab data: it tells you what you shipped, not what anyone experienced. At Axinom it meant I read page load as an aggregate for too long, which hides the regions and devices having the worst time. Setting it up now I would go in a deliberate order. One structured client-side failure report first, carrying the stage that failed, the device and platform, and the locale — because a playback failure is the most expensive thing in that product to reproduce, and a count you can group by beats a dashboard. Then real-user timings, segmented by region and device instead of averaged. Then one threshold with a name attached to it, because a signal nobody owns is just a chart. At one engineer that is about as much as I can genuinely keep looking at, which is why the order matters more than the list.",
    sample: `What I had     bundle composition · before/after load · CI results
What I lacked  real sessions · per-region · per-device · per-stage
First thing I'd add: one structured failure report — stage, device, locale.
That is the signal it costs the most to be without.`,
  },
];

// Craft — text-scannable so keyword screens (and recruiters) see the
// engineering toolkit, not just tool logos. Grounded in the actual work.
export const methods = [
  "Feature-sliced architecture",
  "Design systems & Storybook",
  "Core Web Vitals & bundle budgets",
  "Test-driven development & E2E gates",
  "SSR/CSR & hydration trade-offs",
  "i18n & WCAG accessibility",
  "REST & GraphQL integration",
  "DRM & protected playback",
  "Incremental legacy migration",
  "AI-assisted delivery & MCP",
];
