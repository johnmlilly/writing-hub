import type { APIRoute } from 'astro';
import { createPost, listPosts } from '../../lib/db';
import { DESTINATIONS, type Destination } from '../../lib/constants';

export const GET: APIRoute = async ({ url }) => {
	const posts = await listPosts({
		statusId: url.searchParams.has('statusId') ? Number(url.searchParams.get('statusId')) : undefined,
		destination: url.searchParams.get('destination') ?? undefined,
		tag: url.searchParams.get('tag') ?? undefined,
		q: url.searchParams.get('q') ?? undefined,
	});
	return Response.json(posts);
};

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body?.title || typeof body.title !== 'string') {
		return Response.json({ error: 'title is required' }, { status: 400 });
	}
	if (body.destination && !DESTINATIONS.includes(body.destination)) {
		return Response.json({ error: 'invalid destination' }, { status: 400 });
	}

	const id = await createPost({
		title: body.title,
		content: typeof body.content === 'string' ? body.content : undefined,
		statusId: typeof body.statusId === 'number' ? body.statusId : undefined,
		destination: body.destination as Destination | undefined,
		tags: Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === 'string') : undefined,
	});
	return Response.json({ id }, { status: 201 });
};
