import type {
  AppValue,
  CloudSession,
  EncryptionState,
  WorkspaceDocument,
  WorkspaceFolder,
} from './workspace-types';
import {
  decryptJson,
  decryptText,
  encryptJson,
  encryptText,
  fingerprintRawMasterKey,
  forgetRememberedMasterKey,
  generateMasterKeyMaterial,
  importMasterKey,
  isEncryptedJson,
  isEncryptedText,
  loadRememberedMasterKey,
  parseRecoveryKey,
  rememberMasterKey,
  unwrapMasterKeyWithPassword,
  wrapMasterKeyWithPassword,
  type PasswordWrappedKey,
} from './workspace-crypto';

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL as string | undefined
)?.replace(/\/$/, '');
const supabasePublishableKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const SESSION_KEY = 'drawnix_supabase_session_v1';
let cloudMasterKey: CryptoKey | null = null;

export const isCloudConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export function isCloudEncryptionUnlocked() {
  return cloudMasterKey !== null;
}

export function lockCloudEncryption() {
  cloudMasterKey = null;
}

type FolderRow = {
  id: string;
  parent_id: string | null;
  name: string;
  sort_order: number;
  revision: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type DocumentRow = {
  id: string;
  folder_id: string | null;
  name: string;
  content: unknown;
  revision: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type CryptoMetadataRow = {
  user_id: string;
  version: number;
  kdf_salt: string;
  kdf_iterations: number;
  wrap_iv: string;
  wrapped_key: string;
  key_fingerprint: string | null;
  created_at: string;
  updated_at: string;
};

function requireConfiguration() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  return { url: supabaseUrl, key: supabasePublishableKey };
}

function requireCloudEncryptionKey() {
  if (!cloudMasterKey) {
    throw new Error('云同步加密密钥尚未解锁');
  }
  return cloudMasterKey;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );
    const json = decodeURIComponent(
      Array.from(atob(padded))
        .map((char) =>
          `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`,
        )
        .join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function sessionFromTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn = 3600,
): CloudSession {
  const payload = decodeJwtPayload(accessToken);
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user: {
      id: typeof payload.sub === 'string' ? payload.sub : '',
      email: typeof payload.email === 'string' ? payload.email : undefined,
    },
  };
}

function saveSession(session: CloudSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function readStoredSession(): CloudSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CloudSession) : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function restoreCloudSession(): Promise<CloudSession | null> {
  if (!isCloudConfigured) return null;

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');
  const expiresIn = Number(hash.get('expires_in') ?? 3600);

  if (accessToken && refreshToken) {
    const session = sessionFromTokens(accessToken, refreshToken, expiresIn);
    saveSession(session);
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`,
    );
    return session;
  }

  const stored = readStoredSession();
  if (!stored) return null;
  if (stored.expiresAt > Date.now() + 60_000) return stored;

  try {
    return await refreshCloudSession(stored.refreshToken);
  } catch {
    saveSession(null);
    return null;
  }
}

export function signInWithGitHub() {
  const { url } = requireConfiguration();
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const authorizeUrl = new URL(`${url}/auth/v1/authorize`);
  authorizeUrl.searchParams.set('provider', 'github');
  authorizeUrl.searchParams.set('redirect_to', redirectTo);
  window.location.assign(authorizeUrl.toString());
}

export async function signOut() {
  const session = readStoredSession();
  if (!session || !isCloudConfigured) {
    saveSession(null);
    lockCloudEncryption();
    return;
  }

  const { url, key } = requireConfiguration();
  try {
    await fetch(`${url}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  } finally {
    saveSession(null);
    lockCloudEncryption();
  }
}

async function refreshCloudSession(
  refreshToken: string,
): Promise<CloudSession> {
  const { url, key } = requireConfiguration();
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Supabase session refresh failed (${response.status})`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  const session = sessionFromTokens(
    data.access_token,
    data.refresh_token,
    data.expires_in,
  );
  saveSession(session);
  return session;
}

async function getValidSession(): Promise<CloudSession> {
  const stored = readStoredSession();
  if (!stored) throw new Error('Not signed in');
  if (stored.expiresAt > Date.now() + 60_000) return stored;
  return refreshCloudSession(stored.refreshToken);
}

async function restRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, key } = requireConfiguration();
  const session = await getValidSession();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Supabase request failed (${response.status}): ${message || response.statusText}`,
    );
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function getCryptoMetadata() {
  const rows = await restRequest<CryptoMetadataRow[]>(
    'user_crypto?select=user_id,version,kdf_salt,kdf_iterations,wrap_iv,wrapped_key,key_fingerprint,created_at,updated_at&limit=1',
  );
  return rows[0] ?? null;
}

function metadataToWrappedKey(row: CryptoMetadataRow): PasswordWrappedKey {
  return {
    salt: row.kdf_salt,
    iterations: row.kdf_iterations,
    iv: row.wrap_iv,
    wrappedKey: row.wrapped_key,
    fingerprint: row.key_fingerprint ?? '',
  };
}

export async function initializeCloudEncryption(
  userId: string,
): Promise<EncryptionState> {
  cloudMasterKey = null;
  const metadata = await getCryptoMetadata();
  if (!metadata) {
    return 'setup-required';
  }

  const remembered = await loadRememberedMasterKey(userId);
  if (!remembered) {
    return 'locked';
  }

  const fingerprint = await fingerprintRawMasterKey(remembered);
  if (!metadata.key_fingerprint || fingerprint !== metadata.key_fingerprint) {
    await forgetRememberedMasterKey(userId);
    return 'locked';
  }

  cloudMasterKey = await importMasterKey(remembered);
  return 'unlocked';
}

export async function setupCloudEncryption(userId: string, password: string) {
  if (password.length < 8) {
    throw new Error('同步密码至少需要 8 个字符');
  }

  const material = await generateMasterKeyMaterial();
  const wrapped = await wrapMasterKeyWithPassword(material.rawKey, password);
  const now = new Date().toISOString();

  await restRequest<CryptoMetadataRow[]>('user_crypto?on_conflict=user_id', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      user_id: userId,
      version: 1,
      kdf_salt: wrapped.salt,
      kdf_iterations: wrapped.iterations,
      wrap_iv: wrapped.iv,
      wrapped_key: wrapped.wrappedKey,
      key_fingerprint: wrapped.fingerprint,
      updated_at: now,
    }),
  });

  cloudMasterKey = material.key;
  await rememberMasterKey(userId, material.rawKey);
  return material.recoveryKey;
}

export async function unlockCloudEncryption(userId: string, password: string) {
  const metadata = await getCryptoMetadata();
  if (!metadata) {
    throw new Error('当前账号还没有设置同步加密');
  }

  let rawKey: Uint8Array;
  try {
    rawKey = await unwrapMasterKeyWithPassword(
      password,
      metadataToWrappedKey(metadata),
    );
  } catch {
    throw new Error('同步密码不正确');
  }

  const fingerprint = await fingerprintRawMasterKey(rawKey);
  if (!metadata.key_fingerprint || fingerprint !== metadata.key_fingerprint) {
    throw new Error('同步密码不正确');
  }

  cloudMasterKey = await importMasterKey(rawKey);
  await rememberMasterKey(userId, rawKey);
}

export async function recoverCloudEncryption(
  userId: string,
  recoveryKey: string,
  newPassword: string,
) {
  if (newPassword.length < 8) {
    throw new Error('新的同步密码至少需要 8 个字符');
  }

  const metadata = await getCryptoMetadata();
  if (!metadata) {
    throw new Error('当前账号还没有设置同步加密');
  }

  const rawKey = parseRecoveryKey(recoveryKey);
  const fingerprint = await fingerprintRawMasterKey(rawKey);
  if (!metadata.key_fingerprint || fingerprint !== metadata.key_fingerprint) {
    throw new Error('恢复密钥不正确');
  }

  const wrapped = await wrapMasterKeyWithPassword(rawKey, newPassword);
  await restRequest<CryptoMetadataRow[]>(
    `user_crypto?user_id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        kdf_salt: wrapped.salt,
        kdf_iterations: wrapped.iterations,
        wrap_iv: wrapped.iv,
        wrapped_key: wrapped.wrappedKey,
        key_fingerprint: wrapped.fingerprint,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  cloudMasterKey = await importMasterKey(rawKey);
  await rememberMasterKey(userId, rawKey);
}

async function mapFolder(row: FolderRow): Promise<WorkspaceFolder> {
  const key = requireCloudEncryptionKey();
  const encryptedName = isEncryptedText(row.name);
  return {
    id: row.id,
    parentId: row.parent_id,
    name: encryptedName ? await decryptText(key, row.name) : row.name,
    sortOrder: row.sort_order,
    revision: row.revision,
    syncedRevision: row.revision,
    syncState: 'synced',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    needsEncryption: !encryptedName,
  };
}

async function mapDocument(row: DocumentRow): Promise<WorkspaceDocument> {
  const key = requireCloudEncryptionKey();
  const encryptedName = isEncryptedText(row.name);
  const encryptedContent = isEncryptedJson(row.content);
  return {
    id: row.id,
    folderId: row.folder_id,
    name: encryptedName ? await decryptText(key, row.name) : row.name,
    content: encryptedContent
      ? await decryptJson<AppValue>(key, row.content)
      : (row.content as AppValue),
    revision: row.revision,
    syncedRevision: row.revision,
    syncState: 'synced',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    needsEncryption: !encryptedName || !encryptedContent,
  };
}

const timeValue = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

async function getFolderRow(id: string) {
  const rows = await restRequest<FolderRow[]>(
    `folders?select=id,parent_id,name,sort_order,revision,created_at,updated_at,deleted_at&id=eq.${encodeURIComponent(id)}`,
  );
  return rows[0];
}

async function getDocumentRow(id: string) {
  const rows = await restRequest<DocumentRow[]>(
    `documents?select=id,folder_id,name,content,revision,created_at,updated_at,deleted_at&id=eq.${encodeURIComponent(id)}`,
  );
  return rows[0];
}

export async function pullWorkspace(): Promise<{
  folders: WorkspaceFolder[];
  documents: WorkspaceDocument[];
}> {
  requireCloudEncryptionKey();
  const [folderRows, documentRows] = await Promise.all([
    restRequest<FolderRow[]>(
      'folders?select=id,parent_id,name,sort_order,revision,created_at,updated_at,deleted_at&order=sort_order.asc,created_at.asc',
    ),
    restRequest<DocumentRow[]>(
      'documents?select=id,folder_id,name,content,revision,created_at,updated_at,deleted_at&order=updated_at.desc',
    ),
  ]);

  const [folders, documents] = await Promise.all([
    Promise.all(folderRows.map(mapFolder)),
    Promise.all(documentRows.map(mapDocument)),
  ]);

  return { folders, documents };
}

export async function syncFolder(
  folder: WorkspaceFolder,
): Promise<
  | { status: 'synced'; revision: number }
  | { status: 'conflict'; remote: WorkspaceFolder }
> {
  const key = requireCloudEncryptionKey();
  const encryptedName = await encryptText(key, folder.name);
  let existing = await getFolderRow(folder.id);

  if (!existing) {
    const inserted = await restRequest<FolderRow[]>('folders?on_conflict=id', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=ignore-duplicates,return=representation',
      },
      body: JSON.stringify({
        id: folder.id,
        parent_id: folder.parentId,
        name: encryptedName,
        sort_order: folder.sortOrder,
        revision: 1,
        created_at: folder.createdAt,
        updated_at: folder.updatedAt,
        deleted_at: folder.deletedAt ?? null,
      }),
    });

    if (inserted.length) {
      return { status: 'synced', revision: inserted[0].revision };
    }

    existing = await getFolderRow(folder.id);
    if (!existing) {
      throw new Error('Folder insert was ignored but remote row is missing');
    }
  }

  const localTime = timeValue(folder.updatedAt);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const remote = await mapFolder(existing);
    const remoteTime = timeValue(remote.updatedAt);

    if (remote.revision > folder.syncedRevision && remoteTime > localTime) {
      return { status: 'conflict', remote };
    }

    const nextRevision = existing.revision + 1;
    const updated = await restRequest<FolderRow[]>(
      `folders?id=eq.${encodeURIComponent(folder.id)}&revision=eq.${existing.revision}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          parent_id: folder.parentId,
          name: encryptedName,
          sort_order: folder.sortOrder,
          revision: nextRevision,
          updated_at: folder.updatedAt,
          deleted_at: folder.deletedAt ?? null,
        }),
      },
    );

    if (updated.length) {
      return { status: 'synced', revision: updated[0].revision };
    }

    const latest = await getFolderRow(folder.id);
    if (!latest) throw new Error('Folder disappeared while syncing');

    const latestRemote = await mapFolder(latest);
    if (timeValue(latestRemote.updatedAt) > localTime) {
      return { status: 'conflict', remote: latestRemote };
    }

    existing = latest;
  }

  const latest = await getFolderRow(folder.id);
  if (!latest) throw new Error('Folder disappeared while syncing');
  return { status: 'conflict', remote: await mapFolder(latest) };
}

export async function syncDocument(
  document: WorkspaceDocument,
): Promise<
  | { status: 'synced'; revision: number }
  | { status: 'conflict'; remote: WorkspaceDocument }
> {
  const key = requireCloudEncryptionKey();
  const [encryptedName, encryptedContent] = await Promise.all([
    encryptText(key, document.name),
    encryptJson(key, document.content),
  ]);
  let existing = await getDocumentRow(document.id);

  if (!existing) {
    const inserted = await restRequest<DocumentRow[]>(
      'documents?on_conflict=id',
      {
        method: 'POST',
        headers: {
          Prefer: 'resolution=ignore-duplicates,return=representation',
        },
        body: JSON.stringify({
          id: document.id,
          folder_id: document.folderId,
          name: encryptedName,
          content: encryptedContent,
          revision: 1,
          created_at: document.createdAt,
          updated_at: document.updatedAt,
          deleted_at: document.deletedAt ?? null,
        }),
      },
    );

    if (inserted.length) {
      return { status: 'synced', revision: inserted[0].revision };
    }

    existing = await getDocumentRow(document.id);
    if (!existing) {
      throw new Error('Document insert was ignored but remote row is missing');
    }
  }

  const localTime = timeValue(document.updatedAt);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const remote = await mapDocument(existing);
    const remoteTime = timeValue(remote.updatedAt);

    if (remote.revision > document.syncedRevision && remoteTime > localTime) {
      return { status: 'conflict', remote };
    }

    const nextRevision = existing.revision + 1;
    const updated = await restRequest<DocumentRow[]>(
      `documents?id=eq.${encodeURIComponent(document.id)}&revision=eq.${existing.revision}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          folder_id: document.folderId,
          name: encryptedName,
          content: encryptedContent,
          revision: nextRevision,
          updated_at: document.updatedAt,
          deleted_at: document.deletedAt ?? null,
        }),
      },
    );

    if (updated.length) {
      return { status: 'synced', revision: updated[0].revision };
    }

    const latest = await getDocumentRow(document.id);
    if (!latest) throw new Error('Document disappeared while syncing');

    const latestRemote = await mapDocument(latest);
    if (timeValue(latestRemote.updatedAt) > localTime) {
      return { status: 'conflict', remote: latestRemote };
    }

    existing = latest;
  }

  const latest = await getDocumentRow(document.id);
  if (!latest) throw new Error('Document disappeared while syncing');
  return { status: 'conflict', remote: await mapDocument(latest) };
}
