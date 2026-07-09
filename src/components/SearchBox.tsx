import { useEffect, useRef, useState } from 'react';

interface SearchResult {
	id: number;
	title: string;
	status: string;
	destination: string;
}

export default function SearchBox() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<SearchResult[]>([]);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			setOpen(false);
			return;
		}
		const controller = new AbortController();
		const timer = setTimeout(async () => {
			const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
				signal: controller.signal,
			});
			if (res.ok) {
				setResults(await res.json());
				setOpen(true);
			}
		}, 200);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [query]);

	useEffect(() => {
		function onClickOutside(e: MouseEvent) {
			if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
		}
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, []);

	return (
		<div ref={containerRef} className="relative">
			<input
				type="search"
				placeholder="Search posts…"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onFocus={() => results.length > 0 && setOpen(true)}
				className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
			/>
			{open && (
				<ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 py-1 shadow-lg">
					{results.length === 0 ? (
						<li className="px-3 py-2 text-sm text-neutral-500">No matches</li>
					) : (
						results.map((r) => (
							<li key={r.id}>
								<a
									href={`/edit/${r.id}`}
									className="block px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
								>
									{r.title}
									<span className="ml-2 text-xs text-neutral-500">
										{r.status} · {r.destination}
									</span>
								</a>
							</li>
						))
					)}
				</ul>
			)}
		</div>
	);
}
