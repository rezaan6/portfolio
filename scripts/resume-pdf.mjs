#!/usr/bin/env node
/* ------------------------------------------------------------------ *
 * Résumé → PDF.
 *
 * The Download button used to open the browser's print dialog, which
 * meant the file a recruiter got was whatever their browser decided to
 * make: their margins, their headers, their paper size, and — because
 * globals.css declares `@page { size: A4 }` — three pages of A4 whether
 * that suited the document or not.
 *
 * This renders the real /resume route in headless Chrome and writes two
 * files. There is deliberately no second layout: the PDF is a
 * photograph of the page that already exists, so it cannot drift from
 * the site, and values derived at render time (see lib/experience.ts)
 * are picked up automatically.
 *
 *   public/resume.pdf      232mm wide × however tall it needs — ONE
 *                          continuous page. This is the download.
 *   public/resume-a4.pdf   Real A4, paginated through the existing
 *                          @media print reflow. This is the one to
 *                          upload to an ATS, and the one that prints.
 *
 * Two files because a 232 × ~590mm page scaled onto A4 lands the body
 * type near 5pt. The tall page is for reading; A4 is for filing.
 *
 *   node scripts/resume-pdf.mjs [--url http://localhost:3000]
 *
 * With no --url it builds and boots the app itself on a free port.
 * ------------------------------------------------------------------ */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";

import puppeteer from "puppeteer-core";

import { resumeSourceHash } from "./resume-sources.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public");
const MM_PER_PX = 25.4 / 96;

/* Chrome has to come from somewhere different depending on where this runs.
 *
 * Locally that's the installed browser. On Vercel's build container there is no
 * browser and no system libraries for one, which is the whole reason this used
 * to be a manual script producing a committed file — and the reason that file
 * could silently disagree with the page it was linked from.
 *
 * @sparticuz/chromium is a Chromium built for exactly that environment: it
 * unpacks a binary and reports the flags it needs to run without a display or a
 * sandbox. Resolved lazily so a local run never pays for loading it. */
const LOCAL_CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function resolveChrome() {
  if (!existsSync(LOCAL_CHROME)) {
    const { default: chromium } = await import("@sparticuz/chromium");
    const executablePath = await chromium.executablePath();
    return { executablePath, args: chromium.args, source: "@sparticuz/chromium" };
  }
  return {
    executablePath: LOCAL_CHROME,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    source: "local Chrome",
  };
}

const argUrl = process.argv.includes("--url")
  ? process.argv[process.argv.indexOf("--url") + 1]
  : null;

const log = (m) => console.log(`  ${m}`);

const freePort = () =>
  new Promise((res, rej) => {
    const s = createServer();
    s.on("error", rej);
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });

const waitForServer = async (url, timeoutMs = 90_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`server never became ready at ${url}`);
};

const run = (cmd, args, opts = {}) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { cwd: ROOT, stdio: "inherit", ...opts });
    p.on("exit", (code) => (code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`))));
    p.on("error", rej);
  });

async function main() {
  let server = null;
  let base = argUrl;

  if (!base) {
    log("building…");
    await run("npx", ["next", "build"]);
    const port = await freePort();
    base = `http://127.0.0.1:${port}`;
    log(`starting production server on ${port}…`);
    server = spawn("npx", ["next", "start", "--port", String(port)], {
      cwd: ROOT,
      stdio: "ignore",
      detached: false,
    });
    await waitForServer(base);
  }

  const chrome = await resolveChrome();
  log(`rendering ${base}/resume  (${chrome.source})`);
  const browser = await puppeteer.launch({
    executablePath: chrome.executablePath,
    headless: true,
    // Text rendering flags come last so they win: this is a print render, and
    // subpixel antialiasing would bake the screen's LCD hinting into the file.
    args: [...chrome.args, "--font-render-hinting=none", "--disable-lcd-text"],
  });

  try {
    const page = await browser.newPage();

    // Wide viewport BEFORE navigating. The résumé scales itself down to fit
    // narrow screens; at 1800px the fit-to-viewport transform stays at 1 and
    // we capture the document at its true size rather than a shrunk preview.
    await page.setViewport({ width: 1800, height: 2400, deviceScaleFactor: 2 });
    await page.goto(`${base}/resume`, { waitUntil: "networkidle0", timeout: 60_000 });

    // The route is a client component behind a loading skeleton, so `load`
    // alone captures an empty page. Wait for the document itself, then for
    // webfonts — capturing mid-swap bakes fallback metrics into the PDF.
    await page.waitForSelector(".resume-page", { timeout: 30_000 });

    /* The arrow problem, and why the font is embedded here rather than shipped.
     *
     * "0→1" appears throughout the résumé. U+2192 is not in the next/font
     * Google subsets the site loads, so the browser was quietly satisfying it
     * from a system font — which macOS has and the build container does not. The
     * first Vercel-built PDF rendered every arrow as an empty box, and nothing
     * failed: the page was correct, the download was not.
     *
     * Injecting the font at render time rather than adding it to public/ keeps a
     * 180KB file off every visitor's page load — no browser needs it, only this
     * renderer does — and it makes the two environments produce the same bytes
     * instead of relying on whatever each host happens to have installed. Only
     * the glyphs actually used get embedded in the PDF. */
    const symbols = await readFile(path.join(import.meta.dirname, "fonts", "noto-symbols.ttf"));
    await page.evaluate(
      (b64) => {
        const style = document.createElement("style");
        style.textContent = `@font-face{font-family:'SR Symbols';src:url(data:font/ttf;base64,${b64}) format('truetype');font-display:block}`;
        document.head.appendChild(style);
        // Append it to the existing stacks rather than overriding them: the real
        // families must still win for every glyph they cover, so this only ever
        // catches what would otherwise be a missing-glyph box. Read the computed
        // values first because they are next/font's generated family names.
        const cs = getComputedStyle(document.documentElement);
        const vars = ["--font-display", "--font-heading", "--font-mono", "--font-body", "--font-sans"];
        const decls = vars
          .map((v) => [v, cs.getPropertyValue(v).trim()])
          .filter(([, val]) => val)
          .map(([v, val]) => `${v}: ${val}, 'SR Symbols';`)
          .join("");
        const patch = document.createElement("style");
        patch.textContent = `:root{${decls}}body,.resume-page{font-family:${cs.fontFamily}, 'SR Symbols'}`;
        document.head.appendChild(patch);
      },
      symbols.toString("base64"),
    );

    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => document.documentElement.classList.add("pdf-export"));
    await new Promise((r) => setTimeout(r, 350));

    /* ---------------- 1. continuous, 232mm wide, one page --------------- */
    // Print media for BOTH files. The site chrome — nav, the Download and
    // Copy buttons, the page background — is hidden by `print:hidden` classes
    // in the JSX, not by the stylesheet, so rendering in screen media would
    // photograph the whole website and spill onto a second page. Rendering in
    // print media and widening the document back to its screen measure gets
    // the clean document at the width it was designed for.
    await page.emulateMediaType("print");
    const widthMm = 232;
    const wide = await page.addStyleTag({
      content: `
        .resume-page { width: ${widthMm}mm !important; font-size: 10.9px !important; min-height: 0 !important }
        .resume-paper-frame { width: ${widthMm}mm !important }
      `,
    });
    await new Promise((r) => setTimeout(r, 250));

    const heightMm = await page.evaluate((mmPerPx) => {
      const el = document.querySelector(".resume-page");
      // offsetHeight, not getBoundingClientRect — the latter reports the
      // post-transform box, and any residual fit-to-viewport scale would
      // under-measure the page and clip the last section.
      return Math.ceil(el.offsetHeight * mmPerPx) + 2;
    }, MM_PER_PX);

    // paperWidth/paperHeight alone is NOT enough: globals.css declares
    // `@page { size: A4 }` and that is what drives pagination, so a taller
    // sheet still fragments. The size has to be overridden in CSS and Chrome
    // told to prefer it.
    const sized = await page.addStyleTag({
      content: `@page { size: ${widthMm}mm ${heightMm}mm; margin: 0 }`,
    });
    await page.pdf({
      path: path.join(OUT, "resume.pdf"),
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    });
    await sized.evaluate((el) => el.remove());
    await wide.evaluate((el) => el.remove());
    log(`resume.pdf        ${widthMm} × ${heightMm} mm, continuous`);

    /* ---------------- 2. real A4, via the existing print CSS ------------ */
    await new Promise((r) => setTimeout(r, 250));
    await page.pdf({
      path: path.join(OUT, "resume-a4.pdf"),
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    });
    log("resume-a4.pdf     A4, paginated");

    // Recorded so a prebuild check can tell whether the committed PDFs still
    // match the derived figures on the live page.
    const years = await page.evaluate(() => {
      const m = document.body.innerText.match(/(\d+)\+\s*years/i);
      return m ? `${m[1]}+ years` : null;
    });
    // The hash of the files this PDF was rendered from. check-resume-pdf-fresh
    // recomputes it during prebuild, so editing the résumé without
    // regenerating now fails the build instead of quietly shipping a download
    // that disagrees with the page it sits on.
    const sourceHash = await resumeSourceHash();
    await mkdir(OUT, { recursive: true });
    await writeFile(
      path.join(OUT, "resume.meta.json"),
      `${JSON.stringify({ yearsPhrase: years, widthMm, heightMm, sourceHash }, null, 2)}\n`,
    );
    log(`meta              yearsPhrase=${years} · source ${sourceHash}`);
  } finally {
    await browser.close();
    if (server) server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
