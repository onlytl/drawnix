import { ReactNode } from 'react';

// Define supported languages
export type Language = 'zh' | 'en' | 'ru' | 'ar' | 'vi';

// Define translation keys and their corresponding values
export interface Translations {
  // Toolbar items
  'toolbar.hand': string;
  'toolbar.selection': string;
  'toolbar.mind': string;
  'toolbar.text': string;
  'toolbar.arrow': string;
  'toolbar.shape': string;
  'toolbar.image': string;
  'toolbar.extraTools': string;

  'toolbar.pen': string;
  'toolbar.eraser': string;

  'toolbar.arrow.straight': string;
  'toolbar.arrow.elbow': string;
  'toolbar.arrow.curve': string;

  'toolbar.shape.rectangle': string;
  'toolbar.shape.ellipse': string;
  'toolbar.shape.triangle': string;
  'toolbar.shape.terminal': string;
  'toolbar.shape.noteCurlyLeft': string;
  'toolbar.shape.noteCurlyRight': string;
  'toolbar.shape.diamond': string;
  'toolbar.shape.parallelogram': string;
  'toolbar.shape.roundRectangle': string;

  // Zoom controls
  'zoom.in': string;
  'zoom.out': string;
  'zoom.fit': string;
  'zoom.100': string;

  // Themes
  'theme.default': string;
  'theme.colorful': string;
  'theme.soft': string;
  'theme.retro': string;
  'theme.dark': string;
  'theme.starry': string;

  // Colors
  'color.none': string;
  'color.unknown': string;
  'color.default': string;
  'color.white': string;
  'color.gray': string;
  'color.deepBlue': string;
  'color.red': string;
  'color.green': string;
  'color.yellow': string;
  'color.purple': string;
  'color.orange': string;
  'color.pastelPink': string;
  'color.cyan': string;
  'color.brown': string;
  'color.forestGreen': string;
  'color.lightGray': string;

  // General
  'general.undo': string;
  'general.redo': string;
  'general.menu': string;
  'general.moreOptions': string;
  'general.duplicate': string;
  'general.delete': string;
  'general.copyToClipboard': string;
  'general.copyToClipboard.svg': string;
  'general.copyToClipboard.png': string;
  'general.copyToClipboard.transparent': string;
  'toast.copyToClipboard.svg': string;
  'toast.copyToClipboard.png': string;
  'toast.copyToClipboard.mode.transparent': string;

  // Language
  'language.switcher': string;
  'language.chinese': string;
  'language.english': string;
  'language.russian': string;
  'language.arabic': string;
  'language.vietnamese': string;

  // Menu items
  'menu.open': string;
  'menu.saveFile': string;
  'menu.saveAsFile': string;
  'menu.exportImage': string;
  'menu.exportImage.svg': string;
  'menu.exportImage.png': string;
  'menu.exportImage.jpg': string;
  'menu.cleanBoard': string;
  'menu.github': string;

  // Dialog translations
  'dialog.mermaid.title': string;
  'dialog.mermaid.description': string;
  'dialog.mermaid.flowchart': string;
  'dialog.mermaid.sequence': string;
  'dialog.mermaid.class': string;
  'dialog.mermaid.otherTypes': string;
  'dialog.mermaid.syntax': string;
  'dialog.mermaid.placeholder': string;
  'dialog.mermaid.preview': string;
  'dialog.mermaid.insert': string;
  'dialog.markdown.description': string;
  'dialog.markdown.syntax': string;
  'dialog.markdown.placeholder': string;
  'dialog.markdown.preview': string;
  'dialog.markdown.insert': string;
  'dialog.error.loadMermaid': string;

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': string;
  'extraTools.markdownToDrawnix': string;

  // Clean confirm dialog
  'cleanConfirm.title': string;
  'cleanConfirm.description': string;
  'cleanConfirm.cancel': string;
  'cleanConfirm.ok': string;

  // Link popup items
  'popupLink.delLink': string;

  // Tool popup items
  'popupToolbar.fillColor': string;
  'popupToolbar.fontSize': string;
  'popupToolbar.fontColor': string;
  'popupToolbar.link': string;
  'popupToolbar.stroke': string;
  'popupToolbar.opacity': string;

  // Text placeholders
  'textPlaceholders.link': string;
  'textPlaceholders.text': string;

  // Line tool
  'line.source': string;
  'line.target': string;
  'line.arrow': string;
  'line.none': string;

  // Stroke style
  'stroke.solid': string;
  'stroke.dashed': string;
  'stroke.dotted': string;

  //markdown example
  'markdown.example': string;

  // Draw elements text
  'draw.lineText': string;
  'draw.geometryText': string;

  // Mind map elements text
  'mind.centralText': string;
  'mind.abstractNodeText': string;

  'tutorial.title': string;
  'tutorial.description': string;
  'tutorial.dataDescription': string;
  'tutorial.appToolbar': string;
  'tutorial.creationToolbar': string;
  'tutorial.themeDescription': string;

  'workspace.skipToCanvas': string;
  'workspace.brandSubtitle': string;
  'workspace.expandSidebar': string;
  'workspace.collapseSidebar': string;
  'workspace.newDiagram': string;
  'workspace.newFolder': string;
  'workspace.searchPlaceholder': string;
  'workspace.myDiagrams': string;
  'workspace.trash': string;
  'workspace.openTrash': string;
  'workspace.backToTree': string;
  'workspace.emptyTree': string;
  'workspace.emptySearch': string;
  'workspace.emptyTrash': string;
  'workspace.emptyTrashAction': string;
  'workspace.localOnlyTitle': string;
  'workspace.localOnlyHint': string;
  'workspace.cloudChecking': string;
  'workspace.cloudSyncing': string;
  'workspace.cloudEnabled': string;
  'workspace.cloudLocked': string;
  'workspace.cloudSetupRequired': string;
  'workspace.cloudSignedOutTitle': string;
  'workspace.cloudSignedOutHint': string;
  'workspace.signInGitHub': string;
  'workspace.signOut': string;
  'workspace.unlockCloud': string;
  'workspace.setupEncryption': string;
  'workspace.resizeSidebar': string;
  'workspace.notSignedIn': string;
  'workspace.syncPending': string;
  'workspace.syncSyncing': string;
  'workspace.syncSynced': string;
  'workspace.syncConflict': string;
  'workspace.moveTo': string;
  'workspace.rename': string;
  'workspace.delete': string;
  'workspace.restore': string;
  'workspace.deleteForever': string;
  'workspace.newDiagramInFolder': string;
  'workspace.newSubfolder': string;
  'workspace.diagramActions': string;
  'workspace.folderActions': string;
  'workspace.expandFolder': string;
  'workspace.collapseFolder': string;
  'workspace.renameDiagram': string;
  'workspace.renameFolder': string;
  'workspace.createFolderTitle': string;
  'workspace.deleteDiagram': string;
  'workspace.deleteFolder': string;
  'workspace.folderNotEmptyTitle': string;
  'workspace.moveDiagram': string;
  'workspace.renameHint': string;
  'workspace.createFolderHint': string;
  'workspace.deleteHint': string;
  'workspace.folderNotEmptyHint': string;
  'workspace.moveHint': string;
  'workspace.nameLabel': string;
  'workspace.folderNameLabel': string;
  'workspace.targetFolder': string;
  'workspace.rootFolder': string;
  'workspace.cancel': string;
  'workspace.save': string;
  'workspace.create': string;
  'workspace.move': string;
  'workspace.gotIt': string;
  'workspace.nameRequired': string;
  'workspace.showPassword': string;
  'workspace.hidePassword': string;
  'workspace.emptyTitle': string;
  'workspace.emptyDescription': string;
  'workspace.untitledDiagram': string;
  'workspace.defaultFolderName': string;
  'workspace.migratedDiagram': string;
  'workspace.localCopySuffix': string;
  'workspace.conflictTitle': string;
  'workspace.conflictDescription': string;
  'workspace.conflictUseCloud': string;
  'workspace.conflictUseLocal': string;
  'workspace.conflictKeepCopy': string;
  'workspace.undoDelete': string;
  'workspace.undo': string;
  'workspace.purgeTitle': string;
  'workspace.purgeDescription': string;
  'workspace.purge': string;
  'workspace.emptyTrashTitle': string;
  'workspace.emptyTrashDescription': string;
  'workspace.crypto.saveRecoveryTitle': string;
  'workspace.crypto.saveRecoveryDescription': string;
  'workspace.crypto.setupTitle': string;
  'workspace.crypto.setupDescription': string;
  'workspace.crypto.unlockTitle': string;
  'workspace.crypto.unlockDescription': string;
  'workspace.crypto.recoverTitle': string;
  'workspace.crypto.recoverDescription': string;
  'workspace.crypto.password': string;
  'workspace.crypto.confirmPassword': string;
  'workspace.crypto.newPassword': string;
  'workspace.crypto.confirmNewPassword': string;
  'workspace.crypto.recoveryKey': string;
  'workspace.crypto.passwordPlaceholder': string;
  'workspace.crypto.recoveryPlaceholder': string;
  'workspace.crypto.warning': string;
  'workspace.crypto.setupAction': string;
  'workspace.crypto.setupBusy': string;
  'workspace.crypto.unlockAction': string;
  'workspace.crypto.unlockBusy': string;
  'workspace.crypto.recoverAction': string;
  'workspace.crypto.recoverBusy': string;
  'workspace.crypto.copyKey': string;
  'workspace.crypto.copied': string;
  'workspace.crypto.savedKey': string;
  'workspace.crypto.setupLater': string;
  'workspace.crypto.unlockLater': string;
  'workspace.crypto.forgotPassword': string;
  'workspace.crypto.backToUnlock': string;
  'workspace.crypto.passwordMismatch': string;
  'workspace.crypto.setupFailed': string;
  'workspace.crypto.unlockFailed': string;
  'workspace.crypto.recoverFailed': string;
  'workspace.crypto.copyFailed': string;
  'workspace.crypto.initFailed': string;
  'workspace.crypto.passwordTooShort': string;
  'workspace.crypto.notSetup': string;
  'workspace.crypto.wrongPassword': string;
  'workspace.crypto.wrongRecovery': string;
  'workspace.crypto.newPasswordTooShort': string;
  'workspace.crypto.genericFailed': string;
}

export type TranslationVars = Record<string, string | number>;

// I18n context interface
export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations, vars?: TranslationVars) => string;
}

// Provider props
export interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  initialLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
}
