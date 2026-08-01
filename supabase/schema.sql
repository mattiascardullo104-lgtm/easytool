-- EasyTools: accounts + E2E secure messages schema
-- Run this in Supabase: Dashboard > SQL Editor > New query > Run

-- Public profile of each user (contains their public encryption key and the
-- password-encrypted private key, so it can be restored on any device).
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text unique not null,
  display_name text,
  pub_key text not null,
  enc_priv_key text not null,
  enc_priv_nonce text not null,
  kdf_salt text not null,
  created_at timestamptz not null default now()
);

-- End-to-end encrypted messages. The server only ever stores ciphertext.
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  box text not null,
  nonce text not null,
  self_box text not null,
  self_nonce text not null,
  created_at timestamptz not null default now()
);

create index messages_recipient_idx on public.messages (recipient_id, created_at);
create index messages_sender_idx on public.messages (sender_id, created_at);

alter table public.profiles enable row level security;
alter table public.messages enable row level security;

-- Profiles: everyone authenticated can read them (needed to find people),
-- but each user can only create/update their own row.
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Messages: only the sender and the recipient can read or insert.
create policy "messages_select_involved" on public.messages
  for select to authenticated using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "messages_insert_own" on public.messages
  for insert to authenticated with check (auth.uid() = sender_id);

-- --- Extensions: read receipts + username/PIN login ---

-- Read receipts: recipient marks messages as read when opening the chat.
alter table public.messages add column read_at timestamptz;

create policy "messages_recipient_mark_read" on public.messages
  for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- Username login: accounts use a derived email (username@easytool.local),
-- so the client looks up the auth email for a username before signing in.
-- SECURITY DEFINER: readable by anonymous users (needed before login).
create or replace function public.get_auth_email_for_username(uname text)
returns text
language sql stable security definer set search_path = public
as $$
  select email
  from auth.users
  where raw_user_meta_data->>'username' = uname
  limit 1;
$$;

revoke all on function public.get_auth_email_for_username(text) from public;
grant execute on function public.get_auth_email_for_username(text) to anon, authenticated;
