import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Drawnix,
  DrawnixToolState,
  translate,
  type Translations,
  type TranslationVars,
} from '@drawnix/drawnix';
import localforage from 'localforage';
import styles from './app.module.scss';
import {
  clearActiveDocumentId,
  createLocalDocument,
  createLocalFolder,
  loadWorkspace,
  MAIN_BOARD_PREFERENCE_KEY,
  MAIN_BOARD_TOOL_STATE_KEY,
  saveActiveDocumentId,
  saveDocuments,
  saveFolders,
  uniqueName,
} from './workspace-storage';
import {
  initializeCloudEncryption,
  isCloudConfigured,
  isCloudEncryptionUnlocked,
  lockCloudEncryption,
  pullWorkspace,
  recoverCloudEncryption,
  restoreCloudSession,
  setupCloudEncryption,
  signInWithGitHub,
  signOut,
  syncDocument,
  syncFolder,
  unlockCloudEncryption,
} from './workspace-cloud';
import { listFolderPaths, WorkspaceSidebar } from './workspace-sidebar';
import { WorkspaceDialog, WorkspacePasswordInput } from './workspace-dialog';
import {
  getDocumentIdFromLocation,
  setDocumentIdInLocation,
} from './workspace-location';
import type {
  AppValue,
  ChromeTheme,
  CloudSession,
  EncryptionState,
  MainBoardPreference,
  WorkspaceDocument,
  WorkspaceFolder,
} from './workspace-types';
import { isChromeTheme } from './workspace-types';

const DEFAULT_PREFERENCE: MainBoardPreference = {
  language: 'zh',
  copyTransparent: false,
  exportTransparent: false,
};

const CHROME_THEME_KEY = 'drawnix_chrome_theme';
const NAME_MAX_LENGTH = 80;

type PromptState =
  | {
      kind: 'rename';
      target: 'document' | 'folder';
      id: string;
      value: string;
    }
  | {
      kind: 'create-folder';
      parentId: string | null;
      value: string;
    }
  | {
      kind: 'delete';
      target: 'document' | 'folder';
      id: string;
      name: string;
    }
  | {
      kind: 'folder-not-empty';
      name: string;
    }
  | {
      kind: 'move';
      documentId: string;
      folderId: string | null;
    }
  | {
      kind: 'purge';
      target: 'document' | 'folder';
      id: string;
      name: string;
    }
  | {
      kind: 'empty-trash';
    }
  | null;

type UndoState = {
  target: 'document' | 'folder';
  id: string;
  name: string;
} | null;

const CRYPTO_ERROR_KEYS: Record<string, keyof Translations> = {
  '同步密码至少需要 8 个字符': 'workspace.crypto.passwordTooShort',
  '当前账号还没有设置同步加密': 'workspace.crypto.notSetup',
  '同步密码不正确': 'workspace.crypto.wrongPassword',
  '恢复密钥不正确': 'workspace.crypto.wrongRecovery',
  '新的同步密码至少需要 8 个字符': 'workspace.crypto.newPasswordTooShort',
  '两次输入的同步密码不一致': 'workspace.crypto.passwordMismatch',
  '两次输入的新同步密码不一致': 'workspace.crypto.passwordMismatch',
};

const UNDO_MS = 8000;

function readChromeTheme(): ChromeTheme {
  if (typeof window === 'undefined') {
    return 'default';
  }
  const stored = window.localStorage.getItem(CHROME_THEME_KEY);
  return isChromeTheme(stored) ? stored : 'default';
}

function persistChromeTheme(theme: ChromeTheme) {
  window.localStorage.setItem(CHROME_THEME_KEY, theme);
}

function isBoardValue(value: unknown): value is AppValue {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'children' in value &&
      Array.isArray((value as AppValue).children),
  );
}

export function App() {
  const [documents, setDocuments] = useState<WorkspaceDocument[]>([]);
  const [folders, setFolders] = useState<WorkspaceFolder[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string>();
  const [initialToolState, setInitialToolState] =
    useState<Partial<DrawnixToolState>>();
  const [preference, setPreference] =
    useState<MainBoardPreference>(DEFAULT_PREFERENCE);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<CloudSession | null>(null);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [prompt, setPrompt] = useState<PromptState>(null);
  const [dialogError, setDialogError] = useState('');
  const [encryptionState, setEncryptionState] =
    useState<EncryptionState>('signed-out');
  const [encryptionDeferred, setEncryptionDeferred] = useState(false);
  const [cryptoBusy, setCryptoBusy] = useState(false);
  const [cryptoError, setCryptoError] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [syncPasswordConfirm, setSyncPasswordConfirm] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [recoveryCopied, setRecoveryCopied] = useState(false);
  const [expandFolderId, setExpandFolderId] = useState<string | null>(null);
  const [fallbackTheme, setFallbackTheme] = useState<ChromeTheme>(readChromeTheme);
  const [undo, setUndo] = useState<UndoState>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writingLocationRef = useRef(false);
  const passwordFieldId = useId();
  const passwordConfirmId = useId();
  const recoveryFieldId = useId();
  const promptFieldId = useId();

  const documentsRef = useRef<WorkspaceDocument[]>([]);
  const foldersRef = useRef<WorkspaceFolder[]>([]);
  const activeDocumentIdRef = useRef<string>();
  const sessionRef = useRef<CloudSession | null>(null);
  const syncTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const commitDocuments = useCallback(
    (updater: (current: WorkspaceDocument[]) => WorkspaceDocument[]) => {
      setDocuments((current) => {
        const next = updater(current);
        documentsRef.current = next;
        void saveDocuments(next);
        return next;
      });
    },
    [],
  );

  const commitFolders = useCallback(
    (updater: (current: WorkspaceFolder[]) => WorkspaceFolder[]) => {
      setFolders((current) => {
        const next = updater(current);
        foldersRef.current = next;
        void saveFolders(next);
        return next;
      });
    },
    [],
  );

  const activeDocument = useMemo(
    () =>
      documents.find(
        (document) =>
          document.id === activeDocumentId && !document.deletedAt,
      ),
    [documents, activeDocumentId],
  );

  const updateDocument = useCallback(
    (document: WorkspaceDocument) => {
      commitDocuments((current) =>
        current.map((item) => (item.id === document.id ? document : item)),
      );
    },
    [commitDocuments],
  );

  const updateFolder = useCallback(
    (folder: WorkspaceFolder) => {
      commitFolders((current) =>
        current.map((item) => (item.id === folder.id ? folder : item)),
      );
    },
    [commitFolders],
  );

  const runDocumentSync = useCallback(
    async (documentId: string) => {
      if (
        !sessionRef.current ||
        !isCloudConfigured ||
        !isCloudEncryptionUnlocked()
      ) {
        return;
      }

      const current = documentsRef.current.find(
        (document) => document.id === documentId,
      );
      if (!current || current.syncState === 'conflict') {
        return;
      }

      const syncing = { ...current, syncState: 'syncing' as const };
      updateDocument(syncing);

      try {
        const result = await syncDocument(syncing);
        if (result.status === 'conflict') {
          if (syncing.deletedAt) {
            const retry = {
              ...syncing,
              revision: result.remote.revision,
              syncedRevision: result.remote.revision,
              syncState: 'pending' as const,
            };
            updateDocument(retry);
            const timer = setTimeout(
              () => void runDocumentSync(documentId),
              100,
            );
            syncTimers.current.set(documentId, timer);
            return;
          }

          updateDocument({
            ...syncing,
            syncState: 'conflict',
            remoteConflict: result.remote,
          });
          return;
        }

        const latest = documentsRef.current.find(
          (document) => document.id === documentId,
        );
        if (!latest) {
          return;
        }

        if (latest.updatedAt !== syncing.updatedAt) {
          updateDocument({
            ...latest,
            syncedRevision: result.revision,
            revision: result.revision,
            syncState: 'pending',
            needsEncryption: false,
          });
          const timer = setTimeout(() => void runDocumentSync(documentId), 300);
          syncTimers.current.set(documentId, timer);
          return;
        }

        updateDocument({
          ...latest,
          revision: result.revision,
          syncedRevision: result.revision,
          syncState: 'synced',
          needsEncryption: false,
          remoteConflict: undefined,
        });
      } catch (error) {
        console.error('Drawnix document sync failed', error);
        const latest = documentsRef.current.find(
          (document) => document.id === documentId,
        );
        if (latest && latest.syncState !== 'conflict') {
          updateDocument({ ...latest, syncState: 'pending' });
        }
      }
    },
    [updateDocument],
  );

  const scheduleDocumentSync = useCallback(
    (documentId: string, delay = 1200) => {
      if (
        !sessionRef.current ||
        !isCloudConfigured ||
        !isCloudEncryptionUnlocked()
      ) {
        return;
      }

      const existingTimer = syncTimers.current.get(documentId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => void runDocumentSync(documentId), delay);
      syncTimers.current.set(documentId, timer);
    },
    [runDocumentSync],
  );

  const runFolderSync = useCallback(
    async (folderId: string) => {
      if (
        !sessionRef.current ||
        !isCloudConfigured ||
        !isCloudEncryptionUnlocked()
      ) {
        return;
      }

      const current = foldersRef.current.find((folder) => folder.id === folderId);
      if (!current || current.syncState === 'conflict') {
        return;
      }

      const syncing = { ...current, syncState: 'syncing' as const };
      updateFolder(syncing);

      try {
        const result = await syncFolder(syncing);
        if (result.status === 'conflict') {
          if (syncing.updatedAt >= result.remote.updatedAt) {
            const retry = {
              ...syncing,
              syncedRevision: result.remote.revision,
              revision: result.remote.revision,
              syncState: 'pending' as const,
            };
            updateFolder(retry);
            setTimeout(() => void runFolderSync(folderId), 100);
          } else {
            updateFolder(result.remote);
          }
          return;
        }

        const latest = foldersRef.current.find((folder) => folder.id === folderId);
        if (!latest) {
          return;
        }

        updateFolder({
          ...latest,
          revision: result.revision,
          syncedRevision: result.revision,
          syncState:
            latest.updatedAt === syncing.updatedAt ? 'synced' : 'pending',
          needsEncryption: false,
        });

        if (latest.updatedAt !== syncing.updatedAt) {
          setTimeout(() => void runFolderSync(folderId), 100);
        }
      } catch (error) {
        console.error('Drawnix folder sync failed', error);
        const latest = foldersRef.current.find((folder) => folder.id === folderId);
        if (latest) {
          updateFolder({ ...latest, syncState: 'pending' });
        }
      }
    },
    [updateFolder],
  );

  const folderDepth = useCallback((folder: WorkspaceFolder) => {
    let depth = 0;
    let parentId = folder.parentId;
    const visited = new Set<string>();
    while (parentId && !visited.has(parentId)) {
      visited.add(parentId);
      const parent = foldersRef.current.find((item) => item.id === parentId);
      if (!parent) {
        break;
      }
      depth += 1;
      parentId = parent.parentId;
    }
    return depth;
  }, []);

  const syncPendingWorkspace = useCallback(async () => {
    if (!sessionRef.current || !isCloudEncryptionUnlocked()) {
      return;
    }

    const pendingFolders = foldersRef.current
      .filter((folder) => folder.syncState === 'pending')
      .sort((a, b) => folderDepth(a) - folderDepth(b));

    for (const folder of pendingFolders) {
      await runFolderSync(folder.id);
    }

    const pendingDocuments = documentsRef.current.filter(
      (document) => document.syncState === 'pending',
    );
    for (const document of pendingDocuments) {
      await runDocumentSync(document.id);
    }
  }, [folderDepth, runDocumentSync, runFolderSync]);

  const reconcileWithCloud = useCallback(async () => {
    if (
      !sessionRef.current ||
      !isCloudConfigured ||
      !isCloudEncryptionUnlocked()
    ) {
      return;
    }

    setCloudBusy(true);
    try {
      const remote = await pullWorkspace();
      const foldersNeedingEncryption = new Set(
        remote.folders
          .filter((folder) => folder.needsEncryption)
          .map((folder) => folder.id),
      );
      const documentsNeedingEncryption = new Set(
        remote.documents
          .filter((document) => document.needsEncryption)
          .map((document) => document.id),
      );

      const localFolderMap = new Map<string, WorkspaceFolder>(
        foldersRef.current.map((folder) => [folder.id, folder]),
      );
      const mergedFolders = new Map<string, WorkspaceFolder>();

      for (const remoteFolder of remote.folders) {
        const local = localFolderMap.get(remoteFolder.id);
        if (!local) {
          mergedFolders.set(remoteFolder.id, remoteFolder);
          continue;
        }

        if (local.syncState === 'pending') {
          if (remoteFolder.revision > local.syncedRevision) {
            mergedFolders.set(
              local.id,
              local.updatedAt >= remoteFolder.updatedAt ? local : remoteFolder,
            );
          } else {
            mergedFolders.set(local.id, local);
          }
        } else {
          mergedFolders.set(
            local.id,
            remoteFolder.revision > local.syncedRevision ? remoteFolder : local,
          );
        }
        localFolderMap.delete(remoteFolder.id);
      }

      for (const local of localFolderMap.values()) {
        mergedFolders.set(local.id, local);
      }

      const localDocumentMap = new Map<string, WorkspaceDocument>(
        documentsRef.current.map((document) => [document.id, document]),
      );
      const mergedDocuments = new Map<string, WorkspaceDocument>();

      for (const remoteDocument of remote.documents) {
        const local = localDocumentMap.get(remoteDocument.id);
        if (!local) {
          mergedDocuments.set(remoteDocument.id, remoteDocument);
          continue;
        }

        if (
          local.syncState === 'pending' &&
          remoteDocument.revision > local.syncedRevision
        ) {
          mergedDocuments.set(local.id, {
            ...local,
            syncState: 'conflict',
            remoteConflict: remoteDocument,
          });
        } else if (
          local.syncState !== 'pending' &&
          remoteDocument.revision > local.syncedRevision
        ) {
          mergedDocuments.set(remoteDocument.id, remoteDocument);
        } else {
          mergedDocuments.set(local.id, local);
        }

        localDocumentMap.delete(remoteDocument.id);
      }

      for (const local of localDocumentMap.values()) {
        mergedDocuments.set(local.id, local);
      }

      const nextFolders = [...mergedFolders.values()].map((folder) =>
        foldersNeedingEncryption.has(folder.id)
          ? { ...folder, syncState: 'pending' as const, needsEncryption: true }
          : folder,
      );
      const nextDocuments = [...mergedDocuments.values()].map((document) =>
        documentsNeedingEncryption.has(document.id)
          ? { ...document, syncState: 'pending' as const, needsEncryption: true }
          : document,
      );

      foldersRef.current = nextFolders;
      documentsRef.current = nextDocuments;
      setFolders(nextFolders);
      setDocuments(nextDocuments);
      await Promise.all([
        saveFolders(nextFolders),
        saveDocuments(nextDocuments),
      ]);

      const activeStillVisible = nextDocuments.some(
        (document) =>
          document.id === activeDocumentIdRef.current && !document.deletedAt,
      );
      if (!activeStillVisible) {
        const nextId = nextDocuments.find((document) => !document.deletedAt)?.id;
        activeDocumentIdRef.current = nextId;
        setActiveDocumentId(nextId);
        if (nextId) {
          await saveActiveDocumentId(nextId);
        } else {
          await clearActiveDocumentId();
        }
        writingLocationRef.current = true;
        setDocumentIdInLocation(nextId, 'replace');
        writingLocationRef.current = false;
      }

      await syncPendingWorkspace();
    } catch (error) {
      console.error('Drawnix cloud reconciliation failed', error);
    } finally {
      setCloudBusy(false);
    }
  }, [syncPendingWorkspace]);

  useEffect(() => {
    const load = async () => {
      const [workspace, storedToolState, storedPreference, cloudSession] =
        await Promise.all([
          loadWorkspace(),
          localforage.getItem(MAIN_BOARD_TOOL_STATE_KEY),
          localforage.getItem(MAIN_BOARD_PREFERENCE_KEY),
          restoreCloudSession(),
        ]);

      documentsRef.current = workspace.documents;
      foldersRef.current = workspace.folders;
      sessionRef.current = cloudSession;

      setDocuments(workspace.documents);
      setFolders(workspace.folders);
      setSession(cloudSession);

      if (storedToolState) {
        setInitialToolState(storedToolState as Partial<DrawnixToolState>);
      }
      if (storedPreference) {
        setPreference(storedPreference as MainBoardPreference);
      }

      const visibleIds = new Set(
        workspace.documents
          .filter((document) => !document.deletedAt)
          .map((document) => document.id),
      );
      const urlId = getDocumentIdFromLocation();
      const nextId =
        (urlId && visibleIds.has(urlId) ? urlId : undefined) ??
        (workspace.activeDocumentId && visibleIds.has(workspace.activeDocumentId)
          ? workspace.activeDocumentId
          : [...visibleIds][0]);

      activeDocumentIdRef.current = nextId;
      setActiveDocumentId(nextId);
      if (nextId) {
        await saveActiveDocumentId(nextId);
      } else {
        await clearActiveDocumentId();
      }
      writingLocationRef.current = true;
      setDocumentIdInLocation(nextId, 'replace');
      writingLocationRef.current = false;

      setLoaded(true);
    };

    void load();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (!session) {
      lockCloudEncryption();
      setEncryptionState('signed-out');
      return;
    }

    let cancelled = false;
    setEncryptionState('checking');
    setCryptoError('');
    void initializeCloudEncryption(session.user.id)
      .then((state) => {
        if (!cancelled) {
          setEncryptionState(state);
        }
      })
      .catch((error) => {
        console.error('Drawnix encryption initialization failed', error);
        if (!cancelled) {
          setEncryptionState('locked');
          setCryptoError(translate(preference.language, 'workspace.crypto.initFailed'));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loaded, session]);

  useEffect(() => {
    if (loaded && session && encryptionState === 'unlocked') {
      void reconcileWithCloud();
    }
  }, [loaded, session, encryptionState, reconcileWithCloud]);

  useEffect(() => {
    const onOnline = () => {
      if (sessionRef.current && isCloudEncryptionUnlocked()) {
        void reconcileWithCloud();
      }
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [reconcileWithCloud]);

  useEffect(() => {
    return () => {
      syncTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const updatePreference = (
    partialPreference: Partial<MainBoardPreference>,
  ) => {
    setPreference((currentPreference) => {
      const nextPreference = {
        ...currentPreference,
        ...partialPreference,
      };
      void localforage.setItem(MAIN_BOARD_PREFERENCE_KEY, nextPreference);
      return nextPreference;
    });
  };

  const t = useCallback(
    (key: keyof Translations, vars?: TranslationVars) =>
      translate(preference.language, key, vars),
    [preference.language],
  );

  const cryptoMessage = (error: unknown, fallback: keyof Translations) => {
    const raw = error instanceof Error ? error.message : '';
    const mapped = raw ? CRYPTO_ERROR_KEYS[raw] : undefined;
    return mapped ? t(mapped) : raw || t(fallback);
  };

  const writeLocation = (id: string | undefined, mode: 'push' | 'replace') => {
    writingLocationRef.current = true;
    setDocumentIdInLocation(id, mode);
    queueMicrotask(() => {
      writingLocationRef.current = false;
    });
  };

  const clearUndo = () => {
    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
      undoTimer.current = null;
    }
    setUndo(null);
  };

  const showUndo = (next: UndoState) => {
    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
    }
    setUndo(next);
    undoTimer.current = setTimeout(() => {
      setUndo(null);
      undoTimer.current = null;
    }, UNDO_MS);
  };

  const selectDocument = async (
    id: string,
    options?: { history?: 'push' | 'replace' | 'none' },
  ) => {
    activeDocumentIdRef.current = id;
    setActiveDocumentId(id);
    await saveActiveDocumentId(id);
    if (options?.history !== 'none') {
      writeLocation(id, options?.history ?? 'push');
    }
  };

  const createDocument = (folderId: string | null = null) => {
    const name = uniqueName(
      t('workspace.untitledDiagram'),
      documentsRef.current
        .filter((item) => !item.deletedAt)
        .map((item) => item.name),
    );
    const document = createLocalDocument(folderId, name);
    commitDocuments((current) => [...current, document]);
    activeDocumentIdRef.current = document.id;
    setActiveDocumentId(document.id);
    if (folderId) {
      setExpandFolderId(folderId);
    }
    void saveActiveDocumentId(document.id);
    writeLocation(document.id, 'push');
    scheduleDocumentSync(document.id, 50);
  };

  const openPrompt = (next: PromptState) => {
    setDialogError('');
    setPrompt(next);
  };

  const createFolder = (parentId: string | null = null) => {
    openPrompt({
      kind: 'create-folder',
      parentId,
      value: uniqueName(
        t('workspace.defaultFolderName'),
        foldersRef.current
          .filter((item) => !item.deletedAt)
          .map((item) => item.name),
      ),
    });
  };

  const renameDocument = (document: WorkspaceDocument) => {
    openPrompt({
      kind: 'rename',
      target: 'document',
      id: document.id,
      value: document.name,
    });
  };

  const renameFolder = (folder: WorkspaceFolder) => {
    openPrompt({
      kind: 'rename',
      target: 'folder',
      id: folder.id,
      value: folder.name,
    });
  };

  const performDeleteDocument = async (document: WorkspaceDocument) => {
    const now = new Date().toISOString();
    updateDocument({
      ...document,
      deletedAt: now,
      updatedAt: now,
      syncState: 'pending',
    });
    scheduleDocumentSync(document.id, 50);
    showUndo({ target: 'document', id: document.id, name: document.name });

    if (activeDocumentIdRef.current === document.id) {
      const nextId = documentsRef.current.find(
        (item) => item.id !== document.id && !item.deletedAt,
      )?.id;
      activeDocumentIdRef.current = nextId;
      setActiveDocumentId(nextId);
      if (nextId) {
        await saveActiveDocumentId(nextId);
      } else {
        await clearActiveDocumentId();
      }
      writeLocation(nextId, 'replace');
    }
  };

  const performDeleteFolder = (folder: WorkspaceFolder) => {
    const now = new Date().toISOString();
    updateFolder({
      ...folder,
      deletedAt: now,
      updatedAt: now,
      syncState: 'pending',
    });
    showUndo({ target: 'folder', id: folder.id, name: folder.name });
    if (sessionRef.current && isCloudEncryptionUnlocked()) {
      setTimeout(() => void runFolderSync(folder.id), 50);
    }
  };

  const restoreDocument = (document: WorkspaceDocument) => {
    const parent = foldersRef.current.find((item) => item.id === document.folderId);
    const folderId =
      document.folderId && parent && !parent.deletedAt ? document.folderId : null;
    updateDocument({
      ...document,
      folderId,
      deletedAt: null,
      updatedAt: new Date().toISOString(),
      syncState: 'pending',
    });
    scheduleDocumentSync(document.id, 50);
    if (folderId) {
      setExpandFolderId(folderId);
    }
    void selectDocument(document.id, { history: 'push' });
    if (undo?.id === document.id) {
      clearUndo();
    }
  };

  const restoreFolder = (folder: WorkspaceFolder) => {
    updateFolder({
      ...folder,
      deletedAt: null,
      updatedAt: new Date().toISOString(),
      syncState: 'pending',
    });
    if (sessionRef.current && isCloudEncryptionUnlocked()) {
      setTimeout(() => void runFolderSync(folder.id), 50);
    }
    if (undo?.id === folder.id) {
      clearUndo();
    }
  };

  const undoDelete = async () => {
    if (!undo) {
      return;
    }
    if (undo.target === 'document') {
      const current = documentsRef.current.find((item) => item.id === undo.id);
      if (current) {
        restoreDocument(current);
      }
    } else {
      const current = foldersRef.current.find((item) => item.id === undo.id);
      if (current) {
        restoreFolder(current);
      }
    }
    clearUndo();
  };

  const purgeDocument = async (document: WorkspaceDocument) => {
    if (
      sessionRef.current &&
      isCloudEncryptionUnlocked() &&
      document.syncState !== 'synced'
    ) {
      await runDocumentSync(document.id);
    }
    commitDocuments((current) => current.filter((item) => item.id !== document.id));
    if (undo?.id === document.id) {
      clearUndo();
    }
  };

  const purgeFolder = async (folder: WorkspaceFolder) => {
    if (
      sessionRef.current &&
      isCloudEncryptionUnlocked() &&
      folder.syncState !== 'synced'
    ) {
      await runFolderSync(folder.id);
    }
    commitFolders((current) => current.filter((item) => item.id !== folder.id));
    if (undo?.id === folder.id) {
      clearUndo();
    }
  };

  const emptyTrash = async () => {
    const deletedDocuments = documentsRef.current.filter((item) => item.deletedAt);
    const deletedFolders = foldersRef.current.filter((item) => item.deletedAt);
    for (const document of deletedDocuments) {
      await purgeDocument(document);
    }
    for (const folder of deletedFolders) {
      await purgeFolder(folder);
    }
    clearUndo();
  };

  const deleteDocument = (document: WorkspaceDocument) => {
    openPrompt({
      kind: 'delete',
      target: 'document',
      id: document.id,
      name: document.name,
    });
  };

  const deleteFolder = (folder: WorkspaceFolder) => {
    const hasChildren =
      foldersRef.current.some(
        (item) => item.parentId === folder.id && !item.deletedAt,
      ) ||
      documentsRef.current.some(
        (item) => item.folderId === folder.id && !item.deletedAt,
      );

    if (hasChildren) {
      openPrompt({
        kind: 'folder-not-empty',
        name: folder.name,
      });
      return;
    }

    openPrompt({
      kind: 'delete',
      target: 'folder',
      id: folder.id,
      name: folder.name,
    });
  };

  const openMoveDialog = (document: WorkspaceDocument) => {
    openPrompt({
      kind: 'move',
      documentId: document.id,
      folderId: document.folderId,
    });
  };

  const confirmMove = (documentId: string, folderId: string | null) => {
    const document = documentsRef.current.find((item) => item.id === documentId);
    if (!document || document.folderId === folderId) {
      return;
    }

    const next = {
      ...document,
      folderId,
      updatedAt: new Date().toISOString(),
      syncState: 'pending' as const,
    };
    updateDocument(next);
    scheduleDocumentSync(document.id, 50);
  };

  const closePrompt = () => {
    setPrompt(null);
    setDialogError('');
  };

  const submitPrompt = () => {
    if (!prompt) {
      return;
    }

    if (prompt.kind === 'rename') {
      const name = prompt.value.trim();
      if (!name) {
        setDialogError(t('workspace.nameRequired'));
        return;
      }
      if (prompt.target === 'document') {
        const current = documentsRef.current.find((item) => item.id === prompt.id);
        if (!current || name === current.name) {
          closePrompt();
          return;
        }
        updateDocument({
          ...current,
          name,
          updatedAt: new Date().toISOString(),
          syncState: 'pending',
        });
        scheduleDocumentSync(current.id);
      } else {
        const current = foldersRef.current.find((item) => item.id === prompt.id);
        if (!current || name === current.name) {
          closePrompt();
          return;
        }
        updateFolder({
          ...current,
          name,
          updatedAt: new Date().toISOString(),
          syncState: 'pending',
        });
        if (sessionRef.current && isCloudEncryptionUnlocked()) {
          setTimeout(() => void runFolderSync(current.id), 50);
        }
      }
      closePrompt();
      return;
    }

    if (prompt.kind === 'create-folder') {
      const name = prompt.value.trim();
      if (!name) {
        setDialogError(t('workspace.nameRequired'));
        return;
      }
      const folder = createLocalFolder(prompt.parentId, name);
      commitFolders((current) => [...current, folder]);
      setExpandFolderId(prompt.parentId ?? folder.id);
      if (sessionRef.current && isCloudEncryptionUnlocked()) {
        setTimeout(() => void runFolderSync(folder.id), 50);
      }
      closePrompt();
      return;
    }

    if (prompt.kind === 'delete') {
      if (prompt.target === 'document') {
        const current = documentsRef.current.find((item) => item.id === prompt.id);
        if (current) {
          void performDeleteDocument(current);
        }
      } else {
        const current = foldersRef.current.find((item) => item.id === prompt.id);
        if (current) {
          performDeleteFolder(current);
        }
      }
      closePrompt();
      return;
    }

    if (prompt.kind === 'move') {
      confirmMove(prompt.documentId, prompt.folderId);
      closePrompt();
      return;
    }

    if (prompt.kind === 'purge') {
      if (prompt.target === 'document') {
        const current = documentsRef.current.find((item) => item.id === prompt.id);
        if (current) {
          void purgeDocument(current);
        }
      } else {
        const current = foldersRef.current.find((item) => item.id === prompt.id);
        if (current) {
          void purgeFolder(current);
        }
      }
      closePrompt();
      return;
    }

    if (prompt.kind === 'empty-trash') {
      void emptyTrash();
      closePrompt();
      return;
    }

    closePrompt();
  };

  const resolveConflict = (
    document: WorkspaceDocument,
    action: 'local' | 'remote' | 'copy',
  ) => {
    const remote = document.remoteConflict;
    if (!remote) {
      return;
    }

    if (action === 'remote') {
      updateDocument({
        ...remote,
        syncState: 'synced',
        remoteConflict: undefined,
      });
      return;
    }

    if (action === 'copy') {
      const copy = createLocalDocument(
        document.folderId,
        `${document.name}${t('workspace.localCopySuffix')}`,
        document.content,
      );
      const resolvedRemote = {
        ...remote,
        syncState: 'synced' as const,
        remoteConflict: undefined,
      };
      commitDocuments((current) =>
        current
          .map((item) =>
            item.id === document.id ? resolvedRemote : item,
          )
          .concat(copy),
      );
      activeDocumentIdRef.current = copy.id;
      setActiveDocumentId(copy.id);
      void saveActiveDocumentId(copy.id);
      scheduleDocumentSync(copy.id, 50);
      return;
    }

    const forceLocal = {
      ...document,
      revision: remote.revision,
      syncedRevision: remote.revision,
      syncState: 'pending' as const,
      remoteConflict: undefined,
      updatedAt: new Date().toISOString(),
    };
    updateDocument(forceLocal);
    scheduleDocumentSync(forceLocal.id, 50);
  };

  const handleSetupEncryption = async () => {
    if (!session) return;
    setCryptoError('');
    if (syncPassword !== syncPasswordConfirm) {
      setCryptoError(t('workspace.crypto.passwordMismatch'));
      return;
    }

    setCryptoBusy(true);
    try {
      const key = await setupCloudEncryption(session.user.id, syncPassword);
      setRecoveryKey(key);
      setRecoveryCopied(false);
      setSyncPassword('');
      setSyncPasswordConfirm('');
      setEncryptionState('unlocked');
    } catch (error) {
      setCryptoError(cryptoMessage(error, 'workspace.crypto.setupFailed'));
    } finally {
      setCryptoBusy(false);
    }
  };

  const handleUnlockEncryption = async () => {
    if (!session) return;
    setCryptoError('');
    setCryptoBusy(true);
    try {
      await unlockCloudEncryption(session.user.id, syncPassword);
      setSyncPassword('');
      setEncryptionState('unlocked');
    } catch (error) {
      setCryptoError(cryptoMessage(error, 'workspace.crypto.unlockFailed'));
    } finally {
      setCryptoBusy(false);
    }
  };

  const handleRecoverEncryption = async () => {
    if (!session) return;
    setCryptoError('');
    if (syncPassword !== syncPasswordConfirm) {
      setCryptoError(t('workspace.crypto.passwordMismatch'));
      return;
    }

    setCryptoBusy(true);
    try {
      await recoverCloudEncryption(
        session.user.id,
        recoveryInput,
        syncPassword,
      );
      setRecoveryInput('');
      setSyncPassword('');
      setSyncPasswordConfirm('');
      setRecoveryMode(false);
      setEncryptionState('unlocked');
    } catch (error) {
      setCryptoError(cryptoMessage(error, 'workspace.crypto.recoverFailed'));
    } finally {
      setCryptoBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    sessionRef.current = null;
    setSession(null);
    setEncryptionState('signed-out');
    setEncryptionDeferred(false);
    setRecoveryKey(null);
    setRecoveryCopied(false);
    setCryptoError('');
  };

  const deferEncryption = () => {
    if (recoveryKey) {
      return;
    }
    setEncryptionDeferred(true);
    setCryptoError('');
    setSyncPassword('');
    setSyncPasswordConfirm('');
    setRecoveryMode(false);
  };

  const copyRecoveryKey = async () => {
    if (!recoveryKey) {
      return;
    }
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setRecoveryCopied(true);
    } catch {
      setCryptoError(t('workspace.crypto.copyFailed'));
    }
  };

  useEffect(() => {
    const mode = activeDocument?.content.theme?.themeColorMode;
    if (isChromeTheme(mode)) {
      setFallbackTheme(mode);
      persistChromeTheme(mode);
    }
  }, [activeDocument?.content.theme?.themeColorMode, activeDocument?.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'F2' || event.repeat) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      ) {
        return;
      }
      if (prompt) {
        return;
      }
      const current = documentsRef.current.find(
        (item) => item.id === activeDocumentIdRef.current && !item.deletedAt,
      );
      if (!current) {
        return;
      }
      event.preventDefault();
      setDialogError('');
      setPrompt({
        kind: 'rename',
        target: 'document',
        id: current.id,
        value: current.name,
      });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prompt]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const applyFromLocation = () => {
      if (writingLocationRef.current) {
        return;
      }
      const id = getDocumentIdFromLocation();
      if (!id || id === activeDocumentIdRef.current) {
        return;
      }
      const exists = documentsRef.current.some(
        (document) => document.id === id && !document.deletedAt,
      );
      if (!exists) {
        return;
      }
      activeDocumentIdRef.current = id;
      setActiveDocumentId(id);
      void saveActiveDocumentId(id);
    };

    window.addEventListener('hashchange', applyFromLocation);
    window.addEventListener('popstate', applyFromLocation);
    return () => {
      window.removeEventListener('hashchange', applyFromLocation);
      window.removeEventListener('popstate', applyFromLocation);
    };
  }, [loaded]);

  if (!loaded) {
    return (
      <div className={`${styles.workspace} ${styles[`theme_${readChromeTheme()}`]}`}>
        <div className={styles.bootScreen}>Drawnix</div>
      </div>
    );
  }

  const folderOptions = listFolderPaths(folders);
  const showEncryptionDialog = Boolean(
    session &&
      !encryptionDeferred &&
      (recoveryKey ||
        encryptionState === 'setup-required' ||
        encryptionState === 'locked'),
  );
  const documentTheme = activeDocument?.content.theme?.themeColorMode;
  const chromeTheme = isChromeTheme(documentTheme)
    ? documentTheme
    : fallbackTheme;

  const encryptionTitle = recoveryKey
    ? t('workspace.crypto.saveRecoveryTitle')
    : encryptionState === 'setup-required'
      ? t('workspace.crypto.setupTitle')
      : recoveryMode
        ? t('workspace.crypto.recoverTitle')
        : t('workspace.crypto.unlockTitle');

  const encryptionDescription = recoveryKey
    ? t('workspace.crypto.saveRecoveryDescription')
    : encryptionState === 'setup-required'
      ? t('workspace.crypto.setupDescription')
      : recoveryMode
        ? t('workspace.crypto.recoverDescription')
        : t('workspace.crypto.unlockDescription');

  const promptTitle =
    prompt?.kind === 'rename'
      ? prompt.target === 'document'
        ? t('workspace.renameDiagram')
        : t('workspace.renameFolder')
      : prompt?.kind === 'create-folder'
        ? t('workspace.createFolderTitle')
        : prompt?.kind === 'delete'
          ? prompt.target === 'document'
            ? t('workspace.deleteDiagram')
            : t('workspace.deleteFolder')
          : prompt?.kind === 'folder-not-empty'
            ? t('workspace.folderNotEmptyTitle')
            : prompt?.kind === 'move'
              ? t('workspace.moveDiagram')
              : prompt?.kind === 'purge'
                ? t('workspace.purgeTitle')
                : prompt?.kind === 'empty-trash'
                  ? t('workspace.emptyTrashTitle')
                  : '';

  return (
    <div className={`${styles.workspace} ${styles[`theme_${chromeTheme}`]}`}>
      <a className={styles.skipLink} href="#workspace-canvas">
        {t('workspace.skipToCanvas')}
      </a>
      <WorkspaceSidebar
        folders={folders}
        documents={documents}
        activeDocumentId={activeDocumentId}
        session={session}
        cloudConfigured={isCloudConfigured}
        cloudBusy={cloudBusy}
        encryptionState={encryptionState}
        expandFolderId={expandFolderId}
        t={t}
        onSelectDocument={selectDocument}
        onCreateDocument={createDocument}
        onCreateFolder={createFolder}
        onRenameDocument={renameDocument}
        onRenameFolder={renameFolder}
        onMoveDocument={openMoveDialog}
        onDeleteDocument={deleteDocument}
        onDeleteFolder={deleteFolder}
        onRestoreDocument={restoreDocument}
        onRestoreFolder={restoreFolder}
        onPurgeDocument={(document) =>
          openPrompt({
            kind: 'purge',
            target: 'document',
            id: document.id,
            name: document.name,
          })
        }
        onPurgeFolder={(folder) =>
          openPrompt({
            kind: 'purge',
            target: 'folder',
            id: folder.id,
            name: folder.name,
          })
        }
        onEmptyTrash={() => openPrompt({ kind: 'empty-trash' })}
        onSignIn={signInWithGitHub}
        onSignOut={handleSignOut}
        onUnlock={() => setEncryptionDeferred(false)}
      />

      <main id="workspace-canvas" className={styles.canvas}>
        {activeDocument ? (
          <>
            {activeDocument.syncState === 'conflict' && (
              <div className={styles.conflictBanner}>
                <strong>{t('workspace.conflictTitle')}</strong>
                <span>{t('workspace.conflictDescription')}</span>
                <button
                  type="button"
                  onClick={() => resolveConflict(activeDocument, 'remote')}
                >
                  {t('workspace.conflictUseCloud')}
                </button>
                <button
                  type="button"
                  onClick={() => resolveConflict(activeDocument, 'local')}
                >
                  {t('workspace.conflictUseLocal')}
                </button>
                <button
                  type="button"
                  onClick={() => resolveConflict(activeDocument, 'copy')}
                >
                  {t('workspace.conflictKeepCopy')}
                </button>
              </div>
            )}

            <Drawnix
              key={activeDocument.id}
              value={activeDocument.content.children}
              viewport={activeDocument.content.viewport}
              theme={activeDocument.content.theme}
              initialToolState={initialToolState}
              initialLanguage={preference.language}
              initialPreference={{
                copyTransparent: preference.copyTransparent,
                exportTransparent: preference.exportTransparent,
              }}
              onLanguageChange={(language) => {
                updatePreference({ language });
              }}
              onPreferenceChange={({
                copyTransparent,
                exportTransparent,
              }) => {
                updatePreference({
                  copyTransparent,
                  exportTransparent,
                });
              }}
              onChange={(value) => {
                const current = documentsRef.current.find(
                  (document) => document.id === activeDocument.id,
                );
                if (!current || !isBoardValue(value)) {
                  return;
                }

                const next: WorkspaceDocument = {
                  ...current,
                  content: {
                    children: value.children,
                    viewport: value.viewport,
                    theme: value.theme,
                  },
                  updatedAt: new Date().toISOString(),
                  syncState: 'pending',
                };
                updateDocument(next);
                scheduleDocumentSync(next.id);
              }}
              onThemeChange={(themeColorMode) => {
                if (isChromeTheme(themeColorMode)) {
                  setFallbackTheme(themeColorMode);
                  persistChromeTheme(themeColorMode);
                }
              }}
              onToolStateChange={(toolState) => {
                void localforage.setItem(MAIN_BOARD_TOOL_STATE_KEY, toolState);
              }}
              tutorial={false}
              afterInit={(_board) => {
                console.log('board initialized');
              }}
            />
          </>
        ) : (
          <div className={styles.emptyState}>
            <div>
              <h2>{t('workspace.emptyTitle')}</h2>
              <p>{t('workspace.emptyDescription')}</p>
              <button type="button" onClick={() => createDocument(null)}>
                {t('workspace.newDiagram')}
              </button>
            </div>
          </div>
        )}

        {undo ? (
          <div className={styles.undoToast} role="status">
            <span>{t('workspace.undoDelete', { name: undo.name })}</span>
            <button type="button" onClick={() => void undoDelete()}>
              {t('workspace.undo')}
            </button>
          </div>
        ) : null}
      </main>

      <WorkspaceDialog
        open={prompt !== null}
        title={promptTitle}
        description={
          prompt?.kind === 'delete'
            ? t('workspace.deleteHint', { name: prompt.name })
            : prompt?.kind === 'folder-not-empty'
              ? t('workspace.folderNotEmptyHint', { name: prompt.name })
              : prompt?.kind === 'move'
                ? t('workspace.moveHint')
                : prompt?.kind === 'create-folder'
                  ? t('workspace.createFolderHint')
                  : prompt?.kind === 'rename'
                    ? t('workspace.renameHint')
                    : prompt?.kind === 'purge'
                      ? t('workspace.purgeDescription', { name: prompt.name })
                      : prompt?.kind === 'empty-trash'
                        ? t('workspace.emptyTrashDescription')
                        : undefined
        }
        onClose={closePrompt}
      >
        {prompt?.kind === 'rename' || prompt?.kind === 'create-folder' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt();
            }}
          >
            <label htmlFor={promptFieldId}>
              {prompt.kind === 'create-folder'
                ? t('workspace.folderNameLabel')
                : t('workspace.nameLabel')}
              <input
                id={promptFieldId}
                value={prompt.value}
                maxLength={NAME_MAX_LENGTH}
                autoComplete="off"
                onChange={(event) =>
                  setPrompt({ ...prompt, value: event.target.value })
                }
              />
            </label>
            {dialogError ? <div className={styles.fieldError}>{dialogError}</div> : null}
            <div className={styles.modalActions}>
              <button type="button" onClick={closePrompt}>
                {t('workspace.cancel')}
              </button>
              <button type="submit" className={styles.primaryButton}>
                {prompt.kind === 'create-folder'
                  ? t('workspace.create')
                  : t('workspace.save')}
              </button>
            </div>
          </form>
        ) : null}

        {prompt?.kind === 'move' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt();
            }}
          >
            <label htmlFor={promptFieldId}>
              {t('workspace.targetFolder')}
              <select
                id={promptFieldId}
                value={prompt.folderId ?? ''}
                onChange={(event) =>
                  setPrompt({
                    ...prompt,
                    folderId: event.target.value || null,
                  })
                }
              >
                <option value="">{t('workspace.rootFolder')}</option>
                {folderOptions.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.label}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.modalActions}>
              <button type="button" onClick={closePrompt}>
                {t('workspace.cancel')}
              </button>
              <button type="submit" className={styles.primaryButton}>
                {t('workspace.move')}
              </button>
            </div>
          </form>
        ) : null}

        {prompt?.kind === 'delete' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt();
            }}
          >
            <div className={styles.modalActions}>
              <button type="button" onClick={closePrompt}>
                {t('workspace.cancel')}
              </button>
              <button
                type="submit"
                className={styles.dangerButton}
                data-dialog-initial-focus="true"
              >
                {t('workspace.delete')}
              </button>
            </div>
          </form>
        ) : null}

        {prompt?.kind === 'folder-not-empty' ? (
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.primaryButton}
              data-dialog-initial-focus="true"
              onClick={closePrompt}
            >
              {t('workspace.gotIt')}
            </button>
          </div>
        ) : null}

        {prompt?.kind === 'purge' || prompt?.kind === 'empty-trash' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt();
            }}
          >
            <div className={styles.modalActions}>
              <button type="button" onClick={closePrompt}>
                {t('workspace.cancel')}
              </button>
              <button
                type="submit"
                className={styles.dangerButton}
                data-dialog-initial-focus="true"
              >
                {prompt.kind === 'empty-trash'
                  ? t('workspace.emptyTrashAction')
                  : t('workspace.purge')}
              </button>
            </div>
          </form>
        ) : null}
      </WorkspaceDialog>

      <WorkspaceDialog
        open={showEncryptionDialog}
        title={encryptionTitle}
        description={encryptionDescription}
        wide
        closeOnBackdrop={!recoveryKey}
        onClose={recoveryKey ? undefined : deferEncryption}
      >
        {recoveryKey ? (
          <>
            <div className={styles.recoveryKey}>{recoveryKey}</div>
            {cryptoError ? <div className={styles.cryptoError}>{cryptoError}</div> : null}
            <div className={styles.modalActions}>
              <button type="button" onClick={() => void copyRecoveryKey()}>
                {recoveryCopied
                  ? t('workspace.crypto.copied')
                  : t('workspace.crypto.copyKey')}
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                data-dialog-initial-focus="true"
                onClick={() => {
                  setRecoveryKey(null);
                  setRecoveryCopied(false);
                }}
              >
                {t('workspace.crypto.savedKey')}
              </button>
            </div>
          </>
        ) : encryptionState === 'setup-required' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSetupEncryption();
            }}
          >
            <label htmlFor={passwordFieldId}>
              {t('workspace.crypto.password')}
              <WorkspacePasswordInput
                id={passwordFieldId}
                name="drawnix-sync-password"
                autoComplete="new-password"
                placeholder={t('workspace.crypto.passwordPlaceholder')}
                value={syncPassword}
                onChange={setSyncPassword}
                showLabel={t('workspace.showPassword')}
                hideLabel={t('workspace.hidePassword')}
              />
            </label>
            <label htmlFor={passwordConfirmId}>
              {t('workspace.crypto.confirmPassword')}
              <WorkspacePasswordInput
                id={passwordConfirmId}
                name="drawnix-sync-password-confirm"
                autoComplete="new-password"
                value={syncPasswordConfirm}
                onChange={setSyncPasswordConfirm}
                showLabel={t('workspace.showPassword')}
                hideLabel={t('workspace.hidePassword')}
              />
            </label>
            <p className={styles.cryptoWarning}>
              {t('workspace.crypto.warning')}
            </p>
            {cryptoError ? <div className={styles.cryptoError}>{cryptoError}</div> : null}
            <div className={styles.modalActionsBetween}>
              <button type="button" className={styles.linkButton} onClick={deferEncryption}>
                {t('workspace.crypto.setupLater')}
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={cryptoBusy}
              >
                {cryptoBusy
                  ? t('workspace.crypto.setupBusy')
                  : t('workspace.crypto.setupAction')}
              </button>
            </div>
          </form>
        ) : !recoveryMode ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleUnlockEncryption();
            }}
          >
            <label htmlFor={passwordFieldId}>
              {t('workspace.crypto.password')}
              <WorkspacePasswordInput
                id={passwordFieldId}
                name="drawnix-sync-password"
                autoComplete="current-password"
                value={syncPassword}
                onChange={setSyncPassword}
                showLabel={t('workspace.showPassword')}
                hideLabel={t('workspace.hidePassword')}
              />
            </label>
            {cryptoError ? <div className={styles.cryptoError}>{cryptoError}</div> : null}
            <div className={styles.modalActionsBetween}>
              <button type="button" className={styles.linkButton} onClick={deferEncryption}>
                {t('workspace.crypto.unlockLater')}
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={cryptoBusy}
              >
                {cryptoBusy
                  ? t('workspace.crypto.unlockBusy')
                  : t('workspace.crypto.unlockAction')}
              </button>
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setCryptoError('');
                  setRecoveryMode(true);
                  setSyncPassword('');
                }}
              >
                {t('workspace.crypto.forgotPassword')}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleRecoverEncryption();
            }}
          >
            <label htmlFor={recoveryFieldId}>
              {t('workspace.crypto.recoveryKey')}
              <textarea
                id={recoveryFieldId}
                rows={3}
                value={recoveryInput}
                onChange={(event) => setRecoveryInput(event.target.value)}
                placeholder={t('workspace.crypto.recoveryPlaceholder')}
                spellCheck={false}
                autoComplete="off"
              />
            </label>
            <label htmlFor={passwordFieldId}>
              {t('workspace.crypto.newPassword')}
              <WorkspacePasswordInput
                id={passwordFieldId}
                name="drawnix-sync-password"
                autoComplete="new-password"
                value={syncPassword}
                onChange={setSyncPassword}
                showLabel={t('workspace.showPassword')}
                hideLabel={t('workspace.hidePassword')}
              />
            </label>
            <label htmlFor={passwordConfirmId}>
              {t('workspace.crypto.confirmNewPassword')}
              <WorkspacePasswordInput
                id={passwordConfirmId}
                name="drawnix-sync-password-confirm"
                autoComplete="new-password"
                value={syncPasswordConfirm}
                onChange={setSyncPasswordConfirm}
                showLabel={t('workspace.showPassword')}
                hideLabel={t('workspace.hidePassword')}
              />
            </label>
            {cryptoError ? <div className={styles.cryptoError}>{cryptoError}</div> : null}
            <div className={styles.modalActionsBetween}>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setRecoveryMode(false);
                  setCryptoError('');
                  setRecoveryInput('');
                  setSyncPassword('');
                  setSyncPasswordConfirm('');
                }}
              >
                {t('workspace.crypto.backToUnlock')}
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={cryptoBusy}
              >
                {cryptoBusy
                  ? t('workspace.crypto.recoverBusy')
                  : t('workspace.crypto.recoverAction')}
              </button>
            </div>
          </form>
        )}
      </WorkspaceDialog>
    </div>
  );
}

export default App;
