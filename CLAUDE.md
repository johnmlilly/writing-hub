# Francis Roy Lilly

This is a writing hub for personal writing projects. It's meant for me to capture notes, ideas, and thoughts while being able to easily manage and categorize my writing in a Notion style system.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- **Dev server**: `npm run dev` (runs on http://localhost:4321)
    - `build` uses `astro build --remote` — it connects to the remote Astro DB (Turso). Local dev uses a local SQLite DB automatically.
 
- **Build**: `npm run build` (production build (requires --remote for Astro DB)
- **Production server**: `npm run start`
- **Lint**: `npm run lint`

**IMPORTANT:** Do not add Claude to any commit messages