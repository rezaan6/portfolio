import { describe, expect, it } from "vitest";

import { CAREER_START, yearsLabel, yearsOfExperience, yearsPhrase } from "./experience";

/* ------------------------------------------------------------------ *
 * The years figure is the one number on this site a reader can check
 * against the role dates further down the page, so it is the worst one
 * to get wrong. It is also date maths, which is where off-by-one lives.
 *
 * `now` is injected rather than mocked: the function takes a Date for
 * exactly this reason, so these run identically in any timezone and on
 * any day, forever. A test that passes only today is not a test.
 * ------------------------------------------------------------------ */

const at = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("yearsOfExperience", () => {
  it("is zero on the first day", () => {
    expect(yearsOfExperience(CAREER_START)).toBe(0);
  });

  it("increments on the anniversary, not before it", () => {
    // CAREER_START is 2018-12-01.
    expect(yearsOfExperience(at("2019-11-30"))).toBe(0);
    expect(yearsOfExperience(at("2019-12-01"))).toBe(1);
  });

  it("does not increment in the anniversary month before the day", () => {
    // The month matches but the day has not arrived — the case a naive
    // year-subtraction gets wrong.
    expect(yearsOfExperience(at("2024-12-01"))).toBe(6);
    expect(new Date("2024-11-30T12:00:00Z").getUTCMonth()).toBe(10);
    expect(yearsOfExperience(at("2024-11-30"))).toBe(5);
  });

  it("floors rather than rounds, so it can never overstate", () => {
    // Eleven months in is still the lower year. Rounding here would let the
    // résumé claim a year that the role dates do not support.
    expect(yearsOfExperience(at("2025-11-30"))).toBe(6);
    expect(yearsOfExperience(at("2025-12-01"))).toBe(7);
  });

  it("never returns a negative for a date before the start", () => {
    expect(yearsOfExperience(at("2015-01-01"))).toBe(0);
  });

  it("formats as a floor with a plus, never a decimal", () => {
    expect(yearsLabel(at("2026-08-15"))).toBe("7+");
    expect(yearsPhrase(at("2026-08-15"))).toBe("7+ years");
    expect(yearsPhrase(at("2026-08-15"))).not.toMatch(/\./);
  });
});
