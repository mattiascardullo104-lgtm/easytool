"use client";

import { useRef, useState } from "react";

interface PageImage {
  index: number;
  url: string;
}

export default function PDFToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pdfjsRef = useRef<any>(null);

  const loadPdfjs = async () => {
    if (pdfjsRef.current) return pdfjsRef.current;
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@6.2.108/build/pdf.worker.min.mjs";
    pdfjsRef.current = pdfjsLib;
    return pdfjsLib;
  };

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setPages([]);
    setLoading(true);
    setFile(f);
    try {
      const pdfjsLib = await loadPdfjs();
      const bytes = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      const out: PageImage[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        out.push({ index: i, url: canvas.toDataURL("image/png") });
      }
      setPages(out);
    } catch {
      setError("Unable to read the PDF. Make sure it is not protected.");
    } finally {
      setLoading(false);
    }
  };

  const download = (p: PageImage) => {
    const link = document.createElement("a");
    link.href = p.url;
    link.download = `page-${p.index}.png`;
    link.click();
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
          PDF to Images
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose a PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Each page becomes a PNG image · everything stays in your browser
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {loading && (
          <p className="font-tool text-xs text-[var(--text-muted)] text-center mb-6">
            Converting...
          </p>
        )}

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        {pages.length > 0 && !loading && (
          <>
            <p className="font-tool text-xs text-[var(--text-muted)] mb-4">
              {pages.length} {pages.length === 1 ? "page" : "pages"} converted
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {pages.map((p) => (
                <div key={p.index} className="border border-[var(--border-subtle)] rounded-lg p-3 bg-[var(--bg-surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Page ${p.index}`} className="w-full rounded mb-2" />
                  <button
                    onClick={() => download(p)}
                    className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 py-2 rounded-md hover:border-[var(--accent-steel)] transition text-sm"
                  >
                    Download page {p.index}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
