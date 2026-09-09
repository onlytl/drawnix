import { Translations } from '../types';

const arTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': 'اليد — H',
  'toolbar.selection': 'التحديد — V',
  'toolbar.mind': 'خريطة ذهنية — M',
  'toolbar.eraser': 'ممحاة — E',
  'toolbar.text': 'نص — T',
  'toolbar.pen': 'قلم — P',
  'toolbar.arrow': 'سهم — A',
  'toolbar.shape': 'أشكال',
  'toolbar.image': 'صورة — Cmd+U',
  'toolbar.extraTools': 'أدوات إضافية',

  'toolbar.arrow.straight': 'سهم مستقيم',
  'toolbar.arrow.elbow': 'سهم بزوايا',
  'toolbar.arrow.curve': 'سهم منحني',

  'toolbar.shape.rectangle': 'مستطيل — R',
  'toolbar.shape.ellipse': 'بيضاوي — O',
  'toolbar.shape.triangle': 'مثلث',
  'toolbar.shape.terminal': 'نهائي',
  'toolbar.shape.noteCurlyLeft': 'ملاحظة معقوفة — يسار',
  'toolbar.shape.noteCurlyRight': 'ملاحظة معقوفة — يمين',
  'toolbar.shape.diamond': 'معين',
  'toolbar.shape.parallelogram': 'متوازي أضلاع',
  'toolbar.shape.roundRectangle': 'مستطيل دائري الحواف',

  // Zoom controls
  'zoom.in': 'تكبير — Cmd++',
  'zoom.out': 'تصغير — Cmd+-',
  'zoom.fit': 'ملاءمة الشاشة',
  'zoom.100': 'تكبير إلى 100%',

  // Themes
  'theme.default': 'افتراضي',
  'theme.colorful': 'ملون',
  'theme.soft': 'ناعم',
  'theme.retro': 'كلاسيكي',
  'theme.dark': 'داكن',
  'theme.starry': 'ليلي',

  // Colors
  'color.none': 'لون الموضوع',
  'color.unknown': 'لون آخر',
  'color.default': 'أسود أساسي',
  'color.white': 'أبيض',
  'color.gray': 'رمادي',
  'color.deepBlue': 'أزرق غامق',
  'color.red': 'أحمر',
  'color.green': 'أخضر',
  'color.yellow': 'أصفر',
  'color.purple': 'بنفسجي',
  'color.orange': 'برتقالي',
  'color.pastelPink': 'وردي فاتح',
  'color.cyan': 'سماوي',
  'color.brown': 'بني',
  'color.forestGreen': 'أخضر غامق (غابة)',
  'color.lightGray': 'رمادي فاتح',

  // General
  'general.undo': 'تراجع',
  'general.redo': 'إعادة',
  'general.menu': 'قائمة التطبيق',
  'general.moreOptions': 'خيارات إضافية',
  'general.duplicate': 'تكرار',
  'general.delete': 'حذف',

  // Language
  'language.switcher': 'اللغة',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  'language.vietnamese': 'Tiếng Việt',
  'general.copyToClipboard': 'نسخ إلى الحافظة',
  'general.copyToClipboard.svg': 'SVG',
  'general.copyToClipboard.png': 'PNG',
  'general.copyToClipboard.transparent': 'خلفية شفافة',
  'toast.copyToClipboard.svg': 'تم نسخ العناصر المحددة كـ SVG إلى الحافظة',
  'toast.copyToClipboard.png': 'تم نسخ العناصر المحددة كـ PNG إلى الحافظة',
  'toast.copyToClipboard.mode.transparent': '(خلفية شفافة)',

  // Menu items
  'menu.open': 'فتح',
  'menu.saveFile': 'حفظ إلى الملف الحالي',
  'menu.saveAsFile': 'حفظ باسم',
  'menu.exportImage': 'تصدير صورة',
  'menu.exportImage.svg': 'SVG',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': 'مسح اللوحة',
  'menu.github': 'غيت هب',

  // Dialog translations
  'dialog.mermaid.title': 'من Mermaid إلى Drawnix',
  'dialog.mermaid.description': 'يدعم حاليًا',
  'dialog.mermaid.flowchart': 'المخططات الانسيابية',
  'dialog.mermaid.sequence': 'مخططات التسلسل',
  'dialog.mermaid.class': 'مخططات الفئات',
  'dialog.mermaid.otherTypes': '، وأنواع أخرى من المخططات (تُعرض كصور).',
  'dialog.mermaid.syntax': 'صيغة Mermaid',
  'dialog.mermaid.placeholder': 'اكتب تعريف المخطط هنا...',
  'dialog.mermaid.preview': 'معاينة',
  'dialog.mermaid.insert': 'إدراج',
  'dialog.markdown.description': 'يدعم التحويل التلقائي من Markdown إلى خريطة ذهنية.',
  'dialog.markdown.syntax': 'صيغة Markdown',
  'dialog.markdown.placeholder': 'اكتب نص Markdown هنا...',
  'dialog.markdown.preview': 'معاينة',
  'dialog.markdown.insert': 'إدراج',
  'dialog.error.loadMermaid': 'فشل في تحميل مكتبة Mermaid',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'من Mermaid إلى Drawnix',
  'extraTools.markdownToDrawnix': 'من Markdown إلى Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': 'مسح اللوحة',
  'cleanConfirm.description': 'سيؤدي هذا إلى مسح اللوحة بالكامل. هل تريد المتابعة؟',
  'cleanConfirm.cancel': 'إلغاء',
  'cleanConfirm.ok': 'موافق',

  // Link popup items
  'popupLink.delLink': 'حذف الرابط',

  // Tool popup items
  'popupToolbar.fillColor': 'لون التعبئة',
  'popupToolbar.fontSize': 'حجم الخط',
  'popupToolbar.fontColor': 'لون الخط',
  'popupToolbar.link': 'إدراج رابط',
  'popupToolbar.stroke': 'الحد',
  'popupToolbar.opacity': 'مستوى شفافية',

  // Text placeholders
  'textPlaceholders.link': 'رابط',
  'textPlaceholders.text': 'نص',

  // Line tool
  'line.source': 'بداية',
  'line.target': 'نهاية',
  'line.arrow': 'سهم',
  'line.none': 'لا شيء',

  // Stroke style
  'stroke.solid': 'صلب',
  'stroke.dashed': 'متقطع',
  'stroke.dotted': 'منقط',

  //markdown example
  //   "markdown.example": "# لقد بدأت\n\n- دعني أرى من تسبب بهذا الخطأ 🕵️ ♂️ 🔍\n  - 😯 💣\n    - اتضح أنه أنا 👈 🎯 💘\n\n- بشكل غير متوقع، لا يعمل؛ لماذا 🚫 ⚙️ ❓\n  - بشكل غير متوقع، أصبح يعمل الآن؛ لماذا؟ 🎢 ✨\n    - 🤯 ⚡ ➡️ 🎉\n\n- ما الذي يمكن تشغيله 🐞 🚀\n  - إذًا لا تلمسه 🛑 ✋\n    - 👾 💥 🏹 🎯\n\n## ولد أم بنت 👶 ❓ 🤷 ♂️ ♀️\n\n### مرحبًا بالعالم 👋 🌍 ✨ 💻\n\n#### واو، مبرمج 🤯 ⌨️ 💡 👩 💻",
  'markdown.example': `# I have started

  - دعني أرى من تسبب بهذا الخطأ  🕵️ ♂️ 🔍
    - 😯 💣
      - اتضح أنه أنا 👈 🎯 💘

  - بشكل غير متوقع، لا يعمل؛ لماذا  🚫 ⚙️ ❓
    - بشكل غير متوقع، أصبح يعمل الآن؛ لماذا؟ 🎢 ✨
      - 🤯 ⚡ ➡️ 🎉

  - ما الذي يمكن تشغيله 🐞 🚀
    - إذًا لا تلمسه 🛑 ✋
      - 👾 💥 🏹 🎯

  ## ولد أم بنت  👶 ❓ 🤷 ♂️ ♀️

  ### Hello world 👋 🌍 ✨ 💻

  #### Wow, a programmer 🤯 ⌨️ 💡 👩 💻`,

  // Draw elements text
  'draw.lineText': 'نص',
  'draw.geometryText': 'نص',

  // Mind map elements text
  'mind.centralText': 'الموضوع المركزي',
  'mind.abstractNodeText': 'ملخص',

  'tutorial.title': 'Drawnix',
  'tutorial.description':
    'سبورة شاملة تتضمن الخرائط الذهنية والمخططات الانسيابية والرسم الحر وغير ذلك',
  'tutorial.dataDescription': 'تُحفظ جميع البيانات محليًا في متصفحك',
  'tutorial.appToolbar': 'تصدير، إعدادات اللغة، ...',
  'tutorial.creationToolbar': 'اختر أداة لبدء الإنشاء',
  'tutorial.themeDescription': 'التبديل بين السمة الفاتحة والداكنة',

  'workspace.skipToCanvas': 'الانتقال إلى اللوحة',
  'workspace.brandSubtitle': 'Workspace',
  'workspace.expandSidebar': 'توسيع الشريط الجانبي',
  'workspace.collapseSidebar': 'طي الشريط الجانبي',
  'workspace.newDiagram': 'مخطط جديد',
  'workspace.newFolder': 'مجلد جديد',
  'workspace.searchPlaceholder': 'البحث في المخططات أو المجلدات',
  'workspace.myDiagrams': 'مخططاتي',
  'workspace.trash': 'سلة المهملات',
  'workspace.openTrash': 'فتح سلة المهملات',
  'workspace.backToTree': 'العودة إلى المخططات',
  'workspace.emptyTree': 'لا توجد مخططات بعد. أنشئ واحدًا للبدء.',
  'workspace.emptySearch': 'لا توجد نتائج مطابقة',
  'workspace.emptyTrash': 'سلة المهملات فارغة',
  'workspace.emptyTrashAction': 'إفراغ سلة المهملات',
  'workspace.localOnlyTitle': 'محفوظ محليًا فقط',
  'workspace.localOnlyHint': 'اضبط Supabase للمزامنة تلقائيًا',
  'workspace.cloudChecking': 'جارٍ التحقق من التشفير…',
  'workspace.cloudSyncing': 'جارٍ التشفير والمزامنة…',
  'workspace.cloudEnabled': 'المزامنة السحابية المشفّرة مفعّلة',
  'workspace.cloudLocked': 'المزامنة السحابية مقفلة',
  'workspace.cloudSetupRequired': 'لم يُعد التشفير بعد',
  'workspace.cloudSignedOutTitle': 'مزامنة سحابية مشفّرة',
  'workspace.cloudSignedOutHint': 'بعد تسجيل الدخول تُشفَّر المخططات في المتصفح قبل الرفع',
  'workspace.signInGitHub': 'المتابعة عبر GitHub',
  'workspace.signOut': 'تسجيل الخروج',
  'workspace.unlockCloud': 'فتح المزامنة السحابية',
  'workspace.setupEncryption': 'تفعيل المزامنة المشفّرة',
  'workspace.resizeSidebar': 'اسحب لتغيير عرض الشريط الجانبي',
  'workspace.notSignedIn': 'لم يتم تسجيل الدخول للمزامنة',
  'workspace.syncPending': 'قيد الانتظار',
  'workspace.syncSyncing': 'جارٍ المزامنة',
  'workspace.syncSynced': 'تمت المزامنة',
  'workspace.syncConflict': 'تعارض',
  'workspace.moveTo': 'نقل إلى…',
  'workspace.rename': 'إعادة تسمية',
  'workspace.delete': 'حذف',
  'workspace.restore': 'استعادة',
  'workspace.deleteForever': 'حذف نهائي',
  'workspace.newDiagramInFolder': 'مخطط جديد هنا',
  'workspace.newSubfolder': 'مجلد فرعي جديد',
  'workspace.diagramActions': 'إجراءات المخطط',
  'workspace.folderActions': 'إجراءات المجلد',
  'workspace.expandFolder': 'توسيع {name}',
  'workspace.collapseFolder': 'طي {name}',
  'workspace.renameDiagram': 'إعادة تسمية المخطط',
  'workspace.renameFolder': 'إعادة تسمية المجلد',
  'workspace.createFolderTitle': 'مجلد جديد',
  'workspace.deleteDiagram': 'حذف المخطط',
  'workspace.deleteFolder': 'حذف المجلد',
  'workspace.folderNotEmptyTitle': 'المجلد غير فارغ',
  'workspace.moveDiagram': 'نقل المخطط',
  'workspace.renameHint': 'يظهر الاسم في الشريط الجانبي ويُزامَن مع بياناتك المشفّرة.',
  'workspace.createFolderHint': 'تساعدك المجلدات على تنظيم عدة مخططات.',
  'workspace.deleteHint': 'سيتم نقل «{name}» إلى سلة المهملات ومزامنة الحذف مع أجهزتك الأخرى.',
  'workspace.folderNotEmptyHint': 'انقل أو احذف المخططات والمجلدات الفرعية داخل «{name}» أولًا.',
  'workspace.moveHint': 'اختر مجلدًا لهذا المخطط.',
  'workspace.nameLabel': 'الاسم',
  'workspace.folderNameLabel': 'اسم المجلد',
  'workspace.targetFolder': 'المجلد الوجهة',
  'workspace.rootFolder': 'الجذر',
  'workspace.cancel': 'إلغاء',
  'workspace.save': 'حفظ',
  'workspace.create': 'إنشاء',
  'workspace.move': 'نقل',
  'workspace.gotIt': 'حسنًا',
  'workspace.nameRequired': 'لا يمكن أن يكون الاسم فارغًا',
  'workspace.showPassword': 'إظهار كلمة المرور',
  'workspace.hidePassword': 'إخفاء كلمة المرور',
  'workspace.emptyTitle': 'أنشئ مخططك الأول',
  'workspace.emptyDescription': 'تُحفظ المخططات محليًا أولًا، ثم تُشفَّر وتُزامَن بعد تسجيل الدخول.',
  'workspace.untitledDiagram': 'مخطط بدون عنوان',
  'workspace.defaultFolderName': 'مجلد جديد',
  'workspace.migratedDiagram': 'مخطط منقول',
  'workspace.localCopySuffix': ' (نسخة محلية)',
  'workspace.conflictTitle': 'تعارض في النسخة السحابية',
  'workspace.conflictDescription': 'تم تحديث هذا المخطط على جهاز آخر.',
  'workspace.conflictUseCloud': 'استخدام السحابة',
  'workspace.conflictUseLocal': 'استخدام المحلي',
  'workspace.conflictKeepCopy': 'الاحتفاظ بالمحلي كنسخة',
  'workspace.undoDelete': 'نُقل «{name}» إلى سلة المهملات',
  'workspace.undo': 'تراجع',
  'workspace.purgeTitle': 'حذف نهائي',
  'workspace.purgeDescription': 'ستُزال «{name}» من هذا الجهاز. إذا تمت المزامنة فلن تظهر على الأجهزة الأخرى أيضًا.',
  'workspace.purge': 'حذف نهائي',
  'workspace.emptyTrashTitle': 'إفراغ سلة المهملات',
  'workspace.emptyTrashDescription': 'ستُزال المخططات والمجلدات في سلة المهملات من هذا الجهاز.',
  'workspace.crypto.saveRecoveryTitle': 'احفظ مفتاح الاسترداد',
  'workspace.crypto.saveRecoveryDescription':
    'أصبحت بيانات السحابة مشفّرة على هذا الجهاز. يظهر مفتاح الاسترداد مرة واحدة فقط — احفظه في مدير كلمات المرور.',
  'workspace.crypto.setupTitle': 'تفعيل المزامنة السحابية المشفّرة',
  'workspace.crypto.setupDescription':
    'تُشفَّر أسماء المخططات ومحتوياتها في المتصفح بـ AES-256-GCM قبل الرفع. يخزّن Supabase النص المشفّر فقط.',
  'workspace.crypto.unlockTitle': 'فتح المزامنة السحابية',
  'workspace.crypto.unlockDescription':
    'هذا جهاز جديد أو تم مسح المفتاح المحلي. أدخل كلمة مرور المزامنة لتذكر المفتاح الرئيسي على هذا الجهاز.',
  'workspace.crypto.recoverTitle': 'استخدام مفتاح الاسترداد',
  'workspace.crypto.recoverDescription':
    'أدخل مفتاح الاسترداد واختر كلمة مرور مزامنة جديدة. لن تُعاد تشفير المخططات الحالية، بل تتغير تغليف المفتاح فقط.',
  'workspace.crypto.password': 'كلمة مرور المزامنة',
  'workspace.crypto.confirmPassword': 'تأكيد كلمة مرور المزامنة',
  'workspace.crypto.newPassword': 'كلمة مرور مزامنة جديدة',
  'workspace.crypto.confirmNewPassword': 'تأكيد كلمة المرور الجديدة',
  'workspace.crypto.recoveryKey': 'مفتاح الاسترداد',
  'workspace.crypto.passwordPlaceholder': '8 أحرف على الأقل',
  'workspace.crypto.recoveryPlaceholder': 'drawnix-recovery-v1...',
  'workspace.crypto.warning':
    'لا تُرفع كلمة مرور المزامنة إلى الخادم. إذا نسيتها وفقدت مفتاح الاسترداد فلن يمكن استعادة بيانات السحابة.',
  'workspace.crypto.setupAction': 'تفعيل المزامنة المشفّرة',
  'workspace.crypto.setupBusy': 'جارٍ الإعداد…',
  'workspace.crypto.unlockAction': 'فتح',
  'workspace.crypto.unlockBusy': 'جارٍ الفتح…',
  'workspace.crypto.recoverAction': 'استرداد وتعيين كلمة مرور جديدة',
  'workspace.crypto.recoverBusy': 'جارٍ الاسترداد…',
  'workspace.crypto.copyKey': 'نسخ مفتاح الاسترداد',
  'workspace.crypto.copied': 'تم النسخ',
  'workspace.crypto.savedKey': 'لقد حفظته',
  'workspace.crypto.setupLater': 'الإعداد لاحقًا، البقاء محليًا',
  'workspace.crypto.unlockLater': 'الفتح لاحقًا، البقاء محليًا',
  'workspace.crypto.forgotPassword': 'نسيت كلمة المرور؟ استخدم مفتاح الاسترداد',
  'workspace.crypto.backToUnlock': 'العودة لفتح كلمة المرور',
  'workspace.crypto.passwordMismatch': 'كلمتا المرور غير متطابقتين',
  'workspace.crypto.setupFailed': 'تعذر إعداد التشفير',
  'workspace.crypto.unlockFailed': 'تعذر الفتح',
  'workspace.crypto.recoverFailed': 'تعذر الاسترداد',
  'workspace.crypto.copyFailed': 'تعذر النسخ. حدّد مفتاح الاسترداد يدويًا.',
  'workspace.crypto.initFailed': 'تعذر قراءة إعدادات التشفير. حاول لاحقًا.',
  'workspace.crypto.passwordTooShort': 'يجب أن تتكون كلمة مرور المزامنة من 8 أحرف على الأقل',
  'workspace.crypto.notSetup': 'هذا الحساب لم يُعد تشفير المزامنة بعد',
  'workspace.crypto.wrongPassword': 'كلمة مرور المزامنة غير صحيحة',
  'workspace.crypto.wrongRecovery': 'مفتاح الاسترداد غير صحيح',
  'workspace.crypto.newPasswordTooShort': 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل',
  'workspace.crypto.genericFailed': 'حدث خطأ. حاول لاحقًا.',
};

export default arTranslations;
