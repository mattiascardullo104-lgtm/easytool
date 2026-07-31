"use client";

import { useRef, useState } from "react";

export default function ImageRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const download = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !file) return;
    setError("");
    try {
      const swap = rotation % 180 !== 0;
      canvas.width = swap ? img.naturalHeight : img.naturalWidth;
      canvas.height = swap ? img.naturalWidth : img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.[^.]+$/, "") + "-rotated.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error while generating the image.");
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
          Image Rotator
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose an image"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Rotate and flip images directly in your browser
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
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              }}
              className="max-h-48 rounded-lg border border-[var(--border-subtle)]"
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Rotate 90°
          </button>
          <button
            onClick={() => setRotation((r) => (r + 180) % 360)}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Rotate 180°
          </button>
          <button
            onClick={() => setRotation((r) => (r + 270) % 360)}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Rotate 270°
          </button>
          <button
            onClick={() => setFlipH((f) => !f)}
            className={`border font-medium px-6 py-3 rounded-md transition ${
              flipH
                ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                : "border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-steel)]"
            }`}
          >
            Flip horizontal
          </button>
          <button
            onClick={() => setFlipV((f) => !f)}
            className={`border font-medium px-6 py-3 rounded-md transition ${
              flipV
                ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                : "border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-steel)]"
            }`}
          >
            Flip vertical
          </button>
        </div>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={download}
          disabled={!file}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          Download image
        </button>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
