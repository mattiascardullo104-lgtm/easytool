"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setFile(f);
      setPageCount(count);
      setStart(1);
      setEnd(count);
    } catch {
      setError("File non valido. Carica un PDF.");
    }
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      const pages = await out.copyPages(src, Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i));
      pages.forEach((p) => out.addPage(p));
      const result = await out.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pagine-${from}-${to}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Errore durante l'estrazione delle pagine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/pdf" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a PDF
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · PDF
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          PDF Splitter
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Scegli un PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Estrai un intervallo di pagine · tutto nel browser
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
            <p className="font-tool text-xs text-[var(--text-muted)] mb-4">
              Il PDF ha {pageCount} {pageCount === 1 ? "pagina" : "pagine"}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Dalla pagina
                </label>
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={start}
                  onChange={(e) => setStart(Math.min(Math.max(1, Number(e.target.value)), pageCount))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                />
              </div>
              <div>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Alla pagina
                </label>
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={end}
                  onChange={(e) => setEnd(Math.min(Math.max(1, Number(e.target.value)), pageCount))}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                />
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>
        )}

        <button
          onClick={split}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Estrazione in corso..." : "Estrai e scarica"}
        </button>
      </div>
    </main>
  );
}
