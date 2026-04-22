# Player Profile App — Recommended Tech Stack

## 1) Recommendation summary
For the **first usable MVP**, build this as a **web-first application** and deploy it through GitHub + Vercel, not GitHub Pages.

Why:
- the app needs authentication, database reads/writes, role-based access, and dynamic event/profile pages
- GitHub Pages is a **static site host**, which is fine for a brochure or static demo, but not the best primary host for a full sports community app
- a web-first MVP is faster to share, test, iterate, and hand to Codex than a full mobile-first build

## 2) Recommended MVP stack

### Frontend
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** for modern, low-clutter UI primitives
- **React Hook Form + Zod** for forms and validation

### Backend / platform
- **Supabase**
  - Postgres database
  - Auth
  - Storage
  - Realtime where useful later
  - Edge Functions for server-side logic if needed

### Deployment
- **GitHub** for source control
- **Vercel** for hosting and preview deployments
- **Supabase** as managed backend

### Mapping / location
- Start simple with region/city fields
- Add proper maps later only if clearly needed

### Notifications
- Start with in-app notifications and email notifications
- Push notifications can come later

## 3) Why this stack is the best fit for the first build

### Next.js
Next.js is a React framework for full-stack web applications and supports the App Router, which is the current newer routing model. It also supports multiple deployment modes, but static export has limited feature support compared with server or full-stack deployment. citeturn116432search15turn157992search16turn116432search7turn157992search4

Why it fits this project:
- excellent for modern product-style web apps
- strong routing for profiles, clubs, events, rankings
- easy to structure for Codex
- easy to deploy from GitHub into Vercel
- strong TypeScript support built in citeturn157992search12turn116432search11turn157992search8

### Supabase
Supabase provides Postgres, Auth, Storage, Realtime, APIs, and Edge Functions in one platform, which makes it a strong choice for an MVP with users, profiles, events, ratings, uploads, and leaderboard data. citeturn157992search2turn157992search6turn116432search5turn116432search13

Why it fits this project:
- relational data model suits events, teams, clubs, registrations, ratings
- email/social auth available
- avatars and banners can live in Storage
- Row Level Security can protect user and organizer data at the table level citeturn116432search21turn116432search9

### Vercel instead of GitHub Pages for the live app
GitHub Pages is a static site hosting service that publishes HTML/CSS/JS from a repository. That makes it useful for a landing page or static docs, but less suitable as the main deployment target for this kind of authenticated product. citeturn116432search2turn157992search19turn157992search7

Vercel has first-class deployment guidance for Next.js, including deploying directly from a repository. citeturn157992search8turn157992search4

## 4) Best deployment approach

### Preferred demo deployment
- GitHub repository
- connect repo to Vercel
- configure environment variables for Supabase
- deploy preview builds per branch / PR
- use a seed script for demo data

### What GitHub Pages can still be used for
- marketing landing page
- public project docs
- product roadmap site
- clickable mockup or static prototype

## 5) Mobile path after MVP
If the MVP proves valuable, add a separate mobile app using **Expo + React Native + TypeScript** against the same Supabase backend.

Expo’s docs position it as a React Native framework for building Android, iOS, and web apps from one JavaScript/TypeScript project, and EAS Build is the official path for producing store-ready builds. citeturn157992search1turn157992search9turn157992search25turn157992search5turn157992search13

That means your long-term architecture can be:
- **Phase 1:** Next.js web app + Supabase
- **Phase 2:** Expo mobile app using the same database/auth/backend

This is usually safer than forcing one cross-platform codebase too early.

## 6) Notification strategy
For the MVP:
- in-app notifications
- optional email notifications
- no push requirement on day one

For later mobile expansion:
Expo Notifications provides a unified push notification API for Android and iOS, but push notifications require a development build rather than Expo Go for full use. citeturn116432search0turn116432search4turn116432search8

## 7) Suggested repo structure

```text
player-profile-app/
  app/
    (marketing)/
    auth/
    dashboard/
    discover/
    events/
      [eventId]/
    clubs/
      [clubId]/
    rankings/
    profile/
      [username]/
    settings/
  components/
    ui/
    forms/
    cards/
    feed/
    events/
    profile/
  lib/
    supabase/
    auth/
    validation/
    utils/
    xp/
  db/
    migrations/
    seeds/
  public/
  docs/
    product-scope.md
    tech-stack.md
    codex-brief.md
```

## 8) Recommended libraries
- **@supabase/supabase-js**
- **@supabase/ssr** (or the official current SSR approach for Next.js)
- **zod**
- **react-hook-form**
- **date-fns**
- **lucide-react**
- **tanstack/react-query** only if data patterns become complex

## 9) UI design direction
- dark/light mode optional, but start with light mode
- card-based layout
- large, clean hero sections for discover/events
- minimal top navigation
- chips for sport filters
- profile summaries with clear stat cards
- avoid dashboard clutter
- keep actions obvious: Join, Spectate, Invite, Follow, Rate

## 10) Security basics for Codex to follow
- enforce Row Level Security in Supabase tables
- never trust client-provided role flags blindly
- separate organizer permissions from ordinary users
- use server-side checks for XP grants and sensitive mutations
- store audit-relevant actions (registrations, XP awards, rating submissions)

## 11) Suggested MVP infrastructure decisions
- single region deployment for MVP
- seed database with demo clubs/events/users
- use storage buckets for avatars and banners
- use cron/Edge Functions later for ranking refresh if needed
- keep leaderboard computation simple at first

## 12) What not to do in v1
- no microservices
- no Kubernetes
- no complex event sourcing architecture
- no overengineered AI recommendation engine
- no real-time everywhere by default
- no in-app payments yet

## 13) Final stack decision
If you want the **best balance of speed, modern UX, Codex-friendliness, and easy demo deployment**, use:

- **Next.js + TypeScript + Tailwind + shadcn/ui**
- **Supabase (Postgres + Auth + Storage)**
- **GitHub + Vercel**

Then add **Expo mobile** later if the product gains traction.
