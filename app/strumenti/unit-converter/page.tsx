"use client";

import { useState } from "react";

const categories = [
  {
    name: "Lunghezza",
    units: ["Metri", "Chilometri", "Centimetri", "Miglia", "Piedi", "Pollici"],
    toBase: (v: number, u: string) =>
      u === "Metri" ? v
      : u === "Chilometri" ? v * 1000
      : u === "Centimetri" ? v / 100
      : u === "Miglia" ? v * 1609.344
      : u === "Piedi" ? v * 0.3048
      : u === "Pollici" ? v * 0.0254
      : v,
    fromBase: (v: number, u: string) =>
      u === "Metri" ? v
      : u === "Chilometri" ? v / 1000
      : u === "Centimetri" ? v * 100
      : u === "Miglia" ? v / 1609.344
      : u === "Piedi" ? v / 0.3048
      : u === "Pollici" ? v / 0.0254
      : v,
  },
  {
    name: "Peso",
    units: ["Chilogrammi", "Grammi", "Libbre", "Once", "Tonnellate"],
    toBase: (v: number, u: string) =>
      u === "Chilogrammi" ? v
      : u === "Grammi" ? v / 1000
      : u === "Libbre" ? v * 0.453592
      : u === "Once" ? v * 0.0283495
      : u === "Tonnellate" ? v * 1000
      : v,
    fromBase: (v: number, u: string) =>
      u === "Chilogrammi" ? v
      : u === "Grammi" ? v * 1000
      : u === "Libbre" ? v / 0.453592
      : u === "Once" ? v / 0.0283495
      : u === "Tonnellate" ? v / 1000
      : v,
  },
  {
    name: "Temperatura",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    toBase: (v: number, u: string) =>
      u === "Celsius" ? v
      : u === "Fahrenheit" ? ((v - 32) * 5) / 9
      : v - 273.15,
    fromBase: (v: number, u: string) =>
      u === "Celsius" ? v
      : u === "Fahrenheit" ? (v * 9) / 5 + 32
      : v + 273.15,
  },
];

export default function UnitConverter() {
  const [category, setCategory] = useState(categories[0]);
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(category.units[0]);
  const [to, setTo] = useState(category.units[1]);

  const num = parseFloat(value);
  const result =
    isNaN(num)
      ? 0
      : category.fromBase(category.toBase(num, from), to);

  const selectCategory = (cat: typeof categories[0]) => {
    setCategory(cat);
    setFrom(cat.units[0]);
    setTo(cat.units[1]);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a Utility
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · UTILITY
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Unit Converter
        </h1>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => selectCategory(cat)}
              className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                category.name === cat.name
                  ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Valore</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Da</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                >
                  {category.units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">A</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                >
                  {category.units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
          <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Risultato</span>
          <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            {isNaN(num) ? "—" : `${result.toLocaleString("it-IT")} ${to}`}
          </span>
        </div>
      </div>
    </main>
  );
}
