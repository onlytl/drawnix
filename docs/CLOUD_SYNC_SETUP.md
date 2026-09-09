# Drawnix Cloud Sync Setup

This fork adds personal multi-device sync without a custom backend.

## Architecture

- Drawnix remains local-first and writes every edit to IndexedDB through localForage.
- Supabase Auth handles identity.
- Supabase Postgres stores folders and Drawnix document JSON.
- Sync is debounced; drawing never waits for the network.
- Document revisions use optimistic concurrency. When two devices edit the same diagram before syncing, Drawnix asks which version to keep.
- Deletes are soft-deleted so another device can learn about the deletion.

## 1. Create a Supabase project

Create a project in Supabase, then open **SQL Editor** and run:

`supabase/schema.sql`

## 2. Enable GitHub login

In Supabase:

1. Authentication → Sign In / Providers → GitHub.
2. Copy the callback URL shown by Supabase.
3. In GitHub, create an OAuth App and use that Supabase callback URL as the OAuth callback.
4. Copy the GitHub OAuth Client ID and Client Secret back into the Supabase GitHub provider settings.

In Supabase Authentication → URL Configuration:

- Site URL: your production Vercel URL.
- Add your local URL, for example `http://localhost:7200`.
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

## 4. Deploy to Vercel

Import the GitHub repository into Vercel.

The included `vercel.json` uses:

- Install: `npm ci`
- Build: `npm run build:web`
- Output: `dist/apps/web`

Set these Vercel environment variables for Production and Preview:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use Node.js 22.x for builds.

## Sync behavior

- New edits are saved to IndexedDB immediately.
- When signed in, edits are uploaded after a short debounce.
- Going offline keeps edits local.
- When the browser comes online again, Drawnix reconciles with Supabase and uploads pending changes.
- Folder metadata uses latest-write-wins.
- Diagram content uses revision conflict detection with three choices:
  - use cloud
  - use local
  - keep cloud and save local as a copy
