# Current Feature

Writing Hub MVP

## Status

In Progress

## Goals

Full MVP of the private writing hub:

- Tailwind v4 + Netlify adapter + SSR, dark neutral layout
- Astro DB: `Status` table (draft/in-progress/ready/published, seeded) + `Post` table (title, content, statusId, destination, tags, timestamps)
- Better Auth: email/password, single user, signups disabled, middleware guard, `/login`
- Data layer (`src/lib/db.ts`) + API routes: posts CRUD, statuses, search, quick capture
- Pages: dashboard (grouped by status, filters + search), `/new`, `/quick`, `/edit/[id]` with markdown live preview (React island)

## Notes

- Better Auth uses its own libSQL connection (same Turso DB in prod, local `auth.db` file in dev) — its tables are separate from Astro DB's managed schema
- Destinations (`blog | social | personal | archive`) are an app constant, not a DB table
- Plan file: `~/.claude/plans/curious-nibbling-hopcroft.md`

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-07-08 — Feature documented, branch `feature/writing-hub-mvp` created, implementation started
- 2026-07-08 — All phases implemented: Tailwind v4 + Netlify SSR, Astro DB schema/seed, Better Auth (migrated, local auth.db), data layer + 5 API routes, dashboard/new/quick/edit pages with markdown preview. `astro build` (local DB) and `astro check` pass. Pending: user creates login via `scripts/create-user.ts`, browser verification
- 2026-07-08 — DISCOVERED: @astrojs/db removed/unmaintained in Astro 7 — no `astro db push` CLI, can't push schema to Turso. Decision: migrate to plain @libsql/client (raw SQL, no ORM). MIGRATION IN PROGRESS, stopped mid-way:
  - DONE: `db/schema.sql` (tables + status seed), `src/lib/env.ts` (shared env helper), `src/lib/db.ts` rewritten on @libsql/client (same function signatures — API routes/pages unaffected), `scripts/setup-db.ts` (applies schema locally or to Turso), `src/lib/auth.ts` uses shared env helper
  - TODO next session: remove `db()` integration + import from `astro.config.mjs`; `npm uninstall @astrojs/db`; delete `db/config.ts` + `db/seed.ts`; change build script back to plain `astro build` (drop --remote); add `DATABASE_URL`/`DATABASE_TOKEN` to `.env` (Turso values already there under ASTRO_DB_* names) and `.env.example`; run `npx tsx scripts/setup-db.ts` locally AND with Turso env vars (= the schema push); rebuild + `astro check`; update `context/project-overview.md` (no more Astro DB); seed sample posts optional
  - NOTE: old seed data gone with db/seed.ts — statuses seed now lives in schema.sql
