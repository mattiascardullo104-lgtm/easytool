"use client";

import { useState } from "react";

export default function RemoveDuplicates() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sort, setSort] = useState(false);

  const cleaned = (() => {
    const lines = input.split(/\r?\n/);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    return sort ? result.sort((a, b) => a.localeCompare(b, "it")) : result;
  })();

  const removedCount = input.split(/\r?\n/).length - cleaned.length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cleaned.join("\n"));
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
          Remove Duplicate Lines
        </h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Incolla qui il tuo testo, una riga per riga..."
          rows={10}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 font-mono"
        />

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="accent-[var(--accent-brass)]"
            />
            <span className="font-tool text-xs text-[var(--text-muted)]">
              Distingui maiuscole/minuscole
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sort}
              onChange={(e) => setSort(e.target.checked)}
              className="accent-[var(--accent-brass)]"
            />
            <span className="font-tool text-xs text-[var(--text-muted)]">Ordina alfabeticamente</span>
          </label>
        </div>

        {input && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Risultato
              </p>
              <span className="font-tool text-xs text-[var(--text-muted)]">
                {removedCount > 0
                  ? `Rimosse ${removedCount} righe duplicate`
                  : "Nessuna riga duplicata"}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap max-h-72 overflow-y-auto font-mono">
              {cleaned.join("\n")}
            </p>
            <button
              onClick={copy}
              className="mt-4 border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-2 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              Copia risultato
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
