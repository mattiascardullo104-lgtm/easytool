"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export default function OCR() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const extract = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setText("");
    setFile(f);
    setLoading(true);
    setProgress(0);
    try {
      const result = await Tesseract.recognize(f, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      setText(result.data.text.trim() || "(No text detected)");
    } catch {
      setError("Error during text recognition.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Unable to copy to clipboard.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/immagini" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to Images
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · IMAGES
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          OCR Text Extractor
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose an image"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Extract text written in the image · free and offline
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => extract(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {loading && (
          <div className="mb-6">
            <div className="h-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-brass)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-tool text-xs text-[var(--text-muted)] text-center mt-2">
              Recognizing... {progress}%
            </p>
          </div>
        )}

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        {text && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Extracted text
              </p>
              <button
                onClick={copy}
                className="font-tool text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] px-4 py-2 rounded-md hover:border-[var(--accent-steel)] transition"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap max-h-72 overflow-y-auto">
              {text}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
