"use client";

import { useState } from "react";

const TONES = ["Formal", "Friendly", "Professional"];

export default function AIEmailWriter() {
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [result, setResult] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const writeEmail = async () => {
    if (!topic.trim()) {
      setError("Describe the topic or situation first.");
      return;
    }
    if (!recipient.trim()) {
      setError("Add who the recipient is.");
      return;
    }
    setError("");
    setResult("");
    setProvider("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: topic,
          system: `Write a ${tone} email about: ${topic}. The recipient is: ${recipient}. Structure it with a subject line and body. Keep it clear and concise.`,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.text);
        setProvider(data.provider);
      }
    } catch {
      setError("Something went wrong. Try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/ai" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to AI Arena
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · AI
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          AI Email Writer
        </h1>

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
          Topic or situation
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. asking for a day off next Friday..."
          className="w-full h-32 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4 resize-none"
        />

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
          Recipient role
        </label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="e.g. my boss, a client, my professor"
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
        />

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
          Tone
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={writeEmail}
          disabled={loading}
          className="w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Thinking..." : "Write email"}
        </button>

        {result && (
          <>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6 mt-6">
              <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap">{result}</p>
            </div>
            <button
              onClick={copy}
              className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              Copy
            </button>
          </>
        )}

        {provider && result && (
          <p className="font-tool text-[11px] text-[var(--text-muted)] text-center mt-6">
            Powered by {provider}
          </p>
        )}
      </div>
    </main>
  );
}
