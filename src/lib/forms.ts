import { DESTINATIONS, type Destination } from './constants';
import type { PostInput } from './db';

export function parsePostForm(form: FormData): PostInput | { error: string } {
	const title = form.get('title');
	if (typeof title !== 'string' || !title.trim()) {
		return { error: 'Title is required' };
	}

	const destination = form.get('destination');
	if (typeof destination !== 'string' || !DESTINATIONS.includes(destination as Destination)) {
		return { error: 'Invalid destination' };
	}

	const statusId = Number(form.get('statusId'));
	if (!Number.isInteger(statusId) || statusId < 1) {
		return { error: 'Invalid status' };
	}

	const content = form.get('content');
	const tagsRaw = form.get('tags');
	const tags =
		typeof tagsRaw === 'string'
			? tagsRaw
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: [];

	return {
		title: title.trim(),
		content: typeof content === 'string' ? content : '',
		statusId,
		destination: destination as Destination,
		tags,
	};
}
