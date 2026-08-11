"use client";

import Image from "next/image";
import Link from "next/link";

import { DeviceStage } from "./prototype";
import { PROTOTYPES } from "./prototype-data";
import { ContactSection, Magnetic } from "./signal-room";
import type { CaseStudy } from "./signal-room-data";

/* ------------------------------------------------------------------ *
 * Case study detail. The web/tablet/mobile prototypes are reference builds
 * of the flow — drawn in code by one shared
 * block renderer (prototype.tsx) so all three cases read identically.
 * Content per case lives in prototype-data.tsx.
 * ------------------------------------------------------------------ */

export function CaseDetail({
  cs,
  codeHtml,
}: {
  cs: CaseStudy;
  /** Pre-highlighted on the server — see lib/highlight.ts. */
  codeHtml?: string | null;
}) {
  const brand = cs.brand ?? "#1e3a8a";
  // Accessible brand text: keep the hue, blend toward the theme's text colour so
  // small brand-coloured labels clear contrast on the light hero tint.
  const ink = `color-mix(in srgb, ${brand}, var(--sr-text) 46%)`;
  const proto = PROTOTYPES[cs.slug];
  const arc: [string, string][] = [
    ["Context", cs.context],
    ["The decision", cs.decision],
    ["The trade-off I made", cs.tradeoff],
    ["What I measured", cs.signal],
    ["Outcome", cs.outcome],
    ["What I'd do differently", cs.detail],
  ];

  return (
    <div>
      {/* hero */}
      <section
        className="border-b border-[var(--sr-hairline)]"
        style={{ background: `color-mix(in srgb, ${brand} 6%, var(--sr-bg))` }}
      >
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <Magnetic strength={0.22}>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-3.5 py-1.5 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.16em] text-[var(--sr-muted)] transition hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
            >
              <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span>
              All work
            </Link>
          </Magnetic>
          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
                  cs.logo ? "bg-[var(--sr-panel)] ring-1 ring-[var(--sr-hairline)]" : ""
                }`}
                style={cs.logo ? undefined : { background: `color-mix(in srgb, ${brand} 16%, var(--sr-panel))` }}
              >
                {cs.logo ? (
                  <Image src={cs.logo} alt="" width={26} height={26} unoptimized className="h-6 w-6 object-contain" />
                ) : (
                  <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold" style={{ color: brand }}>
                    {cs.mark}
                  </span>
                )}
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-[17px] font-medium text-[var(--sr-text)]">{cs.company}</p>
                <p className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.1em] text-[var(--sr-muted)]">{cs.period}</p>
              </div>
            </div>
            <p className="mt-7 font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.18em]" style={{ color: ink }}>{cs.tag}</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.7rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[var(--sr-text)]">{cs.headline}</h1>
            {cs.customerLede ? (
              <p
                className="mt-5 max-w-xl border-l-2 pl-4 text-[16.5px] leading-8 text-[var(--sr-soft)]"
                style={{ borderColor: brand }}
              >
                {cs.customerLede}
              </p>
            ) : null}
            <div className="mt-6 inline-flex rounded-full px-4 py-1.5 text-[13px] font-medium" style={{ background: `color-mix(in srgb, ${brand} 12%, transparent)`, color: ink }}>{cs.metric}</div>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[var(--sr-muted)]">{cs.domain}</p>
            {cs.scale?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {cs.scale.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-3 py-1 text-[11.5px] font-medium text-[var(--sr-soft)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : null}
            {cs.stack?.length ? (
              <div className="mt-6">
                <p className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--sr-faint)]">
                  Stack
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {cs.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px]"
                      style={{
                        background: `color-mix(in srgb, ${brand} 10%, transparent)`,
                        color: ink,
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* device family — laptop, tablet, phone grouped in one showcase */}
      {proto ? (
        <section className="border-b border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)]">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.2em]" style={{ color: ink }}>UI · reference build</p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.6vw,1.85rem)] font-medium leading-snug tracking-[-0.01em] text-[var(--sr-text)]">
              One responsive interface — switch between laptop, tablet, and mobile.
            </h2>
            {/* One stage; pick a device and the frame morphs between them. */}
            <div className="mt-10">
              <DeviceStage proto={proto} brand={brand} skinKey={cs.slug} />
            </div>
            <p className="mt-10 rounded-xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] px-4 py-3 text-[13px] leading-6 text-[var(--sr-muted)]">
              A <span className="font-semibold text-[var(--sr-text)]">reference build of the flow</span>, drawn in code to show the shape of the work. The production app is under NDA.
            </p>
          </div>
        </section>
      ) : null}

      {/* The pattern, in code. Illustrative — it shows the shape of the
          decision; the production implementation is under NDA. */}
      {cs.code && codeHtml ? (
        <section className="border-b border-[var(--sr-hairline)]">
          <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
            <p
              className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.2em]"
              style={{ color: ink }}
            >
              The pattern, in code
            </p>
            <p className="mt-3 text-[15px] leading-7 text-[var(--sr-soft)]">
              {cs.code.caption}
            </p>
            <div
              className="sr-code mt-6"
              // Shiki output, generated at build time from a string literal in
              // our own source — no user input reaches this.
              dangerouslySetInnerHTML={{ __html: codeHtml }}
            />
            <p className="mt-3 text-[12px] leading-6 text-[var(--sr-faint)]">
              Illustrative — written to show the shape of the decision. Client
              code is under NDA and none of it appears here.
            </p>
          </div>
        </section>
      ) : null}

      {/* decision arc */}
      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="divide-y divide-[var(--sr-hairline)]">
          {arc.map(([label, body], i) => (
            <div key={label} className="py-8 first:pt-0">
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.2em]" style={{ color: ink }}>{String(i + 1).padStart(2, "0")} · {label}</p>
              <p className="mt-4 text-[16px] leading-8 text-[var(--sr-soft)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The engineering practices this case demonstrates — each mapped to a
          specific decision above, not a generic trait. */}
      {cs.practices?.length ? (
        <section className="border-t border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)]">
          <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
            <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.2em]" style={{ color: ink }}>
              Engineering practices in play
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.6vw,1.85rem)] font-medium leading-snug tracking-[-0.01em] text-[var(--sr-text)]">
              The same decisions, mapped to the practices they demonstrate.
            </h2>
            <div className="mt-8 grid gap-4">
              {cs.practices.map((p) => (
                <div
                  key={p.lp}
                  className="rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: brand }}
                    />
                    <p className="font-[family-name:var(--font-display)] text-[14px] font-semibold text-[var(--sr-text)]">
                      {p.lp}
                    </p>
                  </div>
                  <p className="mt-2 text-[14.5px] leading-7 text-[var(--sr-soft)]">
                    {p.why}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[12.5px] leading-6 text-[var(--sr-faint)]">
              Each one maps to a specific decision above — the reasoning is on
              record, not asserted as a trait.
            </p>
          </div>
        </section>
      ) : null}

      <ContactSection />
    </div>
  );
}
