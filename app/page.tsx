import dynamic from "next/dynamic";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import TutorialSection from "@/components/TutorialSection";
import { SITE } from "@/lib/site";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const categories = [
  {
    code: "Aa",
    name: "Testo",
    desc: "Conta parole, genera lorem ipsum, rimuovi duplicati.",
    tools: "4 strumenti",
    href: "/strumenti/testo",
  },
  {
    code: "PDF",
    name: "PDF",
    desc: "Comprimi, unisci, dividi, ruota e filigrana i documenti.",
    tools: "6 strumenti",
    href: "/strumenti/pdf",
  },
  {
    code: "Img",
    name: "Immagini",
    desc: "Comprimi, converti, ridimensiona, OCR ed estrai testo.",
    tools: "6 strumenti",
    href: "/strumenti/immagini",
  },
  {
    code: "Utl",
    name: "Utility",
    desc: "QR code, password, colori, UUID, timer e altro.",
    tools: "9 strumenti",
    href: "/strumenti/utility",
  },
  {
    code: "AI",
    name: "AI Arena",
    desc: "Genera immagini e riassumi testi con l'intelligenza artificiale.",
    tools: "2 strumenti",
    href: "/strumenti/ai",
  },
];

const featured = [
  { name: "PDF Compressor", desc: "Riduci il peso dei PDF fino al 90%.", href: "/strumenti/pdf-compressor" },
  { name: "Image Compressor", desc: "Comprimi immagini senza perdita visibile.", href: "/strumenti/image-compressor" },
  { name: "QR Code Generator", desc: "Link, testi e WiFi in un codice QR.", href: "/strumenti/qr-code-generator" },
  { name: "Password Generator", desc: "Password sicure in un clic.", href: "/strumenti/password-generator" },
  { name: "PDF Merger", desc: "Unisci più PDF in un unico file.", href: "/strumenti/pdf-merger" },
  { name: "AI Image Generator", desc: "Immagini generate con l'AI, gratis.", href: "/strumenti/ai-image-generator" },
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
            {SITE.name.toUpperCase()} · TOOLKIT DIGITALE
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6 animate-fade-in-up">
            Strumenti online.
            <br />
            <span className="bg-gradient-to-r from-[var(--accent-brass)] to-[var(--accent-steel)] bg-clip-text text-transparent">
              Gratis. Nel tuo browser.
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl mx-auto animate-fade-in-up">
            Oltre 25 strumenti essenziali per PDF, immagini, testo e utility.
            Zero installazioni, zero registrazioni, zero limiti.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <a
              href="#categorie"
              className="w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
            >
              Esplora gli strumenti
            </a>
            <a
              href={SITE.koFi}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-8 py-3.5 rounded-lg hover:border-[var(--accent-brass)] transition"
            >
              Offri un caffè ☕
            </a>
          </div>
        </div>
      </section>

      <AdSlot className="max-w-3xl mx-auto px-6 mb-4" />

      <section id="categorie" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
            CATEGORIE
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
            Tutto ciò che ti serve, organizzato
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
            PIÙ USATI
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
            Strumenti in evidenza
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

      <TutorialSection />

      <section className="px-6 pb-24 max-w-3xl mx-auto text-center">
        <div className="border border-[var(--border-subtle)] rounded-2xl p-10 bg-[var(--bg-surface)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,161,90,0.08),transparent_60%)]" />
          <div className="relative">
            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
              SOSTIENI EASYTOOLS
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
              Ti è stato utile? Offrici un caffè ☕
            </h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-lg mx-auto">
              Ogni donazione copre costi di hosting e sviluppo e ci permette di
              tenere tutti gli strumenti gratis per sempre.
            </p>
            <a
              href={SITE.koFi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
            >
              Fai una donazione
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
