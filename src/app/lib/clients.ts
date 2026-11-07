/* ------------------------------------------------------------------ *
 * Client sites — the cr8v work, every entry checkable.
 *
 * The case studies argue in decisions because the code behind them is
 * under NDA. This is the opposite kind of evidence: live sites a reader
 * can open and hold against what the card says I did. So each entry is
 * worded as narrowly as the work was. Most of the group is "run": an
 * existing site I keep running and extend. Where the work was bigger or
 * smaller than that, `scope` says so and `note` says what it was —
 * because the first card that over-claims is the one that gets clicked.
 *
 * Plain TypeScript with no imports and no JSX, so
 * scripts/client-shots.mjs can load it directly (Node strips the types)
 * and the screenshots come from the same list the page renders.
 * Published with the agency's permission.
 * ------------------------------------------------------------------ */

export type ClientSite = {
  slug: string;
  name: string;
  sector: string;
  /** The live site. Its homepage is what the screenshot shows. */
  url: string;
  platform: string;
  /**
   * How much of the site is mine.
   *   built    — mine from an empty repository
   *   run      — an existing site I keep running and extend
   *   partial  — narrower work than the site itself; `note` says what
   */
  scope: "built" | "run" | "partial";
  /** The specific work, where there is more to say than the scope. */
  note?: string;
};

export const clientSites: ClientSite[] = [
  {
    slug: "fifty-four",
    name: "Fifty Four",
    sector: "Restaurant · separate client",
    url: "https://54dining.com",
    platform: "React · TypeScript · Cloudflare",
    scope: "built",
    note: "Built from an empty repository in React and TypeScript, now on Cloudflare with an admin panel I also built — real-time publishing, photo cropping, English and Arabic content — plus a staging site, nightly content backups and email from its own domain.",
  },
  {
    slug: "das-holding",
    name: "DAS Holding",
    sector: "Holding group",
    url: "https://dasholding.ae",
    platform: "WordPress",
    scope: "run",
    note: "The group's own site, including the monthly group magazine.",
  },
  {
    slug: "east-and-west",
    name: "East & West",
    sector: "Real estate",
    url: "https://eastandwest.ae",
    platform: "Laravel",
    scope: "run",
  },
  {
    slug: "ewp",
    name: "East & West Properties",
    sector: "Real estate",
    url: "https://www.ewp.ae",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "citiscape",
    name: "Citiscape",
    sector: "Real estate",
    url: "https://www.citiscapegroup.com",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "eifm",
    name: "EIFM",
    sector: "Facilities management",
    url: "https://eifm.ae",
    platform: "Laravel",
    scope: "run",
  },
  {
    slug: "esic",
    name: "ESIC",
    sector: "Investment",
    url: "https://esic.ae",
    platform: "WordPress · custom PHP",
    scope: "run",
    note: "Investor-relations portal — half-year results and credit-rating updates, in English and Arabic.",
  },
  {
    slug: "yas-healthcare",
    name: "Yas Healthcare",
    sector: "Healthcare",
    url: "https://yashealthcare.ae",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "select-market",
    name: "Select Market",
    sector: "Grocery retail",
    url: "https://www.selectmarket.ae",
    platform: "WooCommerce",
    scope: "run",
  },
  {
    slug: "msan-legal",
    name: "MSAN Legal",
    sector: "Legal",
    url: "https://msn-legal.ae",
    platform: "Laravel",
    scope: "run",
  },
  {
    slug: "tawasul",
    name: "Tawasul",
    sector: "Transport",
    url: "https://tawasul.ae",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "tawasul-limo",
    name: "Tawasul Limo",
    sector: "Chauffeur service",
    url: "https://tawasullimo.ae",
    platform: "Laravel",
    scope: "run",
  },
  {
    slug: "motopro",
    name: "Motopro",
    sector: "Automotive",
    url: "https://www.motopro.ae",
    platform: "Laravel",
    scope: "run",
  },
  {
    slug: "k9",
    name: "K9 Academy",
    sector: "Security services",
    url: "https://www.k9uae.ae",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "grove",
    name: "Grove Landscape",
    sector: "Landscaping",
    url: "https://grove-landscape.com",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "udi",
    name: "United Design International",
    sector: "Design",
    url: "https://udi.ae",
    platform: "Laravel",
    scope: "run",
  },
  {
    slug: "changer",
    name: "Changer",
    sector: "Digital assets",
    url: "https://changer.ae",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "yassat",
    name: "Yassat International",
    sector: "Morocco",
    url: "https://yassat.ma",
    platform: "WordPress",
    scope: "run",
  },
  {
    slug: "plantaflora",
    name: "Plantaflora",
    sector: "E-commerce",
    url: "https://plantaflora.ae",
    platform: "Shopify",
    scope: "run",
    note: "Storefront features — a homepage product carousel, bundles and add-ons, delivery charges — and a sales dashboard on GA4 and Meta Ads data.",
  },
  {
    slug: "camelia",
    name: "Camelia",
    sector: "E-commerce",
    url: "https://camelia.ae",
    platform: "WooCommerce",
    scope: "partial",
    note: "Reporting, not the site: a sales dashboard built from the store's orders, GA4 and Meta Ads, and a tracking check run from the public side.",
  },
  {
    slug: "camelia-trading",
    name: "Camelia Trading",
    sector: "Flower wholesale",
    url: "https://cameliatrading.com",
    platform: "ASP.NET (vendor platform)",
    scope: "partial",
    note: "A content update on the vendor's platform, and a written assessment of whether moving the store to Shopify made sense.",
  },
];
