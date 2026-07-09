# Writing Hub — Project Overview

Private, Notion-style hub for personal writing. Capture notes, ideas, and thoughts quickly, then manage and categorize them through statuses, destinations, and tags.

---

## Purpose

A single place to collect and develop writing. Every piece moves through a pipeline (draft → in-progress → ready → published) and is tagged with where it's headed (blog, social, personal, archive). The dashboard groups everything by status so nothing gets lost.

---

## Tech Stack

| Category   | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Astro 7 (SSR, server output)                        |
| Language   | TypeScript (strict)                                 |
| UI         | Tailwind CSS v4 (CSS-based config)                  |
| Database   | Astro DB — Turso/libSQL remote, local SQLite in dev |
| Auth       | Yes — login page + middleware (single user)         |
| Deployment | TBD                                                 |

> Note: the brainstorm chat showed `tailwind.config.mjs` (v3-style) and raw Postgres SQL — both superseded. Tailwind v4 uses CSS `@theme` config (see coding-standards.md); the schema below is implemented as Astro DB tables.

---

## Data Model

```ts
Status {
  id: number (PK)
  name: text (unique)   // draft | in-progress | ready | published
}

Post {
  id: number (PK)
  title: text
  content: text
  statusId: number (FK → Status, default: draft)
  destination: text     // blog | social | personal | archive
  tags: text[]          // stored as JSON in libSQL
  createdAt: date
  updatedAt: date
}
```

Statuses are seeded: `draft`, `in-progress`, `ready`, `published`.

---

## Pages & Routes

| Route             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `/login`          | Login page (middleware guards everything else)       |
| `/`               | Dashboard — posts grouped by status, filterable by tag/destination |
| `/new`            | Create a new post                                    |
| `/quick`          | Quick capture — minimal friction idea entry          |
| `/edit/[id]`      | Edit an existing post                                |
| `/api/login`      | Auth endpoint                                        |
| `/api/posts`      | List/create posts                                    |
| `/api/posts/[id]` | Read/update/delete a post                            |
| `/api/statuses`   | Status list for dropdowns                            |
| `/api/search`     | Search posts                                         |

---

## Project Structure

```
src/
  layouts/
    Layout.astro
  middleware.ts        # auth guard
  lib/
    db.ts              # DB access layer
  pages/
    login.astro
    index.astro        # dashboard
    new.astro
    quick.astro
    edit/[id].astro
    api/
      login.ts
      posts.ts
      posts/[id].ts
      statuses.ts
      search.ts
      quick.ts
```

---

## Design

- Dark mode by default — `bg-neutral-950`, `text-neutral-200`, neutral palette throughout
- Minimal post cards: title, status · destination metadata line, subtle borders (`border-neutral-800`, hover `border-neutral-700`)
- Filter/sort logic lives in the dashboard page

---

## Decisions

- **DB over markdown content collections.** A frontmatter-based `src/content/writing/` approach was considered first, but dropped in favor of Astro DB so posts can be created and edited in-app (`/new`, `/quick`, `/edit/[id]`) rather than by hand-editing files.
- **Statuses as a table** (not an enum) so the pipeline stages can be managed without schema changes; `/api/statuses` feeds the dropdowns.

---

## Dev Workflow Notes

- User runs the dev server (`npm run dev`) — do not run it automatically
- User handles all commits and merges — do not commit or merge, even when asked to close out a feature

---

## Status

Early development — fresh Astro scaffold, features not yet implemented.
