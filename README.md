<p align="center">
  <picture style="width: 320px">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" />
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h_dark.svg?raw=true" />
    <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" width="360" alt="Drawnix logo and name" />
  </picture>
</p>

<div align="center">
  <h2>
    开源白板工具，一体化支持思维导图、流程图、自由画等
  </h2>
  <p>
    在原版 Drawnix 基础上增加了 <strong>多图管理、文件夹、个人云同步、离线优先和 Vercel + Supabase 自部署</strong>。
  </p>
  <p>
    <a href="https://drawnix-lac.vercel.app/" target="_blank"><strong>在线体验：https://drawnix-lac.vercel.app/</strong></a>
  </p>
</div>

<div align="center">
  <figure>
    <a href="https://drawnix-lac.vercel.app/" target="_blank" rel="noopener">
      <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/product_showcase/case-2.png" alt="Product showcase" width="80%" />
    </a>
    <figcaption>
      <p align="center">
        All in one 白板，思维导图、流程图、自由画等
      </p>
    </figcaption>
  </figure>
</div>

> 本仓库是基于 [plait-board/drawnix](https://github.com/plait-board/drawnix) 的增强版 Fork。核心画板、Plait 插件体系和原有绘图能力均来自上游 Drawnix，本 Fork 主要增加个人工作区与云同步相关能力。

[*English README (upstream)*](https://github.com/plait-board/drawnix/blob/develop/README_en.md)

## 本 Fork 新增功能

在原版 Drawnix 的基础上，本仓库增加了以下能力：

- 📁 **多图表工作区**：不再只有一个浏览器本地画板，可以创建和管理多张图。
- 🗂️ **文件夹与子文件夹**：支持树形目录组织图表，适合长期积累架构图、流程图和思维导图。
- 🌳 **Workspace 文件树**：文件夹和图表使用不同图标、清晰层级和选中状态，并支持折叠。
- ↔️ **可调整侧栏**：侧栏支持收起和拖动调整宽度。
- 💾 **Local-first 本地优先**：编辑内容第一时间写入浏览器 IndexedDB/localForage，不依赖网络才能画图。
- ☁️ **Supabase 云同步**：登录后将文件夹和图表自动同步到 Supabase PostgreSQL。
- 🔐 **GitHub OAuth 登录**：GitHub 只用于身份认证，实际图表数据存储在 Supabase。
- 🔄 **多设备同步**：同一 GitHub 账号在不同设备登录后，可以读取同一个工作区。
- 📴 **离线编辑**：网络不可用时继续编辑，恢复网络后自动同步。
- 🛡️ **RLS 数据隔离**：Supabase Row Level Security 确保每个用户只能访问自己的数据。
- 🧩 **版本 / 冲突保护**：通过 revision 进行乐观并发控制，仅在确实存在较新的远端修改时提示冲突。
- 🗑️ **Soft Delete**：删除记录会同步删除状态，避免其他设备重新拉回已经删除的数据。
- ♻️ **旧数据自动迁移**：原 Drawnix 的 `main_board_content` 会自动迁移成新的工作区图表。
- ▲ **Vercel 部署配置**：仓库已包含 `vercel.json`，可以直接部署 Vite/Nx Web App。

## 原版 Drawnix 特性

- 💯 免费 + 开源
- ⚒️ 思维导图、流程图
- 🖌 画笔
- 😀 插入图片
- 🚀 基于插件机制
- 🖼️ 📃 导出为 PNG、JSON (`.drawnix`)
- 💾 自动保存
- ⚡ 撤销、重做、复制、粘贴等编辑能力
- 🌌 无限画布：缩放、滚动
- 🎨 主题模式
- 📱 移动设备适配
- 📈 Mermaid 语法转流程图
- ✨ Markdown 文本转思维导图

## 在线应用

本 Fork 的部署地址：

**[https://drawnix-lac.vercel.app/](https://drawnix-lac.vercel.app/)**

上游 Drawnix 官方应用：

[https://drawnix.com](https://drawnix.com)

---

# 自己部署一套

这套增强版不需要自己开发或维护后端服务器，推荐组合：

```text
GitHub
  │
  ├── Drawnix 源码
  │
  ↓
Vercel
  │
  └── Web 前端

浏览器
  ├── localForage / IndexedDB   本地即时保存
  │
  └── Supabase
       ├── Auth                 GitHub 登录
       └── PostgreSQL           folders / documents
```

需要：

- 一个 GitHub 账号
- 一个 Vercel 账号
- 一个 Supabase 项目

个人使用时，Vercel Hobby + Supabase Free 通常即可满足需求。

## 1. Fork 仓库

Fork 本仓库到自己的 GitHub 账号：

```text
https://github.com/onlytl/drawnix
```

也可以 clone 后创建自己的仓库：

```bash
git clone https://github.com/onlytl/drawnix.git
cd drawnix
npm install
```

本地启动：

```bash
npm run start
```

Web 默认由 Nx/Vite 启动。

## 2. 创建 Supabase 项目

在 Supabase 创建一个新项目。

项目创建完成后，打开 **SQL Editor**，执行仓库中的：

```text
supabase/schema.sql
```

该 SQL 会创建：

```text
folders
documents
```

以及对应的：

- 索引
- revision 字段
- soft delete 字段
- Row Level Security
- authenticated 用户访问策略

> 不要关闭 RLS。前端使用的是公开的 Publishable Key，真正的数据权限依赖登录用户 JWT + RLS。

## 3. 获取 Supabase 前端配置

在 Supabase 项目中获取：

```text
Project URL
Publishable API Key
```

对应环境变量：

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
```

仓库中已经提供：

```text
.env.example
```

### 注意

只使用浏览器可公开的：

```text
Publishable Key
```

不要把以下密钥放进前端环境变量：

```text
service_role
sb_secret_...
数据库密码
```

## 4. 配置 GitHub OAuth 登录

GitHub 登录仅用于身份认证，**图表不会保存到 GitHub**。

数据流是：

```text
GitHub OAuth
     ↓
Supabase Auth
     ↓
auth.users
     ↓
folders / documents
```

### 4.1 创建 GitHub OAuth App

进入 GitHub：

```text
Settings
→ Developer settings
→ OAuth Apps
→ New OAuth App
```

例如你的最终域名是：

```text
https://draw.example.com
```

可以填写：

```text
Application name:
Drawnix

Homepage URL:
https://draw.example.com

Authorization callback URL:
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

GitHub 会生成：

```text
Client ID
Client Secret
```

## 5. 在 Supabase 开启 GitHub Provider

进入 Supabase：

```text
Authentication
→ Providers
→ GitHub
```

启用 GitHub，并填入上一步生成的：

```text
Client ID
Client Secret
```

再进入：

```text
Authentication
→ URL Configuration
```

设置生产站点，例如：

```text
Site URL:
https://draw.example.com
```

Redirect URLs 可以加入：

```text
https://draw.example.com/**
http://localhost:4200/**
http://localhost:5173/**
```

如果需要支持 Vercel Preview，也可以添加对应的 Preview URL 通配规则。

## 6. 部署到 Vercel

在 Vercel 中：

```text
Add New
→ Project
→ Import Git Repository
```

选择你的 Drawnix Fork。

仓库已经包含 `vercel.json`，当前配置为：

```text
Install Command:
npm ci

Build Command:
npm run build:web

Output Directory:
dist/apps/web
```

如果 Vercel 没有自动读取，可以手动填入以上三个值。

## 7. 配置 Vercel Environment Variables

在 Vercel Project 的 **Production Environment** 中加入：

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
```

如果需要 Preview Deployment 也能访问云同步，则同样给 Preview 环境配置这两个变量。

> Vite 的 `VITE_*` 环境变量是在构建阶段写入前端 Bundle 的，因此修改环境变量后需要 **Redeploy**。

## 8. 设置 Production Branch

推荐将自己的主开发分支设置为 Production Branch，例如：

```text
develop
```

之后每次 push 到 `develop`，Vercel 会自动重新构建并发布。

## 9. 验证同步

部署完成后：

1. 打开网站并使用 GitHub 登录。
2. 创建文件夹。
3. 创建一张图并编辑内容。
4. 等待后台自动同步。
5. 刷新页面确认内容仍存在。
6. 在另一个浏览器或另一台设备登录同一 GitHub 账号。
7. 确认能够读取同一套文件夹和图表。

正常结构：

```text
编辑
 ↓
IndexedDB / localForage
 ↓
立即本地保存
 ↓
Debounce
 ↓
Supabase
 ↓
已同步
```

网络断开时：

```text
编辑
 ↓
本地保存
 ↓
待同步

网络恢复
 ↓
自动同步到 Supabase
```

## 关于同步冲突

本项目不是多人实时协同工具，也没有使用 Yjs / CRDT / WebSocket。

目标是：

> **一个用户，多设备，可靠同步。**

同一设备连续拖动、编辑和绘制会由本地自动保存和后台同步处理，不应该频繁弹冲突。

只有检测到云端存在真正较新的修改时，才会提示：

```text
使用云端
使用本地
本地另存副本
```

---

## 关于名称

***Drawnix***，源于绘画（***Draw***）与凤凰（***Phoenix***）的灵感交织。

凤凰象征着生生不息的创造力，而 *Draw* 代表着人类最原始的表达方式。在这里，每一次创作都是一次艺术的涅槃，每一笔绘画都是灵感的重生。

创意如同凤凰，浴火方能重生，而 ***Drawnix*** 要做技术与创意之火的守护者。

*Draw Beyond, Rise Above.*

## 与 Plait 画图框架

*Drawnix* 的定位是一个开箱即用、开源、免费的工具产品，它的底层是 *Plait* 框架。

Drawnix 采用插件架构，可以支持多种 UI 框架、集成富文本框架，并通过细粒度插件扩展不同画板应用场景。

## 仓储结构

```text
drawnix/
├── apps/
│   └── web/                       # Web App
├── packages/
│   ├── drawnix/                   # 白板应用
│   ├── react-board/               # 白板 React 视图层
│   └── react-text/                # 文本渲染模块
├── supabase/
│   └── schema.sql                 # 云同步数据库 Schema / RLS
├── docs/
│   └── CLOUD_SYNC_SETUP.md        # 云同步配置说明
├── vercel.json                    # Vercel 构建配置
├── .env.example                   # Supabase 环境变量示例
├── package.json
└── README.md
```

## 开发

```bash
npm install
npm run start
```

构建 Web：

```bash
npm run build:web
```

## Docker

上游 Drawnix Docker 镜像：

```bash
docker pull pubuzhixing/drawnix:latest
```

> 该上游 Docker 镜像不一定包含本 Fork 的文件夹和 Supabase 云同步增强功能。需要这些能力时，建议直接从本仓库源码构建或使用 Vercel 部署。

## 依赖

- [Plait](https://github.com/worktile/plait) - 开源画图框架
- [Slate](https://github.com/ianstormtaylor/slate) - 富文本编辑器框架
- [Floating UI](https://github.com/floating-ui/floating-ui) - 弹出层基础库
- [Supabase](https://supabase.com/) - Auth + PostgreSQL 云同步
- [Vercel](https://vercel.com/) - Web 部署

## 上游项目

原始项目：

[plait-board/drawnix](https://github.com/plait-board/drawnix)

如果你需要 Drawnix 原版的最新绘图能力、Issue 和社区信息，请优先参考上游仓库。

## 贡献

欢迎提交 Issue 或 Pull Request。

涉及原版 Drawnix 核心画板功能的问题，也建议先确认是否可以复现于上游 [plait-board/drawnix](https://github.com/plait-board/drawnix)。

## 感谢

感谢原 Drawnix、Plait 项目的作者和所有贡献者。本 Fork 的绘图核心建立在他们的开源工作之上。

## License

[MIT License](https://github.com/plait-board/drawnix/blob/master/LICENSE)
