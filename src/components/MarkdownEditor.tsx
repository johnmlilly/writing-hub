import { marked } from 'marked';
import { useMemo, useState } from 'react';

interface Props {
	name: string;
	initialValue?: string;
}

export default function MarkdownEditor({ name, initialValue = '' }: Props) {
	const [value, setValue] = useState(initialValue);
	const [showPreview, setShowPreview] = useState(false);

	const html = useMemo(() => marked.parse(value, { async: false }), [value]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="text-sm text-neutral-400">Content</span>
				<div className="flex gap-1 text-xs">
					<button
						type="button"
						onClick={() => setShowPreview(false)}
						className={`rounded px-2 py-1 transition ${
							!showPreview ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-200'
						}`}
					>
						Write
					</button>
					<button
						type="button"
						onClick={() => setShowPreview(true)}
						className={`rounded px-2 py-1 transition ${
							showPreview ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-200'
						}`}
					>
						Preview
					</button>
				</div>
			</div>

			<textarea
				name={name}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				rows={16}
				hidden={showPreview}
				className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
			/>

			{showPreview && (
				<div
					className="prose-invert min-h-64 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm [&_a]:text-blue-400 [&_code]:text-amber-300 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:my-2"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			)}
		</div>
	);
}
