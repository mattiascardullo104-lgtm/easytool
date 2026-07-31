const tools = [
  {
    name: "Password Generator",
    desc: "Crea password sicure e casuali, con controllo su lunghezza e simboli.",
    href: "/strumenti/password-generator",
  },
  {
    name: "Password Manager",
    desc: "Salva le tue password in un vault cifrato nel browser.",
    href: "/strumenti/password-manager",
  },
  {
    name: "QR Code Generator",
    desc: "Trasforma un link o un testo in un codice QR scaricabile.",
    href: "/strumenti/qr-code-generator",
  },
  {
    name: "Unit Converter",
    desc: "Converti lunghezze, pesi e temperature tra le unità più comuni.",
    href: "/strumenti/unit-converter",
  },
  {
    name: "Random Generator",
    desc: "Numeri casuali, lancio della moneta e del dado.",
    href: "/strumenti/random-generator",
  },
  {
    name: "Base64 Encoder/Decoder",
    desc: "Codifica e decodifica testo in Base64.",
    href: "/strumenti/base64-converter",
  },
  {
    name: "URL Encoder/Decoder",
    desc: "Codifica e decodifica URL e testo con caratteri speciali.",
    href: "/strumenti/url-encoder",
  },
  {
    name: "Color Converter",
    desc: "Converti colori tra HEX, RGB e HSL con anteprima.",
    href: "/strumenti/color-converter",
  },
  {
    name: "UUID Generator",
    desc: "Genera UUID v4, uno o più alla volta.",
    href: "/strumenti/uuid-generator",
  },
  {
    name: "Timer",
    desc: "Cronometro e conto alla rovescia con avviso sonoro.",
    href: "/strumenti/timer",
  },
];

export default function UtilityHub() {
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
          Utility
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