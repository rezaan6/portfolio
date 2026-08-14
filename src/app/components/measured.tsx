"use client";

import { useCallback, useId, useRef } from "react";

import {
  KIND_LABEL,
  MEASUREMENTS,
  type Measurement,
  type MeasurementId,
} from "../lib/measurement";

/* ------------------------------------------------------------------ *
 * "How this figure was measured" — an ⓘ that opens on hover and on tap.
 *
 * Hover is the convention and it is genuinely quicker, so hover and
 * keyboard focus both open it. But hover alone is not enough: there is
 * no hover on a phone, so a hover-only tooltip is simply unreachable on
 * touch. Click therefore toggles it too, which costs nothing on desktop
 * and is the only way in on mobile.
 *
 * WCAG 1.4.13 (Content on Hover or Focus) asks for three things once you
 * open on hover, and all three are handled here:
 *   hoverable  — a short close delay, cancelled if the pointer enters
 *                the panel, so you can move onto it to read or select
 *   dismissible — Esc, free from the Popover API
 *   persistent  — it stays until you leave or dismiss it; nothing on a
 *                timer
 *
 * Anchored to the icon via CSS Anchor Positioning where supported, so it
 * reads as a tooltip attached to the number rather than a dialog. Where
 * it isn't, it centres — degraded, still legible, still dismissible.
 *
 * Popover means the panel lives in the top layer: it cannot be clipped
 * by an ancestor's overflow, cannot be fought over with z-index, and
 * cannot shift a pixel of layout. That last one matters on a site that
 * already had one CLS regression from animating a layout property.
 * ------------------------------------------------------------------ */

type Pop = HTMLDivElement & {
  showPopover?: () => void;
  hidePopover?: () => void;
};

export function Measured({
  id,
  className = "",
}: {
  id: MeasurementId;
  className?: string;
}) {
  const raw = useId();
  // Stripped to alphanumerics because this id becomes a CSS custom ident (the
  // anchor name below), and useId's output format is not a public contract —
  // React 19 changed it from the React 18 colon form (":r0:", which is invalid
  // in an ident) to an underscore form. Underscores happen to be legal, so this
  // strip is currently belt-and-braces; it stays because the next format change
  // would otherwise break anchor positioning silently rather than loudly.
  const key = `m${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const panelRef = useRef<Pop | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Widened deliberately. MEASUREMENTS uses `satisfies`, which keeps each
  // entry's literal type — so entries without a `limit` genuinely don't have
  // the property and reading it is an error. The map needs the strict keys; a
  // consumer only needs the shared shape.
  const m: Measurement | undefined = MEASUREMENTS[id];

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const open = useCallback(() => {
    cancelClose();
    try {
      panelRef.current?.showPopover?.();
    } catch {
      /* already open, or popover unsupported */
    }
  }, [cancelClose]);

  // The delay is the "hoverable" half of 1.4.13 — long enough to cross the gap
  // between the icon and the panel without it vanishing under the pointer.
  const closeSoon = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      try {
        panelRef.current?.hidePopover?.();
      } catch {
        /* already closed */
      }
    }, 220);
  }, [cancelClose]);

  if (!m) return null;

  return (
    <>
      <button
        type="button"
        aria-label="How this figure was measured"
        // No popovertarget attribute. The browser's built-in behaviour for it is
        // *toggle*, which fights the hover handler: the pointer arriving opens
        // the panel, then the click toggles it shut, so a tap on desktop looked
        // like nothing happened. Click is handled here and always opens rather
        // than toggling — closing is the pointer leaving, Esc, or popover's own
        // light-dismiss when you click elsewhere.
        onClick={open}
        // Guarded on pointerType so a tap doesn't fire the hover path first and
        // then race the click. Touch gets click only; a mouse gets both.
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") open();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") closeSoon();
        }}
        onFocus={open}
        onBlur={closeSoon}
        style={{ anchorName: `--${key}` } as React.CSSProperties}
        className={[
          "relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
          "border border-current align-middle text-[9px] font-semibold leading-none",
          "text-[var(--sr-faint)] transition-colors",
          "hover:text-[var(--sr-accent)] focus-visible:text-[var(--sr-accent)]",
          // 28px hit area, not 44. Since hover now opens the panel, an oversized
          // invisible target means it opens when the pointer is nowhere near the
          // icon — which reads as the thing being twitchy. 28 still clears the
          // 24px WCAG 2.5.8 minimum for tapping.
          "after:absolute after:left-1/2 after:top-1/2 after:h-7 after:w-7",
          "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
          "print:hidden",
          className,
        ].join(" ")}
      >
        <span aria-hidden="true">i</span>
      </button>

      <div
        ref={panelRef}
        id={key}
        popover="auto"
        onMouseEnter={cancelClose}
        onMouseLeave={closeSoon}
        style={
          {
            positionAnchor: `--${key}`,
            positionArea: "block-end span-inline-start",
            positionTryFallbacks: "flip-block, flip-inline, flip-block flip-inline",
            marginBlockStart: "0.5rem",
          } as React.CSSProperties
        }
        className={[
          // Tooltip proportions, not dialog: narrower measure, tighter padding,
          // and no backdrop — a backdrop on hover would dim the page every time
          // the pointer crossed an icon.
          "w-[min(22rem,calc(100vw-2rem))] rounded-xl border p-3.5",
          "border-[var(--sr-hairline)] bg-[var(--sr-panel)] text-left shadow-xl",
          // Centred fallback where anchor positioning isn't supported.
          "[position-area:none] supports-[position-area:block-end]:m-0 m-auto",
          "print:hidden",
        ].join(" ")}
      >
        <p className="font-[family-name:var(--font-display)] text-[9.5px] uppercase tracking-[0.16em] text-[var(--sr-accent)]">
          {KIND_LABEL[m.kind]}
        </p>
        <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[var(--sr-text)]">{m.basis}</p>
        {m.limit ? (
          <p className="mt-2 border-t border-[var(--sr-hairline)] pt-2 text-[11.5px] leading-[1.55] text-[var(--sr-muted)]">
            {m.limit}
          </p>
        ) : null}
      </div>
    </>
  );
}
