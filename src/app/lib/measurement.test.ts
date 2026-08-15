import { describe, expect, it } from "vitest";

import { KIND_LABEL, MEASUREMENTS, type Kind } from "./measurement";

/* ------------------------------------------------------------------ *
 * The site's central promise is that no figure appears without a stated
 * basis, and that a limit is stated before anyone has to ask. That is an
 * editorial rule, and an editorial rule with no check is a preference —
 * which is a line the artifacts themselves take.
 *
 * So these assert the rule rather than the current wording. Adding a new
 * figure without a basis, or a reading without its limit, fails here.
 * ------------------------------------------------------------------ */

const entries = Object.entries(MEASUREMENTS) as [string, (typeof MEASUREMENTS)[keyof typeof MEASUREMENTS]][];

describe("every figure", () => {
  it("exists", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)("%s states a basis", (_id, m) => {
    expect(m.basis.trim().length).toBeGreaterThan(20);
  });

  it.each(entries)("%s has a kind with a label", (_id, m) => {
    expect(Object.keys(KIND_LABEL)).toContain(m.kind);
    expect(KIND_LABEL[m.kind as Kind].length).toBeGreaterThan(0);
  });

  it.each(entries)("%s has a non-empty value", (_id, m) => {
    expect(m.value.trim().length).toBeGreaterThan(0);
  });
});

describe("claims that are not counts carry their limit", () => {
  // A count is checkable against a repo and needs no caveat. A reading depends
  // on conditions and an estimate is a judgement — both are unfalsifiable
  // without one, which is the failure mode this module exists to prevent.
  const needsLimit = entries.filter(([, m]) => m.kind === "reading" || m.kind === "estimate");

  it("there is at least one such figure to check", () => {
    expect(needsLimit.length).toBeGreaterThan(0);
  });

  it.each(needsLimit)("%s states where it stops", (_id, m) => {
    expect("limit" in m && (m as { limit?: string }).limit).toBeTruthy();
  });
});

describe("precision is never overstated", () => {
  // "~40%" claims an approximation; "40%" claims a measurement. The transform
  // that renders these into prose once stripped the tilde on four surfaces,
  // turning an approximate reading into a precise-sounding one.
  const approximate = entries.filter(([, m]) => /^[~−+]/.test(m.value));

  it("approximate figures keep their qualifier", () => {
    expect(approximate.length).toBeGreaterThan(0);
    for (const [id, m] of approximate) {
      expect(m.value, `${id} lost its sign or tilde`).toMatch(/^[~−+]/);
    }
  });

  it("no figure states a decimal it could not have measured", () => {
    for (const [id, m] of entries) {
      expect(m.value, `${id} claims decimal precision`).not.toMatch(/\d\.\d/);
    }
  });
});
