"use client";

import { useState } from "react";

export default function RandomGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [number, setNumber] = useState<number | null>(null);
  const [coin, setCoin] = useState("");
  const [dice, setDice] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const generateNumber = () => {
    if (max <= min) return;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    setNumber(n);
    setHistory((prev) => [n, ...prev].slice(0, 5));
  };

  const flipCoin = () => {
    setCoin(Math.random() < 0.5 ? "Heads" : "Tails");
  };

  const rollDice = () => {
    setDice(Math.floor(Math.random() * 6) + 1);
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
          Random Generator
        </h1>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
          <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Random number
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Minimum</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
              />
            </div>
            <div>
              <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Maximum</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
              />
            </div>
          </div>
          <button
            onClick={generateNumber}
            className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition mb-4"
          >
            Generate
          </button>
          <div className="text-center">
            <span className="font-display text-4xl font-semibold text-[var(--text-primary)]">
              {number ?? "—"}
            </span>
          </div>
          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
              <p className="font-tool text-xs text-[var(--text-muted)] mb-2">Last 5:</p>
              <div className="flex gap-2 flex-wrap">
                {history.map((h, i) => (
                  <span key={i} className="font-tool text-xs text-[var(--text-muted)] border border-[var(--border-subtle)] rounded px-2 py-1">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5 mb-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 text-center">
            <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Coin
            </p>
            <button
              onClick={flipCoin}
              className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition mb-4"
            >
              Flip
            </button>
            <span className="font-display text-2xl font-semibold text-[var(--accent-brass)]">
              {coin || "—"}
            </span>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 text-center">
            <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Die
            </p>
            <button
              onClick={rollDice}
              className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-3 rounded-md hover:border-[var(--accent-steel)] transition mb-4"
            >
              Roll
            </button>
            <span className="font-display text-2xl font-semibold text-[var(--accent-brass)]">
              {dice || "—"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
