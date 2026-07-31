"use client";

import { useState } from "react";

const bases = [2, 3, 4, 5, 8, 10, 12, 16, 32, 36];

const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const convert = (value: string, fromBase: number, toBase: number) => {
  const decimal = parseInt(value.toUpperCase(), fromBase);
  if (decimal === 0) return "0";
  let result = "";
  let n = decimal;
  while (n > 0) {
    result = digits[n % toBase] + result;
    n = Math.floor(n / toBase);
  }
  return result;
};

export default function BaseConverter() {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convertNumber = () => {
    setError("");
    setResult("");

    if (value.trim() === "") {
      setError("Please enter a number.");
      return;
    }

    const normalized = value.toUpperCase();
    for (const char of normalized) {
      const digitValue = digits.indexOf(char);
      if (digitValue === -1 || digitValue >= fromBase) {
        setError(`The digit "${char}" is not valid for base ${fromBase}.`);
        return;
      }
    }

    setResult(convert(normalized, fromBase, toBase));
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
          Base Converter
        </h1>

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Number
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. FF for base 16"
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
              From base
            </label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
            >
              {bases.map((base) => (
                <option key={base} value={base}>
                  Base {base}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
              To base
            </label>
            <select
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
            >
              {bases.map((base) => (
                <option key={base} value={base}>
                  Base {base}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={convertNumber}
          className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition mb-6"
        >
          Convert
        </button>

        {error && (
          <p className="font-tool text-xs text-red-400 text-center mb-6">
            {error}
          </p>
        )}

        {result !== "" && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <p className="font-tool text-xs text-[var(--text-muted)] mb-2">
              {value.toUpperCase()} (BASE {fromBase}) = {result} (BASE {toBase})
            </p>
            <p className="font-display text-3xl font-semibold text-[var(--accent-brass)] font-mono break-all">
              {result}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
