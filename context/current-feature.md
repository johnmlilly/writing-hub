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

## Remaining Work

### 1. Local verification (browser)

- [ ] Create local login: `npx tsx scripts/create-user.ts you@email.com <password> "John"`
- [ ] `npm run dev`, then check:
  - [ ] Logged-out `/` redirects to `/login`; bad password rejected; login works
  - [ ] Dashboard groups posts by status; destination pills + tag links filter; search dropdown returns matches
  - [ ] `/quick` creates draft and returns to dashboard
  - [ ] `/new` creates post with status/destination/tags; markdown Write/Preview toggle renders
  - [ ] `/edit/[id]` saves changes, delete (with confirm) works
  - [ ] Logout returns to `/login`

### 2. Turso production setup (one-time)

- [x] App schema pushed: `DATABASE_URL=<turso-url> DATABASE_TOKEN=<token> npx tsx scripts/setup-db.ts` (done 2026-07-08)
- [ ] Auth tables: `BETTER_AUTH_DB_URL=<turso-url> BETTER_AUTH_DB_TOKEN=<token> npx @better-auth/cli migrate -y`
- [ ] Production user: `BETTER_AUTH_DB_URL=<turso-url> BETTER_AUTH_DB_TOKEN=<token> npx tsx scripts/create-user.ts you@email.com <password> "John"`

### 3. Netlify deploy

- [ ] Connect repo at app.netlify.com (or `netlify init`). Build command `npm run build`, publish dir `dist` (auto-detected from adapter)
- [ ] Set environment variables (Site configuration → Environment variables):
  - `DATABASE_URL` = Turso URL (`libsql://…`)
  - `DATABASE_TOKEN` = Turso token
  - `BETTER_AUTH_SECRET` = long random string (same as local `.env`, or new — new one just invalidates sessions)
  - `BETTER_AUTH_URL` = production URL (e.g. `https://<site>.netlify.app`)
  - `BETTER_AUTH_DB_URL` = same Turso URL
  - `BETTER_AUTH_DB_TOKEN` = same Turso token
- [ ] Merge to main / push → Netlify builds and deploys
- [ ] Smoke-test production: login, create/edit/delete a post, search, logout

### 4. Review

- [ ] Code review of AI-generated code (security: middleware coverage, input validation; logic: edge cases; patterns)
- [ ] Mark feature Completed here + final history entry; user commits/merges/deletes branch

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
- 2026-07-08 — Migration to @libsql/client COMPLETED: db() integration removed, @astrojs/db uninstalled, old db/config.ts + db/seed.ts deleted, build script back to plain `astro build`, env vars renamed to DATABASE_URL/DATABASE_TOKEN (.env + .env.example), data.db gitignored, `npm run db:setup` script added. Build + astro check green. Schema applied to local data.db AND pushed to Turso. Remaining work documented above (local browser verification, Turso auth setup, Netlify deploy, review)
