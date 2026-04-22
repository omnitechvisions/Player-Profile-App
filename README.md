# Player Profile App

Player Profile is a sports community MVP built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, and Supabase. The UI stays lightweight and card-driven while auth, profiles, events, and registrations now run through real Supabase-backed flows.

## Included in this pass

- SSR-compatible Supabase setup using `@supabase/ssr`
- Email/password sign up, sign in, and sign out
- Session-aware shell navigation
- Auth-linked `profiles` table synced to `auth.users`
- Live onboarding updates for profile fields and sport follows
- Live event listing, event detail, event creation, and registration flows
- Live public profiles, public clubs, homepage aggregates, discover aggregates, and XP leaderboard reads
- RLS-backed migrations for profiles, events, registrations, XP ledger, clubs, ratings, and related tables
- Seed SQL for sports, achievements, demo profiles, clubs, events, registrations, XP, and posts
- Mock fallback retained only for unfinished slices such as the lightweight feed and placeholder settings surfaces

## First-time setup

Use Node.js 20 or later. Supabase JS has deprecated Node 18, and local auth tooling is more reliable on Node 20+.

1. Install dependencies.

```bash
npm install
```

2. Copy the environment template into a local file.

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`.

- `NEXT_PUBLIC_SUPABASE_URL`
- one browser-safe key:
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Apply the database schema and content seed.

If you use the Supabase CLI:

```bash
supabase db reset
```

If you are not using the Supabase CLI, run these SQL files manually in order:

- `supabase/migrations/001_init.sql`
- `supabase/seed.sql`

5. Create the demo auth accounts after the schema exists.

```bash
npm run seed:demo-auth
```

6. Start the app.

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` is intentionally server-only. Do not expose it to the browser or prefix it with `NEXT_PUBLIC_`.

## Supabase notes

- The app uses `@supabase/ssr` browser/server/middleware clients.
- The app accepts either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. If both are set, the code will use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` first.
- Profiles are tied directly to `auth.users`.
- Public profile reads are allowed when a profile is marked public.
- Event reads are public only for published or completed events unless the organizer is the viewer.
- Event registrations are owned by the registering user.
- XP grants are performed through server actions and use the service role client when `SUPABASE_SERVICE_ROLE_KEY` is present.
- Username uniqueness is enforced during onboarding and usernames must be lowercase `a-z`, `0-9`, `_`, or `-`.

## Auth redirect assumptions

- The app currently uses standard email/password sign-in and sign-out only.
- No custom `redirectTo` values are passed in code for auth flows.
- After sign-in, the app redirects to `/onboarding` or `/` based on whether the profile is complete.
- After sign-out, the app redirects to `/auth/login`.
- For local development, add `http://localhost:3000` to Supabase Auth allowed URLs and site URL settings.
- For production, add your deployed Vercel domain to the same Supabase Auth URL settings before testing login.
- The code does not hardcode localhost URLs for runtime navigation or auth callbacks.

## Demo seed credentials

The demo auth seed script creates accounts with emails in the form `username@demo.local`.

- Example: `mayaedge@demo.local`
- Password: `Password123!`

## Demo auth seeding flow

Demo password users are not created by raw SQL inserts into `auth.users`.

Use this supported flow:

1. Apply `supabase/migrations/001_init.sql`.
2. Apply `supabase/seed.sql`.
3. Run:

```bash
npm run seed:demo-auth
```

That script uses Supabase Auth Admin `createUser` to create valid password-login demo accounts and keeps the auth creation step separate from the public content seed.

## Validated end-to-end test steps

1. Start the app with `npm run dev`.
2. Sign in with `mayaedge@demo.local` and `Password123!`.
3. Open `/events`, choose a published event, and register as either participant or spectator.
4. Refresh the event detail page and confirm:
   - the registration banner still shows your saved registration type
   - participant and spectator counts reflect the saved row in `public.event_registrations`
5. Sign out, sign back in with the same account, reopen the same event, and confirm the saved registration type still appears.
6. Check `public.xp_ledger` in Supabase and confirm a new `Event registration (...)` row was created the first time you joined that event.
7. Open `/profile/mayaedge` and confirm the profile content is live-backed:
   - XP total matches `profiles.xp_total`
   - recent XP activity matches `xp_ledger`
   - clubs match `club_members`
   - event history reflects `events` plus `event_registrations`
8. Open `/`, `/discover`, `/clubs`, and `/rankings` and confirm those surfaces render live Supabase-backed clubs, events, and leaderboard data.

## Repairing malformed old demo auth users

If older demo users were created by directly writing incomplete rows into `auth.users`, run:

- `supabase/repairs/001_repair_demo_auth_users.sql`

That one-time repair normalizes these Auth-managed fields for `@demo.local` users:

- `confirmation_token`
- `recovery_token`
- `email_change`
- `email_change_token_current`
- `email_change_token_new`

The safer long-term fix is to recreate demo users with:

```bash
npm run seed:demo-auth
```

## Troubleshooting

- If sign-in or onboarding keeps redirecting unexpectedly, confirm that:
  - `NEXT_PUBLIC_SUPABASE_URL` is set
  - one of `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set
  - `SUPABASE_SERVICE_ROLE_KEY` is set before running `npm run seed:demo-auth`
  - the SQL migration has been applied
  - middleware is running and cookies are enabled in your browser
  - your Supabase Auth site URL and allowed redirect URLs include the exact local or deployed app URL you are using
- If demo password login fails, recreate the demo auth users with `npm run seed:demo-auth` and then rerun `supabase/seed.sql`.
- If registration works but XP does not increase, add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
- If pages fall back to mock content unexpectedly, check the browser console and server logs for Supabase query errors, missing tables, or expired auth cookies.
- If you change SQL locally, re-run `supabase db reset` before testing the flow again.
- If `npm run build` fails on `.next/trace` with `EPERM`, stop any running `next dev` process, delete `.next`, and rerun the build.

## Production deployment checklist

### Vercel

1. Import the repository into Vercel.
2. Set these environment variables in the Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - one of `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy after saving environment variables.
4. Confirm the production deployment can reach Supabase from server actions and middleware.
5. Confirm the build is running on Node 20+.

### Supabase

1. Apply the database schema to the production database.
2. Apply `supabase/seed.sql` only if you want demo content in production or a staging/demo environment.
3. Run `npm run seed:demo-auth` from a trusted local/admin environment only if you want demo login accounts available in that environment.
4. In Supabase Auth settings, add your Vercel production URL to:
   - site URL
   - allowed redirect URLs
5. If you also use Vercel preview deployments for auth testing, add the preview domain pattern or specific preview URLs in Supabase Auth as well.

### Production smoke test

1. Open the deployed site.
2. Sign in with a demo user if demo auth seeding was enabled.
3. Confirm onboarding redirect behavior still works.
4. Confirm event registration persists after refresh.
5. Confirm XP writes appear in `xp_ledger`.
6. Confirm `/`, `/discover`, `/clubs`, `/rankings`, and `/profile/[username]` all render live data.

## Final deployment assumptions and blockers

- No code currently assumes localhost-specific runtime URLs.
- Auth/session behavior in production depends on Supabase Auth site URL and allowed redirect URLs matching the deployed Vercel domain.
- Middleware-based session refresh is required in production; if middleware is disabled or bypassed, auth state can appear inconsistent across server-rendered pages.
- `SUPABASE_SERVICE_ROLE_KEY` is required in production if you want server-side XP ledger writes to continue working.
- Demo auth users are not created automatically by Vercel deploys. If you want demo login accounts in staging or production, run `npm run seed:demo-auth` separately with admin credentials.
- Rankings filters, club join/leave actions, the lightweight feed, and settings are still MVP limitations rather than deployment blockers.

## Current known limitations

- Club join and leave buttons are still presentational; club detail reads are live-backed, but club membership writes are not wired yet.
- Rankings filters are still static UI controls; the table is live-backed, but region and sport filtering is not yet interactive.
- The homepage feed and some non-critical shell content still use seeded/mock-style content rather than live post aggregation.
- Event registration currently grants XP only on the first registration for an event and does not yet support unregister flows.
- Settings remains a placeholder surface and does not yet persist profile or notification preference changes.
