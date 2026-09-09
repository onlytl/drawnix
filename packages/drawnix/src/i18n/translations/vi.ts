import { Translations } from '../types';

const viTranslations: Translations = {
  // Toolbar items
  'toolbar.hand': 'Kéo — H',
  'toolbar.selection': 'Chọn — V',
  'toolbar.mind': 'Mind Map — M',
  'toolbar.text': 'Văn bản — T',
  'toolbar.arrow': 'Mũi tên — A',
  'toolbar.shape': 'Hình dạng',
  'toolbar.image': 'Hình ảnh — Cmd+U',
  'toolbar.extraTools': 'Công cụ mở rộng',

  'toolbar.pen': 'Bút vẽ — P',
  'toolbar.eraser': 'Tẩy — E',

  'toolbar.arrow.straight': 'Mũi tên thẳng',
  'toolbar.arrow.elbow': 'Mũi tên vuông góc',
  'toolbar.arrow.curve': 'Mũi tên cong',

  'toolbar.shape.rectangle': 'Hình chữ nhật — R',
  'toolbar.shape.ellipse': 'Hình elip — O',
  'toolbar.shape.triangle': 'Hình tam giác',
  'toolbar.shape.terminal': 'Terminal',
  'toolbar.shape.noteCurlyLeft': 'Ghi chú ngoặc móc trái',
  'toolbar.shape.noteCurlyRight': 'Ghi chú ngoặc móc phải',
  'toolbar.shape.diamond': 'Hình thoi',
  'toolbar.shape.parallelogram': 'Hình bình hành',
  'toolbar.shape.roundRectangle': 'Hình chữ nhật bo tròn',

  // Zoom controls
  'zoom.in': 'Phóng to — Cmd++',
  'zoom.out': 'Thu nhỏ — Cmd+-',
  'zoom.fit': 'Vừa màn hình',
  'zoom.100': 'Zoom 100%',

  // Themes
  'theme.default': 'Mặc định',
  'theme.colorful': 'Đầy màu sắc',
  'theme.soft': 'Nhẹ nhàng',
  'theme.retro': 'Cổ điển',
  'theme.dark': 'Tối',
  'theme.starry': 'Bầu trời sao',

  // Colors
  'color.none': 'Màu chủ đề',
  'color.unknown': 'Màu khác',
  'color.default': 'Đen cơ bản',
  'color.white': 'Trắng',
  'color.gray': 'Xám',
  'color.deepBlue': 'Xanh đậm',
  'color.red': 'Đỏ',
  'color.green': 'Xanh lá',
  'color.yellow': 'Vàng',
  'color.purple': 'Tím',
  'color.orange': 'Cam',
  'color.pastelPink': 'Hồng phấn',
  'color.cyan': 'Xanh lơ',
  'color.brown': 'Nâu',
  'color.forestGreen': 'Xanh rừng',
  'color.lightGray': 'Xám nhạt',

  // General
  'general.undo': 'Hoàn tác',
  'general.redo': 'Làm lại',
  'general.menu': 'Menu ứng dụng',
  'general.moreOptions': 'Tùy chọn khác',
  'general.duplicate': 'Nhân bản',
  'general.delete': 'Xóa',

  'general.copyToClipboard': 'Sao chép vào bộ nhớ tạm',
  'general.copyToClipboard.svg': 'SVG',
  'general.copyToClipboard.png': 'PNG',
  'general.copyToClipboard.transparent': 'Nền trong suốt',
  'toast.copyToClipboard.svg': 'Đã sao chép các mục đã chọn dưới dạng SVG vào bộ nhớ tạm',
  'toast.copyToClipboard.png': 'Đã sao chép các mục đã chọn dưới dạng PNG vào bộ nhớ tạm',
  'toast.copyToClipboard.mode.transparent': '(Nền trong suốt)',
  // Language
  'language.switcher': 'Ngôn ngữ',
  'language.chinese': '中文',
  'language.english': 'English',
  'language.russian': 'Русский',
  'language.arabic': 'عربي',
  'language.vietnamese': 'Tiếng Việt',

  // Menu items
  'menu.open': 'Mở',
  'menu.saveFile': 'Lưu vào tệp hiện tại',
  'menu.saveAsFile': 'Lưu thành',
  'menu.exportImage': 'Xuất hình ảnh',
  'menu.exportImage.svg': 'SVG',
  'menu.exportImage.png': 'PNG',
  'menu.exportImage.jpg': 'JPG',
  'menu.cleanBoard': 'Xóa bảng',
  'menu.github': 'GitHub',

  // Dialog translations
  'dialog.mermaid.title': 'Mermaid sang Drawnix',
  'dialog.mermaid.description': 'Hiện hỗ trợ',
  'dialog.mermaid.flowchart': 'lưu đồ',
  'dialog.mermaid.sequence': 'biểu đồ tuần tự',
  'dialog.mermaid.class': 'biểu đồ lớp',
  'dialog.mermaid.otherTypes': ', và các loại biểu đồ khác (hiển thị dưới dạng hình ảnh).',
  'dialog.mermaid.syntax': 'Cú pháp Mermaid',
  'dialog.mermaid.placeholder': 'Viết định nghĩa biểu đồ Mermaid của bạn ở đây...',
  'dialog.mermaid.preview': 'Xem trước',
  'dialog.mermaid.insert': 'Chèn',
  'dialog.markdown.description': 'Hỗ trợ tự động chuyển đổi cú pháp Markdown sang sơ đồ tư duy.',
  'dialog.markdown.syntax': 'Cú pháp Markdown',
  'dialog.markdown.placeholder': 'Viết nội dung Markdown của bạn ở đây...',
  'dialog.markdown.preview': 'Xem trước',
  'dialog.markdown.insert': 'Chèn',
  'dialog.error.loadMermaid': 'Không thể tải thư viện Mermaid',

  // Extra tools menu items
  'extraTools.mermaidToDrawnix': 'Mermaid sang Drawnix',
  'extraTools.markdownToDrawnix': 'Markdown sang Drawnix',

  // Clean confirm dialog
  'cleanConfirm.title': 'Xóa bảng',
  'cleanConfirm.description': 'Thao tác này sẽ xóa toàn bộ bảng. Bạn có muốn tiếp tục không?',
  'cleanConfirm.cancel': 'Hủy',
  'cleanConfirm.ok': 'Đồng ý',

  // Link popup items
  'popupLink.delLink': 'Xóa liên kết',

  // Tool popup items
  'popupToolbar.fillColor': 'Màu tô',
  'popupToolbar.fontSize': 'Cỡ chữ',
  'popupToolbar.fontColor': 'Màu chữ',
  'popupToolbar.link': 'Chèn liên kết',
  'popupToolbar.stroke': 'Đường viền',
  'popupToolbar.opacity': 'Độ trong suốt',

  // Text placeholders
  'textPlaceholders.link': 'Liên kết',
  'textPlaceholders.text': 'Văn bản',

  // Line tool
  'line.source': 'Bắt đầu',
  'line.target': 'Kết thúc',
  'line.arrow': 'Mũi tên',
  'line.none': 'Không',

  // Stroke style
  'stroke.solid': 'Nét liền',
  'stroke.dashed': 'Nét đứt',
  'stroke.dotted': 'Nét chấm',

  //markdown example
  'markdown.example': `# Tôi đã bắt đầu

    - Hãy xem ai đã tạo ra lỗi này 🕵️ ♂️ 🔍
      - 😯 💣
        - Hóa ra là tôi 👈 🎯 💘

    - Bất ngờ thay, nó không chạy được; tại sao vậy 🚫 ⚙️ ❓
      - Bất ngờ thay, giờ nó chạy được rồi; tại sao vậy? 🎢 ✨
        - 🤯 ⚡ ➡️ 🎉

    - Cái gì chạy được 🐞 🚀
      - thì đừng chạm vào nó 🛑 ✋
        - 👾 💥 🏹 🎯

    ## Trai hay gái 👶 ❓ 🤷 ♂️ ♀️

    ### Xin chào thế giới 👋 🌍 ✨ 💻

    #### Wow, một lập trình viên 🤯 ⌨️ 💡 👩 💻`,

  // Draw elements text
  'draw.lineText': 'Văn bản',
  'draw.geometryText': 'Văn bản',

  // Mind map elements text
  'mind.centralText': 'Chủ đề trung tâm',
  'mind.abstractNodeText': 'Tóm tắt',

  'tutorial.title': 'DPIT Draw MindMap',
  'tutorial.description':
    'Bảng trắng tất cả trong một, bao gồm sơ đồ tư duy, lưu đồ, vẽ tự do và hơn thế nữa',
  'tutorial.dataDescription': 'Tất cả dữ liệu được lưu trữ cục bộ trong trình duyệt của bạn',
  'tutorial.appToolbar': 'Xuất, cài đặt ngôn ngữ, ...',
  'tutorial.creationToolbar': 'Chọn một công cụ để bắt đầu sáng tạo',
  'tutorial.themeDescription': 'Chuyển đổi giữa chế độ sáng và tối',

  'workspace.skipToCanvas': 'Chuyển đến bảng vẽ',
  'workspace.brandSubtitle': 'Workspace',
  'workspace.expandSidebar': 'Mở thanh bên',
  'workspace.collapseSidebar': 'Thu thanh bên',
  'workspace.newDiagram': 'Sơ đồ mới',
  'workspace.newFolder': 'Thư mục mới',
  'workspace.searchPlaceholder': 'Tìm sơ đồ hoặc thư mục',
  'workspace.myDiagrams': 'Sơ đồ của tôi',
  'workspace.trash': 'Thùng rác',
  'workspace.openTrash': 'Mở thùng rác',
  'workspace.backToTree': 'Quay lại sơ đồ',
  'workspace.emptyTree': 'Chưa có sơ đồ. Hãy tạo một cái để bắt đầu.',
  'workspace.emptySearch': 'Không tìm thấy sơ đồ hoặc thư mục',
  'workspace.emptyTrash': 'Thùng rác trống',
  'workspace.emptyTrashAction': 'Dọn thùng rác',
  'workspace.localOnlyTitle': 'Chỉ lưu trên máy',
  'workspace.localOnlyHint': 'Cấu hình Supabase để đồng bộ tự động',
  'workspace.cloudChecking': 'Đang kiểm tra mã hóa…',
  'workspace.cloudSyncing': 'Đang mã hóa và đồng bộ…',
  'workspace.cloudEnabled': 'Đồng bộ đám mây mã hóa đã bật',
  'workspace.cloudLocked': 'Đồng bộ đám mây đang khóa',
  'workspace.cloudSetupRequired': 'Chưa thiết lập mã hóa',
  'workspace.cloudSignedOutTitle': 'Đồng bộ đám mây mã hóa',
  'workspace.cloudSignedOutHint': 'Sau khi đăng nhập, sơ đồ được mã hóa trên trình duyệt rồi mới tải lên',
  'workspace.signInGitHub': 'Tiếp tục với GitHub',
  'workspace.signOut': 'Đăng xuất',
  'workspace.unlockCloud': 'Mở khóa đồng bộ đám mây',
  'workspace.setupEncryption': 'Bật đồng bộ mã hóa',
  'workspace.resizeSidebar': 'Kéo để đổi độ rộng thanh bên',
  'workspace.notSignedIn': 'Chưa đăng nhập đồng bộ đám mây',
  'workspace.syncPending': 'Chờ đồng bộ',
  'workspace.syncSyncing': 'Đang đồng bộ',
  'workspace.syncSynced': 'Đã đồng bộ',
  'workspace.syncConflict': 'Xung đột',
  'workspace.moveTo': 'Di chuyển tới…',
  'workspace.rename': 'Đổi tên',
  'workspace.delete': 'Xóa',
  'workspace.restore': 'Khôi phục',
  'workspace.deleteForever': 'Xóa vĩnh viễn',
  'workspace.newDiagramInFolder': 'Sơ đồ mới tại đây',
  'workspace.newSubfolder': 'Thư mục con mới',
  'workspace.diagramActions': 'Thao tác sơ đồ',
  'workspace.folderActions': 'Thao tác thư mục',
  'workspace.expandFolder': 'Mở {name}',
  'workspace.collapseFolder': 'Thu {name}',
  'workspace.renameDiagram': 'Đổi tên sơ đồ',
  'workspace.renameFolder': 'Đổi tên thư mục',
  'workspace.createFolderTitle': 'Thư mục mới',
  'workspace.deleteDiagram': 'Xóa sơ đồ',
  'workspace.deleteFolder': 'Xóa thư mục',
  'workspace.folderNotEmptyTitle': 'Thư mục không trống',
  'workspace.moveDiagram': 'Di chuyển sơ đồ',
  'workspace.renameHint': 'Tên hiện trên thanh bên và được đồng bộ cùng dữ liệu mã hóa.',
  'workspace.createFolderHint': 'Thư mục giúp bạn sắp xếp nhiều sơ đồ.',
  'workspace.deleteHint': '“{name}” sẽ được chuyển vào thùng rác và việc xóa sẽ đồng bộ sang thiết bị khác.',
  'workspace.folderNotEmptyHint': 'Hãy di chuyển hoặc xóa sơ đồ và thư mục con trong “{name}” trước.',
  'workspace.moveHint': 'Chọn thư mục cho sơ đồ này.',
  'workspace.nameLabel': 'Tên',
  'workspace.folderNameLabel': 'Tên thư mục',
  'workspace.targetFolder': 'Thư mục đích',
  'workspace.rootFolder': 'Thư mục gốc',
  'workspace.cancel': 'Hủy',
  'workspace.save': 'Lưu',
  'workspace.create': 'Tạo',
  'workspace.move': 'Di chuyển',
  'workspace.gotIt': 'Đã hiểu',
  'workspace.nameRequired': 'Tên không được để trống',
  'workspace.showPassword': 'Hiện mật khẩu',
  'workspace.hidePassword': 'Ẩn mật khẩu',
  'workspace.emptyTitle': 'Tạo sơ đồ đầu tiên',
  'workspace.emptyDescription': 'Sơ đồ được lưu trên máy trước, rồi mã hóa và đồng bộ sau khi bạn đăng nhập.',
  'workspace.untitledDiagram': 'Sơ đồ chưa đặt tên',
  'workspace.defaultFolderName': 'Thư mục mới',
  'workspace.migratedDiagram': 'Sơ đồ đã chuyển',
  'workspace.localCopySuffix': ' (bản sao cục bộ)',
  'workspace.conflictTitle': 'Xung đột phiên bản đám mây',
  'workspace.conflictDescription': 'Sơ đồ này đã được cập nhật trên thiết bị khác.',
  'workspace.conflictUseCloud': 'Dùng bản đám mây',
  'workspace.conflictUseLocal': 'Dùng bản cục bộ',
  'workspace.conflictKeepCopy': 'Giữ bản cục bộ thành bản sao',
  'workspace.undoDelete': '“{name}” đã được chuyển vào thùng rác',
  'workspace.undo': 'Hoàn tác',
  'workspace.purgeTitle': 'Xóa vĩnh viễn',
  'workspace.purgeDescription': '“{name}” sẽ bị xóa khỏi thiết bị này. Nếu đã đồng bộ, các thiết bị khác cũng sẽ không còn thấy nó.',
  'workspace.purge': 'Xóa vĩnh viễn',
  'workspace.emptyTrashTitle': 'Dọn thùng rác',
  'workspace.emptyTrashDescription': 'Sơ đồ và thư mục trong thùng rác sẽ bị xóa khỏi thiết bị này.',
  'workspace.crypto.saveRecoveryTitle': 'Lưu khóa khôi phục',
  'workspace.crypto.saveRecoveryDescription':
    'Dữ liệu đám mây hiện được mã hóa trên thiết bị này. Khóa khôi phục chỉ hiện một lần — hãy lưu vào trình quản lý mật khẩu.',
  'workspace.crypto.setupTitle': 'Bật đồng bộ đám mây mã hóa',
  'workspace.crypto.setupDescription':
    'Tên và nội dung sơ đồ được mã hóa trong trình duyệt bằng AES-256-GCM trước khi tải lên. Supabase chỉ lưu bản mã hóa.',
  'workspace.crypto.unlockTitle': 'Mở khóa đồng bộ đám mây',
  'workspace.crypto.unlockDescription':
    'Đây là thiết bị mới, hoặc khóa cục bộ đã bị xóa. Nhập mật khẩu đồng bộ để nhớ khóa chính trên thiết bị này.',
  'workspace.crypto.recoverTitle': 'Dùng khóa khôi phục',
  'workspace.crypto.recoverDescription':
    'Nhập khóa khôi phục và đặt mật khẩu đồng bộ mới. Sơ đồ hiện có không bị mã hóa lại, chỉ gói khóa chính được đổi.',
  'workspace.crypto.password': 'Mật khẩu đồng bộ',
  'workspace.crypto.confirmPassword': 'Xác nhận mật khẩu đồng bộ',
  'workspace.crypto.newPassword': 'Mật khẩu đồng bộ mới',
  'workspace.crypto.confirmNewPassword': 'Xác nhận mật khẩu mới',
  'workspace.crypto.recoveryKey': 'Khóa khôi phục',
  'workspace.crypto.recoveryPlaceholder': 'drawnix-recovery-v1...',
  'workspace.crypto.passwordPlaceholder': 'Ít nhất 8 ký tự',
  'workspace.crypto.warning':
    'Mật khẩu đồng bộ không bao giờ được tải lên máy chủ. Nếu quên mật khẩu và mất khóa khôi phục, dữ liệu đám mây không thể khôi phục.',
  'workspace.crypto.setupAction': 'Bật đồng bộ mã hóa',
  'workspace.crypto.setupBusy': 'Đang thiết lập…',
  'workspace.crypto.unlockAction': 'Mở khóa',
  'workspace.crypto.unlockBusy': 'Đang mở khóa…',
  'workspace.crypto.recoverAction': 'Khôi phục và đặt mật khẩu mới',
  'workspace.crypto.recoverBusy': 'Đang khôi phục…',
  'workspace.crypto.copyKey': 'Sao chép khóa khôi phục',
  'workspace.crypto.copied': 'Đã sao chép',
  'workspace.crypto.savedKey': 'Tôi đã lưu',
  'workspace.crypto.setupLater': 'Thiết lập sau, dùng bản cục bộ',
  'workspace.crypto.unlockLater': 'Mở khóa sau, dùng bản cục bộ',
  'workspace.crypto.forgotPassword': 'Quên mật khẩu? Dùng khóa khôi phục',
  'workspace.crypto.backToUnlock': 'Quay lại mở khóa bằng mật khẩu',
  'workspace.crypto.passwordMismatch': 'Hai mật khẩu không khớp',
  'workspace.crypto.setupFailed': 'Không thể thiết lập mã hóa',
  'workspace.crypto.unlockFailed': 'Không thể mở khóa',
  'workspace.crypto.recoverFailed': 'Không thể khôi phục',
  'workspace.crypto.copyFailed': 'Không thể sao chép. Hãy chọn khóa khôi phục thủ công.',
  'workspace.crypto.initFailed': 'Không đọc được cài đặt mã hóa. Hãy thử lại sau.',
  'workspace.crypto.passwordTooShort': 'Mật khẩu đồng bộ phải có ít nhất 8 ký tự',
  'workspace.crypto.notSetup': 'Tài khoản này chưa thiết lập mã hóa đồng bộ',
  'workspace.crypto.wrongPassword': 'Mật khẩu đồng bộ không đúng',
  'workspace.crypto.wrongRecovery': 'Khóa khôi phục không đúng',
  'workspace.crypto.newPasswordTooShort': 'Mật khẩu đồng bộ mới phải có ít nhất 8 ký tự',
  'workspace.crypto.genericFailed': 'Đã xảy ra lỗi. Hãy thử lại sau.',
};

export default viTranslations;
