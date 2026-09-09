import { Translations } from '../types';

const zhTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': '手形工具 — H',
  'toolbar.selection': '选择 — V',
  'toolbar.mind': '思维导图 — M',
  'toolbar.text': '文本 — T',
  'toolbar.arrow': '箭头 — A',
  'toolbar.shape': '形状',
  'toolbar.image': '图片 — Cmd+U',
  'toolbar.extraTools': '更多工具',

  'toolbar.pen': '画笔 — P',
  'toolbar.eraser': '橡皮擦 — E',

  'toolbar.arrow.straight': '直线',
  'toolbar.arrow.elbow': '肘线',
  'toolbar.arrow.curve': '曲线',

  'toolbar.shape.rectangle': '长方形 — R',
  'toolbar.shape.ellipse': '圆 — O',
  'toolbar.shape.triangle': '三角形',
  'toolbar.shape.terminal': '开始/结束',
  'toolbar.shape.noteCurlyLeft': '左花括注释',
  'toolbar.shape.noteCurlyRight': '右花括注释',
  'toolbar.shape.diamond': '菱形',
  'toolbar.shape.parallelogram': '平行四边形',
  'toolbar.shape.roundRectangle': '圆角矩形',

  // Zoom controls
  'zoom.in': '放大 — Cmd++',
  'zoom.out': '缩小 — Cmd+-',
  'zoom.fit': '自适应',
  'zoom.100': '缩放至 100%',

  // Themes
  'theme.default': '默认',
  'theme.colorful': '缤纷',
  'theme.soft': '柔和',
  'theme.retro': '复古',
  'theme.dark': '暗夜',
  'theme.starry': '星空',

  // Colors
  'color.none': '主题颜色',
  'color.unknown': '其他颜色',
  'color.default': '黑色',
  'color.white': '白色',
  'color.gray': '灰色',
  'color.deepBlue': '深蓝色',
  'color.red': '红色',
  'color.green': '绿色',
  'color.yellow': '黄色',
  'color.purple': '紫色',
  'color.orange': '橙色',
  'color.pastelPink': '淡粉色',
  'color.cyan': '青色',
  'color.brown': '棕色',
  'color.forestGreen': '森绿色',
  'color.lightGray': '浅灰色',

  // General
  'general.undo': '撤销',
  'general.redo': '重做',
  'general.menu': '应用菜单',
  'general.moreOptions': '更多选项',
  'general.duplicate': '重复',
  'general.delete': '删除',

  'general.copyToClipboard': '复制到剪贴板',
  'general.copyToClipboard.svg': 'SVG',
  'general.copyToClipboard.png': 'PNG',
  'general.copyToClipboard.transparent': '透明背景',
  'toast.copyToClipboard.svg': '已将所选项作为 SVG 复制到剪贴板',
  'toast.copyToClipboard.png': '已将所选项作为 PNG 复制到剪贴板',
  'toast.copyToClipboard.mode.transparent': '（透明背景）',

  // Language
  'language.switcher': 'Language',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  'language.vietnamese': 'Tiếng Việt',
  // Menu items
  'menu.open': '打开',
  'menu.saveFile': '保存到当前文件',
  'menu.saveAsFile': '另存为',
  'menu.exportImage': '导出图片',
  'menu.exportImage.svg': 'SVG',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': '清除画布',
  'menu.github': 'GitHub',

  // Dialog translations
  'dialog.mermaid.title': 'Mermaid 转 Drawnix',
  'dialog.mermaid.description': '目前仅支持',
  'dialog.mermaid.flowchart': '流程图',
  'dialog.mermaid.sequence': '序列图',
  'dialog.mermaid.class': '类图',
  'dialog.mermaid.otherTypes': '。其他类型在 Drawnix 中将以图片呈现。',
  'dialog.mermaid.syntax': 'Mermaid 语法',
  'dialog.mermaid.placeholder': '在此处编写 Mermaid 图表定义…',
  'dialog.mermaid.preview': '预览',
  'dialog.mermaid.insert': '插入',
  'dialog.markdown.description': '支持 Markdown 语法自动转换为思维导图。',
  'dialog.markdown.syntax': 'Markdown 语法',
  'dialog.markdown.placeholder': '在此处编写 Markdown 文本定义…',
  'dialog.markdown.preview': '预览',
  'dialog.markdown.insert': '插入',
  'dialog.error.loadMermaid': '加载 Mermaid 库失败',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid 到 Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown 到 Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': '清除画布',
  'cleanConfirm.description': '这将会清除整个画布。你是否要继续?',
  'cleanConfirm.cancel': '取消',
  'cleanConfirm.ok': '确认',

  // Link popup items
  'popupLink.delLink': '移除连结',

  // Tool popup items
  'popupToolbar.fillColor': '填充颜色',
  'popupToolbar.fontSize': '字号',
  'popupToolbar.fontColor': '字体颜色',
  'popupToolbar.link': '链接',
  'popupToolbar.stroke': '边框',
  'popupToolbar.opacity': '不透明度',

  // Text placeholders
  'textPlaceholders.link': '链接',
  'textPlaceholders.text': '文本',

  // Line tool
  'line.source': '起点',
  'line.target': '终点',
  'line.arrow': '箭头',
  'line.none': '无',

  // Stroke style
  'stroke.solid': '实线',
  'stroke.dashed': '虚线',
  'stroke.dotted': '点线',

  // Draw elements text
  'draw.lineText': '文本',
  'draw.geometryText': '文本',

  // Mind map elements text
  'mind.centralText': '中心主题',
  'mind.abstractNodeText': '摘要',

  //markdown example
  'markdown.example': `# 我开始了

  - 让我看看是谁搞出了这个 bug 🕵️ ♂️ 🔍
    - 😯 💣
      - 原来是我 👈 🎯 💘

  - 竟然不可以运行，为什么呢 🚫 ⚙️ ❓
    - 竟然可以运行了，为什么呢？🎢 ✨
      - 🤯 ⚡ ➡️ 🎉

  - 能运行起来的 🐞 🚀
    - 就不要去动它 🛑 ✋
      - 👾 💥 🏹 🎯

  ## 男孩还是女孩 👶 ❓ 🤷 ♂️ ♀️

  ### Hello world 👋 🌍 ✨ 💻

  #### 哇 是个程序员 🤯 ⌨️ 💡 👩 💻`,

  'tutorial.title': 'Drawnix',
  'tutorial.description': 'All-in-one 白板，包含思维导图、流程图、自由画笔等',
  'tutorial.dataDescription': '所有数据被存在你的浏览器本地',
  'tutorial.appToolbar': '导出，语言设置，...',
  'tutorial.creationToolbar': '选择一个工具开始你的创作',
  'tutorial.themeDescription': '在明亮和黑暗主题之间切换',

  'workspace.skipToCanvas': '跳到画布',
  'workspace.brandSubtitle': 'Workspace',
  'workspace.expandSidebar': '展开侧边栏',
  'workspace.collapseSidebar': '收起侧边栏',
  'workspace.newDiagram': '新建图表',
  'workspace.newFolder': '新建文件夹',
  'workspace.searchPlaceholder': '搜索图表或文件夹',
  'workspace.myDiagrams': '我的图表',
  'workspace.trash': '回收站',
  'workspace.openTrash': '打开回收站',
  'workspace.backToTree': '返回图表',
  'workspace.emptyTree': '暂无图表，点击上方按钮开始创建',
  'workspace.emptySearch': '没有匹配的图表或文件夹',
  'workspace.emptyTrash': '回收站是空的',
  'workspace.emptyTrashAction': '清空回收站',
  'workspace.localOnlyTitle': '仅本地保存',
  'workspace.localOnlyHint': '配置 Supabase 后可自动同步',
  'workspace.cloudChecking': '检查加密状态…',
  'workspace.cloudSyncing': '正在加密同步…',
  'workspace.cloudEnabled': '加密云同步已开启',
  'workspace.cloudLocked': '云同步待解锁',
  'workspace.cloudSetupRequired': '尚未开启加密同步',
  'workspace.cloudSignedOutTitle': '加密云同步',
  'workspace.cloudSignedOutHint': '登录后，图表会在浏览器加密再上传',
  'workspace.signInGitHub': '使用 GitHub 登录',
  'workspace.signOut': '退出登录',
  'workspace.unlockCloud': '解锁云同步',
  'workspace.setupEncryption': '开启加密同步',
  'workspace.resizeSidebar': '拖动调整侧边栏宽度',
  'workspace.notSignedIn': '尚未登录云同步',
  'workspace.syncPending': '待同步',
  'workspace.syncSyncing': '同步中',
  'workspace.syncSynced': '已同步',
  'workspace.syncConflict': '冲突',
  'workspace.moveTo': '移动到…',
  'workspace.rename': '重命名',
  'workspace.delete': '删除',
  'workspace.restore': '恢复',
  'workspace.deleteForever': '彻底删除',
  'workspace.newDiagramInFolder': '在此新建图表',
  'workspace.newSubfolder': '新建子文件夹',
  'workspace.diagramActions': '图表操作',
  'workspace.folderActions': '文件夹操作',
  'workspace.expandFolder': '展开 {name}',
  'workspace.collapseFolder': '折叠 {name}',
  'workspace.renameDiagram': '重命名图表',
  'workspace.renameFolder': '重命名文件夹',
  'workspace.createFolderTitle': '新建文件夹',
  'workspace.deleteDiagram': '删除图表',
  'workspace.deleteFolder': '删除文件夹',
  'workspace.folderNotEmptyTitle': '无法删除文件夹',
  'workspace.moveDiagram': '移动图表',
  'workspace.renameHint': '名称会显示在左侧工作区，并随加密云同步一起保存。',
  'workspace.createFolderHint': '文件夹用于整理多张图表。',
  'workspace.deleteHint': '删除后可从其他设备同步消失。此操作会把“{name}”移入回收站。',
  'workspace.folderNotEmptyHint': '请先移动或删除“{name}”内的图表和子文件夹。',
  'workspace.moveHint': '选择图表要放入的文件夹。',
  'workspace.nameLabel': '名称',
  'workspace.folderNameLabel': '文件夹名称',
  'workspace.targetFolder': '目标文件夹',
  'workspace.rootFolder': '根目录',
  'workspace.cancel': '取消',
  'workspace.save': '保存',
  'workspace.create': '创建',
  'workspace.move': '移动',
  'workspace.gotIt': '知道了',
  'workspace.nameRequired': '名称不能为空',
  'workspace.showPassword': '显示密码',
  'workspace.hidePassword': '隐藏密码',
  'workspace.emptyTitle': '开始你的第一张图',
  'workspace.emptyDescription': '图表会先保存在本地，登录后加密同步到云端。',
  'workspace.untitledDiagram': '未命名图表',
  'workspace.defaultFolderName': '新建文件夹',
  'workspace.migratedDiagram': '迁移的图表',
  'workspace.localCopySuffix': '（本地副本）',
  'workspace.conflictTitle': '检测到云端版本冲突',
  'workspace.conflictDescription': '当前图在另一台设备上有更新。',
  'workspace.conflictUseCloud': '使用云端',
  'workspace.conflictUseLocal': '使用本地',
  'workspace.conflictKeepCopy': '本地另存副本',
  'workspace.undoDelete': '“{name}”已移入回收站',
  'workspace.undo': '撤销',
  'workspace.purgeTitle': '彻底删除',
  'workspace.purgeDescription': '“{name}”将从这台设备移除。若已同步，其他设备也会在之后看不到它。',
  'workspace.purge': '彻底删除',
  'workspace.emptyTrashTitle': '清空回收站',
  'workspace.emptyTrashDescription': '回收站中的图表和文件夹将从这台设备移除。',
  'workspace.crypto.saveRecoveryTitle': '保存恢复密钥',
  'workspace.crypto.saveRecoveryDescription':
    '云端数据已经开始使用客户端加密。下面的恢复密钥只显示这一次，建议保存到密码管理器。',
  'workspace.crypto.setupTitle': '开启加密云同步',
  'workspace.crypto.setupDescription':
    '图表内容和名称会在浏览器里使用 AES-256-GCM 加密后再上传。Supabase 只保存密文。',
  'workspace.crypto.unlockTitle': '解锁云同步',
  'workspace.crypto.unlockDescription':
    '这是新设备或本地密钥已经被清除。输入同步密码后，这台设备会记住解密主密钥。',
  'workspace.crypto.recoverTitle': '使用恢复密钥',
  'workspace.crypto.recoverDescription':
    '输入恢复密钥，并设置一个新的同步密码。已有图表不会重新加密，只会重新包裹主密钥。',
  'workspace.crypto.password': '同步密码',
  'workspace.crypto.confirmPassword': '确认同步密码',
  'workspace.crypto.newPassword': '新同步密码',
  'workspace.crypto.confirmNewPassword': '确认新同步密码',
  'workspace.crypto.recoveryKey': '恢复密钥',
  'workspace.crypto.passwordPlaceholder': '至少 8 个字符',
  'workspace.crypto.recoveryPlaceholder': 'drawnix-recovery-v1...',
  'workspace.crypto.warning':
    '同步密码不会上传到服务器。忘记密码且没有恢复密钥时，云端数据无法恢复。',
  'workspace.crypto.setupAction': '开启加密同步',
  'workspace.crypto.setupBusy': '正在设置…',
  'workspace.crypto.unlockAction': '解锁',
  'workspace.crypto.unlockBusy': '正在解锁…',
  'workspace.crypto.recoverAction': '恢复并设置新密码',
  'workspace.crypto.recoverBusy': '正在恢复…',
  'workspace.crypto.copyKey': '复制恢复密钥',
  'workspace.crypto.copied': '已复制',
  'workspace.crypto.savedKey': '我已保存',
  'workspace.crypto.setupLater': '稍后设置，先用本地',
  'workspace.crypto.unlockLater': '稍后解锁，先用本地',
  'workspace.crypto.forgotPassword': '忘记密码？使用恢复密钥',
  'workspace.crypto.backToUnlock': '返回密码解锁',
  'workspace.crypto.passwordMismatch': '两次输入的同步密码不一致',
  'workspace.crypto.setupFailed': '设置加密失败',
  'workspace.crypto.unlockFailed': '解锁失败',
  'workspace.crypto.recoverFailed': '恢复失败',
  'workspace.crypto.copyFailed': '复制失败，请手动选中恢复密钥',
  'workspace.crypto.initFailed': '无法读取加密设置，请稍后重试',
  'workspace.crypto.passwordTooShort': '同步密码至少需要 8 个字符',
  'workspace.crypto.notSetup': '当前账号还没有设置同步加密',
  'workspace.crypto.wrongPassword': '同步密码不正确',
  'workspace.crypto.wrongRecovery': '恢复密钥不正确',
  'workspace.crypto.newPasswordTooShort': '新的同步密码至少需要 8 个字符',
  'workspace.crypto.genericFailed': '操作失败，请稍后重试',
};

export default zhTranslations;
