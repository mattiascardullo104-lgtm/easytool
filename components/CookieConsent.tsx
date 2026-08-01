'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'et_cookies_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== 'accepted' && stored !== 'declined') {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-[var(--text-muted)] flex-1">
          We use cookies to improve your experience, show ads and analyze traffic.
          Read our <a href="/cookie-policy" className="text-[var(--accent-brass)] underline underline-offset-2 hover:opacity-90 transition">Cookie Policy</a>{' '}
          and <a href="/privacy" className="text-[var(--accent-brass)] underline underline-offset-2 hover:opacity-90 transition">Privacy Policy</a>{' '}
          for details.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-2.5 rounded-md hover:opacity-90 transition"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => handleChoice('declined')}
            className="border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium px-6 py-2.5 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
