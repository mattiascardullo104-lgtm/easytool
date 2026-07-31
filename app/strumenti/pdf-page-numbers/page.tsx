"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function PDFPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [start, setStart] = useState(1);
  const [position, setPosition] = useState("bottom-center");
  const [fontSize, setFontSize] = useState(16);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setLoading(true);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch {
      setError("Invalid file. Please upload an unprotected PDF.");
    } finally {
      setLoading(false);
    }
  };

  const addNumbers = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const margin = 30;

      pages.forEach((page, i) => {
        const text = String(start + i);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        let x: number;
        if (position === "bottom-center") {
          x = (page.getWidth() - textWidth) / 2;
        } else {
          x = page.getWidth() - textWidth - margin;
        }
        const y =
          position === "top-right"
            ? page.getHeight() - margin - fontSize
            : margin;
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.6, 0.6, 0.6),
        });
      });

      const out = await doc.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + "-numbered.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error while adding the page numbers.");
    } finally {
      setLoading(false);
    }
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
          Add Page Numbers
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose a PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Add page numbers to your PDF · everything stays in your browser
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {file && pageCount > 0 && (
          <p className="font-tool text-xs text-[var(--text-muted)] mb-6">
            The PDF has {pageCount} {pageCount === 1 ? "page" : "pages"}
          </p>
        )}

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Start at number
          </label>
          <input
            type="number"
            min={1}
            value={start}
            onChange={(e) => setStart(Math.max(1, Number(e.target.value)))}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
          />
        </div>

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Position
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["bottom-center", "bottom-right", "top-right"].map((p) => (
              <button
                key={p}
                onClick={() => setPosition(p)}
                className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                  position === p
                    ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
                }`}
              >
                {p === "bottom-center" ? "Bottom center" : p === "bottom-right" ? "Bottom right" : "Top right"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="font-tool text-xs text-[var(--text-muted)] block">
              Font size
            </label>
            <span className="font-tool text-xs text-[var(--accent-brass)]">
              {fontSize}px
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={30}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-[var(--accent-brass)]"
          />
        </div>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={addNumbers}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Processing..." : "Add numbers and download"}
        </button>
      </div>
    </main>
  );
}
