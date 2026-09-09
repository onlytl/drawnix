import { Translations } from '../types';

const enTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': 'Hand — H',
  'toolbar.selection': 'Selection — V',
  'toolbar.mind': 'Mind — M',
  'toolbar.text': 'Text — T',
  'toolbar.arrow': 'Arrow — A',
  'toolbar.shape': 'Shape',
  'toolbar.image': 'Image — Cmd+U',
  'toolbar.extraTools': 'Extra Tools',

  'toolbar.pen': 'Pen — P',
  'toolbar.eraser': 'Eraser — E',

  'toolbar.arrow.straight': 'Straight Arrow Line',
  'toolbar.arrow.elbow': 'Elbow Arrow Line',
  'toolbar.arrow.curve': 'Curve Arrow Line',

  'toolbar.shape.rectangle': 'Rectangle — R',
  'toolbar.shape.ellipse': 'Ellipse — O',
  'toolbar.shape.triangle': 'Triangle',
  'toolbar.shape.terminal': 'Terminal',
  'toolbar.shape.noteCurlyLeft': 'Curly Note — Left',
  'toolbar.shape.noteCurlyRight': 'Curly Note — Right',
  'toolbar.shape.diamond': 'Diamond',
  'toolbar.shape.parallelogram': 'Parallelogram',
  'toolbar.shape.roundRectangle': 'Round Rectangle',

  // Zoom controls
  'zoom.in': 'Zoom In — Cmd++',
  'zoom.out': 'Zoom Out — Cmd+-',
  'zoom.fit': 'Fit to Screen',
  'zoom.100': 'Zoom to 100%',

  // Themes
  'theme.default': 'Default',
  'theme.colorful': 'Colorful',
  'theme.soft': 'Soft',
  'theme.retro': 'Retro',
  'theme.dark': 'Dark',
  'theme.starry': 'Starry',

  // Colors
  'color.none': 'Topic Color',
  'color.unknown': 'Other Color',
  'color.default': 'Basic Black',
  'color.white': 'White',
  'color.gray': 'Grey',
  'color.deepBlue': 'Deep Blue',
  'color.red': 'Red',
  'color.green': 'Green',
  'color.yellow': 'Yellow',
  'color.purple': 'Purple',
  'color.orange': 'Orange',
  'color.pastelPink': 'Paster Pink',
  'color.cyan': 'Cyan',
  'color.brown': 'Brown',
  'color.forestGreen': 'Forest Green',
  'color.lightGray': 'Light Grey',

  // General
  'general.undo': 'Undo',
  'general.redo': 'Redo',
  'general.menu': 'App Menu',
  'general.moreOptions': 'More Options',
  'general.duplicate': 'Duplicate',
  'general.delete': 'Delete',
  'general.copyToClipboard': 'Copy to Clipboard',
  'general.copyToClipboard.svg': 'SVG',
  'general.copyToClipboard.png': 'PNG',
  'general.copyToClipboard.transparent': 'Transparent',
  'toast.copyToClipboard.svg': 'Copied selected items as SVG to clipboard',
  'toast.copyToClipboard.png': 'Copied selected items as PNG to clipboard',
  'toast.copyToClipboard.mode.transparent': '(Transparent background)',
  // Language
  'language.switcher': 'Language',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  'language.vietnamese': 'Tiếng Việt',
  // Menu items
  'menu.open': 'Open',
  'menu.saveFile': 'Save to current file',
  'menu.saveAsFile': 'Save As',
  'menu.exportImage': 'Export Image',
  'menu.exportImage.svg': 'SVG',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': 'Clear Board',
  'menu.github': 'GitHub',

  // Dialog translations
  'dialog.mermaid.title': 'Mermaid to Drawnix',
  'dialog.mermaid.description': 'Currently supports',
  'dialog.mermaid.flowchart': 'flowcharts',
  'dialog.mermaid.sequence': 'sequence diagrams',
  'dialog.mermaid.class': 'class diagrams',
  'dialog.mermaid.otherTypes': ', and other diagram types (rendered as images).',
  'dialog.mermaid.syntax': 'Mermaid Syntax',
  'dialog.mermaid.placeholder': 'Write your Mermaid chart definition here…',
  'dialog.mermaid.preview': 'Preview',
  'dialog.mermaid.insert': 'Insert',
  'dialog.markdown.description': 'Supports automatic conversion of Markdown syntax to mind map.',
  'dialog.markdown.syntax': 'Markdown Syntax',
  'dialog.markdown.placeholder': 'Write your Markdown text definition here...',
  'dialog.markdown.preview': 'Preview',
  'dialog.markdown.insert': 'Insert',
  'dialog.error.loadMermaid': 'Failed to load Mermaid library',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid to Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown to Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': 'Clear Board',
  'cleanConfirm.description': 'This will clear the entire board. Do you want to continue?',
  'cleanConfirm.cancel': 'Cancel',
  'cleanConfirm.ok': 'OK',

  // Link popup items
  'popupLink.delLink': 'Delete Link',

  // Tool popup items
  'popupToolbar.fillColor': 'Fill Color',
  'popupToolbar.fontSize': 'Font Size',
  'popupToolbar.fontColor': 'Font Color',
  'popupToolbar.link': 'Insert Link',
  'popupToolbar.stroke': 'Stroke',
  'popupToolbar.opacity': 'Opacity',

  // Text placeholders
  'textPlaceholders.link': 'Link',
  'textPlaceholders.text': 'Text',

  // Line tool
  'line.source': 'Start',
  'line.target': 'End',
  'line.arrow': 'Arrow',
  'line.none': 'None',

  // Stroke style
  'stroke.solid': 'Solid',
  'stroke.dashed': 'Dashed',
  'stroke.dotted': 'Dotted',

  //markdown example
  'markdown.example': `# I have started

  - Let me see who made this bug 🕵️ ♂️ 🔍
    - 😯 💣
      - Turns out it was me 👈 🎯 💘

  - Unexpectedly, it cannot run; why is that 🚫 ⚙️ ❓
    - Unexpectedly, it can run now; why is that? 🎢 ✨
      - 🤯 ⚡ ➡️ 🎉

  - What can run 🐞 🚀
    - then do not touch it 🛑 ✋
      - 👾 💥 🏹 🎯

  ## Boy or girl 👶 ❓ 🤷 ♂️ ♀️

  ### Hello world 👋 🌍 ✨ 💻

  #### Wow, a programmer 🤯 ⌨️ 💡 👩 💻`,

  // Draw elements text
  'draw.lineText': 'Text',
  'draw.geometryText': 'Text',

  // Mind map elements text
  'mind.centralText': 'Central Topic',
  'mind.abstractNodeText': 'Summary',

  'tutorial.title': 'Drawnix',
  'tutorial.description':
    'All-in-one whiteboard, including mind maps, flowcharts, free drawing, and more',
  'tutorial.dataDescription': 'All data is stored locally in your browser',
  'tutorial.appToolbar': 'Export, language settings, ...',
  'tutorial.creationToolbar': 'Select a tool to start your creation',
  'tutorial.themeDescription': 'Switch between light and dark themes',

  'workspace.skipToCanvas': 'Skip to canvas',
  'workspace.brandSubtitle': 'Workspace',
  'workspace.expandSidebar': 'Expand sidebar',
  'workspace.collapseSidebar': 'Collapse sidebar',
  'workspace.newDiagram': 'New diagram',
  'workspace.newFolder': 'New folder',
  'workspace.searchPlaceholder': 'Search diagrams or folders',
  'workspace.myDiagrams': 'My diagrams',
  'workspace.trash': 'Trash',
  'workspace.openTrash': 'Open trash',
  'workspace.backToTree': 'Back to diagrams',
  'workspace.emptyTree': 'No diagrams yet. Create one to get started.',
  'workspace.emptySearch': 'No matching diagrams or folders',
  'workspace.emptyTrash': 'Trash is empty',
  'workspace.emptyTrashAction': 'Empty trash',
  'workspace.localOnlyTitle': 'Saved locally only',
  'workspace.localOnlyHint': 'Configure Supabase to sync automatically',
  'workspace.cloudChecking': 'Checking encryption…',
  'workspace.cloudSyncing': 'Encrypting and syncing…',
  'workspace.cloudEnabled': 'Encrypted cloud sync is on',
  'workspace.cloudLocked': 'Cloud sync is locked',
  'workspace.cloudSetupRequired': 'Encrypted sync is not set up yet',
  'workspace.cloudSignedOutTitle': 'Encrypted cloud sync',
  'workspace.cloudSignedOutHint': 'After sign-in, diagrams are encrypted in the browser before upload',
  'workspace.signInGitHub': 'Continue with GitHub',
  'workspace.signOut': 'Sign out',
  'workspace.unlockCloud': 'Unlock cloud sync',
  'workspace.setupEncryption': 'Turn on encrypted sync',
  'workspace.resizeSidebar': 'Drag to resize sidebar',
  'workspace.notSignedIn': 'Not signed in to cloud sync',
  'workspace.syncPending': 'Pending',
  'workspace.syncSyncing': 'Syncing',
  'workspace.syncSynced': 'Synced',
  'workspace.syncConflict': 'Conflict',
  'workspace.moveTo': 'Move to…',
  'workspace.rename': 'Rename',
  'workspace.delete': 'Delete',
  'workspace.restore': 'Restore',
  'workspace.deleteForever': 'Delete forever',
  'workspace.newDiagramInFolder': 'New diagram here',
  'workspace.newSubfolder': 'New subfolder',
  'workspace.diagramActions': 'Diagram actions',
  'workspace.folderActions': 'Folder actions',
  'workspace.expandFolder': 'Expand {name}',
  'workspace.collapseFolder': 'Collapse {name}',
  'workspace.renameDiagram': 'Rename diagram',
  'workspace.renameFolder': 'Rename folder',
  'workspace.createFolderTitle': 'New folder',
  'workspace.deleteDiagram': 'Delete diagram',
  'workspace.deleteFolder': 'Delete folder',
  'workspace.folderNotEmptyTitle': 'Folder is not empty',
  'workspace.moveDiagram': 'Move diagram',
  'workspace.renameHint': 'The name appears in the sidebar and syncs with your encrypted cloud data.',
  'workspace.createFolderHint': 'Folders help you organize multiple diagrams.',
  'workspace.deleteHint': 'This moves “{name}” to Trash and will sync the deletion to your other devices.',
  'workspace.folderNotEmptyHint': 'Move or delete the diagrams and subfolders inside “{name}” first.',
  'workspace.moveHint': 'Choose a folder for this diagram.',
  'workspace.nameLabel': 'Name',
  'workspace.folderNameLabel': 'Folder name',
  'workspace.targetFolder': 'Destination folder',
  'workspace.rootFolder': 'Root',
  'workspace.cancel': 'Cancel',
  'workspace.save': 'Save',
  'workspace.create': 'Create',
  'workspace.move': 'Move',
  'workspace.gotIt': 'OK',
  'workspace.nameRequired': 'Name cannot be empty',
  'workspace.showPassword': 'Show password',
  'workspace.hidePassword': 'Hide password',
  'workspace.emptyTitle': 'Create your first diagram',
  'workspace.emptyDescription': 'Diagrams are saved locally first, then encrypted and synced after you sign in.',
  'workspace.untitledDiagram': 'Untitled diagram',
  'workspace.defaultFolderName': 'New folder',
  'workspace.migratedDiagram': 'Migrated diagram',
  'workspace.localCopySuffix': ' (local copy)',
  'workspace.conflictTitle': 'Cloud version conflict',
  'workspace.conflictDescription': 'This diagram was updated on another device.',
  'workspace.conflictUseCloud': 'Use cloud',
  'workspace.conflictUseLocal': 'Use local',
  'workspace.conflictKeepCopy': 'Keep local as a copy',
  'workspace.undoDelete': '“{name}” was moved to Trash',
  'workspace.undo': 'Undo',
  'workspace.purgeTitle': 'Delete forever',
  'workspace.purgeDescription': '“{name}” will be removed from this device. If it has already synced, other devices will stop seeing it too.',
  'workspace.purge': 'Delete forever',
  'workspace.emptyTrashTitle': 'Empty trash',
  'workspace.emptyTrashDescription': 'Diagrams and folders in Trash will be removed from this device.',
  'workspace.crypto.saveRecoveryTitle': 'Save your recovery key',
  'workspace.crypto.saveRecoveryDescription':
    'Cloud data is now encrypted on this device. This recovery key is shown only once — save it in a password manager.',
  'workspace.crypto.setupTitle': 'Turn on encrypted cloud sync',
  'workspace.crypto.setupDescription':
    'Diagram names and contents are encrypted in the browser with AES-256-GCM before upload. Supabase only stores ciphertext.',
  'workspace.crypto.unlockTitle': 'Unlock cloud sync',
  'workspace.crypto.unlockDescription':
    'This is a new device, or the local key was cleared. Enter your sync password to remember the master key on this device.',
  'workspace.crypto.recoverTitle': 'Use recovery key',
  'workspace.crypto.recoverDescription':
    'Enter the recovery key and choose a new sync password. Existing diagrams are not re-encrypted; only the wrapped master key changes.',
  'workspace.crypto.password': 'Sync password',
  'workspace.crypto.confirmPassword': 'Confirm sync password',
  'workspace.crypto.newPassword': 'New sync password',
  'workspace.crypto.confirmNewPassword': 'Confirm new sync password',
  'workspace.crypto.recoveryKey': 'Recovery key',
  'workspace.crypto.passwordPlaceholder': 'At least 8 characters',
  'workspace.crypto.recoveryPlaceholder': 'drawnix-recovery-v1...',
  'workspace.crypto.warning':
    'The sync password is never uploaded. If you forget it and lose the recovery key, cloud data cannot be recovered.',
  'workspace.crypto.setupAction': 'Turn on encrypted sync',
  'workspace.crypto.setupBusy': 'Setting up…',
  'workspace.crypto.unlockAction': 'Unlock',
  'workspace.crypto.unlockBusy': 'Unlocking…',
  'workspace.crypto.recoverAction': 'Recover and set new password',
  'workspace.crypto.recoverBusy': 'Recovering…',
  'workspace.crypto.copyKey': 'Copy recovery key',
  'workspace.crypto.copied': 'Copied',
  'workspace.crypto.savedKey': 'I have saved it',
  'workspace.crypto.setupLater': 'Set up later, stay local',
  'workspace.crypto.unlockLater': 'Unlock later, stay local',
  'workspace.crypto.forgotPassword': 'Forgot password? Use recovery key',
  'workspace.crypto.backToUnlock': 'Back to password unlock',
  'workspace.crypto.passwordMismatch': 'The two passwords do not match',
  'workspace.crypto.setupFailed': 'Could not set up encryption',
  'workspace.crypto.unlockFailed': 'Could not unlock',
  'workspace.crypto.recoverFailed': 'Could not recover',
  'workspace.crypto.copyFailed': 'Could not copy. Select the recovery key manually.',
  'workspace.crypto.initFailed': 'Could not read encryption settings. Try again later.',
  'workspace.crypto.passwordTooShort': 'Sync password must be at least 8 characters',
  'workspace.crypto.notSetup': 'This account has not set up sync encryption yet',
  'workspace.crypto.wrongPassword': 'Incorrect sync password',
  'workspace.crypto.wrongRecovery': 'Incorrect recovery key',
  'workspace.crypto.newPasswordTooShort': 'The new sync password must be at least 8 characters',
  'workspace.crypto.genericFailed': 'Something went wrong. Try again later.',
};

export default enTranslations;
