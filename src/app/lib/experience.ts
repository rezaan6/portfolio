/* ------------------------------------------------------------------ *
 * Years of experience, derived rather than hardcoded.
 *
 * A portfolio outlives the day it was written. A literal "7+ years" is
 * correct for about twelve months and quietly wrong forever after, and
 * the one number a reader can trivially check against the dates further
 * down the page is a bad one to get wrong.
 *
 * Rounding rule: always floor, then append "+".
 *
 *   7y 0m … 7y 11m  →  "7+ years"
 *   8y 0m           →  "8+ years"
 *
 * Floor-and-plus is the CV convention and it can never overstate: an
 * interviewer doing the arithmetic from the role dates will always find
 * the claim conservative. "Almost 8 years" would be more precise and
 * strictly worse — it reads as hedging, and it invites the reader to
 * round down to seven anyway.
 * ------------------------------------------------------------------ */

/** First professional role — RaSoft, Frontend Engineer Intern. */
export const CAREER_START = new Date("2018-12-01T00:00:00Z");

/** Whole years since CAREER_START, floored. */
export function yearsOfExperience(now: Date = new Date()): number {
  let years = now.getUTCFullYear() - CAREER_START.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - CAREER_START.getUTCMonth();
  // Not yet reached the anniversary month (or reached it but not the day).
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < CAREER_START.getUTCDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

/** e.g. `7+` — the number and its qualifier, without the noun. */
export function yearsLabel(now?: Date): string {
  return `${yearsOfExperience(now)}+`;
}

/** e.g. `7+ years` */
export function yearsPhrase(now?: Date): string {
  return `${yearsLabel(now)} years`;
}
