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
      setError("The text is too short. Paste at least 50 characters.");
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
        setError(data.error || "Error while summarizing.");
      } else {
        setSummary(data.summary);
        if (data.keywords) setKeywords(data.keywords);
      }
    } catch {
      setError("Unable to reach the service. Try again.");
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
          ← Back to Text
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · TEXT
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          AI Summarizer
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Paste a text and the AI will extract a summary from it. Up to 100 free summaries per month.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the article or text to summarize here..."
          className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition resize-none mb-4"
        />

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Summary length
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "short", label: "Short" },
              { value: "medium", label: "Medium" },
              { value: "long", label: "Long" },
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
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && !loading && (
          <div className="mt-6">
            <div className="border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-surface)] mb-4">
              <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
              {keywords && (
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  <p className="font-tool text-xs text-[var(--accent-steel)] mb-2">KEYWORDS</p>
                  <p className="font-tool text-xs text-[var(--text-muted)]">{keywords}</p>
                </div>
              )}
            </div>
            <button
              onClick={copy}
              className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              {copied ? "Copied!" : "Copy summary"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
