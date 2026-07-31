"use client";

import { useState } from "react";

export default function Base64Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    setError("");
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setError("Unable to encode the text.");
    }
  };

  const decode = () => {
    setError("");
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setError("The text is not valid Base64.");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setError("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
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
          Base64 Encoder/Decoder
        </h1>

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={7}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 font-mono"
        />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={encode}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Encode
          </button>
          <button
            onClick={decode}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Decode
          </button>
        </div>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-4">{error}</p>}

        {output && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Result
              </p>
              <div className="flex gap-2">
                <button
                  onClick={swap}
                  className="font-tool text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] px-4 py-2 rounded-md hover:border-[var(--accent-steel)] transition"
                >
                  Use as input
                </button>
                <button
                  onClick={copy}
                  className="font-tool text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] px-4 py-2 rounded-md hover:border-[var(--accent-steel)] transition"
                >
                  Copy
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] break-all max-h-72 overflow-y-auto font-mono">
              {output}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
