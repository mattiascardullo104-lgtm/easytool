"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { setPremiumActive } from "@/lib/usePremium";

export default function PremiumButton() {
  const [activated, setActivated] = useState(false);

  const subReady = Boolean(SITE.paypalSubscription);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {subReady ? (
          <a
            href={SITE.paypalSubscription}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-10 py-3.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_32px_rgba(201,161,90,0.4)] transition"
          >
            Subscribe for €1.99/month
          </a>
        ) : (
          <span className="w-full sm:w-auto bg-[var(--accent-brass)]/50 text-[#15181C] font-medium px-10 py-3.5 rounded-lg cursor-not-allowed">
            Subscribe for €1.99/month
          </span>
        )}
        {!activated && (
          <button
            onClick={() => {
              setPremiumActive();
              setActivated(true);
            }}
            disabled={!subReady}
            className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-10 py-3.5 rounded-lg hover:border-[var(--accent-steel)] transition disabled:opacity-40"
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
        {subReady
          ? "The payment is processed securely via PayPal. After subscribing, come back here and click on \"activate Premium\"."
          : "Setup in progress: the button activates as soon as the administrator connects PayPal."}
      </p>
    </div>
  );
}
