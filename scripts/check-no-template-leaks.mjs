#!/usr/bin/env node
/* ------------------------------------------------------------------ *
 * Build guard: no raw ${...} may reach a reader.
 *
 * The content files are full of template literals that interpolate
 * figures from lib/measurement, which is what keeps one number in one
 * place. The failure mode is quiet and specific: an editing pass adds
 * an interpolation to a string that is still double-quoted, and
 * "${MEASUREMENTS.coverage.value}" then renders to the page verbatim.
 *
 * That shipped. Three of them were live — on /method, on the artifacts
 * grid, and inside the TEST STRATEGY document — and neither typecheck
 * nor lint nor a build has any opinion about it, because a string
 * containing a dollar sign is perfectly valid code. Only reading the
 * output catches it.
 *
 * A source-level grep is the cheap version of that check and it runs in
 * milliseconds, so it belongs in prebuild rather than in a browser.
 * ------------------------------------------------------------------ */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(import.meta.dirname, "..", "src");

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

// A double-quoted or single-quoted string containing an interpolation. Template
// literals are fine by definition, so they're excluded by requiring the quote.
const LEAK = /(["'])(?:[^"'\\\n]|\\.)*?\$\{/;

const offenders = [];
// Test files are not shipped to a reader, and they legitimately quote the very
// pattern this guard looks for in order to describe it.
const shipped = (f) => /\.(tsx?|jsx?)$/.test(f) && !/\.test\.(tsx?|jsx?)$/.test(f);

for (const file of walk(ROOT).filter(shipped)) {
  let inBlock = false;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      // Comments are not rendered, and they discuss this pattern by name. Track
      // block comments across lines rather than testing the first characters —
      // a continuation line inside one starts with ordinary prose.
      const t = line.trim();
      const opens = t.includes("/*");
      const closes = t.includes("*/");
      const wasInBlock = inBlock;
      if (opens && !closes) inBlock = true;
      else if (closes) inBlock = false;
      if (wasInBlock || opens || t.startsWith("//")) return;
      // a line that also contains a backtick is almost certainly a real template
      // literal with a quoted substring inside it — not a leak
      if (line.includes("`")) return;
      if (LEAK.test(line)) {
        offenders.push(`${path.relative(ROOT, file)}:${i + 1}  ${line.trim().slice(0, 110)}`);
      }
    });
}

if (offenders.length) {
  console.error(
    `\n  ✗ ${offenders.length} quoted string(s) contain \${...} and will render verbatim:\n`,
  );
  offenders.forEach((o) => console.error(`    ${o}`));
  console.error("\n  Convert the string to a template literal (backticks).\n");
  process.exit(1);
}

console.log("  ✓ no template-literal leaks");
