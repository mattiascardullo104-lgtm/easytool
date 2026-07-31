"use client";

import { useRef, useState } from "react";

type Filter = "grayscale" | "sepia" | "invert" | "contrast" | "blur";

const filters: { value: Filter; label: string }[] = [
  { value: "grayscale", label: "Black & white" },
  { value: "sepia", label: "Sepia" },
  { value: "invert", label: "Negative" },
  { value: "contrast", label: "Contrast" },
  { value: "blur", label: "Blur" },
];

export default function ImageFilters() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [filter, setFilter] = useState<Filter>("grayscale");
  const [intensity, setIntensity] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const applyFilter = async () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !file) return;
    setLoading(true);
    setError("");
    try {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = "none";
      ctx.drawImage(img, 0, 0);
      ctx.filter = `${filter}(${intensity}%)`;
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("toBlob failed");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.[^.]+$/, "") + "-filter.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error while applying the filter.");
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
          Image Filters
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose an image"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Apply filters directly in your browser
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                filter === f.value
                  ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
            <span>Intensity</span>
            <span className="text-[var(--accent-brass)]">{intensity}%</span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={applyFilter}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Applying..." : "Apply filter and download"}
        </button>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
