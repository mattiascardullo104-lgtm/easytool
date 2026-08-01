"use client";

import { useState } from "react";

type Mode = "percentOf" | "isWhatPercent" | "change";

const modes: { id: Mode; label: string }[] = [
  { id: "percentOf", label: "X% of Y" },
  { id: "isWhatPercent", label: "X is what % of Y" },
  { id: "change", label: "Percentage change" },
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const compute = () => {
    setError("");
    setResult("");

    if (a.trim() === "" || b.trim() === "") {
      setError("Please fill in both fields.");
      return;
    }

    const x = Number(a);
    const y = Number(b);

    if (isNaN(x) || isNaN(y)) {
      setError("Please enter valid numbers.");
      return;
    }

    if (mode === "percentOf") {
      setResult(`${(x / 100) * y}`);
    } else if (mode === "isWhatPercent") {
      if (y === 0) {
        setError("The divisor cannot be zero.");
        return;
      }
      setResult(`${((x / y) * 100)}`);
    } else {
      if (y === 0) {
        setError("The starting value cannot be zero.");
        return;
      }
      setResult(`${((x - y) / y) * 100}`);
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
          Percentage Calculator
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                setResult("");
                setError("");
              }}
              className={
                "font-tool text-xs px-4 py-3 rounded-md border transition " +
                (mode === m.id
                  ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]")
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            {mode === "percentOf"
              ? "Percentage (X)"
              : mode === "isWhatPercent"
              ? "Value (X)"
              : "From value"}
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder={mode === "change" ? "e.g. 120" : "e.g. 25"}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
        </div>

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            {mode === "percentOf"
              ? "Value (Y)"
              : mode === "isWhatPercent"
              ? "Total (Y)"
              : "To value"}
          </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder={mode === "change" ? "e.g. 150" : "e.g. 200"}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
        </div>

        <button
          onClick={compute}
          className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition mb-6"
        >
          Calculate
        </button>

        {error && (
          <p className="font-tool text-xs text-red-400 text-center mb-6">
            {error}
          </p>
        )}

        {result !== "" && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <p className="font-tool text-xs text-[var(--text-muted)] mb-2">
              {mode === "percentOf"
                ? `${a}% OF ${b}`
                : mode === "isWhatPercent"
                ? `${a} IS WHAT % OF ${b}`
                : `CHANGE FROM ${b} TO ${a}`}
            </p>
            <p className="font-display text-3xl font-semibold text-[var(--accent-brass)]">
              {result}
              {mode === "percentOf" ? "" : "%"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
