"use client";

import { useRef, useState } from "react";

const CHARS = " .:-=+*#%@";

const sizes = [60, 100, 140, 200];

export default function AsciiArt() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [size, setSize] = useState(100);
  const [invert, setInvert] = useState(false);
  const [art, setArt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setArt("");
  };

  const generate = async () => {
    const img = imageRef.current;
    if (!img || !file) return;
    setLoading(true);
    setError("");
    setArt("");
    try {
      const ratio = img.naturalWidth / img.naturalHeight;
      const w = size;
      const h = Math.max(1, Math.round(w / ratio / 2));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      const srcRatio = img.naturalWidth / img.naturalHeight;
      const dstRatio = w / h;
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (srcRatio > dstRatio) {
        sw = img.naturalHeight * dstRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / dstRatio;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let out = "";
      for (let y = 0; y < h; y++) {
        let line = "";
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          let idx = Math.round(lum * (CHARS.length - 1));
          if (invert) idx = CHARS.length - 1 - idx;
          line += CHARS[idx];
        }
        out += line + "\n";
      }
      setArt(out);
    } catch {
      setError("Error while generating the ASCII art.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!art) return;
    try {
      await navigator.clipboard.writeText(art);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy the text.");
    }
  };

  const download = () => {
    if (!art || !file) return;
    const blob = new Blob([art], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name.replace(/\.[^.]+$/, "") + "-ascii-art.txt";
    link.click();
    URL.revokeObjectURL(url);
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
          Image to ASCII Art
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose an image"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Everything runs in your browser
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {preview && (
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg border border-[var(--border-subtle)]"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Size (characters wide)
          </label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s} characters
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={invert}
            onChange={(e) => setInvert(e.target.checked)}
            className="accent-[var(--accent-brass)]"
          />
          <span className="font-tool text-xs text-[var(--text-muted)]">Invert colors</span>
        </label>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={generate}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40 mb-6"
        >
          {loading ? "Generating..." : "Generate ASCII art"}
        </button>

        {art && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <pre className="font-mono text-xs text-[var(--text-primary)] overflow-auto whitespace-pre">
              {art}
            </pre>
          </div>
        )}

        {art && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={copy}
              className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={download}
              className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              Download .txt
            </button>
          </div>
        )}

        <p className="font-tool text-xs text-[var(--text-muted)] text-center">
          Everything runs in your browser. No images are uploaded anywhere.
        </p>
      </div>
    </main>
  );
}
