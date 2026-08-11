"use client";

import { Reveal } from "./signal-room";
import { DECISIONS, KNOWN_ISSUE, REPO, SCORES, STACK_FACTS } from "./colophon-data";

/* The colophon renders pre-highlighted HTML handed down from the server —
   see app/colophon/page.tsx. No highlighter runs in the browser. */

export function ColophonSection({
  highlighted,
}: {
  highlighted: Record<string, string>;
}) {
  return (
    <>
      {/* ---------------------------- receipts --------------------------- */}
      <section className="border-b border-[var(--sr-hairline)]">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.2em] text-[var(--sr-accent)]">
                Lighthouse · production build
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {SCORES.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-5"
                  >
                    <p className="font-[family-name:var(--font-display)] text-[30px] font-semibold leading-none text-[var(--sr-accent)]">
                      {s.value}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-[var(--sr-muted)]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11.5px] leading-5 text-[var(--sr-faint)]">
                Desktop, navigation mode, against the production build. Run it
                yourself against the deployed site.
              </p>

              {/* The number I have not fixed yet, stated rather than omitted. */}
              <div className="mt-5 rounded-2xl border border-dashed border-[var(--sr-hairline)] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.14em] text-[var(--sr-muted)]">
                    Known issue · {KNOWN_ISSUE.label}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[17px] font-semibold text-[var(--sr-text)]">
                    {KNOWN_ISSUE.value}
                  </p>
                </div>
                <p className="mt-2 text-[11.5px] leading-5 text-[var(--sr-muted)]">
                  {KNOWN_ISSUE.note}
                </p>
              </div>
            </div>

            <div>
              <p className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.2em] text-[var(--sr-accent)]">
                What it&apos;s made of
              </p>
              <dl className="mt-5 divide-y divide-[var(--sr-hairline)]">
                {STACK_FACTS.map((f) => (
                  <div
                    key={f.k}
                    className="grid grid-cols-[130px_1fr] gap-4 py-3 first:pt-0"
                  >
                    <dt className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.12em] text-[var(--sr-faint)]">
                      {f.k}
                    </dt>
                    <dd className="text-[13.5px] leading-6 text-[var(--sr-soft)]">
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full sr-cta px-5 py-2.5 text-[13px] font-semibold text-[var(--sr-accent-ink)]"
              >
                Read the source
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- decisions --------------------------- */}
      <section className="border-b border-[var(--sr-hairline)]">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.7vw,2rem)] font-medium leading-tight text-[var(--sr-text)]">
            Five decisions, and what each one cost.
          </h2>

          <div className="mt-12 space-y-14">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.n} delay={0.03 * i}>
                <article>
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold tracking-[0.08em] text-[var(--sr-accent)]">
                      {d.n}
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] text-[19px] font-medium leading-snug text-[var(--sr-text)]">
                      {d.title}
                    </h3>
                  </div>

                  <p className="mt-4 text-[14.5px] leading-7 text-[var(--sr-muted)]">
                    {d.problem}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-7 text-[var(--sr-soft)]">
                    {d.choice}
                  </p>

                  {d.snippet && highlighted[d.snippet] ? (
                    <div
                      className="sr-code mt-5"
                      // Shiki output generated at build time from string
                      // literals in our own source — no user input involved.
                      dangerouslySetInnerHTML={{
                        __html: highlighted[d.snippet],
                      }}
                    />
                  ) : null}

                  {d.tradeoff ? (
                    <p className="mt-4 border-l-2 border-[var(--sr-hairline)] pl-4 text-[13px] leading-6 text-[var(--sr-faint)]">
                      <span className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.14em] text-[var(--sr-muted)]">
                        The cost
                      </span>
                      <br />
                      {d.tradeoff}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-14 rounded-2xl border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-5 py-4 text-[13px] leading-6 text-[var(--sr-muted)]">
            Everything above is checkable — unlike my production work, this
            codebase is one I can hand over in full. If you want to see how I
            write code rather than how I describe it,{" "}
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--sr-accent)] underline underline-offset-2"
            >
              this is the repository
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
