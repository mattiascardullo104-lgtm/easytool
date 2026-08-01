"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    router.push("/strumenti/secure-messages");
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · ACCOUNT
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 animate-fade-in-up">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          {error && <p className="font-tool text-xs text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-95 transition disabled:opacity-40"
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
