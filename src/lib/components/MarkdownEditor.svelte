<script>
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { marked } from 'marked';
	import { browser } from '$app/environment';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import xml from 'highlight.js/lib/languages/xml'; // For HTML
	import css from 'highlight.js/lib/languages/css';
	import python from 'highlight.js/lib/languages/python';
	import markdown from 'highlight.js/lib/languages/markdown';
	import json from 'highlight.js/lib/languages/json';
	import 'highlight.js/styles/github-dark.css';

	// Register languages
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('python', python);
	hljs.registerLanguage('markdown', markdown);
	hljs.registerLanguage('json', json);

	// --- PROPS ---
	export let content = '';
	export let title = '';
	export let height = 'h-[calc(100vh-220px)]';
	// mode: 'split' (default shows editor + preview), 'edit' (editor only), 'preview' (preview only)
	export let mode = 'split';

	// --- STATE ---
	let previewHtml = '';
	let isDragging = false;
	let splitPosition = 50; // percentage width of editor in split mode
	let containerWidth;
	let startX;
	let textareaElement; // Reference to the textarea element
	let DOMPurify;

	// --- REACTIVE UPDATES ---

	// Reactive statement: Update previewHtml whenever content changes. This is now the core logic.
	$: if (mode !== 'edit') { // Only build preview when needed
		try {
			if (browser && DOMPurify) {
				const parsedHtml = marked.parse(content || '');
				previewHtml = DOMPurify.sanitize(parsedHtml);
			} else {
				previewHtml = marked.parse(content || '');
			}
		} catch (error) {
			console.error('Error parsing markdown for preview:', error);
			previewHtml = `<p>Error parsing markdown: ${error.message}</p>`;
		}
	}

	// After Svelte has updated the DOM, apply syntax highlighting.
	afterUpdate(() => {
		if (mode === 'edit') return; // no preview to highlight
		const previewElement = document.querySelector('.preview-area');
		if (previewElement) {
			previewElement.querySelectorAll('pre code').forEach((block) => {
				hljs.highlightElement(block);
			});
		}
	});

	// --- EVENT HANDLERS ---

	// Resizable split functionality
	function handleDragStart(event) {
		if (mode !== 'split') return; // dragging only in split mode
		event.preventDefault();
		isDragging = true;
		startX = event.clientX;
		document.body.style.cursor = 'col-resize';
		document.body.classList.add('select-none');
	}

	function handleDrag(event) {
		if (mode !== 'split') return;
		if (!isDragging || !containerWidth) return;
		const dx = event.clientX - startX;
		const currentEditorWidthPx = (splitPosition / 100) * containerWidth;
		let newEditorWidthPx = currentEditorWidthPx + dx;

		const minWidthPx = 0.2 * containerWidth;
		const maxWidthPx = 0.8 * containerWidth;
		newEditorWidthPx = Math.max(minWidthPx, Math.min(newEditorWidthPx, maxWidthPx));

		splitPosition = (newEditorWidthPx / containerWidth) * 100;
		startX = event.clientX;
	}

	function handleDragEnd() {
		if (!isDragging) return;
		isDragging = false;
		document.body.style.cursor = 'default';
		document.body.classList.remove('select-none');
	}

	// Helper to insert text at the textarea's cursor position
	function insertTextAtCursor(text) {
		if (!textareaElement) return;

		const start = textareaElement.selectionStart;
		const end = textareaElement.selectionEnd;
		const originalValue = textareaElement.value;

		// Update the content prop, which will in turn update the textarea's value
		content = originalValue.substring(0, start) + text + originalValue.substring(end);

		// After Svelte updates the DOM, move the cursor to the end of the inserted text
		// Use a microtask to wait for the DOM update
		Promise.resolve().then(() => {
			textareaElement.selectionStart = textareaElement.selectionEnd = start + text.length;
			textareaElement.focus();
		});
	}

	// Handle paste events to upload images
	async function handlePaste(event) {
		if (!event.clipboardData?.items) return;

		for (const item of event.clipboardData.items) {
			if (item.type.indexOf('image') === 0) {
				event.preventDefault(); // Prevent pasting the file path
				const blob = item.getAsFile();
				if (!blob) continue;

				try {
					const base64 = await blobToBase64(blob);
					const filename = `pasted-image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
					const markdownImage = `![${filename}](${base64})`;
					insertTextAtCursor(markdownImage);
				} catch (error) {
					console.error('Failed to process pasted image:', error);
				}
			}
		}
	}

	// Handle dropping files onto the textarea
	async function handleDrop(event) {
		event.preventDefault();
		if (!event.dataTransfer?.files) return;

		for (const file of event.dataTransfer.files) {
			try {
				const base64 = await blobToBase64(file);
				const markdownLink = `![${file.name}](${base64})`;
				insertTextAtCursor(markdownLink);
			} catch (error) {
				console.error(`Failed to process dropped file ${file.name}:`, error);
				insertTextAtCursor(`[Error processing ${file.name}]`);
			}
		}
	}

	// Convert a file/blob to a base64 string
	function blobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(blob);
		});
	}

	// --- LIFECYCLE ---
	onMount(async () => {
		if (browser) {
			try {
				const DOMPurifyModule = await import('dompurify');
				DOMPurify = DOMPurifyModule.default;
			} catch (e) {
				console.error('Failed to load DOMPurify:', e);
			}
		}
		window.addEventListener('mousemove', handleDrag);
		window.addEventListener('mouseup', handleDragEnd);
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('mousemove', handleDrag);
			window.removeEventListener('mouseup', handleDragEnd);
		}
	});
</script>

<svelte:window bind:innerWidth={containerWidth} />

<div class="w-full flex flex-col bg-zinc-900 text-zinc-100">
	<div class={`flex ${height} border border-zinc-700 rounded-lg overflow-hidden shadow-lg`}>
		{#if mode !== 'preview'}
			<div class="h-full overflow-hidden relative" style="width: {mode === 'split' ? splitPosition + '%' : '100%'};">
				<textarea
					bind:this={textareaElement}
					bind:value={content}
					on:paste={handlePaste}
					on:drop={handleDrop}
					on:dragover|preventDefault
					class="w-full h-full p-4 bg-zinc-800 text-zinc-100 resize-none focus:outline-none editor-area"
					style="line-height: 1.5; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;"
					placeholder="Write your markdown here..."
					aria-label="Markdown editor"
				></textarea>
			</div>
		{/if}

		{#if mode === 'split'}
			<button
				type="button"
				class="w-2 h-full bg-zinc-700 hover:bg-blue-600 focus:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center group focus:outline-none"
				on:mousedown={handleDragStart}
				on:keydown={(e) => {
					if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
						e.preventDefault();
						const delta = e.key === 'ArrowLeft' ? -1 : 1;
						const newPosition = Math.max(20, Math.min(80, splitPosition + delta * 2));
						splitPosition = newPosition;
					}
				}}
				aria-label="Resize editor panels"
				title="Drag to resize or use arrow keys"
			>
				<div class="w-0.5 h-8 bg-zinc-500 group-hover:bg-blue-300 rounded-full"></div>
			</button>
		{/if}

		{#if mode !== 'edit'}
			<div
				class="h-full overflow-auto bg-zinc-800 preview-area"
				style="width: {mode === 'split' ? `calc(100% - ${splitPosition}% - 0.5rem)` : '100%'}; margin-left: {mode === 'split' ? '0.5rem' : '0'};"
				aria-live="polite"
			>
				<div class="p-4">
					<h2 class="text-2xl font-semibold pb-2 mb-4 border-b border-zinc-700 text-zinc-200">
						{title || 'Untitled Post'}
					</h2>
					<div class="prose prose-invert max-w-none">
						{@html previewHtml}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	/* All your existing styles for .prose, .preview-area, etc., can remain the same. */
	/* You may want to adjust the textarea style specifically. */
	.editor-area {
		caret-color: #06b6d4;
	}

	.editor-area::placeholder {
		color: #6b7280; /* zinc-500 */
		font-style: italic;
	}

	:global(.prose) {
		color: inherit;
	}
	:global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
		color: inherit;
	}
	:global(.prose a) {
		color: #38bdf8;
	}
	:global(.prose code) {
		background-color: #374151;
		color: #e5e7eb;
		padding: 0.2em 0.4em;
		margin: 0;
		font-size: 85%;
		border-radius: 3px;
	}
	:global(.prose pre) {
		background-color: #1f2937;
		color: #d1d5db;
		padding: 1em;
		border-radius: 6px;
		overflow-x: auto;
	}
	:global(.prose pre code) {
		background-color: transparent;
		padding: 0;
		font-size: inherit;
		color: inherit;
	}
	:global(.prose img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
	}
</style>