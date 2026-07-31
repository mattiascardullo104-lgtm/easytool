const tools = [
  {
    name: "Word Counter",
    desc: "Count words, characters and reading time in real time.",
    href: "/strumenti/word-counter",
  },
  {
    name: "Text Case Converter",
    desc: "Convert text to uppercase, lowercase, title case and more.",
    href: "/strumenti/text-case-converter",
  },
  {
    name: "AI Summarizer",
    desc: "Summarize articles and long texts with artificial intelligence.",
    href: "/strumenti/ai-summarizer",
  },
  {
    name: "Lorem Ipsum Generator",
    desc: "Generate placeholder text in words, sentences or paragraphs.",
    href: "/strumenti/lorem-ipsum",
  },
  {
    name: "Remove Duplicate Lines",
    desc: "Remove duplicate lines from pasted text.",
    href: "/strumenti/remove-duplicates",
  },
  {
    name: "Slug Generator",
    desc: "Turn a title into a URL-friendly slug.",
    href: "/strumenti/slug-generator",
  },
];

export default function TestoHub() {
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
          Text
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
