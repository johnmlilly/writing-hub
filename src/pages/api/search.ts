import type { APIRoute } from 'astro';
import { listPosts } from '../../lib/db';

export const GET: APIRoute = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q) return Response.json([]);
	return Response.json(await listPosts({ q }));
};
