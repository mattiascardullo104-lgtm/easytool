"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
        <div className="max-w-md mx-auto">
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const raw = identifier.trim();
    if (!raw || !pin) {
      setError("Enter your username and PIN.");
      setLoading(false);
      return;
    }

    try {
      let email = raw;
      if (!raw.includes("@")) {
        const { data: lookup, error: lookupError } = await supabase!.rpc(
          "get_auth_email_for_username",
          { uname: raw }
        );
        if (lookupError || !lookup) {
          setError("User not found.");
          setLoading(false);
          return;
        }
        email = lookup;
      }

      const { error: signInError } = await supabase!.auth.signInWithPassword({
        email,
        password: pin,
      });
      if (signInError) {
        setError("Invalid username or PIN");
        setLoading(false);
        return;
      }
      router.push("/strumenti/secure-messages");
    } catch {
      setError("Login failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
      <div className="max-w-md mx-auto">
        <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-[#2E6B4E] flex items-center justify-center text-lg">
            🔒
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Welcome back
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Log in with your username and PIN.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 animate-fade-in-up">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            USERNAME
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
            }}
            placeholder="e.g. matti"
            autoComplete="username"
            autoFocus
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            PIN
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            placeholder="••••••"
            autoComplete="current-password"
            inputMode="numeric"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          {error && <p className="font-tool text-xs text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full bg-[#2E6B4E] text-white font-medium px-6 py-3 rounded-lg hover:opacity-95 transition disabled:opacity-40"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p className="font-tool text-xs text-[var(--text-muted)] text-center mt-4">
            New here?{" "}
            <Link href="/register" className="text-[var(--accent-steel)] hover:underline">
              Create a free account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
