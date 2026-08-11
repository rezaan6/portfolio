import type { ArtDoc } from "./artifact-doc";

/* Structured, per-type engineering documents. Each artifact type renders as
   its own designed document (not a shared <pre> dump). Keyed by artifact
   `type`. Client code and client data are kept out. */

export const ARTIFACT_DOCS: Record<string, ArtDoc> = {
  ADR: {
    summary:
      "The architecture decision record behind the Hobber vendor platform — why seven domains got their own feature slices instead of one dashboard surface, what the boundary rules are, and what the decision costs.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Record", value: "ADR-001 — Feature-sliced architecture" },
          { label: "Status", value: "Accepted" },
          { label: "Context", value: "Hobber vendor platform · greenfield · UAE" },
          { label: "Stack", value: "React · TypeScript" },
        ],
      },
      {
        type: "section",
        n: "01",
        title: "Context",
        text: "The vendor platform needs authentication, vendor accounts, dashboards, scheduling, payouts, integrations, and team access management — seven domains, each with its own state, permissions, and backend surface. Vendor workflows sit on top: activity management, booking, stock scheduling, discount logic, and content management. Built as one dashboard surface, cross-domain coupling arrives before the first release.",
      },
      {
        type: "section",
        n: "02",
        title: "Decision",
        text: "Organize the frontend by feature slice, not by technical layer. Each domain owns its routes, components, state, and API access together. Slices never import from each other; anything genuinely shared is promoted into an explicit UI layer underneath. TypeScript throughout, so cross-slice contracts are compiler-checked rather than convention-checked.",
      },
      { type: "heading", title: "Boundary rules" },
      {
        type: "checklist",
        checks: [
          { text: "A slice may import from the shared UI layer." },
          {
            text: "A slice may not import from another slice — cross-domain flows compose at the route level.",
          },
          {
            text: "Shared UI stays domain-agnostic. If it needs to know about payouts, it isn't shared.",
          },
          { text: "A pattern is copied twice before it is promoted." },
          {
            text: "Premature generalization — a shared component built for a use case that hasn't arrived.",
            good: false,
          },
        ],
      },
      {
        type: "variants",
        title: "Alternatives considered",
        variantA: {
          label: "Single surface, split later",
          desc: "Fastest to a first screen. The 'later' never has a good week to happen, and by then every change touches everything.",
        },
        variantB: {
          label: "Feature slices from day one",
          desc: "Real cost before anything is demo-able, paid once. Chosen because the scope was known to be seven modules on day one, not discovered later.",
        },
      },
      {
        type: "callout",
        tone: "note",
        title: "Trade-off on record",
        text: "Upfront architecture vs. time to first screen. Uncomfortable at a startup, and taken knowingly — the alternative is paying it back with interest during the first big feature.",
      },
      {
        type: "callout",
        tone: "win",
        title: "Consequence",
        text: "A new domain is a new folder, not a refactor. Integration breaks surface at build time via TypeScript rather than in review or in production.",
      },
    ],
  },

  "COMPONENT SPEC": {
    summary:
      "How a component earns its place in the Storybook library at Kodez: the promotion rule, the props contract, the accessibility floor, and what disqualifies a component from being shared. This library is what cut frontend development time ~30%.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Reusable component library — API contract" },
          { label: "Context", value: "Kodez enterprise CMS · team scaled 10 → 60+" },
          { label: "Stack", value: "React · TypeScript · SCSS · Material UI · Storybook" },
          { label: "Result", value: "~30% less frontend development time" },
        ],
      },
      {
        type: "section",
        title: "Why this exists",
        text: "The CMS spans 250+ SQL tables and enterprise integrations, and the team grew from 10 to 60+ engineers. Without a shared spine, every screen is authored from scratch and the product drifts. The library is how a screen becomes composition instead of authorship.",
      },
      {
        type: "steps",
        title: "Promotion rule — when a component becomes shared",
        ordered: true,
        items: [
          "The pattern has appeared at least twice, in two different domains.",
          "Its behaviour can be described without naming a feature.",
          "It has stories covering default, loading, empty, and error states.",
        ],
      },
      {
        type: "checklist",
        title: "The props contract",
        checks: [
          { text: "Typed and required by default; every optional prop has a documented default." },
          { text: "Controlled by default. Uncontrolled only where the DOM already owns the state." },
          { text: "Styling by variant token — never raw class names passed through." },
          {
            text: 'Feature-specific props. A prop named "isPayoutRow" disqualifies the component.',
            good: false,
          },
        ],
      },
      {
        type: "checklist",
        title: "Accessibility floor — non-negotiable",
        checks: [
          { text: "Reachable and operable by keyboard, with a visible focus ring." },
          { text: "Correct role and accessible name; state exposed via ARIA, not colour alone." },
          { text: "Contrast meets WCAG AA in both the light and dark themes." },
        ],
      },
      {
        type: "callout",
        tone: "exclude",
        title: "What disqualifies a component",
        text: "Business logic inside it. Direct data fetching. Any knowledge of the route it renders on. Each of those makes it a feature, and features live in their own slice.",
      },
      {
        type: "callout",
        tone: "insight",
        title: "What I'd do differently",
        text: "I sold the library on consistency when I should have sold it on speed. Engineers adopt a design system when it visibly saves them an afternoon — publish the before/after build time for a real screen in week one and let the number argue.",
      },
    ],
  },

  "STATE MODEL": {
    summary:
      "The rule that keeps data-fetching bugs from becoming rendering bugs in the Hobber vendor dashboard — what belongs in the cache, what belongs in the component, and why the two are never the same store.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Server state vs. client state" },
          { label: "Context", value: "Hobber vendor dashboard · feature-sliced" },
          { label: "Rule", value: "Different problems — they do not share a store" },
          { label: "Stack", value: "React · TypeScript · query layer" },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "The rule",
        text: "Server state is a cache of something you do not own, with staleness and revalidation. Client state is what the user is doing right now, and it's yours. Merging them is how a network hiccup turns into a rendering bug.",
      },
      {
        type: "tree",
        root: "Vendor dashboard state",
        branches: [
          {
            label: "Server state",
            note: "cached, keyed, revalidated",
            own: true,
            children: [
              { label: "Vendor accounts & services", note: "owned by the query layer" },
              { label: "Schedules & pricing", note: "invalidated on mutation" },
              { label: "Payouts & integrations", note: "never copied into component state" },
              { label: "Team members", note: "staleness policy per key" },
            ],
          },
          {
            label: "Client state",
            note: "local by default",
            children: [
              { label: "Form drafts and filter selections" },
              { label: "Which panel is open", note: "lifted only when a sibling needs it" },
              { label: "Optimistic pending flags" },
            ],
          },
          {
            label: "Derived state",
            note: "computed, never stored",
            children: [
              {
                label: "Readiness, totals, is-bookable",
                note: "cheaper than syncing two copies",
              },
            ],
          },
        ],
      },
      {
        type: "steps",
        title: "Mutation flow",
        ordered: true,
        items: [
          "Mutate.",
          "Invalidate the affected cache keys — precisely, not page-wide.",
          "Let the query layer refetch, so the screen reflects what the server accepted rather than what the client hoped.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Why it matters here",
        text: "Scheduling, payouts, and discount logic are financially consequential. A stale read on a payout screen isn't a cosmetic bug — so when server and client disagree, the server wins and the UI says so.",
      },
    ],
  },

  "PERF BUDGET": {
    summary:
      "The performance one-pager for the Axinom media build: what was measured, the three levers that moved it, and the guardrails that stopped a faster page from becoming a broken one. Page load came down ~15%.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Page-load budget — media web applications" },
          { label: "Context", value: "Axinom · Mosaic platform · global media clients" },
          { label: "Result", value: "~15% reduction in page load time" },
          {
            label: "Read as",
            value: "Before/after vs. a defined baseline — not a controlled experiment",
          },
        ],
      },
      {
        type: "section",
        title: "Why this exists",
        text: "Global media clients, protected content, and multi-language UIs. Load time is the first thing every one of those users experiences, and it was being treated as a post-launch concern. This page makes it a deliverable with a number attached.",
      },
      {
        type: "steps",
        title: "The three levers, in order of application",
        ordered: true,
        items: [
          "Bundle optimization — analyse first, cut second. Remove what ships but is unused; split what is needed but not immediately.",
          "Lazy loading — defer everything below the fold and every route the user hasn't asked for. Playback surfaces load first; catalogue browsing can wait 200ms.",
          "Caching — cache what doesn't change per request. Metadata from the Mosaic APIs qualifies; entitlement decisions do not.",
        ],
      },
      {
        type: "table",
        cols: ["What was measured", "Read"],
        rows: [
          { cells: ["Page load time", "−15%"], tag: "Now" },
          { cells: ["Bundle composition", "Audited"] },
          { cells: ["Time to interactive, playback routes", "Watched"] },
        ],
      },
      {
        type: "checklist",
        title: "Guardrails",
        checks: [
          { text: "i18n bundles split per locale, never shipped as one combined payload." },
          {
            text: "Winning load time by degrading playback reliability or DRM correctness.",
            good: false,
          },
          { text: "Lazy-loading anything on the critical path to first frame.", good: false },
          {
            text: "Reading the average alone — it hides the regions and devices having the worst time.",
            good: false,
          },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "What I'd add next",
        text: "Segment the measurement by region and device from the first read, not the third. On an international product the aggregate is the least informative number available.",
      },
    ],
  },

  "TEST STRATEGY": {
    summary:
      "The testing strategy that made 40+ production releases safe at Kodez: what gets a test, what deliberately doesn't, where the gate sits, and an honest account of how much of it was actually test-first.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Test strategy — Kodez CMS" },
          { label: "Coverage", value: ">90% automated, on critical paths" },
          { label: "Throughput", value: "40+ production releases" },
          { label: "Tooling", value: "Jest · Cypress · CI/CD · BrowserStack" },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "The premise",
        text: "Release throughput is not a function of moving fast. It's a function of how cheaply you can prove you didn't break anything. TDD and CI gates weren't overhead on the 40+ releases — they're the reason there were 40+ releases.",
      },
      {
        type: "table",
        cols: ["Layer", "Volume", "Speed"],
        rows: [
          { cells: ["Unit (Jest) — logic, reducers, transforms", "Many", "Fast"] },
          { cells: ["Component — rendering against the library", "Some", "Medium"] },
          { cells: ["E2E (Cypress) — flows a client would notice", "Few", "Slow"], tag: "Now" },
        ],
      },
      {
        type: "checklist",
        title: "What always gets an E2E test",
        checks: [
          { text: "Authentication and permissions." },
          { text: "Anything that writes to the 250+ table schema." },
          {
            text: "Every enterprise integration surface — NTT DATA, Toshiba, Park Assist, City, Fiserv.",
          },
          { text: "Any path a defect has been filed against. A bug gets a test before it gets a fix." },
        ],
      },
      {
        type: "checklist",
        title: "What deliberately does not",
        checks: [
          {
            text: "Presentational-only components that already have a Storybook story.",
            good: false,
          },
          { text: "Third-party library internals.", good: false },
          {
            text: "Anything whose test would restate the implementation line for line.",
            good: false,
          },
        ],
      },
      {
        type: "section",
        title: "The gate",
        text: "Tests run in CI/CD on every pull request. A red pipeline blocks the merge; there is no 'we'll fix it after'. Cross-browser behaviour is validated separately on BrowserStack, because a green suite on one engine is not a claim about the others.",
      },
      {
        type: "callout",
        tone: "note",
        title: "TDD, honestly",
        text: "Test-first on logic and on bug fixes, where writing the assertion genuinely shapes the design. Test-after on exploratory UI, where writing it first would be inventing a spec I don't have yet. Claiming otherwise would be theatre.",
      },
    ],
  },

  "MIGRATION PLAN": {
    summary:
      "How a legacy PHP/jQuery application moved to React and ExpressJS incrementally at Kodez — the strangler approach, the ordering, and the one rule that kept two coexisting stacks from doubling the work. ~25% technical debt removed, with no delivery freeze.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Legacy PHP/jQuery → React + ExpressJS" },
          { label: "Constraint", value: "Live users and client commitments — no freeze available" },
          { label: "Result", value: "~25% reduction in technical debt" },
          { label: "Approach", value: "Strangler — migrate alongside funded work" },
        ],
      },
      {
        type: "variants",
        title: "The approach decision",
        variantA: {
          label: "Big-bang rewrite",
          desc: "Months with nothing shipped and a cutover weekend nobody sleeps through. Not available with live client commitments.",
        },
        variantB: {
          label: "Strangle, don't replace",
          desc: "New surfaces built in React from day one; existing surfaces migrated when they were being changed anyway, so migration rode along with work already funded.",
        },
      },
      {
        type: "table",
        cols: ["Order", "What moved", "Why"],
        rows: [
          { cells: ["01", "Routes already scheduled for a change", "Nearly free"] },
          { cells: ["02", "High-traffic, high-latency paths", "−40% load"] },
          { cells: ["03", "Integration-heavy screens", "After BFF"] },
          { cells: ["04", "Low-traffic legacy screens", "Last, some never"] },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "The rule that kept it honest",
        text: "One source of truth per feature. A screen is either legacy or migrated, never half. Two implementations of the same thing isn't a migration, it's two products.",
      },
      {
        type: "section",
        title: "Backend side",
        text: "Node.js BFF layers were placed in front of the existing services so the React client talked to one coherent API instead of the legacy shape. That is what made screen-by-screen migration possible without renegotiating every backend contract.",
      },
      {
        type: "checklist",
        title: "Risk controls",
        checks: [
          { text: "Every migrated route ships behind the same Cypress gate as new work." },
          { text: "Cross-browser validated on BrowserStack before the legacy route is retired." },
          { text: "Swagger kept current, so the contract stays readable by both stacks." },
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Trade-off on record",
        text: "A period of two coexisting stacks — more surface area, more context-switching — in exchange for never stopping client delivery. Taken deliberately.",
      },
    ],
  },
};
