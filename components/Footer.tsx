import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
            Easy<span className="text-[var(--accent-brass)]">Tools</span>
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {SITE.tagline} Tutti gli strumenti funzionano direttamente nel
            browser: nessun file viene caricato su server.
          </p>
          <a
            href={SITE.koFi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 border border-[var(--accent-brass)] text-[var(--accent-brass)] font-medium text-sm px-4 py-2 rounded-md hover:bg-[var(--accent-brass)] hover:text-[#15181C] transition"
          >
            Sostieni il progetto ☕
          </a>
        </div>

        <div>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-4">
            CATEGORIE
          </p>
          <ul className="space-y-2">
            {[
              { href: "/strumenti/pdf", label: "PDF" },
              { href: "/strumenti/immagini", label: "Immagini" },
              { href: "/strumenti/testo", label: "Testo" },
              { href: "/strumenti/utility", label: "Utility" },
              { href: "/strumenti/ai", label: "AI" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-steel)] transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-4">
            LEGALE
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-steel)] transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-steel)] transition">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/affiliate-disclosure" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-steel)] transition">
                Trasparenza affiliati
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-steel)] transition">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)] py-5">
        <p className="font-tool text-xs text-[var(--text-muted)] text-center">
          EASYTOOLS · TUTTI GLI STRUMENTI SONO GRATUITI
        </p>
      </div>
    </footer>
  );
}
