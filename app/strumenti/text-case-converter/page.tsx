"use client";

import { useState } from "react";

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const apply = (fn: (s: string) => string) => {
    setText(fn(text));
  };

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          Text Case Converter
        </h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi o incolla qui il tuo testo..."
          className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition resize-none mb-6"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => apply((s) => s.toUpperCase())}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-4 py-3 rounded-md hover:opacity-90 transition"
          >
            MAIUSCOLO
          </button>
          <button
            onClick={() => apply((s) => s.toLowerCase())}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            minuscolo
          </button>
          <button
            onClick={() =>
              apply((s) =>
                s
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              )
            }
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Title Case
          </button>
          <button
            onClick={() =>
              apply((s) => {
                const lower = s.toLowerCase();
                return lower.charAt(0).toUpperCase() + lower.slice(1);
              })
            }
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Frase
          </button>
          <button
            onClick={() => apply((s) => s.replace(/\s+/g, "_"))}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            snake_case
          </button>
          <button
            onClick={() => apply((s) => s.replace(/\s+/g, "-"))}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            kebab-case
          </button>
        </div>

        <button
          onClick={copy}
          disabled={!text}
          className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition disabled:opacity-40"
        >
          {copied ? "Copiato!" : "Copia testo"}
        </button>
      </div>
    </main>
  );
}
