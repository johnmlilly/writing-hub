import { and, db, eq, like, or, Post, Status } from 'astro:db';
import type { Destination } from './constants';

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

function rowToPost(row: { Post: typeof Post.$inferSelect; Status: typeof Status.$inferSelect | null }): PostWithStatus {
	return {
		id: row.Post.id,
		title: row.Post.title,
		content: row.Post.content,
		statusId: row.Post.statusId,
		status: row.Status?.name ?? 'draft',
		destination: row.Post.destination,
		tags: (row.Post.tags as string[]) ?? [],
		createdAt: row.Post.createdAt,
		updatedAt: row.Post.updatedAt,
	};
}

export async function listPosts(filters: PostFilters = {}): Promise<PostWithStatus[]> {
	const conditions = [];
	if (filters.statusId) conditions.push(eq(Post.statusId, filters.statusId));
	if (filters.destination) conditions.push(eq(Post.destination, filters.destination));
	if (filters.q) {
		conditions.push(or(like(Post.title, `%${filters.q}%`), like(Post.content, `%${filters.q}%`)));
	}

	const rows = await db
		.select()
		.from(Post)
		.leftJoin(Status, eq(Post.statusId, Status.id))
		.where(conditions.length > 0 ? and(...conditions) : undefined);
	let posts = rows.map(rowToPost);

	if (filters.tag) {
		posts = posts.filter((p) => p.tags.includes(filters.tag!));
	}

	return posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getPost(id: number): Promise<PostWithStatus | null> {
	const rows = await db
		.select()
		.from(Post)
		.leftJoin(Status, eq(Post.statusId, Status.id))
		.where(eq(Post.id, id));
	return rows.length > 0 ? rowToPost(rows[0]) : null;
}

export async function createPost(input: PostInput): Promise<number> {
	const now = new Date();
	const result = await db
		.insert(Post)
		.values({
			title: input.title,
			content: input.content ?? '',
			statusId: input.statusId ?? 1,
			destination: input.destination ?? 'personal',
			tags: input.tags ?? [],
			createdAt: now,
			updatedAt: now,
		})
		.returning({ id: Post.id });
	return result[0].id;
}

export async function updatePost(id: number, input: Partial<PostInput>): Promise<void> {
	await db
		.update(Post)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(Post.id, id));
}

export async function deletePost(id: number): Promise<void> {
	await db.delete(Post).where(eq(Post.id, id));
}

export async function listStatuses(): Promise<{ id: number; name: string }[]> {
	return db.select().from(Status);
}
