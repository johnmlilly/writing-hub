import { db, Post, Status } from 'astro:db';

export default async function seed() {
	await db.insert(Status).values([
		{ id: 1, name: 'draft' },
		{ id: 2, name: 'in-progress' },
		{ id: 3, name: 'ready' },
		{ id: 4, name: 'published' },
	]);

	await db.insert(Post).values([
		{
			title: 'Welcome to the writing hub',
			content: '# First note\n\nThis is a seeded draft to test the dashboard.',
			statusId: 1,
			destination: 'personal',
			tags: ['idea'],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			title: 'Essay on slow mornings',
			content: 'Working through an outline about unhurried starts.',
			statusId: 2,
			destination: 'blog',
			tags: ['essay', 'draft-2'],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			title: 'Thread: tools I actually use',
			content: '1. Astro\n2. Tailwind\n3. Turso',
			statusId: 3,
			destination: 'social',
			tags: ['thread'],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]);
}
