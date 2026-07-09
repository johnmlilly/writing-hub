// import.meta.env is populated by Astro/Vite from .env; process.env covers
// non-Vite contexts (better-auth CLI, scripts run with tsx).
export function env(key: string): string | undefined {
	return import.meta.env?.[key] ?? process.env[key] ?? undefined;
}
