"use client";

import { useState } from "react";

export default function AISummarizer() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("medium");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const summarize = async () => {
    setError("");
    if (text.trim().length < 50) {
      setError("Il testo è troppo corto. Incolla almeno 50 caratteri.");
      return;
    }
    setLoading(true);
    setSummary("");
    setKeywords("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), length }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Errore durante il riassunto.");
      } else {
        setSummary(data.summary);
        if (data.keywords) setKeywords(data.keywords);
      }
    } catch {
      setError("Impossibile contattare il servizio. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
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
          AI Summarizer
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Incolla un testo e l&apos;AI ne estrae un riassunto. Fino a 100 riassunti gratuiti al mese.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Incolla qui l'articolo o il testo da riassumere..."
          className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition resize-none mb-4"
        />

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Lunghezza del riassunto
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "short", label: "Corto" },
              { value: "medium", label: "Medio" },
              { value: "long", label: "Lungo" },
            ].map((o) => (
              <button
                key={o.value}
                onClick={() => setLength(o.value)}
                className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                  length === o.value
                    ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="font-tool text-xs text-red-400 mb-4">{error}</p>}

        <button
          onClick={summarize}
          disabled={loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Riassunto in corso..." : "Riassumi"}
        </button>

        {summary && !loading && (
          <div className="mt-6">
            <div className="border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-surface)] mb-4">
              <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
              {keywords && (
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  <p className="font-tool text-xs text-[var(--accent-steel)] mb-2">PAROLE CHIAVE</p>
                  <p className="font-tool text-xs text-[var(--text-muted)]">{keywords}</p>
                </div>
              )}
            </div>
            <button
              onClick={copy}
              className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              {copied ? "Copiato!" : "Copia riassunto"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
