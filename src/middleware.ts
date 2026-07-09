import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

const PUBLIC_PATHS = ['/login'];

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (pathname.startsWith('/api/auth/')) {
		return next();
	}

	const session = await auth.api.getSession({
		headers: context.request.headers,
	});

	context.locals.user = session?.user ?? null;
	context.locals.session = session?.session ?? null;

	if (PUBLIC_PATHS.includes(pathname)) {
		if (session && pathname === '/login') {
			return context.redirect('/');
		}
		return next();
	}

	if (!session) {
		if (pathname.startsWith('/api/')) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		return context.redirect('/login');
	}

	return next();
});
