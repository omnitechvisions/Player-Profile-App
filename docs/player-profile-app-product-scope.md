# Player Profile App — Product Scope (MVP + Expansion)

## 1) Product summary
A modern sports community platform where users can create player profiles, discover and register for events, join teams, participate in tournaments, follow clubs and leagues, spectate games, rate events and players, and earn experience points (XP) that feed regional and global rankings.

The product should feel casual, social, and competitive at the same time.

## 2) Product goal
Build a simple but sticky sports social platform that encourages:
- more local event participation
- easier player discovery and team formation
- better visibility for clubs, leagues, and tournaments
- community engagement through ratings, posts, achievements, and rankings

## 3) Primary user types

### A. Casual player
Wants to build a profile, find nearby sports events, join teams, register, and track progress.

### B. Competitive player
Wants rankings, skill indicators, achievements, tournament history, and player discovery.

### C. Spectator
Wants to browse events, view brackets, follow players/teams, and attend as a viewer.

### D. Event organizer / club admin
Wants to create events, manage registrations, form brackets, publish schedules, and promote sponsors.

### E. Community admin / platform admin
Wants moderation, reports, category management, event approvals, featured content, and sponsor controls.

## 4) Core product pillars
1. **Profiles** — player identity, sports interests, achievements, stats, and social presence.
2. **Events** — discovery, registration, participation, brackets, and attendance.
3. **Community** — clubs, leagues, teams, posts, ratings, and follow relationships.
4. **Progression** — XP, achievements, rankings, badges, and activity history.
5. **Discovery** — nearby events, sport subscriptions, friend activity, and recommendations.

## 5) Recommended MVP scope
Keep MVP intentionally narrow so Codex can build a coherent first release.

### MVP modules

#### 5.1 Authentication and onboarding
- Email/social sign up
- Login/logout
- Role selection during onboarding:
  - player
  - spectator
  - organizer
- Select favorite sports
- Select region/location
- Optional profile photo and bio

#### 5.2 User profiles
- Public user profile
- Display name, avatar, location/region, sports followed
- Player/spectator/organizer badge(s)
- XP total and level
- Achievements earned in-app
- Real-life achievements section (manual entry)
- Joined clubs/communities
- Event participation history

#### 5.3 Sports categories and subscriptions
- Browse sports categories
- Subscribe/follow sports
- Personalized feed of events by selected sports
- Notification preferences per sport

#### 5.4 Event discovery
- Browse upcoming events
- Filter by:
  - sport
  - date
  - location
  - event type
  - participation type (spectate / play)
- Event cards with:
  - title
  - sport
  - organizer
  - date/time
  - location
  - entry fee note
  - participant slots
  - spectator option

#### 5.5 Event details
- Event description
- Organizer/club info
- participants list
- teams list (if team-based)
- sponsors section
- schedule summary
- simple forecast/bracket preview placeholder
- register button
- spectate button

#### 5.6 Event registration
- Register as participant
- Register as spectator
- Join as individual or team member
- Invite friends to team
- View registration status
- Cancel registration before event cutoff

#### 5.7 Clubs / communities / leagues
- Browse clubs and communities
- Join/leave club
- Club page includes:
  - description
  - sports covered
  - members
  - upcoming events
  - recent posts

#### 5.8 Social activity feed (lightweight MVP)
- Simple post/feed model
- Users and clubs can post updates
- Like/react to posts
- Comment optional for MVP (or defer to phase 2)
- “Friends joined this event” style feed items

#### 5.9 XP, badges, and rankings
Users earn XP for actions such as:
- profile completion
- joining a sport
- registering for events
- attending events
- posting updates
- rating an event
- inviting friends
- joining a club

MVP ranking views:
- global leaderboard
- regional leaderboard
- by sport leaderboard

#### 5.10 Ratings and reviews
- Rate events after participation or attendance
- Rate players after a completed event (light moderation rules)
- Basic average rating display on profiles/events

#### 5.11 Organizer tools (MVP-lite)
- Create event
- Edit event
- Set participant limit
- Set team mode (solo / team)
- Add fee note text
- Publish event
- See registrants list

## 6) Features to defer to phase 2
These are strong ideas, but should not block MVP:
- advanced tournament bracket generation
- skill-based matchmaking engine
- direct messaging / chat
- social media account linking/import
- friend graph and contact sync
- in-app payments
- sponsor self-service portal
- live score updates
- push notification campaigns
- moderation workflow dashboard
- real-time tournament forecasting
- team captain management flows
- check-in QR system
- attendance validation by GPS or QR
- advanced analytics dashboards

## 7) User stories

### Player stories
- As a player, I want to create a profile so others can see my sports interests and achievements.
- As a player, I want to discover events near me by sport and date.
- As a player, I want to join an event as an individual or part of a team.
- As a player, I want to earn XP and badges for being active.
- As a player, I want to view rankings for my region and my sports.

### Spectator stories
- As a spectator, I want to browse events and attend without joining as a competitor.
- As a spectator, I want to see who is participating and preview teams/brackets.
- As a spectator, I want to rate events after attending.

### Organizer stories
- As an organizer, I want to create an event and manage registrations.
- As an organizer, I want to show event details, fees, sponsors, and participant limits.
- As an organizer, I want to see who registered and whether they joined as individuals or teams.

### Club stories
- As a club, I want to post tournaments and grow a community around our sport.
- As a club, I want members to follow us and join our events.

## 8) Suggested navigation

### Main navigation
- Home
- Discover
- Events
- Clubs
- Rankings
- Profile

### Profile tabs
- Overview
- Achievements
- Events
- Posts
- Ratings

### Event tabs
- Details
- Participants
- Teams
- Schedule
- Ratings

## 9) Minimal data model

### users
- id
- email
- display_name
- avatar_url
- bio
- region_id
- role_flags
- xp_total
- level
- created_at

### sports
- id
- name
- slug
- icon

### user_sports
- id
- user_id
- sport_id
- skill_level(optional)
- is_following

### clubs
- id
- name
- description
- region_id
- owner_user_id
- avatar_url

### club_members
- id
- club_id
- user_id
- role

### events
- id
- title
- description
- sport_id
- organizer_type
- organizer_id
- region_id
- venue_name
- start_at
- end_at
- event_type
- team_mode
- capacity
- spectator_capacity(optional)
- entry_fee_note
- status
- created_by

### event_registrations
- id
- event_id
- user_id
- registration_type (participant/spectator)
- team_id(optional)
- status
- checked_in(optional)

### teams
- id
- event_id
- name
- captain_user_id
- skill_band(optional)

### team_members
- id
- team_id
- user_id
- status

### posts
- id
- author_type
- author_id
- body
- image_url(optional)
- related_event_id(optional)
- created_at

### achievements
- id
- name
- description
- icon
- xp_reward

### user_achievements
- id
- user_id
- achievement_id
- earned_at

### ratings
- id
- reviewer_user_id
- subject_type (event/player)
- subject_id
- score
- comment(optional)
- created_at

### xp_ledger
- id
- user_id
- action_type
- points
- reference_type
- reference_id
- created_at

## 10) XP model (simple starter version)
Use a ledger so rules can change later without rewriting history.

Suggested starter rules:
- Complete profile: +50
- Follow a sport: +10
- Join a club: +20
- Register for event: +25
- Attend event: +50
- Post update: +10
- Rate event: +10
- Invite friend who joins: +20
- Organizer publishes event: +40

## 11) Business rules
- A user can be both a spectator and participant across different events.
- Only organizers or club admins can create official club events.
- Any user may create a local community event in MVP if moderation is enabled.
- A player can only rate another player after both were part of the same completed event.
- XP should be granted once per qualified action according to rules.
- Rankings should be computed from XP totals, with optional filters by region and sport.

## 12) Non-functional requirements
- Mobile responsive from day one
- Fast load times on event and profile pages
- Clear permissions between public data and private account data
- Image uploads for avatars and event banners
- Basic auditability for registrations and XP grants
- Clean, modern UI with low clutter
- Accessible form controls and readable contrast

## 13) MVP success criteria
The MVP is successful if users can:
1. sign up and create a profile
2. follow sports and discover events
3. create and publish simple events
4. register as spectator or participant
5. join clubs and view leaderboards
6. earn XP from meaningful actions

## 14) Risks to control early
- Overbuilding the social layer too early
- Overbuilding tournament logic before stable registration flows
- Complex rating systems causing toxicity/moderation issues
- Trying to support every sport-specific rule in v1
- Building native mobile too early before the core UX is validated

## 15) Recommended delivery phases

### Phase 1 — Foundation
- auth
- onboarding
- profile
- sport subscriptions
- event discovery
- event creation
- event registration
- clubs
- basic rankings

### Phase 2 — Engagement
- feed/posts
- ratings
- achievements
- better notifications
- improved organizer tools

### Phase 3 — Competitive expansion
- tournament brackets
- skill grouping
- advanced leaderboards
- check-in and attendance verification
- live event state
