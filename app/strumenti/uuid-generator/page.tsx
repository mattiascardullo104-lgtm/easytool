"use client";

import { useState } from "react";

const newUuid = () => crypto.randomUUID();

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([newUuid()]);
  const [count, setCount] = useState(1);
  const [dashes, setDashes] = useState(true);

  const generate = (n: number) => {
    setCount(n);
    const list = Array.from({ length: n }, newUuid);
    setUuids(list);
  };

  const display = uuids.map((u) => (dashes ? u : u.replace(/-/g, ""))).join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(display);
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
          UUID Generator
        </h1>

        <div className="mb-6">
          <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
            <span>Number of UUIDs</span>
            <span className="text-[var(--accent-brass)]">{count}</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={count}
            onChange={(e) => generate(Number(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dashes}
              onChange={(e) => setDashes(e.target.checked)}
              className="accent-[var(--accent-brass)]"
            />
            <span className="font-tool text-xs text-[var(--text-muted)]">
              With dashes (standard format)
            </span>
          </label>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
          <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap max-h-72 overflow-y-auto font-mono break-all">
            {display}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => generate(count)}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Regenerate
          </button>
          <button
            onClick={copy}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Copy
          </button>
        </div>
      </div>
    </main>
  );
}
