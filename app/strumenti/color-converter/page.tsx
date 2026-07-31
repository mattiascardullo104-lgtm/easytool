"use client";

import { useMemo, useState } from "react";

const hexToRgb = (hex: string): [number, number, number] | null => {
  const m = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)) as [number, number, number];
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const toHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("");

export default function ColorConverter() {
  const [hex, setHex] = useState("#C9A15A");

  const rgb = useMemo(() => hexToRgb(hex), [hex]);

  const hsl = useMemo(() => (rgb ? rgbToHsl(...rgb) : null), [rgb]);

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
          Color Converter
        </h1>

        <div
          className="w-full h-32 rounded-lg border border-[var(--border-subtle)] mb-6"
          style={{ backgroundColor: rgb ? toHex(...rgb) : "#000000" }}
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#C9A15A"
              className={`w-full bg-[var(--bg-surface)] border rounded-lg px-4 py-3 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-brass)] transition ${
                rgb ? "border-[var(--border-subtle)]" : "border-red-500"
              }`}
            />
          </div>
          <div>
            <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
              Selettore colore
            </label>
            <input
              type="color"
              value={rgb ? toHex(...rgb) : "#000000"}
              onChange={(e) => setHex(e.target.value)}
              className="w-full h-[50px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">RGB</p>
            <p className="font-mono text-sm text-[var(--text-primary)] break-all">
              {rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : "HEX non valido"}
            </p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">HSL</p>
            <p className="font-mono text-sm text-[var(--text-primary)] break-all">
              {hsl ? `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` : "—"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
