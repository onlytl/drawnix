const DOCUMENT_HASH_PREFIX = '#d=';

function isOAuthHash(hash: string) {
  return hash.includes('access_token=') || hash.includes('error=');
}

export function getDocumentIdFromLocation(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const hash = window.location.hash;
  if (!hash || isOAuthHash(hash)) {
    return null;
  }

  if (!hash.startsWith(DOCUMENT_HASH_PREFIX)) {
    return null;
  }

  try {
    const id = decodeURIComponent(hash.slice(DOCUMENT_HASH_PREFIX.length));
    return id || null;
  } catch {
    return null;
  }
}

export function setDocumentIdInLocation(
  id: string | undefined,
  mode: 'push' | 'replace' = 'replace',
) {
  if (typeof window === 'undefined') {
    return;
  }
  if (isOAuthHash(window.location.hash)) {
    return;
  }

  const nextHash = id ? `${DOCUMENT_HASH_PREFIX}${id}` : '';
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const next = `${window.location.pathname}${window.location.search}${nextHash}`;
  if (current === next) {
    return;
  }

  if (mode === 'push') {
    window.history.pushState({ documentId: id ?? null }, '', next);
  } else {
    window.history.replaceState({ documentId: id ?? null }, '', next);
  }
}
