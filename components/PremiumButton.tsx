"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { setPremiumActive } from "@/lib/usePremium";

export default function PremiumButton() {
  const [activated, setActivated] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={SITE.koFiMembership}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-10 py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
        >
          Subscribe for €1.99/month
        </a>
        {!activated && (
          <button
            onClick={() => {
              setPremiumActive();
              setActivated(true);
            }}
            className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-10 py-3.5 rounded-lg hover:border-[var(--accent-steel)] transition"
          >
            I&apos;ve subscribed: activate Premium
          </button>
        )}
      </div>

      {activated && (
        <p className="font-display text-lg font-semibold text-[var(--accent-brass)] mt-6">
          Premium activated! Ads have been removed. ⭐
        </p>
      )}

      <p className="font-tool text-[11px] text-[var(--text-muted)] mt-4">
        The payment is processed securely on Ko-fi. After subscribing, come back
        here and click on &quot;activate Premium&quot;.
      </p>
    </div>
  );
}
