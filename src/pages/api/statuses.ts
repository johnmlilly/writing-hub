import type { APIRoute } from 'astro';
import { listStatuses } from '../../lib/db';

export const GET: APIRoute = async () => {
	return Response.json(await listStatuses());
};
