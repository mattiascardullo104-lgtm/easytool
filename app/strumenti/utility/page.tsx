const tools = [
  {
    name: "Secure Messages",
    desc: "End-to-end encrypted chat: find people by email or username.",
    href: "/strumenti/secure-messages",
  },
  {
    name: "Password Generator",
    desc: "Generate strong, random passwords with control over length and symbols.",
    href: "/strumenti/password-generator",
  },
  {
    name: "Password Manager",
    desc: "Store your passwords in an encrypted vault in your browser.",
    href: "/strumenti/password-manager",
  },
  {
    name: "QR Code Generator",
    desc: "Turn a link or text into a downloadable QR code.",
    href: "/strumenti/qr-code-generator",
  },
  {
    name: "Unit Converter",
    desc: "Convert lengths, weights and temperatures between the most common units.",
    href: "/strumenti/unit-converter",
  },
  {
    name: "Random Generator",
    desc: "Random numbers, coin flips and dice rolls.",
    href: "/strumenti/random-generator",
  },
  {
    name: "Base64 Encoder/Decoder",
    desc: "Encode and decode text to and from Base64.",
    href: "/strumenti/base64-converter",
  },
  {
    name: "URL Encoder/Decoder",
    desc: "Encode and decode URLs and text with special characters.",
    href: "/strumenti/url-encoder",
  },
  {
    name: "Color Converter",
    desc: "Convert colors between HEX, RGB and HSL with live preview.",
    href: "/strumenti/color-converter",
  },
  {
    name: "UUID Generator",
    desc: "Generate UUID v4, one or many at a time.",
    href: "/strumenti/uuid-generator",
  },
  {
    name: "Timer",
    desc: "Stopwatch and countdown with sound alert.",
    href: "/strumenti/timer",
  },
  {
    name: "Age Calculator",
    desc: "Calculate your exact age and next birthday.",
    href: "/strumenti/age-calculator",
  },
  {
    name: "Percentage Calculator",
    desc: "Percentages, proportions and percentage change.",
    href: "/strumenti/percentage-calculator",
  },
  {
    name: "Hash Generator",
    desc: "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes.",
    href: "/strumenti/hash-generator",
  },
  {
    name: "Base Converter",
    desc: "Convert numbers between bases 2, 8, 10, 16 and more.",
    href: "/strumenti/base-converter",
  },
];

export default function UtilityHub() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          CATEGORY
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