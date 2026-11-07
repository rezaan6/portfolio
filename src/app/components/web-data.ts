/* ------------------------------------------------------------------ *
 * /web — the web-platform side of the work, for groups hiring for it.
 *
 * The rest of the site is written for product teams and argues in
 * architecture. A holding group asks a different question: can one
 * person keep twenty brands' websites current, bilingual, measurable
 * and safe? This file answers it with the cr8v work — capabilities, case
 * studies and the way the work is run — and the sites themselves live in
 * lib/clients.ts. Every line traces to my work log; figures come from
 * lib/measurement like everywhere else.
 * ------------------------------------------------------------------ */

import { MEASUREMENTS } from "../lib/measurement";

export type WebCapability = { title: string; body: string; proof: string[] };

export const webCapabilities: WebCapability[] = [
  {
    title: "Every brand's site, kept current",
    body: "Content, new pages and documents across the group's companies, on WordPress, Laravel and Shopify.",
    proof: [
      "A monthly group magazine, career-fair pages and company profiles as flipbooks",
      "Privacy, quality and food-safety policy pages",
      "News, investor and property pages kept up to date",
    ],
  },
  {
    title: "Arabic and English, properly",
    body: "Bilingual pages that read right in both — right-to-left layouts, Arabic dates, translated pages kept in step with the English.",
    proof: [
      "Arabic versions rebuilt on WPML for group brands",
      "Right-to-left news with Arabic dates and buttons",
      "A bilingual menu, admin panel and print PDF for a restaurant",
    ],
  },
  {
    title: "Leads that actually arrive",
    body: "A form is only useful if the enquiry lands. I trace the ones that don't, back to the cause.",
    proof: [
      "Contact and job forms repaired, CV uploads stored",
      "Spam stopped with reCAPTCHA",
      "A reservation form given a real backend, with email and WhatsApp alerts",
    ],
  },
  {
    title: "Tracking marketing can trust",
    body: `Google Tag Manager with lead tracking on ${MEASUREMENTS.tracking.value} sites, the old tags removed, and purchase tracking fixed where it was double-counting.`,
    proof: [
      "Meta purchase events de-duplicated, with order values",
      "Looker Studio sales dashboards for two stores",
      "Traffic and enquiry reports for the brands",
    ],
  },
  {
    title: "E-commerce",
    body: "Shopify and WooCommerce stores: storefront features, checkout changes, and the apps around them.",
    proof: [
      "A product carousel, bundles and add-ons",
      "Delivery charges and checkout messages",
      "Fixes worked through with the stores' app vendors",
    ],
  },
  {
    title: "Security and upkeep, planned",
    body: `A security review of the group's ${MEASUREMENTS["das-sites"].value} production sites, the penetration-test findings fixed, and a ${MEASUREMENTS["upgrade-plan"].value}-day upgrade plan the group approved.`,
    proof: [
      "Threat-intelligence blocklists applied across the estate",
      "Backups and server housekeeping",
      "Outages diagnosed, and sites brought back",
    ],
  },
  {
    title: "Group-wide changes, once",
    body: "A change the group needs everywhere ships across the estate in one pass, not one brand at a time.",
    proof: [
      "A supplier-registration link added across the group's sites",
      "Old tracking removed from every site that had it",
      "Logos and links updated site-wide",
    ],
  },
  {
    title: "The small requests too",
    body: "QR codes, digital business cards, HTML email signatures and emailers, alongside the bigger work.",
    proof: [
      "Scan-to-save contact cards for staff",
      "App-download QR codes",
      "Email signatures and emailers in HTML",
    ],
  },
];

export type WebCaseStudy = {
  slug: string;
  title: string;
  /** Client slugs from lib/clients.ts — the first one's screenshot leads. */
  sites: string[];
  tags: string[];
  situation: string;
  did: string[];
  result: string;
};

export const webCaseStudies: WebCaseStudy[] = [
  {
    slug: "fifty-four",
    title: "A restaurant site, from an empty repository to its own admin",
    sites: ["fifty-four"],
    tags: ["React", "TypeScript", "Cloudflare", "English & Arabic"],
    situation:
      "A new restaurant needed a site to carry its menu, bookings and brand in English and Arabic — and one the restaurant could update itself, without a developer for every price change.",
    did: [
      "Built it from an empty repository in React and TypeScript, with the full menu rebuilt from the client's own spreadsheet.",
      "Gave the reservation and feedback forms a real backend, with email and WhatsApp alerts to the restaurant.",
      "Carried it through a full rebrand, then moved it onto company-owned accounts on Cloudflare with an admin panel I built.",
      "Added a staging site that deploys on every push, nightly content backups, and email from the restaurant's own domain.",
    ],
    result:
      "Live at 54dining.com. The restaurant publishes menu and page changes itself and sees them within seconds; bookings and feedback reach it by email and WhatsApp; nothing reaches the live site without passing through staging first.",
  },
  {
    slug: "security-programme",
    title: `One security programme, ${MEASUREMENTS["das-sites"].value} production sites`,
    sites: ["das-holding", "eifm", "tawasul-limo", "udi"],
    tags: ["WordPress", "Laravel", "Custom PHP", "cPanel"],
    situation: `The group's ${MEASUREMENTS["das-sites"].value} production sites share one server and span WordPress, Laravel and custom PHP. Its security team needed to know where each one stood — and then to see it fixed.`,
    did: [
      "Reviewed every site's platform and dependencies, and wrote a site-by-site status report for the group's management.",
      "Worked through the penetration test's findings across the estate, site by site.",
      "Applied the blocklists the group's security team sent to every site, each time a new one arrived.",
      `Planned the upgrades site by site, grouped by risk with an effort estimate for each — ${MEASUREMENTS["upgrade-plan"].value} working days, approved — and started delivery with the group's own site.`,
    ],
    result:
      "A written record of where every site stands, the test's findings fixed site by site, and an approved plan the group can hold to — instead of patching whichever site breaks next.",
  },
  {
    slug: "commerce-reporting",
    title: "E-commerce numbers two stores can trust",
    sites: ["plantaflora", "camelia"],
    tags: ["Shopify", "WooCommerce", "GA4", "Meta", "Looker Studio"],
    situation:
      "Two flower stores were spending on Meta and Google ads, but the numbers did not add up: purchases were counted several times over, and many arrived without an order value.",
    did: [
      "Reviewed the stores' tracking end to end — Google tag, GA4 and the Meta pixel — and removed the duplicate setup.",
      "Fixed the Meta purchase events: no more duplicates, and an order value on every purchase.",
      "Rebuilt both sales dashboards in Looker Studio — overview, campaigns, Meta Ads, placements, a glossary and a store-versus-store comparison — with commentary that stays true for any date range.",
      "Added a weekly page-speed test, and a client view shared only within the agency.",
    ],
    result:
      "Ad spend and sales now read from the same source, and the two stores can be compared side by side — the figures the agency's campaign reviews are built on.",
  },
  {
    slug: "investor-relations",
    title: "Investor relations for an investment company",
    sites: ["esic"],
    tags: ["WordPress", "Custom PHP", "English & Arabic"],
    situation:
      "Emirates Strategic Investment Company publishes results and credit ratings to investors through a locked portal, in English and Arabic — where a wrong figure is a disclosure problem, not a typo.",
    did: [
      "Added the 2026 first-half results to the investor portal, built from the live files rather than a stale copy.",
      "Published a Moody's rating action across the four investor pages, and a credit opinion under Regulated Information.",
      "Built every change on a demo first, and took it live only after the client approved it.",
    ],
    result:
      "Results and ratings published in both languages, and nothing reached investors that had not been approved first.",
  },
  {
    slug: "bilingual",
    title: "Arabic and English across the group's brands",
    sites: ["citiscape", "east-and-west", "ewp", "grove"],
    tags: ["WordPress", "WPML", "Laravel", "Right-to-left"],
    situation:
      "Several of the group's brands needed Arabic that works as Arabic — right-to-left layouts, Arabic dates and numerals, and translated pages that keep up with the English site.",
    did: [
      "Rebuilt Citiscape's Arabic version on a demo from the current English site, and tested both languages end to end.",
      "Built an Arabic language toggle for Grove Landscape, repairing English pages found broken along the way.",
      "Gave East & West Properties right-to-left Arabic news cards with Arabic dates and buttons.",
      "Built East & West's Commercial Properties section with category and emirate filters, in both languages.",
    ],
    result:
      "Arabic built to the same standard as the English, proven on demos for each brand's review before anything changes on the live site.",
  },
];

export const webProcess: { label: string; body: string }[] = [
  {
    label: "Requests from every side",
    body: "The agency's account manager, the group's management, and each brand's marketing, HR, IT and security teams. Every request gets an entry in my work log.",
  },
  {
    label: "Scoped before it's built",
    body: "What changes, on which site, and what else it touches — written down before the first edit.",
  },
  {
    label: "Built on a copy",
    body: "Every change is made and tested on a local or demo copy of the site, and goes live only after sign-off. Nothing is edited live.",
  },
  {
    label: "Shipped, then checked",
    body: "Released by hand, then checked on the live site — the form submitted, the page read in both languages.",
  },
  {
    label: "Reported in plain language",
    body: `Marketing hears what changed for them; IT and security get the technical detail. ${MEASUREMENTS.tasks.value} tasks since June, each one on record.`,
  },
];

export const webStack: { label: string; items: string[] }[] = [
  {
    label: "CMS & e-commerce",
    items: ["WordPress", "Elementor", "WPBakery", "WPML", "WooCommerce", "ACF", "Shopify & Liquid"],
  },
  { label: "Frameworks", items: ["Laravel", "PHP", "React", "TypeScript", "Vite"] },
  {
    label: "Hosting & operations",
    items: ["cPanel", "Apache", "phpMyAdmin", "Cloudflare", "Vercel", "GitHub"],
  },
  {
    label: "Tracking & reporting",
    items: ["Google Tag Manager", "GA4", "Search Console", "Meta Pixel", "Looker Studio"],
  },
  { label: "AI-assisted delivery", items: ["Claude Code", "Codex"] },
];
