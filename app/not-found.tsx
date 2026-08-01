export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-24 flex items-center justify-center">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-display text-7xl font-bold text-[var(--accent-brass)]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-8 inline-block bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
