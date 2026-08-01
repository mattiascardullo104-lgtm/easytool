"use client";

import { useState } from "react";

const algorithms = [
  { id: "SHA-1", name: "SHA-1" },
  { id: "SHA-256", name: "SHA-256" },
  { id: "SHA-384", name: "SHA-384" },
  { id: "SHA-512", name: "SHA-512" },
] as const;

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const hashText = async (text: string, algo: string) => {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, data);
  return toHex(digest);
};

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async (text: string) => {
    setInput(text);
    if (!text) {
      setHashes({});
      return;
    }
    const results: Record<string, string> = {};
    for (const algo of algorithms) {
      results[algo.id] = await hashText(text, algo.id);
    }
    setHashes(results);
  };

  const copy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to Utility
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · UTILITY
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Hash Generator
        </h1>

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Text to hash
          </label>
          <textarea
            value={input}
            onChange={(e) => generate(e.target.value)}
            placeholder="Type or paste some text here..."
            rows={5}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
        </div>

        {input && (
          <div className="space-y-4 mb-6">
            {algorithms.map((algo) => (
              <div
                key={algo.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)]">
                    {algo.name}
                  </p>
                  <button
                    onClick={() => copy(hashes[algo.id] || "")}
                    className="font-tool text-xs text-[var(--text-muted)] hover:text-[var(--accent-steel)] transition"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-[var(--text-primary)] font-mono break-all">
                  {hashes[algo.id] || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
