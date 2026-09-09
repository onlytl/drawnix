import { useEffect, useRef, useState } from 'react';
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
  | 'panel-open';

const SIDEBAR_WIDTH_KEY = 'drawnix_sidebar_width';
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
  }
}

function loadSidebarWidth() {
  if (typeof window === 'undefined') return DEFAULT_SIDEBAR_WIDTH;
  const stored = Number(window.localStorage.getItem(SIDEBAR_WIDTH_KEY));
  return Number.isFinite(stored) && stored >= MIN_SIDEBAR_WIDTH && stored <= MAX_SIDEBAR_WIDTH
    ? stored
    : DEFAULT_SIDEBAR_WIDTH;
}

export function WorkspaceSidebar({
  folders,
  documents,
  activeDocumentId,
  session,
  cloudConfigured,
  cloudBusy,
  encryptionState,
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
}: Props) {
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(loadSidebarWidth);
  const resizingRef = useRef(false);

  const visibleFolders = folders.filter((folder) => !folder.deletedAt);
  const visibleDocuments = documents.filter((document) => !document.deletedAt);
  const encryptionUnlocked = encryptionState === 'unlocked';

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

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

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const renderDocument = (document: WorkspaceDocument) => (
    <div
      key={document.id}
      className={`${styles.documentRow} ${activeDocumentId === document.id ? styles.active : ''}`}
    >
      <span className={styles.treeSpacer} />
      <button
        className={styles.documentButton}
        onClick={() => onSelectDocument(document.id)}
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
        <button title="移动图表" onClick={() => onMoveDocument(document)}><Icon name="move" size={14} /></button>
        <button title="重命名" onClick={() => onRenameDocument(document)}><Icon name="edit" size={14} /></button>
        <button title="删除" onClick={() => onDeleteDocument(document)}><Icon name="trash" size={14} /></button>
      </div>
    </div>
  );

  const renderFolder = (folder: WorkspaceFolder) => {
    const childFolders = visibleFolders.filter((item) => item.parentId === folder.id);
    const childDocuments = visibleDocuments.filter((item) => item.folderId === folder.id);
    const isCollapsed = collapsedFolders.has(folder.id);

    return (
      <div key={folder.id} className={styles.folderNode}>
        <div className={styles.folderRow}>
          <button
            className={`${styles.folderToggle} ${isCollapsed ? '' : styles.folderToggleOpen}`}
            onClick={() => toggleFolder(folder.id)}
            title={isCollapsed ? '展开文件夹' : '折叠文件夹'}
          >
            <Icon name="chevron" size={14} />
          </button>
          <span className={styles.folderIcon}><Icon name={isCollapsed ? 'folder' : 'folder-open'} /></span>
          <span className={styles.itemName} title={folder.name}>{folder.name}</span>
          <div className={styles.rowActions}>
            <button title="在此新建图表" onClick={() => onCreateDocument(folder.id)}><Icon name="diagram-plus" size={14} /></button>
            <button title="新建子文件夹" onClick={() => onCreateFolder(folder.id)}><Icon name="folder-plus" size={14} /></button>
            <button title="重命名" onClick={() => onRenameFolder(folder)}><Icon name="edit" size={14} /></button>
            <button title="删除" onClick={() => onDeleteFolder(folder)}><Icon name="trash" size={14} /></button>
          </div>
        </div>
        {!isCollapsed && (childFolders.length > 0 || childDocuments.length > 0) && (
          <div className={styles.folderChildren}>
            {childFolders.map(renderFolder)}
            {childDocuments.map(renderDocument)}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = visibleFolders.filter((folder) => folder.parentId === null);
  const rootDocuments = visibleDocuments.filter((document) => document.folderId === null);
  const statusTitle = !session
    ? '尚未登录云同步'
    : encryptionState === 'checking'
      ? '正在检查加密状态'
      : encryptionUnlocked
        ? '端到端加密云同步已开启'
        : '云同步待解锁';

  return (
    <aside
      className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
      style={{
        width: sidebarCollapsed ? 56 : sidebarWidth,
        minWidth: sidebarCollapsed ? 56 : sidebarWidth,
      }}
    >
      <div className={styles.brand}>
        {sidebarCollapsed ? (
          <button className={styles.brandMark} title="展开侧边栏" onClick={() => setSidebarCollapsed(false)}>D</button>
        ) : (
          <>
            <div className={styles.brandText}><strong>Drawnix</strong><span>Workspace</span></div>
            <button className={styles.panelButton} title="收起侧边栏" onClick={() => setSidebarCollapsed(true)}><Icon name="panel-close" /></button>
          </>
        )}
      </div>

      {sidebarCollapsed ? (
        <div className={styles.collapsedActions}>
          <button title="新建图表" onClick={() => onCreateDocument(null)}><Icon name="diagram-plus" /></button>
          <button title="新建文件夹" onClick={() => onCreateFolder(null)}><Icon name="folder-plus" /></button>
          <button title="展开侧边栏" onClick={() => setSidebarCollapsed(false)}><Icon name="panel-open" /></button>
        </div>
      ) : (
        <>
          <div className={styles.primaryActions}>
            <button onClick={() => onCreateDocument(null)}><Icon name="diagram-plus" /><span>新建图表</span></button>
            <button onClick={() => onCreateFolder(null)}><Icon name="folder-plus" /><span>新建文件夹</span></button>
          </div>
          <div className={styles.treeHeader}><span>我的图表</span><span className={styles.treeCount}>{visibleDocuments.length}</span></div>
          <div className={styles.tree}>
            {rootFolders.map(renderFolder)}
            {rootDocuments.map(renderDocument)}
            {visibleFolders.length === 0 && visibleDocuments.length === 0 && (
              <div className={styles.emptyTree}>暂无图表，点击上方按钮开始创建</div>
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
          <><strong>仅本地保存</strong><span>配置 Supabase 后可自动同步</span></>
        ) : session ? (
          <>
            <div className={styles.accountStatus}>
              <span className={encryptionUnlocked ? styles.onlineDot : styles.offlineDot} />
              <div>
                <strong>
                  {encryptionState === 'checking'
                    ? '检查加密状态…'
                    : encryptionUnlocked
                      ? cloudBusy ? '正在加密同步…' : '加密云同步已开启'
                      : '云同步待解锁'}
                </strong>
                <span>{session.user.email ?? session.user.id}</span>
              </div>
            </div>
            <button className={styles.subtleButton} onClick={onSignOut}>退出登录</button>
          </>
        ) : (
          <>
            <strong>加密云同步</strong>
            <span>登录后，图表会在浏览器加密再上传</span>
            <button className={styles.loginButton} onClick={onSignIn}>使用 GitHub 登录</button>
          </>
        )}
      </div>

      {!sidebarCollapsed && (
        <div
          className={styles.resizeHandle}
          title="拖动调整侧边栏宽度"
          onPointerDown={(event) => {
            event.preventDefault();
            resizingRef.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        />
      )}
    </aside>
  );
}
