-- Create demo auth users separately with:
-- npm run seed:demo-auth
--
-- That script uses Supabase Auth Admin createUser so the generated auth rows
-- are valid for password login and do not leave auth-managed token fields null.

truncate table
  public.team_members,
  public.teams,
  public.ratings,
  public.event_registrations,
  public.events,
  public.club_members,
  public.clubs,
  public.profile_sports,
  public.user_achievements,
  public.xp_ledger,
  public.posts,
  public.achievements,
  public.sports
restart identity cascade;

insert into public.sports (id, name, emoji, category) values
  ('basketball', 'Basketball', '🏀', 'Court'),
  ('football', 'Football', '⚽', 'Field'),
  ('tennis', 'Tennis', '🎾', 'Racquet'),
  ('volleyball', 'Volleyball', '🏐', 'Court'),
  ('running', 'Running', '🏃', 'Endurance'),
  ('boxing', 'Boxing', '🥊', 'Combat'),
  ('cycling', 'Cycling', '🚴', 'Endurance'),
  ('badminton', 'Badminton', '🏸', 'Racquet');

insert into public.achievements (id, title, description) values
  ('first-event', 'First Whistle', 'Joined your first event.'),
  ('club-starter', 'Club Starter', 'Joined two clubs.'),
  ('community-core', 'Community Core', 'Earned 1,000 XP.'),
  ('top-ten', 'Top 10', 'Reached the top 10 leaderboard.');

create temporary table demo_users (
  full_name text,
  username text,
  region text,
  roles text[],
  favorite_sports text[],
  xp_total integer
) on commit drop;

insert into demo_users (full_name, username, region, roles, favorite_sports, xp_total) values
  ('Maya Thompson', 'mayaedge', 'Halifax', array['player', 'organizer'], array['basketball', 'volleyball'], 1420),
  ('Liam Carter', 'liamserve', 'Toronto', array['player', 'spectator'], array['football', 'running'], 1180),
  ('Zoe Martin', 'zoepeak', 'Vancouver', array['player', 'organizer'], array['running', 'cycling'], 1680),
  ('Noah Patel', 'noahnet', 'Montreal', array['player'], array['tennis', 'badminton'], 930),
  ('Avery Brooks', 'averylane', 'Calgary', array['player'], array['boxing'], 860),
  ('Ella Chen', 'ellaspin', 'Ottawa', array['player', 'spectator'], array['cycling'], 1025),
  ('Mason Reid', 'masonkick', 'Halifax', array['player'], array['football'], 790),
  ('Sophia James', 'sophiaset', 'Toronto', array['player'], array['tennis'], 1110),
  ('Ethan Wells', 'ethanhoops', 'Edmonton', array['player', 'organizer'], array['basketball'], 990),
  ('Chloe Fraser', 'chloetrack', 'Victoria', array['player'], array['running'], 1230),
  ('Lucas Ford', 'lucasvolley', 'Montreal', array['player'], array['volleyball'], 885),
  ('Harper Singh', 'harperrally', 'Ottawa', array['player'], array['badminton'], 975),
  ('Benjamin Ross', 'benjab', 'Calgary', array['player'], array['boxing'], 910),
  ('Grace Moore', 'gracepace', 'Vancouver', array['player', 'spectator'], array['running', 'cycling'], 1320),
  ('Daniel Cruz', 'danielfc', 'Toronto', array['player'], array['football'], 1090),
  ('Scarlett Kim', 'scarletthoops', 'Halifax', array['player'], array['basketball'], 1045),
  ('Jackson Lee', 'jackace', 'Montreal', array['player'], array['tennis'], 820),
  ('Aria Gomez', 'ariavibe', 'Quebec City', array['player'], array['volleyball'], 760),
  ('Henry Cole', 'henryride', 'Victoria', array['player'], array['cycling'], 875),
  ('Lily Grant', 'lilysmash', 'Toronto', array['player'], array['badminton'], 940);

insert into public.profiles (
  id,
  full_name,
  username,
  region,
  roles,
  bio,
  xp_total,
  is_public
)
select
  auth_users.id,
  demo_users.full_name,
  demo_users.username,
  demo_users.region,
  demo_users.roles,
  'Active in local sports, club sessions, and community events.',
  demo_users.xp_total,
  true
from demo_users
join auth.users auth_users
  on auth_users.email = demo_users.username || '@demo.local'
on conflict (id) do update
set
  full_name = excluded.full_name,
  username = excluded.username,
  region = excluded.region,
  roles = excluded.roles,
  bio = excluded.bio,
  xp_total = excluded.xp_total,
  is_public = excluded.is_public;

insert into public.profile_sports (profile_id, sport_id)
select
  profiles.id,
  unnest(demo_users.favorite_sports)
from public.profiles
join demo_users on demo_users.username = profiles.username;

create temporary table demo_clubs (
  name text,
  city text,
  region text,
  sport_id text,
  owner_username text
) on commit drop;

insert into demo_clubs values
  ('Harbour Hoops', 'Halifax', 'Atlantic', 'basketball', 'mayaedge'),
  ('Northside FC', 'Toronto', 'Ontario', 'football', 'liamserve'),
  ('Metro Volley', 'Halifax', 'Atlantic', 'volleyball', 'scarletthoops'),
  ('Pacific Stride', 'Vancouver', 'BC', 'running', 'zoepeak'),
  ('Coastline Cycling', 'Victoria', 'BC', 'cycling', 'gracepace'),
  ('Rally House', 'Montreal', 'Quebec', 'tennis', 'noahnet'),
  ('East End Boxing', 'Calgary', 'Alberta', 'boxing', 'averylane'),
  ('River Racquets', 'Ottawa', 'Ontario', 'badminton', 'harperrally'),
  ('Summit Badminton', 'Toronto', 'Ontario', 'badminton', 'lilysmash'),
  ('City Lights Run Club', 'Edmonton', 'Alberta', 'running', 'ethanhoops');

insert into public.clubs (name, city, region, sport_id, owner_user_id, description, is_public)
select
  demo_clubs.name,
  demo_clubs.city,
  demo_clubs.region,
  demo_clubs.sport_id,
  profiles.id,
  'Community-first club with weekly sessions, social play, and a welcoming organizer crew.',
  true
from demo_clubs
join public.profiles on profiles.username = demo_clubs.owner_username;

insert into public.club_members (club_id, user_id, role)
select
  clubs.id,
  profiles.id,
  case when clubs.owner_user_id = profiles.id then 'owner' else 'member' end
from public.clubs clubs
join public.profiles profiles on (
  profiles.region = clubs.city
  or profiles.username in ('mayaedge', 'liamserve', 'zoepeak', 'noahnet')
)
where profiles.username not like 'member%';

with numbered_profiles as (
  select id, username, row_number() over (order by username) as rn
  from public.profiles
),
numbered_clubs as (
  select id, row_number() over (order by name) as rn
  from public.clubs
)
insert into public.events (
  organizer_user_id,
  club_id,
  sport_id,
  title,
  description,
  city,
  region,
  venue,
  starts_at,
  event_type,
  status,
  entry_fee_text,
  capacity
)
select
  profiles.id,
  case when gs % 2 = 0 then clubs.id else null end,
  (array['basketball','football','tennis','volleyball','running','boxing','cycling','badminton'])[((gs - 1) % 8) + 1],
  (array['Classic','Open Night','Community Session'])[((gs - 1) % 3) + 1] || ' ' ||
    (array['Basketball','Football','Tennis','Volleyball','Running','Boxing','Cycling','Badminton'])[((gs - 1) % 8) + 1],
  'A polished local event with clear registration flow, participant and spectator access, and enough detail for a strong MVP demo.',
  (array['Halifax','Toronto','Montreal','Vancouver'])[((gs - 1) % 4) + 1],
  (array['Atlantic','Ontario','Quebec','BC'])[((gs - 1) % 4) + 1],
  (array['Harbour Centre','North Court','Summit Dome','City Park'])[((gs - 1) % 4) + 1],
  now() + ((gs - 7) || ' days')::interval,
  (array['club','community','showcase'])[((gs - 1) % 3) + 1],
  case
    when gs <= 6 then 'completed'
    when gs = 7 then 'draft'
    else 'published'
  end,
  case when gs % 3 = 0 then '$10 drop-in' else 'Free community access' end,
  24 + ((gs - 1) % 4) * 8
from generate_series(1, 24) gs
join numbered_profiles profiles on profiles.rn = ((gs - 1) % 20) + 1
left join numbered_clubs clubs on clubs.rn = ((gs - 1) % 10) + 1;

insert into public.event_registrations (event_id, user_id, registration_type)
select
  events.id,
  profiles.id,
  case when ((event_row.rn + profile_row.rn) % 3) = 0 then 'spectator' else 'participant' end
from (
  select id, row_number() over (order by starts_at, title) as rn
  from public.events
) event_row
join public.events on events.id = event_row.id
join (
  select id, row_number() over (order by username) as rn
  from public.profiles
) profile_row on profile_row.rn <= 6 + (event_row.rn % 6)
join public.profiles profiles on profiles.id = profile_row.id;

insert into public.xp_ledger (user_id, reason, amount)
select
  profiles.id,
  'Initial seed XP',
  demo_users.xp_total
from public.profiles
join demo_users on demo_users.username = profiles.username;

insert into public.user_achievements (user_id, achievement_id)
select profiles.id, 'first-event'
from public.profiles profiles;

insert into public.user_achievements (user_id, achievement_id)
select profiles.id, 'community-core'
from public.profiles profiles
where profiles.xp_total >= 1000;

insert into public.ratings (event_id, author_user_id, target_user_id, score, comment)
select
  events.id,
  profiles.id,
  null,
  4 + (row_number() over (order by events.starts_at) % 2),
  'Easy check-in, strong atmosphere, and a smooth organizer experience.'
from public.events events
join public.profiles profiles on profiles.username in ('liamserve', 'zoepeak', 'noahnet', 'gracepace', 'scarletthoops', 'henryride')
where events.status = 'completed'
limit 6;

insert into public.posts (author_user_id, sport_id, body)
select
  profiles.id,
  'basketball',
  'Opened a few more spots for the next community night. Spectators welcome.'
from public.profiles profiles
where profiles.username = 'mayaedge';
