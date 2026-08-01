"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Profile {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  pub_key: string;
  enc_priv_key: string;
  enc_priv_nonce: string;
  kdf_salt: string;
  created_at: string;
}

interface SessionValue {
  configured: boolean;
  loading: boolean;
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  // Decrypted once the user unlocks it with their password.
  privateKey: string | null;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const SessionContext = createContext<SessionValue>({
  configured: false,
  loading: true,
  user: null,
  profile: null,
  privateKey: null,
  unlock: async () => false,
  lock: () => {},
  signOut: async () => {},
  reloadProfile: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(
    null
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  async function loadProfile(id: string, email: string | null) {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) setProfile(data as Profile);
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser({ id: u.id, email: u.email ?? null });
        loadProfile(u.id, u.email ?? null);
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const u = session?.user;
        if (u) {
          setUser({ id: u.id, email: u.email ?? null });
          loadProfile(u.id, u.email ?? null);
        }
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setPrivateKey(null);
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function unlock(password: string): Promise<boolean> {
    if (!profile) return false;
    try {
      const { decryptPrivateKey } = await import("@/lib/secureCrypto");
      const key = await decryptPrivateKey(
        profile.enc_priv_key,
        profile.enc_priv_nonce,
        profile.kdf_salt,
        password
      );
      setPrivateKey(key);
      return true;
    } catch {
      return false;
    }
  }

  async function signOut() {
    await supabase?.auth.signOut();
  }

  return (
    <SessionContext.Provider
      value={{
        configured: isSupabaseConfigured,
        loading,
        user,
        profile,
        privateKey,
        unlock,
        lock: () => setPrivateKey(null),
        signOut,
        reloadProfile: async () => {
          if (user) await loadProfile(user.id, user.email);
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
