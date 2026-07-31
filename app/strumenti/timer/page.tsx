"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "stopwatch" | "countdown";

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export default function TimerTool() {
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState(300);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    if (running) return;
    setDone(false);
    if (mode === "countdown" && seconds <= 0) setSeconds(input);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === "countdown" && prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          try {
            new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAGAAAAAA==").play();
          } catch {
            // ignore
          }
          return 0;
        }
        return prev + (mode === "stopwatch" ? 1 : -1);
      });
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    stop();
    setSeconds(mode === "countdown" ? input : 0);
    setDone(false);
  };

  const switchMode = (m: Mode) => {
    stop();
    setMode(m);
    setSeconds(m === "countdown" ? input : 0);
    setDone(false);
  };

  const startMinutes = Math.floor(input / 60);
  const startSeconds = input % 60;

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to Utility
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · UTILITY
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Timer
        </h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(
            [
              { value: "stopwatch", label: "Stopwatch" },
              { value: "countdown", label: "Countdown" },
            ] as { value: Mode; label: string }[]
          ).map((m) => (
            <button
              key={m.value}
              onClick={() => switchMode(m.value)}
              className={`font-tool text-xs px-4 py-3 rounded-md border transition ${
                mode === m.value
                  ? "border-[var(--accent-brass)] text-[var(--accent-brass)]"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-steel)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "countdown" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Minutes</label>
              <input
                type="number"
                min={0}
                max={360}
                value={startMinutes}
                onChange={(e) => {
                  const mins = Math.max(0, Number(e.target.value) || 0);
                  setInput(mins * 60 + startSeconds);
                  if (!running) setSeconds(mins * 60 + startSeconds);
                }}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
              />
            </div>
            <div>
              <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Seconds</label>
              <input
                type="number"
                min={0}
                max={59}
                value={startSeconds}
                onChange={(e) => {
                  const secs = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                  setInput(startMinutes * 60 + secs);
                  if (!running) setSeconds(startMinutes * 60 + secs);
                }}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
              />
            </div>
          </div>
        )}

        {done && (
          <p className="font-tool text-xs text-[var(--accent-brass)] text-center mb-4">
            Time&apos;s up!
          </p>
        )}

        <div className="text-center mb-6">
          <p className="font-mono text-5xl text-[var(--text-primary)] tracking-wider">
            {formatTime(seconds)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={start}
            disabled={running}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
          >
            Start
          </button>
          <button
            onClick={stop}
            disabled={!running}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition disabled:opacity-40"
          >
            Pause
          </button>
          <button
            onClick={reset}
            className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
