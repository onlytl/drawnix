import { useState } from 'react';
import styles from './app.module.scss';
import type {
  CloudSession,
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

export function WorkspaceSidebar({
  folders,
  documents,
  activeDocumentId,
  session,
  cloudConfigured,
  cloudBusy,
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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const visibleFolders = folders.filter((folder) => !folder.deletedAt);
  const visibleDocuments = documents.filter((document) => !document.deletedAt);

  const toggleFolder = (folderId: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderDocument = (document: WorkspaceDocument) => (
    <div
      key={document.id}
      className={`${styles.documentRow} ${
        activeDocumentId === document.id ? styles.active : ''
      }`}
    >
      <button
        className={styles.documentButton}
        onClick={() => onSelectDocument(document.id)}
        title={syncLabel[document.syncState]}
      >
        <span className={styles.fileIcon}>◇</span>
        <span className={styles.itemName}>{document.name}</span>
        <span
          className={`${styles.syncDot} ${syncClassName[document.syncState]}`}
          aria-label={syncLabel[document.syncState]}
        />
      </button>
      <div className={styles.rowActions}>
        <button title="移动" onClick={() => onMoveDocument(document)}>
          ↗
        </button>
        <button title="重命名" onClick={() => onRenameDocument(document)}>
          ···
        </button>
        <button title="删除" onClick={() => onDeleteDocument(document)}>
          ×
        </button>
      </div>
    </div>
  );

  const renderFolder = (folder: WorkspaceFolder, depth = 0) => {
    const childFolders = visibleFolders.filter(
      (item) => item.parentId === folder.id,
    );
    const childDocuments = visibleDocuments.filter(
      (document) => document.folderId === folder.id,
    );
    const isCollapsed = collapsed.has(folder.id);

    return (
      <div key={folder.id}>
        <div className={styles.folderRow} style={{ paddingLeft: depth * 12 + 5 }}>
          <button
            className={styles.folderToggle}
            onClick={() => toggleFolder(folder.id)}
            title={isCollapsed ? '展开' : '折叠'}
          >
            {isCollapsed ? '▸' : '▾'}
          </button>
          <span className={styles.folderIcon}>□</span>
          <span className={styles.itemName}>{folder.name}</span>
          <div className={styles.rowActions}>
            <button title="新建图表" onClick={() => onCreateDocument(folder.id)}>
              +
            </button>
            <button title="新建子文件夹" onClick={() => onCreateFolder(folder.id)}>
              ▢
            </button>
            <button title="重命名" onClick={() => onRenameFolder(folder)}>
              ···
            </button>
            <button title="删除" onClick={() => onDeleteFolder(folder)}>
              ×
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <div
            className={styles.folderChildren}
            style={{ paddingLeft: depth * 12 + 10 }}
          >
            {childFolders.map((child) => renderFolder(child, depth + 1))}
            {childDocuments.map(renderDocument)}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = visibleFolders.filter(
    (folder) => folder.parentId === null,
  );
  const rootDocuments = visibleDocuments.filter(
    (document) => document.folderId === null,
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div>
          <strong>Drawnix</strong>
          <span>Workspace</span>
        </div>
      </div>

      <div className={styles.primaryActions}>
        <button onClick={() => onCreateDocument(null)}>＋ 新建图表</button>
        <button onClick={() => onCreateFolder(null)}>＋ 新建文件夹</button>
      </div>

      <div className={styles.tree}>
        {rootFolders.map((folder) => renderFolder(folder))}
        {rootDocuments.map(renderDocument)}
      </div>

      <div className={styles.account}>
        {!cloudConfigured ? (
          <>
            <strong>仅本地保存</strong>
            <span>配置 Supabase 后可自动同步</span>
          </>
        ) : session ? (
          <>
            <div className={styles.accountStatus}>
              <span className={styles.onlineDot} />
              <div>
                <strong>{cloudBusy ? '正在同步…' : '云同步已开启'}</strong>
                <span>{session.user.email ?? session.user.id}</span>
              </div>
            </div>
            <button className={styles.subtleButton} onClick={onSignOut}>
              退出登录
            </button>
          </>
        ) : (
          <>
            <strong>云同步</strong>
            <span>使用 GitHub 登录，多设备自动同步</span>
            <button className={styles.loginButton} onClick={onSignIn}>
              使用 GitHub 登录
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
