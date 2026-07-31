import { SITE } from "@/lib/site";

export default function TutorialSection() {
  const videos = SITE.tutorials.filter((v) => v.id && v.title);

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
          GUIDA
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mb-3">
          Video tutorial
        </h2>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Impara a usare gli strumenti in pochi minuti, passo dopo passo.
        </p>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-surface)]"
            >
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] p-5">
                {v.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border border-[var(--border-subtle)] rounded-xl p-6 bg-[var(--bg-surface)] flex flex-col items-center justify-center gap-3 min-h-[220px] opacity-70"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-brass)" strokeWidth="1.5">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Tutorial in arrivo
              </p>
              <p className="font-tool text-xs text-[var(--text-muted)] text-center">
                Aggiungi i tuoi video in lib/site.ts
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
