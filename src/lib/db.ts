import { createClient, type Row } from '@libsql/client';
import type { Destination } from './constants';
import { env } from './env';

const client = createClient({
	url: env('DATABASE_URL') ?? 'file:./data.db',
	authToken: env('DATABASE_TOKEN') || undefined,
});

export interface PostWithStatus {
	id: number;
	title: string;
	content: string;
	statusId: number;
	status: string;
	destination: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface PostFilters {
	statusId?: number;
	destination?: string;
	tag?: string;
	q?: string;
}

export interface PostInput {
	title: string;
	content?: string;
	statusId?: number;
	destination?: Destination;
	tags?: string[];
}

function rowToPost(row: Row): PostWithStatus {
	return {
		id: Number(row.id),
		title: String(row.title),
		content: String(row.content),
		statusId: Number(row.status_id),
		status: String(row.status ?? 'draft'),
		destination: String(row.destination),
		tags: JSON.parse(String(row.tags ?? '[]')),
		createdAt: new Date(String(row.created_at)),
		updatedAt: new Date(String(row.updated_at)),
	};
}

const SELECT_POSTS = `
	SELECT posts.*, statuses.name AS status
	FROM posts
	LEFT JOIN statuses ON posts.status_id = statuses.id
`;

export async function listPosts(filters: PostFilters = {}): Promise<PostWithStatus[]> {
	const where: string[] = [];
	const args: (string | number)[] = [];

	if (filters.statusId) {
		where.push('posts.status_id = ?');
		args.push(filters.statusId);
	}
	if (filters.destination) {
		where.push('posts.destination = ?');
		args.push(filters.destination);
	}
	if (filters.q) {
		where.push('(posts.title LIKE ? OR posts.content LIKE ?)');
		args.push(`%${filters.q}%`, `%${filters.q}%`);
	}

	const sql = `${SELECT_POSTS}
		${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
		ORDER BY posts.updated_at DESC`;

	const result = await client.execute({ sql, args });
	let posts = result.rows.map(rowToPost);

	if (filters.tag) {
		posts = posts.filter((p) => p.tags.includes(filters.tag!));
	}

	return posts;
}

export async function getPost(id: number): Promise<PostWithStatus | null> {
	const result = await client.execute({
		sql: `${SELECT_POSTS} WHERE posts.id = ?`,
		args: [id],
	});
	return result.rows.length > 0 ? rowToPost(result.rows[0]) : null;
}

export async function createPost(input: PostInput): Promise<number> {
	const now = new Date().toISOString();
	const result = await client.execute({
		sql: `INSERT INTO posts (title, content, status_id, destination, tags, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
		args: [
			input.title,
			input.content ?? '',
			input.statusId ?? 1,
			input.destination ?? 'personal',
			JSON.stringify(input.tags ?? []),
			now,
			now,
		],
	});
	return Number(result.rows[0].id);
}

export async function updatePost(id: number, input: Partial<PostInput>): Promise<void> {
	const sets: string[] = ['updated_at = ?'];
	const args: (string | number)[] = [new Date().toISOString()];

	if (input.title !== undefined) {
		sets.push('title = ?');
		args.push(input.title);
	}
	if (input.content !== undefined) {
		sets.push('content = ?');
		args.push(input.content);
	}
	if (input.statusId !== undefined) {
		sets.push('status_id = ?');
		args.push(input.statusId);
	}
	if (input.destination !== undefined) {
		sets.push('destination = ?');
		args.push(input.destination);
	}
	if (input.tags !== undefined) {
		sets.push('tags = ?');
		args.push(JSON.stringify(input.tags));
	}

	args.push(id);
	await client.execute({
		sql: `UPDATE posts SET ${sets.join(', ')} WHERE id = ?`,
		args,
	});
}

export async function deletePost(id: number): Promise<void> {
	await client.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [id] });
}

export async function listStatuses(): Promise<{ id: number; name: string }[]> {
	const result = await client.execute('SELECT id, name FROM statuses ORDER BY id');
	return result.rows.map((row) => ({ id: Number(row.id), name: String(row.name) }));
}
