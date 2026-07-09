/**
 * Creates app tables and seeds statuses. Idempotent (IF NOT EXISTS / OR IGNORE).
 *
 * Local:  npx tsx scripts/setup-db.ts
 * Turso:  DATABASE_URL=libsql://... DATABASE_TOKEN=... npx tsx scripts/setup-db.ts
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';

const url = process.env.DATABASE_URL ?? 'file:./data.db';
const client = createClient({
	url,
	authToken: process.env.DATABASE_TOKEN || undefined,
});

const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf-8');
const statements = schema
	.split(';')
	.map((s) => s.trim())
	.filter(Boolean);

for (const sql of statements) {
	await client.execute(sql);
}

console.log(`Schema applied to ${url}`);
