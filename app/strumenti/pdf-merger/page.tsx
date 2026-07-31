"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setError("");
    setFiles(Array.from(list).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf")));
  };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "unito.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Errore durante l'unione. Controlla che i file siano PDF validi.");
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
          PDF Merger
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {files.length > 0 ? `${files.length} file selezionati` : "Scegli i PDF da unire"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Seleziona almeno 2 PDF · tutto nel browser
          </span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="space-y-2 mb-6">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between border border-[var(--border-subtle)] rounded-lg px-4 py-3 bg-[var(--bg-surface)]">
                <span className="text-sm text-[var(--text-primary)] truncate">{f.name}</span>
                <span className="font-tool text-xs text-[var(--text-muted)] shrink-0">
                  {Math.round(f.size / 1024)} KB
                </span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>
        )}

        <button
          onClick={merge}
          disabled={files.length < 2 || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Unione in corso..." : "Unisci e scarica"}
        </button>
      </div>
    </main>
  );
}
