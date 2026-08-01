import dynamic from "next/dynamic";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import InteractiveDemo from "@/components/InteractiveDemo";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const categories = [
  {
    code: "Aa",
    name: "Text",
    desc: "Count words, generate lorem ipsum, remove duplicates.",
    tools: "9 tools",
    href: "/strumenti/testo",
  },
  {
    code: "PDF",
    name: "PDF",
    desc: "Compress, merge, split, rotate and watermark your documents.",
    tools: "9 tools",
    href: "/strumenti/pdf",
  },
  {
    code: "Img",
    name: "Images",
    desc: "Compress, convert, resize, OCR and extract text.",
    tools: "7 tools",
    href: "/strumenti/immagini",
  },
  {
    code: "Utl",
    name: "Utility",
    desc: "QR codes, passwords, colors, UUIDs, timer and more.",
    tools: "14 tools",
    href: "/strumenti/utility",
  },
  {
    code: "AI",
    name: "AI Arena",
    desc: "Generate images and summarize text with artificial intelligence.",
    tools: "5 tools",
    href: "/strumenti/ai",
  },
];

const popularTools = [
  { name: "PDF Merger", desc: "Combine multiple PDFs into a single file.", href: "/strumenti/pdf-merger" },
  { name: "PDF Compressor", desc: "Reduce PDF size by up to 90%.", href: "/strumenti/pdf-compressor" },
  { name: "Images to PDF", desc: "Convert JPG and PNG into a single PDF.", href: "/strumenti/images-to-pdf" },
  { name: "OCR Extractor", desc: "Extract text from images and scans.", href: "/strumenti/ocr-extractor" },
  { name: "Image Converter", desc: "Convert images between common formats.", href: "/strumenti/image-converter" },
  { name: "Text to Speech", desc: "Turn any text into natural audio.", href: "/strumenti/text-to-speech" },
  { name: "QR Code Generator", desc: "Links, texts and WiFi in a QR code.", href: "/strumenti/qr-code-generator" },
  { name: "Password Generator", desc: "Secure passwords in one click.", href: "/strumenti/password-generator" },
  { name: "AI Chat", desc: "Chat with an AI assistant, for free.", href: "/strumenti/ai-chat" },
  { name: "AI Image Generator", desc: "Images generated with AI, for free.", href: "/strumenti/ai-image-generator" },
  { name: "Secure Messages", desc: "Share messages that self-destruct.", href: "/strumenti/secure-messages" },
  { name: "AI Summarizer", desc: "Summarize long texts with AI.", href: "/strumenti/ai-summarizer" },
];

const secondaryButtonClass =
  "inline-flex items-center border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-sm px-4 py-2 rounded-md hover:border-[var(--accent-brass)] hover:bg-[var(--bg-surface)] transition";

const sectionHeader = (label: string, title: string, subtitle?: string) => (
  <Reveal className="text-center mb-12">
    <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">{label}</p>
    <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
      {title}
    </h2>
    {subtitle && <p className="text-[var(--text-muted)] mt-3 max-w-xl mx-auto">{subtitle}</p>}
  </Reveal>
);

export default function Home() {
  return (
    <main className="bg-[var(--bg-base)]">
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid-backdrop" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,161,90,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(92,138,196,0.12),transparent_55%)]" />
          <Scene3D />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]" />
        </div>

        <div className="relative z-10 px-6 py-24 max-w-3xl mx-auto text-center">
          <p className="font-tool text-xs tracking-[0.3em] text-[var(--accent-brass)] mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2.5 animate-pulse-glow rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 backdrop-blur px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-brass)]" />
              {SITE.name.toUpperCase()} · DIGITAL TOOLKIT
            </span>
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6 animate-fade-in-up">
            Online tools.
            <br />
            <span className="text-gradient-animated">Free. In your browser.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl mx-auto animate-fade-in-up">
            50+ essential tools for PDF, images, text, utility and AI.
            No installs, no registration, no limits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link
              href="#categorie"
              className="btn-shine w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3.5 rounded-lg hover:opacity-95 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
            >
              Explore the tools
            </Link>
            <Link
              href="#popolari"
              className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-8 py-3.5 rounded-lg hover:border-[var(--accent-steel)] hover:bg-[var(--bg-surface)] transition"
            >
              Popular tools
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 animate-fade-in-up">
            {[
              { n: "50+", l: "free tools" },
              { n: "100%", l: "in your browser" },
              { n: "0", l: "uploads, no limits" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  {s.n}
                </div>
                <div className="font-tool text-[10px] tracking-widest text-[var(--text-muted)] uppercase mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href="#categorie"
          aria-label="Scroll to categories"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--text-muted)] hover:text-[var(--accent-brass)] transition-colors z-10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-bob-down"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </section>

      <AdSlot className="max-w-3xl mx-auto px-6 mb-4" />

      <section id="categorie" className="px-6 py-20 max-w-6xl mx-auto">
        {sectionHeader("CATEGORIES", "Everything you need, organized")}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 90} className="h-full">
              <Link
                href={cat.href}
                className="card-glow group relative block h-full border border-[var(--border-subtle)] rounded-xl p-6 bg-[var(--bg-surface)] hover:border-[var(--accent-steel)] hover:-translate-y-1.5 hover:shadow-[0_12px_48px_rgba(92,138,196,0.14)] transition-all duration-300"
              >
                <span className="glow-overlay" />
                <span className="absolute top-5 right-5 text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-brass)] text-lg mb-4 group-hover:border-[var(--accent-brass)]/60 group-hover:scale-105 transition-all duration-300">
                  {cat.code}
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{cat.desc}</p>
                <span className="font-tool text-xs text-[var(--accent-steel)]">
                  {cat.tools}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="popolari" className="px-6 pb-20 max-w-6xl mx-auto">
        {sectionHeader("POPULAR TOOLS", "Featured tools")}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool, i) => (
            <Reveal key={tool.href} delay={(i % 3) * 70}>
              <Link
                href={tool.href}
                className="card-glow group relative block h-full border border-[var(--border-subtle)] rounded-xl p-5 bg-[var(--bg-surface)] hover:border-[var(--accent-steel)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(92,138,196,0.12)] transition-all duration-300"
              >
                <span className="glow-overlay" />
                <span className="absolute top-4 right-4 text-[var(--text-muted)] group-hover:text-[var(--accent-brass)] group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
                <h3 className="font-medium text-sm text-[var(--text-primary)] mb-1 pr-6 group-hover:text-[var(--accent-steel)] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] pr-6">{tool.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        {sectionHeader(
          "TRY IT NOW",
          "Try some of the tools",
          "No downloads, no waiting: the tools work right here, in real time."
        )}
        <Reveal className="max-w-2xl mx-auto">
          <InteractiveDemo />
        </Reveal>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        {sectionHeader("SUPPORT", "We are here to help")}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "Email assistance",
              desc: "Questions, bugs or feedback? Write to us and we will reply as soon as possible.",
              cta: <a href={`mailto:${SITE.email}`} className="btn-shine inline-flex items-center bg-[var(--accent-brass)] text-[#15181C] font-medium text-sm px-4 py-2 rounded-md hover:opacity-95 transition">{SITE.email}</a>,
            },
            {
              icon: (
                <span className="text-lg leading-none">★</span>
              ),
              title: "Go Premium",
              desc: "Remove every ad and support development for €1.99/month.",
              cta: <Link href="/premium" className={secondaryButtonClass}>Go Premium</Link>,
            },
            {
              icon: (
                <span className="font-tool text-sm leading-none">100%</span>
              ),
              title: "100% free",
              desc: "Every tool runs directly in your browser: your files are never uploaded to any server.",
              cta: <Link href="/strumenti/utility" className={secondaryButtonClass}>Browse all tools</Link>,
            },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 90} className="h-full">
              <div className="card-glow border border-[var(--border-subtle)] rounded-xl p-6 bg-[var(--bg-surface)] flex flex-col h-full hover:border-[var(--accent-brass)]/50 hover:-translate-y-1.5 hover:shadow-[0_12px_48px_rgba(201,161,90,0.10)] transition-all duration-300">
                <span className="glow-overlay" />
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-brass)] mb-4">
                  {card.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-6">{card.desc}</p>
                <div className="mt-auto">{card.cta}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden text-center border border-[var(--border-subtle)] rounded-2xl p-10 bg-[var(--bg-surface)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,138,196,0.10),transparent_60%)]" />
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-40 blur-3xl animate-float"
              style={{
                background:
                  "radial-gradient(circle, rgba(201,161,90,0.18), transparent 65%)",
              }}
            />
            <div className="relative">
              <p className="font-tool text-xs tracking-widest text-[var(--accent-steel)] mb-3">
                EASYTOOLS PREMIUM
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
                No ads for <span className="text-gradient">€1.99/month</span>
              </h2>
              <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                Remove every ad from the site and support development. Cancel
                anytime.
              </p>
              <Link
                href="/premium"
                className="btn-shine inline-block bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3.5 rounded-lg hover:opacity-95 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
              >
                Discover Premium
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
