"use client";

import { useState } from "react";

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = () => {
    if (!prompt.trim()) {
      setError("Scrivi una descrizione per generare l'immagine.");
      return;
    }
    setError("");
    setLoading(true);
    setImageUrl("");
    const [width, height] = size.split("x");
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.trim())}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
    const img = new Image();
    img.onload = () => {
      setImageUrl(url);
      setLoading(false);
    };
    img.onerror = () => {
      setError("Impossibile generare l'immagine. Riprova tra qualche secondo.");
      setLoading(false);
    };
    img.src = url;
  };

  const download = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ai-image.png";
    link.target = "_blank";
    link.click();
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/ai" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a AI Arena
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · AI ARENA
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          AI Image Generator
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Descrivi un&apos;immagine e l&apos;intelligenza artificiale la crea per te. Gratis, senza account, tramite Pollinations.ai.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="es. un gatto astronauta che galleggia nello spazio, stile cyberpunk..."
          className="w-full h-32 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition resize-none mb-4"
        />

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Formato
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["1024x1024", "1280x720", "720x1280"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                  size === s
                    ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
                }`}
              >
                {s === "1024x1024" ? "Quadrato" : s === "1280x720" ? "Orizzontale" : "Verticale"}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="font-tool text-xs text-red-400 mb-4">{error}</p>}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Generazione in corso..." : "Genera immagine"}
        </button>

        {loading && (
          <div className="mt-6 border border-[var(--border-subtle)] rounded-lg p-8 bg-[var(--bg-surface)] flex flex-col items-center justify-center min-h-[256px]">
            <div className="w-8 h-8 border-2 border-[var(--border-subtle)] border-t-[var(--accent-brass)] rounded-full animate-spin mb-4" />
            <span className="font-tool text-xs text-[var(--text-muted)]">
              L&apos;AI sta disegnando... (di solito 10-30 secondi)
            </span>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="mt-6">
            <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)] mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Immagine generata dall'AI"
                className="w-full rounded-lg"
              />
            </div>
            <button
              onClick={download}
              className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              Scarica immagine
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
