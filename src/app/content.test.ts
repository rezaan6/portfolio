import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ARTIFACT_DOCS } from "./components/artifact-docs";
import { artifacts, caseStudies, projects, tools } from "./components/signal-room-data";
import { clientSites } from "./lib/clients";
import { webCaseStudies } from "./components/web-data";
import { MEASUREMENTS } from "./lib/measurement";

/* ------------------------------------------------------------------ *
 * The rules this site holds itself to, asserted.
 *
 * These are not unit tests of behaviour — there is barely any behaviour
 * here, the site is data and layout. They are the editorial rules that
 * have actually been broken during this build, encoded so that breaking
 * them again fails a command rather than surviving to production:
 *
 *   - an artifact type with no structured document shipped 18KB of dead
 *     duplicate text on every route behind a branch that could not run
 *   - a figure hardcoded in prose drifted from the module twice
 *   - a version number in a chip is a second copy of package.json
 *
 * Each of those was found by reading output, late. A test is cheaper.
 * ------------------------------------------------------------------ */

const SRC = path.join(import.meta.dirname, "..");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((e) => {
    const full = path.join(dir, e);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const sourceFiles = walk(SRC).filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f));
const read = (f: string) => readFileSync(f, "utf8");
const rel = (f: string) => path.relative(SRC, f);

/**
 * Lines that are not comments — these rules are about what a reader sees, and
 * this source is heavily commented.
 *
 * Tracks block comments across lines rather than testing each line's opening
 * characters. A continuation line inside a block comment starts with ordinary
 * prose, so the naive version flagged two comments that *discuss* figures as
 * though they were hardcoded content. A check that reports things which are
 * fine is worse than no check: it teaches you to skip the output.
 */
const contentLines = (f: string) => {
  const out: { line: string; n: number }[] = [];
  let inBlock = false;
  read(f)
    .split("\n")
    .forEach((line, i) => {
      const t = line.trim();
      const opens = t.includes("/*");
      const closes = t.includes("*/");
      const wasInBlock = inBlock;
      if (opens && !closes) inBlock = true;
      else if (closes) inBlock = false;
      if (wasInBlock || opens) return;
      if (!t || t.startsWith("//")) return;
      out.push({ line, n: i + 1 });
    });
  return out;
};

describe("every artifact can render", () => {
  it("has a structured document for its type", () => {
    // The renderer has no fallback: a type without an entry renders nothing.
    for (const a of artifacts) {
      expect(ARTIFACT_DOCS[a.type], `no ARTIFACT_DOCS entry for "${a.type}"`).toBeTruthy();
    }
  });

  it("has no orphaned documents nothing links to", () => {
    const used = new Set(artifacts.map((a) => a.type));
    for (const key of Object.keys(ARTIFACT_DOCS)) {
      expect(used.has(key), `ARTIFACT_DOCS["${key}"] is unreachable`).toBe(true);
    }
  });
});

describe("figures come from the module, never a copy", () => {
  it("every measurement id referenced in source exists", () => {
    const ids = new Set(Object.keys(MEASUREMENTS));
    for (const f of sourceFiles) {
      for (const m of read(f).matchAll(/MEASUREMENTS(?:\.([a-z-]+)|\["([a-z-]+)"\])/g)) {
        // Literal lookups only. MEASUREMENTS[r.m] is a dynamic read whose key
        // the compiler has already constrained to a MeasurementId.
        const id = m[1] ?? m[2];
        if (!id) continue;
        expect(ids.has(id), `${rel(f)} references MEASUREMENTS.${id}, which does not exist`).toBe(true);
      }
    }
  });

  it("no percentage is hardcoded in reader-facing content", () => {
    // prototype-data is fictional mock UI for the case-study device frames, and
    // its numbers are props of an imaginary product rather than his claims.
    const offenders: string[] = [];
    const exempt = /prototype-data|prototype\.tsx|lib\/measurement\.ts/;
    for (const f of sourceFiles.filter((f) => !exempt.test(f))) {
      for (const { line, n } of contentLines(f)) {
        if (line.includes("MEASUREMENTS")) continue;
        if (/[~+−-]\d{1,3}%/.test(line)) offenders.push(`${rel(f)}:${n}`);
      }
    }
    expect(offenders, `hardcode drifts from the module — use MEASUREMENTS`).toEqual([]);
  });
});

describe("standing editorial rules", () => {
  it("names no version number a reader would see", () => {
    // A version in a chip is a second copy of package.json: correct for one
    // release, quietly wrong after. Omitting it means a reader assumes current.
    const pattern = /\b(React|Next\.?js|TypeScript|Tailwind(?: CSS)?|Node|Vite|Webpack|Express)\s+v?\d+(\.\d+)*/;
    const offenders: string[] = [];
    for (const f of sourceFiles) {
      for (const { line, n } of contentLines(f)) {
        if (pattern.test(line)) offenders.push(`${rel(f)}:${n} — ${line.trim().slice(0, 70)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("leaks no template literal into a quoted string", () => {
    // "${MEASUREMENTS.coverage.value}" in a double-quoted string renders those
    // characters verbatim. It shipped, on the page whose subject is rigour.
    const leak = /(["'])(?:[^"'\\\n]|\\.)*?\$\{/;
    const offenders: string[] = [];
    for (const f of sourceFiles) {
      for (const { line, n } of contentLines(f)) {
        if (line.includes("`")) continue;
        if (leak.test(line)) offenders.push(`${rel(f)}:${n}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("content is complete", () => {
  it.each(caseStudies.map((c) => [c.slug, c] as const))("case study %s has its arc", (_slug, cs) => {
    for (const field of ["context", "decision", "tradeoff", "signal", "outcome", "detail"] as const) {
      expect(String(cs[field] ?? "").length, `${cs.slug} is missing ${field}`).toBeGreaterThan(20);
    }
  });

  it("every tool panel carries a decision, not just a name", () => {
    // A panel with no reasoning in it is worse than no panel.
    for (const t of tools) {
      expect(String(t.howIUse ?? "").length, `the ${t.name} panel says nothing`).toBeGreaterThan(120);
    }
  });

  it("every project states what it was for", () => {
    for (const p of projects) {
      expect(String(p.learned ?? "").length, `${p.slug} does not say what it was for`).toBeGreaterThan(20);
    }
  });
});

describe("client sites are checkable", () => {
  // /web is the one part of the site whose claims a reader can verify in a
  // click, so every site has to carry what that check needs — a live address and
  // a picture that matches it — and every case study has to point at sites that
  // exist. A partial site is never on the wall, so it must be in a case study
  // that says what the work was.
  const PUBLIC = path.join(SRC, "..", "public");
  const slugs = new Set(clientSites.map((s) => s.slug));

  it.each(webCaseStudies.map((c) => [c.slug, c] as const))("case study %s is complete and points at real sites", (_slug, cs) => {
    for (const site of [cs.image, ...cs.links]) expect(slugs.has(site), `${cs.slug} names unknown site ${site}`).toBe(true);
    expect(cs.situation.length, `${cs.slug} has no situation`).toBeGreaterThan(40);
    expect(cs.result.length, `${cs.slug} has no result`).toBeGreaterThan(40);
    expect(cs.did.length, `${cs.slug} says too little about what was done`).toBeGreaterThan(1);
  });

  it("puts every partial site inside a case study, since it is not on the wall", () => {
    const covered = new Set(webCaseStudies.flatMap((c) => [c.image, ...c.links]));
    for (const s of clientSites.filter((c) => c.scope === "partial")) {
      expect(covered.has(s.slug), `${s.slug} is partial but no case study describes it`).toBe(true);
    }
  });

  it.each(clientSites.map((s) => [s.slug, s] as const))("%s links a live site and shows it", (_slug, s) => {
    expect(s.url, `${s.slug} is not a bare https address`).toMatch(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/);
    expect(
      existsSync(path.join(PUBLIC, "clients", `${s.slug}.webp`)),
      `no screenshot for ${s.slug} — run npm run clients:shots -- ${s.slug}`,
    ).toBe(true);
  });

  it("has one entry per company", () => {
    expect(slugs.size).toBe(clientSites.length);
  });
});
