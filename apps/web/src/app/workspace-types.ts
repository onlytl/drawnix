import type { PlaitElement, PlaitTheme, Viewport } from '@plait/core';

export type AppValue = {
  children: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
};

export type Language = 'zh' | 'en' | 'ru' | 'ar' | 'vi';

export type MainBoardPreference = {
  language: Language;
  copyTransparent: boolean;
  exportTransparent: boolean;
};

export type SyncState = 'pending' | 'syncing' | 'synced' | 'conflict';

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
