"use client";

import { useMemo, useState } from "react";

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const slug = useMemo(() => slugify(input), [input]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(slug);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/testo" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a Testo
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · TESTO
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Slug Generator
        </h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi o incolla un titolo, es. Le 10 migliori ricette di pasta"
          rows={5}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-6"
        />

        {slug && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Slug
              </p>
              <button
                onClick={copy}
                className="font-tool text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] px-4 py-2 rounded-md hover:border-[var(--accent-steel)] transition"
              >
                Copia
              </button>
            </div>
            <p className="text-sm text-[var(--accent-brass)] font-mono break-all">{slug}</p>
            <p className="font-tool text-xs text-[var(--text-muted)] mt-4">
              URL: /{slug}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
