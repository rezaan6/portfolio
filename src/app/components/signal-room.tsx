"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import { flushSync } from "react-dom";

import {
  archetypeChips,
  artifacts,
  caseStudies,
  contact,
  methods,
  methodSteps,
  navLinks,
  principles,
  projects,
  timeline,
  tools,
} from "./signal-room-data";
import { Measured } from "./measured";
import { MEASUREMENTS, type MeasurementId } from "../lib/measurement";
import { yearsOfExperience, yearsPhrase } from "../lib/experience";
import { ArtifactDocView } from "./artifact-doc";
import { ARTIFACT_DOCS } from "./artifact-docs";

/* ------------------------------------------------------------------ *
 * Signal Room — software-engineering portfolio (dark/light editorial
 * dossier). Themed via CSS variables (--sr-*); navy signal accent.
 * Multi-page: shared shell (header/nav/footer) + route content.
 * ------------------------------------------------------------------ */

/* ------------------------------ theme ------------------------------ */

type Theme = "dark" | "light";

function useTheme(): [Theme, boolean, (fade?: boolean) => void] {
  const [theme, setTheme] = useState<Theme>("light");
  // `theming` is true only for the ~400ms around an actual toggle; the CSS
  // cross-fade is gated on it, so hover/press transitions keep their own timing.
  const [theming, setTheming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Light (clean product UI) is the intentional default; honor a prior choice.
    // Not wrapped in `theming`, so the initial correction never animates.
    const saved = window.localStorage.getItem("sr-theme") as Theme | null;
    if (saved === "dark" || saved === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage theme hydration; SSR default is "light" so this only corrects post-mount
      setTheme(saved);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // `fade` triggers the CSS colour cross-fade. When the View Transitions "ink
  // drop" runs, we pass fade=false so the two animations don't fight (the circle
  // reveal is the whole show); the cross-fade is the fallback for browsers
  // without View Transitions.
  const toggle = (fade = true) => {
    if (fade) {
      setTheming(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setTheming(false), 400);
    }
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("sr-theme", next);
      return next;
    });
  };

  return [theme, theming, toggle];
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: (e: ReactMouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="sr-tap flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--sr-hairline)] text-[var(--sr-muted)] hover:border-[var(--sr-accent)] hover:text-[var(--sr-text)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -120, opacity: 0, scale: 0.4 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 120, opacity: 0, scale: 0.4 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="flex"
        >
          {theme === "dark" ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* -------------------------- global overlays ------------------------ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "var(--sr-accent)",
      }}
      aria-hidden="true"
    />
  );
}

const paletteItems = [
  ...navLinks.map((l) => ({ label: l.label, hint: `Go · ${l.num}`, href: l.href })),
  { label: "Resume", hint: "Open", href: "/resume" },
  { label: "Email Rezaan", hint: "mailto", href: `mailto:${contact.email}` },
  { label: "LinkedIn", hint: "open", href: contact.linkedin },
  { label: "GitHub", hint: "open", href: contact.github },
];

function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
        document
          .querySelector<HTMLElement>("[data-sr-search]")
          ?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const results = paletteItems.filter((i) =>
    i.label.toLowerCase().includes(q.toLowerCase()),
  );

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    if (href.startsWith("http")) window.open(href, "_blank");
    else if (href.startsWith("mailto")) window.location.href = href;
    else router.push(href);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-[60] flex items-start justify-center bg-[var(--sr-scrim)] px-4 pt-[15vh]"
          onClick={() => {
            setOpen(false);
            document
              .querySelector<HTMLElement>("[data-sr-search]")
              ?.focus({ preventScroll: true });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Shared layoutId with the navbar search button — the panel morphs
              out of the button and back into it on open/close. */}
          <motion.div
            layoutId="sr-search"
            className="w-full max-w-xl overflow-hidden rounded-[18px] border border-[var(--sr-hairline)] bg-[var(--sr-panel)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.16 }}
            >
              {/* header: search icon + input + esc hint */}
              <div className="flex items-center gap-3 border-b border-[var(--sr-hairline)] px-4 py-3.5">
                <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--sr-faint)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M21 21l-4-4" />
                </svg>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && results[0]) go(results[0].href);
                  }}
                  aria-label="Search pages and links"
                  placeholder="Search pages, resume, links…"
                  className="sr-cmd-input flex-1 bg-transparent text-[15px] text-[var(--sr-text)] outline-none placeholder:text-[var(--sr-faint)]"
                />
                <kbd className="hidden shrink-0 rounded-md border border-[var(--sr-hairline)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--sr-faint)] sm:block">
                  esc
                </kbd>
              </div>

              {/* results — each with a type icon + a keyboard cue on hover */}
              <div className="max-h-80 overflow-y-auto p-2">
                {results.length ? (
                  results.map((r) => {
                    const ext = r.href.startsWith("http") || r.href.startsWith("mailto");
                    return (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => go(r.href)}
                        aria-label={r.href.startsWith("mailto") ? `${r.label} (opens email client)` : r.href.startsWith("http") ? `${r.label} (opens in new tab)` : r.label}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--sr-accent-soft)]"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--sr-bg-alt)] text-[var(--sr-muted)] transition group-hover:bg-[var(--sr-panel)] group-hover:text-[var(--sr-accent)]">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {ext ? (
                              <>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <path d="M15 3h6v6M10 14L21 3" />
                              </>
                            ) : (
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            )}
                          </svg>
                        </span>
                        <span className="flex-1 text-[14px] font-medium text-[var(--sr-text)]">
                          {r.label}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[9.5px] uppercase tracking-[0.12em] text-[var(--sr-faint)]">
                          {r.hint}
                        </span>
                        <span aria-hidden="true" className="text-[13px] text-[var(--sr-accent)] opacity-0 transition group-hover:opacity-100">
                          ↵
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="px-4 py-8 text-center text-[13px] text-[var(--sr-faint)]">
                    No matches for &ldquo;{q}&rdquo;
                  </p>
                )}
              </div>

              {/* footer: keyboard hints */}
              <div className="flex items-center gap-4 border-t border-[var(--sr-hairline)] px-4 py-2.5 font-[family-name:var(--font-display)] text-[9.5px] uppercase tracking-[0.14em] text-[var(--sr-faint)]">
                <span>↵ Open</span>
                <span>Esc Close</span>
                <span className="ml-auto">⌘K</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------ shell ------------------------------ */

export function SiteFrame({ children }: { children: ReactNode }) {
  const [theme, theming, toggle] = useTheme();
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Theme toggle plays an "ink drop": the new theme is revealed by a circle that
  // grows out of the toggle icon itself and slowly floods the page — like paint
  // spreading from the point you pressed. Driven by the View Transitions API so
  // the whole page (chrome included) reveals as one snapshot. Browsers without
  // it (Firefox/Safari) fall back to the CSS colour cross-fade.
  const handleToggle = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (reduce) { toggle(true); return; }
    const btn = e.currentTarget;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (typeof doc.startViewTransition !== "function") {
      toggle(true);
      return;
    }
    // Origin is the pointer, not the button's box. The button carries `sr-tap`,
    // which applies `translateY(-1px) scale(1.12)` on hover — and on the first
    // interaction after a page load that transform is still settling when the
    // click lands, so getBoundingClientRect() reports a box mid-animation and
    // the circle starts somewhere other than under the cursor. clientX/clientY
    // is exactly where the press happened and can't be wrong.
    //
    // Keyboard activation reports 0,0, so fall back to the button's centre
    // there — and guard on `detail`, which is 0 for Enter/Space and non-zero
    // for a real pointer, rather than trusting a coordinate that could
    // legitimately be near the origin.
    const rect = btn.getBoundingClientRect();
    const fromPointer = e.detail > 0 && (e.clientX !== 0 || e.clientY !== 0);
    const x = fromPointer ? e.clientX : rect.left + rect.width / 2;
    const y = fromPointer ? e.clientY : rect.top + rect.height / 2;

    // Distance to the farthest corner, then 6% more. Without the overshoot the
    // circle lands exactly on the corner pixel and the easing spends its final
    // frames covering almost nothing — so the last sliver arrives when the
    // pseudo-element is torn down rather than when the circle reaches it, which
    // reads as the reveal snapping shut at the end. The snapshot can also be a
    // scrollbar-width wider than innerWidth, which leaves a real strip behind.
    const radius =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) * 1.06;

    const transition = doc.startViewTransition(() =>
      flushSync(() => toggle(false)),
    );
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${Math.ceil(radius)}px at ${x}px ${y}px)`,
            ],
          },
          {
            // Deliberately near-linear. The eye tracks the leading edge of the
            // circle, so an ease-out curve brings it almost to a stop well
            // before the animation ends — the old curve covered 98% of the
            // radius in the first 80% of the time, leaving a final stretch
            // where nothing visibly moved and the reveal appeared to snap shut.
            // A constant edge speed is what actually reads as paint flooding
            // outwards; the slight ease-in only softens the start off the tap.
            duration: 820,
            easing: "cubic-bezier(0.25, 0.1, 0.5, 0.9)",
            // Holds the final frame until the browser removes the pseudo-element.
            // Without it the clip-path reverts the instant the animation ends,
            // and the handoff to the real DOM is a visible pop.
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  };

  // The resume renders its own document shell — no site chrome there.
  if (pathname.startsWith("/resume")) {
    return <>{children}</>;
  }

  return (
    <div
      className="signal-room min-h-screen"
      data-theme={theme}
      {...(theming ? { "data-theming": "" } : {})}
    >
      <a href="#main" className="sr-skip-link">Skip to content</a>
      <ScrollProgress />
      <CommandPalette open={cmdkOpen} setOpen={setCmdkOpen} />
      {/* Website header — sticky to the top. */}
      <div className="sticky top-0 z-40">
        <header
          className="border-b border-[var(--sr-hairline)] backdrop-blur-xl"
          style={{ background: "color-mix(in srgb, var(--sr-panel) 78%, transparent)" }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 lg:px-8">
            <nav className="hidden items-center gap-2 lg:flex">
              {navLinks.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-3.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                      active
                        ? "text-[var(--sr-accent)]"
                        : "text-[var(--sr-muted)] hover:bg-[var(--sr-bg-alt)] hover:text-[var(--sr-text)]"
                    }`}
                  >
                    {/* Active pill — pops in on the active link (per-link, no shared
                        layoutId) so route changes never cause a vertical jump. */}
                    {active ? (
                      <motion.span
                        aria-hidden="true"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 17 }}
                        className="absolute inset-0 rounded-full bg-[var(--sr-accent-soft)]"
                      />
                    ) : null}
                    <span className="relative z-10">
                      <span className={active ? "text-[var(--sr-accent)]" : "text-[var(--sr-faint)]"}>{link.num}</span> {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="ml-auto flex items-center gap-2 lg:gap-3">
              {/* Search — the palette morphs out of this button (shared layoutId);
                  an invisible placeholder holds the slot while it's open. */}
              {cmdkOpen ? (
                <span
                  aria-hidden="true"
                  className="flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 text-[11px] opacity-0"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" />
                  </svg>
                  <span className="hidden sm:inline">⌘K</span>
                </span>
              ) : (
                <motion.button
                  layoutId="sr-search"
                  type="button"
                  onClick={() => setCmdkOpen(true)}
                  data-sr-search
                  aria-label="Search ⌘K"
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-2.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] text-[var(--sr-muted)] hover:border-[var(--sr-accent)] hover:text-[var(--sr-text)]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="M21 21l-4-4" />
                  </svg>
                  <span aria-hidden="true" className="hidden sm:inline">⌘K</span>
                </motion.button>
              )}
              <ThemeToggle theme={theme} onToggle={handleToggle} />
              <Link
                href={contact.resume}
                className="rounded-full sr-cta px-4 py-1.5 text-[12px] font-semibold text-[var(--sr-accent-ink)]"
              >
                Resume
              </Link>
            </div>
          </div>
          {/* mobile nav row */}
          <nav className="flex items-center gap-2 overflow-x-auto border-t border-[var(--sr-hairline)] px-5 py-2 lg:hidden">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative shrink-0 rounded-full px-3 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                    active
                      ? "text-[var(--sr-accent)]"
                      : "text-[var(--sr-muted)] hover:bg-[var(--sr-bg-alt)] hover:text-[var(--sr-text)]"
                  }`}
                >
                  {active ? (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      className="absolute inset-0 rounded-full bg-[var(--sr-accent-soft)]"
                    />
                  ) : null}
                  <span className="relative z-10">
                    <span className={active ? "text-[var(--sr-accent)]" : "text-[var(--sr-faint)]"}>{link.num}</span> {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </header>
      </div>

      <main id="main">{children}</main>

      {/* The full contact section only appears on home and /about. This footer
          is what makes that safe — every other page still has a direct route
          to reach me, without repeating a whole section eight times. */}
      <footer className="border-t border-[var(--sr-hairline)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-9 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-[13px] font-medium text-[var(--sr-text)]">
              Mohammed Rezaan Riyaz
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.14em] text-[var(--sr-faint)]">
              Senior Frontend Engineer · Open to roles · UAE
            </p>
          </div>

          <nav aria-label="Contact" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: "Email", href: `mailto:${contact.email}` },
              { label: "LinkedIn", href: contact.linkedin },
              { label: "GitHub", href: contact.github },
              { label: "Resume", href: contact.resume },
            ].map((l) => {
              const external = l.href.startsWith("http");
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  // These four sit on every page and were 17px tall — under the 24px
                  // WCAG 2.5.8 minimum, and the "inline" exemption doesn't cover them
                  // because they're stacked blocks rather than links inside a sentence.
                  // The padding buys the height without moving the text, since the row
                  // is already taller than the type.
                  className="inline-flex min-h-6 items-center font-[family-name:var(--font-display)] text-[11.5px] uppercase tracking-[0.12em] text-[var(--sr-muted)] underline-offset-4 transition hover:text-[var(--sr-accent)] hover:underline"
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------- primitives ---------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 34, scale: 0.97 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-[family-name:var(--font-display)] text-[12px] font-medium tracking-[0.2em] text-[var(--sr-faint)]">
        —
      </span>
      <span className="font-[family-name:var(--font-display)] text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--sr-muted)]">
        {title}
      </span>
    </div>
  );
}

export function PageIntro({
  num,
  label,
  title,
  subtitle,
}: {
  num: string;
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="px-4 pt-6 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex min-h-[430px] flex-col justify-center overflow-hidden rounded-[1.8rem] border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-6 py-14 sm:px-12 sm:py-16 lg:px-14">
          {/* Decorative index number — spans the full section height on the
              right, blended into the background as a soft overlay (SVG so the
              faint watermark doesn't trip the contrast checker). */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto translate-x-[14%] select-none opacity-[0.06]"
            viewBox="0 0 210 100"
            preserveAspectRatio="xMaxYMid meet"
          >
            <text
              x="206"
              y="95"
              textAnchor="end"
              style={{
                fontFamily: "var(--font-numeral), Impact, sans-serif",
                fontSize: "150px",
                fontWeight: 600,
                fill: "var(--sr-accent)",
                transform: "scaleY(1.12)",
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              {num}
            </text>
          </svg>
          <div className="relative">
            <Reveal>
              {/* Label only. The number is already the watermark filling the
                  right of this panel, and the nav above it reads "04 Stack" —
                  printing it a third time in the eyebrow told the reader
                  nothing they hadn't been told twice. */}
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.3em] text-[var(--sr-accent)]">
                {label}
              </p>
              <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.9rem,3.6vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--sr-text)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-6 max-w-2xl text-[16px] leading-8 text-[var(--sr-muted)]">
                  {subtitle}
                </p>
              ) : null}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const springHover = { type: "spring" as const, stiffness: 450, damping: 30 };

// Accessible brand text: keep each case's hue but blend toward the theme's text
// colour so small brand-coloured labels clear WCAG AA on their light/dark tints.
// Fills, bars, borders, and logos keep the pure brand colour.
const brandInk = (brand: string) =>
  `color-mix(in srgb, ${brand}, var(--sr-text) 46%)`;

// Magnetic control — while hovered, it eases toward the cursor and springs back
// on leave, so the button clearly invites a click. Honors reduced-motion.
export function Magnetic({
  children,
  className,
  strength = 0.16,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [d, setD] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setD({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        });
      }}
      onMouseLeave={() => setD({ x: 0, y: 0 })}
      animate={{ x: d.x, y: d.y }}
      transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.5 }}
      className={`inline-flex ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

// Where each case's numbers actually come from — shown next to the bars so the
// percentages read as measured (or as a delivery count), never as invented.
const caseBarSource: Record<string, string> = {
  hobber:
    "Composition and boundary reads across the codebase I architected — a structural measure, not a performance one. The platform is 7 months in, so there is no before/after perf number to report yet.",
  axinom:
    "Load-time measured before/after the bundle, lazy-load, and caching work, plus the Mosaic micro-frontends integrated for client delivery.",
  kodez:
    `CI coverage reports and before/after load-time reads across ${MEASUREMENTS.releases.value} production releases.`,
  rasoft:
    "Reported internally at a seed-stage startup — an early-career read, not instrumented analytics.",
};

/* ------------------------ data-viz primitives ---------------------- */

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, { duration: 0.9, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, reduce, mv]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

function LogoMark({
  logo,
  mark,
  color,
  size = "h-11 w-11",
}: {
  logo?: string;
  mark: string;
  color?: string;
  size?: string;
}) {
  const c = color ?? "var(--sr-accent)";
  // Every logo sits centered on a white square, so all companies read
  // consistently (Hobber's disc, Axinom's hex, Kodez's tile) in one square shape.
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
        logo ? "bg-[var(--sr-panel)] ring-1 ring-[var(--sr-hairline)]" : ""
      }`}
      style={
        logo
          ? undefined
          : { background: `color-mix(in srgb, ${c} 16%, var(--sr-panel))` }
      }
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={26}
          height={26}
          unoptimized
          className="h-6 w-6 object-contain"
        />
      ) : (
        <span
          className="font-[family-name:var(--font-display)] text-[12px] font-semibold"
          style={{ color: c }}
        >
          {mark}
        </span>
      )}
    </span>
  );
}

/* ---------------------------- sections ----------------------------- */

export function EvidenceSection() {
  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="space-y-6">
          {caseStudies.map((cs, index) => {
            return (
              <Reveal key={cs.company} delay={0.04 * index}>
                <article className="relative overflow-hidden rounded-3xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)]">
                  {cs.brand ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-1"
                      style={{ background: cs.brand }}
                    />
                  ) : null}
                  {/* header */}
                  <div className="border-b border-[var(--sr-hairline)] p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className="rounded-full px-3 py-1 font-[family-name:var(--font-display)] text-[10px] font-medium uppercase tracking-[0.14em]"
                        style={{
                          backgroundColor: "var(--sr-bg-alt)",
                          color: "var(--sr-muted)",
                        }}
                      >
                        {cs.tag}
                      </span>

                      <span className="rounded-full border border-[var(--sr-hairline)] px-3 py-1 font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--sr-text)]">
                        {cs.metric}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <LogoMark logo={cs.logo} mark={cs.mark} color={cs.color} />
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-[18px] font-medium text-[var(--sr-text)]">
                          {cs.company}
                        </p>
                        <p className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.1em] text-[var(--sr-muted)]">
                          {cs.period} · {cs.domain}
                        </p>
                      </div>
                    </div>
                    <h2 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-[22px] font-medium leading-snug text-[var(--sr-text)]">
                      {cs.headline}
                    </h2>
                  </div>

                  {/* scannable summary */}
                  <div className="p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-3">
                      {[
                        ["Problem", cs.problem],
                        ["Move", cs.move],
                        ["Result", cs.result],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--sr-accent)]">
                            {label}
                          </p>
                          <p className="mt-2 text-[14px] leading-[1.55] text-[var(--sr-soft)]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Engineering evidence: the constraint, then a plain
                        results table. No dashboard bars — half of these are
                        counts, not percentages, and a bar would imply a
                        measurement that doesn't exist. */}
                    <div className="mt-6 grid gap-6 border-t border-[var(--sr-hairline)] pt-6 sm:grid-cols-[0.9fr_1.1fr]">
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--sr-faint)]">
                          Constraint
                        </p>
                        <p className="mt-3 text-[14px] leading-[1.6] text-[var(--sr-soft)]">
                          {cs.tradeoffShort}
                        </p>
                        {cs.stack?.length ? (
                          <ul className="mt-4 flex flex-wrap gap-1.5">
                            {cs.stack.slice(0, 6).map((s) => (
                              <li
                                key={s}
                                className="rounded-full px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10.5px]"
                                style={{
                                  background: `color-mix(in srgb, ${cs.color} 10%, transparent)`,
                                  color: brandInk(cs.color),
                                }}
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="sm:border-l sm:border-[var(--sr-hairline)] sm:pl-6">
                        <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--sr-faint)]">
                          Results
                        </p>
                        <dl className="mt-3 divide-y divide-[var(--sr-hairline)]">
                          {cs.results.map((r) => (
                            <div
                              key={r.label}
                              className="flex items-baseline justify-between gap-4 py-2 first:pt-0"
                            >
                              <dt className="text-[12.5px] leading-[1.45] text-[var(--sr-muted)]">
                                {r.label}
                                {r.note ? (
                                  <span className="block text-[10.5px] leading-4 text-[var(--sr-faint)]">
                                    {r.note}
                                  </span>
                                ) : null}
                              </dt>
                              <dd
                                className="shrink-0 font-[family-name:var(--font-display)] text-[15px] font-semibold tabular-nums"
                                style={{ color: brandInk(cs.color) }}
                              >
                                {/* Shared source wins where a row is tagged, so a
                                    figure can't say one thing here and another on
                                    the résumé. */}
                                <span className="inline-flex items-center gap-1.5">
                                  {r.m ? MEASUREMENTS[r.m].value : r.value}
                                  {r.m ? <Measured id={r.m} /> : null}
                                </span>
                              </dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mt-3 text-[10.5px] leading-4 text-[var(--sr-faint)]">
                          {caseBarSource[cs.slug] ?? "Before/after against a defined baseline."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Magnetic>
                      <Link
                        href={`/work/${cs.slug}`}
                        className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--sr-hairline)] px-4 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:bg-[var(--sr-accent-soft)] hover:text-[var(--sr-accent)]"
                      >
                        Read the full case study
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                      </Magnetic>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MethodSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Auto-advance the loop: the first move comes quickly (so it's obviously live
  // on load), then it settles into a steady cadence. Pause while hovering.
  useEffect(() => {
    if (reduce || paused) return;
    const tick = () => setActive((a) => (a + 1) % methodSteps.length);
    const first = setTimeout(tick, 1300);
    const id = setInterval(tick, 2800);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [reduce, paused]);

  // Node positions on the central ring — 12 / 3 / 6 / 9 o'clock.
  const nodePos = [
    { left: "50%", top: "6%" },
    { left: "94%", top: "50%" },
    { left: "50%", top: "94%" },
    { left: "6%", top: "50%" },
  ] as const;

  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.18em] text-[var(--sr-faint)]">
            Architect → Build → Harden → Measure
          </p>
          <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Each stage hands the next something concrete.
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[var(--sr-muted)]">
            Every case study runs through the same four stages, and each hands
            the next a concrete output — so the process is repeatable, not
            improvised.
          </p>
        </Reveal>

        {/* The loop — a live hub: the ring sits at the centre with each stage's
            card around it (top / right / bottom / left) by its node. */}
        <div
          className="mt-12 grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto] lg:items-center"
          onMouseLeave={() => setPaused(false)}
        >
          {/* central animated ring — centre cell on desktop, first on mobile */}
          <div className="flex justify-center lg:col-start-2 lg:row-start-2">
            <div className="relative aspect-square w-full max-w-[240px]">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle cx="100" cy="100" r="88" fill="none" stroke="var(--sr-hairline)" strokeWidth="1.5" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="var(--sr-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="5 28"
                  opacity="0.55"
                  style={{ transformOrigin: "center" }}
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </svg>
              <motion.span
                aria-hidden="true"
                className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--sr-accent)] ring-4 ring-[var(--sr-bg)]"
                animate={{ left: nodePos[active].left, top: nodePos[active].top }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
              />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center">
                <motion.svg
                  className="h-6 w-6 text-[var(--sr-accent)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transformOrigin: "center" }}
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                >
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <path d="M21 3v5h-5" />
                </motion.svg>
                <span className="font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--sr-faint)]">
                  The loop
                </span>
              </div>
              {methodSteps.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onMouseEnter={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-label={`Stage ${i + 1}: ${s.label}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={nodePos[i]}
                  >
                    <motion.span
                      animate={on && !reduce ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                      transition={on ? { duration: 1.6, repeat: Infinity } : { duration: 0.2 }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border font-[family-name:var(--font-display)] text-[12px] font-semibold transition-colors ${
                        on
                          ? "border-transparent bg-[var(--sr-accent-solid)] text-[var(--sr-accent-ink)] shadow-[0_8px_20px_-6px_var(--sr-accent)]"
                          : "border-[var(--sr-accent)] bg-[var(--sr-panel)] text-[var(--sr-accent)]"
                      }`}
                    >
                      {i + 1}
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* four stage cards — each placed around the ring by its node */}
          {methodSteps.map((s, i) => {
            const on = i === active;
            const place = [
              "lg:col-start-2 lg:row-start-1",
              "lg:col-start-3 lg:row-start-2",
              "lg:col-start-2 lg:row-start-3",
              "lg:col-start-1 lg:row-start-2",
            ][i];
            return (
              <Reveal key={s.label} delay={0.06 * i} className={`h-full ${place}`}>
                <motion.article
                  onMouseEnter={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  animate={{ scale: on && !reduce ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--sr-panel)] p-5 transition-colors ${
                    on
                      ? "border-[var(--sr-accent)] shadow-[0_12px_30px_-14px_var(--sr-accent)]"
                      : "border-[var(--sr-hairline)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 transition-opacity duration-300"
                    style={{ background: "var(--sr-accent-solid)", opacity: on ? 1 : 0 }}
                  />
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-[13px] font-semibold transition-colors ${
                        on
                          ? "bg-[var(--sr-accent-solid)] text-[var(--sr-accent-ink)]"
                          : "bg-[var(--sr-accent-soft)] text-[var(--sr-accent)]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sr-accent)]">
                      {s.label}
                    </span>
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-[15px] font-medium leading-snug text-[var(--sr-text)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-6 text-[var(--sr-soft)]">
                    {s.body}
                  </p>
                  <p className="mt-3 border-t border-[var(--sr-hairline)] pt-2.5 font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.12em] text-[var(--sr-faint)]">
                    Output — <span className="text-[var(--sr-accent)]">{s.artifact}</span>
                  </p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ArtifactsSection() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<(typeof artifacts)[number] | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Close the dialog and return focus to the button that opened it (a11y).
  const close = () => {
    setOpen(null);
    triggerRef.current?.focus({ preventScroll: true });
    triggerRef.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        triggerRef.current?.focus({ preventScroll: true });
        triggerRef.current = null;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openCs = open
    ? caseStudies.find((c) => c.company === open.company)
    : undefined;
  const openBrand = openCs?.brand ?? "var(--sr-accent)";

  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((artifact, index) => {
            const cs = caseStudies.find((c) => c.company === artifact.company);
            const brand = cs?.brand ?? "var(--sr-accent)";
            // min-w-0: a grid item defaults to min-width:auto and will not shrink
            // below its content, so this card rendered wider than its 350px track
            // at 390px and pushed the whole page sideways.
            return (
              <Reveal key={artifact.title} delay={0.03 * index} className="min-w-0">
                <div className="relative flex min-w-0 h-full flex-col overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6 transition hover:border-[var(--sr-accent)]">
                  {/* Every card gets a top accent — brand colour for a company
                      artifact, indigo for a general practice one. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-1"
                    style={{ background: brand }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-[family-name:var(--font-display)] text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--sr-accent)]">
                      {artifact.type}
                    </p>
                    {artifact.company && cs ? (
                      <span className="flex items-center gap-1.5">
                        <LogoMark
                          logo={cs.logo}
                          mark={cs.mark}
                          color={cs.color}
                          size="h-7 w-7"
                        />
                        <span className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--sr-soft)]">
                          {cs.company}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sr-accent-soft)] text-[var(--sr-accent)]">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                            <path d="M14 3v5h5M9 13h6M9 17h4" />
                          </svg>
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--sr-soft)]">
                          Practice
                        </span>
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-[18px] font-medium leading-snug text-[var(--sr-text)]">
                    {artifact.title}
                  </h2>
                  <p className="mt-3 flex-1 text-[13px] leading-6 text-[var(--sr-muted)]">
                    {artifact.blurb}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      triggerRef.current = e.currentTarget;
                      setOpen(artifact);
                    }}
                    className="mt-5 w-full rounded-full border border-[var(--sr-hairline)] px-4 py-2 text-center font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:bg-[var(--sr-accent-soft)] hover:text-[var(--sr-accent)]"
                  >
                    View sample →
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Sample preview — a roomy modal instead of a cramped inline block. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--sr-scrim)] p-4"
            onClick={() => close()}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} — sample`}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] shadow-2xl"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1"
                style={{ background: openBrand }}
              />
              <div className="flex items-start justify-between gap-4 border-b border-[var(--sr-hairline)] p-5">
                <div className="flex items-center gap-3">
                  {open.company && openCs ? (
                    <LogoMark
                      logo={openCs.logo}
                      mark={openCs.mark}
                      color={openCs.color}
                      size="h-9 w-9"
                    />
                  ) : null}
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--sr-accent)]">
                      {open.type}
                      {open.company ? ` · ${open.company}` : ""}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-[18px] font-medium leading-snug text-[var(--sr-text)]">
                      {open.title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => close()}
                  aria-label="Close preview"
                  className="shrink-0 rounded-full border border-[var(--sr-hairline)] p-2 text-[var(--sr-muted)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-text)]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="overflow-auto p-5">
                {ARTIFACT_DOCS[open.type] ? (
                  <ArtifactDocView doc={ARTIFACT_DOCS[open.type]} brand={openBrand} />
                ) : (
                  <pre className="whitespace-pre-wrap break-words rounded-xl border border-[var(--sr-hairline)] bg-[var(--sr-bg)] p-4 font-[family-name:var(--font-mono)] text-[11.5px] leading-[1.7] text-[var(--sr-soft)]">
                    {open.body}
                  </pre>
                )}
                <p className="mt-4 text-[12px] leading-6 text-[var(--sr-faint)]">
                  A working document from my own engineering practice. Client
                  code and data are kept out; the reasoning and structure are
                  mine.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------ About page ------------------------------ */

export function AboutHero() {
  return (
    <section className="px-4 pt-6 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex min-h-[430px] flex-col justify-center overflow-hidden rounded-[1.8rem] border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-6 py-12 sm:px-12 sm:py-14 lg:px-14">
          {/* Decorative index number — full-height watermark, matching the other
              pages (SVG so the faint overlay doesn't trip the contrast checker). */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto translate-x-[14%] select-none opacity-[0.06]"
            viewBox="0 0 210 100"
            preserveAspectRatio="xMaxYMid meet"
          >
            <text
              x="206"
              y="95"
              textAnchor="end"
              style={{
                fontFamily: "var(--font-numeral), Impact, sans-serif",
                fontSize: "150px",
                fontWeight: 600,
                fill: "var(--sr-accent)",
                transform: "scaleY(1.12)",
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              07
            </text>
          </svg>
          <div className="relative grid gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:items-center">
            <Reveal>
              {/* Label only, matching PageIntro — the 07 is already the
                  watermark behind this panel and the nav above it. */}
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.3em] text-[var(--sr-accent)]">
                About
              </p>
              <h1 className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(1.85rem,3.5vw,2.75rem)] font-medium leading-[1.06] tracking-[-0.01em] text-[var(--sr-text)]">
                I architect the system, not just the screen.
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-8 text-[var(--sr-muted)]">
                {yearsPhrase()} building accessible, high-performance web products —
                marketplace platforms, enterprise media, and CMS at scale. I
                draw the boundaries first, prove the work with tests, and let a
                measurement pick the next optimization.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "Senior Frontend Engineer",
                  "UAE · GCC",
                  "Sri Lankan",
                  "Open to relocation, onsite & remote",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-3 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-muted)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto w-full max-w-xs rounded-[1.6rem] border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6 text-center">
                <Image
                  src="/me.jpg"
                  alt="Mohammed Rezaan Riyaz"
                  width={192}
                  height={192}
                  priority
                  sizes="96px"
                  className="mx-auto h-24 w-24 rounded-[1.5rem] object-cover ring-1 ring-[var(--sr-hairline)]"
                />
                <p className="mt-4 font-[family-name:var(--font-display)] text-[17px] font-medium text-[var(--sr-text)]">
                  Mohammed Rezaan Riyaz
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--sr-muted)]">
                  Senior Frontend Engineer · UAE
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--sr-accent-soft)] px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--sr-accent)] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--sr-accent)]" />
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-accent)]">
                    Available for roles
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutStats() {
  // The counter animates a number, so it needs the digits separately from the
  // prefix and suffix — but the digits are parsed out of the shared source
  // rather than typed again, so these four cannot drift from the case tables
  // or the résumé. A fourth counter here once read "100M+ annual requests
  // served by frontends I've shipped"; nothing anywhere supported it, and the
  // largest figure on the page was the only one with no provenance at all.
  const digits = (id: MeasurementId) =>
    Number(MEASUREMENTS[id].value.replace(/[^0-9]/g, ""));
  const stats: {
    value: number; prefix: string; suffix: string; label: string; m: MeasurementId;
  }[] = [
    { value: yearsOfExperience(), prefix: "", suffix: "+", label: "Years of hands-on React in production", m: "experience" },
    { value: digits("releases"), prefix: "", suffix: "+", label: "Production releases delivered at Kodez", m: "releases" },
    { value: digits("coverage"), prefix: "~", suffix: "%", label: "Automated Cypress coverage on critical paths", m: "coverage" },
    { value: digits("tables"), prefix: "", suffix: "+", label: "SQL tables in the Kodez CMS schema", m: "tables" },
  ];
  return (
    <section className="px-4 pt-10 sm:px-5 lg:px-8 lg:pt-14">
      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={0.05 * i} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6">
              <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,2.8rem)] font-medium leading-none tracking-[-0.02em] text-[var(--sr-accent)]">
                <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-3 flex items-start gap-1.5 text-[13.5px] leading-6 text-[var(--sr-muted)]">
                <span>{s.label}</span>
                {/* Beside the label rather than the numeral — the counter here is
                    clamp(2rem, 4vw, 2.8rem), and a 14px icon next to type that
                    large reads as debris rather than an affordance. */}
                <Measured id={s.m} className="mt-1.5" />
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutBeyond() {
  const reduce = useReducedMotion();
  const hoverLift = reduce ? undefined : { y: -4 };
  const cards = [
    {
      t: "How I got here",
      b: "It started in 2017 during a Mechatronics course, where a C++ class pulled me toward the web — HTML and CSS in Notepad, then React, then architecting full platforms. My dissertation went the other direction: a blockchain e-voting system on Ethereum, which is where the interest in onchain systems started. The hardware background is why I still reach for a measurement before an opinion.",
    },
    {
      t: "How I collaborate",
      b: "I've led frontend teams, mentored juniors, and authored the onboarding docs — which is the fastest way to find out which parts of your architecture aren't actually explainable. I run client-facing technical conversations too: feasibility, UX trade-offs, and scope, in plain language.",
    },
    {
      t: "What I want next",
      b: "A Senior Frontend Engineer role — React-first — where architecture, performance, and design systems genuinely matter — and where AI-native delivery is treated as leverage on execution rather than a substitute for judgment. Open to relocation, onsite and remote.",
    },
  ];
  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <SectionLabel title="Beyond the resume" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            How I actually work — and what I want next.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={0.05 * i}>
              <motion.div
                whileHover={hoverLift}
                transition={springHover}
                className="flex h-full flex-col rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-7 transition hover:border-[var(--sr-accent)]"
              >
                <span className="h-1.5 w-8 rounded-full bg-[var(--sr-accent)]" />
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-[18px] font-medium text-[var(--sr-text)]">
                  {c.t}
                </h3>
                <p className="mt-3 text-[14.5px] leading-7 text-[var(--sr-soft)]">
                  {c.b}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PathSection() {
  const reduce = useReducedMotion();
  // Newest first. The title ladder carries the progression on its own, so the
  // rail stays a quiet spine rather than a numbered scoreboard.
  return (
    <section className="border-b border-[var(--sr-hairline)] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionLabel title="The path" />
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Lead today, intern in 2018.
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <span
            aria-hidden="true"
            className="absolute left-[5px] top-4 bottom-8 w-px bg-[var(--sr-hairline)]"
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-[5px] top-4 w-px origin-top bg-[var(--sr-accent)]"
            style={{ bottom: 32 }}
            initial={{ scaleY: reduce ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          />
          <ol>

          {timeline.map((item, i) => {
            const cs = caseStudies.find((c) => c.company === item.company);
            const brand = cs?.brand ?? "var(--sr-accent-solid)";
            return (
              <li key={item.company} className="relative flex gap-6 pb-14 last:pb-0 sm:gap-7">
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-[7px] h-[11px] w-[11px] shrink-0 rounded-[3px] ring-4 ring-[var(--sr-bg)]"
                    style={{ background: i === 0 ? brand : "var(--sr-hairline)" }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2.5">
                      <p className="font-[family-name:var(--font-display)] text-[18px] font-medium leading-tight text-[var(--sr-text)]">
                        {item.company}
                      </p>
                      <span className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.12em] text-[var(--sr-faint)]">
                        {item.place} · {item.year}
                      </span>
                    </div>

                    <p
                      className="mt-1.5 font-[family-name:var(--font-display)] text-[14px] font-semibold"
                      style={{ color: brandInk(String(brand)) }}
                    >
                      {item.role}
                    </p>

                    <p className="mt-3.5 max-w-[46ch] text-[14.5px] leading-[1.75] text-[var(--sr-soft)]">
                      {item.scope}
                    </p>
                  </div>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function EducationSection() {
  // Verified against the certificates, not the old CV — which had the BSc
  // title short, omitted the First Class, and credited the wrong institution
  // for the Mechatronics diploma.
  const education = [
    {
      degree: "BSc (Hons) Computer Science & Software Engineering",
      award: "First Class",
      school: "University of Bedfordshire",
      year: "2022",
      note: "Dissertation: BlockVote — a blockchain-based e-voting system on Ethereum, built and defended in 2022. Solidity contracts, Truffle, a React client and MetaMask.",
    },
    {
      degree: "Higher National Diploma — Computing (Software Engineering)",
      school: "Pearson College London",
      year: "2020",
      note: "Data structures, databases, and the first systems I built end to end, alongside the early RaSoft work.",
    },
    {
      degree: "Higher National Diploma — Mechatronics Engineering",
      school: "Cardiff Metropolitan University",
      year: "2019",
      note: "The starting point, and not a straight line: I came in for hardware and left through a C++ class that pulled me toward the web — which is also why I still reach for a measurement before an opinion.",
    },
  ];


  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <SectionLabel title="Education" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Where it started, formally.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={0.05 * i} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6">
                <p className="flex min-h-[3.1rem] items-start font-[family-name:var(--font-display)] text-[16px] font-medium leading-snug text-[var(--sr-text)]">
                  {e.degree}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.1em] text-[var(--sr-muted)]">
                  {e.school} · {e.year}
                </p>
                {e.note ? (
                  <p className="mt-4 flex-1 border-t border-[var(--sr-hairline)] pt-4 text-[13px] leading-6 text-[var(--sr-soft)]">
                    {e.note}
                  </p>
                ) : null}

                {/* Award sits at the foot of the card behind its own rule.
                    Pinned to the bottom by the flex-1 above, so the cards with
                    no grade waste no space reserving a row they never use. */}
                {e.award ? (
                  <div className="mt-5">
                    <span className="inline-flex w-fit rounded-full bg-[var(--sr-accent-soft)] px-2.5 py-1 font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sr-accent)]">
                      {e.award}
                    </span>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  const reduce = useReducedMotion();
  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <SectionLabel title="Operating principles" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] tracking-[-0.01em] text-[var(--sr-text)]">
            The rules I don&apos;t trade away.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--sr-muted)]">
            Four calls I make the same way on every codebase — the reason the numbers below them hold up.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {principles.map((p, index) => (
            <Reveal key={p.label} delay={0.03 * index}>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={springHover}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-7 transition hover:border-[var(--sr-accent)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[var(--sr-accent)] transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="flex items-baseline justify-between">
                  <span className="font-[family-name:var(--font-display)] text-[13px] font-medium tracking-[0.08em] text-[var(--sr-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--sr-accent)] opacity-40" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-[19px] font-medium leading-snug text-[var(--sr-text)]">
                  {p.label}
                </h3>
                <p className="mt-2.5 text-[14px] leading-7 text-[var(--sr-muted)]">{p.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <SectionLabel title="Contact" />
          <h2 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(1.7rem,3.2vw,2.55rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Open to Senior Frontend Engineer roles — UAE / GCC, and open to
            relocation, onsite or remote.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[var(--sr-muted)]">
            My inbox is always open. If you&apos;re hiring an engineer who
            architects for the codebase you&apos;ll have in two years, treats
            performance and accessibility as features, and ships behind a test
            gate — let&apos;s talk.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${contact.email}?subject=Engineering%20role%20%E2%80%94%20let%27s%20talk`}
              className="rounded-full sr-cta px-5 py-3 text-[14px] font-semibold text-[var(--sr-accent-ink)]"
            >
              Email me
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--sr-hairline)] px-5 py-3 text-[14px] font-semibold text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
            >
              Connect on LinkedIn
            </a>
            <Link
              href={contact.resume}
              className="rounded-full border border-[var(--sr-hairline)] px-5 py-3 text-[14px] font-semibold text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
            >
              Download resume
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-14 grid gap-6 border-t border-[var(--sr-hairline)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Email", v: contact.email, href: `mailto:${contact.email}` },
              { k: "Phone", v: contact.phone, href: contact.phoneHref },
              { k: "LinkedIn", v: "linkedin.com/in/rezaan6", href: contact.linkedin },
              { k: "GitHub", v: "github.com/rezaan6", href: contact.github },
            ].map((c) => (
              <a
                key={c.k}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="group"
              >
                <p className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--sr-faint)]">
                  {c.k}
                </p>
                <p className="mt-1.5 text-[15px] text-[var(--sr-text)] transition group-hover:text-[var(--sr-accent)]">
                  {c.v}
                </p>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- page compositions ----------------------- */

export function ToolsSection() {
  const reduce = useReducedMotion();
  const [openTool, setOpenTool] = useState<(typeof tools)[number] | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Ordered, de-duplicated category list, driven by the data order.
  const toolGroups = [...new Set(tools.map((t) => t.group))];

  const close = () => {
    setOpenTool(null);
    triggerRef.current?.focus({ preventScroll: true });
    triggerRef.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenTool(null);
        triggerRef.current?.focus({ preventScroll: true });
        triggerRef.current = null;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <section className="border-b border-[var(--sr-hairline)]">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <SectionLabel title="The toolkit" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Grouped by what each part is for.
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[var(--sr-muted)]">
            The toolkit, grouped by what each part is for — architecture through
            delivery. Open any one to see how I actually use it. The craft below
            is what moves the work.
          </p>
        </Reveal>

        {/* Stack — one restrained navy tone, grouped by what each tool is for. */}
        <div className="mt-10 space-y-8">
          {toolGroups.map((group, gi) => (
            <Reveal key={group} delay={0.03 * gi}>
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.16em] text-[var(--sr-faint)]">
                {group}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={(e) => {
                        triggerRef.current = e.currentTarget;
                        setOpenTool(t);
                      }}
                      className="group flex h-full items-start gap-3 rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-4 text-left transition hover:border-[var(--sr-accent)]"
                    >
                      {/* Real brand colours from local SVGs (no web CDN). The
                          plate is bare in light mode and turns white in dark mode
                          (see .sr-tool-ic) so dark logos stay legible. Tools with
                          no available brand icon use a coloured initial. */}
                      <span className="sr-tool-ic mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]">
                        {t.slug ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/logos/tools/${t.slug}.svg`}
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="font-[family-name:var(--font-display)] text-[15px] font-bold leading-none"
                            style={{ color: t.color }}
                          >
                            {t.mono}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[14px] font-semibold text-[var(--sr-text)]">
                            {t.name}
                          </p>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-[12px] text-[var(--sr-faint)] transition group-hover:text-[var(--sr-accent)]"
                          >
                            ↗
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12px] leading-5 text-[var(--sr-muted)]">
                          {t.use}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Craft / methods — scannable so keyword screens see the toolkit. */}
        <Reveal delay={0.06}>
          <p className="mt-8 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.16em] text-[var(--sr-faint)]">
            Craft
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {methods.map((m) => (
              <span
                key={m}
                className="rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--sr-soft)]"
              >
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Tool detail — how I actually use it, with an illustrative sample. */}
      <AnimatePresence>
        {openTool ? (
          <motion.div
            key="tool-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--sr-scrim)] p-4"
            onClick={() => close()}
            role="dialog"
            aria-modal="true"
            aria-label={`${openTool.name} — how I use it`}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative flex max-h-[82vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--sr-hairline)] p-5">
                <div className="flex items-center gap-3">
                  <span className="sr-tool-ic flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]">
                    {openTool.slug ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/logos/tools/${openTool.slug}.svg`} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                    ) : (
                      <span aria-hidden="true" className="font-[family-name:var(--font-display)] text-[15px] font-bold" style={{ color: openTool.color }}>
                        {openTool.mono}
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-[16px] font-medium text-[var(--sr-text)]">
                      {openTool.name}
                    </p>
                    <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.14em] text-[var(--sr-faint)]">
                      {openTool.group}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => close()}
                  aria-label="Close"
                  className="shrink-0 rounded-full border border-[var(--sr-hairline)] p-2 text-[var(--sr-muted)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-text)]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="overflow-auto p-5">
                <p className="text-[14.5px] leading-7 text-[var(--sr-soft)]">
                  {openTool.howIUse}
                </p>
                {openTool.sample ? (
                  <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-[var(--sr-hairline)] bg-[var(--sr-bg)] p-4 font-[family-name:var(--font-mono)] text-[11.5px] leading-[1.7] text-[var(--sr-soft)]">
                    {openTool.sample}
                  </pre>
                ) : null}
                <p className="mt-4 text-[12px] leading-6 text-[var(--sr-faint)]">
                  How I actually work with {openTool.name}. The sample is
                  illustrative — client code and data are kept out.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------- projects ----------------------------- */

// Small shared pieces for the project cards: an external/repo link and the
// tech chip row. Kept here so the featured and compact cards stay in sync.
/* Source and Live demo are the two highest-value actions on a project card,
   and as bare glyphs they were the quietest things in it — an arrow icon
   asks the reader to guess that it means "live demo". They're labelled now,
   in the same outlined pill the rest of the site uses for a secondary action
   (see the case-study link and the resume's Copy button), so they read as
   actions rather than decoration and drop the odd circular hover target.
   They stay on the left: everything else in the card hangs off that spine. */
function ProjectLinks({ github, external }: { github?: string; external?: string }) {
  const links = [
    github
      ? {
          href: github,
          label: "Source",
          path: (
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C6.8 1.4 5.7 1.7 5.7 1.7a4.8 4.8 0 0 0-.1 3.6A5.1 5.1 0 0 0 4.2 9c0 5 3 6.3 6 6.6a3.4 3.4 0 0 0-.9 2.6V22" />
          ),
        }
      : null,
    external
      ? {
          href: external,
          label: "Live demo",
          path: (
            <>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6M10 14L21 3" />
            </>
          ),
        }
      : null,
  ].filter(Boolean) as { href: string; label: string; path: ReactNode }[];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          // Starts with the visible text so the accessible name matches what a
          // speech-input user would say (WCAG 2.5.3), with the new-tab warning
          // appended rather than replacing it.
          aria-label={`${l.label} (opens in a new tab)`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sr-hairline)] px-3 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:bg-[var(--sr-accent-soft)] hover:text-[var(--sr-accent)]"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {l.path}
          </svg>
          {l.label}
        </a>
      ))}
    </div>
  );
}

// Always show the whole stack. These lists top out at seven items, so
// truncating hid one or two chips behind a "+1 more" that cost the reader
// more than it saved.
function TechChips({ tech }: { tech: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <li
          key={t}
          className="rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--sr-muted)]"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ProjectsSection() {
  return (
    <>
      {/* Featured — the five builds with a real screenshot, alternating sides. */}
      <section className="border-b border-[var(--sr-hairline)]">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <Reveal>
            <SectionLabel title="Side builds · 2023" />
            <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
              Not portfolio pieces — questions I hadn’t hit at work.
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[var(--sr-muted)]">
              Personal projects, not production work — my production code is
              under NDA. I&apos;m listing what each one was actually for rather
              than pitching them as portfolio pieces. Every repo has
              screenshots and a full write-up in its README.
            </p>
          </Reveal>

          <div className="mt-12 space-y-6">
            {projects.filter((pr) => !pr.minor).map((p, i) => (
              <Reveal key={p.slug} delay={0.04 * i}>
                <article className="overflow-hidden rounded-3xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)]">
                  <div className="flex flex-col justify-center p-7 sm:p-9">
                    <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--sr-accent)]">
                      {p.category} · {p.year}
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-[22px] font-medium leading-snug text-[var(--sr-text)]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-7 text-[var(--sr-soft)]">
                      {p.blurb}
                    </p>
                    <p className="mt-4 border-l-2 border-[var(--sr-accent)] pl-3 text-[13px] leading-6 text-[var(--sr-muted)]">
                      <span className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.14em] text-[var(--sr-accent)]">
                        What it was for
                      </span>
                      <br />
                      {p.learned}
                    </p>
                    <TechChips tech={p.tech} />
                    <div className="mt-5">
                      <ProjectLinks github={p.github} external={p.external} />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* Secondary tier — smaller API-integration builds. Kept because they
          are the only public code touching AI and crypto surfaces, and listed
          compactly so they add coverage without competing with the three
          above. */}
      <section className="border-b border-[var(--sr-hairline)]">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <Reveal>
            <SectionLabel title="Also built" />
            <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium leading-[1.1] text-[var(--sr-text)]">
              Smaller API-integration builds.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--sr-muted)]">
              Each one wraps a third-party API in a UI — the interesting part was
              always the state around the request, not the request.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {projects
              .filter((p) => p.minor)
              .map((p, i) => (
                <Reveal key={p.slug} delay={0.04 * i} className="h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)]">
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.14em] text-[var(--sr-faint)]">
                        {p.year}
                      </p>
                      <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-[16px] font-medium text-[var(--sr-text)]">
                        {p.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[12.5px] leading-6 text-[var(--sr-muted)]">
                        {p.learned}
                      </p>
                      <TechChips tech={p.tech} />
                      <div className="mt-4">
                        <ProjectLinks github={p.github} external={p.external} />
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

    </>
  );
}

/* ------------------------------------------------------------------ *
 * V8 "Studio" — bold color-block hero, impact cards, a numbered method,
 * and focus cards. Spacious and editorial. Visuals are abstract /
 * illustrative only (no confidential product UIs).
 * ------------------------------------------------------------------ */

function V8HeroCard() {
  const reduce = useReducedMotion();
  const rows = [
    { company: "Hobber", label: "Vendor dashboard architected", value: "0→1", logo: "/logos/hobber.png", mark: "HB", note: "7 modules, feature-sliced React + TS" },
    { company: "Axinom", label: "Page load time", value: MEASUREMENTS["load-axinom"].value, logo: "/logos/axinom.png", mark: "AX", note: "bundle, lazy-load & caching" },
    { company: "Kodez", label: "Page load time", value: MEASUREMENTS["load-kodez"].value, logo: "/logos/kodez.png", mark: "KZ", note: `code-splitting across ${MEASUREMENTS.releases.value} releases` },
    { company: "Kodez", label: "Automated test coverage", value: MEASUREMENTS.coverage.value, logo: "/logos/kodez.png", mark: "KZ", note: "TDD with Cypress, gated in CI" },
  ];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6 shadow-[0_24px_50px_-28px_rgba(20,30,70,0.35)]"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ background: "var(--sr-accent-grad)" }} />
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--sr-accent)" }} />
          <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.16em] text-[var(--sr-muted)]">
            Impact overview
          </p>
        </span>
        <span className="rounded-full border border-[var(--sr-hairline)] px-2 py-0.5 font-[family-name:var(--font-display)] text-[9px] uppercase tracking-[0.14em] text-[var(--sr-faint)]">
          Outcome signals
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {rows.map((r) => (
          <div key={`${r.company}-${r.label}`} className="flex items-center gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--sr-bg-alt)] ring-1 ring-[var(--sr-hairline)]">
              {r.logo ? (
                <Image src={r.logo} alt="" width={22} height={22} unoptimized className="h-5 w-5 object-contain" />
              ) : (
                <span className="font-[family-name:var(--font-display)] text-[10px] font-semibold" style={{ color: "var(--sr-accent)" }}>{r.mark}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[13px] font-medium text-[var(--sr-text)]">{r.label}</p>
                <span className="font-[family-name:var(--font-display)] text-[21px] font-semibold leading-none" style={{ color: "var(--sr-accent)" }}>{r.value}</span>
              </div>
              {/* The progress bars that used to sit here encoded nothing. Their
                  widths were hand-picked — −15% drew 62, −40% drew 88, 90% drew
                  90, and "0→1" drew a full bar — so three different mappings
                  shared one axis and a longer bar didn't mean a better result.
                  A chart that can't be read is worse than no chart anywhere, and
                  worse still on a frontend portfolio. The figure carries itself. */}
              <p className="mt-1 text-[10px] text-[var(--sr-muted)]">{r.company} · {r.note}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-[var(--sr-hairline)] pt-3 text-[10.5px] leading-4 text-[var(--sr-faint)]">
        Measured before/after against a defined baseline — not claimed causal.
      </p>
    </motion.div>
  );
}

function V8Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--sr-hairline)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 38% at 12% 0%, var(--sr-accent-soft), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Reveal>
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.3em] text-[var(--sr-accent)]">
                Senior Frontend Engineer · React · Next.js · TypeScript
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(1.95rem,4vw,3rem)] font-medium leading-[1.03] tracking-[-0.01em] text-[var(--sr-text)]">
                I architect and optimize
                <br />
                web platforms that
                <br />
                hold up at scale.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-lg text-[16px] leading-7 text-[var(--sr-muted)]">
                {yearsPhrase()} across marketplace, media, and enterprise products —
                frontend architecture with full-stack range. I draw the
                boundaries first, prove the work with tests, and let a
                measurement pick the next optimization.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/work"
                  className="rounded-full sr-cta px-6 py-3 text-[14px] font-semibold text-[var(--sr-accent-ink)]"
                >
                  See the work
                </Link>
                <Link
                  href={contact.resume}
                  className="rounded-full border border-[var(--sr-hairline)] px-6 py-3 text-[14px] font-semibold text-[var(--sr-text)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
                >
                  Download resume
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-2">
                {archetypeChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-3 py-1 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.14em] text-[var(--sr-muted)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <V8HeroCard />
        </div>
      </div>
    </section>
  );
}

function V8Impact() {
  const stats = [
    {
      value: "0→1",
      label:
        "Vendor platform architected from an empty repo — 7 feature-sliced modules · Hobber",
      fill: true,
    },
    {
      value: MEASUREMENTS["load-kodez"].value,
      label: "Page load time via code-splitting, lazy loading & asset optimization · Kodez",
    },
    { value: MEASUREMENTS.coverage.value, label: "Automated Cypress coverage on critical paths, gated in CI · Kodez" },
    {
      value: MEASUREMENTS["dev-time"].value,
      label: "Frontend dev time after the Storybook component library landed · Kodez",
    },
    {
      value: MEASUREMENTS.tables.value,
      label: "SQL tables in the schema behind the CMS I owned the frontend for",
    },
  ];
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel title="Impact" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Numbers I can point to, stated conservatively.
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s, i) => (
            <Reveal key={s.value} delay={0.05 * i}>
              <div
                className={`h-full rounded-[1.6rem] border border-[var(--sr-hairline)] p-7 ${
                  s.fill ? "bg-[var(--sr-accent-soft)]" : "bg-[var(--sr-panel)]"
                }`}
              >
                <p
                  className="font-[family-name:var(--font-display)] text-[clamp(2rem,3.4vw,2.5rem)] font-medium leading-none"
                  style={{ color: s.fill ? "var(--sr-accent)" : "var(--sr-text)" }}
                >
                  {s.value}
                </p>
                <p className="mt-4 text-[14px] leading-6 text-[var(--sr-muted)]">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Expanding-panel accordion: hover a case and it grows while the others
// collapse to labelled strips (spring width animation, per-case brand color).
export function CaseAccordion() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const cases = caseStudies;
  return (
    <>
      {/* Desktop — the expanding panels */}
      <div className="mt-10 hidden h-[400px] gap-3 lg:flex">
        {cases.map((cs, i) => {
          const isActive = active === i;
          const brand = cs.brand ?? "var(--sr-accent)";
          return (
            <motion.div
              key={cs.slug}
              onMouseEnter={() => setActive(i)}
              // flexGrow is a LAYOUT property, so animating it from an unset
              // value on mount shifts every sibling panel — that was the whole
              // of this page's cumulative layout shift. `initial={false}` snaps
              // the first render straight to the resting value; hover still
              // animates normally.
              initial={false}
              animate={{ flexGrow: isActive ? 3.4 : 1 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 210, damping: 30 }
              }
              className="relative min-w-0 basis-0 overflow-hidden rounded-[1.7rem] border border-[var(--sr-hairline)]"
              style={{
                background: `color-mix(in srgb, ${brand} 9%, var(--sr-panel))`,
              }}
            >
              <Link
                href={`/work/${cs.slug}`}
                onFocus={() => setActive(i)}
                className="flex h-full w-full flex-col justify-between p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: brand }}
                />
                {/* faded brand mark to fill the panel — rendered as SVG so a
                    purely decorative 7%-opacity flourish doesn't trip the
                    contrast checker (which can't be satisfied at that opacity). */}
                {isActive ? (
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 top-1/2 h-[8.5rem] w-[20rem] -translate-y-1/2 select-none opacity-[0.07]"
                    viewBox="0 0 320 136"
                    preserveAspectRatio="xMaxYMid meet"
                  >
                    <text
                      x="318"
                      y="112"
                      textAnchor="end"
                      style={{
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        fontSize: "136px",
                        fontWeight: 600,
                        fill: brand,
                      }}
                    >
                      {cs.mark}
                    </text>
                  </svg>
                ) : null}

                {/* header */}
                <div className="flex items-center gap-3">
                  <LogoMark logo={cs.logo} mark={cs.mark} color={cs.color} />
                  <AnimatePresence>
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="min-w-0"
                      >
                        <p className="truncate font-[family-name:var(--font-display)] text-[18px] font-medium text-[var(--sr-text)]">
                          {cs.company}
                        </p>
                        <p className="truncate font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.1em] text-[var(--sr-muted)]">
                          {cs.tag}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* collapsed vertical name */}
                {!isActive ? (
                  <span
                    className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-medium uppercase tracking-[0.22em] [writing-mode:vertical-rl]"
                    style={{ color: brandInk(brand) }}
                  >
                    {cs.company}
                  </span>
                ) : null}

                {/* expanded content */}
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                    >
                      <h3 className="max-w-md font-[family-name:var(--font-display)] text-[clamp(1.2rem,2vw,1.65rem)] font-medium leading-snug text-[var(--sr-text)]">
                        {cs.headline}
                      </h3>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span
                          className="rounded-full px-3 py-1 text-[12px] font-medium"
                          style={{
                            background: `color-mix(in srgb, ${brand} 16%, transparent)`,
                            color: brandInk(brand),
                          }}
                        >
                          {cs.metric}
                        </span>
                        <span
                          className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.14em]"
                          style={{ color: brandInk(brand) }}
                        >
                          Read case →
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile / tablet — stacked cards (no hover) */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:hidden">
        {cases.map((cs) => {
          const brand = cs.brand ?? "var(--sr-accent)";
          return (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="relative overflow-hidden rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: brand }}
              />
              <div className="flex items-center gap-3">
                <LogoMark logo={cs.logo} mark={cs.mark} color={cs.color} />
                <div>
                  <p className="font-[family-name:var(--font-display)] text-[16px] font-medium text-[var(--sr-text)]">
                    {cs.company}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.1em] text-[var(--sr-muted)]">
                    {cs.tag}
                  </p>
                </div>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-[17px] font-medium leading-snug text-[var(--sr-text)]">
                {cs.headline}
              </h3>
              <span
                className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-medium"
                style={{
                  background: `color-mix(in srgb, ${brand} 16%, transparent)`,
                  color: brandInk(brand),
                }}
              >
                {cs.metric}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function V8Work() {
  return (
    <section className="border-y border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel title="Selected work" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Four codebases, written as engineering decisions.
          </h2>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[12px] uppercase tracking-[0.14em] text-[var(--sr-faint)]">
            Tap or hover a case to open it
          </p>
        </Reveal>
        <CaseAccordion />
      </div>
    </section>
  );
}

function V8Process() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel title="How I build" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            A repeatable engineering loop, not a bag of tricks.
          </h2>
        </Reveal>
        <div className="mt-10 divide-y divide-[var(--sr-hairline)] border-t border-[var(--sr-hairline)]">
          {methodSteps.map((s, i) => (
            <Reveal key={s.label} delay={0.04 * i}>
              <div className="grid gap-4 py-8 md:grid-cols-[80px_220px_1fr]">
                <span className="font-[family-name:var(--font-display)] text-[15px] text-[var(--sr-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.16em] text-[var(--sr-muted)]">
                    {s.label}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-[19px] font-medium leading-snug text-[var(--sr-text)]">
                    {s.title}
                  </h3>
                </div>
                <div>
                  <p className="text-[14.5px] leading-7 text-[var(--sr-soft)]">
                    {s.body}
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.12em] text-[var(--sr-faint)]">
                    {s.artifact}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function V8Focus() {
  const reduce = useReducedMotion();
  const hoverLift = reduce ? undefined : { y: -4 };
  const items = [
    {
      t: "Frontend architecture",
      d: "Feature-sliced structures with SOLID boundaries, so a codebase stays changeable after the third team joins it. Greenfield platforms and microarchitecture CMS builds.",
      companies: ["Hobber", "Kodez"],
      outcome: "Two platforms architected 0→1",
    },
    {
      t: "Performance engineering",
      d: "Bundle analysis, code-splitting, lazy loading, and caching — always starting from a measurement rather than an instinct, and never reading the average alone.",
      companies: ["Kodez", "Axinom"],
      outcome: `${MEASUREMENTS["load-kodez"].value} and ${MEASUREMENTS["load-axinom"].value} page load`,
    },
    {
      t: "Design systems",
      d: "Component libraries documented in Storybook with an accessibility floor and a real promotion rule, so screens get composed instead of authored.",
      companies: ["Kodez"],
      outcome: `${MEASUREMENTS["dev-time"].value} frontend dev time`,
    },
    {
      t: "Full-stack delivery",
      d: "Node.js BFF layers, ExpressJS services, and relational schema work — plus incremental migration off a legacy stack without freezing delivery.",
      companies: ["Kodez", "RaSoft"],
      outcome: `${MEASUREMENTS.tables.value} SQL tables · ${MEASUREMENTS["tech-debt"].value} tech debt`,
    },
    {
      t: "Testing & release safety",
      d: "TDD with Cypress and Jest, gated in CI, plus cross-browser validation — the reason releases stayed frequent and safe is safe rather than merely fast.",
      companies: ["Kodez"],
      outcome: `${MEASUREMENTS.coverage.value} coverage · ${MEASUREMENTS.releases.value} releases`,
    },
    {
      t: "AI-native engineering",
      d: "Agent orchestration with sub-agent delegation, MCP integrations against real tooling, synthetic data for edge cases, and automated PR and CI/CD workflows.",
      companies: [] as string[],
      outcome: "Leverage on execution, not on judgment",
    },
  ];
  return (
    <section className="border-t border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel title="Where I fit" />
          <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.55rem,2.9vw,2.35rem)] font-medium leading-[1.08] text-[var(--sr-text)]">
            Frontend architecture is my spine — and where it extends.
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[var(--sr-muted)]">
            Architecture and performance are the core I&apos;ve shipped against.
            Full-stack delivery, testing discipline, and AI-native workflows are
            where that same instinct extends — each backed by a number, not just
            a title.
          </p>
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={0.05 * i} className="h-full w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
              <motion.div
                whileHover={hoverLift}
                transition={springHover}
                className="flex h-full flex-col rounded-[1.6rem] border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6 transition hover:border-[var(--sr-accent)]"
              >
                <span
                  className="mb-2.5 inline-flex w-fit rounded-full px-2 py-0.5 font-[family-name:var(--font-display)] text-[9px] font-semibold uppercase tracking-[0.12em]"
                  style={
                    i < 3
                      ? { background: "var(--sr-accent-soft)", color: "var(--sr-accent)" }
                      : { background: "var(--sr-bg-alt)", color: "var(--sr-muted)" }
                  }
                >
                  {i < 3 ? "Core" : "Adjacent"}
                </span>
                <p
                  className="flex min-h-[3.1rem] items-start font-[family-name:var(--font-display)] text-[18px] font-medium leading-snug"
                  style={{ color: "var(--sr-text)" }}
                >
                  {it.t}
                </p>
                <p className="mt-3 min-h-[6.5rem] flex-1 text-[13.5px] leading-6 text-[var(--sr-muted)]">
                  {it.d}
                </p>
                <div className="mt-4 border-t border-[var(--sr-hairline)] pt-3">
                  <div className="flex min-h-[24px] flex-wrap items-center gap-1.5">
                    {it.companies.length ? (
                      it.companies.map((name) => {
                        const cs = caseStudies.find((c) => c.company === name);
                        const b = cs?.brand ?? "var(--sr-accent)";
                        return (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 rounded-full py-0.5 pl-1 pr-2.5 text-[10.5px] font-medium"
                            style={{ background: `color-mix(in srgb, ${b} 12%, transparent)`, color: brandInk(b) }}
                          >
                            {cs?.logo ? (
                              <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/5">
                                <Image src={cs.logo} alt="" width={12} height={12} unoptimized className="h-3 w-3 object-contain" />
                              </span>
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: b }} />
                            )}
                            {name}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[10.5px] italic text-[var(--sr-faint)]">Cross-company capability</span>
                    )}
                  </div>
                  <p className="mt-2.5 flex min-h-[1.9rem] items-start font-[family-name:var(--font-display)] text-[11px] uppercase leading-snug tracking-[0.1em] text-[var(--sr-muted)]">
                    {it.outcome}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SignalHomeV8() {
  return (
    <>
      <V8Hero />
      <V8Impact />
      <V8Work />
      <V8Process />
      <V8Focus />
      <ContactSection />
    </>
  );
}

