/* ------------------------------------------------------------------ *
 * Provenance for every figure on this site.
 *
 * A number without a stated basis is a claim; a number with one is
 * evidence. Each entry below says what kind of figure it is — a count,
 * a before/after reading, or an estimate — what it covers, and where it
 * stops. That distinction is the whole point: a count can be checked
 * against a repo, a reading depends on conditions, and an estimate is a
 * judgement. Presenting all three the same way is what makes a résumé
 * read as unfalsifiable.
 *
 * The rule this file is written to: describe the nature and scope of a
 * figure, never invent the instrument. "Measured in DevTools, 4.2s to
 * 2.5s" would read better and would be fabricated; "a before/after read
 * on one route, approximate" is true and survives being asked about.
 *
 * One source, consumed by the home cards, the case-study tables, the
 * About counters and the résumé endnotes, so the four can never drift.
 * ------------------------------------------------------------------ */

export type Kind = "count" | "reading" | "estimate" | "reported" | "report";

export type Measurement = {
  /**
   * The canonical rendering of the figure. Every surface reads it from here —
   * the résumé tiles, the case-study tables, the home cards — so a number can
   * never say −40% in one place and −38% in another. Previously each file
   * carried its own copy and the coverage figure had drifted into five
   * different spellings before anyone noticed.
   */
  value: string;
  /** What the figure is, in one clause — shown as the panel's first line. */
  basis: string;
  /** Where it stops. The limitation stated before anyone has to ask. */
  limit?: string;
  kind: Kind;
};

export const KIND_LABEL: Record<Kind, string> = {
  count: "Count",
  reading: "Before/after reading",
  estimate: "Estimate",
  reported: "Reported figure",
  // Coverage came from a tool's report, which is neither a before/after read nor a
  // judgement. It had been labelled "reading", so the résumé and both PDFs printed
  // "Before/after reading" directly above a basis describing a coverage report that
  // has no before and no after — the footnote contradicting its own label.
  report: "Tool report",
};

export const MEASUREMENTS = {
  "load-kodez": {
    value: "−40%",
    kind: "reading",
    basis:
      "A before/after page-load read on the Kodez CMS, measured against the app as it stood before the code-splitting, lazy-loading and asset work.",
    limit:
      "Approximate, and a lab reading rather than real-user field data. Several changes shipped in that period, so this is a contribution rather than the sole cause.",
  },
  "load-axinom": {
    value: "−15%",
    kind: "reading",
    basis:
      "A before/after page-load read taken around the bundle optimisation, lazy-loading and caching work on the Axinom media applications.",
    limit:
      "Approximate. The bundle, lazy-load and caching changes moved together, so the figure covers the work as a whole rather than isolating one of them.",
  },
  coverage: {
    value: "~90%",
    kind: "report",
    basis:
      "The overall figure on a coverage report combining the Jest unit runs with the instrumented Cypress end-to-end runs on the Kodez CMS, gated in CI.",
    limit:
      "The report's overall number, not one column — branch coverage sits lower. Covers the React application, not the legacy routes still waiting to be migrated. The claim I would defend first: every critical path had a spec in the merge gate.",
  },
  releases: {
    value: "40+",
    kind: "count",
    basis:
      "Production releases shipped on the Kodez CMS across three years — features, defect fixes and database work.",
  },
  "dev-time": {
    value: "−30%",
    kind: "estimate",
    basis:
      "My comparison of elapsed delivery on comparable screens before and after the library became the default way to build — at sprint granularity, in a team that was also growing.",
    limit:
      "Not an instrumented measurement, and I never published a before/after build time for a real screen — which is exactly the mistake the component spec records. Treat it as a judgement of roughly a third, not a figure.",
  },
  tables: {
    value: "250+",
    kind: "count",
    basis:
      "The size of the schema the Kodez CMS was built against, across its enterprise integration surfaces.",
    limit: "The scale I worked against — I did not own the data model.",
  },
  conversion: {
    value: "+15%",
    kind: "reported",
    basis:
      "Reported internally at RaSoft over the months after the responsive and accessibility rebuild of the company site.",
    limit:
      "A business figure I was told rather than one I instrumented, and several things changed at once — a contribution, not an isolated cause.",
  },
  platforms: {
    value: "2",
    kind: "count",
    basis:
      "The Hobber vendor platform and the Kodez CMS, each architected from an empty repository through to production.",
  },
  modules: {
    value: "7",
    kind: "count",
    basis:
      "Authentication, vendor accounts, dashboards, scheduling, payouts, integrations and team access — shipped as independent feature slices over one shared component layer.",
  },
  team: {
    value: "10 → 60+",
    kind: "count",
    basis:
      "Company headcount over my time at Kodez, and the reason a shared component library and enforced standards became necessary.",
    limit: "Company growth, not a team I managed.",
  },
  experience: {
    value: "7+",
    kind: "count",
    basis:
      "Derived from a single start date — my first professional role in December 2018 — rather than written down, and floored so it can never overstate.",
  },
} satisfies Record<string, Measurement>;

export type MeasurementId = keyof typeof MEASUREMENTS;
