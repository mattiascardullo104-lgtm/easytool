const categories = [
  {
    code: "Aa",
    name: "Testo",
    desc: "Conta parole, riscrivi, correggi, genera titoli.",
    href: "/strumenti/word-counter",
  },
  {
    code: "PDF",
    name: "PDF",
    desc: "Comprimi, unisci, dividi e converti i tuoi documenti.",
    href: "/strumenti/pdf",
  },
  {
    code: "Img",
    name: "Immagini",
    desc: "Comprimi, converti e ridimensiona in un tocco.",
    href: "/strumenti/immagini",
  },
  {
    code: "Utl",
    name: "Utility",
    desc: "QR code, password sicure, conversioni, generatori.",
    href: "/strumenti/utility",
  },
  {
    code: "AI",
    name: "AI Arena",
    desc: "Scopri e confronta le migliori intelligenze artificiali.",
    href: "#",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)]">
        <span className="font-display text-lg font-semibold text-[var(--text-primary)]">
          EasyTools
        </span>
        <span className="font-tool text-xs text-[var(--text-muted)] hidden sm:block">
          5 CATEGORIE · GRATIS
        </span>
      </nav>

      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-4">
          EASYTOOLS · TOOLKIT DIGITALE
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] leading-tight mb-5">
          Tools online, 100% free.
        </h1>
        <p className="text-[var(--text-muted)] text-lg mb-8">
          Cinque categorie, strumenti essenziali, zero installazioni.
          Tutto gratis, tutto nel browser.
        </p>
        <a href="#categorie" className="inline-block bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition">
          Esplora gli strumenti
        </a>
      </section>

      <section id="categorie" className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            
              <a key={cat.name}
              href={cat.href}
              className="block border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-surface)] hover:border-[var(--accent-brass)] transition"
            >
              <span className="font-tool text-xs text-[var(--accent-steel)] block mb-3">
                {cat.code}
              </span>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                {cat.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">{cat.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <footer className="px-6 py-8 text-center border-t border-[var(--border-subtle)]">
        <p className="font-tool text-xs text-[var(--text-muted)]">
          EASYTOOLS · v0.1 · MVP
        </p>
      </footer>
    </main>
  );
}