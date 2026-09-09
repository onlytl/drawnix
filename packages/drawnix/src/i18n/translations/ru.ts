import { Translations } from '../types';

const ruTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': 'Рука — H',
  'toolbar.selection': 'Выделение — V',
  'toolbar.mind': 'Mind-карта — M',
  'toolbar.text': 'Текст — T',
  'toolbar.arrow': 'Стрелка — A',
  'toolbar.shape': 'Фигуры',
  'toolbar.image': 'Изображение — Cmd+U',
  'toolbar.extraTools': 'Дополнительно',

  'toolbar.pen': 'Карандаш — P',
  'toolbar.eraser': 'Ластик — E',

  'toolbar.arrow.straight': 'Прямая стрелка',
  'toolbar.arrow.elbow': 'Ломаная стрелка',
  'toolbar.arrow.curve': 'Кривая стрелка',

  'toolbar.shape.rectangle': 'Прямоугольник — R',
  'toolbar.shape.ellipse': 'Эллипс — O',
  'toolbar.shape.triangle': 'Треугольник',
  'toolbar.shape.terminal': 'Останов',
  'toolbar.shape.noteCurlyLeft': 'Фигурная заметка — слева',
  'toolbar.shape.noteCurlyRight': 'Фигурная заметка — справа',
  'toolbar.shape.diamond': 'Ромб',
  'toolbar.shape.parallelogram': 'Параллелограмм',
  'toolbar.shape.roundRectangle': 'Скруглённый прямоугольник',

  // Zoom controls
  'zoom.in': 'Увеличить — Cmd++',
  'zoom.out': 'Уменьшить — Cmd+-',
  'zoom.fit': 'По размеру экрана',
  'zoom.100': 'Сбросить к 100%',

  // Themes
  'theme.default': 'Стандартная',
  'theme.colorful': 'Красочная',
  'theme.soft': 'Мягкая',
  'theme.retro': 'Старинная',
  'theme.dark': 'Тёмная',
  'theme.starry': 'Звёздная',

  // Colors
  'color.none': 'Автоматически',
  'color.unknown': 'Другой цвет',
  'color.default': 'Чёрный',
  'color.white': 'Белый',
  'color.gray': 'Серый',
  'color.deepBlue': 'Голубой',
  'color.red': 'Красный',
  'color.green': 'Зелёный',
  'color.yellow': 'Жёлтый',
  'color.purple': 'Фиолетовый',
  'color.orange': 'Оранжевый',
  'color.pastelPink': 'Розовый',
  'color.cyan': 'Лиловый',
  'color.brown': 'Коричневый',
  'color.forestGreen': 'Сосновный',
  'color.lightGray': 'Светло-серый',

  // General
  'general.undo': 'Отменить',
  'general.redo': 'Вернуть',
  'general.menu': 'Меню приложения',
  'general.moreOptions': 'Дополнительно',
  'general.duplicate': 'Дублировать',
  'general.delete': 'Удалить',

  'general.copyToClipboard': 'Копировать в буфер обмена',
  'general.copyToClipboard.svg': 'SVG',
  'general.copyToClipboard.png': 'PNG',
  'general.copyToClipboard.transparent': 'Прозрачный фон',
  'toast.copyToClipboard.svg': 'Выбранные элементы скопированы в буфер обмена как SVG',
  'toast.copyToClipboard.png': 'Выбранные элементы скопированы в буфер обмена как PNG',
  'toast.copyToClipboard.mode.transparent': '(Прозрачный фон)',
  // Language
  'language.switcher': 'Language',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  'language.vietnamese': 'Tiếng Việt',

  // Menu items
  'menu.open': 'Открыть',
  'menu.saveFile': 'Сохранить в текущий файл',
  'menu.saveAsFile': 'Сохранить как',
  'menu.exportImage': 'Экспортировать',
  'menu.exportImage.svg': 'SVG',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': 'Очистить доску',
  'menu.github': 'GitHub',

  // Dialog translations
  'dialog.mermaid.title': 'Mermaid в Drawnix',
  'dialog.mermaid.description': 'Поддерживаются',
  'dialog.mermaid.flowchart': 'блок-схемы',
  'dialog.mermaid.sequence': 'диаграммы последовательностей',
  'dialog.mermaid.class': 'диаграммы классов',
  'dialog.mermaid.otherTypes': ' и другие диаграммы (преобразуются в изображения).',
  'dialog.mermaid.syntax': 'Синтаксис Mermaid',
  'dialog.mermaid.placeholder': 'Введите сюда описание вашей Mermaid-диаграммы…',
  'dialog.mermaid.preview': 'Предпросмотр',
  'dialog.mermaid.insert': 'Вставить',
  'dialog.markdown.description':
    'Поддерживается автоматическое преобразование синтаксиса Markdown в mind-карты.',
  'dialog.markdown.syntax': 'Синтаксис Markdown',
  'dialog.markdown.placeholder': 'Введите сюда описание вашего текста Markdown…',
  'dialog.markdown.preview': 'Предпросмотр',
  'dialog.markdown.insert': 'Вставить',
  'dialog.error.loadMermaid': 'Не удалось загрузить библотеку Mermaid',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid в Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown в Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': 'Очистить доску',
  'cleanConfirm.description': 'Это удалит всё содержимое доски. Вы хотите продолжить?',
  'cleanConfirm.cancel': 'Отмена',
  'cleanConfirm.ok': 'ОК',

  // Link popup items
  'popupLink.delLink': 'Удалить ссылку',

  // Tool popup items
  'popupToolbar.fillColor': 'Цвет заливки',
  'popupToolbar.fontSize': 'Размер шрифта',
  'popupToolbar.fontColor': 'Цвет текста',
  'popupToolbar.link': 'Вставить ссылку',
  'popupToolbar.stroke': 'Контур',
  'popupToolbar.opacity': 'Прозрачность',

  // Text placeholders
  'textPlaceholders.link': 'Ссылка',
  'textPlaceholders.text': 'Текст',

  // Line tool
  'line.source': 'Начало',
  'line.target': 'Конец',
  'line.arrow': 'Стрелка',
  'line.none': 'Нет',

  // Stroke style
  'stroke.solid': 'Сплошной',
  'stroke.dashed': 'Штриховой',
  'stroke.dotted': 'Пунктирный',

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
  'draw.lineText': 'Текст',
  'draw.geometryText': 'Текст',

  // Mind map elements text
  'mind.centralText': 'Центральная тема',
  'mind.abstractNodeText': 'Резюме',

  'tutorial.title': 'Drawnix',
  'tutorial.description':
    'Универсальная доска: майнд-карты, блок-схемы, свободное рисование и многое другое',
  'tutorial.dataDescription': 'Все данные хранятся локально в вашем браузере',
  'tutorial.appToolbar': 'Экспорт, настройки языка, ...',
  'tutorial.creationToolbar': 'Выберите инструмент, чтобы начать творить',
  'tutorial.themeDescription': 'Переключение между светлой и тёмной темами',

  'workspace.skipToCanvas': 'Перейти к холсту',
  'workspace.brandSubtitle': 'Workspace',
  'workspace.expandSidebar': 'Развернуть боковую панель',
  'workspace.collapseSidebar': 'Свернуть боковую панель',
  'workspace.newDiagram': 'Новая схема',
  'workspace.newFolder': 'Новая папка',
  'workspace.searchPlaceholder': 'Поиск схем и папок',
  'workspace.myDiagrams': 'Мои схемы',
  'workspace.trash': 'Корзина',
  'workspace.openTrash': 'Открыть корзину',
  'workspace.backToTree': 'К схемам',
  'workspace.emptyTree': 'Схем пока нет. Создайте первую.',
  'workspace.emptySearch': 'Ничего не найдено',
  'workspace.emptyTrash': 'Корзина пуста',
  'workspace.emptyTrashAction': 'Очистить корзину',
  'workspace.localOnlyTitle': 'Только локально',
  'workspace.localOnlyHint': 'Настройте Supabase для автоматической синхронизации',
  'workspace.cloudChecking': 'Проверка шифрования…',
  'workspace.cloudSyncing': 'Шифрование и синхронизация…',
  'workspace.cloudEnabled': 'Зашифрованная синхронизация включена',
  'workspace.cloudLocked': 'Облако заблокировано',
  'workspace.cloudSetupRequired': 'Шифрование ещё не настроено',
  'workspace.cloudSignedOutTitle': 'Зашифрованная синхронизация',
  'workspace.cloudSignedOutHint': 'После входа схемы шифруются в браузере перед загрузкой',
  'workspace.signInGitHub': 'Войти через GitHub',
  'workspace.signOut': 'Выйти',
  'workspace.unlockCloud': 'Разблокировать облако',
  'workspace.setupEncryption': 'Включить шифрование',
  'workspace.resizeSidebar': 'Перетащите, чтобы изменить ширину',
  'workspace.notSignedIn': 'Вход в облако не выполнен',
  'workspace.syncPending': 'Ожидает',
  'workspace.syncSyncing': 'Синхронизация',
  'workspace.syncSynced': 'Синхронизировано',
  'workspace.syncConflict': 'Конфликт',
  'workspace.moveTo': 'Переместить в…',
  'workspace.rename': 'Переименовать',
  'workspace.delete': 'Удалить',
  'workspace.restore': 'Восстановить',
  'workspace.deleteForever': 'Удалить навсегда',
  'workspace.newDiagramInFolder': 'Новая схема здесь',
  'workspace.newSubfolder': 'Новая вложенная папка',
  'workspace.diagramActions': 'Действия со схемой',
  'workspace.folderActions': 'Действия с папкой',
  'workspace.expandFolder': 'Развернуть {name}',
  'workspace.collapseFolder': 'Свернуть {name}',
  'workspace.renameDiagram': 'Переименовать схему',
  'workspace.renameFolder': 'Переименовать папку',
  'workspace.createFolderTitle': 'Новая папка',
  'workspace.deleteDiagram': 'Удалить схему',
  'workspace.deleteFolder': 'Удалить папку',
  'workspace.folderNotEmptyTitle': 'Папка не пуста',
  'workspace.moveDiagram': 'Переместить схему',
  'workspace.renameHint': 'Имя видно в боковой панели и синхронизируется вместе с зашифрованными данными.',
  'workspace.createFolderHint': 'Папки помогают организовать несколько схем.',
  'workspace.deleteHint': '«{name}» будет перемещено в корзину и удаление синхронизируется на другие устройства.',
  'workspace.folderNotEmptyHint': 'Сначала переместите или удалите схемы и вложенные папки в «{name}».',
  'workspace.moveHint': 'Выберите папку для этой схемы.',
  'workspace.nameLabel': 'Имя',
  'workspace.folderNameLabel': 'Имя папки',
  'workspace.targetFolder': 'Папка назначения',
  'workspace.rootFolder': 'Корень',
  'workspace.cancel': 'Отмена',
  'workspace.save': 'Сохранить',
  'workspace.create': 'Создать',
  'workspace.move': 'Переместить',
  'workspace.gotIt': 'Понятно',
  'workspace.nameRequired': 'Имя не может быть пустым',
  'workspace.showPassword': 'Показать пароль',
  'workspace.hidePassword': 'Скрыть пароль',
  'workspace.emptyTitle': 'Создайте первую схему',
  'workspace.emptyDescription': 'Схемы сначала сохраняются локально, а после входа шифруются и синхронизируются.',
  'workspace.untitledDiagram': 'Безымянная схема',
  'workspace.defaultFolderName': 'Новая папка',
  'workspace.migratedDiagram': 'Перенесённая схема',
  'workspace.localCopySuffix': ' (локальная копия)',
  'workspace.conflictTitle': 'Конфликт облачной версии',
  'workspace.conflictDescription': 'Эта схема была обновлена на другом устройстве.',
  'workspace.conflictUseCloud': 'Взять облачную',
  'workspace.conflictUseLocal': 'Взять локальную',
  'workspace.conflictKeepCopy': 'Оставить локальную копию',
  'workspace.undoDelete': '«{name}» перемещено в корзину',
  'workspace.undo': 'Отменить',
  'workspace.purgeTitle': 'Удалить навсегда',
  'workspace.purgeDescription': '«{name}» будет удалено с этого устройства. Если оно уже синхронизировано, другие устройства тоже перестанут его видеть.',
  'workspace.purge': 'Удалить навсегда',
  'workspace.emptyTrashTitle': 'Очистить корзину',
  'workspace.emptyTrashDescription': 'Схемы и папки в корзине будут удалены с этого устройства.',
  'workspace.crypto.saveRecoveryTitle': 'Сохраните ключ восстановления',
  'workspace.crypto.saveRecoveryDescription':
    'Облачные данные теперь шифруются на этом устройстве. Ключ показывается только один раз — сохраните его в менеджере паролей.',
  'workspace.crypto.setupTitle': 'Включить зашифрованную синхронизацию',
  'workspace.crypto.setupDescription':
    'Имена и содержимое схем шифруются в браузере с AES-256-GCM перед загрузкой. Supabase хранит только шифротекст.',
  'workspace.crypto.unlockTitle': 'Разблокировать облако',
  'workspace.crypto.unlockDescription':
    'Это новое устройство или локальный ключ был удалён. Введите пароль синхронизации, чтобы запомнить мастер-ключ.',
  'workspace.crypto.recoverTitle': 'Ключ восстановления',
  'workspace.crypto.recoverDescription':
    'Введите ключ восстановления и задайте новый пароль. Существующие схемы не перешифровываются, меняется только обёртка ключа.',
  'workspace.crypto.password': 'Пароль синхронизации',
  'workspace.crypto.confirmPassword': 'Подтвердите пароль',
  'workspace.crypto.newPassword': 'Новый пароль синхронизации',
  'workspace.crypto.confirmNewPassword': 'Подтвердите новый пароль',
  'workspace.crypto.recoveryKey': 'Ключ восстановления',
  'workspace.crypto.passwordPlaceholder': 'Не менее 8 символов',
  'workspace.crypto.recoveryPlaceholder': 'drawnix-recovery-v1...',
  'workspace.crypto.warning':
    'Пароль никогда не отправляется на сервер. Если вы его забудете и потеряете ключ восстановления, облачные данные нельзя будет восстановить.',
  'workspace.crypto.setupAction': 'Включить шифрование',
  'workspace.crypto.setupBusy': 'Настройка…',
  'workspace.crypto.unlockAction': 'Разблокировать',
  'workspace.crypto.unlockBusy': 'Разблокировка…',
  'workspace.crypto.recoverAction': 'Восстановить и задать пароль',
  'workspace.crypto.recoverBusy': 'Восстановление…',
  'workspace.crypto.copyKey': 'Скопировать ключ',
  'workspace.crypto.copied': 'Скопировано',
  'workspace.crypto.savedKey': 'Я сохранил ключ',
  'workspace.crypto.setupLater': 'Настроить позже, работать локально',
  'workspace.crypto.unlockLater': 'Разблокировать позже, работать локально',
  'workspace.crypto.forgotPassword': 'Забыли пароль? Использовать ключ',
  'workspace.crypto.backToUnlock': 'К разблокировке паролем',
  'workspace.crypto.passwordMismatch': 'Пароли не совпадают',
  'workspace.crypto.setupFailed': 'Не удалось настроить шифрование',
  'workspace.crypto.unlockFailed': 'Не удалось разблокировать',
  'workspace.crypto.recoverFailed': 'Не удалось восстановить',
  'workspace.crypto.copyFailed': 'Не удалось скопировать. Выделите ключ вручную.',
  'workspace.crypto.initFailed': 'Не удалось прочитать настройки шифрования. Попробуйте позже.',
  'workspace.crypto.passwordTooShort': 'Пароль должен содержать не менее 8 символов',
  'workspace.crypto.notSetup': 'Для этого аккаунта шифрование ещё не настроено',
  'workspace.crypto.wrongPassword': 'Неверный пароль синхронизации',
  'workspace.crypto.wrongRecovery': 'Неверный ключ восстановления',
  'workspace.crypto.newPasswordTooShort': 'Новый пароль должен содержать не менее 8 символов',
  'workspace.crypto.genericFailed': 'Что-то пошло не так. Попробуйте позже.',
};

export default ruTranslations;
