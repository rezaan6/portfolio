/* ------------------------------------------------------------------ *
 * Client sites — the cr8v work, every entry checkable.
 *
 * The case studies argue in decisions because the code behind them is
 * under NDA. This is the opposite kind of evidence: live sites a reader
 * can open and hold against what the page says I did. So every line is
 * worded as narrowly as the work was, and comes from my work log. Most
 * of the group is "run": an existing site I keep running and extend.
 * Where the work was bigger or smaller than that, `scope` says so —
 * because the first claim that over-reaches is the one that gets checked.
 *
 * What stays out, deliberately: the names of client staff, hours, and
 * any per-site security detail. A public page that says which site had
 * which weakness is a map, even after the weakness is fixed; security
 * work is described once, across the estate, on /web.
 *
 * Plain TypeScript with no imports and no JSX, so
 * scripts/client-shots.mjs can load it directly (Node strips the types)
 * and the screenshots come from the same list the pages render.
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
   *   partial  — narrower work than the site itself
   */
  scope: "built" | "run" | "partial";
  /** One line for the card, where there is more to say than the scope. */
  note?: string;
  /** Month of the first task on this site in my work log. */
  since: string;
  /**
   * Tasks logged on this site when this file was last edited. Only ever an
   * undercount: the log grows, this number does not.
   */
  tasks: number;
  /** What I did on this site — the detail page, one line per piece of work. */
  work: string[];
  /** The /web case study this site belongs to, if any. */
  caseStudy?: string;
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
    since: "Sep 2026",
    tasks: 81,
    work: [
      "Built from an empty repository in React, TypeScript and Vite — homepage, a filterable menu, gallery, links and QR landing pages, in English and Arabic.",
      "Rebuilt the menu from the client's own spreadsheet, and exported it back as Excel and as an Arabic print PDF.",
      "Found the reservation and feedback forms had no backend, and built one — email delivery plus WhatsApp alerts to the restaurant.",
      "Carried the site through a full rebrand, Ember to Fifty Four: logo, icons, colours and copy.",
      "Moved it onto company-owned accounts and Cloudflare, with an admin panel I built: real-time publishing, a photo crop tool, and every page text editable in both languages.",
      "Added a staging site that deploys on every push, nightly content backups, and email from the restaurant's own domain.",
      "Served every dish photo as WebP automatically, and tuned the menu layout for phones.",
    ],
    caseStudy: "fifty-four",
  },
  {
    slug: "das-holding",
    name: "DAS Holding",
    sector: "Holding group",
    url: "https://dasholding.ae",
    platform: "WordPress",
    scope: "run",
    note: "The group's own site, including the monthly group magazine.",
    since: "Jul 2026",
    tasks: 30,
    work: [
      "Publish the group's Achieve Magazine every month, embedded on the site as a flipbook.",
      "Career Fair pages for each event — banners, page copy, and a QR code for the stand.",
      "Published the updated company profile.",
      "Added the Supplier Registration Portal to the top menu and footer, then rolled the same link out across the group's sites.",
      "The first of the group's sixteen sites through the upgrade programme.",
    ],
    caseStudy: "security-programme",
  },
  {
    slug: "east-and-west",
    name: "East & West",
    sector: "Real estate",
    url: "https://eastandwest.ae",
    platform: "Laravel",
    scope: "run",
    since: "Jun 2026",
    tasks: 21,
    work: [
      "Commercial Properties: category and emirate filters and a new property page, in English and Arabic — built on a demo and revised with the client.",
      "A new Privacy Policy page, built from the supplied document.",
      "Traced why contact enquiries were not registering as leads, and fixed the form.",
      "Google Tag Manager installed, and the old tracking removed.",
      "QR codes for the website and for a property permit.",
    ],
    caseStudy: "bilingual",
  },
  {
    slug: "ewp",
    name: "East & West Properties",
    sector: "Real estate",
    url: "https://www.ewp.ae",
    platform: "WordPress",
    scope: "run",
    since: "Jul 2026",
    tasks: 8,
    work: [
      "Arabic news: right-to-left cards with Arabic dates and buttons, and full titles.",
      "A category filter for the news page, and a cleaner post template.",
      "Fixed the site when it suddenly rendered completely unstyled — a theme setting.",
      "Google Tag Manager installed; short links for news articles.",
    ],
    caseStudy: "bilingual",
  },
  {
    slug: "citiscape",
    name: "Citiscape",
    sector: "Real estate",
    url: "https://www.citiscapegroup.com",
    platform: "WordPress",
    scope: "run",
    since: "Jun 2026",
    tasks: 16,
    work: [
      "Rebuilt the Arabic version on a demo from the current English site, and tested both languages end to end.",
      "Repaired the job application form so CV uploads are stored.",
      "Website traffic reports, January to October 2026.",
      "Mobile header and hero fixes; projects reordered and cover images re-cropped.",
      "Google Tag Manager installed on the live site.",
    ],
    caseStudy: "bilingual",
  },
  {
    slug: "eifm",
    name: "EIFM",
    sector: "Facilities management",
    url: "https://eifm.ae",
    platform: "Laravel",
    scope: "run",
    since: "Sep 2026",
    tasks: 6,
    work: [
      "Google Tag Manager installed, with lead-form tracking.",
      "The Supplier Registration Portal added to the menu and footer.",
      "Brought in line with the group's security programme.",
    ],
    caseStudy: "security-programme",
  },
  {
    slug: "esic",
    name: "ESIC",
    sector: "Investment",
    url: "https://esic.ae",
    platform: "WordPress · custom PHP",
    scope: "run",
    note: "Investor-relations portal — half-year results and credit-rating updates, in English and Arabic.",
    since: "Sep 2026",
    tasks: 9,
    work: [
      "Added the 2026 first-half results to the investor portal, built from the live files and approved on a demo first.",
      "Published a Moody's rating action across the four investor pages, and a credit opinion under Regulated Information.",
      "Converted an investor email from an Outlook template into editable HTML.",
    ],
    caseStudy: "investor-relations",
  },
  {
    slug: "yas-healthcare",
    name: "Yas Healthcare",
    sector: "Healthcare",
    url: "https://yashealthcare.ae",
    platform: "WordPress",
    scope: "run",
    since: "Jul 2026",
    tasks: 8,
    work: [
      "Fixed doctors not showing, the English-to-Arabic redirect, and the homepage display.",
      "Built the About Us page, the services dropdown and the services-page sidebar.",
      "Restyled the service images to match, and fixed a link that opened the Arabic page.",
      "Removed every Facebook icon and link across the site.",
    ],
  },
  {
    slug: "select-market",
    name: "Select Market",
    sector: "Grocery retail",
    url: "https://www.selectmarket.ae",
    platform: "WooCommerce",
    scope: "run",
    since: "Sep 2026",
    tasks: 4,
    work: [
      "Replaced the Quality Policy and Food Safety Policy.",
      "Diagnosed an outage as an expired domain, and passed it to whoever held the registration.",
      "The Supplier Registration Portal added to the menu and footer.",
    ],
  },
  {
    slug: "msan-legal",
    name: "MSAN Legal",
    sector: "Legal",
    url: "https://msn-legal.ae",
    platform: "Laravel",
    scope: "run",
    since: "Sep 2026",
    tasks: 8,
    work: [
      "Took the site on from scratch and brought it into the group's estate.",
      "Restored contact enquiries that had stopped arriving.",
      "A sitemap for Google Search Console.",
      "An analytics and enquiries report, July to October 2026.",
      "Google Tag Manager installed.",
    ],
  },
  {
    slug: "tawasul",
    name: "Tawasul",
    sector: "Transport",
    url: "https://tawasul.ae",
    platform: "WordPress",
    scope: "run",
    since: "Jul 2026",
    tasks: 11,
    work: [
      "Published the Tawasul Mobility company profiles as flipbooks.",
      "HTML email signatures for the team.",
      "Updated partner logos, and fixed a page that showed another brand's headline.",
      "Scan-to-save contact QR codes for staff.",
    ],
  },
  {
    slug: "tawasul-limo",
    name: "Tawasul Limo",
    sector: "Chauffeur service",
    url: "https://tawasullimo.ae",
    platform: "Laravel",
    scope: "run",
    since: "Oct 2026",
    tasks: 1,
    work: ["Part of the group's estate, and covered by its security programme."],
    caseStudy: "security-programme",
  },
  {
    slug: "motopro",
    name: "Motopro",
    sector: "Automotive",
    url: "https://www.motopro.ae",
    platform: "Laravel",
    scope: "run",
    since: "Aug 2026",
    tasks: 9,
    work: [
      "Rebuilt the responsive header, with the Supplier Registration Portal link.",
      "Fixed the certificate previews on About Us, and added the Vision and Mission policies.",
      "Got the homepage video playing again.",
      "Google Tag Manager installed, and the old tracking removed.",
    ],
  },
  {
    slug: "k9",
    name: "K9 Academy",
    sector: "Security services",
    url: "https://www.k9uae.ae",
    platform: "WordPress",
    scope: "run",
    since: "Sep 2026",
    tasks: 16,
    work: [
      "Brought the site back after an outage.",
      "Compressed the company profile and published it as a flipbook, then updated it to the new A5 edition.",
      "Removed a third-party chat widget and kept the WhatsApp chat.",
      "Website QR codes; Google Tag Manager installed and the old tracking removed.",
    ],
  },
  {
    slug: "grove",
    name: "Grove Landscape",
    sector: "Landscaping",
    url: "https://grove-landscape.com",
    platform: "WordPress",
    scope: "run",
    since: "Sep 2026",
    tasks: 14,
    work: [
      "Built an Arabic version with a language toggle on a demo, repairing English pages found broken along the way.",
      "Added reCAPTCHA to the appointment popup to stop spam.",
      "Website traffic reports, January to October 2026.",
      "Google Tag Manager installed; QR codes for the site and its Linktree.",
    ],
    caseStudy: "bilingual",
  },
  {
    slug: "udi",
    name: "United Design International",
    sector: "Design",
    url: "https://udi.ae",
    platform: "Laravel",
    scope: "run",
    since: "Sep 2026",
    tasks: 2,
    work: [
      "The Supplier Registration Portal added to the menu and footer.",
      "Covered by the group's security programme.",
    ],
    caseStudy: "security-programme",
  },
  {
    slug: "changer",
    name: "Changer",
    sector: "Digital assets",
    url: "https://changer.ae",
    platform: "WordPress",
    scope: "run",
    since: "Jul 2026",
    tasks: 5,
    work: [
      "App-download QR codes for Android, iOS and Huawei.",
      "Digital business cards with Add to Contacts for the company's executives.",
      "Diagnosed why an HTML emailer was not rendering in the CRM.",
    ],
  },
  {
    slug: "yassat",
    name: "Yassat International",
    sector: "Morocco",
    url: "https://yassat.ma",
    platform: "WordPress",
    scope: "run",
    since: "Jul 2026",
    tasks: 5,
    work: [
      "Fixed the contact form and routed it to the right inbox; updated the contact details and the map.",
      "Diagnosed an SSL outage as a server-side issue, and handed it to the host.",
    ],
  },
  {
    slug: "plantaflora",
    name: "Plantaflora",
    sector: "E-commerce",
    url: "https://plantaflora.ae",
    platform: "Shopify",
    scope: "run",
    note: "Storefront features — a homepage product carousel, bundles and add-ons, delivery charges — and a sales dashboard on GA4 and Meta Ads data.",
    since: "Jul 2026",
    tasks: 47,
    work: [
      "A Popular Picks product carousel on the homepage.",
      "Bundles and add-ons, with out-of-stock items shown instead of silently hidden.",
      "Cart and checkout delivery changes — messages, descriptions and fees.",
      "Fixed the Meta purchase tracking: orders were being counted several times, and about a third of purchases arrived without an order value.",
      "A multi-page Looker Studio sales dashboard, and weekly campaign briefs.",
      "Worked fixes through with the subscription and delivery-scheduling app vendors.",
    ],
    caseStudy: "commerce-reporting",
  },
  {
    slug: "camelia",
    name: "Camelia",
    sector: "E-commerce",
    url: "https://camelia.ae",
    platform: "WooCommerce",
    scope: "partial",
    note: "Reporting, not the site: a sales dashboard built from the store's orders, GA4 and Meta Ads, and a tracking check run from the public side.",
    since: "Jul 2026",
    tasks: 20,
    work: [
      "Built the store's sales dashboard from the Plantaflora template, with a store-orders sheet for blended return on ad spend.",
      "A page comparing the two stores side by side.",
      "Checked the store's conversion tracking from the public side, and reported a likely double tag.",
      "Published the monthly portfolio as a flipbook.",
    ],
    caseStudy: "commerce-reporting",
  },
  {
    slug: "camelia-trading",
    name: "Camelia Trading",
    sector: "Flower wholesale",
    url: "https://cameliatrading.com",
    platform: "ASP.NET (vendor platform)",
    scope: "partial",
    note: "A content update on the vendor's platform, and a written assessment of whether moving the store to Shopify made sense.",
    since: "Jul 2026",
    tasks: 8,
    work: [
      "Updated the mobile banner on the vendor's platform.",
      "Researched what the platform actually is and whether a rebuild made sense, then answered the client's Shopify question in writing.",
      "Converted an introduction emailer to HTML with two copy options; the client chose one.",
    ],
  },
];
