create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  client_token text unique not null,
  credits integer not null default 1 check (credits >= 0),
  lifetime_votes integer not null default 0 check (lifetime_votes >= 0),
  created_at timestamptz not null default now()
);

create type public.test_status as enum ('draft', 'pending_payment', 'active', 'completed');
create type public.vote_choice as enum ('A', 'B');

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  option_a_url text not null,
  option_b_url text not null,
  target_votes integer not null check (target_votes > 0),
  votes_a integer not null default 0 check (votes_a >= 0),
  votes_b integer not null default 0 check (votes_b >= 0),
  status public.test_status not null default 'draft',
  is_free_tier boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  voter_hash text not null,
  choice public.vote_choice not null,
  created_at timestamptz not null default now(),
  unique (test_id, voter_hash)
);

alter table public.profiles enable row level security;
alter table public.tests enable row level security;
alter table public.votes enable row level security;

insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do update set public = true;

create policy "Public thumbnail reads" on storage.objects for select using (bucket_id = 'thumbnails');
create policy "Public thumbnail uploads" on storage.objects for insert with check (bucket_id = 'thumbnails');
create policy "Public thumbnail updates" on storage.objects for update using (bucket_id = 'thumbnails') with check (bucket_id = 'thumbnails');
