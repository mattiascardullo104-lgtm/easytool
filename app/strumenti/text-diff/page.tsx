"use client";

import { useState } from "react";

type DiffEntry = {
  type: "same" | "added" | "removed";
  text: string;
};

const lcs = (a: string[], b: string[]) => {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  return dp;
};

const diffLines = (a: string[], b: string[]): DiffEntry[] => {
  const dp = lcs(a, b);
  const entries: DiffEntry[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      entries.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      entries.push({ type: "removed", text: a[i] });
      i++;
    } else {
      entries.push({ type: "added", text: b[j] });
      j++;
    }
  }

  while (i < a.length) {
    entries.push({ type: "removed", text: a[i] });
    i++;
  }
  while (j < b.length) {
    entries.push({ type: "added", text: b[j] });
    j++;
  }

  const merged: DiffEntry[] = [];
  for (const entry of entries) {
    const last = merged[merged.length - 1];
    if (last && last.type === entry.type && entry.type !== "same") {
      last.text += "\n" + entry.text;
    } else {
      merged.push({ ...entry });
    }
  }

  return merged;
};

const countType = (entries: DiffEntry[], type: "added" | "removed") =>
  entries.filter((e) => e.type === type).length;

export default function TextDiff() {
  const [original, setOriginal] = useState("");
  const [updated, setUpdated] = useState("");
  const [diff, setDiff] = useState<DiffEntry[] | null>(null);

  const compare = () => {
    setDiff(diffLines(original.split("\n"), updated.split("\n")));
  };

  const added = diff ? countType(diff, "added") : 0;
  const removed = diff ? countType(diff, "removed") : 0;

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/testo" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to Text
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · TEXT
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Text Diff
        </h1>

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
          Original text
        </label>
        <textarea
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          placeholder="Paste the original text here..."
          rows={7}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 font-mono"
        />

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
          New text
        </label>
        <textarea
          value={updated}
          onChange={(e) => setUpdated(e.target.value)}
          placeholder="Paste the new text here..."
          rows={7}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 font-mono"
        />

        <button
          onClick={compare}
          className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition mb-6"
        >
          Compare
        </button>

        {diff && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Diff
              </p>
              <span className="font-tool text-xs text-[var(--text-muted)]">
                {added > 0 || removed > 0
                  ? `${added} line${added === 1 ? "" : "s"} added, ${removed} line${removed === 1 ? "" : "s"} removed`
                  : "No differences found"}
              </span>
            </div>
            <div className="font-mono text-sm max-h-96 overflow-y-auto">
              {diff.map((entry, index) => (
                <div
                  key={index}
                  className={
                    entry.type === "added"
                      ? "bg-green-400/10 text-green-400 px-2 py-1"
                      : entry.type === "removed"
                      ? "bg-red-400/10 text-red-400 px-2 py-1"
                      : "text-[var(--text-muted)] px-2 py-1"
                  }
                >
                  <span className="select-none mr-2">
                    {entry.type === "added" ? "+" : entry.type === "removed" ? "-" : " "}
                  </span>
                  <span className="whitespace-pre-wrap">
                    {entry.text === "" ? " " : entry.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
