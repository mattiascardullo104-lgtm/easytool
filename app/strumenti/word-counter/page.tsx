"use client";

import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · TEXT
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Word Counter
        </h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition resize-none"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
            <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Words</span>
            <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{words}</span>
          </div>
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
            <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Characters</span>
            <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{characters}</span>
          </div>
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
            <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">No spaces</span>
            <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{charactersNoSpaces}</span>
          </div>
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
            <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Reading</span>
            <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{readingTime} min</span>
          </div>
        </div>
      </div>
    </main>
  );
}