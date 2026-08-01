"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

export default function RegisterPage() {
  const router = useRouter();
  const { user, reloadProfile } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

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

  const usernameRegex = /^[A-Za-z0-9_-]{3,20}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usernameRegex.test(username)) {
      setError("Username must be 3-20 characters (letters, numbers, _ -).");
      return;
    }
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase!.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      const userId = data.user?.id;
      if (!userId) {
        setError("Account created but session could not be started. Please log in.");
        setLoading(false);
        return;
      }

      const { generateKeyPair, encryptPrivateKey } = await import("@/lib/secureCrypto");
      const kp = await generateKeyPair();
      const enc = await encryptPrivateKey(kp.privateKey, password);

      const { error: insertError } = await supabase!.from("profiles").insert({
        id: userId,
        username,
        email,
        display_name: null,
        pub_key: kp.publicKey,
        enc_priv_key: enc.encPrivKey,
        enc_priv_nonce: enc.encPrivNonce,
        kdf_salt: enc.kdfSalt,
      });
      if (insertError) {
        if (insertError.code === "23505") {
          setError("Username already taken");
          await supabase!.auth.signOut();
          router.replace("/register");
        } else {
          setError(insertError.message);
        }
        setLoading(false);
        return;
      }

      await reloadProfile();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to home
          </Link>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center">
            <p className="font-display text-3xl font-bold text-[var(--text-primary)] mb-3">
              Account created!
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Your encryption keys are ready. You can now send and receive secure messages.
            </p>
            <Link
              href="/strumenti/secure-messages"
              className="inline-block bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
            >
              Open Secure Messages
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
          Create your free account
        </h1>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="3-20 characters, letters, numbers, _ -"
            autoComplete="username"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            Confirm password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          {error && <p className="font-tool text-xs text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p className="font-tool text-xs text-[var(--text-muted)] text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--accent-steel)] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
