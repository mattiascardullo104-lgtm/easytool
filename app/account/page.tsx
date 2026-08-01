"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";

export default function AccountPage() {
  const router = useRouter();
  const { configured, loading, user, profile, privateKey, unlock, lock, signOut } =
    useSession();
  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="font-tool text-xs text-[var(--text-muted)]">Loading...</p>
        </div>
      </main>
    );
  }

  if (!configured) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to home
          </Link>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center">
            <p className="font-display text-xl font-semibold text-[var(--text-primary)] mb-3">
              Accounts are not configured yet.
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              The site owner needs to add the Supabase keys (see SETUP-SUPABASE.md).
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to home
          </Link>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center">
            <p className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
              You are not logged in
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] hover:text-[var(--text-primary)] transition"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError("");
    setUnlockLoading(true);
    const ok = await unlock(password);
    setUnlockLoading(false);
    if (!ok) {
      setUnlockError("Wrong password");
      return;
    }
    setPassword("");
    setUnlocked(true);
  };

  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString()
    : "";

  const fingerprint = profile?.pub_key
    ? profile.pub_key.slice(0, 16)
    : "";

  const isUnlocked = privateKey !== null;

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </Link>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8">
          <div className="mb-6">
            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
              TOOLS · ACCOUNT
            </p>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] break-all">
              {profile?.username || "Account"}
            </h1>
          </div>

          <div className="space-y-2 mb-8 text-sm">
            <p className="text-[var(--text-muted)]">
              Email: <span className="text-[var(--text-primary)]">{profile?.email || user.email}</span>
            </p>
            <p className="text-[var(--text-muted)]">
              Member since: <span className="text-[var(--text-primary)]">{memberSince}</span>
            </p>
            <div className="pt-4">
              <p className="font-tool text-xs text-[var(--text-muted)] mb-1">
                Your public encryption key (used to receive secure messages)
              </p>
              <p className="font-mono text-sm text-[var(--accent-steel)] break-all">{fingerprint}…</p>
            </div>
          </div>

          {!isUnlocked ? (
            <form
              onSubmit={handleUnlock}
              className="border border-[var(--border-subtle)] rounded-lg p-6 mb-8"
            >
              <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                Unlock your messages
              </p>
              <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                Your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
              />
              {unlockError && (
                <p className="font-tool text-xs text-red-400 text-center mb-4">{unlockError}</p>
              )}
              <button
                type="submit"
                disabled={unlockLoading}
                className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
              >
                {unlockLoading ? "Unlocking..." : "Unlock"}
              </button>
              <p className="font-tool text-xs text-[var(--text-muted)] mt-4">
                Your private key is encrypted with your password and stored
                securely. Entering it here unlocks message decryption in this
                browser.
              </p>
            </form>
          ) : (
            <div className="border border-[var(--border-subtle)] rounded-lg p-6 mb-8">
              <p className="text-[var(--text-primary)] mb-4">
                Messages unlocked ✓
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/strumenti/secure-messages"
                  className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
                >
                  Open Secure Messages
                </Link>
                <button
                  onClick={() => {
                    lock();
                    setUnlocked(false);
                  }}
                  className="border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] hover:text-[var(--text-primary)] transition"
                >
                  Lock
                </button>
              </div>
            </div>
          )}

          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] hover:text-[var(--text-primary)] transition w-full"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
