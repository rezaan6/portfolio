/* Content-only loading skeleton shown during route navigation. The site
   header/footer are persistent (root layout), so this only fills the content. */

export function RouteSkeleton() {
  return (
    <div className="signal-room">
      <section className="px-4 pt-6 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[1.8rem] border border-[var(--sr-hairline)] bg-[var(--sr-bg-alt)] px-6 py-14 sm:px-12 sm:py-16 lg:px-14">
            <div className="sr-skeleton h-3 w-36" />
            <div className="mt-6 sr-skeleton h-11 w-4/5" />
            <div className="mt-3 sr-skeleton h-11 w-3/5" />
            <div className="mt-8 sr-skeleton h-4 w-1/2" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[1.6rem] border border-[var(--sr-hairline)] bg-[var(--sr-panel)] p-6"
            >
              <div className="sr-skeleton h-10 w-10 rounded-full" />
              <div className="mt-5 sr-skeleton h-4 w-3/4" />
              <div className="mt-2.5 sr-skeleton h-4 w-2/3" />
              <div className="mt-2.5 sr-skeleton h-4 w-1/2" />
              <div className="mt-6 sr-skeleton h-6 w-1/3 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
