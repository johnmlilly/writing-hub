import type { APIRoute } from 'astro';
import { createPost } from '../../lib/db';

export const POST: APIRoute = async ({ request, redirect }) => {
	const form = await request.formData().catch(() => null);
	const title = form?.get('title');
	if (typeof title !== 'string' || !title.trim()) {
		return Response.json({ error: 'title is required' }, { status: 400 });
	}

	const content = form?.get('content');
	await createPost({
		title: title.trim(),
		content: typeof content === 'string' ? content : '',
	});
	return redirect('/', 303);
};
