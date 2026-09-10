<p align="center">
  <picture style="width: 320px">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" />
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h_dark.svg?raw=true" />
    <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/logo/logo_drawnix_h.svg?raw=true" width="360" alt="Drawnix logo and name" />
  </picture>
</p>

<div align="center">
  <h2>
    Open-source whiteboard for mind maps, flowcharts, and freehand drawing
  </h2>
  <p>
    This fork adds a <strong>multi-diagram workspace, folders, trash, end-to-end encrypted cloud sync, offline-first storage, and Vercel + Supabase self-hosting</strong>.
  </p>
  <p>
    <a href="https://drawnix-lac.vercel.app/" target="_blank"><strong>Live demo: https://drawnix-lac.vercel.app/</strong></a>
  </p>
</div>

<div align="center">
  <figure>
    <a href="https://drawnix-lac.vercel.app/" target="_blank" rel="noopener">
      <img src="https://github.com/plait-board/drawnix/blob/develop/apps/web/public/product_showcase/case-2.png" alt="Product showcase" width="80%" />
    </a>
    <figcaption>
      <p align="center">
        All-in-one whiteboard: mind maps, flowcharts, freehand, and more
      </p>
    </figcaption>
  </figure>
</div>

> This repository is a fork of [plait-board/drawnix](https://github.com/plait-board/drawnix). The canvas, Plait plugins, and drawing tools come from upstream. This fork adds a personal workspace and encrypted sync.

[*中文 README*](./README.md)

## Features added in this fork

- **Multi-diagram workspace** — more than one board per browser.
- **Folders and nested folders** — keep architecture diagrams, flowcharts, and mind maps organized.
- **Workspace tree** — distinct icons, selection state, collapse, search, and a context menu.
- **Sidebar follows canvas themes** — Default, Soft, Retro, Dark, and Starry restyle the chrome as well as the board.
- **Resizable sidebar** — collapse it or drag to resize.
- **Diagram deep links** — the open diagram is `#d=<id>` in the address bar. Refresh, bookmarks, and Back return to the same file.
- **Trash and undo delete** — delete moves items to Trash with a short Undo toast. Restore later, or delete forever.
- **Workspace i18n** — sidebar, dialogs, and encryption copy follow the board language (zh / en / ru / ar / vi).
- **Local-first** — every edit is written to IndexedDB through localForage before any network call.
- **Supabase sync** — signed-in folders and diagrams sync to Postgres.
- **End-to-end encryption** — names and JSON are encrypted in the browser with AES-256-GCM. Supabase stores ciphertext only.
- **Sync password and recovery key** — the master key is wrapped by your password. The recovery key is shown once when you turn encryption on.
- **GitHub OAuth** — GitHub is identity only. Diagram data lives in Supabase.
- **Multi-device** — the same GitHub account, unlocked with the sync password, shares one workspace.
- **Offline editing** — keep drawing without a network; pending changes upload when you are back online.
- **RLS isolation** — each user can only read their own rows.
- **Conflict protection** — document revisions use optimistic concurrency. A prompt appears only when the cloud copy is actually newer.
- **Legacy migration** — the original single-board `main_board_content` becomes a workspace diagram.
- **Vercel config** — `vercel.json` builds the Nx/Vite web app.

## Using the workspace

- **New diagram / folder** — left sidebar, or a folder’s context menu.
- **Rename** — double-click, press <kbd>F2</kbd>, or use the row menu. The dialog matches the encryption password dialog.
- **Delete** — items go to Trash; Undo appears at the bottom for a few seconds. The trash icon opens Trash for restore or permanent delete.
- **Open a diagram** — the URL becomes `https://your-domain/#d=<id>`. Bookmark it or send it to yourself.
- **Cloud sync** — after you configure Supabase, sign in with GitHub and set a sync password. You can skip that and keep working locally.
- **Another device** — sign in with the same GitHub account and unlock with the sync password. If you forgot the password, use the recovery key from first-time setup.

Full self-hosting steps: [docs/CLOUD_SYNC_SETUP.md](./docs/CLOUD_SYNC_SETUP.md).

## Upstream Drawnix

- Free and open source
- Mind maps and flowcharts
- Freehand
- Images
- Plugin architecture
- Export PNG, JPG, JSON (`.drawnix`)
- Undo, redo, copy, paste
- Infinite canvas
- Themes
- Mobile-friendly
- Mermaid to flowchart
- Markdown to mind map

## Host it yourself

No custom backend. Typical stack:

```text
GitHub
  │
  ├── Drawnix source
  │
  ↓
Vercel
  │
  └── Web app

Browser
  ├── localForage / IndexedDB   instant local save
  │
  └── Supabase
       ├── Auth                 GitHub login
       └── PostgreSQL           folders / documents / user_crypto (ciphertext)
```

You need a GitHub account, a Vercel account, and a Supabase project. Hobby/Free tiers are usually enough for personal use.

1. Fork or clone this repo (`npm ci` then `npm start` — app on http://localhost:7200/).
2. Create a Supabase project and run `supabase/schema.sql` in the SQL Editor.
3. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Never put a service-role or `sb_secret_` key in the frontend.
4. Enable the GitHub provider in Supabase Auth. GitHub OAuth callback must be the URL Supabase shows (`…/auth/v1/callback`).
5. Set Site URL and Redirect URLs (`https://your-domain/**`, `http://localhost:7200/**`).
6. Import the repo in Vercel. `vercel.json` already sets `npm ci`, `npm run build:web`, and `dist/apps/web`.
7. Add the same two `VITE_*` variables for Production and Preview, then redeploy if you change them.

After deploy: sign in, save the recovery key, create a diagram, wait for synced, refresh (URL should keep `#d=`), then unlock the same account on another device.

## Encryption

Names and contents are encrypted in the browser before upload. Supabase stores ciphertext and a wrapped master key, not plaintext.

- The sync password is never uploaded.
- The recovery key is shown once. Store it in a password manager.
- If you forget the password and lose the recovery key, cloud data cannot be decrypted.
- Local IndexedDB stays plaintext. That is the local-first tradeoff: this device can still read local files.

## Conflicts

This is not realtime multiplayer. There is no Yjs, CRDT, or WebSocket.

Goal: **one person, several devices, reliable sync.**

Local drawing is saved immediately and uploaded in the background. A conflict prompt appears only when the cloud copy is actually newer:

- Use cloud
- Use local
- Keep local as a copy

## Repository layout

```text
drawnix/
├── apps/web/                      # Web app (workspace shell + Drawnix)
├── packages/drawnix/              # Whiteboard
├── packages/react-board/
├── packages/react-text/
├── supabase/schema.sql            # folders, documents, user_crypto, RLS
├── docs/CLOUD_SYNC_SETUP.md
├── vercel.json
├── .env.example
└── README.md
```

## Development

```bash
npm ci
npm start
```

```bash
npm run build:web
```

## Docker

Upstream image:

```bash
docker pull pubuzhixing/drawnix:latest
```

That image may not include this fork’s workspace or encrypted sync. Prefer building from this repo or deploying on Vercel.

## Dependencies

- [Plait](https://github.com/worktile/plait)
- [Slate](https://github.com/ianstormtaylor/slate)
- [Floating UI](https://github.com/floating-ui/floating-ui)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

## Upstream

[plait-board/drawnix](https://github.com/plait-board/drawnix)

For core canvas issues, check whether they reproduce upstream.

## License

[MIT License](./LICENSE)
