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
      setError("Invalid file. Please upload an unprotected PDF.");
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
      setError("Unable to add the text.");
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
      setError("Unable to add the watermark.");
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
      link.download = file ? file.name.replace(/\.pdf$/i, "") + "-edited.pdf" : "edited.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Error while saving.");
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
          PDF Editor
        </h1>

        <label className="flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-10 cursor-pointer hover:border-[var(--accent-brass)] transition mb-6">
          <span className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            {file ? file.name : "Choose a PDF"}
          </span>
          <span className="font-tool text-xs text-[var(--text-muted)]">
            Edit metadata, add text, rotate pages · everything stays in your browser
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
            Loading...
          </p>
        )}

        {file && !loading && (
          <>
            <p className="font-tool text-xs text-[var(--text-muted)] mb-6">
              The PDF has {pageCount} {pageCount === 1 ? "page" : "pages"}
            </p>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Metadata
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Add text
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Text to add..."
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Page</label>
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
                    <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Size</label>
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
                    <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">X (from left)</label>
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
                  Add text to the page
                </button>
                <p className="font-tool text-xs text-[var(--text-muted)]">
                  The text is added at the top of the selected page. You can repeat this multiple times.
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Rotate page
              </p>
              <button
                onClick={rotateRight}
                className="w-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
              >
                Rotate page {textPage} by 90°
              </button>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Add watermark
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Watermark text</label>
                  <input
                    type="text"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL or your name"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between font-tool text-xs text-[var(--text-muted)] mb-2">
                      <span>Size</span>
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
                      <span>Opacity</span>
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
                  Add watermark to all pages
                </button>
              </div>
            </div>

            {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

            <button
              onClick={save}
              disabled={loading}
              className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
            >
              {loading ? "Saving..." : "Save and download PDF"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
