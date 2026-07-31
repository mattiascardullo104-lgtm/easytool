"use client";

import { useState } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  untilNextBirthday: number;
}

const diffInDays = (a: Date, b: Date) =>
  Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);

    if (!birthDate) {
      setError("Please enter your date of birth.");
      return;
    }

    const dob = new Date(birthDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(dob.getTime())) {
      setError("Please enter a valid date.");
      return;
    }

    if (dob > today) {
      setError("The date of birth cannot be in the future.");
      return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBirthday = new Date(
      today.getFullYear() + (today > dob ? 1 : 0),
      dob.getMonth(),
      dob.getDate()
    );
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const untilNextBirthday = diffInDays(today, nextBirthday);

    setResult({ years, months, days, untilNextBirthday });
  };

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
          Age Calculator
        </h1>

        <div className="mb-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Date of birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
        </div>

        <button
          onClick={calculate}
          className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition mb-6"
        >
          Calculate
        </button>

        {error && (
          <p className="font-tool text-xs text-red-400 text-center mb-6">
            {error}
          </p>
        )}

        {result && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--accent-brass)]">
                  {result.years}
                </p>
                <p className="font-tool text-xs text-[var(--text-muted)] mt-1">Years</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--accent-brass)]">
                  {result.months}
                </p>
                <p className="font-tool text-xs text-[var(--text-muted)] mt-1">Months</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--accent-brass)]">
                  {result.days}
                </p>
                <p className="font-tool text-xs text-[var(--text-muted)] mt-1">Days</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center">
              <p className="font-tool text-xs text-[var(--text-muted)] mb-1">
                DAYS UNTIL NEXT BIRTHDAY
              </p>
              <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                {result.untilNextBirthday}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
