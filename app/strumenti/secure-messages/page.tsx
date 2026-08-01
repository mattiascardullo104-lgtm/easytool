"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { sealMessage, openMessage } from "@/lib/secureCrypto";

interface Contact {
  id: string;
  username: string;
  email: string;
  pub_key: string;
}

interface DbMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  box: string;
  nonce: string;
  self_box: string;
  self_nonce: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  text: string;
  time: string;
}

interface ConversationEntry {
  contact: Contact;
  lastText: string;
  lastTime: string;
  lastIso: string;
}

const DEFAULT_CONTACT: Contact | null = null;

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatListTime(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  } catch {
    return "";
  }
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default function SecureMessages() {
  const { configured, loading, user, profile, privateKey, unlock } = useSession();

  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [selected, setSelected] = useState<Contact | null>(DEFAULT_CONTACT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const myIdRef = useRef<string | null>(null);
  const myPubRef = useRef<string | null>(null);
  const myPrivRef = useRef<string | null>(null);
  const selectedRef = useRef<Contact | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  myIdRef.current = user?.id ?? null;
  myPubRef.current = profile?.pub_key ?? null;
  myPrivRef.current = privateKey;
  selectedRef.current = selected;
  messagesRef.current = messages;

  const bottomRef = useRef<HTMLDivElement>(null);

  const appendMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const doSearch = async () => {
    if (!supabase || !user) return;
    const q = searchQuery.trim();
    if (q.length < 2) return;
    setSearching(true);
    setSearchError("");
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, pub_key")
        .or(`username.ilike.%${q}%,email.ilike.%${q}%`)
        .limit(20);
      if (error) throw error;
      const me = user.id;
      const contacts: Contact[] = (data ?? [])
        .filter(
          (p: { id: string; username: string; email: string; pub_key: string }) =>
            p.id !== me
        )
        .map((p: { id: string; username: string; email: string; pub_key: string }) => ({
          id: p.id,
          username: p.username,
          email: p.email,
          pub_key: p.pub_key,
        }));
      setSearchResults(contacts);
      setSearchDone(true);
      if (contacts.length === 0) setSearchError("No users found with that search.");
    } catch {
      setSearchError("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const decryptRow = useCallback(
    async (row: DbMessage, contact: Contact): Promise<ChatMessage> => {
      const me = myIdRef.current;
      const priv = myPrivRef.current;
      const pub = myPubRef.current;
      if (!me || !priv || !pub) throw new Error("unavailable");
      let text: string;
      if (row.sender_id === me) {
        text = await openMessage(row.self_box, row.self_nonce, pub, priv);
      } else {
        text = await openMessage(row.box, row.nonce, contact.pub_key, priv);
      }
      return {
        id: row.id,
        sender_id: row.sender_id,
        text,
        time: formatTime(row.created_at),
      };
    },
    []
  );

  const loadHistory = useCallback(
    async (contact: Contact) => {
      if (!supabase || !user) return;
      const me = user.id;
      setHistoryLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${me},recipient_id.eq.${contact.id}),and(sender_id.eq.${contact.id},recipient_id.eq.${me})`
          )
          .order("created_at", { ascending: true })
          .limit(200);
        if (error) throw error;
        const rows = (data ?? []) as DbMessage[];
        const placeholders: ChatMessage[] = rows.map((r) => ({
          id: r.id,
          sender_id: r.sender_id,
          text: "Decrypting...",
          time: formatTime(r.created_at),
        }));
        setMessages(placeholders);
        const decrypted = await Promise.all(
          rows.map(async (r) => {
            try {
              return await decryptRow(r, contact);
            } catch {
              return {
                id: r.id,
                sender_id: r.sender_id,
                text: "[Could not decrypt]",
                time: formatTime(r.created_at),
              } as ChatMessage;
            }
          })
        );
        setMessages(decrypted);
      } catch {
        setMessages([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [user, decryptRow]
  );

  const loadConversations = useCallback(async () => {
    if (!supabase || !user) return;
    const me = user.id;
    const priv = myPrivRef.current;
    const pub = myPubRef.current;
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${me},recipient_id.eq.${me}`)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      const rows = (data ?? []) as DbMessage[];
      const otherIds = Array.from(
        new Set(
          rows.map((r) => (r.sender_id === me ? r.recipient_id : r.sender_id))
        )
      );
      if (otherIds.length === 0) {
        setConversations([]);
        return;
      }
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, username, email, pub_key")
        .in("id", otherIds);
      if (pErr) throw pErr;
      const byId = new Map<string, Contact>();
      (profiles ?? []).forEach(
        (p: { id: string; username: string; email: string; pub_key: string }) =>
          byId.set(p.id, {
            id: p.id,
            username: p.username,
            email: p.email,
            pub_key: p.pub_key,
          })
      );
      const entries: ConversationEntry[] = [];
      const seen = new Set<string>();
      for (const r of rows) {
        const otherId = r.sender_id === me ? r.recipient_id : r.sender_id;
        if (seen.has(otherId)) continue;
        seen.add(otherId);
        const contact = byId.get(otherId);
        if (!contact) continue;
        let preview = "[Could not decrypt]";
        if (priv && pub) {
          try {
            if (r.sender_id === me) {
              preview = await openMessage(r.self_box, r.self_nonce, pub, priv);
            } else {
              preview = await openMessage(r.box, r.nonce, contact.pub_key, priv);
            }
          } catch {
            // keep failure preview
          }
        }
        const prefix = r.sender_id === me ? "You: " : `${contact.username}: `;
        entries.push({
          contact,
          lastText: `${prefix}${preview}`,
          lastTime: formatListTime(r.created_at),
          lastIso: r.created_at,
        });
      }
      entries.sort((a, b) => (a.lastIso < b.lastIso ? 1 : -1));
      setConversations(entries);
    } catch {
      // keep current list on failure
    }
  }, [user]);

  const sendMessage = async () => {
    const text = input.trim();
    const contact = selectedRef.current;
    const me = myIdRef.current;
    const priv = myPrivRef.current;
    const pub = myPubRef.current;
    if (
      !supabase ||
      !me ||
      !contact ||
      !priv ||
      !pub ||
      !text ||
      sending
    ) {
      return;
    }
    setSending(true);
    try {
      const recipientCopy = await sealMessage(text, contact.pub_key, priv);
      const selfCopy = await sealMessage(text, pub, priv);
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: me,
          recipient_id: contact.id,
          box: recipientCopy.ciphertext,
          nonce: recipientCopy.nonce,
          self_box: selfCopy.ciphertext,
          self_nonce: selfCopy.nonce,
        })
        .select("*")
        .single();
      if (error) throw error;
      const row = data as DbMessage;
      const chatMsg: ChatMessage = {
        id: row.id,
        sender_id: row.sender_id,
        text,
        time: formatTime(row.created_at),
      };
      appendMessage(chatMsg);
      setInput("");
      setConversations((prev) => {
        const next = prev.filter((c) => c.contact.id !== contact.id);
        return [
          {
            contact,
            lastText: `You: ${text}`,
            lastTime: formatListTime(row.created_at),
            lastIso: row.created_at,
          },
          ...next,
        ];
      });
    } catch {
      // insert failed; keep input so the user can retry
    } finally {
      setSending(false);
    }
  };

  const refreshConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);

  // Load conversations once when the main UI becomes available
  useEffect(() => {
    if (!supabase || !user || !privateKey || !profile) return;
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, privateKey, profile]);

  // Realtime subscription + polling fallback
  useEffect(() => {
    if (!supabase || !user || !privateKey || !profile) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const row = payload.new as DbMessage;
            const me = myIdRef.current;
            const contact = selectedRef.current;
            const priv = myPrivRef.current;
            const pub = myPubRef.current;
            if (!me || !priv || !pub) return;
            const involvesMe = row.sender_id === me || row.recipient_id === me;
            if (!involvesMe) return;
            const otherId = row.sender_id === me ? row.recipient_id : row.sender_id;
            const time = formatTime(row.created_at);
            if (contact && otherId === contact.id) {
              const placeholders = messagesRef.current;
              if (placeholders.some((m) => m.id === row.id)) return;
              setMessages((prev) => [
                ...prev,
                {
                  id: row.id,
                  sender_id: row.sender_id,
                  text: "Decrypting...",
                  time,
                },
              ]);
              decryptRow(row, contact)
                .then((chatMsg) => {
                  setMessages((prev) => {
                    const idx = prev.findIndex((m) => m.id === chatMsg.id);
                    if (idx === -1) return [...prev, chatMsg];
                    const next = [...prev];
                    next[idx] = chatMsg;
                    return next;
                  });
                })
                .catch(() => {
                  setMessages((prev) => {
                    const idx = prev.findIndex((m) => m.id === row.id);
                    if (idx === -1) return prev;
                    const next = [...prev];
                    next[idx] = {
                      id: row.id,
                      sender_id: row.sender_id,
                      text: "[Could not decrypt]",
                      time,
                    };
                    return next;
                  });
                });
            }
            refreshConversations();
          }
        )
        .subscribe();
    } catch {
      channel = null;
    }

    const interval = window.setInterval(() => {
      refreshConversations();
    }, 8000);

    return () => {
      try {
        if (channel && supabase) supabase.removeChannel(channel);
      } catch {
        // ignore
      }
      window.clearInterval(interval);
    };
  }, [user, privateKey, profile, decryptRow, refreshConversations]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!configured) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to Utility Tools
          </a>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
            TOOLS · MESSAGING
          </p>
          <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Secure Messages
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            End-to-end encrypted. Messages are encrypted in your browser, the server only stores ciphertext and cannot read them. Free, no limits.
          </p>
          <Card>
            <p className="text-sm text-[var(--text-primary)]">
              Secure Messages is not configured yet. The site owner needs to add the Supabase keys (see SETUP-SUPABASE.md).
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to Utility Tools
          </a>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
            TOOLS · MESSAGING
          </p>
          <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Secure Messages
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            End-to-end encrypted. Messages are encrypted in your browser, the server only stores ciphertext and cannot read them. Free, no limits.
          </p>
          <p className="font-tool text-xs text-[var(--text-muted)]">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to Utility Tools
          </a>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
            TOOLS · MESSAGING
          </p>
          <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Secure Messages
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            End-to-end encrypted. Messages are encrypted in your browser, the server only stores ciphertext and cannot read them. Free, no limits.
          </p>
          <Card className="text-center">
            <p className="text-sm text-[var(--text-primary)] mb-6">
              You need an account to use Secure Messages
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/login"
                className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
              >
                Create free account
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to Utility Tools
          </a>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
            TOOLS · MESSAGING
          </p>
          <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Secure Messages
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            End-to-end encrypted. Messages are encrypted in your browser, the server only stores ciphertext and cannot read them. Free, no limits.
          </p>
          <Card className="text-center">
            <p className="text-sm text-[var(--text-primary)] mb-6">
              Finish setting up your account
            </p>
            <Link
              href="/account"
              className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition"
            >
              Go to your account
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  if (privateKey === null) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
            ← Back to Utility Tools
          </a>
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
            TOOLS · MESSAGING
          </p>
          <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
            Secure Messages
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            End-to-end encrypted. Messages are encrypted in your browser, the server only stores ciphertext and cannot read them. Free, no limits.
          </p>
          <Card>
            <p className="text-sm text-[var(--text-primary)] mb-4">
              Your private key is encrypted with your password. Enter it to decrypt your conversations.
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
                  if (!unlocking) {
                    const run = async () => {
                      setUnlocking(true);
                      const ok = await unlock(password);
                      if (!ok) setUnlockError(true);
                      setPassword("");
                      setUnlocking(false);
                    };
                    run();
                  }
                }
              }}
              placeholder="Your password"
              className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
            />
            {unlockError && (
              <p className="font-tool text-xs text-red-400 mb-4">Wrong password</p>
            )}
            <button
              onClick={async () => {
                if (unlocking) return;
                setUnlocking(true);
                const ok = await unlock(password);
                if (!ok) setUnlockError(true);
                setPassword("");
                setUnlocking(false);
              }}
              disabled={unlocking || !password}
              className="w-full bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
            >
              {unlocking ? "Unlocking..." : "Unlock"}
            </button>
          </Card>
        </div>
      </main>
    );
  }

  const selectContact = (contact: Contact) => {
    setSelected(contact);
    loadHistory(contact);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <a href="/strumenti/utility" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to Utility Tools
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · MESSAGING
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-2">
          Secure Messages
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          End-to-end encrypted. Messages are encrypted in your browser, the server only stores ciphertext and cannot read them. Free, no limits.
        </p>

        <div className="grid md:grid-cols-[280px_1fr] gap-4">
          {/* LEFT PANE */}
          <div>
            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
              FIND PEOPLE
            </p>
            <div className="flex gap-2 mb-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    doSearch();
                  }
                }}
                placeholder="Search by username or email"
                className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition min-w-0"
              />
              <button
                onClick={doSearch}
                disabled={searching || searchQuery.trim().length < 2}
                className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-4 py-2 rounded-md hover:opacity-90 transition disabled:opacity-40 text-sm"
              >
                Search
              </button>
            </div>
            {searching && (
              <p className="text-xs text-[var(--text-muted)] mb-2">Searching...</p>
            )}
            {searchError && !searching && (
              <p className="text-xs text-[var(--text-muted)] mb-2">{searchError}</p>
            )}
            {searchDone && !searching && searchError === "" && (
              <p className="text-xs text-[var(--text-muted)] mb-2">
                {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
              </p>
            )}
            {searchResults.length > 0 && (
              <div className="space-y-2 mb-4">
                {searchResults.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectContact(c)}
                    className={`w-full text-left bg-[var(--bg-surface)] border rounded-lg p-3 transition ${
                      selected?.id === c.id
                        ? "border-[var(--accent-brass)]"
                        : "border-[var(--border-subtle)] hover:border-[var(--accent-steel)]"
                    }`}
                  >
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {c.username}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{c.email}</p>
                    <p className="font-tool text-[10px] text-[var(--text-muted)] mt-1">
                      🔒 E2E encrypted
                    </p>
                  </button>
                ))}
              </div>
            )}

            <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mt-6 mb-2">
              CONVERSATIONS
            </p>
            {conversations.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-lg p-3">
                No conversations yet. Find someone above to start chatting.
              </p>
            ) : (
              <div className="space-y-2">
                {conversations.map((c) => (
                  <button
                    key={c.contact.id}
                    onClick={() => selectContact(c.contact)}
                    className={`w-full text-left bg-[var(--bg-surface)] border rounded-lg p-3 transition ${
                      selected?.id === c.contact.id
                        ? "border-[var(--accent-brass)]"
                        : "border-[var(--border-subtle)] hover:border-[var(--accent-steel)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-[var(--text-primary)]">
                        {c.contact.username}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {c.lastTime}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {c.lastText}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANE */}
          <div>
            {selected === null ? (
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 h-[420px] flex items-center justify-center">
                <p className="text-sm text-[var(--text-muted)] text-center">
                  Select a person from the list to start an encrypted chat. 🔒
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {selected.username}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {selected.email} · 🔒 E2E encrypted
                    </p>
                  </div>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 h-[420px] overflow-y-auto mb-4">
                  {historyLoading && messages.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-10">
                      Loading...
                    </p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-10">
                      No messages yet. Say hello. 👋
                    </p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`mb-3 flex ${
                          m.sender_id === user.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-lg text-sm whitespace-pre-wrap ${
                            m.sender_id === user.id
                              ? "bg-[var(--accent-brass)] text-[#15181C]"
                              : "bg-[#1E2329] text-[var(--text-primary)]"
                          }`}
                        >
                          {m.text}
                          <span
                            className={`text-[10px] opacity-70 block mt-1 ${
                              m.text === "[Could not decrypt]"
                                ? "italic text-[var(--text-muted)]"
                                : ""
                            }`}
                          >
                            {m.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition min-w-0"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="font-tool text-[11px] text-[var(--text-muted)] mt-6">
          How it works: your private key never leaves this browser in plain form. Messages are sealed with libsodium crypto_box to the recipient&apos;s public key. Not even the server can read them.
        </p>
      </div>
    </main>
  );
}
