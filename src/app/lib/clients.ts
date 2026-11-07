/* ------------------------------------------------------------------ *
 * Client sites — the cr8v work, every one live.
 *
 * The case studies argue in decisions because the code behind them is
 * under NDA. This is the other kind of evidence: live sites a reader can
 * open. Each entry is the site, not a list of tasks — /web describes the
 * work at the level a group hires at, across the estate, and goes deep
 * only in its case studies. At per-site grain a small job reads as the
 * whole relationship, so that grain lives in my work log, for interviews.
 *
 * What stays out, deliberately: the names of client staff, hours, and
 * any per-site security detail. A public page that says which site had
 * which weakness is a map, even after the weakness is fixed.
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
   *   run      — a site I keep running and extend
   *   partial  — narrower work than the site itself, so it stays off the
   *              wall of sites and appears only in the case study it is in
   */
  scope: "built" | "run" | "partial";
};

export const clientSites: ClientSite[] = [
  {
    slug: "fifty-four",
    name: "Fifty Four",
    sector: "Restaurant",
    url: "https://54dining.com",
    platform: "React · TypeScript · Cloudflare",
    scope: "built",
  },
  {
    slug: "das-holding",
    name: "DAS Holding",
    sector: "Holding group",
    url: "https://dasholding.ae",
    platform: "WordPress",
    scope: "run",
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
    sector: "Real estate · Morocco",
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
  },
  {
    slug: "camelia",
    name: "Camelia",
    sector: "E-commerce",
    url: "https://camelia.ae",
    platform: "WooCommerce",
    scope: "partial",
  },
];
