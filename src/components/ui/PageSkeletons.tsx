import { Skeleton } from './skeleton';

// ── Home page hero skeleton ─────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] bg-slate-950 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 space-y-6">
        <Skeleton className="h-4 w-48 bg-white/10" />
        <Skeleton className="h-16 w-[70%] bg-white/10" />
        <Skeleton className="h-16 w-[50%] bg-white/10" />
        <Skeleton className="h-5 w-[60%] bg-white/10" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-14 w-40 rounded-xl bg-white/10" />
          <Skeleton className="h-14 w-40 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ── Competition carousel skeleton ───────────────────────
export function CompetitionCarouselSkeleton() {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-16 space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-[40%]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[2.5rem] overflow-hidden">
              <Skeleton className="h-72 w-full" />
              <div className="p-8 space-y-4">
                <Skeleton className="h-7 w-[80%]" />
                <Skeleton className="h-4 w-[50%]" />
                <Skeleton className="h-4 w-[40%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats / about section skeleton ──────────────────────
export function AboutSkeleton() {
  return (
    <section className="bg-slate-950 py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-3">
              <Skeleton className="h-14 w-24 mx-auto bg-white/10" />
              <Skeleton className="h-4 w-32 mx-auto bg-white/10" />
            </div>
          ))}
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-[90%] bg-white/10" />
          <Skeleton className="h-4 w-[80%] bg-white/10" />
        </div>
      </div>
    </section>
  );
}

// ── Upcoming events skeleton ────────────────────────────
export function EventsSkeleton() {
  return (
    <section className="py-24 px-4 md:px-8 bg-plra-bg-soft">
      <div className="container mx-auto">
        <div className="mb-12 space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-[35%]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm">
              <Skeleton className="h-52 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-[75%]" />
                <Skeleton className="h-4 w-[50%]" />
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-10 w-32 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Full home page skeleton ─────────────────────────────
export function HomePageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <CompetitionCarouselSkeleton />
      <AboutSkeleton />
      <EventsSkeleton />
    </>
  );
}

// ── Admin page skeleton (table pages) ───────────────────
export function AdminPageSkeleton() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-10 w-72" />
      <div className="bg-admin-card-bg border border-admin-border rounded-xl overflow-hidden">
        <div className="bg-admin-sidebar-bg p-4 flex gap-4">
          <Skeleton className="h-5 w-32 bg-white/20" />
          <Skeleton className="h-5 w-24 bg-white/20" />
          <Skeleton className="h-5 w-20 bg-white/20 ml-auto" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b border-admin-border flex gap-4 items-center">
            <Skeleton className="h-5 w-[35%]" />
            <Skeleton className="h-5 w-[20%]" />
            <Skeleton className="h-5 w-[15%]" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin form page skeleton ────────────────────────────
export function AdminFormSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="max-w-2xl mx-auto bg-white border border-admin-border rounded-[2rem] overflow-hidden">
        <div className="p-8 bg-admin-bg/50 border-b border-admin-border">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Generic content page skeleton ───────────────────────
export function ContentPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] bg-slate-950 flex items-end">
        <div className="container mx-auto px-4 pb-12 space-y-4">
          <Skeleton className="h-12 w-[40%] bg-white/10" />
          <Skeleton className="h-4 w-[30%] bg-white/10" />
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto py-16 px-4 space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-4 w-full" style={{ width: `${100 - i * 5}%` }} />
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
