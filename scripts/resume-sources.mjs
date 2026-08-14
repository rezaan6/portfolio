/* ------------------------------------------------------------------ *
 * The files whose content the committed résumé PDFs are derived from,
 * and a hash of them.
 *
 * Shared by the generator (which records the hash) and the prebuild
 * check (which recomputes it). Kept in one module so the two can never
 * disagree about what counts as a source.
 *
 * Content hash rather than file mtimes on purpose: git does not preserve
 * mtimes, so in a fresh clone — which is exactly what the build server
 * has — every file looks like it was modified at checkout time and an
 * mtime comparison is meaningless. A hash of the bytes is the same in
 * every clone.
 * ------------------------------------------------------------------ */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

/** Edit any of these and the committed PDFs are out of date. */
export const RESUME_SOURCES = [
  "src/app/resume/resume-client.tsx", // the résumé itself
  "src/app/lib/measurement.ts", // every figure it prints
  "src/app/lib/experience.ts", // the derived years phrase
];

export async function resumeSourceHash() {
  const h = createHash("sha256");
  for (const rel of RESUME_SOURCES) {
    // The path goes in too, so moving a file is also a change.
    h.update(rel);
    h.update(await readFile(path.join(ROOT, rel)));
  }
  return h.digest("hex").slice(0, 16);
}
