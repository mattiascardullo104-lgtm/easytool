"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function ImagesToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setError("");
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles(imgs);
    setPreviews(imgs.map((f) => URL.createObjectURL(f)));
  };

  const convert = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(bytes);
        } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
          image = await pdf.embedJpg(bytes);
        } else {
          const pngBytes = await fileToPng(file);
          image = await pdf.embedPng(pngBytes);
        }
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const out = await pdf.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "images.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error during conversion.");
    } finally {
      setLoading(false);
    }
  };

  const fileToPng = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    return new Uint8Array(await blob!.arrayBuffer());
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/pdf" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to PDF
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · PDF
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Images to PDF
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {files.length > 0 ? `${files.length} images selected` : "Choose the images"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            PNG, JPG, WEBP and more · one page per image · everything stays in your browser
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {previews.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={p} alt={`Image ${i + 1}`} className="w-full h-24 object-cover rounded-lg border border-[var(--border-subtle)]" />
            ))}
          </div>
        )}

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={convert}
          disabled={files.length === 0 || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Converting..." : "Convert to PDF"}
        </button>
      </div>
    </main>
  );
}
