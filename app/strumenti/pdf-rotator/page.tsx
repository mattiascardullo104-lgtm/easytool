"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

export default function PDFRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState(90);
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

  const rotate = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      pages.forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const out = await doc.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + "-rotated.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error during rotation.");
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
          PDF Rotator
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose a PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Rotate all pages · everything stays in your browser
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
            Rotation angle
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[90, 180, 270].map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                  angle === a
                    ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                    : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
                }`}
              >
                {a}°
              </button>
            ))}
          </div>
        </div>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={rotate}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Rotating..." : "Rotate and download"}
        </button>
      </div>
    </main>
  );
}
