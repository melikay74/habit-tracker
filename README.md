# Habit Tracker

Daily check-ins, tracked as streaks. Built as a portfolio piece focused on
full-stack fundamentals: auth, a properly-modeled database, and server-side
data mutations — kept to one core entity so the whole loop stays polished
instead of half-finished.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Prisma** + **Postgres** ([Neon](https://neon.tech) free tier works well)
- **Auth.js** (NextAuth) — GitHub + Google OAuth, database sessions
- **Tailwind CSS**
- Deploy target: **Vercel**

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a free Postgres database (e.g. on [neon.tech](https://neon.tech)) and copy the connection string.

3. Copy the env template and fill it in:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — from a [GitHub OAuth App](https://github.com/settings/developers), callback URL `http://localhost:3000/api/auth/callback/github`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from [Google Cloud Console](https://console.cloud.google.com/apis/credentials), callback URL `http://localhost:3000/api/auth/callback/google`

   You only need one provider working to sign in — feel free to skip the other while developing.

4. Push the schema to your database:
   ```bash
   npx prisma db push
   ```

5. Run it:
   ```bash
   npm run dev
   ```

## Project structure

```
prisma/schema.prisma        User/Habit/CheckIn models + Auth.js tables
src/lib/auth.ts             Auth.js config (providers, session callback)
src/lib/prisma.ts           Prisma client singleton
src/lib/streaks.ts          Pure streak-calculation functions (unit test this)
src/app/page.tsx            Dashboard — habit grid or sign-in screen
src/app/habit/[id]/page.tsx Habit detail — full calendar heatmap
src/app/actions/habits.ts   Server Actions: createHabit, toggleCheckIn, archiveHabit
src/components/             GrowthRing, CalendarHeatmap, CheckInButton, etc.
```

## Design notes

The signature visual is `GrowthRing` — a circular progress ring that fills
in as a streak builds and completes a lap every 30 days, rather than the
GitHub-style square grid every habit app defaults to. `CalendarHeatmap` still
exists on the detail page for longer-range history, so both a "right now"
and a "over time" view are represented.

Colors and type live in `tailwind.config.ts` as named tokens (`moss`,
`amber`, `sage`, etc.) rather than raw hex values scattered through
components — worth pointing at in an interview as a small but deliberate
choice.

## What's intentionally left out (and why it's worth mentioning in interviews)

Scoped out to keep this a weekend build rather than an open-ended one:
- No reminders/notifications — would need a cron job or edge function
- No multi-week analytics beyond the two visualizations already here
- No social features (sharing streaks, following friends)
- No habit categories/tags

Any of these make a good "what I'd build next" answer if it comes up.

## Talking points this project demonstrates

- **Data integrity via schema, not just UI**: the `@@unique([habitId, date])`
  constraint on `CheckIn` is what actually prevents a double check-in — the
  UI toggle is a convenience, not the source of truth.
- **Optimistic UI done by hand**: `CheckInButton` flips state before the
  server confirms, and rolls back only on failure — without reaching for a
  data-fetching library.
- **Auth-scoped data access**: every Server Action re-derives the user id
  from the session and filters every query by it, so one user can't touch
  another's data by guessing an id.
- **Pure, testable business logic**: `calculateStreaks` has no DB or React
  dependency — it's the one function in the app worth writing real unit
  tests for.
