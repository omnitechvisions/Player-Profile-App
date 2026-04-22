create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  bio text,
  region text,
  roles text[] not null default '{}',
  is_public boolean not null default true,
  xp_total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_username_format
  check (username = lower(username) and username ~ '^[a-z0-9_-]{3,24}$');

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'player-' || substring(new.id::text from 1 for 8)),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

create table if not exists public.sports (
  id text primary key,
  name text not null,
  emoji text not null,
  category text not null
);

create table if not exists public.profile_sports (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  sport_id text not null references public.sports(id) on delete cascade,
  primary key (profile_id, sport_id)
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  sport_id text references public.sports(id) on delete set null,
  name text not null,
  city text not null,
  region text not null,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.club_members (
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_user_id uuid not null references public.profiles(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete set null,
  sport_id text not null references public.sports(id) on delete restrict,
  title text not null,
  description text,
  city text not null,
  region text not null,
  venue text not null,
  starts_at timestamptz not null,
  event_type text not null check (event_type in ('community', 'club', 'showcase')),
  status text not null default 'draft' check (status in ('draft', 'published', 'completed', 'cancelled')),
  entry_fee_text text,
  capacity integer not null default 32 check (capacity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  registration_type text not null check (registration_type in ('participant', 'spectator')),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  sport_id text references public.sports(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  target_user_id uuid references public.profiles(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profile_sports enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.posts enable row level security;
alter table public.user_achievements enable row level security;
alter table public.ratings enable row level security;
alter table public.xp_ledger enable row level security;

drop policy if exists "profiles are publicly readable when public" on public.profiles;
create policy "profiles are publicly readable when public"
on public.profiles for select
using (is_public or auth.uid() = id);

drop policy if exists "profiles can be inserted by owner" on public.profiles;
create policy "profiles can be inserted by owner"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles can be updated by owner" on public.profiles;
create policy "profiles can be updated by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profile sports are readable for public profiles" on public.profile_sports;
create policy "profile sports are readable for public profiles"
on public.profile_sports for select
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = profile_sports.profile_id
      and (profiles.is_public or profiles.id = auth.uid())
  )
);

drop policy if exists "profile sports managed by owner" on public.profile_sports;
create policy "profile sports managed by owner"
on public.profile_sports for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "public clubs are readable" on public.clubs;
create policy "public clubs are readable"
on public.clubs for select
using (is_public or owner_user_id = auth.uid());

drop policy if exists "club owners can mutate clubs" on public.clubs;
create policy "club owners can mutate clubs"
on public.clubs for all
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

drop policy if exists "club memberships are readable for public clubs" on public.club_members;
create policy "club memberships are readable for public clubs"
on public.club_members for select
using (
  exists (
    select 1 from public.clubs
    where clubs.id = club_members.club_id
      and (clubs.is_public or clubs.owner_user_id = auth.uid())
  ) or user_id = auth.uid()
);

drop policy if exists "users manage their own club memberships" on public.club_members;
create policy "users manage their own club memberships"
on public.club_members for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "published events are readable" on public.events;
create policy "published events are readable"
on public.events for select
using (status in ('published', 'completed') or organizer_user_id = auth.uid());

drop policy if exists "authenticated users create their own events" on public.events;
create policy "authenticated users create their own events"
on public.events for insert
with check (auth.uid() = organizer_user_id);

drop policy if exists "organizers update their own events" on public.events;
create policy "organizers update their own events"
on public.events for update
using (auth.uid() = organizer_user_id)
with check (auth.uid() = organizer_user_id);

drop policy if exists "organizers delete their own events" on public.events;
create policy "organizers delete their own events"
on public.events for delete
using (auth.uid() = organizer_user_id);

drop policy if exists "registrations are readable by self or event viewers" on public.event_registrations;
create policy "registrations are readable by self or event viewers"
on public.event_registrations for select
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.events
    where events.id = event_registrations.event_id
      and (events.status in ('published', 'completed') or events.organizer_user_id = auth.uid())
  )
);

drop policy if exists "users manage their own registrations" on public.event_registrations;
create policy "users insert their own registrations for visible events"
on public.event_registrations for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.events
    where events.id = event_registrations.event_id
      and events.status in ('published', 'completed')
  )
);

drop policy if exists "users update their own registrations" on public.event_registrations;
create policy "users update their own registrations"
on public.event_registrations for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "users delete their own registrations" on public.event_registrations;
create policy "users delete their own registrations"
on public.event_registrations for delete
using (user_id = auth.uid());

drop policy if exists "posts are publicly readable" on public.posts;
create policy "posts are publicly readable"
on public.posts for select
using (true);

drop policy if exists "users manage their own posts" on public.posts;
create policy "users manage their own posts"
on public.posts for all
using (author_user_id = auth.uid())
with check (author_user_id = auth.uid());

drop policy if exists "user achievements are readable with public profiles" on public.user_achievements;
create policy "user achievements are readable with public profiles"
on public.user_achievements for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = user_achievements.user_id
      and (profiles.is_public or profiles.id = auth.uid())
  )
);

drop policy if exists "xp ledger is readable with public profiles" on public.xp_ledger;
create policy "xp ledger is readable with public profiles"
on public.xp_ledger for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = xp_ledger.user_id
      and (profiles.is_public or profiles.id = auth.uid())
  )
);

drop policy if exists "ratings are readable for visible events" on public.ratings;
create policy "ratings are readable for visible events"
on public.ratings for select
using (
  exists (
    select 1 from public.events
    where events.id = ratings.event_id
      and (events.status in ('published', 'completed') or events.organizer_user_id = auth.uid())
  )
);

drop policy if exists "eligible attendees can create ratings" on public.ratings;
create policy "eligible attendees can create ratings"
on public.ratings for insert
with check (
  author_user_id = auth.uid()
  and exists (
    select 1 from public.event_registrations
    where event_registrations.event_id = ratings.event_id
      and event_registrations.user_id = auth.uid()
  )
  and exists (
    select 1 from public.events
    where events.id = ratings.event_id
      and events.status = 'completed'
  )
);
