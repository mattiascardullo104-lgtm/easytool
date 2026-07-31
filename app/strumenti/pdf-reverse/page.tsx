"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFReverse() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
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

  const reverse = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const indices = Array.from(
        { length: src.getPageCount() },
        (_, i) => src.getPageCount() - 1 - i
      );
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const result = await out.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + "-reversed.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error while reversing the pages.");
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
          Reverse PDF
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose a PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Reverse the page order · everything stays in your browser
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {file && pageCount > 0 && (
          <>
            <p className="font-tool text-xs text-[var(--text-muted)] mb-6">
              The PDF has {pageCount} {pageCount === 1 ? "page" : "pages"}
            </p>
            <p className="font-tool text-xs text-[var(--accent-steel)] mb-6">
              The last page becomes the first.
            </p>
          </>
        )}

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={reverse}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Processing..." : "Reverse and download"}
        </button>
      </div>
    </main>
  );
}
