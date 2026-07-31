"use client";

import { useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
export default function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const docRef = useRef<PDFDocument | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [text, setText] = useState("");
  const [textPage, setTextPage] = useState(1);
  const [textSize, setTextSize] = useState(16);
  const [textX, setTextX] = useState(50);

  const [watermark, setWatermark] = useState("");
  const [watermarkSize, setWatermarkSize] = useState(48);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.2);

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setLoading(true);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      docRef.current = doc;
      setFile(f);
      setPageCount(doc.getPageCount());
      setTitle(doc.getTitle() ?? "");
      setAuthor(doc.getAuthor() ?? "");
      setTextPage(1);
    } catch {
      setError("File non valido. Carica un PDF non protetto.");
    } finally {
      setLoading(false);
    }
  };

  const addText = async () => {
    const doc = docRef.current;
    if (!doc || !text.trim()) return;
    setError("");
    try {
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const page = doc.getPage(Math.min(Math.max(1, textPage), pageCount) - 1);
      const height = page.getHeight();
      page.drawText(text, {
        x: textX,
        y: height - textSize,
        size: textSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      setText("");
    } catch {
      setError("Impossibile aggiungere il testo.");
    }
  };

  const rotateRight = () => {
    const doc = docRef.current;
    if (!doc) return;
    const page = doc.getPage(Math.min(Math.max(1, textPage), pageCount) - 1);
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + 90) % 360));
  };

  const addWatermark = async () => {
    const doc = docRef.current;
    if (!doc || !watermark.trim()) return;
    setError("");
    try {
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const alpha = Math.min(Math.max(0.05, watermarkOpacity), 0.9);
      for (let i = 0; i < doc.getPageCount(); i++) {
        const page = doc.getPage(i);
        const width = page.getWidth();
        const height = page.getHeight();
        page.drawText(watermark, {
          x: width / 2 - (watermark.length * watermarkSize * 0.5) / 2,
          y: height / 2 - watermarkSize / 2,
          size: watermarkSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
          opacity: alpha,
          rotate: degrees(-45),
        });
      }
      setWatermark("");
    } catch {
      setError("Impossibile aggiungere il watermark.");
    }
  };

  const save = async () => {
    const doc = docRef.current;
    if (!doc) return;
    setLoading(true);
    setError("");
    try {
      if (title.trim()) doc.setTitle(title.trim());
      if (author.trim()) doc.setAuthor(author.trim());
      doc.setProducer("EasyTools");
      const out = await doc.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file ? file.name.replace(/\.pdf$/i, "") + "-modificato.pdf" : "modificato.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Errore durante il salvataggio.");
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
          PDF Editor
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Scegli un PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Modifica metadati, aggiungi testo, ruota pagine · tutto nel browser
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>

        {loading && !file && (
          <p className="font-tool text-xs text-[var(--text-muted)] text-center mb-6">
            Caricamento...
          </p>
        )}

        {file && !loading && (
          <>
            <p className="font-tool text-xs text-[var(--text-muted)] mb-6">
              Il PDF ha {pageCount} {pageCount === 1 ? "pagina" : "pagine"}
            </p>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Metadati
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Titolo</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titolo del documento"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Autore</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Autore"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Aggiungi testo
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Testo</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Testo da aggiungere..."
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Pagina</label>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={textPage}
                      onChange={(e) => setTextPage(Math.min(Math.max(1, Number(e.target.value)), pageCount))}
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                    />
                  </div>
                  <div>
                    <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Dimensione</label>
                    <input
                      type="number"
                      min={8}
                      max={72}
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                    />
                  </div>
                  <div>
                    <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">X (da sinistra)</label>
                    <input
                      type="number"
                      min={0}
                      value={textX}
                      onChange={(e) => setTextX(Number(e.target.value))}
                      className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                    />
                  </div>
                </div>
                <button
                  onClick={addText}
                  disabled={!text.trim()}
                  className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition disabled:opacity-40"
                >
                  Aggiungi testo alla pagina
                </button>
                <p className="font-tool text-xs text-[var(--text-muted)]">
                  Il testo viene aggiunto in cima alla pagina selezionata. Puoi ripeterlo più volte.
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Ruota pagina
              </p>
              <button
                onClick={rotateRight}
                className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
              >
                Ruota di 90° la pagina {textPage}
              </button>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Aggiungi watermark
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Testo del watermark</label>
                  <input
                    type="text"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    placeholder="es. RISERVATO o il tuo nome"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
                      <span>Dimensione</span>
                      <span className="text-[var(--accent-brass)]">{watermarkSize}</span>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      value={watermarkSize}
                      onChange={(e) => setWatermarkSize(Number(e.target.value))}
                      className="w-full accent-[var(--accent-brass)]"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
                      <span>Opacità</span>
                      <span className="text-[var(--accent-brass)]">{Math.round(watermarkOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={90}
                      value={Math.round(watermarkOpacity * 100)}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value) / 100)}
                      className="w-full accent-[var(--accent-brass)]"
                    />
                  </div>
                </div>
                <button
                  onClick={addWatermark}
                  disabled={!watermark.trim()}
                  className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition disabled:opacity-40"
                >
                  Aggiungi watermark a tutte le pagine
                </button>
              </div>
            </div>

            {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

            <button
              onClick={save}
              disabled={loading}
              className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
            >
              {loading ? "Salvataggio..." : "Salva e scarica PDF"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
