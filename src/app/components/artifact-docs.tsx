import { MEASUREMENTS } from "../lib/measurement";
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
          { label: "Deciders", value: "Me, with the backend lead. One dissent: start single-surface, split later." },
          { label: "Scope", value: "Sole frontend engineer — the frontend is mine end to end, so this record is the boundary I hold myself to rather than one I enforce on others." },
          { label: "Status", value: "Accepted · amended after the first release" },
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
        // The last sentence used to read "TypeScript throughout, so cross-slice
        // contracts are compiler-checked rather than convention-checked" — which
        // credits the wrong tool. TypeScript compiles a cross-slice import
        // happily; a lint rule is what refuses it. The compiler's real job here is
        // the contract at the composition point, which is a different guarantee.
        text: "Organize the frontend by feature slice, not by technical layer. Each domain owns its routes, components, state, and API access together. Slices never import from each other; anything genuinely shared is promoted into an explicit UI layer underneath. The import direction is lint-checked rather than convention-checked, and TypeScript checks the contracts where slices compose.",
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
          { text: "A pattern is copied twice before it is promoted. — Added by amendment; see below." },
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
        tone: "note",
        title: "Amendment, after the first release",
        text: "The copy-twice rule was not in the original record. I built the shared layer slightly ahead of demand and a few early primitives were generalised for a second use case that never arrived, so the rule was added once the cost was visible. Recording it as an amendment rather than backdating it is the point: the decision was right, the promotion threshold was not, and only shipping told us which.",
      },
      {
        type: "callout",
        tone: "win",
        title: "Consequence",
        text: "A new domain is a new folder, not a refactor. A boundary violation is refused by lint on the import direction, and a contract that has drifted fails to typecheck where the slices compose — rather than either surfacing in review, or in production.",
      },
    ],
  },

  "COMPONENT SPEC": {
    summary:
      "How a component earns its place in the Storybook library at Kodez: the promotion rule, the props contract, the accessibility floor, and what disqualifies a component from being shared. I judge this library cut frontend delivery time by roughly a third.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Reusable component library — API contract" },
          { label: "Context", value: "Kodez enterprise CMS · company scaled 10 → 60+" },
          { label: "Stack", value: "React · TypeScript · SCSS · Material UI · Storybook" },
          { label: "Result", value: `Frontend delivery time down by roughly a third (${MEASUREMENTS["dev-time"].value.replace("−","~")}) — my judgement, not an instrumented figure` },
        ],
      },
      {
        type: "section",
        title: "Why this exists",
        text: `The CMS spans ${MEASUREMENTS.tables.value} SQL tables and enterprise integrations, and the company grew from 10 to 60+ people. Without a shared spine, every screen is authored from scratch and the product drifts. The library is how a screen becomes composition instead of authorship.`,
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
        type: "steps",
        title: "Changing one, once it is shared",
        ordered: true,
        items: [
          "Additive by default — a new optional prop with a default that preserves current behaviour.",
          "A breaking change updates every call site in the same pull request. If that is too large to review, it is too large to make in one go.",
          "Never change a prop's meaning while keeping its name. Add the new one, deprecate the old one in the story, remove it once the call sites are gone.",
        ],
      },
      {
        type: "checklist",
        title: "Accessibility floor — non-negotiable",
        checks: [
          { text: "Reachable and operable by keyboard, with a visible focus ring." },
          { text: "Correct role and accessible name; state exposed via ARIA, not colour alone." },
          { text: "Contrast meets WCAG AA in both the light and dark themes." },
          {
            text: "Enforced in review against this list, not by an automated check — see below.",
            good: false,
          },
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
        text: "Two things. I sold the library on consistency when I should have sold it on speed — engineers adopt a design system when it visibly saves them an afternoon, so publish the before/after build time for a real screen in week one and let the number argue. And I called the accessibility floor non-negotiable while enforcing it by review, which means it held exactly as long as the reviewer remembered. A rule with no check is a preference; it belongs in the pipeline next to the tests.",
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
        type: "checklist",
        title: "What breaks the rule",
        checks: [
          {
            text: "Copying a query result into useState so it can be edited. Now there are two answers and no way to tell which is current — hold the draft separately and keep the cache as the read.",
            good: false,
          },
          {
            text: "A useEffect that syncs one store into another. That is the merge, written one field at a time.",
            good: false,
          },
          {
            text: "Storing a total that can be computed. It is one render cheaper and one class of stale bug more expensive.",
            good: false,
          },
          {
            text: "An optimistic update with no rollback path. Optimism is a claim about the server that the server has not agreed to yet.",
            good: false,
          },
          {
            text: "A real-time event written straight into component state. An event may invalidate a cache key; it must never be the only way a piece of state arrives — a socket that reconnects replays nothing, so the screen is then confidently wrong with no read that can correct it.",
            good: false,
          },
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
      `The performance one-pager for the Axinom media build: what was measured, the three levers that moved it, and the guardrails that stopped a faster page from becoming a broken one. Page load was ${MEASUREMENTS["load-axinom"].value.replace("−","~")} lower after the work than before it.`,
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Page-load performance one-pager — media web applications" },
          { label: "Context", value: "Axinom · Mosaic platform · global media clients" },
          { label: "Result", value: `${MEASUREMENTS["load-axinom"].value.replace("−","~")} reduction in page load time` },
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
          "Lazy loading — defer everything below the fold and every route the user hasn't asked for. Playback surfaces load first; catalogue browsing can wait, the playback path cannot.",
          "Caching — cache what doesn't change per request. Metadata from the Mosaic APIs qualifies; entitlement decisions do not.",
        ],
      },
      {
        type: "table",
        cols: ["What was measured", "Read"],
        rows: [
          { cells: ["Page load time", MEASUREMENTS["load-axinom"].value], tag: "Now" },
          { cells: ["Bundle composition, per locale", "Audited"] },
          { cells: ["Time to first frame, playback routes", "Watched"] },
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
            text: "Reading the average alone — it hides the regions and devices having the worst time. Added after the fact: the original pass had no segmentation guardrail, which is the mistake recorded below.",
            good: false,
          },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "Where this stops being a budget",
        text: "A budget is a number you are not allowed to exceed. This was a measurement pass with a target — real thresholds, in CI, failing the build on a regression, would have made the gain durable instead of a snapshot. It held because the same few people were watching it, which is not a mechanism.",
      },
      {
        type: "callout",
        tone: "insight",
        title: "What I'd add next",
        text: "Segment the measurement by region and device from the first read, not the third. On an international product with global clients, the aggregate is the least informative number available — a good median hides the region having the worst time.",
      },
    ],
  },

  "TEST STRATEGY": {
    summary:
      `The testing strategy that made ${MEASUREMENTS.releases.value} production releases safe at Kodez: what gets a test, what deliberately doesn't, where the gate sits, and an honest account of how much of it was actually test-first.`,
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Test strategy — Kodez CMS" },
          { label: "Coverage", value: `${MEASUREMENTS.coverage.value} overall — Jest + Cypress merged; every critical path gated` },
          { label: "Releases", value: `${MEASUREMENTS.releases.value} production releases` },
          { label: "Tooling", value: "Jest · Cypress · CI/CD · BrowserStack" },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "The premise",
        text: `Release throughput is not a function of moving fast. It's a function of how cheaply you can prove you didn't break anything. TDD and CI gates weren't overhead on the ${MEASUREMENTS.releases.value} releases — they're what made shipping on that cadence safe.`,
      },
      {
        type: "table",
        cols: ["Layer", "Volume", "Speed"],
        rows: [
          { cells: ["Unit (Jest) — logic, reducers, transforms", "Many", "Fast"] },
          { cells: ["Component — rendering against the library", "Some", "Medium"] },
          { cells: ["E2E (Cypress) — flows a client would notice", "Fewest", "Slow"], tag: "Now" },
        ],
      },
      {
        type: "checklist",
        title: "What always gets an E2E test",
        checks: [
          { text: "Authentication and permissions." },
          {
            text: `Write paths into the core schema where a bad write isn't recoverable by a retry — not all ${MEASUREMENTS.tables.value} tables, the consequential ones.`,
          },
          {
            text: "Every integration surface in the client's vendor stack (Fiserv, Toshiba, NTT DATA, Park Assist, City) — against a recorded contract, not the vendor's live endpoint.",
          },
          { text: "Any path a defect has been filed against. A bug gets a test before it gets a fix." },
        ],
      },
      {
        type: "section",
        title: "The third-party boundary",
        text: "Five vendor integrations cannot be in the merge path. A suite that calls a payment or POS provider on every pull request is slow, needs credentials in CI, and goes red for reasons that have nothing to do with the diff — so the team stops trusting it, which is worse than not having it. The rule: our side of each contract is stubbed at the network boundary and the stub is the recorded shape of the real response. Contract drift is caught by exercising the live integration on a schedule against staging, where a failure is a conversation with the vendor rather than a blocked release.",
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

  "INCIDENT REVIEW": {
    summary:
      "Protected playback stopped part-way through long assets on the Axinom media build. The licence was acquired once, at play time, and outlived by the content — a failure that could not appear on any asset short enough for someone to sit through during development.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Incident review — licence expiry mid-playback" },
          { label: "Context", value: "Axinom · DRM-protected long-form content · global media clients" },
          { label: "Detected by", value: "A viewer, via the client's support team. There was no client-side error reporting to detect it for us." },
          { label: "Status", value: "Closed · one gap deliberately left open, stated below" },
          { label: "Stack", value: "React · Shaka Player · Mosaic Entitlement & DRM services" },
        ],
      },
      {
        type: "section",
        n: "01",
        title: "What happened",
        text: "Playback halted part-way through long recordings. A licence was acquired once, when the viewer pressed play, and on assets whose runtime exceeded that licence's own validity window the decryption keys expired mid-stream. The video stopped. Short assets were unaffected, which is why every build looked healthy: nothing anyone played during development or QA ran long enough to cross the boundary.",
      },
      {
        type: "section",
        n: "02",
        title: "Why it took a viewer to find it",
        text: "Two things, and only one of them is about tooling. There was no client-side error reporting on this product, so nobody was watching for a failure — a viewer was the detector, and they told the client before the client told us. But the player did report it: Shaka raises an expiry error, and it fired. The gap was that the error had nowhere to go. It went to a browser console no operator was reading, and the ticket that reached me said the video stopped working. A signal nobody routes anywhere is not a signal.",
      },
      {
        type: "steps",
        title: "Containment, which fixed nothing",
        ordered: true,
        items: [
          "The licence validity for the affected titles was raised on the licence side, so live viewers stopped losing sessions mid-recording. This moved the boundary further out; it did not remove it.",
          "Support was given something accurate to say — long content only, the recording is fine, reload and resume — instead of \"the video is broken\".",
          "I pinned a deliberately short-lived licence in a non-production environment, so the boundary could be crossed in a browser on demand rather than by watching a full lecture. That is what made the real fix testable.",
        ],
      },
      {
        type: "section",
        title: "Root cause",
        text: "Licence acquisition was written as a one-shot step on the path to first frame. Nothing in the client owned the question of what happens when a licence expires before the asset ends, so the keys died and playback stopped. The invariant I had not written down is the one that mattered: a licence shorter than the content it protects is a supported case, not an accident.",
      },
      {
        type: "steps",
        title: "The structural fix",
        ordered: true,
        items: [
          "Expiry became state the player owns rather than an event it reacts to. The DRM module reads the expiration it is handed by the key session and acts before the keys die, not after playback has already stopped.",
          "Renewal is a reload at the current position with a freshly minted entitlement token, not an in-place licence swap. In-place renewal does exist — a CDM that is issued a renewable licence emits a license-renewal message, and the response goes back through MediaKeySession.update() without interrupting playback — but the licences we were issued carried no renewal policy, so no renewal message was ever emitted and there was nothing to pass to update(). Changing that is a licence-service decision, not a client one. Reload at position was the mechanism available to me, and it costs the viewer a brief visible stall. A stall you can explain beats a stop you cannot.",
          "The short-lived licence became a standing check, so the renewal path is crossed every time it runs and a broken renewal fails in a check rather than in somebody's lecture.",
          "The expiry error was mapped to a distinct state — access expired, as against cannot play on this device, as against network — so the next ticket arrives carrying something to act on.",
        ],
      },
      {
        type: "checklist",
        title: "What I would not do again",
        checks: [
          {
            text: "Treat an acquisition on the path to first frame as a one-time step. Anything with a validity window needs an owner for the moment it runs out.",
            good: false,
          },
          {
            text: "Test a duration-dependent failure by making the test longer. Shrink the window instead — the licence, not the lecture.",
            good: false,
          },
          {
            text: "Leave a player error going only to the console. It is detection that exists and is thrown away.",
            good: false,
          },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "The gap I left open",
        text: "The check runs on real browsers as a release step, not as a merge gate, because a real content decryption module does not exist in headless CI — and by my own standard a rule with no gate is a preference. I also did not rule out every adjacent cause before shipping the fix; I could reproduce expiry and I fixed expiry. And the detector is still a person. That one is mine: I chose not to build client-side failure reporting on a product where a playback failure is the most expensive thing there is to reproduce. This is the incident that makes the argument for it.",
      },
    ],
  },

  "ACCESSIBILITY BASELINE": {
    summary:
      "The floor the RaSoft company-site rebuild had to clear before it could ship — what had to be true of every screen, why keyboard order came before colour, and the thing I had backwards at the start.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Accessibility & responsive baseline — company site rebuild" },
          { label: "Context", value: "RaSoft · seed-stage startup · first end-to-end UI ownership" },
          { label: "Stack", value: "React · JavaScript · SCSS" },
          { label: "Status", value: "Applied to the rebuild; written up here from what the work required" },
        ],
      },
      {
        type: "section",
        title: "Why a floor and not a checklist",
        text: "A checklist gets run once, near the end, by whoever remembers. A floor is a condition for shipping, so it is cheaper: the cost of keyboard order is minutes while a screen is being built and hours once it exists. This was my first project owning the UI end to end, and the useful lesson was that accessibility is a structural property, not a pass you make over finished markup.",
      },
      {
        type: "checklist",
        title: "True of every screen before it ships",
        checks: [
          { text: "Reachable and operable by keyboard, in an order that matches the visual one." },
          { text: "One h1, and headings that descend without skipping a level — the document outline is the mental model a screen reader user gets." },
          { text: "Every control has an accessible name. An icon-only button without one is unusable and reads as \"button\"." },
          { text: "Text meets WCAG AA against its actual background, not against white." },
          { text: "Layout holds from 320px up, and text reflows rather than being scaled down to fit." },
          { text: "Colour as the only signal — a red border with no text is invisible to the people most likely to need it.", good: false },
          { text: "A div with a click handler standing in for a button. It is not focusable and does not fire on Enter.", good: false },
        ],
      },
      {
        type: "callout",
        tone: "insight",
        title: "What I had backwards",
        text: "I started with contrast, because it is the part you can see and check quickly. It was the wrong order. Contrast is a property of a finished style; keyboard order and semantics are properties of the structure, and by the time a screen looks right the structure is expensive to change. Semantics first, then focus order, then colour — that sequence costs the least and I only learned it by paying the other one.",
      },
      {
        type: "callout",
        tone: "note",
        title: "Where this stops",
        text: "This was manual: keyboard passes, a contrast checker and reading the markup. No automated audit ran in CI, and I did not test with a real screen-reader user — the closest I got was navigating with one myself, which tells you a page is operable and not whether it is comprehensible. A floor enforced by attention is a floor that holds while someone is paying attention.",
      },
    ],
  },

  "API CONTRACT": {
    summary:
      "How the frontend and the .NET backend at Hobber agree on a shape before either side builds it — pinned in Swagger, typed on our side, and changed by conversation rather than discovered in production.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Frontend ↔ backend API contract" },
          { label: "Context", value: "Hobber vendor platform · React + TypeScript client, .NET backend" },
          { label: "Rule", value: "Agree the shape before either side writes the code that depends on it" },
          { label: "Stack", value: "TypeScript · REST · Swagger/OpenAPI · SignalR" },
        ],
      },
      {
        type: "section",
        title: "Why this exists",
        text: "Two people building both halves of an integration from a conversation produces two different guesses, and the difference surfaces at the worst moment — usually in a browser, usually the day it is demoed. Pinning the shape first turns an integration bug into a five-minute disagreement held before either side has written anything worth defending.",
      },
      {
        type: "steps",
        title: "The order",
        ordered: true,
        items: [
          "The shape is agreed and pinned in Swagger before either side builds — request, response, and what an error looks like.",
          "It is typed on our side, so a response that stops matching is a compile error rather than an undefined halfway down a render.",
          "The client is written against the pinned shape. Where the backend is not ready, the shape is enough to build and test against.",
          "A change to the contract is a change to the document first. Discovering it from a failing screen means the document was not the contract.",
        ],
      },
      {
        type: "checklist",
        title: "What the shape has to say",
        checks: [
          { text: "What is optional and what is guaranteed. \"Usually present\" is not a contract." },
          { text: "What an error looks like, with the same shape every time — a client cannot branch on prose." },
          { text: "What an empty result is: an empty array and a null are different states and read differently on screen." },
          { text: "Which fields are money or dates, and in what units and timezone." },
          { text: "A field whose meaning depends on another field's value, with nothing saying so.", good: false },
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "The real-time half",
        text: "SignalR does not remove the need for this, it adds one. A socket event carries a payload with a shape, and the same rules apply — but an event is also not a source of truth on its own, because a hub restores a connection and replays nothing sent during the gap. The event invalidates a cache key; the read is still the REST contract. That rule is in the state model.",
      },
      {
        type: "callout",
        tone: "insight",
        title: "What this does not solve",
        text: "A pinned document is a shared intention, not a guarantee — nothing here fails a build if the deployed API drifts from what Swagger says. Generating the client types from the spec, and checking the running API against it on a schedule, is what would turn agreement into enforcement. By my own standard that makes this a preference with a good habit around it.",
      },
    ],
  },

  "MIGRATION PLAN": {
    summary:
      "How a legacy Laravel and jQuery application moved to React and ExpressJS incrementally at Kodez — the strangler approach, the ordering, and the one rule that kept two coexisting stacks from doubling the work. The legacy surface was retired down to a low-traffic remainder, without a delivery freeze.",
    blocks: [
      {
        type: "fields",
        fields: [
          { label: "Doc", value: "Legacy Laravel + jQuery → React + ExpressJS" },
          { label: "Constraint", value: "Live users and client commitments — no freeze available" },
          { label: "Result", value: "Legacy surface retired down to a low-traffic remainder · zero delivery freeze" },
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
          { cells: ["02", "High-traffic, high-latency paths", `${MEASUREMENTS["load-kodez"].value} load`] },
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
