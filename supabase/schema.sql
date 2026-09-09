-- Drawnix personal cloud sync schema for Supabase.
-- Run this once in Supabase SQL Editor.

create table if not exists public.folders (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  parent_id uuid null references public.folders(id) on delete restrict,
  name text not null,
  sort_order integer not null default 0,
  revision bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create table if not exists public.documents (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  folder_id uuid null references public.folders(id) on delete set null,
  name text not null,
  content jsonb not null default '{"children":[]}'::jsonb,
  revision bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create index if not exists folders_user_parent_idx
  on public.folders (user_id, parent_id, sort_order);

create index if not exists documents_user_folder_idx
  on public.documents (user_id, folder_id, updated_at desc);

alter table public.folders enable row level security;
alter table public.documents enable row level security;

grant select, insert, update, delete on public.folders to authenticated;
grant select, insert, update, delete on public.documents to authenticated;

revoke all on public.folders from anon;
revoke all on public.documents from anon;

drop policy if exists "folders_select_own" on public.folders;
drop policy if exists "folders_insert_own" on public.folders;
drop policy if exists "folders_update_own" on public.folders;
drop policy if exists "folders_delete_own" on public.folders;

create policy "folders_select_own"
  on public.folders for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "folders_insert_own"
  on public.folders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "folders_update_own"
  on public.folders for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "folders_delete_own"
  on public.folders for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "documents_select_own" on public.documents;
drop policy if exists "documents_insert_own" on public.documents;
drop policy if exists "documents_update_own" on public.documents;
drop policy if exists "documents_delete_own" on public.documents;

create policy "documents_select_own"
  on public.documents for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "documents_insert_own"
  on public.documents for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "documents_update_own"
  on public.documents for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "documents_delete_own"
  on public.documents for delete
  to authenticated
  using ((select auth.uid()) = user_id);
