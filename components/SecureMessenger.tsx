"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { sealMessage, openMessage } from "@/lib/secureCrypto";

interface Contact {
  id: string;
  username: string;
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
  read_at: string | null;
  created_at: string;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  text: string;
  time: string;
  iso: string;
  read: boolean;
}

interface ConversationEntry {
  contact: Contact;
  lastText: string;
  lastTime: string;
  lastIso: string;
  unread: number;
  mine: boolean;
  read: boolean;
}

const AVATAR_COLORS = [
  "#2E6B4E",
  "#5C8AC4",
  "#8A6B4E",
  "#6B4E8A",
  "#4E7E8A",
  "#8A4E5E",
];

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function dayLabel(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
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

function hashColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 font-display font-semibold text-[var(--text-primary)] select-none"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${hashColor(name)}, ${hashColor(name + "x")})`,
        fontSize: size * 0.38,
      }}
    >
      {initials(name)}
    </div>
  );
}

function DoubleTick({ read }: { read: boolean }) {
  return (
    <span
      className={`inline-block text-[10px] leading-none align-middle ${
        read ? "text-[#8FD3AE]" : "text-[var(--text-muted)]/60"
      }`}
    >
      ✓✓
    </span>
  );
}

function SingleTick() {
  return (
    <span className="inline-block text-[10px] leading-none align-middle text-[var(--text-muted)]/60">
      ✓
    </span>
  );
}

function useConversations(
  user: { id: string } | null,
  privateKey: string | null,
  profile: { pub_key: string } | null,
  refreshTick: number
) {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const myIdRef = useRef<string | null>(null);
  const myPrivRef = useRef<string | null>(null);
  const myPubRef = useRef<string | null>(null);

  myIdRef.current = user?.id ?? null;
  myPrivRef.current = privateKey;
  myPubRef.current = profile?.pub_key ?? null;

  const load = useCallback(async () => {
    if (!supabase || !myIdRef.current || !myPrivRef.current || !myPubRef.current)
      return;
    const me = myIdRef.current;
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
        new Set(rows.map((r) => (r.sender_id === me ? r.recipient_id : r.sender_id)))
      );
      if (otherIds.length === 0) {
        setConversations([]);
        return;
      }
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, username, pub_key")
        .in("id", otherIds);
      if (pErr) throw pErr;
      const byId = new Map<string, Contact>();
      (profiles ?? []).forEach((p: { id: string; username: string; pub_key: string }) =>
        byId.set(p.id, { id: p.id, username: p.username, pub_key: p.pub_key })
      );
      const entries: ConversationEntry[] = [];
      const seen = new Set<string>();
      for (const r of rows) {
        const otherId = r.sender_id === me ? r.recipient_id : r.sender_id;
        if (seen.has(otherId)) continue;
        seen.add(otherId);
        const contact = byId.get(otherId);
        if (!contact) continue;
        const mine = r.sender_id === me;
        let preview = "[Could not decrypt]";
        let read = false;
        if (priv && pub) {
          try {
            if (mine) {
              preview = await openMessage(r.self_box, r.self_nonce, pub, priv);
              read = Boolean(r.read_at);
            } else {
              preview = await openMessage(r.box, r.nonce, contact.pub_key, priv);
            }
          } catch {
            // keep failure preview
          }
        }
        const unread = rows.filter(
          (x) => x.sender_id === otherId && x.recipient_id === me && !x.read_at
        ).length;
        const prefix = mine ? "You: " : "";
        entries.push({
          contact,
          lastText: `${prefix}${preview}`,
          lastTime: formatListTime(r.created_at),
          lastIso: r.created_at,
          unread,
          mine,
          read,
        });
      }
      entries.sort((a, b) => (a.lastIso < b.lastIso ? 1 : -1));
      setConversations(entries);
    } catch {
      // keep current list on failure
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTick]);

  return { conversations, reload: load };
}

export default function SecureMessenger() {
  const { user, profile, privateKey } = useSession();
  const [refreshTick, setRefreshTick] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [selected, setSelected] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const { conversations, reload } = useConversations(user, privateKey, profile, refreshTick);

  const myIdRef = useRef<string | null>(null);
  const myPrivRef = useRef<string | null>(null);
  const myPubRef = useRef<string | null>(null);
  const selectedRef = useRef<Contact | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  myIdRef.current = user?.id ?? null;
  myPrivRef.current = privateKey;
  myPubRef.current = profile?.pub_key ?? null;
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
        .select("id, username, pub_key")
        .or(`username.ilike.%${q}%`)
        .limit(20);
      if (error) throw error;
      const me = user.id;
      const contacts: Contact[] = (data ?? [])
        .filter((p: { id: string; username: string; pub_key: string }) => p.id !== me)
        .map((p: { id: string; username: string; pub_key: string }) => ({
          id: p.id,
          username: p.username,
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
        iso: row.created_at,
        read: Boolean(row.read_at),
      };
    },
    []
  );

  const markRead = useCallback(
    async (contactId: string) => {
      if (!supabase || !user) return;
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("recipient_id", user.id)
        .eq("sender_id", contactId)
        .is("read_at", null);
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_id === contactId && !m.read ? { ...m, read: true } : m
        )
      );
      setRefreshTick((t) => t + 1);
    },
    [user]
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
          iso: r.created_at,
          read: Boolean(r.read_at),
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
                iso: r.created_at,
                read: Boolean(r.read_at),
              } as ChatMessage;
            }
          })
        );
        setMessages(decrypted);
        markRead(contact.id);
      } catch {
        setMessages([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [user, decryptRow, markRead]
  );

  const selectContact = (contact: Contact) => {
    setSelected(contact);
    setSearchQuery("");
    setSearchResults([]);
    setSearchDone(false);
    loadHistory(contact);
  };

  const sendMessage = async () => {
    const text = input.trim();
    const contact = selectedRef.current;
    const me = myIdRef.current;
    const priv = myPrivRef.current;
    const pub = myPubRef.current;
    if (!supabase || !me || !contact || !priv || !pub || !text || sending) return;
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
        iso: row.created_at,
        read: false,
      };
      appendMessage(chatMsg);
      setInput("");
      setRefreshTick((t) => t + 1);
    } catch {
      // insert failed; keep input so the user can retry
    } finally {
      setSending(false);
    }
  };

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
            if (contact && otherId === contact.id) {
              const placeholders = messagesRef.current;
              if (placeholders.some((m) => m.id === row.id)) return;
              const time = formatTime(row.created_at);
              setMessages((prev) => [
                ...prev,
                {
                  id: row.id,
                  sender_id: row.sender_id,
                  text: "Decrypting...",
                  time,
                  iso: row.created_at,
                  read: false,
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
                  if (row.recipient_id === me) markRead(contact.id);
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
                      iso: row.created_at,
                      read: false,
                    };
                    return next;
                  });
                });
            }
            setRefreshTick((t) => t + 1);
          }
        )
        .subscribe();
    } catch {
      channel = null;
    }

    const interval = window.setInterval(() => setRefreshTick((t) => t + 1), 8000);

    return () => {
      try {
        if (channel && supabase) supabase.removeChannel(channel);
      } catch {
        // ignore
      }
      window.clearInterval(interval);
    };
  }, [user, privateKey, profile, decryptRow, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const me = user?.id ?? "";

  const grouped = useMemo(() => {
    const out: { label: string; items: ChatMessage[] }[] = [];
    for (const m of messages) {
      const label = dayLabel(m.iso);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(m);
      else out.push({ label, items: [m] });
    }
    return out;
  }, [messages]);

  const conversationsCount = conversations.length;

  return (
    <div className="grid md:grid-cols-[340px_1fr] gap-0 border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-surface)] h-[calc(100vh-260px)] min-h-[520px]">
      {/* LEFT: list */}
      <aside className="flex flex-col border-b md:border-b-0 md:border-r border-[var(--border-subtle)] bg-[#0F1113]">
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <p className="font-tool text-[10px] tracking-widest text-[var(--accent-brass)] mb-3">
            FIND PEOPLE
          </p>
          <div className="flex gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  doSearch();
                }
              }}
              placeholder="Search username"
              className="flex-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent-steel)] transition min-w-0"
            />
            <button
              onClick={doSearch}
              disabled={searching || searchQuery.trim().length < 2}
              className="bg-[var(--accent-brass)] text-[#15181C] font-medium px-4 py-2 rounded-full hover:opacity-90 transition disabled:opacity-40 text-sm"
            >
              {searching ? "..." : "Search"}
            </button>
          </div>
          {searchDone && !searching && searchError === "" && searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectContact(c)}
                  className="w-full text-left flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5 hover:border-[var(--accent-steel)] transition"
                >
                  <Avatar name={c.username} size={36} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                      {c.username}
                    </p>
                    <p className="font-tool text-[10px] text-[#8FD3AE]">🔒 E2E encrypted</p>
                  </div>
                  <span className="ml-auto text-[var(--text-muted)]">→</span>
                </button>
              ))}
            </div>
          )}
          {searchError && !searching && (
            <p className="text-xs text-[var(--text-muted)] mt-3">{searchError}</p>
          )}
        </div>

        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="font-tool text-[10px] tracking-widest text-[var(--accent-brass)]">
            CONVERSATIONS
          </p>
          {conversationsCount > 0 && (
            <span className="font-tool text-[10px] text-[var(--text-muted)]">
              {conversationsCount}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl p-4 m-2">
              No conversations yet.
              <br />
              Search a username above to start a secure chat.
            </p>
          ) : (
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.contact.id}
                  onClick={() => selectContact(c.contact)}
                  className={`w-full text-left flex items-center gap-3 rounded-xl p-2.5 transition ${
                    selected?.id === c.contact.id
                      ? "bg-[var(--bg-surface)]"
                      : "hover:bg-[var(--bg-surface)]/60"
                  }`}
                >
                  <Avatar name={c.contact.username} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                        {c.contact.username}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                        {c.lastTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {c.mine && (
                          <span className="mr-1">
                            {c.read ? <DoubleTick read /> : <SingleTick />}
                          </span>
                        )}
                        {c.lastText}
                      </p>
                      {c.unread > 0 && (
                        <span className="shrink-0 bg-[#2E6B4E] text-white text-[10px] font-medium rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT: chat */}
      <section className="flex flex-col bg-[#141518] min-w-0">
        {selected === null ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-2xl">
              🔒
            </div>
            <p className="text-sm text-[var(--text-muted)] text-center max-w-xs">
              Select a conversation to start an end-to-end encrypted chat.
              <br />
              <span className="text-[var(--text-muted)]/60 text-xs">
                Nobody, not even the server, can read your messages.
              </span>
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <Avatar name={selected.username} size={40} />
              <div className="min-w-0">
                <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                  {selected.username}
                </p>
                <p className="font-tool text-[10px] text-[#8FD3AE]">
                  End-to-end encrypted
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {historyLoading && messages.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-10">
                  Loading...
                </p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-10">
                  No messages yet. Say hello. 👋
                </p>
              ) : (
                grouped.map((g) => (
                  <div key={g.label}>
                    <div className="flex justify-center my-3">
                      <span className="font-tool text-[10px] text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full px-3 py-1">
                        {g.label}
                      </span>
                    </div>
                    {g.items.map((m) => {
                      const mine = m.sender_id === me;
                      return (
                        <div
                          key={m.id}
                          className={`mb-2 flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[78%] px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
                              mine
                                ? "bg-[#2E6B4E] text-[#EDF5EF] rounded-t-2xl rounded-bl-2xl rounded-br-md"
                                : "bg-[#26282B] text-[var(--text-primary)] rounded-t-2xl rounded-br-2xl rounded-bl-md"
                            }`}
                          >
                            {m.text}
                            <span className="flex items-center justify-end gap-1.5 text-[10px] opacity-70 mt-1">
                              {m.time}
                              {mine &&
                                (m.read ? <DoubleTick read /> : <SingleTick />)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Type a message"
                  className="flex-1 resize-none bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent-steel)] transition min-w-0 max-h-32"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="w-11 h-11 shrink-0 rounded-full bg-[#2E6B4E] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="font-tool text-[10px] text-[var(--text-muted)] mt-2">
                Messages are sealed with libsodium crypto_box to the recipient&apos;s public key. Not even the server can read them.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
