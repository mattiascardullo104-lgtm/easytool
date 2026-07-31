const tools = [
  {
    name: "Word Counter",
    desc: "Conta parole, caratteri e tempo di lettura in tempo reale.",
    href: "/strumenti/word-counter",
  },
  {
    name: "Text Case Converter",
    desc: "Converti il testo in maiuscolo, minuscolo, titolo e altro.",
    href: "/strumenti/text-case-converter",
  },
  {
    name: "AI Summarizer",
    desc: "Riassumi articoli e testi lunghi con l'intelligenza artificiale.",
    href: "/strumenti/ai-summarizer",
  },
  {
    name: "Lorem Ipsum Generator",
    desc: "Genera testo segnaposto in parole, frasi o paragrafi.",
    href: "/strumenti/lorem-ipsum",
  },
  {
    name: "Remove Duplicate Lines",
    desc: "Elimina le righe duplicate da un testo incollato.",
    href: "/strumenti/remove-duplicates",
  },
  {
    name: "Slug Generator",
    desc: "Trasforma un titolo in uno slug adatto agli URL.",
    href: "/strumenti/slug-generator",
  },
];

export default function TestoHub() {
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
          Testo
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
