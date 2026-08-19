export default function Home() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 font-bold">
              R
            </div>

            <span className="text-lg font-semibold tracking-tight">
              REDROOM<span className="text-red-500">.ORN</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
  href="/login"
  className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
>
  Log in
</a>

            <a
  href="/login"
  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
>
  Get Started
</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-6 py-20">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            UPSC Preparation Command Centre
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Prepare smarter.
            <br />
            <span className="text-red-500">Stay consistent.</span>
            <br />
            Clear UPSC.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">
            REDROOM brings your syllabus, study plan, PYQs, tests,
            revision and performance analytics into one focused
            preparation system.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-xl bg-red-600 px-7 py-4 font-semibold transition hover:bg-red-500">
              Start Your Preparation →
            </button>

            <button className="rounded-xl border border-white/10 px-7 py-4 font-semibold text-white/80 transition hover:bg-white/5 hover:text-white">
              Explore REDROOM
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-2xl font-bold">01</p>
              <p className="mt-1 text-sm text-white/40">Study System</p>
            </div>

            <div>
              <p className="text-2xl font-bold">∞</p>
              <p className="mt-1 text-sm text-white/40">Practice</p>
            </div>

            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="mt-1 text-sm text-white/40">Your Workspace</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}