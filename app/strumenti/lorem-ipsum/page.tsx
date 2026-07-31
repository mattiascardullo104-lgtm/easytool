"use client";

import { useState } from "react";

const words = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

type Mode = "words" | "sentences" | "paragraphs";

const sentences = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
];

const randomWord = () => words[Math.floor(Math.random() * words.length)];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const makeSentence = () => {
  const count = 5 + Math.floor(Math.random() * 8);
  let s = "";
  for (let i = 0; i < count; i++) s += randomWord() + (i < count - 1 ? " " : "");
  return capitalize(s) + ".";
};

const generate = (mode: Mode, count: number) => {
  if (mode === "words") {
    return Array.from({ length: count }, randomWord).join(" ");
  }
  if (mode === "sentences") {
    return Array.from({ length: count }, makeSentence).join(" ");
  }
  const total = Math.max(1, Math.round(count / 3));
  return Array.from({ length: total }, () => Array.from({ length: 3 }, makeSentence).join(" ")).join("\n\n");
};

export default function LoremIpsum() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(3);
  const [text, setText] = useState(() => generate("paragraphs", 3));

  const regenerate = () => setText(generate(mode, count));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setText(text);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/testo" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a Testo
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · TESTO
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Lorem Ipsum Generator
        </h1>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {(
            [
              { value: "words", label: "Parole" },
              { value: "sentences", label: "Frasi" },
              { value: "paragraphs", label: "Paragrafi" },
            ] as { value: Mode; label: string }[]
          ).map((m) => (
            <button
              key={m.value}
              onClick={() => {
                setMode(m.value);
                setText(generate(m.value, count));
              }}
              className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                mode === m.value
                  ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
            <span>Quantità</span>
            <span className="text-[var(--accent-brass)]">{count}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => {
              setCount(Number(e.target.value));
              setText(generate(mode, Number(e.target.value)));
            }}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
          <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap max-h-72 overflow-y-auto">
            {text}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={regenerate}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Rigenera
          </button>
          <button
            onClick={copy}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Copia
          </button>
        </div>
      </div>
    </main>
  );
}
