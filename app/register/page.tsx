"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const PIN_RE = /^\d{6,8}$/;

export default function RegisterPage() {
  const router = useRouter();
  const { reloadProfile } = useSession();

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
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
    const u = username.trim();

    if (!USERNAME_RE.test(u)) {
      setError("Username must be 3-20 characters (letters, numbers, underscore).");
      return;
    }
    if (!PIN_RE.test(pin)) {
      setError("PIN must be 6-8 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setLoading(true);
    try {
      const email = `${u}@easytool.local`;
      const { data, error: signUpError } = await supabase!.auth.signUp({
        email,
        password: pin,
        options: { data: { username: u } },
      });
      if (signUpError) {
        setError(
          signUpError.code === "user_already_exists" ||
            signUpError.code === "email_exists" ||
            /already registered|already been registered/i.test(signUpError.message)
            ? "Username already taken"
            : signUpError.message
        );
        setLoading(false);
        return;
      }
      const userId = data.user?.id;
      if (!userId || !data.session) {
        setError("Account created but session could not be started. Please log in.");
        setLoading(false);
        return;
      }

      const { generateKeyPair, encryptPrivateKey } = await import("@/lib/secureCrypto");
      const kp = await generateKeyPair();
      const enc = await encryptPrivateKey(kp.privateKey, pin);

      const { error: insertError } = await supabase!.from("profiles").insert({
        id: userId,
        username: u,
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
        } else {
          setError(insertError.message);
        }
        setLoading(false);
        return;
      }

      await reloadProfile();
      router.replace("/strumenti/secure-messages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
              Create your account
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Username + PIN. That&apos;s it. No email, no spam.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 animate-fade-in-up">
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="e.g. matti"
            autoComplete="off"
            autoFocus
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            PIN · 6-8 DIGITS
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            placeholder="••••••"
            autoComplete="new-password"
            inputMode="numeric"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
            CONFIRM PIN
          </label>
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => {
              setConfirmPin(e.target.value);
              setError("");
            }}
            placeholder="••••••"
            autoComplete="new-password"
            inputMode="numeric"
            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
          />
          {error && <p className="font-tool text-xs text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full bg-[#2E6B4E] text-white font-medium px-6 py-3 rounded-lg hover:opacity-95 transition disabled:opacity-40"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
          <p className="font-tool text-xs text-[var(--text-muted)] text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--accent-steel)] hover:underline">
              Log in
            </Link>
          </p>
          <p className="font-tool text-[10px] text-[var(--text-muted)]/70 text-center mt-3 leading-relaxed">
            Your PIN encrypts your private key. It never leaves your browser
            and cannot be recovered — don&apos;t forget it.
          </p>
        </form>
      </div>
    </main>
  );
}
