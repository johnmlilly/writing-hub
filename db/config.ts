import { column, defineDb, defineTable } from 'astro:db';

const Status = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		name: column.text({ unique: true }),
	},
});

const Post = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		title: column.text(),
		content: column.text({ default: '' }),
		statusId: column.number({ references: () => Status.columns.id, default: 1 }),
		destination: column.text({ default: 'personal' }),
		tags: column.json({ default: [] }),
		createdAt: column.date({ default: new Date() }),
		updatedAt: column.date({ default: new Date() }),
	},
});

export default defineDb({
	tables: { Status, Post },
});
