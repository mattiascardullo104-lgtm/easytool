const tools = [
  {
    name: "Image Compressor",
    desc: "Comprimi e ridimensiona le tue immagini direttamente nel browser.",
    href: "/strumenti/image-compressor",
  },
  {
    name: "Image Converter",
    desc: "Converti immagini in PNG, JPG o WEBP direttamente nel browser.",
    href: "/strumenti/image-converter",
  },
  {
    name: "Image Resizer",
    desc: "Ridimensiona le immagini in percentuale o in pixel.",
    href: "/strumenti/image-resizer",
  },
  {
    name: "OCR Text Extractor",
    desc: "Estrai il testo scritto nelle immagini con il riconoscimento ottico.",
    href: "/strumenti/ocr-extractor",
  },
  {
    name: "Image Filters",
    desc: "Applica filtri come bianco e nero, seppia, negativo o sfocatura.",
    href: "/strumenti/image-filters",
  },
];

export default function ImmaginiHub() {
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
          Immagini
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
