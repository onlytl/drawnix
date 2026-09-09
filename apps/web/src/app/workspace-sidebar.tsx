import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import styles from './app.module.scss';
import type {
  CloudSession,
  EncryptionState,
  WorkspaceDocument,
  WorkspaceFolder,
} from './workspace-types';

type Props = {
  folders: WorkspaceFolder[];
  documents: WorkspaceDocument[];
  activeDocumentId?: string;
  session: CloudSession | null;
  cloudConfigured: boolean;
  cloudBusy: boolean;
  encryptionState: EncryptionState;
  expandFolderId?: string | null;
  onSelectDocument: (id: string) => void;
  onCreateDocument: (folderId?: string | null) => void;
  onCreateFolder: (parentId?: string | null) => void;
  onRenameDocument: (document: WorkspaceDocument) => void;
  onRenameFolder: (folder: WorkspaceFolder) => void;
  onMoveDocument: (document: WorkspaceDocument) => void;
  onDeleteDocument: (document: WorkspaceDocument) => void;
  onDeleteFolder: (folder: WorkspaceFolder) => void;
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
  | 'more';

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

const syncLabel: Record<WorkspaceDocument['syncState'], string> = {
  pending: '待同步',
  syncing: '同步中',
  synced: '已同步',
  conflict: '冲突',
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
  onSelectDocument,
  onCreateDocument,
  onCreateFolder,
  onRenameDocument,
  onRenameFolder,
  onMoveDocument,
  onDeleteDocument,
  onDeleteFolder,
  onSignIn,
  onSignOut,
  onUnlock,
}: Props) {
  const [query, setQuery] = useState('');
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

  const renderDocument = (document: WorkspaceDocument) => (
    <DocumentRow
      key={document.id}
      document={document}
      active={activeDocumentId === document.id}
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
    ? '尚未登录云同步'
    : encryptionState === 'checking'
      ? '正在检查加密状态'
      : encryptionUnlocked
        ? '端到端加密云同步已开启'
        : '云同步待解锁';

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
              title="展开侧边栏"
              aria-label="展开侧边栏"
              onClick={() => setSidebarCollapsed(false)}
            >
              D
            </button>
          ) : (
            <>
              <div className={styles.brandText}>
                <strong>Drawnix</strong>
                <span>Workspace</span>
              </div>
              <button
                type="button"
                className={styles.panelButton}
                title="收起侧边栏"
                aria-label="收起侧边栏"
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
            <button type="button" title="新建图表" aria-label="新建图表" onClick={() => onCreateDocument(null)}>
              <Icon name="diagram-plus" />
            </button>
            <button type="button" title="新建文件夹" aria-label="新建文件夹" onClick={() => onCreateFolder(null)}>
              <Icon name="folder-plus" />
            </button>
            <button type="button" title="展开侧边栏" aria-label="展开侧边栏" onClick={() => setSidebarCollapsed(false)}>
              <Icon name="panel-open" />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.primaryActions}>
              <button type="button" onClick={() => onCreateDocument(null)}>
                <Icon name="diagram-plus" />
                <span>新建图表</span>
              </button>
              <button type="button" onClick={() => onCreateFolder(null)}>
                <Icon name="folder-plus" />
                <span>新建文件夹</span>
              </button>
            </div>
            <div className={styles.search}>
              <span className={styles.searchIcon}>
                <Icon name="search" size={14} />
              </span>
              <input
                type="search"
                value={query}
                placeholder="搜索图表或文件夹"
                aria-label="搜索图表或文件夹"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className={styles.treeHeader}>
              <span>我的图表</span>
              <span className={styles.treeCount}>{filtered.documents.length}</span>
            </div>
            <div className={styles.tree} role="tree">
              {rootFolders.map(renderFolder)}
              {rootDocuments.map(renderDocument)}
              {filtered.folders.length === 0 && filtered.documents.length === 0 && (
                <div className={styles.emptyTree}>
                  {normalizedQuery
                    ? '没有匹配的图表或文件夹'
                    : '暂无图表，点击上方按钮开始创建'}
                </div>
              )}
            </div>
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
              <strong>仅本地保存</strong>
              <span>配置 Supabase 后可自动同步</span>
            </>
          ) : session ? (
            <>
              <div className={styles.accountStatus}>
                <span className={encryptionUnlocked ? styles.onlineDot : styles.offlineDot} />
                <div>
                  <strong>
                    {encryptionState === 'checking'
                      ? '检查加密状态…'
                      : encryptionUnlocked
                        ? cloudBusy
                          ? '正在加密同步…'
                          : '加密云同步已开启'
                        : encryptionState === 'setup-required'
                          ? '尚未开启加密同步'
                          : '云同步待解锁'}
                  </strong>
                  <span>{session.user.email ?? session.user.id}</span>
                </div>
              </div>
              {(encryptionState === 'locked' || encryptionState === 'setup-required') && (
                <button type="button" className={styles.loginButton} onClick={onUnlock}>
                  {encryptionState === 'setup-required' ? '开启加密同步' : '解锁云同步'}
                </button>
              )}
              <button type="button" className={styles.subtleButton} onClick={onSignOut}>
                退出登录
              </button>
            </>
          ) : (
            <>
              <strong>加密云同步</strong>
              <span>登录后，图表会在浏览器加密再上传</span>
              <button type="button" className={styles.loginButton} onClick={onSignIn}>
                使用 GitHub 登录
              </button>
            </>
          )}
        </div>

        {!sidebarCollapsed && (
          <div
            className={styles.resizeHandle}
            title="拖动调整侧边栏宽度"
            role="separator"
            aria-orientation="vertical"
            aria-label="拖动调整侧边栏宽度"
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
  onSelect,
  onRename,
  onMove,
  onDelete,
}: {
  document: WorkspaceDocument;
  active: boolean;
  onSelect: (id: string) => void;
  onRename: (document: WorkspaceDocument) => void;
  onMove: (document: WorkspaceDocument) => void;
  onDelete: (document: WorkspaceDocument) => void;
}) {
  const menu = useFloatingMenu();
  const items: MenuItem[] = [
    { label: '移动到…', icon: 'move', onSelect: () => onMove(document) },
    { label: '重命名', icon: 'edit', onSelect: () => onRename(document) },
    { label: '删除', icon: 'trash', danger: true, onSelect: () => onDelete(document) },
  ];

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
        title={`${document.name} · ${syncLabel[document.syncState]}`}
      >
        <span className={styles.diagramIcon}><Icon name="diagram" /></span>
        <span className={styles.itemName}>{document.name}</span>
        <span
          className={`${styles.syncDot} ${syncClassName[document.syncState]}`}
          aria-label={syncLabel[document.syncState]}
          title={syncLabel[document.syncState]}
        />
      </button>
      <div className={styles.rowActions}>
        <MoreButton
          label="图表操作"
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
    { label: '在此新建图表', icon: 'diagram-plus', onSelect: () => onCreateDocument(folder.id) },
    { label: '新建子文件夹', icon: 'folder-plus', onSelect: () => onCreateFolder(folder.id) },
    { label: '重命名', icon: 'edit', onSelect: () => onRename(folder) },
    { label: '删除', icon: 'trash', danger: true, onSelect: () => onDelete(folder) },
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
          title={collapsed ? '展开文件夹' : '折叠文件夹'}
          aria-label={collapsed ? `展开 ${folder.name}` : `折叠 ${folder.name}`}
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
            label="文件夹操作"
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
