"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ name: string; size: number; preview: string } | null>(null);
  const [compressed, setCompressed] = useState<{ size: number; url: string } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    setCompressed(null);
    setOriginal({
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    });

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality,
    };

    try {
      const output = await imageCompression(file, options);
      setCompressed({
        size: output.size,
        url: URL.createObjectURL(output),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!compressed) return;
    const link = document.createElement("a");
    link.href = compressed.url;
    link.download = "compressed-image.jpg";
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
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
          Image Compressor
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {original ? original.name : "Choose an image"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            {original ? formatBytes(original.size) : "PNG, JPG, or WEBP · everything in your browser"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        <div className="mb-6">
          <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
            <span>Quality</span>
            <span className="text-[var(--accent-brass)]">{Math.round(quality * 100)}%</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        {loading && (
          <p className="font-tool text-xs text-[var(--text-muted)] text-center mb-6">
            Compressing...
          </p>
        )}

        {original && compressed && !loading && (
          <>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
                <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Before</span>
                <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{formatBytes(original.size)}</span>
              </div>
              <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
                <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">After</span>
                <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{formatBytes(compressed.size)}</span>
              </div>
            </div>

            <button
              onClick={download}
              className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
            >
              Download compressed image
            </button>
          </>
        )}
      </div>
    </main>
  );
}
