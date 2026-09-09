import localforage from 'localforage';
import type {
  AppValue,
  WorkspaceDocument,
  WorkspaceFolder,
} from './workspace-types';

export const MAIN_BOARD_CONTENT_KEY = 'main_board_content';
export const MAIN_BOARD_TOOL_STATE_KEY = 'main_board_tool_state';
export const MAIN_BOARD_PREFERENCE_KEY = 'main_board_preference';

export const WORKSPACE_DOCUMENTS_KEY = 'workspace_documents_v2';
export const WORKSPACE_FOLDERS_KEY = 'workspace_folders_v2';
export const ACTIVE_DOCUMENT_KEY = 'workspace_active_document_v2';

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

type WorkspaceSnapshot = {
  documents: WorkspaceDocument[];
  folders: WorkspaceFolder[];
  activeDocumentId?: string;
};

export const createLocalDocument = (
  folderId: string | null,
  name = '未命名图表',
  content: AppValue = { children: [] },
): WorkspaceDocument => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    folderId,
    name,
    content,
    revision: 0,
    syncedRevision: 0,
    syncState: 'pending',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
};

export const createLocalFolder = (
  parentId: string | null,
  name: string,
): WorkspaceFolder => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    parentId,
    name,
    sortOrder: 0,
    revision: 0,
    syncedRevision: 0,
    syncState: 'pending',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
};

export async function loadWorkspace(): Promise<WorkspaceSnapshot> {
  const [storedDocuments, storedFolders, activeDocumentId, oldBoard] =
    await Promise.all([
      localforage.getItem<WorkspaceDocument[]>(WORKSPACE_DOCUMENTS_KEY),
      localforage.getItem<WorkspaceFolder[]>(WORKSPACE_FOLDERS_KEY),
      localforage.getItem<string>(ACTIVE_DOCUMENT_KEY),
      localforage.getItem<AppValue>(MAIN_BOARD_CONTENT_KEY),
    ]);

  if (storedDocuments?.length) {
    const visibleDocuments = storedDocuments.filter(
      (document) => !document.deletedAt,
    );
    const existingActive =
      activeDocumentId &&
      visibleDocuments.some((document) => document.id === activeDocumentId)
        ? activeDocumentId
        : visibleDocuments[0]?.id;

    return {
      documents: storedDocuments,
      folders: storedFolders ?? [],
      activeDocumentId: existingActive,
    };
  }

  // One-time migration from the original single-board Drawnix storage.
  const migrated = createLocalDocument(
    null,
    oldBoard ? '迁移的图表' : '未命名图表',
    oldBoard ?? { children: [] },
  );

  await Promise.all([
    saveDocuments([migrated]),
    saveFolders([]),
    saveActiveDocumentId(migrated.id),
  ]);

  return {
    documents: [migrated],
    folders: [],
    activeDocumentId: migrated.id,
  };
}

export async function saveDocuments(documents: WorkspaceDocument[]) {
  await localforage.setItem(WORKSPACE_DOCUMENTS_KEY, documents);
}

export async function saveFolders(folders: WorkspaceFolder[]) {
  await localforage.setItem(WORKSPACE_FOLDERS_KEY, folders);
}

export async function saveActiveDocumentId(id: string) {
  await localforage.setItem(ACTIVE_DOCUMENT_KEY, id);
}

export async function clearActiveDocumentId() {
  await localforage.removeItem(ACTIVE_DOCUMENT_KEY);
}
