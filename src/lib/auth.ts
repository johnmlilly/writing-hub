import { LibsqlDialect } from '@libsql/kysely-libsql';
import { betterAuth } from 'better-auth';

// import.meta.env is populated by Astro/Vite from .env; process.env covers
// non-Vite contexts (better-auth CLI, scripts run with tsx).
function env(key: string): string | undefined {
	return import.meta.env?.[key] ?? process.env[key] ?? undefined;
}

const dialect = new LibsqlDialect({
	url: env('BETTER_AUTH_DB_URL') ?? 'file:./auth.db',
	authToken: env('BETTER_AUTH_DB_TOKEN') || undefined,
});

export const auth = betterAuth({
	baseURL: env('BETTER_AUTH_URL'),
	secret: env('BETTER_AUTH_SECRET'),
	database: {
		dialect,
		type: 'sqlite',
	},
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
	},
});
