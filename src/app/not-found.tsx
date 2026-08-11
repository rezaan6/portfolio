import Link from "next/link";

export default function NotFound() {
  return (
    <div className="signal-room flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.3em] text-[var(--sr-accent)]">
        404 · Not found
      </p>
      <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] text-[var(--sr-text)]">
        This page shipped elsewhere.
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-7 text-[var(--sr-muted)]">
        The link you followed doesn&apos;t exist — but the work does.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-[var(--sr-accent-solid)] px-5 py-2.5 text-[14px] font-semibold text-[var(--sr-accent-ink)] transition hover:opacity-90"
        >
          Back home
        </Link>
        <Link
          href="/work"
          className="rounded-full border border-[var(--sr-hairline)] px-5 py-2.5 text-[14px] font-semibold text-[var(--sr-text)] transition hover:border-[var(--sr-accent)]"
        >
          See the work
        </Link>
        <Link
          href="/projects"
          className="rounded-full border border-[var(--sr-hairline)] px-5 py-2.5 text-[14px] font-semibold text-[var(--sr-text)] transition hover:border-[var(--sr-accent)]"
        >
          Browse projects
        </Link>
      </div>
    </div>
  );
}
