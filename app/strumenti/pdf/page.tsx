const tools = [
  {
    name: "PDF Merger",
    desc: "Merge multiple PDFs into one, directly in your browser.",
    href: "/strumenti/pdf-merger",
  },
  {
    name: "PDF Splitter",
    desc: "Extract a range of pages from a PDF.",
    href: "/strumenti/pdf-splitter",
  },
  {
    name: "PDF Compressor",
    desc: "Reduce the size of your PDFs, directly in your browser.",
    href: "/strumenti/pdf-compressor",
  },
  {
    name: "PDF Editor",
    desc: "Edit metadata, add text and rotate pages.",
    href: "/strumenti/pdf-editor",
  },
  {
    name: "Images to PDF",
    desc: "Merge your images into a single PDF file.",
    href: "/strumenti/images-to-pdf",
  },
  {
    name: "PDF to Images",
    desc: "Convert each PDF page into a PNG image.",
    href: "/strumenti/pdf-to-images",
  },
  {
    name: "PDF Rotator",
    desc: "Rotate all PDF pages by 90°, 180° or 270°.",
    href: "/strumenti/pdf-rotator",
  },
];

export default function PDFHub() {
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
