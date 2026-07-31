"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState("https://easytools.vercel.app");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna a Utility
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          STRUMENTI · UTILITY
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          QR Code Generator
        </h1>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi un link o un testo..."
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-6"
        />

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-8 flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeCanvas
              ref={canvasRef}
              value={text || " "}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#0E1113"
              level="M"
            />
          </div>
        </div>

        <button
          onClick={downloadQR}
          className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
        >
          Scarica come immagine
        </button>
      </div>
    </main>
  );
}