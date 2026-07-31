"use client";

import { useRef, useState } from "react";

type Format = "image/png" | "image/jpeg" | "image/webp";

const formats: { value: Format; label: string; ext: string }[] = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/webp", label: "WEBP", ext: "webp" },
];

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(0.9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const convert = async () => {
    const img = imageRef.current;
    if (!img || !file) return;
    setLoading(true);
    setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, format === "image/png" ? undefined : quality)
      );
      if (!blob) throw new Error("toBlob failed");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const ext = formats.find((f) => f.value === format)?.ext ?? "png";
      link.download = file.name.replace(/\.[^.]+$/, "") + "." + ext;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Errore durante la conversione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/immagini" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a Immagini
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · IMMAGINI
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Image Converter
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Scegli un'immagine"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Converti in PNG, JPG o WEBP · tutto nel browser
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
              alt="Anteprima"
              className="max-h-48 rounded-lg border border-[var(--border-subtle)]"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Formato di destinazione
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                  format === f.value
                    ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {format !== "image/png" && (
          <div className="mb-6">
            <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
              <span>Qualità</span>
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
        )}

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={convert}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Conversione in corso..." : "Converti e scarica"}
        </button>
      </div>
    </main>
  );
}
