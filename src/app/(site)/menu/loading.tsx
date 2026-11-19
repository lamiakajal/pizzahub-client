// Shown while the menu loads.
export default function MenuLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-6 lg:px-8" aria-busy="true">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-56 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="aspect-4/3 animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
