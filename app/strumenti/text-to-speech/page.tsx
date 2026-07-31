"use client";

import { useEffect, useState } from "react";

const LANGUAGES = [
  { label: "English", value: "en-US" },
  { label: "Italian", value: "it-IT" },
  { label: "Spanish", value: "es-ES" },
  { label: "French", value: "fr-FR" },
  { label: "German", value: "de-DE" },
];

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const speak = () => {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (supported) window.speechSynthesis.cancel();
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
          Text to Speech
        </h1>

        {!supported && (
          <p className="font-tool text-xs text-red-400 text-center mb-6">
            Speech synthesis is not supported in this browser.
          </p>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste the text you want to hear..."
          rows={8}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
        />

        <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label} ({lang.value})
            </option>
          ))}
        </select>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="font-tool text-xs text-[var(--text-muted)]">Rate</label>
            <span className="font-tool text-xs text-[var(--accent-brass)]">{rate.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-tool text-xs text-[var(--text-muted)]">Pitch</label>
            <span className="font-tool text-xs text-[var(--accent-brass)]">{pitch.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={speak}
            disabled={!supported || !text.trim()}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Play
          </button>
          <button
            onClick={stop}
            disabled={!supported}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop
          </button>
        </div>

        <p className="font-tool text-xs text-[var(--text-muted)]">
          Runs offline in your browser, no data is sent anywhere.
        </p>
      </div>
    </main>
  );
}
