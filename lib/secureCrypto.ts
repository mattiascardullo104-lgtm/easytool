// Client-side end-to-end encryption helpers (libsodium-wrappers).
// Every user owns an X25519 keypair. The private key never leaves the
// client in plain form: it is stored server-side only encrypted with a
// key derived from the user's password (crypto_pwhash + secretbox).
// Messages are sealed with crypto_box (XSalsa20-Poly1305): the server
// only ever sees ciphertext + nonce.

import _sodium from "libsodium-wrappers-sumo";

interface SodiumLike {
  ready: Promise<void>;
  crypto_box_keypair(): { publicKey: Uint8Array; privateKey: Uint8Array };
  randombytes_buf(n: number): Uint8Array;
  crypto_pwhash(
    keyLength: number,
    password: string,
    salt: Uint8Array,
    opsLimit: number,
    memLimit: number,
    algorithm: number
  ): Uint8Array;
  crypto_secretbox_KEYBYTES?: number;
  crypto_secretbox_NONCEBYTES?: number;
  crypto_pwhash_SALTBYTES?: number;
  crypto_pwhash_OPSLIMIT_MODERATE?: number;
  crypto_pwhash_MEMLIMIT_MODERATE?: number;
  crypto_pwhash_ALG_DEFAULT?: number;
  crypto_secretbox_easy(
    message: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ): Uint8Array;
  crypto_secretbox_open_easy(
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ): Uint8Array;
  crypto_box_NONCEBYTES?: number;
  crypto_box_easy(
    message: Uint8Array,
    nonce: Uint8Array,
    recipientPublicKey: Uint8Array,
    senderPrivateKey: Uint8Array
  ): Uint8Array;
  crypto_box_open_easy(
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    senderPublicKey: Uint8Array,
    recipientPrivateKey: Uint8Array
  ): Uint8Array;
  to_base64(input: Uint8Array | string): string;
  from_base64(input: string): Uint8Array;
  from_string(input: string): Uint8Array;
  to_string(input: Uint8Array): string;
}

const b64 = (bytes: Uint8Array) => _sodium.to_base64(bytes);
const fromB64 = (s: string) => _sodium.from_base64(s);

// Some builds of libsodium-wrappers no longer expose the crypto_pwhash
// constants; fall back to the standard libsodium values.
const PW_SALT_BYTES = 16;
const PW_OPS_LIMIT = 3;
const PW_MEM_LIMIT = 268435456;
const PW_ALG_DEFAULT = 2;

let sodium: SodiumLike | null = null;
async function getSodium(): Promise<SodiumLike> {
  if (!sodium) {
    await _sodium.ready;
    sodium = _sodium as unknown as SodiumLike;
  }
  return sodium;
}

// --- Key generation ---

export async function generateKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  const s = await getSodium();
  const kp: { publicKey: Uint8Array; privateKey: Uint8Array } =
    s.crypto_box_keypair();
  return { publicKey: b64(kp.publicKey), privateKey: b64(kp.privateKey) };
}

// --- Private key encrypted at rest with a password-derived key ---

export async function encryptPrivateKey(
  privateKey: string,
  password: string
): Promise<{ encPrivKey: string; encPrivNonce: string; kdfSalt: string }> {
  const s = await getSodium();
  const salt = s.randombytes_buf(s.crypto_pwhash_SALTBYTES ?? PW_SALT_BYTES);
  const key = s.crypto_pwhash(
    s.crypto_secretbox_KEYBYTES ?? 32,
    password,
    salt,
    s.crypto_pwhash_OPSLIMIT_MODERATE ?? PW_OPS_LIMIT,
    s.crypto_pwhash_MEMLIMIT_MODERATE ?? PW_MEM_LIMIT,
    s.crypto_pwhash_ALG_DEFAULT ?? PW_ALG_DEFAULT
  );
  const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES ?? 24);
  const enc = s.crypto_secretbox_easy(s.from_string(privateKey), nonce, key);
  return {
    encPrivKey: b64(enc),
    encPrivNonce: b64(nonce),
    kdfSalt: b64(salt),
  };
}

export async function decryptPrivateKey(
  encPrivKey: string,
  encPrivNonce: string,
  kdfSalt: string,
  password: string
): Promise<string> {
  const s = await getSodium();
  const key = s.crypto_pwhash(
    s.crypto_secretbox_KEYBYTES ?? 32,
    password,
    fromB64(kdfSalt),
    s.crypto_pwhash_OPSLIMIT_MODERATE ?? PW_OPS_LIMIT,
    s.crypto_pwhash_MEMLIMIT_MODERATE ?? PW_MEM_LIMIT,
    s.crypto_pwhash_ALG_DEFAULT ?? PW_ALG_DEFAULT
  );
  const dec = s.crypto_secretbox_open_easy(
    fromB64(encPrivKey),
    fromB64(encPrivNonce),
    key
  );
  return s.to_string(dec);
}

// --- Message sealing (E2E, 1:1) ---

export interface SealedMessage {
  ciphertext: string;
  nonce: string;
}

export async function sealMessage(
  message: string,
  recipientPublicKey: string,
  ownPrivateKey: string
): Promise<SealedMessage> {
  const s = await getSodium();
  const nonce = s.randombytes_buf(s.crypto_box_NONCEBYTES ?? 24);
  const ciphertext = s.crypto_box_easy(
    s.from_string(message),
    nonce,
    fromB64(recipientPublicKey),
    fromB64(ownPrivateKey)
  );
  return { ciphertext: b64(ciphertext), nonce: b64(nonce) };
}

export async function openMessage(
  ciphertext: string,
  nonce: string,
  senderPublicKey: string,
  ownPrivateKey: string
): Promise<string> {
  const s = await getSodium();
  const dec = s.crypto_box_open_easy(
    fromB64(ciphertext),
    fromB64(nonce),
    fromB64(senderPublicKey),
    fromB64(ownPrivateKey)
  );
  return s.to_string(dec);
}
