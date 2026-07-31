"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

const links = [
  { href: "/strumenti/pdf", label: "PDF" },
  { href: "/strumenti/immagini", label: "Immagini" },
  { href: "/strumenti/testo", label: "Testo" },
  { href: "/strumenti/utility", label: "Utility" },
  { href: "/strumenti/ai", label: "AI" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0E1113]/80 border-b border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-lg bg-[var(--accent-brass)]/20 group-hover:bg-[var(--accent-brass)]/30 transition" />
            <span className="font-display font-bold text-[var(--accent-brass)]">ET</span>
          </span>
          <span className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Easy<span className="text-[var(--accent-brass)]">Tools</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-tool text-xs text-[var(--text-muted)] px-3 py-2 rounded-md hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={SITE.koFi}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 bg-[var(--accent-brass)] text-[#15181C] font-medium text-sm px-4 py-2 rounded-md hover:opacity-90 hover:shadow-[0_0_24px_rgba(201,161,90,0.35)] transition"
          >
            Offri un caffè ☕
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--text-primary)] p-2"
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-tool text-xs text-[var(--text-muted)] px-3 py-2 rounded-md hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={SITE.koFi}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-center bg-[var(--accent-brass)] text-[#15181C] font-medium text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Offri un caffè ☕
          </a>
        </nav>
      )}
    </header>
  );
}
