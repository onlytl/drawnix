import localforage from 'localforage';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const MASTER_KEY_STORE_PREFIX = 'drawnix_e2ee_master_key_v1:';
const RECOVERY_KEY_PREFIX = 'drawnix-recovery-v1.';

export type EncryptedJsonPayload = {
  __drawnix_encrypted: 1;
  version: 1;
  algorithm: 'AES-GCM';
  iv: string;
  ciphertext: string;
};

export type PasswordWrappedKey = {
  salt: string;
  iterations: number;
  iv: string;
  wrappedKey: string;
  fingerprint: string;
};

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

export async function fingerprintRawMasterKey(rawKey: Uint8Array) {
  const digest = await crypto.subtle.digest('SHA-256', rawKey);
  return bytesToBase64Url(new Uint8Array(digest));
}

export async function importMasterKey(rawKey: Uint8Array) {
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function exportMasterKey(key: CryptoKey) {
  return new Uint8Array(await crypto.subtle.exportKey('raw', key));
}

export async function generateMasterKeyMaterial() {
  const rawKey = randomBytes(32);
  const key = await importMasterKey(rawKey);
  const fingerprint = await fingerprintRawMasterKey(rawKey);
  return {
    rawKey,
    key,
    fingerprint,
    recoveryKey: `${RECOVERY_KEY_PREFIX}${bytesToBase64Url(rawKey)}`,
  };
}

async function derivePasswordKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
) {
  const material = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function wrapMasterKeyWithPassword(
  rawKey: Uint8Array,
  password: string,
  iterations = 600_000,
): Promise<PasswordWrappedKey> {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const passwordKey = await derivePasswordKey(password, salt, iterations);
  const wrapped = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    passwordKey,
    rawKey,
  );

  return {
    salt: bytesToBase64Url(salt),
    iterations,
    iv: bytesToBase64Url(iv),
    wrappedKey: bytesToBase64Url(new Uint8Array(wrapped)),
    fingerprint: await fingerprintRawMasterKey(rawKey),
  };
}

export async function unwrapMasterKeyWithPassword(
  password: string,
  wrapped: PasswordWrappedKey,
) {
  const salt = base64UrlToBytes(wrapped.salt);
  const iv = base64UrlToBytes(wrapped.iv);
  const passwordKey = await derivePasswordKey(
    password,
    salt,
    wrapped.iterations,
  );
  const raw = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    passwordKey,
    base64UrlToBytes(wrapped.wrappedKey),
  );
  return new Uint8Array(raw);
}

export function parseRecoveryKey(value: string) {
  const trimmed = value.trim();
  const encoded = trimmed.startsWith(RECOVERY_KEY_PREFIX)
    ? trimmed.slice(RECOVERY_KEY_PREFIX.length)
    : trimmed;
  const rawKey = base64UrlToBytes(encoded);
  if (rawKey.byteLength !== 32) {
    throw new Error('恢复密钥格式不正确');
  }
  return rawKey;
}

export async function rememberMasterKey(userId: string, rawKey: Uint8Array) {
  await localforage.setItem(
    `${MASTER_KEY_STORE_PREFIX}${userId}`,
    bytesToBase64Url(rawKey),
  );
}

export async function loadRememberedMasterKey(userId: string) {
  const encoded = await localforage.getItem<string>(
    `${MASTER_KEY_STORE_PREFIX}${userId}`,
  );
  return encoded ? base64UrlToBytes(encoded) : null;
}

export async function forgetRememberedMasterKey(userId: string) {
  await localforage.removeItem(`${MASTER_KEY_STORE_PREFIX}${userId}`);
}

export function isEncryptedText(value: string) {
  return value.startsWith('enc:v1:');
}

export async function encryptText(key: CryptoKey, value: string) {
  const iv = randomBytes(12);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    textEncoder.encode(value),
  );
  return `enc:v1:${bytesToBase64Url(iv)}:${bytesToBase64Url(
    new Uint8Array(encrypted),
  )}`;
}

export async function decryptText(key: CryptoKey, value: string) {
  const parts = value.split(':');
  if (parts.length !== 4 || parts[0] !== 'enc' || parts[1] !== 'v1') {
    throw new Error('不支持的加密文本格式');
  }
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64UrlToBytes(parts[2]) },
    key,
    base64UrlToBytes(parts[3]),
  );
  return textDecoder.decode(decrypted);
}

export function isEncryptedJson(value: unknown): value is EncryptedJsonPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const payload = value as Partial<EncryptedJsonPayload>;
  return (
    payload.__drawnix_encrypted === 1 &&
    payload.version === 1 &&
    payload.algorithm === 'AES-GCM' &&
    typeof payload.iv === 'string' &&
    typeof payload.ciphertext === 'string'
  );
}

export async function encryptJson(key: CryptoKey, value: unknown) {
  const iv = randomBytes(12);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    textEncoder.encode(JSON.stringify(value)),
  );
  return {
    __drawnix_encrypted: 1,
    version: 1,
    algorithm: 'AES-GCM',
    iv: bytesToBase64Url(iv),
    ciphertext: bytesToBase64Url(new Uint8Array(encrypted)),
  } satisfies EncryptedJsonPayload;
}

export async function decryptJson<T>(
  key: CryptoKey,
  value: EncryptedJsonPayload,
): Promise<T> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64UrlToBytes(value.iv) },
    key,
    base64UrlToBytes(value.ciphertext),
  );
  return JSON.parse(textDecoder.decode(decrypted)) as T;
}
