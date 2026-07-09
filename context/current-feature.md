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
