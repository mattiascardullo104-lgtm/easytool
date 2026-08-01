# Supabase setup (accounts + Secure Messages)

EasyTools accounts and the end-to-end encrypted messaging tool use Supabase
(Postgres + Auth + Realtime). The free tier is enough. Without these keys the
rest of the site keeps working; the account pages and Secure Messages show a
"not configured" message instead.

## Steps (one-time, ~10 minutes)

1. Go to https://supabase.com and sign up (free).
2. Create a new project (pick any region, set a database password).
3. Once created, open **SQL Editor** and run the whole file
   `supabase/schema.sql` (it creates the tables and the security policies).
4. Go to **Database > Replication** (older UI: **Database > Realtime**) and
   add the table `messages` to the `supabase_realtime` publication so new
   messages arrive instantly.
5. Go to **Settings > API** and copy the two keys:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. In the project folder create a file `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

7. On Vercel: Project → Settings → Environment Variables → add the same two
   variables (prefix `NEXT_PUBLIC_`) → redeploy.

## How the encryption works (for buyers/new owners)

- On registration each user generates an X25519 keypair in the browser.
- The private key is encrypted with a key derived from the password
  (libsodium crypto_pwhash + secretbox) and stored on the server, so a user
  can restore it on any device with just their password.
- Every message is sealed with crypto_box (XSalsa20-Poly1305) to the
  recipient's public key. The server only ever stores ciphertext: it cannot
  read messages, and neither can anyone without the recipient's private key.
- Sent messages are sealed a second time to the sender's own key so the
  sender's history can be displayed too.

## Security notes

- Everything is protected by Supabase Row Level Security (see schema.sql):
  users can only read/insert their own messages and only edit their own
  profile.
- The anon key is public by design; RLS is what protects the data.
- A full Signal-style protocol (forward secrecy, identity verification,
  group chats, disappearing messages) is NOT implemented; this is a
  simplified E2E messaging implementation, adequate for a lightweight free
  tool. Keep that wording on the page honest.
