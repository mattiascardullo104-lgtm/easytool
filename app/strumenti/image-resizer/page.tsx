"use client";

import { useRef, useState } from "react";

type Mode = "percent" | "width" | "height";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mode, setMode] = useState<Mode>("percent");
  const [percent, setPercent] = useState(50);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const resize = async () => {
    const img = imageRef.current;
    if (!img || !file) return;
    setLoading(true);
    setError("");
    try {
      let targetW: number;
      let targetH: number;
      const ratio = img.naturalWidth / img.naturalHeight;
      if (mode === "percent") {
        targetW = Math.round((img.naturalWidth * percent) / 100);
        targetH = Math.round((img.naturalHeight * percent) / 100);
      } else if (mode === "width") {
        targetW = Math.max(1, Math.min(width, img.naturalWidth));
        targetH = Math.round(targetW / ratio);
      } else {
        targetH = Math.max(1, Math.min(height, img.naturalHeight));
        targetW = Math.round(targetH * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92)
      );
      if (!blob) throw new Error("toBlob failed");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.[^.]+$/, "") + "-resized.jpg";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error during resizing.");
    } finally {
      setLoading(false);
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
          Image Resizer
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose an image"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Resize by percentage or pixels · everything in your browser
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

        <div className="grid grid-cols-3 gap-3 mb-6">
          {(
            [
              { value: "percent", label: "Percentage" },
              { value: "width", label: "Width" },
              { value: "height", label: "Height" },
            ] as { value: Mode; label: string }[]
          ).map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
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

        {mode === "percent" ? (
          <div className="mb-6">
            <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
              <span>Scale</span>
              <span className="text-[var(--accent-brass)]">{percent}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full accent-[var(--accent-brass)]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {mode === "width" && (
              <div>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                />
              </div>
            )}
            {mode === "height" && (
              <div>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={resize}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Resizing..." : "Resize and download"}
        </button>
      </div>
    </main>
  );
}
