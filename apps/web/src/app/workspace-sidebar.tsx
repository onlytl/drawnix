import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import styles from './app.module.scss';
import type { Translations, TranslationVars } from '@drawnix/drawnix';
import type {
  CloudSession,
  EncryptionState,
  WorkspaceDocument,
  WorkspaceFolder,
} from './workspace-types';

type Translate = (key: keyof Translations, vars?: TranslationVars) => string;

type Props = {
  folders: WorkspaceFolder[];
  documents: WorkspaceDocument[];
  activeDocumentId?: string;
  session: CloudSession | null;
  cloudConfigured: boolean;
  cloudBusy: boolean;
  encryptionState: EncryptionState;
  expandFolderId?: string | null;
  t: Translate;
  onSelectDocument: (id: string) => void;
  onCreateDocument: (folderId?: string | null) => void;
  onCreateFolder: (parentId?: string | null) => void;
  onRenameDocument: (document: WorkspaceDocument) => void;
  onRenameFolder: (folder: WorkspaceFolder) => void;
  onMoveDocument: (document: WorkspaceDocument) => void;
  onDeleteDocument: (document: WorkspaceDocument) => void;
  onDeleteFolder: (folder: WorkspaceFolder) => void;
  onRestoreDocument: (document: WorkspaceDocument) => void;
  onRestoreFolder: (folder: WorkspaceFolder) => void;
  onPurgeDocument: (document: WorkspaceDocument) => void;
  onPurgeFolder: (folder: WorkspaceFolder) => void;
  onEmptyTrash: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onUnlock: () => void;
};

type IconName =
  | 'chevron'
  | 'diagram'
  | 'diagram-plus'
  | 'folder'
  | 'folder-open'
  | 'folder-plus'
  | 'move'
  | 'edit'
  | 'trash'
  | 'panel-close'
  | 'panel-open'
  | 'search'
  | 'more'
  | 'restore';

type MenuItem = {
  label: string;
  icon: IconName;
  danger?: boolean;
  onSelect: () => void;
};

const SIDEBAR_WIDTH_KEY = 'drawnix_sidebar_width';
const SIDEBAR_COLLAPSED_KEY = 'drawnix_sidebar_collapsed';
const SIDEBAR_FOLDERS_KEY = 'drawnix_sidebar_collapsed_folders';
const DEFAULT_SIDEBAR_WIDTH = 292;
const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 420;

const syncLabelKey: Record<
  WorkspaceDocument['syncState'],
  keyof Translations
> = {
  pending: 'workspace.syncPending',
  syncing: 'workspace.syncSyncing',
  synced: 'workspace.syncSynced',
  conflict: 'workspace.syncConflict',
};

const syncClassName: Record<WorkspaceDocument['syncState'], string> = {
  pending: styles.syncPending,
  syncing: styles.syncSyncing,
  synced: styles.syncSynced,
  conflict: styles.syncConflict,
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'chevron':
      return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
    case 'folder':
      return <svg {...common}><path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h3.2l2 2H18a2.5 2.5 0 0 1 2.5 2.5V17A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17Z" /></svg>;
    case 'folder-open':
      return <svg {...common}><path d="M3.5 8V6.5A2.5 2.5 0 0 1 6 4h3.2l2 2H18a2.5 2.5 0 0 1 2.5 2.5" /><path d="M4.2 9h16.6l-2 8.2a3 3 0 0 1-2.9 2.3H6.7a2.5 2.5 0 0 1-2.4-1.9L2.5 11.5A2 2 0 0 1 4.2 9Z" /></svg>;
    case 'diagram':
      return <svg {...common}><rect x="3" y="4" width="6" height="5" rx="1" /><rect x="15" y="4" width="6" height="5" rx="1" /><rect x="9" y="15" width="6" height="5" rx="1" /><path d="M6 9v2h12V9M12 11v4" /></svg>;
    case 'diagram-plus':
      return <svg {...common}><rect x="3" y="5" width="6" height="5" rx="1" /><rect x="9" y="15" width="6" height="5" rx="1" /><path d="M6 10v2h6v3" /><path d="M17 5v6M14 8h6" /></svg>;
    case 'folder-plus':
      return <svg {...common}><path d="M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2l2 2H18a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17Z" /><path d="M12 10v5M9.5 12.5h5" /></svg>;
    case 'move':
      return <svg {...common}><path d="M12 3v18M3 12h18" /><path d="m8 7 4-4 4 4M17 8l4 4-4 4M8 17l4 4 4-4M7 8l-4 4 4 4" /></svg>;
    case 'edit':
      return <svg {...common}><path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0 0-2.8l-.4-.4a2 2 0 0 0-2.8 0L5 15.8Z" /><path d="m14.5 6.5 3 3" /></svg>;
    case 'trash':
      return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5" /></svg>;
    case 'panel-close':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 9l-3 3 3 3" /></svg>;
    case 'panel-open':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M12 9l3 3-3 3" /></svg>;
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.5-3.5" /></svg>;
    case 'more':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      );
    case 'restore':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
      );
  }
}

function compareName(a: string, b: string) {
  return a.localeCompare(b, 'zh', { numeric: true, sensitivity: 'base' });
}

export function listFolderPaths(folders: WorkspaceFolder[]) {
  const visible = folders.filter((folder) => !folder.deletedAt);
  const byParent = new Map<string | null, WorkspaceFolder[]>();

  for (const folder of visible) {
    const list = byParent.get(folder.parentId) ?? [];
    list.push(folder);
    byParent.set(folder.parentId, list);
  }

  for (const list of byParent.values()) {
    list.sort((left, right) => compareName(left.name, right.name));
  }

  const result: { id: string; label: string }[] = [];
  const walk = (parentId: string | null, prefix: string) => {
    for (const folder of byParent.get(parentId) ?? []) {
      const label = prefix ? `${prefix} / ${folder.name}` : folder.name;
      result.push({ id: folder.id, label });
      walk(folder.id, label);
    }
  };

  walk(null, '');
  return result;
}

function loadSidebarWidth() {
  if (typeof window === 'undefined') return DEFAULT_SIDEBAR_WIDTH;
  const stored = Number(window.localStorage.getItem(SIDEBAR_WIDTH_KEY));
  return Number.isFinite(stored) && stored >= MIN_SIDEBAR_WIDTH && stored <= MAX_SIDEBAR_WIDTH
    ? stored
    : DEFAULT_SIDEBAR_WIDTH;
}

function loadSidebarCollapsed() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
}

function loadCollapsedFolders() {
  if (typeof window === 'undefined') return new Set<string>();
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(SIDEBAR_FOLDERS_KEY) ?? '[]',
    ) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set<string>();
  }
}

function useFloatingMenu() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const onDown = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openAt = (top: number, left: number) => {
    const menuHeight = 148;
    setPos({
      top: top + menuHeight > window.innerHeight ? Math.max(8, top - menuHeight) : top,
      left: Math.max(8, Math.min(left, window.innerWidth - 176)),
    });
    setOpen(true);
  };

  return { open, pos, setOpen, openAt };
}

function RowMenu({
  items,
  open,
  pos,
  onClose,
}: {
  items: MenuItem[];
  open: boolean;
  pos: { top: number; left: number };
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className={styles.menuPortal}
      role="menu"
      style={{ top: pos.top, left: pos.left }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          className={`${styles.menuItem} ${item.danger ? styles.menuItemDanger : ''}`}
          onClick={() => {
            onClose();
            item.onSelect();
          }}
        >
          <Icon name={item.icon} size={14} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

function MoreButton({
  label,
  onToggle,
}: {
  label: string;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      className={styles.moreButton}
      title={label}
      aria-label={label}
      aria-haspopup="menu"
      onClick={onToggle}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Icon name="more" size={14} />
    </button>
  );
}

export function WorkspaceSidebar({
  folders,
  documents,
  activeDocumentId,
  session,
  cloudConfigured,
  cloudBusy,
  encryptionState,
  expandFolderId,
  t,
  onSelectDocument,
  onCreateDocument,
  onCreateFolder,
  onRenameDocument,
  onRenameFolder,
  onMoveDocument,
  onDeleteDocument,
  onDeleteFolder,
  onRestoreDocument,
  onRestoreFolder,
  onPurgeDocument,
  onPurgeFolder,
  onEmptyTrash,
  onSignIn,
  onSignOut,
  onUnlock,
}: Props) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'tree' | 'trash'>('tree');
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(loadCollapsedFolders);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(loadSidebarCollapsed);
  const [sidebarWidth, setSidebarWidth] = useState(loadSidebarWidth);
  const resizingRef = useRef(false);

  const visibleFolders = useMemo(
    () =>
      folders
        .filter((folder) => !folder.deletedAt)
        .sort((left, right) => compareName(left.name, right.name)),
    [folders],
  );
  const visibleDocuments = useMemo(
    () =>
      documents
        .filter((document) => !document.deletedAt)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [documents],
  );
  const encryptionUnlocked = encryptionState === 'unlocked';
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return { folders: visibleFolders, documents: visibleDocuments };
    }

    const folderNameMatched = new Set(
      visibleFolders
        .filter((folder) => folder.name.toLowerCase().includes(normalizedQuery))
        .map((folder) => folder.id),
    );

    const keepFolderIds = new Set<string>(folderNameMatched);
    const addAncestors = (folderId: string | null) => {
      let currentId = folderId;
      const visited = new Set<string>();
      while (currentId && !visited.has(currentId)) {
        visited.add(currentId);
        keepFolderIds.add(currentId);
        currentId =
          visibleFolders.find((folder) => folder.id === currentId)?.parentId ?? null;
      }
    };

    const addDescendants = (folderId: string) => {
      for (const child of visibleFolders) {
        if (child.parentId === folderId) {
          keepFolderIds.add(child.id);
          addDescendants(child.id);
        }
      }
    };

    folderNameMatched.forEach((id) => {
      addAncestors(id);
      addDescendants(id);
    });

    const nextDocuments = visibleDocuments.filter((document) => {
      if (document.name.toLowerCase().includes(normalizedQuery)) {
        addAncestors(document.folderId);
        return true;
      }
      let folderId = document.folderId;
      while (folderId) {
        if (folderNameMatched.has(folderId)) return true;
        folderId = visibleFolders.find((folder) => folder.id === folderId)?.parentId ?? null;
      }
      return false;
    });

    return {
      folders: visibleFolders.filter((folder) => keepFolderIds.has(folder.id)),
      documents: nextDocuments,
    };
  }, [normalizedQuery, visibleDocuments, visibleFolders]);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(
      SIDEBAR_FOLDERS_KEY,
      JSON.stringify([...collapsedFolders]),
    );
  }, [collapsedFolders]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!resizingRef.current) return;
      setSidebarWidth(
        Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, event.clientX)),
      );
    };
    const handlePointerUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const folderId =
      expandFolderId ??
      visibleDocuments.find((item) => item.id === activeDocumentId)?.folderId ??
      null;
    if (!folderId) return;

    setCollapsedFolders((current) => {
      const next = new Set(current);
      let currentId: string | null = folderId;
      let changed = false;
      const visited = new Set<string>();
      while (currentId && !visited.has(currentId)) {
        visited.add(currentId);
        if (next.has(currentId)) {
          next.delete(currentId);
          changed = true;
        }
        currentId =
          folders.find((folder) => folder.id === currentId)?.parentId ?? null;
      }
      return changed ? next : current;
    });
  }, [activeDocumentId, expandFolderId, folders, visibleDocuments]);

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const trashedFolders = useMemo(
    () =>
      folders
        .filter((folder) => folder.deletedAt)
        .sort((left, right) => (right.deletedAt ?? '').localeCompare(left.deletedAt ?? '')),
    [folders],
  );
  const trashedDocuments = useMemo(
    () =>
      documents
        .filter((document) => document.deletedAt)
        .sort((left, right) => (right.deletedAt ?? '').localeCompare(left.deletedAt ?? '')),
    [documents],
  );
  const trashCount = trashedFolders.length + trashedDocuments.length;

  const renderDocument = (document: WorkspaceDocument) => (
    <DocumentRow
      key={document.id}
      document={document}
      active={activeDocumentId === document.id}
      t={t}
      onSelect={onSelectDocument}
      onRename={onRenameDocument}
      onMove={onMoveDocument}
      onDelete={onDeleteDocument}
    />
  );

  const renderFolder = (folder: WorkspaceFolder) => {
    const childFolders = filtered.folders.filter((item) => item.parentId === folder.id);
    const childDocuments = filtered.documents.filter((item) => item.folderId === folder.id);
    const isCollapsed = !normalizedQuery && collapsedFolders.has(folder.id);

    return (
      <FolderRow
        key={folder.id}
        folder={folder}
        collapsed={isCollapsed}
        childFolders={childFolders}
        childDocuments={childDocuments}
        onToggle={() => toggleFolder(folder.id)}
        t={t}
        onCreateDocument={onCreateDocument}
        onCreateFolder={onCreateFolder}
        onRename={onRenameFolder}
        onDelete={onDeleteFolder}
        renderFolder={renderFolder}
        renderDocument={renderDocument}
      />
    );
  };

  const rootFolders = filtered.folders.filter((folder) => folder.parentId === null);
  const rootDocuments = filtered.documents.filter((document) => document.folderId === null);
  const statusTitle = !session
    ? t('workspace.notSignedIn')
    : encryptionState === 'checking'
      ? t('workspace.cloudChecking')
      : encryptionUnlocked
        ? t('workspace.cloudEnabled')
        : t('workspace.cloudLocked');

  return (
    <>
      {!sidebarCollapsed && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <aside
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
        style={{
          width: sidebarCollapsed ? 56 : sidebarWidth,
          minWidth: sidebarCollapsed ? 56 : sidebarWidth,
        }}
      >
        <div className={styles.brand}>
          {sidebarCollapsed ? (
            <button
              type="button"
              className={styles.brandMark}
              title={t('workspace.expandSidebar')}
              aria-label={t('workspace.expandSidebar')}
              onClick={() => setSidebarCollapsed(false)}
            >
              D
            </button>
          ) : (
            <>
              <div className={styles.brandText}>
                <strong>Drawnix</strong>
                <span>{t('workspace.brandSubtitle')}</span>
              </div>
              <button
                type="button"
                className={styles.panelButton}
                title={t('workspace.collapseSidebar')}
                aria-label={t('workspace.collapseSidebar')}
                aria-expanded="true"
                onClick={() => setSidebarCollapsed(true)}
              >
                <Icon name="panel-close" />
              </button>
            </>
          )}
        </div>

        {sidebarCollapsed ? (
          <div className={styles.collapsedActions}>
            <button type="button" title={t('workspace.newDiagram')} aria-label={t('workspace.newDiagram')} onClick={() => onCreateDocument(null)}>
              <Icon name="diagram-plus" />
            </button>
            <button type="button" title={t('workspace.newFolder')} aria-label={t('workspace.newFolder')} onClick={() => onCreateFolder(null)}>
              <Icon name="folder-plus" />
            </button>
            <button
              type="button"
              title={t('workspace.openTrash')}
              aria-label={t('workspace.openTrash')}
              onClick={() => {
                setView('trash');
                setSidebarCollapsed(false);
              }}
            >
              <Icon name="trash" />
            </button>
            <button type="button" title={t('workspace.expandSidebar')} aria-label={t('workspace.expandSidebar')} onClick={() => setSidebarCollapsed(false)}>
              <Icon name="panel-open" />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.primaryActions}>
              <button type="button" onClick={() => { setView('tree'); onCreateDocument(null); }}>
                <Icon name="diagram-plus" />
                <span>{t('workspace.newDiagram')}</span>
              </button>
              <button type="button" onClick={() => { setView('tree'); onCreateFolder(null); }}>
                <Icon name="folder-plus" />
                <span>{t('workspace.newFolder')}</span>
              </button>
            </div>
            {view === 'tree' ? (
              <>
                <div className={styles.search}>
                  <span className={styles.searchIcon}>
                    <Icon name="search" size={14} />
                  </span>
                  <input
                    type="search"
                    value={query}
                    placeholder={t('workspace.searchPlaceholder')}
                    aria-label={t('workspace.searchPlaceholder')}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className={styles.treeHeader}>
                  <span>{t('workspace.myDiagrams')}</span>
                  <div className={styles.treeHeaderActions}>
                    <span className={styles.treeCount}>{filtered.documents.length}</span>
                    <button
                      type="button"
                      className={styles.headerIconButton}
                      title={t('workspace.openTrash')}
                      aria-label={t('workspace.openTrash')}
                      onClick={() => setView('trash')}
                    >
                      <Icon name="trash" size={14} />
                      {trashCount > 0 ? <span className={styles.trashBadge}>{trashCount}</span> : null}
                    </button>
                  </div>
                </div>
                <div className={styles.tree} role="tree">
                  {rootFolders.map(renderFolder)}
                  {rootDocuments.map(renderDocument)}
                  {filtered.folders.length === 0 && filtered.documents.length === 0 && (
                    <div className={styles.emptyTree}>
                      {normalizedQuery ? t('workspace.emptySearch') : t('workspace.emptyTree')}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.treeHeader}>
                  <span>{t('workspace.trash')}</span>
                  <div className={styles.treeHeaderActions}>
                    <span className={styles.treeCount}>{trashCount}</span>
                    <button
                      type="button"
                      className={styles.headerTextButton}
                      onClick={() => setView('tree')}
                    >
                      {t('workspace.backToTree')}
                    </button>
                  </div>
                </div>
                <div className={styles.tree}>
                  {trashedFolders.map((folder) => (
                    <div key={folder.id} className={styles.trashRow}>
                      <span className={styles.folderIcon}><Icon name="folder" /></span>
                      <span className={styles.itemName} title={folder.name}>{folder.name}</span>
                      <div className={styles.rowActionsVisible}>
                        <button
                          type="button"
                          title={t('workspace.restore')}
                          aria-label={t('workspace.restore')}
                          onClick={() => {
                            onRestoreFolder(folder);
                            setView('tree');
                          }}
                        >
                          <Icon name="restore" size={14} />
                        </button>
                        <button type="button" title={t('workspace.deleteForever')} aria-label={t('workspace.deleteForever')} onClick={() => onPurgeFolder(folder)}>
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {trashedDocuments.map((document) => (
                    <div key={document.id} className={styles.trashRow}>
                      <span className={styles.diagramIcon}><Icon name="diagram" /></span>
                      <span className={styles.itemName} title={document.name}>{document.name}</span>
                      <div className={styles.rowActionsVisible}>
                        <button
                          type="button"
                          title={t('workspace.restore')}
                          aria-label={t('workspace.restore')}
                          onClick={() => {
                            onRestoreDocument(document);
                            setView('tree');
                          }}
                        >
                          <Icon name="restore" size={14} />
                        </button>
                        <button type="button" title={t('workspace.deleteForever')} aria-label={t('workspace.deleteForever')} onClick={() => onPurgeDocument(document)}>
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {trashCount === 0 ? (
                    <div className={styles.emptyTree}>{t('workspace.emptyTrash')}</div>
                  ) : (
                    <button type="button" className={styles.emptyTrashButton} onClick={onEmptyTrash}>
                      {t('workspace.emptyTrashAction')}
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className={`${styles.account} ${sidebarCollapsed ? styles.accountCollapsed : ''}`}>
          {sidebarCollapsed ? (
            <span
              className={session && encryptionUnlocked ? styles.onlineDot : styles.offlineDot}
              title={statusTitle}
            />
          ) : !cloudConfigured ? (
            <>
              <strong>{t('workspace.localOnlyTitle')}</strong>
              <span>{t('workspace.localOnlyHint')}</span>
            </>
          ) : session ? (
            <>
              <div className={styles.accountStatus}>
                <span className={encryptionUnlocked ? styles.onlineDot : styles.offlineDot} />
                <div>
                  <strong>
                    {encryptionState === 'checking'
                      ? t('workspace.cloudChecking')
                      : encryptionUnlocked
                        ? cloudBusy
                          ? t('workspace.cloudSyncing')
                          : t('workspace.cloudEnabled')
                        : encryptionState === 'setup-required'
                          ? t('workspace.cloudSetupRequired')
                          : t('workspace.cloudLocked')}
                  </strong>
                  <span>{session.user.email ?? session.user.id}</span>
                </div>
              </div>
              {(encryptionState === 'locked' || encryptionState === 'setup-required') && (
                <button type="button" className={styles.loginButton} onClick={onUnlock}>
                  {encryptionState === 'setup-required'
                    ? t('workspace.setupEncryption')
                    : t('workspace.unlockCloud')}
                </button>
              )}
              <button type="button" className={styles.subtleButton} onClick={onSignOut}>
                {t('workspace.signOut')}
              </button>
            </>
          ) : (
            <>
              <strong>{t('workspace.cloudSignedOutTitle')}</strong>
              <span>{t('workspace.cloudSignedOutHint')}</span>
              <button type="button" className={styles.loginButton} onClick={onSignIn}>
                {t('workspace.signInGitHub')}
              </button>
            </>
          )}
        </div>

        {!sidebarCollapsed && (
          <div
            className={styles.resizeHandle}
            title={t('workspace.resizeSidebar')}
            role="separator"
            aria-orientation="vertical"
            aria-label={t('workspace.resizeSidebar')}
            onPointerDown={(event) => {
              event.preventDefault();
              resizingRef.current = true;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
          />
        )}
      </aside>
    </>
  );
}

function DocumentRow({
  document,
  active,
  t,
  onSelect,
  onRename,
  onMove,
  onDelete,
}: {
  document: WorkspaceDocument;
  active: boolean;
  t: Translate;
  onSelect: (id: string) => void;
  onRename: (document: WorkspaceDocument) => void;
  onMove: (document: WorkspaceDocument) => void;
  onDelete: (document: WorkspaceDocument) => void;
}) {
  const menu = useFloatingMenu();
  const items: MenuItem[] = [
    { label: t('workspace.moveTo'), icon: 'move', onSelect: () => onMove(document) },
    { label: t('workspace.rename'), icon: 'edit', onSelect: () => onRename(document) },
    { label: t('workspace.delete'), icon: 'trash', danger: true, onSelect: () => onDelete(document) },
  ];
  const syncText = t(syncLabelKey[document.syncState]);

  return (
    <div
      className={`${styles.documentRow} ${active ? styles.active : ''}`}
      role="treeitem"
      aria-selected={active}
      onContextMenu={(event) => {
        event.preventDefault();
        menu.openAt(event.clientY, event.clientX);
      }}
    >
      <span className={styles.treeSpacer} />
      <button
        type="button"
        className={styles.documentButton}
        onClick={() => onSelect(document.id)}
        onDoubleClick={() => onRename(document)}
        title={`${document.name} · ${syncText}`}
      >
        <span className={styles.diagramIcon}><Icon name="diagram" /></span>
        <span className={styles.itemName}>{document.name}</span>
        <span
          className={`${styles.syncDot} ${syncClassName[document.syncState]}`}
          aria-label={syncText}
          title={syncText}
        />
      </button>
      <div className={styles.rowActions}>
        <MoreButton
          label={t('workspace.diagramActions')}
          onToggle={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            if (menu.open) menu.setOpen(false);
            else menu.openAt(rect.bottom + 4, rect.right - 168);
          }}
        />
      </div>
      <RowMenu
        items={items}
        open={menu.open}
        pos={menu.pos}
        onClose={() => menu.setOpen(false)}
      />
    </div>
  );
}

function FolderRow({
  folder,
  collapsed,
  childFolders,
  childDocuments,
  t,
  onToggle,
  onCreateDocument,
  onCreateFolder,
  onRename,
  onDelete,
  renderFolder,
  renderDocument,
}: {
  folder: WorkspaceFolder;
  collapsed: boolean;
  childFolders: WorkspaceFolder[];
  childDocuments: WorkspaceDocument[];
  t: Translate;
  onToggle: () => void;
  onCreateDocument: (folderId?: string | null) => void;
  onCreateFolder: (parentId?: string | null) => void;
  onRename: (folder: WorkspaceFolder) => void;
  onDelete: (folder: WorkspaceFolder) => void;
  renderFolder: (folder: WorkspaceFolder) => ReactNode;
  renderDocument: (document: WorkspaceDocument) => ReactNode;
}) {
  const menu = useFloatingMenu();
  const items: MenuItem[] = [
    { label: t('workspace.newDiagramInFolder'), icon: 'diagram-plus', onSelect: () => onCreateDocument(folder.id) },
    { label: t('workspace.newSubfolder'), icon: 'folder-plus', onSelect: () => onCreateFolder(folder.id) },
    { label: t('workspace.rename'), icon: 'edit', onSelect: () => onRename(folder) },
    { label: t('workspace.delete'), icon: 'trash', danger: true, onSelect: () => onDelete(folder) },
  ];
  const hasChildren = childFolders.length > 0 || childDocuments.length > 0;

  return (
    <div className={styles.folderNode} role="treeitem" aria-expanded={!collapsed}>
      <div
        className={styles.folderRow}
        onContextMenu={(event) => {
          event.preventDefault();
          menu.openAt(event.clientY, event.clientX);
        }}
      >
        <button
          type="button"
          className={`${styles.folderToggle} ${collapsed ? '' : styles.folderToggleOpen}`}
          onClick={onToggle}
          title={collapsed ? t('workspace.expandFolder', { name: folder.name }) : t('workspace.collapseFolder', { name: folder.name })}
          aria-label={collapsed ? t('workspace.expandFolder', { name: folder.name }) : t('workspace.collapseFolder', { name: folder.name })}
        >
          <Icon name="chevron" size={14} />
        </button>
        <button
          type="button"
          className={styles.folderButton}
          onClick={onToggle}
          onDoubleClick={() => onRename(folder)}
          title={folder.name}
        >
          <span className={styles.folderIcon}>
            <Icon name={collapsed ? 'folder' : 'folder-open'} />
          </span>
          <span className={styles.itemName}>{folder.name}</span>
        </button>
        <div className={styles.rowActions}>
          <MoreButton
            label={t('workspace.folderActions')}
            onToggle={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              if (menu.open) menu.setOpen(false);
              else menu.openAt(rect.bottom + 4, rect.right - 168);
            }}
          />
        </div>
        <RowMenu
          items={items}
          open={menu.open}
          pos={menu.pos}
          onClose={() => menu.setOpen(false)}
        />
      </div>
      {!collapsed && hasChildren && (
        <div className={styles.folderChildren} role="group">
          {childFolders.map(renderFolder)}
          {childDocuments.map(renderDocument)}
        </div>
      )}
    </div>
  );
}
