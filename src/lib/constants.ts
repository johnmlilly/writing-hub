export const DESTINATIONS = ['blog', 'social', 'personal', 'archive'] as const;
export type Destination = (typeof DESTINATIONS)[number];

export const STATUS_ORDER = ['draft', 'in-progress', 'ready', 'published'] as const;
export type StatusName = (typeof STATUS_ORDER)[number];
