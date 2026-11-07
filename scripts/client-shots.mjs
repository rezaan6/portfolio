#!/usr/bin/env node
/* ------------------------------------------------------------------ *
 * Client-site screenshots for /clients.
 *
 * A card is only evidence if its picture matches the live site, and a
 * live site changes without telling anyone. So the screenshots are not
 * hand-made: this renders each homepage in headless Chrome, from the same
 * list the page reads (src/app/lib/clients.ts — plain TypeScript, which
 * Node strips natively), and writes public/clients/<slug>.webp.
 *
 *   npm run clients:shots              every site
 *   npm run clients:shots -- esic k9   just the slugs named
 *
 * Run by hand rather than in the build: a deploy should not depend on
 * twenty-one other servers being up.
 * ------------------------------------------------------------------ */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import puppeteer from "puppeteer-core";

import { clientSites } from "../src/app/lib/clients.ts";

const OUT = path.join(import.meta.dirname, "..", "public", "clients");
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const only = process.argv.slice(2);
const sites = only.length ? clientSites.filter((s) => only.includes(s.slug)) : clientSites;

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

try {
  for (const site of sites) {
    const page = await browser.newPage();
    // 16:10, the frame the cards draw. One device pixel per CSS pixel: the
    // cards show these at a third of this width, so 2x would be bytes nobody sees.
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    try {
      await page.goto(site.url, { waitUntil: "networkidle2", timeout: 45_000 });
    } catch {
      // A page that never goes idle (chat widgets, analytics beacons) has still
      // rendered — the wait below is what the picture depends on.
    }
    // Preloaders, sliders and entrance animations settle in the first seconds.
    await new Promise((r) => setTimeout(r, 6000));
    // Marketing popups — Elementor's, on most of these sites — open a few
    // seconds in, and would otherwise be the picture instead of the site.
    // Escape closes most of them; the rest are hidden outright.
    await page.keyboard.press("Escape");
    await page.addStyleTag({
      content: ".elementor-popup-modal, .dialog-lightbox-widget { display: none !important }",
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(OUT, `${site.slug}.webp`),
      type: "webp",
      quality: 72,
    });
    console.log(`  ${site.slug.padEnd(18)} ${site.url}`);
    await page.close();
  }
} finally {
  await browser.close();
}
