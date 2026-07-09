/**
 * One-time script to create the single user (signups are disabled in the app).
 *
 * Usage:
 *   npx @better-auth/cli migrate   # first, create auth tables
 *   npx tsx scripts/create-user.ts <email> <password> [name]
 */
import { betterAuth } from 'better-auth';
import { LibsqlDialect } from '@libsql/kysely-libsql';

const [email, password, name = 'John'] = process.argv.slice(2);

if (!email || !password) {
	console.error('Usage: npx tsx scripts/create-user.ts <email> <password> [name]');
	process.exit(1);
}

const auth = betterAuth({
	database: {
		dialect: new LibsqlDialect({
			url: process.env.BETTER_AUTH_DB_URL ?? 'file:./auth.db',
			authToken: process.env.BETTER_AUTH_DB_TOKEN || undefined,
		}),
		type: 'sqlite',
	},
	emailAndPassword: {
		enabled: true,
	},
});

const result = await auth.api.signUpEmail({
	body: { email, password, name },
});

console.log('User created:', result.user.email);
