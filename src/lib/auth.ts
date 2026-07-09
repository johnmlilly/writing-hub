import { LibsqlDialect } from '@libsql/kysely-libsql';
import { betterAuth } from 'better-auth';
import { env } from './env';

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
