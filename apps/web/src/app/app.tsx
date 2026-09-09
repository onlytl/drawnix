import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Drawnix, DrawnixToolState } from '@drawnix/drawnix';
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
import { WorkspaceSidebar } from './workspace-sidebar';
import type {
  CloudSession,
  EncryptionState,
  MainBoardPreference,
  WorkspaceDocument,
  WorkspaceFolder,
} from './workspace-types';

const DEFAULT_PREFERENCE: MainBoardPreference = {
  language: 'zh',
  copyTransparent: false,
  exportTransparent: false,
};

type MoveDialogState = {
  documentId: string;
  folderId: string | null;
} | null;

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
  const [moveDialog, setMoveDialog] = useState<MoveDialogState>(null);
  const [encryptionState, setEncryptionState] =
    useState<EncryptionState>('signed-out');
  const [cryptoBusy, setCryptoBusy] = useState(false);
  const [cryptoError, setCryptoError] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [syncPasswordConfirm, setSyncPasswordConfirm] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);

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
      activeDocumentIdRef.current = workspace.activeDocumentId;
      setActiveDocumentId(workspace.activeDocumentId);
      setSession(cloudSession);

      if (storedToolState) {
        setInitialToolState(storedToolState as Partial<DrawnixToolState>);
      }
      if (storedPreference) {
        setPreference(storedPreference as MainBoardPreference);
      }

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
          setCryptoError('无法读取加密设置，请稍后重试');
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

  const selectDocument = async (id: string) => {
    activeDocumentIdRef.current = id;
    setActiveDocumentId(id);
    await saveActiveDocumentId(id);
  };

  const createDocument = (folderId: string | null = null) => {
    const document = createLocalDocument(folderId);
    commitDocuments((current) => [...current, document]);
    activeDocumentIdRef.current = document.id;
    setActiveDocumentId(document.id);
    void saveActiveDocumentId(document.id);
    scheduleDocumentSync(document.id, 50);
  };

  const createFolder = (parentId: string | null = null) => {
    const name = window.prompt('文件夹名称', '新建文件夹')?.trim();
    if (!name) {
      return;
    }
    const folder = createLocalFolder(parentId, name);
    commitFolders((current) => [...current, folder]);
    if (sessionRef.current && isCloudEncryptionUnlocked()) {
      setTimeout(() => void runFolderSync(folder.id), 50);
    }
  };

  const renameDocument = (document: WorkspaceDocument) => {
    const name = window.prompt('图表名称', document.name)?.trim();
    if (!name || name === document.name) {
      return;
    }

    const next = {
      ...document,
      name,
      updatedAt: new Date().toISOString(),
      syncState: 'pending' as const,
    };
    updateDocument(next);
    scheduleDocumentSync(document.id);
  };

  const renameFolder = (folder: WorkspaceFolder) => {
    const name = window.prompt('文件夹名称', folder.name)?.trim();
    if (!name || name === folder.name) {
      return;
    }

    const next = {
      ...folder,
      name,
      updatedAt: new Date().toISOString(),
      syncState: 'pending' as const,
    };
    updateFolder(next);
    if (sessionRef.current && isCloudEncryptionUnlocked()) {
      setTimeout(() => void runFolderSync(folder.id), 50);
    }
  };

  const deleteDocument = async (document: WorkspaceDocument) => {
    if (!window.confirm(`删除“${document.name}”？`)) {
      return;
    }

    const now = new Date().toISOString();
    updateDocument({
      ...document,
      deletedAt: now,
      updatedAt: now,
      syncState: 'pending',
    });
    scheduleDocumentSync(document.id, 50);

    if (activeDocumentId === document.id) {
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
    }
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
      window.alert('请先移动或删除文件夹内的图表和子文件夹。');
      return;
    }
    if (!window.confirm(`删除文件夹“${folder.name}”？`)) {
      return;
    }

    const now = new Date().toISOString();
    updateFolder({
      ...folder,
      deletedAt: now,
      updatedAt: now,
      syncState: 'pending',
    });
    if (sessionRef.current && isCloudEncryptionUnlocked()) {
      setTimeout(() => void runFolderSync(folder.id), 50);
    }
  };

  const openMoveDialog = (document: WorkspaceDocument) => {
    setMoveDialog({
      documentId: document.id,
      folderId: document.folderId,
    });
  };

  const confirmMove = () => {
    if (!moveDialog) {
      return;
    }

    const document = documentsRef.current.find(
      (item) => item.id === moveDialog.documentId,
    );
    if (!document || document.folderId === moveDialog.folderId) {
      setMoveDialog(null);
      return;
    }

    const next = {
      ...document,
      folderId: moveDialog.folderId,
      updatedAt: new Date().toISOString(),
      syncState: 'pending' as const,
    };
    updateDocument(next);
    scheduleDocumentSync(document.id, 50);
    setMoveDialog(null);
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
        `${document.name}（本地副本）`,
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
      setCryptoError('两次输入的同步密码不一致');
      return;
    }

    setCryptoBusy(true);
    try {
      const key = await setupCloudEncryption(session.user.id, syncPassword);
      setRecoveryKey(key);
      setSyncPassword('');
      setSyncPasswordConfirm('');
      setEncryptionState('unlocked');
    } catch (error) {
      setCryptoError(error instanceof Error ? error.message : '设置加密失败');
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
      setCryptoError(error instanceof Error ? error.message : '解锁失败');
    } finally {
      setCryptoBusy(false);
    }
  };

  const handleRecoverEncryption = async () => {
    if (!session) return;
    setCryptoError('');
    if (syncPassword !== syncPasswordConfirm) {
      setCryptoError('两次输入的新同步密码不一致');
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
      setCryptoError(error instanceof Error ? error.message : '恢复失败');
    } finally {
      setCryptoBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    sessionRef.current = null;
    setSession(null);
    setEncryptionState('signed-out');
    setRecoveryKey(null);
    setCryptoError('');
  };

  if (!loaded) {
    return null;
  }

  const visibleFolders = folders.filter((folder) => !folder.deletedAt);
  const showEncryptionDialog = Boolean(
    session &&
      (recoveryKey ||
        encryptionState === 'setup-required' ||
        encryptionState === 'locked'),
  );

  return (
    <div className={styles.workspace}>
      <WorkspaceSidebar
        folders={folders}
        documents={documents}
        activeDocumentId={activeDocumentId}
        session={session}
        cloudConfigured={isCloudConfigured}
        cloudBusy={cloudBusy}
        encryptionState={encryptionState}
        onSelectDocument={selectDocument}
        onCreateDocument={createDocument}
        onCreateFolder={createFolder}
        onRenameDocument={renameDocument}
        onRenameFolder={renameFolder}
        onMoveDocument={openMoveDialog}
        onDeleteDocument={deleteDocument}
        onDeleteFolder={deleteFolder}
        onSignIn={signInWithGitHub}
        onSignOut={handleSignOut}
      />

      <main className={styles.canvas}>
        {activeDocument ? (
          <>
            {activeDocument.syncState === 'conflict' && (
              <div className={styles.conflictBanner}>
                <strong>检测到云端版本冲突</strong>
                <span>当前图在另一台设备上有更新。</span>
                <button
                  onClick={() => resolveConflict(activeDocument, 'remote')}
                >
                  使用云端
                </button>
                <button
                  onClick={() => resolveConflict(activeDocument, 'local')}
                >
                  使用本地
                </button>
                <button
                  onClick={() => resolveConflict(activeDocument, 'copy')}
                >
                  本地另存副本
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
                if (!current) {
                  return;
                }

                const next: WorkspaceDocument = {
                  ...current,
                  content: value,
                  updatedAt: new Date().toISOString(),
                  syncState: 'pending',
                };
                updateDocument(next);
                scheduleDocumentSync(next.id);
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
              <h2>开始你的第一张图</h2>
              <p>图表会先保存在本地，登录后加密同步到 Supabase。</p>
              <button onClick={() => createDocument(null)}>新建图表</button>
            </div>
          </div>
        )}

        {moveDialog && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <h3>移动图表</h3>
              <label>
                目标文件夹
                <select
                  value={moveDialog.folderId ?? ''}
                  onChange={(event) =>
                    setMoveDialog({
                      ...moveDialog,
                      folderId: event.target.value || null,
                    })
                  }
                >
                  <option value="">根目录</option>
                  {visibleFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.modalActions}>
                <button onClick={() => setMoveDialog(null)}>取消</button>
                <button className={styles.primaryButton} onClick={confirmMove}>
                  移动
                </button>
              </div>
            </div>
          </div>
        )}

        {showEncryptionDialog && (
          <div className={styles.modalBackdrop}>
            <div className={`${styles.modal} ${styles.cryptoModal}`}>
              {recoveryKey ? (
                <>
                  <h3>保存恢复密钥</h3>
                  <p className={styles.modalLead}>
                    云端数据已经开始使用客户端加密。下面的恢复密钥只显示这一次，建议保存到密码管理器。
                  </p>
                  <div className={styles.recoveryKey}>{recoveryKey}</div>
                  <div className={styles.modalActions}>
                    <button
                      onClick={() => void navigator.clipboard.writeText(recoveryKey)}
                    >
                      复制恢复密钥
                    </button>
                    <button
                      className={styles.primaryButton}
                      onClick={() => setRecoveryKey(null)}
                    >
                      我已保存
                    </button>
                  </div>
                </>
              ) : encryptionState === 'setup-required' ? (
                <>
                  <h3>开启加密云同步</h3>
                  <p className={styles.modalLead}>
                    图表内容和名称会在浏览器里使用 AES-256-GCM 加密后再上传。Supabase 只保存密文。
                  </p>
                  <label>
                    同步密码
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={syncPassword}
                      onChange={(event) => setSyncPassword(event.target.value)}
                      placeholder="至少 8 个字符"
                    />
                  </label>
                  <label>
                    确认同步密码
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={syncPasswordConfirm}
                      onChange={(event) =>
                        setSyncPasswordConfirm(event.target.value)
                      }
                    />
                  </label>
                  <p className={styles.cryptoWarning}>
                    同步密码不会上传到服务器。忘记密码且没有恢复密钥时，云端数据无法恢复。
                  </p>
                  {cryptoError && (
                    <div className={styles.cryptoError}>{cryptoError}</div>
                  )}
                  <div className={styles.modalActions}>
                    <button
                      className={styles.primaryButton}
                      disabled={cryptoBusy}
                      onClick={() => void handleSetupEncryption()}
                    >
                      {cryptoBusy ? '正在设置…' : '开启加密同步'}
                    </button>
                  </div>
                </>
              ) : !recoveryMode ? (
                <>
                  <h3>解锁云同步</h3>
                  <p className={styles.modalLead}>
                    这是新设备或本地密钥已经被清除。输入同步密码后，这台设备会记住解密主密钥。
                  </p>
                  <label>
                    同步密码
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={syncPassword}
                      onChange={(event) => setSyncPassword(event.target.value)}
                    />
                  </label>
                  {cryptoError && (
                    <div className={styles.cryptoError}>{cryptoError}</div>
                  )}
                  <div className={styles.modalActionsBetween}>
                    <button
                      className={styles.linkButton}
                      onClick={() => {
                        setCryptoError('');
                        setRecoveryMode(true);
                        setSyncPassword('');
                      }}
                    >
                      忘记密码？使用恢复密钥
                    </button>
                    <button
                      className={styles.primaryButton}
                      disabled={cryptoBusy}
                      onClick={() => void handleUnlockEncryption()}
                    >
                      {cryptoBusy ? '正在解锁…' : '解锁'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>使用恢复密钥</h3>
                  <p className={styles.modalLead}>
                    输入恢复密钥，并设置一个新的同步密码。已有图表不会重新加密，只会重新包裹主密钥。
                  </p>
                  <label>
                    恢复密钥
                    <textarea
                      rows={3}
                      value={recoveryInput}
                      onChange={(event) => setRecoveryInput(event.target.value)}
                      placeholder="drawnix-recovery-v1..."
                    />
                  </label>
                  <label>
                    新同步密码
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={syncPassword}
                      onChange={(event) => setSyncPassword(event.target.value)}
                    />
                  </label>
                  <label>
                    确认新同步密码
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={syncPasswordConfirm}
                      onChange={(event) =>
                        setSyncPasswordConfirm(event.target.value)
                      }
                    />
                  </label>
                  {cryptoError && (
                    <div className={styles.cryptoError}>{cryptoError}</div>
                  )}
                  <div className={styles.modalActionsBetween}>
                    <button
                      className={styles.linkButton}
                      onClick={() => {
                        setRecoveryMode(false);
                        setCryptoError('');
                        setRecoveryInput('');
                        setSyncPassword('');
                        setSyncPasswordConfirm('');
                      }}
                    >
                      返回密码解锁
                    </button>
                    <button
                      className={styles.primaryButton}
                      disabled={cryptoBusy}
                      onClick={() => void handleRecoverEncryption()}
                    >
                      {cryptoBusy ? '正在恢复…' : '恢复并设置新密码'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
