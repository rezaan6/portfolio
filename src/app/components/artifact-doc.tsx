"use client";

/* ------------------------------------------------------------------ *
 * Renders a structured engineering artifact (from artifact-docs.tsx) as a
 * designed document. Each block type has its own treatment, so a KPI
 * state tree, a playback chain, a comparison table and an ADR look different
 * — not one shared <pre> dump. Themed with site vars (light/dark),
 * accented with the case brand colour.
 * ------------------------------------------------------------------ */

export type ArtField = { label: string; value: string };
export type ArtChild = { label: string; note?: string };
export type ArtBranch = { label: string; note?: string; own?: boolean; children?: ArtChild[] };
export type ArtStage = { stage: string; job?: string; drop?: string; signal?: string; ops?: string };
export type ArtRow = { cells: string[]; tag?: string; score?: number };
export type ArtCheck = { text: string; good?: boolean };
export type ArtVar = { label: string; desc: string };
export type ArtBlock = {
  type: "section" | "tree" | "stages" | "variants" | "table" | "steps" | "checklist" | "callout" | "fields" | "heading";
  title?: string;
  text?: string;
  n?: string;
  root?: string;
  branches?: ArtBranch[];
  stages?: ArtStage[];
  variantA?: ArtVar;
  variantB?: ArtVar;
  cols?: string[];
  rows?: ArtRow[];
  ordered?: boolean;
  items?: string[];
  checks?: ArtCheck[];
  tone?: "exclude" | "note" | "insight" | "win";
  fields?: ArtField[];
};
export type ArtDoc = { summary: string; blocks: ArtBlock[] };

const TONE: Record<string, { color: string; label: string }> = {
  insight: { color: "", label: "Insight" }, // color filled from brand at render
  exclude: { color: "#d9522f", label: "Excluded" },
  note: { color: "#c0872d", label: "Note" },
  win: { color: "#b0894e", label: "Outcome" },
};

const tintP = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, var(--sr-panel))`;
const tintT = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

function Kicker({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="rounded-full px-1.5 py-0.5 font-[family-name:var(--font-display)] text-[8.5px] font-semibold uppercase tracking-[0.12em]"
      style={{ background: tintT(color, 14), color }}
    >
      {children}
    </span>
  );
}

function tagColor(brand: string, tag?: string) {
  const t = (tag || "").toLowerCase();
  if (t.includes("now") || t.includes("do")) return brand;
  if (t.includes("next")) return "#c0872d";
  return "var(--sr-muted)";
}

function ArtBlockView({ b, brand }: { b: ArtBlock; brand: string }) {
  switch (b.type) {
    case "fields":
      return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] p-4 sm:grid-cols-2">
          {(b.fields ?? []).map((f, i) => (
            <div key={i}>
              <p className="font-[family-name:var(--font-display)] text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--sr-muted)]">{f.label}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-[var(--sr-text)]">{f.value}</p>
            </div>
          ))}
        </div>
      );

    case "heading":
      return <p className="pt-1 font-[family-name:var(--font-display)] text-[13px] font-semibold text-[var(--sr-text)]">{b.title}</p>;

    case "section":
      return (
        <div className="flex gap-3.5">
          {b.n ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-display)] text-[12px] font-semibold" style={{ background: tintT(brand, 12), color: brand }}>{b.n}</span>
          ) : null}
          <div className="min-w-0">
            {b.title ? <h4 className="font-[family-name:var(--font-display)] text-[14.5px] font-semibold text-[var(--sr-text)]">{b.title}</h4> : null}
            {b.text ? <p className="mt-1 text-[13.5px] leading-6 text-[var(--sr-soft)]">{b.text}</p> : null}
          </div>
        </div>
      );

    case "tree": {
      return (
        <div className="rounded-xl border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] p-4">
          <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: "#efe7d4", color: "#7a6336" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#c9a45f" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#7a6336" }}>{b.root}</span>
          </div>
          <div className="mt-2 space-y-2.5">
            {(b.branches ?? []).map((br, i) => {
              const c = br.own ? brand : "var(--sr-muted)";
              return (
                <div key={i} className="border-l-2 pl-3.5" style={{ borderColor: br.own ? brand : "var(--sr-hairline)" }}>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                    <span className="text-[13px] font-semibold text-[var(--sr-text)]">{br.label}</span>
                    {br.note ? <span className="text-[11px] text-[var(--sr-muted)]">· {br.note}</span> : null}
                    {br.own ? <Kicker color={brand}>My ownership</Kicker> : null}
                  </div>
                  {br.children?.length ? (
                    <div className="mt-1.5 space-y-1 border-l pl-3.5" style={{ borderColor: "var(--sr-hairline)" }}>
                      {br.children.map((ch, j) => (
                        <div key={j} className="flex flex-wrap items-baseline gap-1.5">
                          <span className="text-[12.5px] text-[var(--sr-soft)]">{ch.label}</span>
                          {ch.note ? <span className="text-[10.5px] text-[var(--sr-muted)]">· {ch.note}</span> : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "stages":
      return (
        <div className="relative space-y-3 pl-1">
          {(b.stages ?? []).map((st, i) => (
            <div key={i} className="relative rounded-xl border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: brand }}>{i + 1}</span>
                <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold text-[var(--sr-text)]">{st.stage}</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {st.job ? <Line k="Job" v={st.job} c="var(--sr-muted)" /> : null}
                {st.drop ? <Line k="Drop" v={st.drop} c="#d9522f" /> : null}
                {st.signal ? <Line k="Signal" v={st.signal} c={brand} /> : null}
                {st.ops ? <Line k="Ops" v={st.ops} c="var(--sr-muted)" /> : null}
              </div>
            </div>
          ))}
        </div>
      );

    case "variants":
      return (
        <div>
          {b.title ? <p className="mb-2 text-[12px] font-medium text-[var(--sr-muted)]">{b.title}</p> : null}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[b.variantA, b.variantB].map((v, i) =>
              v ? (
                <div key={i} className="rounded-xl border p-3.5" style={i === 1 ? { borderColor: tintT(brand, 45), background: tintP(brand, 6) } : { borderColor: "var(--sr-hairline)", background: "var(--sr-bg-alt)" }}>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold text-white" style={{ background: i === 1 ? brand : "var(--sr-muted)" }}>{i === 0 ? "A" : "B"}</span>
                    <span className="text-[13px] font-semibold text-[var(--sr-text)]">{v.label}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-[var(--sr-soft)]">{v.desc}</p>
                </div>
              ) : null,
            )}
          </div>
        </div>
      );

    case "table": {
      const cols = b.cols ?? [];
      return (
        <div className="overflow-hidden rounded-xl border border-[var(--sr-hairline)]">
          <div className="grid gap-2 border-b border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-3 py-2" style={{ gridTemplateColumns: `1.6fr repeat(${Math.max(0, cols.length - 1)}, 0.7fr) auto` }}>
            {cols.map((c, i) => (
              <span key={i} className={`font-[family-name:var(--font-display)] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--sr-muted)] ${i === 0 ? "" : "text-right"}`}>{c}</span>
            ))}
            <span />
          </div>
          {(b.rows ?? []).map((r, i) => (
            <div key={i} className="grid items-center gap-2 border-b border-[var(--sr-hairline)] px-3 py-2 last:border-b-0" style={{ gridTemplateColumns: `1.6fr repeat(${Math.max(0, cols.length - 1)}, 0.7fr) auto` }}>
              {r.cells.map((cell, j) => (
                <span key={j} className={`text-[12px] ${j === 0 ? "font-medium text-[var(--sr-text)]" : "text-right text-[var(--sr-soft)]"}`}>{cell}</span>
              ))}
              {r.tag ? (
                <span className="justify-self-end rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: tintT(tagColor(brand, r.tag), 14), color: tagColor(brand, r.tag) }}>{r.tag}</span>
              ) : <span />}
            </div>
          ))}
        </div>
      );
    }

    case "checklist":
      return (
        <div>
          {b.title ? <p className="mb-2 text-[12px] font-medium text-[var(--sr-muted)]">{b.title}</p> : null}
          <div className="space-y-2">
            {(b.checks ?? []).map((c, i) => {
              const good = c.good !== false;
              const col = good ? brand : "#d9522f";
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: col }}>{good ? "✓" : "✕"}</span>
                  <span className="text-[13px] leading-6 text-[var(--sr-soft)]">{c.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "steps":
      return (
        <div>
          {b.title ? <p className="mb-2 text-[12px] font-medium text-[var(--sr-muted)]">{b.title}</p> : null}
          <div className="space-y-2">
            {(b.items ?? []).map((it, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {b.ordered ? (
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md text-[9.5px] font-bold" style={{ background: tintT(brand, 14), color: brand, height: 18, width: 18 }}>{i + 1}</span>
                ) : (
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: brand }} />
                )}
                <span className="text-[13px] leading-6 text-[var(--sr-soft)]">{it}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "callout":
    default: {
      const tone = b.tone ?? "insight";
      const color = tone === "insight" ? brand : TONE[tone].color;
      return (
        <div className="rounded-xl border-l-[3px] p-3.5" style={{ borderColor: color, background: tintP(color, 7) }}>
          <div className="flex items-center gap-2">
            <Kicker color={color}>{TONE[tone].label}</Kicker>
            {b.title ? <span className="text-[13px] font-semibold text-[var(--sr-text)]">{b.title}</span> : null}
          </div>
          {b.text ? <p className="mt-1.5 text-[13px] leading-6 text-[var(--sr-soft)]">{b.text}</p> : null}
        </div>
      );
    }
  }
}

function Line({ k, v, c }: { k: string; v: string; c: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="shrink-0 rounded px-1.5 py-0.5 font-[family-name:var(--font-display)] text-[8px] font-semibold uppercase tracking-[0.1em]" style={{ background: tintT(c, 14), color: c }}>{k}</span>
      <span className="text-[12px] leading-5 text-[var(--sr-soft)]">{v}</span>
    </div>
  );
}

export function ArtifactDocView({ doc, brand }: { doc: ArtDoc; brand: string }) {
  return (
    <div className="space-y-4">
      <p className="text-[14px] leading-7 text-[var(--sr-soft)]">{doc.summary}</p>
      <div className="space-y-4">
        {doc.blocks.map((b, i) => (
          <ArtBlockView key={i} b={b} brand={brand} />
        ))}
      </div>
    </div>
  );
}
