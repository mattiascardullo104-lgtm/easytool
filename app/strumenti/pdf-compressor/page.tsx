"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ before: number; after: number; url: string } | null>(null);
  const pdfjsRef = useRef<any>(null);
  const workerRef = useRef<Worker | null>(null);

  const loadPdfjs = async () => {
    if (pdfjsRef.current) return pdfjsRef.current;
    const pdfjsLib = await import("pdfjs-dist");
    const version = (await import("pdfjs-dist/package.json")).version;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    pdfjsRef.current = pdfjsLib;
    return pdfjsLib;
  };

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setError("");
    setResult(null);
    setFile(f);
  };

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const pdfjsLib = await loadPdfjs();
      const bytes = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

      const out = await PDFDocument.create();

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpegBlob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
            "image/jpeg",
            quality
          );
        });

        const jpgBytes = await jpegBlob.arrayBuffer();
        const image = await out.embedJpg(new Uint8Array(jpgBytes));
        const newPage = out.addPage([image.width, image.height]);
        newPage.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const output = await out.save();
      const blob = new Blob([output], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const reduction = Math.round((1 - output.byteLength / bytes.byteLength) * 100);
      setResult({
        before: bytes.byteLength,
        after: output.byteLength,
        url,
      });
      if (reduction <= 0) {
        setError("Nessuna riduzione ottenuta: il PDF è già ottimizzato o ha poco testo/immagini.");
      }
    } catch {
      setError("Errore durante la compressione. Il PDF potrebbe essere protetto o corrotto.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.download = "compresso.pdf";
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
        <a href="/strumenti/pdf" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a PDF
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · PDF
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          PDF Compressor
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Scegli un PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Tutto nel browser · i file non vengono caricati online
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

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

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        <button
          onClick={compress}
          disabled={!file || loading}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Compressione in corso..." : "Comprimi PDF"}
        </button>

        <p className="font-tool text-xs text-[var(--text-muted)] mt-4">
          Nota: con questo metodo le pagine vengono convertite in immagini, quindi il testo non sarà più selezionabile. Ideale per PDF con molte immagini.
        </p>

        {result && !loading && (
          <>
            <div className="grid grid-cols-2 gap-5 mt-6 mb-6">
              <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
                <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Prima</span>
                <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{formatBytes(result.before)}</span>
              </div>
              <div className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
                <span className="font-tool text-xs text-[var(--accent-steel)] block mb-1">Dopo</span>
                <span className="font-display text-2xl font-semibold text-[var(--text-primary)]">{formatBytes(result.after)}</span>
              </div>
            </div>

            <button
              onClick={download}
              className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
            >
              Scarica PDF compresso
            </button>
          </>
        )}
      </div>
    </main>
  );
}
