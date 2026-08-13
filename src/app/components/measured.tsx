"use client";

import { useId } from "react";

import {
  KIND_LABEL,
  MEASUREMENTS,
  type Measurement,
  type MeasurementId,
} from "../lib/measurement";

/* ------------------------------------------------------------------ *
 * "How this was measured" — a disclosure, not a tooltip.
 *
 * Deliberately opens on click, never on hover. Hover-only affordances
 * fail keyboard users and touch outright, and WCAG 2.1.3 then demands
 * the panel be hoverable, dismissible and persistent — three behaviours
 * to hand-build and get wrong. A button that toggles a panel has all of
 * that from the platform, and makes the touch interaction identical to
 * the desktop one instead of a second code path.
 *
 * Built on the native Popover API so the panel renders in the top
 * layer: it cannot be clipped by an ancestor's overflow, cannot be
 * fought over with z-index, and cannot shift a single pixel of layout.
 * That last one matters here — this site had a CLS regression from
 * animating a layout property, and a panel that reserved space or
 * pushed content would reintroduce exactly that.
 *
 * Esc, light-dismiss and one-open-at-a-time come free with popover.
 * Where it isn't supported the button degrades to an inert marker; the
 * same text is in the résumé's printed endnotes, so nothing is lost.
 * ------------------------------------------------------------------ */

export function Measured({
  id,
  className = "",
}: {
  id: MeasurementId;
  className?: string;
}) {
  const panelId = useId();
  // Widened deliberately. MEASUREMENTS uses `satisfies`, which keeps each
  // entry's literal type — so entries without a `limit` genuinely don't have
  // the property and reading it is an error. The map is what needs the strict
  // keys; a consumer only needs the shared shape.
  const m: Measurement | undefined = MEASUREMENTS[id];
  if (!m) return null;

  return (
    <>
      <button
        type="button"
        // @ts-expect-error — popovertarget is valid HTML the React types lag on
        popovertarget={panelId}
        aria-label="How this was measured"
        className={[
          // A quiet dotted underline rather than an ⓘ glyph beside the numeral.
          // An icon next to display type competes with the figure; an underline
          // on the label reads as "there is more here" without shouting.
          "relative inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em]",
          "text-[var(--sr-faint)] underline decoration-dotted decoration-from-font underline-offset-4",
          "transition hover:text-[var(--sr-accent)] focus-visible:text-[var(--sr-accent)]",
          // 44px touch target via a pseudo-element, so the hit area grows
          // without the button occupying 44px of layout.
          "after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-[calc(100%+1rem)]",
          "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
          "print:hidden",
          className,
        ].join(" ")}
      >
        How this was measured
      </button>

      <div
        id={panelId}
        popover="auto"
        className={[
          "m-auto w-[min(30rem,calc(100vw-2rem))] rounded-2xl border p-5",
          "border-[var(--sr-hairline)] bg-[var(--sr-panel)] text-left shadow-2xl",
          "backdrop:bg-black/40 print:hidden",
        ].join(" ")}
      >
        <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--sr-accent)]">
          {KIND_LABEL[m.kind]}
        </p>
        <p className="mt-2.5 text-[13.5px] leading-6 text-[var(--sr-text)]">{m.basis}</p>
        {m.limit ? (
          <p className="mt-3 border-t border-[var(--sr-hairline)] pt-3 text-[12.5px] leading-6 text-[var(--sr-muted)]">
            {m.limit}
          </p>
        ) : null}
        <button
          type="button"
          // @ts-expect-error — popovertargetaction is valid HTML the React types lag on
          popovertarget={panelId}
          popovertargetaction="hide"
          className="mt-4 rounded-full border border-[var(--sr-hairline)] px-3 py-1 font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.12em] text-[var(--sr-muted)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
        >
          Close
        </button>
      </div>
    </>
  );
}
