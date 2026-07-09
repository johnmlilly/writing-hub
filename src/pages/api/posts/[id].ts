import type { APIRoute } from 'astro';
import { deletePost, getPost, updatePost } from '../../../lib/db';
import { DESTINATIONS, type Destination } from '../../../lib/constants';

function parseId(param: string | undefined): number | null {
	const id = Number(param);
	return Number.isInteger(id) && id > 0 ? id : null;
}

export const GET: APIRoute = async ({ params }) => {
	const id = parseId(params.id);
	if (!id) return Response.json({ error: 'invalid id' }, { status: 400 });

	const post = await getPost(id);
	if (!post) return Response.json({ error: 'not found' }, { status: 404 });
	return Response.json(post);
};

export const PUT: APIRoute = async ({ params, request }) => {
	const id = parseId(params.id);
	if (!id) return Response.json({ error: 'invalid id' }, { status: 400 });

	const existing = await getPost(id);
	if (!existing) return Response.json({ error: 'not found' }, { status: 404 });

	const body = await request.json().catch(() => null);
	if (!body) return Response.json({ error: 'invalid body' }, { status: 400 });
	if (body.destination && !DESTINATIONS.includes(body.destination)) {
		return Response.json({ error: 'invalid destination' }, { status: 400 });
	}

	await updatePost(id, {
		...(typeof body.title === 'string' && { title: body.title }),
		...(typeof body.content === 'string' && { content: body.content }),
		...(typeof body.statusId === 'number' && { statusId: body.statusId }),
		...(body.destination && { destination: body.destination as Destination }),
		...(Array.isArray(body.tags) && { tags: body.tags.filter((t: unknown) => typeof t === 'string') }),
	});
	return Response.json({ ok: true });
};

export const DELETE: APIRoute = async ({ params }) => {
	const id = parseId(params.id);
	if (!id) return Response.json({ error: 'invalid id' }, { status: 400 });

	await deletePost(id);
	return Response.json({ ok: true });
};
