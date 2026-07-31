"use client";

import { useState, useEffect, useRef } from "react";

interface Entry {
  id: string;
  site: string;
  username: string;
  password: string;
}

const STORAGE_KEY = "easytool-vault";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToBytes(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(password: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export default function PasswordManager() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hasVault, setHasVault] = useState(false);
  const [setup, setSetup] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const keyRef = useRef<CryptoKey | null>(null);
  const saltRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    setHasVault(localStorage.getItem(STORAGE_KEY) !== null);
    setLoading(false);
  }, []);

  const saveVault = async (data: Entry[]) => {
    const key = keyRef.current;
    const salt = saltRef.current;
    if (!key || !salt) return;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = encoder.encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      plaintext
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
        data: bytesToBase64(new Uint8Array(ciphertext)),
      })
    );
  };

  const createVault = async () => {
    setError("");
    if (masterPassword.length < 6) {
      setError("The master password must be at least 6 characters.");
      return;
    }
    if (masterPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(masterPassword, salt);
    keyRef.current = key;
    saltRef.current = salt;
    await saveVault([]);
    setHasVault(true);
    setUnlocked(true);
    setSetup(false);
    setMasterPassword("");
    setConfirmPassword("");
  };

  const unlock = async () => {
    setError("");
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      const salt = base64ToBytes(parsed.salt);
      const iv = base64ToBytes(parsed.iv);
      const key = await deriveKey(masterPassword, salt);
      const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        base64ToBytes(parsed.data)
      );
      keyRef.current = key;
      saltRef.current = salt;
      setEntries(JSON.parse(decoder.decode(plaintext)));
      setUnlocked(true);
      setMasterPassword("");
    } catch {
      setError("Incorrect master password.");
    }
  };

  const lock = () => {
    setUnlocked(false);
    setEntries([]);
    setVisible(new Set());
    keyRef.current = null;
    saltRef.current = null;
  };

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!site || !username || !password) {
      setError("Please fill in site, email and password.");
      return;
    }
    const next = [
      ...entries,
      { id: crypto.randomUUID(), site, username, password },
    ];
    setEntries(next);
    await saveVault(next);
    setSite("");
    setUsername("");
    setPassword("");
    setShowNewPassword(false);
  };

  const deleteEntry = async (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    await saveVault(next);
  };

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const chars = lower + upper + numbers + symbols;
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const toggleVisible = (id: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyPassword = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <p className="font-tool text-xs text-[var(--text-muted)]">Loading...</p>
        </div>
      </main>
    );
  }

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
          Password Manager
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Your passwords stay encrypted in the browser, protected by a master password. Nothing is sent online.
        </p>

        {!unlocked ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
            {hasVault ? (
              <>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Enter your master password
                </label>
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
                />
                {error && <p className="font-tool text-xs text-red-400 mb-4">{error}</p>}
                <button
                  onClick={unlock}
                  className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
                >
                  Unlock
                </button>
              </>
            ) : (
              <>
                <p className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Create your vault
                </p>
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Master password
                </label>
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
                />
                <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">
                  Confirm master password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat it"
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
                />
                {error && <p className="font-tool text-xs text-red-400 mb-4">{error}</p>}
                <button
                  onClick={createVault}
                  className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
                >
                  Create vault
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <form onSubmit={addEntry} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Site or service</label>
                  <input
                    type="text"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="e.g. gmail.com"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Email or username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. name@email.com"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                  />
                </div>
                <div>
                  <label className="font-tool text-xs text-[var(--text-muted)] block mb-2">Password</label>
                  <div className="flex gap-2">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-4 rounded-md hover:border-[var(--accent-steel)] transition shrink-0"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                {error && <p className="font-tool text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
                >
                  Save password
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between mb-4">
              <p className="font-tool text-xs text-[var(--text-muted)]">
                {entries.length} {entries.length === 1 ? "password saved" : "passwords saved"}
              </p>
              <button
                onClick={lock}
                className="font-tool text-xs text-[var(--accent-steel)] hover:underline"
              >
                Lock
              </button>
            </div>

            {entries.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-8 border border-dashed border-[var(--border-subtle)] rounded-lg">
                No passwords saved yet. Add your first one above.
              </p>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div key={entry.id} className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-surface)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-semibold text-[var(--text-primary)]">{entry.site}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleVisible(entry.id)}
                          className="font-tool text-xs text-[var(--accent-steel)] hover:underline"
                        >
                          {visible.has(entry.id) ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => copyPassword(entry.id, entry.password)}
                          className="font-tool text-xs text-[var(--accent-steel)] hover:underline"
                        >
                          {copiedId === entry.id ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="font-tool text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="font-tool text-xs text-[var(--text-muted)]">{entry.username}</div>
                    <div className="font-tool text-sm text-[var(--text-primary)] break-all">
                      {visible.has(entry.id) ? entry.password : "••••••••"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
