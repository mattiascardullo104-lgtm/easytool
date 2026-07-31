"use client";

import { useState } from "react";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const inline = (s: string) => {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
};

const markdownToHtml = (md: string) => {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push("<pre><code>" + escapeHtml(buf.join("\n")) + "</code></pre>");
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1] ? heading[1].length : 1;
      out.push("<h" + level + ">" + inline(heading[2] ?? "") + "</h" + level + ">");
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (/^[-*]\s+/.test(t)) {
          items.push(inline(t.replace(/^[-*]\s+/, "")));
          i++;
        } else {
          break;
        }
      }
      out.push("<ul>\n" + items.map((it) => "  <li>" + it + "</li>").join("\n") + "\n</ul>");
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (/^\d+\.\s+/.test(t)) {
          items.push(inline(t.replace(/^\d+\.\s+/, "")));
          i++;
        } else {
          break;
        }
      }
      out.push("<ol>\n" + items.map((it) => "  <li>" + it + "</li>").join("\n") + "\n</ol>");
      continue;
    }

    const para: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (
        t === "" ||
        /^(#{1,6})\s+/.test(t) ||
        t.startsWith("```") ||
        /^[-*]\s+/.test(t) ||
        /^\d+\.\s+/.test(t)
      ) {
        break;
      }
      para.push(inline(t));
      i++;
    }
    if (para.length > 0) {
      out.push("<p>" + para.join(" ") + "</p>");
    }
  }

  return out.join("\n\n");
};

export default function MarkdownToHtml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    setOutput(markdownToHtml(input));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

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
          Markdown to HTML
        </h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your Markdown here..."
          rows={12}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 font-mono"
        />

        <button
          onClick={convert}
          className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition mb-6"
        >
          Convert
        </button>

        {output && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                HTML Output
              </p>
              <button
                onClick={copy}
                className="font-tool text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] px-4 py-2 rounded-md hover:border-[var(--accent-steel)] transition"
              >
                Copy HTML
              </button>
            </div>
            <pre className="text-xs text-[var(--text-primary)] font-mono whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
