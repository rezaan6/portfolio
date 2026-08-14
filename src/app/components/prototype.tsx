"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * Prototype design system. Content is block-based (a Proto = Blocks),
 * but each case gets its OWN skin — Hobber a light consumer-marketplace
 * SaaS, Axinom a dark media-operations console, Kodez a dense enterprise
 * workflow tool — so the three read as three different products.
 * Illustrative, drawn in code (no screenshots).
 * ------------------------------------------------------------------ */

export type Block = {
  type:
    | "stats" | "list" | "chart" | "progress" | "grid"
    | "kanban" | "player" | "form" | "calendar" | "note" | "cta" | "pills"
    | "table" | "hub" | "fields";
  title?: string;
  sub?: string;
  text?: string;
  cta?: string;
  pct?: number;
  live?: boolean;
  meta?: string;
  month?: string;
  active?: number;
  bars?: number[];
  statValue?: string;
  statLabel?: string;
  pills?: string[];
  items?: { label?: string; value?: string; meta?: string; tag?: string; status?: string; delta?: string }[];
  cards?: { title: string; meta?: string }[];
  columns?: { name: string; cards?: { title: string; meta?: string; done?: boolean }[] }[];
  steps?: { label: string; done?: boolean }[];
  events?: { day: string; label?: string }[];
  cols?: string[];
  rows?: { cells: string[]; status?: string }[];
  tiles?: { n?: string; title: string; links?: string[] }[];
};

export type Screen = {
  label: string;
  title: string;
  sub?: string;
  activeNav?: number;
  crumbs?: string[];
  split?: boolean;
  blocks: Block[];
};

export type Proto = {
  app: string;
  logo?: string;
  nav: string[];
  tabs?: string[];
  web: Screen[];
  tablet: Screen[];
  mobile: Screen[];
};

/* ------------------------------- skins ------------------------------- */
type Palette = {
  bg: string; panel: string; surf: string; line: string;
  ink: string; soft: string; mut: string; onAccent: string;
};
const LIGHT: Palette = { bg: "#ffffff", panel: "#ffffff", surf: "#f5f6f9", line: "#ebedf2", ink: "#1b2130", soft: "#5b6473", mut: "#646c79", onAccent: "#ffffff" };

export type Skin = {
  key: string;
  palette: Palette;
  dark: boolean;
  nav: "top" | "operator" | "sidebar";
  radius: string;       // outer frame corners
  card: string;         // card corners
  shadow: boolean;      // soft shadow vs flat-bordered cards
  mono: boolean;        // monospace labels / ids
  deck: string;         // laptop base tone
  bezel: string;        // screen bezel colour
};

const SKINS: Record<string, Skin> = {
  hobber: { key: "hobber", palette: LIGHT, dark: false, nav: "top",      radius: "rounded-[14px]", card: "rounded-xl", shadow: true,  mono: false, deck: "#cfd4dd", bezel: "#e6e8ee" },
  axinom: { key: "axinom", palette: LIGHT, dark: false, nav: "operator", radius: "rounded-[10px]", card: "rounded-lg", shadow: false, mono: true,  deck: "#c6ccd6", bezel: "#dfe3ea" },
  kodez:  { key: "kodez",  palette: LIGHT, dark: false, nav: "sidebar",  radius: "rounded-[10px]", card: "rounded-md", shadow: false, mono: true,  deck: "#d3d2cd", bezel: "#e4e2dd" },
  // RaSoft — a clean internal HR/admin console (sidebar like Kodez, but soft &
  // friendly rather than dense-mono, so the internal-tools 0→1 reads distinct).
  rasoft: { key: "rasoft", palette: LIGHT, dark: false, nav: "sidebar",  radius: "rounded-[14px]", card: "rounded-xl", shadow: true,  mono: false, deck: "#d2ced4", bezel: "#e6e2ea" },
};
const skinFor = (k?: string): Skin => SKINS[k ?? ""] ?? SKINS.hobber;
const monoCls = (s: Skin) => (s.mono ? "font-[family-name:var(--font-mono)]" : "font-[family-name:var(--font-display)]");

const tint = (brand: string, pct: number) => `color-mix(in srgb, ${brand} ${pct}%, transparent)`;
// Accessible brand *text* inside the mock UI: keep the hue but blend toward the
// (light) palette ink so small brand-coloured labels clear WCAG AA on their
// tinted chips. Fills/borders keep the pure brand via tint()/brand. All current
// skins are light (dark:false), so the light ink is the correct blend target.
const bInk = (brand: string) => `color-mix(in srgb, ${brand}, #1b2130 42%)`;
const mix = (brand: string, pct: number, base: string) => `color-mix(in srgb, ${brand} ${pct}%, ${base})`;

/* Real product logo in the app chrome — falls back to a letter tile. */
function AppMark({ proto, brand, p }: { proto: Proto; brand: string; p: Palette }) {
  if (proto.logo) {
    return (
      <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-black/5">
        <Image src={proto.logo} alt="" width={16} height={16} unoptimized className="h-3.5 w-3.5 object-contain" />
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-bold" style={{ background: bInk(brand), color: p.onAccent }}>
      {proto.app[0]}
    </span>
  );
}

/* ------------------------------ helpers ------------------------------ */
function useAutoStep(count: number, ms: number) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduce || paused || count <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), ms);
    return () => clearInterval(t);
  }, [count, ms, reduce, paused]);
  return { i, setI, setPaused };
}

function Dots({ count, active, onPick, brand }: { count: number; active: number; onPick: (i: number) => void; brand: string }) {
  if (count <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Screen ${i + 1}`}
          onClick={() => onPick(i)}
          className="h-1.5 rounded-full transition-all"
          style={{ width: i === active ? 18 : 6, background: i === active ? brand : "var(--sr-hairline)" }}
        />
      ))}
    </div>
  );
}

const springIn = (delay = 0) => ({
  initial: { opacity: 0, y: 26, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { type: "spring" as const, stiffness: 110, damping: 18, delay },
});

function Frame({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const a = springIn(delay);
  return (
    <motion.div initial={reduce ? false : a.initial} whileInView={reduce ? undefined : a.whileInView} viewport={a.viewport} transition={a.transition} className={className}>
      {children}
    </motion.div>
  );
}

function ScreenSwap({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

const Ping = ({ color }: { color: string }) => {
  const reduce = useReducedMotion();
  return (
  <span className="relative flex h-1.5 w-1.5">
    {reduce ? null : (
      <motion.span className="absolute inline-flex h-full w-full rounded-full" style={{ background: color }} animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
    )}
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: color }} />
  </span>
  );
};

function statusStyle(brand: string, p: Palette, dark: boolean, status?: string) {
  if (!status) return undefined;
  const s = status.toLowerCase();
  const bad = /pending|rebuffer|fail|delayed|offline|expiring|review|draft|late|overdue/.test(s);
  if (bad) return dark ? { background: "#3a221d", color: "#f2977c" } : { background: "#fdecea", color: "#d9522f" };
  return { background: tint(brand, dark ? 20 : 12), color: bInk(brand) };
}

// Initials for a real-app avatar (from the first two words of a label).
function initials(text?: string) {
  const w = (text ?? "").replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return ((w[0]?.[0] ?? "") + (w[1]?.[0] ?? "")).toUpperCase() || "•";
}

/* ------------------------------- blocks ------------------------------- */
function BlockView({ b, brand, s, d = false }: { b: Block; brand: string; s: Skin; d?: boolean }) {
  const reduce = useReducedMotion();
  const p = s.palette;
  const t = {
    h: d ? "text-[9.5px]" : "text-[11px]",
    body: d ? "text-[8.5px]" : "text-[10px]",
    sm: d ? "text-[7.5px]" : "text-[9px]",
    big: d ? "text-[13px]" : "text-[17px]",
  };
  const cardCls = `${s.card} border p-3`;
  const cardStyle = { borderColor: p.line, background: p.panel, boxShadow: s.shadow ? "0 1px 2px rgba(20,30,70,0.05)" : "none" } as const;
  const label = monoCls(s);

  switch (b.type) {
    case "stats":
      return (
        <div>
          {b.title ? <p className={`mb-1.5 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className={`grid gap-1.5 ${d ? "grid-cols-2" : (b.items?.length ?? 0) > 3 ? "grid-cols-4" : "grid-cols-3"}`}>
            {(b.items ?? []).map((it, i) => (
              <div key={i} className={cardCls} style={cardStyle}>
                <p className={`${t.sm} ${label}`} style={{ color: p.mut }}>{it.label}</p>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                  <p className={`font-[family-name:var(--font-display)] font-semibold leading-none ${t.big}`} style={{ color: p.ink }}>{it.value}</p>
                  {it.delta ? <span className={`${t.sm} whitespace-nowrap`} style={{ color: bInk(brand) }}>{it.delta}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "chart":
      return (
        <div className={cardCls} style={cardStyle}>
          <div className="flex items-center justify-between">
            <p className={`font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p>
            {b.statValue ? (
              <span className="text-right">
                <span className={`font-[family-name:var(--font-display)] font-semibold ${d ? "text-[12px]" : "text-[15px]"}`} style={{ color: bInk(brand) }}>{b.statValue}</span>
                {b.statLabel ? <span className={`ml-1 ${t.sm}`} style={{ color: p.mut }}>{b.statLabel}</span> : null}
              </span>
            ) : null}
          </div>
          <div className={`mt-2 flex items-end gap-1 ${d ? "h-10" : "h-14"}`}>
            {(b.bars ?? []).map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t" style={{ background: i % 2 ? brand : tint(brand, s.dark ? 34 : 22) }} initial={{ height: 0 }} whileInView={{ height: `${Math.max(6, h)}%` }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.03 * i }} />
            ))}
          </div>
        </div>
      );

    case "progress":
      return (
        <div className={cardCls} style={cardStyle}>
          <div className="flex items-center justify-between">
            <p className={`font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p>
            {typeof b.pct === "number" ? <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: tint(brand, s.dark ? 22 : 12), color: bInk(brand) }}>{b.pct}%</span> : null}
          </div>
          {typeof b.pct === "number" ? (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: p.surf }}>
              <motion.div className="h-full rounded-full" style={{ background: brand }} initial={{ width: 0 }} whileInView={{ width: `${b.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
            </div>
          ) : null}
          {b.sub ? <p className={`mt-1 ${t.sm}`} style={{ color: p.mut }}>{b.sub}</p> : null}
          {b.steps?.length ? (
            <div className="mt-2 space-y-1.5">
              {b.steps.map((st, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[7px]" style={{ background: st.done ? brand : p.line, color: st.done ? p.onAccent : p.mut }}>{st.done ? "✓" : ""}</span>
                  <span className={t.body} style={{ color: st.done ? p.ink : p.mut }}>{st.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );

    case "list":
      return (
        <div>
          {b.title ? <p className={`mb-1.5 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className={`overflow-hidden ${s.card} border`} style={{ borderColor: p.line, background: p.panel }}>
            {(b.items ?? []).map((it, i) => (
              <div key={i} className={`flex items-center gap-2 px-2.5 py-2 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: p.line }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold" style={{ background: tint(brand, s.dark ? 28 : 14), color: bInk(brand) }}>
                  {initials(it.label)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-medium ${t.body}`} style={{ color: p.ink }}>{it.label}</p>
                  {it.meta ? <p className={`truncate ${t.sm} ${s.mono ? label : ""}`} style={{ color: p.mut }}>{it.meta}</p> : null}
                </div>
                {it.value ? <span className={`shrink-0 font-medium ${t.sm}`} style={{ color: bInk(brand) }}>{it.value}</span> : null}
                {it.status ? (
                  <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-semibold" style={statusStyle(brand, p, s.dark, it.status)}>{it.status}</span>
                ) : it.tag ? (
                  <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-medium" style={{ background: p.surf, color: p.soft }}>{it.tag}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );

    case "grid":
      return (
        <div>
          {b.title ? <p className={`mb-1.5 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className={`grid gap-2 ${d ? "grid-cols-2" : "grid-cols-3"}`}>
            {(b.cards ?? []).map((c, i) => (
              <div key={i} className={`overflow-hidden ${s.card} border`} style={{ borderColor: p.line, background: p.panel }}>
                <div className="flex h-10 items-center justify-center" style={{ background: `linear-gradient(135deg, ${tint(brand, s.dark ? 32 : 22)}, ${tint(brand, 8)})` }}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-semibold shadow-sm" style={{ background: p.panel, color: bInk(brand) }}>
                    {initials(c.title)}
                  </span>
                </div>
                <div className="p-1.5">
                  <p className={`truncate font-medium ${t.sm}`} style={{ color: p.ink }}>{c.title}</p>
                  {c.meta ? <p className={`truncate text-[7px] ${s.mono ? label : ""}`} style={{ color: p.mut }}>{c.meta}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "kanban":
      return (
        <div>
          {b.title ? <p className={`mb-1.5 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className="grid grid-cols-3 gap-1.5">
            {(b.columns ?? []).map((col, i) => (
              <div key={i} className="rounded-lg p-1.5" style={{ background: p.surf }}>
                <p className={`mb-1 text-[7.5px] font-semibold uppercase tracking-wide ${label}`} style={{ color: p.mut }}>{col.name}</p>
                <div className="space-y-1">
                  {(col.cards ?? []).map((c, j) => (
                    <div key={j} className={`${s.card} border px-1.5 py-1.5`} style={{ borderColor: p.line, background: p.panel, borderLeft: c.done ? `2px solid ${brand}` : undefined }}>
                      <p className="text-[8px] font-medium leading-tight" style={{ color: p.ink }}>{c.title}</p>
                      {c.meta ? <p className={`mt-0.5 text-[6.5px] ${s.mono ? label : ""}`} style={{ color: p.mut }}>{c.meta}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "player":
      return (
        <div className="overflow-hidden rounded-xl">
          <div className="relative" style={{ background: "linear-gradient(135deg,#1e2b4a,#0b1120)" }}>
            <div className={`flex items-center justify-center ${d ? "h-20" : "h-24"}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] text-[#0f1830]" style={{ background: "rgba(255,255,255,0.92)" }}>▶</span>
            </div>
            {b.live ? <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 text-[7.5px] text-white"><Ping color="#4ade80" /> LIVE</div> : null}
            <div className="absolute inset-x-2 bottom-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                <motion.div className="h-full rounded-full bg-white" initial={{ width: "14%" }} animate={reduce ? { width: "40%" } : { width: ["14%", "68%"] }} transition={reduce ? { duration: 0 } : { duration: 6, repeat: Infinity, repeatType: "reverse" }} />
              </div>
              {b.meta ? <div className="mt-1 flex justify-between text-[7px] text-white/70"><span>{b.meta.split("·")[0]?.trim()}</span><span>{b.meta.split("·").slice(-1)[0]?.trim()}</span></div> : null}
            </div>
          </div>
          {b.title ? <p className={`mt-1.5 font-medium ${t.body}`} style={{ color: p.ink }}>{b.title}</p> : null}
        </div>
      );

    case "form":
      return (
        <div className={cardCls} style={cardStyle}>
          {b.title ? <p className={`mb-2 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className="space-y-1.5">
            {(b.items ?? []).map((it, i) => (
              <div key={i} className="flex items-center justify-between rounded-md px-2 py-1.5" style={{ background: p.surf }}>
                <span className={`font-medium ${t.body}`} style={{ color: p.ink }}>{it.label}</span>
                <span className={`${t.sm} ${s.mono ? label : ""}`} style={{ color: bInk(brand) }}>{it.value}</span>
              </div>
            ))}
          </div>
          {b.cta ? <div className="mt-2 rounded-md py-1.5 text-center text-[9px] font-semibold" style={{ background: bInk(brand), color: p.onAccent }}>{b.cta}</div> : null}
        </div>
      );

    case "calendar":
      return (
        <div className={cardCls} style={cardStyle}>
          <div className="flex items-center justify-between">
            <p className={`font-semibold ${t.h}`} style={{ color: p.ink }}>{b.month}</p>
            <span className="text-[9px]" style={{ color: p.mut }}>‹ ›</span>
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-0.5">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => {
              const ev = b.events?.find((e) => Number(e.day) % 7 === i);
              const on = i === (b.active ?? 3);
              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[6.5px]" style={{ color: p.mut }}>{day}</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full text-[7px]" style={on ? { background: bInk(brand), color: p.onAccent, fontWeight: 600 } : { color: p.soft }}>{i + 1}</span>
                  {ev ? <span className="h-0.5 w-3 rounded-full" style={{ background: brand }} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      );

    case "pills":
      return (
        <div className="flex flex-wrap gap-1.5">
          {(b.pills ?? []).map((pl, i) => (
            <span key={i} className={`rounded-full px-2 py-0.5 font-medium ${t.sm} ${s.mono ? label : ""}`} style={{ background: tint(brand, s.dark ? 20 : 10), color: bInk(brand) }}>{pl}</span>
          ))}
        </div>
      );

    case "cta": {
      const btn = <div className="rounded-md py-2 text-center text-[9px] font-semibold" style={{ background: bInk(brand), color: p.onAccent }}>{b.cta}</div>;
      if (b.title || b.sub) {
        return (
          <div className={cardCls} style={cardStyle}>
            {b.title ? <p className={`font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
            {b.sub ? <p className={`mt-0.5 ${t.sm} leading-snug`} style={{ color: p.mut }}>{b.sub}</p> : null}
            <div className="mt-2.5">{btn}</div>
          </div>
        );
      }
      return btn;
    }

    case "fields":
      return (
        <div className={cardCls} style={cardStyle}>
          {b.title ? <p className={`mb-2 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {(b.items ?? []).map((it, i) => (
              <div key={i}>
                <p className={`${t.sm} ${label}`} style={{ color: p.mut }}>{it.label}</p>
                <p className={`truncate ${t.body}`} style={{ color: p.ink }}>{it.value}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "table":
      return (
        <div>
          {b.title ? <p className={`mb-1.5 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className={`overflow-hidden ${s.card} border`} style={{ borderColor: p.line, background: p.panel }}>
            <div className="grid gap-2 px-2.5 py-1.5" style={{ gridTemplateColumns: `1.6fr repeat(${Math.max(1, (b.cols?.length ?? 1) - 1)}, 1fr)`, background: p.surf, borderBottom: `1px solid ${p.line}` }}>
              {(b.cols ?? []).map((c, i) => (
                <span key={i} className={`text-[8px] font-semibold uppercase tracking-wide ${label}`} style={{ color: p.mut }}>{c}</span>
              ))}
            </div>
            {(b.rows ?? []).map((r, i) => (
              <div key={i} className={`grid items-center gap-2 px-2.5 py-1.5 ${i > 0 ? "border-t" : ""}`} style={{ gridTemplateColumns: `1.6fr repeat(${Math.max(1, (b.cols?.length ?? 1) - 1)}, 1fr)`, borderColor: p.line }}>
                {r.cells.map((cell, j) => (
                  <span key={j} className={`truncate ${t.body} ${j === 0 ? "font-medium" : ""} ${j > 0 && s.mono ? label : ""}`} style={{ color: j === 0 ? p.ink : p.soft }}>{cell}</span>
                ))}
                {r.status ? (
                  <span className="flex w-fit items-center gap-1 justify-self-start rounded-full px-1.5 py-0.5 text-[8px] font-semibold" style={statusStyle(brand, p, s.dark, r.status)}>
                    <span className="h-1 w-1 rounded-full bg-current" />{r.status}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );

    case "hub":
      return (
        <div>
          {b.title ? <p className={`mb-1.5 font-semibold ${t.h}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <div className={`grid gap-2 ${d ? "grid-cols-2" : "grid-cols-4"}`}>
            {(b.tiles ?? []).map((tl, i) => (
              <div key={i} className={`${s.card} border p-2.5`} style={{ borderColor: p.line, background: p.panel }}>
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-semibold ${label}`} style={{ color: bInk(brand) }}>{tl.n ?? String(i + 1).padStart(2, "0")}</span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint(brand, 40) }} />
                </div>
                <p className={`mt-1 font-semibold ${t.body}`} style={{ color: p.ink }}>{tl.title}</p>
                <div className="mt-1.5 space-y-1">
                  {(tl.links ?? []).map((lk, j) => (
                    <p key={j} className={`truncate ${t.sm}`} style={{ color: p.soft }}>{lk}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "note":
    default:
      return (
        <div>
          {b.title ? <p className={`mb-0.5 font-semibold ${t.body}`} style={{ color: p.ink }}>{b.title}</p> : null}
          <p className={`${t.sm} leading-snug ${s.mono ? label : ""}`} style={{ color: p.mut }}>{b.text}</p>
        </div>
      );
  }
}

function Blocks({ screen, brand, s, d, masonry }: { screen: Screen; brand: string; s: Skin; d?: boolean; masonry?: boolean }) {
  if (masonry) {
    return (
      <div className="[column-count:2] [column-gap:10px] [&>*]:mb-2.5 [&>*]:break-inside-avoid">
        {screen.blocks.map((b, i) => <BlockView key={i} b={b} brand={brand} s={s} d={d} />)}
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {screen.blocks.map((b, i) => <BlockView key={i} b={b} brand={brand} s={s} d={d} />)}
    </div>
  );
}

/* ------------------------------ web navs ----------------------------- */
function TopNav({ proto, brand, s, active }: { proto: Proto; brand: string; s: Skin; active: number }) {
  const p = s.palette;
  return (
    <div className="flex items-center gap-3 border-b px-4 py-2.5" style={{ borderColor: p.line, background: p.panel }}>
      <span className="flex items-center gap-1.5">
        <AppMark proto={proto} brand={brand} p={p} />
        <span className="text-[11px] font-semibold" style={{ color: p.ink }}>{proto.app}</span>
      </span>
      <div className={`ml-2 flex items-center gap-1 text-[9.5px] ${monoCls(s)}`}>
        {proto.nav.map((n, i) => (
          <span key={n} className="rounded-full px-2 py-0.5" style={i === active ? { background: tint(brand, 12), color: bInk(brand), fontWeight: 600 } : { color: p.mut }}>{n}</span>
        ))}
      </div>
      <span className="ml-auto flex items-center gap-2">
        <span className="rounded-md px-2 py-1 text-[8px] font-semibold" style={{ background: bInk(brand), color: p.onAccent }}>+ New</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[7.5px] font-bold" style={{ background: tint(brand, s.dark ? 30 : 16), color: bInk(brand) }}>MR</span>
      </span>
    </div>
  );
}

function OperatorBar({ proto, brand, s, active }: { proto: Proto; brand: string; s: Skin; active: number }) {
  const p = s.palette;
  return (
    <div className="flex items-center gap-3 border-b px-4 py-2.5" style={{ background: p.panel, color: p.ink, borderColor: p.line }}>
      <span className="flex items-center gap-1.5">
        <AppMark proto={proto} brand={brand} p={p} />
        <span className="text-[11px] font-semibold tracking-tight">{proto.app}</span>
      </span>
      <div className={`ml-2 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.08em] ${monoCls(s)}`}>
        {proto.nav.map((n, i) => (
          <span key={n} style={i === active ? { color: bInk(brand), fontWeight: 600 } : { color: p.mut }}>{n}</span>
        ))}
      </div>
      <span className="ml-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[8px] font-semibold" style={{ background: tint(brand, 12), color: bInk(brand) }}><Ping color="#22b364" /> LIVE</span>
    </div>
  );
}

function SidebarNav({ proto, brand, s, active }: { proto: Proto; brand: string; s: Skin; active: number }) {
  const p = s.palette;
  return (
    <div className="flex flex-col border-r p-3" style={{ borderColor: p.line, background: p.surf }}>
      <div className="flex items-center gap-1.5">
        <AppMark proto={proto} brand={brand} p={p} />
        <span className="truncate text-[11px] font-semibold" style={{ color: p.ink }}>{proto.app}</span>
      </div>
      <div className={`mt-4 space-y-0.5 text-[9.5px] ${monoCls(s)}`}>
        {proto.nav.map((n, i) => (
          <div key={n} className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5" style={i === active ? { background: tint(brand, 12), color: bInk(brand), fontWeight: 600 } : { color: p.mut }}>
            <span className="h-1.5 w-1.5 rounded-sm" style={{ background: i === active ? brand : p.line }} />
            <span className="truncate">{n}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-md p-2 text-[7px] leading-snug" style={{ background: p.panel, color: p.soft, border: `1px solid ${p.line}` }}>{s.key === "rasoft" ? "3 depts · 128 employees" : "4 clients · 42 modules live"}</div>
    </div>
  );
}

function Crumbs({ crumbs, brand, s }: { crumbs: string[]; brand: string; s: Skin }) {
  const p = s.palette;
  return (
    <div className={`mb-1.5 flex flex-wrap items-center gap-1.5 text-[9px] ${monoCls(s)}`}>
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 ? <span style={{ color: p.mut }}>›</span> : null}
            <span style={{ color: last ? brand : p.mut, fontWeight: last ? 600 : 400 }}>{c}</span>
          </span>
        );
      })}
    </div>
  );
}

/* Product chrome that makes console/hub screens read like a shipped tool:
   a search + filter toolbar (for data screens) and a status footer. */
function WebToolbar({ brand, s, screen }: { brand: string; s: Skin; screen: Screen }) {
  const p = s.palette;
  const hasData = screen.blocks.some((b) => ["table", "list", "grid", "kanban"].includes(b.type));
  if (!hasData) return null;
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <div className={`flex flex-1 items-center gap-1.5 rounded-md border px-2 py-1.5 text-[9px] ${monoCls(s)}`} style={{ borderColor: p.line, color: p.mut, background: p.panel }}>
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4-4" /></svg>
        Search {screen.title.toLowerCase()}…
      </div>
      {["All", "Active", "Issues"].map((c, i) => (
        <span key={c} className="shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-medium" style={i === 0 ? { borderColor: brand, color: bInk(brand), background: tint(brand, 8) } : { borderColor: p.line, color: p.mut }}>{c}</span>
      ))}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border" style={{ borderColor: p.line, color: p.mut }}>
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M19 9a7 7 0 0 0-13-2M5 15a7 7 0 0 0 13 2" /></svg>
      </span>
    </div>
  );
}

function WebFooter({ s, screen }: { s: Skin; screen: Screen }) {
  const p = s.palette;
  const dataBlock = screen.blocks.find((b) => ["table", "list"].includes(b.type));
  const n = dataBlock ? (dataBlock.rows?.length ?? dataBlock.items?.length ?? 0) : 0;
  return (
    <div className={`flex shrink-0 items-center justify-between border-t px-4 py-2 text-[8px] ${monoCls(s)}`} style={{ borderColor: p.line, color: p.mut, background: p.panel }}>
      <span>{n ? `Showing ${n} of ${n}` : "All systems nominal"} · last sync 30s ago</span>
      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: "#22b364" }} /> Live · eu-central-1</span>
    </div>
  );
}

/* ------------------------------- web -------------------------------- */
const WEB_H = "h-[410px]";

function WebSurface({ proto, brand, s, screen }: { proto: Proto; brand: string; s: Skin; screen: Screen }) {
  const p = s.palette;
  const activeNav = screen.activeNav ?? 0;
  const index = proto.web.indexOf(screen);

  if (s.nav === "sidebar") {
    return (
      <div className="grid grid-cols-[128px_1fr] text-[11px]" style={{ color: p.ink, background: p.panel }}>
        <SidebarNav proto={proto} brand={brand} s={s} active={activeNav} />
        <div className={`${WEB_H} flex flex-col overflow-hidden`}>
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2" style={{ borderColor: p.line }}>
            <p className={`text-[9px] uppercase tracking-[0.1em] ${monoCls(s)}`} style={{ color: p.mut }}>{proto.nav[activeNav]}</p>
            <span className="rounded-md px-2 py-1 text-[8px] font-semibold" style={{ background: bInk(brand), color: p.onAccent }}>+ New</span>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            {screen.sub ? <p className={`mb-2 text-[9px] ${monoCls(s)}`} style={{ color: p.mut }}>{screen.sub}</p> : null}
            <WebToolbar brand={brand} s={s} screen={screen} />
            <ScreenSwap index={index}><Blocks screen={screen} brand={brand} s={s} masonry={screen.split} /></ScreenSwap>
          </div>
          <WebFooter s={s} screen={screen} />
        </div>
      </div>
    );
  }

  const Nav = s.nav === "operator" ? OperatorBar : TopNav;
  const rich = s.nav === "operator";
  return (
    <div className="text-[11px]" style={{ color: p.ink, background: p.bg }}>
      <Nav proto={proto} brand={brand} s={s} active={activeNav} />
      <div className={`${WEB_H} flex flex-col overflow-hidden`}>
        <div className="flex-1 overflow-hidden p-4">
          {screen.crumbs ? <Crumbs crumbs={screen.crumbs} brand={brand} s={s} /> : null}
          {screen.crumbs ? <p className="mb-1.5 text-[13px] font-semibold" style={{ color: p.ink }}>{screen.title}</p> : null}
          {screen.sub ? <p className={`mb-2 text-[9px] ${monoCls(s)}`} style={{ color: p.mut }}>{screen.sub}</p> : null}
          {rich ? <WebToolbar brand={brand} s={s} screen={screen} /> : null}
          <ScreenSwap index={index}><Blocks screen={screen} brand={brand} s={s} masonry={screen.split} /></ScreenSwap>
        </div>
        {rich ? <WebFooter s={s} screen={screen} /> : null}
      </div>
    </div>
  );
}

/* ------------------------------ tablet ----------------------------- */
function TabletSurface({ proto, brand, s, screen }: { proto: Proto; brand: string; s: Skin; screen: Screen }) {
  const p = s.palette;
  const activeNav = screen.activeNav ?? 0;
  const index = proto.tablet.indexOf(screen);
  return (
    <div className="grid grid-cols-[116px_1fr] text-[10px]" style={{ color: p.ink, background: p.bg }}>
      <div className="flex flex-col border-r p-3" style={{ borderColor: p.line, background: p.surf }}>
        <div className="flex items-center gap-1.5">
          <AppMark proto={proto} brand={brand} p={p} />
          <span className="truncate text-[11px] font-semibold">{proto.app}</span>
        </div>
        <div className={`mt-4 space-y-0.5 text-[9.5px] ${monoCls(s)}`}>
          {proto.nav.map((n, i) => (
            <div key={n} className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5" style={i === activeNav ? { background: tint(brand, s.dark ? 20 : 10), color: bInk(brand), fontWeight: 600 } : { color: p.mut }}>
              <span className="h-1.5 w-1.5 rounded-sm" style={{ background: i === activeNav ? brand : p.line }} />
              <span className="truncate">{n}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto rounded-lg p-2 text-[7px] leading-snug" style={{ background: p.panel, color: p.soft, border: `1px solid ${p.line}` }}>Invite your team</div>
      </div>
      <div className="h-[384px] overflow-hidden p-3.5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-semibold">{screen.title}</p>
            {screen.sub ? <p className={`text-[8.5px] ${monoCls(s)}`} style={{ color: p.mut }}>{screen.sub}</p> : null}
          </div>
          <span className="h-5 w-5 rounded-full" style={{ background: tint(brand, s.dark ? 24 : 14) }} />
        </div>
        <div className="h-[334px] overflow-hidden">
          <ScreenSwap index={index}>
            {(() => {
              const masonry = !screen.blocks.some((b) => ["kanban", "grid", "player"].includes(b.type));
              // masonry columns are phone-width, so render blocks at the dense size
              return <Blocks screen={screen} brand={brand} s={s} masonry={masonry} d={masonry} />;
            })()}
          </ScreenSwap>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ phone ------------------------------ */
function PhoneSurface({ proto, brand, s, screen, step }: { proto: Proto; brand: string; s: Skin; screen: Screen; step: number }) {
  const p = s.palette;
  const tabs = proto.tabs ?? proto.nav.slice(0, 4);
  const index = proto.mobile.indexOf(screen);
  return (
    <div className="flex flex-1 flex-col px-3 pb-3 pt-1" style={{ color: p.ink, background: p.bg }}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[8px] ${monoCls(s)}`} style={{ color: p.mut }}>{proto.app}</p>
          <p className="text-[11px] font-semibold leading-tight">{screen.title}</p>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: bInk(brand), color: p.onAccent }}>MR</span>
      </div>
      <div className="mt-2 h-[318px] overflow-hidden">
        <ScreenSwap index={index}><Blocks screen={screen} brand={brand} s={s} d /></ScreenSwap>
      </div>
      <div className="mt-2 flex justify-around border-t pt-2" style={{ borderColor: p.line }}>
        {tabs.map((tb, i) => <span key={tb} className="h-3.5 w-3.5 rounded" style={{ background: i === step % tabs.length ? brand : p.line }} />)}
      </div>
    </div>
  );
}

/* ------------------------------ chrome ----------------------------- */
function LaptopChrome({ proto, s, children }: { proto: Proto; s: Skin; children: React.ReactNode }) {
  const p = s.palette;
  return (
    <div className="min-w-0">
      {/* screen */}
      <div className={`overflow-hidden ${s.radius} border-[3px]`} style={{ borderColor: s.bezel, background: p.bg, boxShadow: "0 40px 80px -34px rgba(15,22,50,0.5)" }}>
        <div className="flex items-center gap-2 px-3.5 py-2" style={{ background: s.dark ? "#0a0d16" : "#eef0f4", borderBottom: `1px solid ${s.dark ? "#161b28" : "#e2e5ec"}` }}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e4574c]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e9b02e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
          <div className={`ml-3 flex-1 truncate rounded-md px-3 py-1 text-center text-[10px] ${monoCls(s)}`} style={{ background: s.dark ? "#161b28" : "#ffffff", color: p.mut }}>
            {proto.app.toLowerCase().replace(/\s+/g, "")}.app
          </div>
        </div>
        {children}
      </div>
      {/* laptop deck */}
      <div className="relative mx-auto" style={{ width: "116%", marginLeft: "-8%" }}>
        <div className="h-[10px]" style={{ background: `linear-gradient(180deg, ${s.deck}, ${mix(s.deck, 70, "#8f95a1")})`, borderRadius: "0 0 12px 12px", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.45)" }} />
        <div className="mx-auto h-[5px] w-20 rounded-b-lg" style={{ background: mix(s.deck, 60, "#7f8592") }} />
      </div>
    </div>
  );
}

/* ------------------------------ flows ------------------------------ */
export function ProtoWebFlow({ proto, brand, skinKey }: { proto: Proto; brand: string; skinKey?: string }) {
  const s = skinFor(skinKey);
  const { i, setI, setPaused } = useAutoStep(proto.web.length, 3600);
  return (
    <div className="min-w-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="-mx-5 overflow-x-auto px-5 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="w-max lg:w-auto">
          <Frame>
            <LaptopChrome proto={proto} s={s}>
              <WebSurface proto={proto} brand={brand} s={s} screen={proto.web[i]} />
            </LaptopChrome>
          </Frame>
        </div>
      </div>
      <Dots count={proto.web.length} active={i} onPick={setI} brand={brand} />
    </div>
  );
}

export function ProtoTabletFlow({ proto, brand, skinKey }: { proto: Proto; brand: string; skinKey?: string }) {
  const s = skinFor(skinKey);
  const { i, setI, setPaused } = useAutoStep(proto.tablet.length, 3800);
  return (
    <div className="w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="-mx-5 overflow-x-auto px-5 pb-6 pt-1 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
        <div className="w-max lg:w-auto">
          <Frame delay={0.05} className={`overflow-hidden ${s.radius} border-[9px] border-[#12151c]`}>
            <div style={{ boxShadow: "0 34px 70px -30px rgba(20,30,70,0.45)" }}>
              <TabletSurface proto={proto} brand={brand} s={s} screen={proto.tablet[i]} />
            </div>
          </Frame>
        </div>
      </div>
      <Dots count={proto.tablet.length} active={i} onPick={setI} brand={brand} />
    </div>
  );
}

export function ProtoPhoneFlow({ proto, brand, skinKey }: { proto: Proto; brand: string; skinKey?: string }) {
  const s = skinFor(skinKey);
  const { i, setI, setPaused } = useAutoStep(proto.mobile.length, 3800);
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Frame delay={0.15} className="mx-auto w-full max-w-[178px] overflow-hidden rounded-[1.9rem] border-[7px] border-[#12151c] shadow-[0_26px_50px_-22px_rgba(20,30,70,0.5)]">
        <div className="relative flex min-h-[356px] flex-col pt-4" style={{ background: s.palette.bg }}>
          <div className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full" style={{ background: s.dark ? "#2a3140" : "#d7dbe3" }} />
          <PhoneSurface proto={proto} brand={brand} s={s} screen={proto.mobile[i]} step={i} />
        </div>
      </Frame>
      <Dots count={proto.mobile.length} active={i} onPick={setI} brand={brand} />
    </div>
  );
}

/* ---- device switcher: one stage, pick laptop / tablet / phone ---- */
const LaptopIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M2 20h20" />
  </svg>
);
const TabletIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" /><path d="M11 18h2" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" />
  </svg>
);

/* Widths tuned so each device reads at a real aspect ratio against its
   fixed-height screen: laptop ~3:2, tablet ~4:3, phone ~19.5:9. */
const DEVICES = [
  { key: "laptop", label: "Desktop", px: 680, icon: <LaptopIcon /> },
  { key: "tablet", label: "Tablet", px: 510, icon: <TabletIcon /> },
  { key: "phone", label: "Mobile", px: 186, icon: <PhoneIcon /> },
] as const;

// per-device frame geometry — animated between, so the shell morphs shape.
// Widths are clearly distinct (laptop ≫ tablet ≫ phone); ratios are textbook.
// Same height across all three (the laptop's) so the stage footprint never
// changes on switch — only the width / shape morphs, and the page never moves.
// Static map; hoisted to module scope so it isn't rebuilt on every render/tick.
const DIMS: Record<string, { w: number; h: number; r: number; bw: number; bezel: string }> = {
  laptop: { w: 720, h: 470, r: 13, bw: 3, bezel: "#1b1d24" }, // space-black frame
  tablet: { w: 560, h: 470, r: 22, bw: 9, bezel: "#12151c" },
  phone: { w: 224, h: 470, r: 34, bw: 8, bezel: "#12151c" },
};

export function DeviceStage({ proto, brand, skinKey }: { proto: Proto; brand: string; skinKey?: string }) {
  const s = skinFor(skinKey);
  const reduce = useReducedMotion();
  const [dev, setDev] = useState(0);
  const [touched, setTouched] = useState(false);
  const [paused, setPaused] = useState(false);
  const [screen, setScreen] = useState(0);

  const devKey = DEVICES[dev].key;
  const screens = devKey === "laptop" ? proto.web : devKey === "tablet" ? proto.tablet : proto.mobile;

  // Natural flow: play this device's screens start → end, then advance to the
  // next device and play its flow — a continuous laptop → tablet → phone tour.
  // Stops advancing devices once the user picks one, but keeps looping screens.
  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => {
      setScreen((x) => {
        if (x + 1 >= screens.length) {
          if (!touched) setDev((d) => (d + 1) % DEVICES.length);
          return 0;
        }
        return x + 1;
      });
    }, 2900);
    return () => clearInterval(t);
  }, [reduce, paused, screens.length, touched]);

  const dim = DIMS[devKey];
  const sc = screens[screen % screens.length];

  const content = (
    <div className="flex h-full flex-col" style={{ background: s.palette.bg }}>
      {devKey === "laptop" ? (
        <>
          <div className="flex shrink-0 items-center gap-2 px-3.5 py-2" style={{ background: s.dark ? "#0a0d16" : "#eef0f4", borderBottom: `1px solid ${s.palette.line}` }}>
            <span className="h-2.5 w-2.5 rounded-full bg-[#e4574c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e9b02e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]" />
            <div className={`ml-3 flex-1 truncate rounded-md px-3 py-1 text-center text-[10px] ${monoCls(s)}`} style={{ background: s.dark ? "#161b28" : "#ffffff", color: s.palette.mut }}>
              {proto.app.toLowerCase().replace(/\s+/g, "")}.app
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <WebSurface proto={proto} brand={brand} s={s} screen={sc} />
          </div>
        </>
      ) : devKey === "tablet" ? (
        <div className="h-full overflow-hidden">
          <TabletSurface proto={proto} brand={brand} s={s} screen={sc} />
        </div>
      ) : (
        <div className="relative flex h-full flex-col pt-4">
          <div className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full" style={{ background: s.dark ? "#2a3140" : "#d7dbe3" }} />
          <PhoneSurface proto={proto} brand={brand} s={s} screen={sc} step={screen} />
        </div>
      )}
    </div>
  );

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* fixed-height stage — the shell morphs inside it, so the page never shifts.
          justify-start, not justify-center: centring a flex child that overflows its
          scroll container pushes the start edge to a negative offset, and scrollLeft
          cannot go below zero — so roughly a quarter of the mock was unreachable on a
          phone, cut off mid-word, on all four case studies. mx-auto on the child
          centres it whenever it does fit, which is every width from lg up. */}
      <div className="-mx-5 flex h-[520px] items-center justify-start overflow-x-auto px-5 lg:mx-0 lg:overflow-x-visible lg:px-0">
        <div className="relative mx-auto">
          <motion.div
            animate={{ width: dim.w, height: dim.h, borderRadius: dim.r, borderWidth: dim.bw, borderColor: dim.bezel }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
            className="relative overflow-hidden"
            style={{ borderStyle: "solid", background: s.palette.bg, boxShadow: "0 36px 78px -30px rgba(18,26,54,0.5)" }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={devKey}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: "easeInOut" }}
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{ width: dim.w - dim.bw * 2, height: dim.h - dim.bw * 2 }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* laptop base — hangs off the shell bottom, fades out when morphing away */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2"
            animate={{ opacity: devKey === "laptop" ? 1 : 0, width: devKey === "laptop" ? dim.w + 44 : dim.w }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
          >
            <div
              className="h-[11px]"
              style={{ background: "linear-gradient(180deg, #34363f, #191b21)", borderRadius: "0 0 13px 13px", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.14)" }}
            />
            <div className="mx-auto h-[5px] w-24 rounded-b-lg" style={{ background: "#0f1014" }} />
          </motion.div>
        </div>
      </div>

      {/* device picker */}
      {/* Wraps rather than overflows: three pills exceed the viewport at 320px,
          which pushed the whole document 7px wide and gave every case study a
          horizontal scrollbar on the smallest phones. */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        {DEVICES.map((d, i) => {
          const on = i === dev;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setTouched(true);
                setDev(i);
                setScreen(0); // restart this device's flow from the first screen
              }}
              aria-pressed={on}
              className="flex items-center gap-2 rounded-full border px-4 py-2 font-[family-name:var(--font-display)] text-[11.5px] font-medium uppercase tracking-[0.1em] transition"
              style={
                on
                  ? {
                      borderColor: brand,
                      // Not bInk() here. That blends toward the *light* palette ink,
                      // correct inside the mock screen (every skin is light) and wrong
                      // on this tab bar, which sits on the themed page — in dark mode the
                      // selected tab measured 1.40:1 on Axinom, less legible than the
                      // unselected ones at 7.14:1. Blending toward the theme's own text
                      // colour keeps the brand hue and follows the theme.
                      color: `color-mix(in srgb, ${brand}, var(--sr-text) 55%)`,
                      background: tint(brand, 10),
                    }
                  : { borderColor: "var(--sr-hairline)", color: "var(--sr-muted)" }
              }
            >
              {d.icon}
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
