import type { PlaitElement, PlaitTheme, Viewport } from '@plait/core';

export type AppValue = {
  children: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
};

export type Language = 'zh' | 'en' | 'ru' | 'ar' | 'vi';

export const CHROME_THEMES = [
  'default',
  'colorful',
  'soft',
  'retro',
  'dark',
  'starry',
] as const;

export type ChromeTheme = (typeof CHROME_THEMES)[number];

export function isChromeTheme(value: unknown): value is ChromeTheme {
  return CHROME_THEMES.includes(value as ChromeTheme);
}

export type MainBoardPreference = {
  language: Language;
  copyTransparent: boolean;
  exportTransparent: boolean;
};

export type SyncState = 'pending' | 'syncing' | 'synced' | 'conflict';

export type EncryptionState =
  | 'signed-out'
  | 'checking'
  | 'setup-required'
  | 'locked'
  | 'unlocked';

export type WorkspaceFolder = {
  id: string;
  parentId: string | null;
  name: string;
  sortOrder: number;
  revision: number;
  syncedRevision: number;
  syncState: SyncState;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  needsEncryption?: boolean;
};

export type WorkspaceDocument = {
  id: string;
  folderId: string | null;
  name: string;
  content: AppValue;
  revision: number;
  syncedRevision: number;
  syncState: SyncState;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  needsEncryption?: boolean;
  remoteConflict?: WorkspaceDocument;
};

export type CloudSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email?: string;
  };
};
