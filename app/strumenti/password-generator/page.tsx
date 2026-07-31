"use client";

import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lower;
    if (includeUppercase) chars += upper;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · UTILITY
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Password Generator
        </h1>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
          <div className="font-tool text-sm text-[var(--text-primary)] break-all min-h-[1.5rem]">
            {password || "Press Generate to create a password"}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
            <span>Length</span>
            <span className="text-[var(--accent-brass)]">{length}</span>
          </label>
          <input
            type="range"
            min={8}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        <div className="space-y-3 mb-8">
          <label className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="accent-[var(--accent-brass)]"
            />
            Include uppercase (A-Z)
          </label>
          <label className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="accent-[var(--accent-brass)]"
            />
            Include numbers (0-9)
          </label>
          <label className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="accent-[var(--accent-brass)]"
            />
            Include symbols (!@#...)
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={generatePassword}
            className="flex-1 bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Generate
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </main>
  );
}