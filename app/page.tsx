import dynamic from "next/dynamic";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import InteractiveDemo from "@/components/InteractiveDemo";
import { SITE } from "@/lib/site";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const categories = [
  {
    code: "Aa",
    name: "Text",
    desc: "Count words, generate lorem ipsum, remove duplicates.",
    tools: "4 tools",
    href: "/strumenti/testo",
  },
  {
    code: "PDF",
    name: "PDF",
    desc: "Compress, merge, split, rotate and watermark your documents.",
    tools: "6 tools",
    href: "/strumenti/pdf",
  },
  {
    code: "Img",
    name: "Images",
    desc: "Compress, convert, resize, OCR and extract text.",
    tools: "6 tools",
    href: "/strumenti/immagini",
  },
  {
    code: "Utl",
    name: "Utility",
    desc: "QR codes, passwords, colors, UUIDs, timer and more.",
    tools: "9 tools",
    href: "/strumenti/utility",
  },
  {
    code: "AI",
    name: "AI Arena",
    desc: "Generate images and summarize text with artificial intelligence.",
    tools: "2 tools",
    href: "/strumenti/ai",
  },
];

const featured = [
  { name: "PDF Compressor", desc: "Reduce PDF size by up to 90%.", href: "/strumenti/pdf-compressor" },
  { name: "Image Compressor", desc: "Compress images with no visible loss.", href: "/strumenti/image-compressor" },
  { name: "QR Code Generator", desc: "Links, texts and WiFi in a QR code.", href: "/strumenti/qr-code-generator" },
  { name: "Password Generator", desc: "Secure passwords in one click.", href: "/strumenti/password-generator" },
  { name: "PDF Merger", desc: "Combine multiple PDFs into a single file.", href: "/strumenti/pdf-merger" },
  { name: "AI Image Generator", desc: "Images generated with AI, for free.", href: "/strumenti/ai-image-generator" },
];

export default function Home() {
  return (
    <main className="bg-[var(--bg-base)]">
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,161,90,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(92,138,196,0.10),transparent_55%)]" />
          <Scene3D />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]" />
        </div>

        <div className="relative z-10 px-6 py-24 max-w-3xl mx-auto text-center">
          <p className="font-tool text-xs tracking-[0.3em] text-[var(--accent-brass)] mb-6 animate-fade-in">
            {SITE.name.toUpperCase()} · DIGITAL TOOLKIT
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6 animate-fade-in-up">
            Online tools.
            <br />
            <span className="bg-gradient-to-r from-[var(--accent-brass)] to-[var(--accent-steel)] bg-clip-text text-transparent">
              Free. In your browser.
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl mx-auto animate-fade-in-up">
            25+ essential tools for PDF, images, text and utility.
            No installs, no registration, no limits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <a
              href="#categorie"
              className="w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
            >
              Explore the tools
            </a>
            <a
              href={SITE.paypalDonate}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-8 py-3.5 rounded-lg hover:border-[var(--accent-brass)] transition"
            >
              Buy me a coffee ☕
            </a>
          </div>
        </div>
      </section>

      <AdSlot className="max-w-3xl mx-auto px-6 mb-4" />

      <section id="categorie" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
            CATEGORIES
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
            Everything you need, organized
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group relative block border border-[var(--border-subtle)] rounded-xl p-6 bg-[var(--bg-surface)] hover:border-[var(--accent-brass)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(201,161,90,0.12)] transition-all duration-300 animate-rise"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-3xl bg-[radial-gradient(circle_at_top_right,rgba(201,161,90,0.12),transparent_70%)]" />
              <span className="font-tool text-xs text-[var(--accent-steel)] block mb-4">
                {cat.code}
              </span>
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
                {cat.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{cat.desc}</p>
              <span className="font-tool text-xs text-[var(--accent-brass)] group-hover:tracking-wider transition-all">
                {cat.tools} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
            MOST USED
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
            Featured tools
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group border border-[var(--border-subtle)] rounded-xl p-6 bg-[var(--bg-surface)] hover:border-[var(--accent-steel)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(92,138,196,0.12)] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-steel)] transition">
                {tool.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
            TRY IT NOW
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mb-3">
            Try some of the tools
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            No downloads, no waiting: the tools work right here, in real time.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <InteractiveDemo />
        </div>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border border-[var(--border-subtle)] rounded-2xl p-10 bg-[var(--bg-surface)] relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,138,196,0.08),transparent_60%)]" />
          <div className="relative">
            <p className="font-tool text-xs tracking-widest text-[var(--accent-steel)] mb-3">
              EASYTOOLS PREMIUM
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
              No ads for €1.99/month
            </h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              Remove every ad from the site and support development. Cancel
              anytime.
            </p>
            <Link
              href="/premium"
              className="inline-block bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
            >
              Discover Premium
            </Link>
          </div>
        </div>

        <div className="border border-[var(--border-subtle)] rounded-2xl p-10 bg-[var(--bg-surface)] relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,161,90,0.08),transparent_60%)]" />
          <div className="relative">
            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
              SUPPORT EASYTOOLS
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
              Did we help you? Buy us a coffee ☕
            </h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              A one-time donation covers hosting and development costs and keeps
              every tool free forever.
            </p>
            <a
              href={SITE.paypalDonate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[var(--accent-brass)] text-[var(--accent-brass)] font-medium px-8 py-3.5 rounded-lg hover:bg-[var(--accent-brass)] hover:text-[#15181C] transition"
            >
              Make a donation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
