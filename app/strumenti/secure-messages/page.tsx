"use client";

import { useState } from "react";
import Link from "next/link";
import SecureMessenger from "@/components/SecureMessenger";
import { useSession } from "@/lib/useSession";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <a
          href="/strumenti/utility"
          className="font-tool text-xs text-[var(--accent-steel)] mb-4 inline-block"
        >
          ← Back to Utility Tools
        </a>
        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · MESSAGING
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-1">
          Secure Messages
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          End-to-end encrypted, Signal-style. Messages are sealed in your
          browser: the server only stores ciphertext and cannot read them.
        </p>
        {children}
      </div>
    </main>
  );
}

export default function SecureMessagesPage() {
  const { configured, loading, user, profile, privateKey, unlock } = useSession();

  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const runUnlock = async () => {
    if (unlocking) return;
    setUnlocking(true);
    const ok = await unlock(password);
    if (!ok) setUnlockError(true);
    setPassword("");
    setUnlocking(false);
  };

  if (!configured) {
    return (
      <Shell>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
          <p className="text-sm text-[var(--text-primary)]">
            Secure Messages is not configured yet. The site owner needs to add
            the Supabase keys (see SETUP-SUPABASE.md).
          </p>
        </div>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <p className="font-tool text-xs text-[var(--text-muted)]">Loading...</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] flex items-center justify-center text-xl mx-auto mb-5">
            🔒
          </div>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
            Secure messaging, Signal-style
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Create an account with just a username and a PIN, then chat with
            anyone on EasyTools. End-to-end encrypted: not even we can read
            your messages.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/register"
              className="btn-shine bg-[var(--accent-brass)] text-[#15181C] font-medium px-8 py-3 rounded-lg hover:opacity-95 transition"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-8 py-3 rounded-lg hover:border-[var(--accent-steel)] transition"
            >
              Log in
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (!profile) {
    return (
      <Shell>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-8 text-center">
          <p className="text-sm text-[var(--text-primary)] mb-4">
            Finish setting up your account
          </p>
          <Link
            href="/account"
            className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Go to your account
          </Link>
        </div>
      </Shell>
    );
  }

  if (privateKey === null) {
    return (
      <Shell>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-8 max-w-md">
          <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
            Enter your PIN
          </p>
          <p className="text-sm text-[var(--text-muted)] mb-5">
            Your private key is encrypted with your PIN. Enter it to decrypt
            your conversations.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setUnlockError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runUnlock();
              }
            }}
            placeholder="Your PIN"
            autoComplete="current-password"
            inputMode="numeric"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          {unlockError && (
            <p className="font-tool text-xs text-red-400 mb-4">Wrong PIN</p>
          )}
          <button
            onClick={runUnlock}
            disabled={unlocking || !password}
            className="btn-shine w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-95 transition disabled:opacity-40"
          >
            {unlocking ? "Unlocking..." : "Unlock"}
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <SecureMessenger />
    </Shell>
  );
}
