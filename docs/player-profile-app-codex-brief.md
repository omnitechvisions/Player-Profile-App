# Codex Build Brief — Player Profile App

Use this brief as the source of truth for the first implementation.

## Project goal
Build a clean, modern, responsive sports community web app where users can:
- create player profiles
- follow sports
- discover and register for events
- join clubs
- earn XP from activity
- view rankings
- create simple community or club events
- register as participant or spectator

The design should feel minimal, modern, and social, not corporate.

## Product boundaries
This is an **MVP**, not the final full product.

Do **not** build the following in the first pass unless explicitly asked later:
- full tournament bracket engine
- real-time chat
- in-app payments
- advanced recommendation engine
- deep social media integrations
- live scoring system
- complex moderation center
- native mobile app

## Primary stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase for database, auth, and storage

## Build priorities

### Priority 1 — foundation
1. Project setup
2. Authentication
3. Onboarding
4. Public/private profile pages
5. Sports categories and follows
6. Event list + filters
7. Event details page
8. Event creation page
9. Event registration flow
10. Basic club pages
11. XP + leaderboard

### Priority 2 — engagement
12. Lightweight post feed
13. Ratings for events and players
14. Achievement display
15. In-app notifications placeholder

## Required UX principles
- mobile responsive
- clean spacing
- minimal clutter
- card-based layouts
- obvious primary actions
- accessible forms
- easy first-time onboarding
- avoid overloading the homepage

## Main routes to build
- /
- /auth/login
- /auth/signup
- /onboarding
- /discover
- /events
- /events/[eventId]
- /events/create
- /clubs
- /clubs/[clubId]
- /rankings
- /profile/[username]
- /settings

## Suggested home/discover experience
Home page should quickly help the user:
- see upcoming events in their sports
- see popular nearby events
- see clubs to join
- see leaderboard highlights
- see friend/community activity later

## Data entities
Implement the following tables or equivalent models:
- users
- sports
- user_sports
- clubs
- club_members
- events
- event_registrations
- teams
- team_members
- posts
- achievements
- user_achievements
- ratings
- xp_ledger

## Required MVP capabilities

### Authentication and onboarding
- sign up with email
- sign in
- sign out
- choose role(s): player, spectator, organizer
- choose region
- choose favorite sports
- upload avatar optionally

### Profile
- display avatar, bio, region, sports, XP, level
- show achievements and event history
- show joined clubs
- support public profile view

### Events
- list events
- filter by sport/date/location/type
- event details page
- participant/spectator registration
- organizer can create and edit own events
- entry fee should be informational text only
- event status states: draft, published, completed, cancelled

### Clubs
- list clubs
- club detail page
- join/leave club
- show upcoming club events

### XP and rankings
- track XP via ledger entries
- show total XP and derived level
- rankings page with filters:
  - global
  - region
  - sport

### Ratings
- users can rate events after completion
- users can rate players only if both were in same completed event
- keep initial scoring simple (1–5)

## Core business rules
- users may act as spectator for some events and participant for others
- any organizer can create an event
- ordinary users may create local community events if role/permission allows
- only event participants or spectators can rate an event they joined
- XP must be granted through controlled server-side logic
- leaderboard should be based on total XP

## Engineering rules
- use TypeScript throughout
- define shared schema/validation with Zod
- keep components small and reusable
- keep server actions or API handlers thin and secure
- isolate Supabase access utilities cleanly
- prefer simple architecture over clever architecture
- write seed scripts for demo data
- include `.env.example`
- include README setup steps

## Suggested database and security rules
- apply Row Level Security to user-owned and organizer-owned tables
- ensure only owners or permitted roles can edit profiles/events/clubs they manage
- public reads allowed for published events, public profiles, public clubs, and leaderboards
- private account settings remain restricted

## Demo seed data requirements
Seed enough data so the app looks alive:
- 20 users
- 8 sports
- 10 clubs
- 24 events
- 6 completed events for ratings/demo history
- XP ledger entries for rankings
- varied regions

## Visual design direction
- modern sports/lifestyle feel
- neutral base colors with one strong accent
- rounded cards
- soft shadows
- bold section headers
- clean list/detail views
- no overly gamified cartoon style

## Delivery expectation
Implement the MVP in iterations.

### Iteration 1
- auth
- onboarding
- profile
- sports follows

### Iteration 2
- events listing
- event detail
- event creation
- registration

### Iteration 3
- clubs
- rankings
- XP ledger integration

### Iteration 4
- ratings
- lightweight feed
- UI polish
- seed/demo content

## Definition of done for MVP
The app is ready for demo when a new user can:
1. sign up
2. complete onboarding
3. follow sports
4. browse events
5. create or join an event
6. join a club
7. see XP increase after actions
8. view public rankings and profiles

## README requirements for Codex
The generated repository must include:
- local setup instructions
- environment variable list
- Supabase setup steps
- database migration/seed steps
- deployment notes for Vercel
- known future enhancements

## Important implementation note
Favor a polished, smaller MVP over a wide but shallow build. Core flows must feel complete.
