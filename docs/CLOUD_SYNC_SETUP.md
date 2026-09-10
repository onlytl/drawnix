# Drawnix Cloud Sync Setup

This fork adds personal multi-device sync without a custom backend. Diagram names and contents are encrypted in the browser before upload.

## Architecture

- Drawnix remains local-first and writes every edit to IndexedDB through localForage.
- Supabase Auth handles identity (GitHub OAuth). GitHub is not used to store diagrams.
- The browser encrypts folder names, diagram names, and diagram JSON with AES-256-GCM, then uploads ciphertext.
- Supabase Postgres stores `folders`, `documents`, and `user_crypto` (the password-wrapped master key). It never sees plaintext diagram data.
- Sync is debounced; drawing never waits for the network.
- Document revisions use optimistic concurrency. When two devices edit the same diagram before syncing, Drawnix asks which version to keep.
- Deletes are soft-deleted so another device can learn about the deletion. The UI moves items to Trash first and offers Undo.

## 1. Create a Supabase project

Create a project in Supabase, then open **SQL Editor** and run:

`supabase/schema.sql`

That script creates:

- `folders`
- `documents`
- `user_crypto`
- indexes, `revision`, `deleted_at`
- Row Level Security so an authenticated user can only read and write their own rows

Do not disable RLS. The frontend uses a publishable key; access control depends on the user JWT plus RLS.

## 2. Enable GitHub login

In Supabase:

1. Authentication → Sign In / Providers → GitHub.
2. Copy the callback URL shown by Supabase.
3. In GitHub, create an OAuth App and use that Supabase callback URL as the OAuth callback.
4. Copy the GitHub OAuth Client ID and Client Secret back into the Supabase GitHub provider settings.

In Supabase Authentication → URL Configuration:

- Site URL: your production Vercel URL.
- Add your local URL, for example `http://localhost:7200`.
- Redirect URLs can include `http://localhost:7200/**` and your production origin.
- Add any Vercel preview URL pattern you want to allow.

## 3. Local environment

Copy `.env.example` to `.env.local` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only use the publishable key in the browser. Never put a Supabase secret/service-role key in a Vite environment variable.

Run:

```bash
npm ci
npm start
```

The web app listens on [http://localhost:7200/](http://localhost:7200/).

## 4. Deploy to Vercel

Import the GitHub repository into Vercel.

The included `vercel.json` uses:

- Install: `npm ci`
- Build: `npm run build:web`
- Output: `dist/apps/web`

Set these Vercel environment variables for Production and Preview:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use Node.js 22.x for builds. After changing `VITE_*` variables, redeploy; Vite inlines them at build time.

## Encryption

On first sign-in, Drawnix asks for a sync password (at least 8 characters) and shows a recovery key once.

- The sync password never leaves the browser.
- The recovery key can reset the password later. It does not re-encrypt existing diagrams; it only re-wraps the master key.
- If you forget the password and lose the recovery key, cloud data cannot be decrypted.
- You can skip setup and keep working locally, then turn encryption on from the sidebar.
- Local IndexedDB is still plaintext. That is the local-first tradeoff: drawing works offline, but this device can read local files.

`user_crypto` stores the KDF salt, iteration count, and wrapped master key. It does not store the password or the raw master key.

## Sync behavior

- New edits are saved to IndexedDB immediately.
- When signed in and encryption is unlocked, edits are uploaded after a short debounce.
- Going offline keeps edits local.
- When the browser comes online again, Drawnix reconciles with Supabase and uploads pending changes.
- Folder metadata uses latest-write-wins.
- Diagram content uses revision conflict detection with three choices:
  - use cloud
  - use local
  - keep cloud and save local as a copy
- Soft-deleted items appear in Trash until you restore them or delete them forever.
- The address bar tracks the open diagram as `#d=<id>`. OAuth callback hashes are handled first and are not overwritten.

## Verify

1. Open the deployed site and sign in with GitHub.
2. Set a sync password and save the recovery key.
3. Create a folder and a diagram, then edit it.
4. Wait until the sidebar shows synced.
5. Refresh. The same diagram should reopen (`#d=` in the URL).
6. Sign in on another device, unlock with the sync password, and confirm the same workspace appears.
