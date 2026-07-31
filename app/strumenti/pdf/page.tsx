const tools = [
  {
    name: "PDF Merger",
    desc: "Unisci più PDF in uno solo, direttamente nel browser.",
    href: "/strumenti/pdf-merger",
  },
  {
    name: "PDF Splitter",
    desc: "Estrai un intervallo di pagine da un PDF.",
    href: "/strumenti/pdf-splitter",
  },
  {
    name: "PDF Compressor",
    desc: "Riduci il peso dei tuoi PDF, direttamente nel browser.",
    href: "/strumenti/pdf-compressor",
  },
  {
    name: "PDF Editor",
    desc: "Modifica metadati, aggiungi testo e ruota le pagine.",
    href: "/strumenti/pdf-editor",
  },
  {
    name: "Immagini → PDF",
    desc: "Unisci le tue immagini in un unico file PDF.",
    href: "/strumenti/images-to-pdf",
  },
  {
    name: "PDF → Immagini",
    desc: "Converti ogni pagina del PDF in un'immagine PNG.",
    href: "/strumenti/pdf-to-images",
  },
  {
    name: "PDF Rotator",
    desc: "Ruota tutte le pagine del PDF di 90°, 180° o 270°.",
    href: "/strumenti/pdf-rotator",
  },
];

export default function PDFHub() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna alla home
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          CATEGORIA
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-8">
          PDF
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tools.map((tool) => (
            <a key={tool.name}
              href={tool.href}
              className="block border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-surface)] hover:border-[var(--accent-brass)] transition"
            >
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                {tool.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
