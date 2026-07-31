"use client";

import { useState } from "react";

type Tab = "counter" | "dice" | "password";

const passwordChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!?@#%";

export default function InteractiveDemo() {
  const [tab, setTab] = useState<Tab>("counter");
  const [text, setText] = useState("Type here to count words...");
  const [dice, setDice] = useState<number[] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [password, setPassword] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
      setRolling(false);
    }, 450);
  };

  const newPassword = (len = 14) => {
    let p = "";
    for (let i = 0; i < len; i++) {
      p += passwordChars[Math.floor(Math.random() * passwordChars.length)];
    }
    setPassword(p);
  };

  return (
    <div className="border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 bg-[var(--bg-surface)]">
      <div className="grid grid-cols-3 gap-2 mb-6">
        {(
          [
            { value: "counter", label: "Word Counter" },
            { value: "dice", label: "Dice" },
            { value: "password", label: "Password" },
          ] as { value: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`font-tool text-xs px-3 py-2.5 rounded-md border transition ${
              tab === t.value
                ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "counter" && (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-[var(--border-subtle)] rounded-lg p-4 text-center">
              <p className="font-display text-3xl font-bold text-[var(--accent-brass)]">{words}</p>
              <p className="font-tool text-[11px] text-[var(--text-muted)] mt-1">WORDS</p>
            </div>
            <div className="border border-[var(--border-subtle)] rounded-lg p-4 text-center">
              <p className="font-display text-3xl font-bold text-[var(--accent-steel)]">{chars}</p>
              <p className="font-tool text-[11px] text-[var(--text-muted)] mt-1">CHARACTERS</p>
            </div>
          </div>
        </div>
      )}

      {tab === "dice" && (
        <div className="text-center py-4">
          <div className="flex justify-center gap-6 mb-6">
            {(dice ?? [6, 6]).map((v, i) => (
              <span
                key={i}
                className={`font-display text-6xl font-bold w-24 h-24 flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] ${
                  rolling ? "animate-pulse" : ""
                } ${dice ? "" : "opacity-40"}`}
              >
                {v}
              </span>
            ))}
          </div>
          <button
            onClick={roll}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            {rolling ? "Rolling..." : "Roll dice"}
          </button>
        </div>
      )}

      {tab === "password" && (
        <div className="text-center py-4">
          <p className="font-mono text-lg text-[var(--accent-brass)] break-all bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-4 mb-6 min-h-[64px]">
            {password || "Press the button to generate a secure password"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => newPassword()}
              className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Generate
            </button>
            <button
              onClick={async () => {
                if (password) {
                  try {
                    await navigator.clipboard.writeText(password);
                  } catch {
                    // ignore
                  }
                }
              }}
              className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-lg hover:border-[var(--accent-steel)] transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
