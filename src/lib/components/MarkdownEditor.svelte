<script>
	import { onMount, onDestroy } from "svelte";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Highlight from "@tiptap/extension-highlight";
	import Typography from "@tiptap/extension-typography";
	import Link from "@tiptap/extension-link";
	import Image from "@tiptap/extension-image";
	import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
	import Placeholder from "@tiptap/extension-placeholder";
	import { Markdown } from "tiptap-markdown";
	import { all, createLowlight } from "lowlight";
	import "highlight.js/styles/github-dark.css";

	// Create lowlight instance
	const lowlight = createLowlight(all);

	export let content = "";
	export let title = "";
	export let height = "min-h-[500px]";
	export let placeholder = "Write your story...";

	let element;
	let editor;

	// Convert a file/blob to a base64 string
	function blobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(blob);
		});
	}

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					codeBlock: false, // We use CodeBlockLowlight instead
				}),
				Highlight,
				Typography,
				Link.configure({
					openOnClick: false,
				}),
				Image,
				CodeBlockLowlight.configure({
					lowlight,
				}),
				Placeholder.configure({
					placeholder: placeholder,
				}),
				Markdown.configure({
					html: false, // We want pure markdown output
					transformPastedText: true,
					transformCopiedText: true,
				}),
			],
			content: content,
			editorProps: {
				attributes: {
					class: "prose prose-invert max-w-none focus:outline-none min-h-[inherit]",
				},
				handlePaste: (view, event, slice) => {
					const items = event.clipboardData?.items;
					if (items) {
						for (const item of items) {
							if (item.type.indexOf("image") === 0) {
								event.preventDefault();
								const blob = item.getAsFile();
								if (blob) {
									blobToBase64(blob).then((base64) => {
										const { schema } = view.state;
										const node = schema.nodes.image.create({
											src: base64,
										});
										const transaction =
											view.state.tr.replaceSelectionWith(
												node,
											);
										view.dispatch(transaction);
									});
									return true;
								}
							}
						}
					}
					return false;
				},
				handleDrop: (view, event, slice, moved) => {
					if (
						!moved &&
						event.dataTransfer &&
						event.dataTransfer.files &&
						event.dataTransfer.files.length > 0
					) {
						const files = event.dataTransfer.files;
						for (const file of files) {
							if (file.type.indexOf("image") === 0) {
								event.preventDefault();
								blobToBase64(file).then((base64) => {
									const { schema } = view.state;
									const node = schema.nodes.image.create({
										src: base64,
									});
									const transaction =
										view.state.tr.replaceSelectionWith(
											node,
										);
									view.dispatch(transaction);
								});
								return true;
							}
						}
					}
					return false;
				},
			},
			onUpdate: ({ editor }) => {
				// Get markdown content
				content = editor.storage.markdown.getMarkdown();
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	// Update editor content if prop changes externally (and not by the editor itself)
	$: if (editor && content !== editor.storage.markdown.getMarkdown()) {
		// This check is a bit simplistic and might cause cursor jumps if we're not careful.
		// Ideally, we only update if the content is significantly different or if we know it came from outside.
		// For now, we'll assume one-way binding from editor to content is the primary flow,
		// but if we need to load initial content, onMount handles it.
		// If we need to reset content, we might need a better check.
		// Let's stick to onMount for initial load to avoid cursor jumping issues during typing.
		// If dynamic updates are needed, we'd need to diff or check focus.
	}
</script>

<div
	class="w-full flex flex-col bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-lg overflow-hidden shadow-lg"
>
	{#if editor}
		<div
			class="flex items-center gap-2 p-2 border-b border-zinc-700 bg-zinc-800 overflow-x-auto"
		>
			<button
				on:click={() => editor.chain().focus().toggleBold().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive('bold')
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Bold"
			>
				<strong>B</strong>
			</button>
			<button
				on:click={() => editor.chain().focus().toggleItalic().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive('italic')
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Italic"
			>
				<em>I</em>
			</button>
			<button
				on:click={() => editor.chain().focus().toggleStrike().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive('strike')
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Strike"
			>
				<s>S</s>
			</button>
			<div class="w-px h-6 bg-zinc-600 mx-1"></div>
			<button
				on:click={() =>
					editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'heading',
					{ level: 1 },
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="H1"
			>
				H1
			</button>
			<button
				on:click={() =>
					editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'heading',
					{ level: 2 },
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="H2"
			>
				H2
			</button>
			<button
				on:click={() =>
					editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'heading',
					{ level: 3 },
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="H3"
			>
				H3
			</button>
			<div class="w-px h-6 bg-zinc-600 mx-1"></div>
			<button
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'bulletList',
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Bullet List"
			>
				• List
			</button>
			<button
				on:click={() =>
					editor.chain().focus().toggleOrderedList().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'orderedList',
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Ordered List"
			>
				1. List
			</button>
			<div class="w-px h-6 bg-zinc-600 mx-1"></div>
			<button
				on:click={() => editor.chain().focus().toggleCodeBlock().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'codeBlock',
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Code Block"
			>
				&lt;/&gt;
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBlockquote().run()}
				class="p-2 rounded hover:bg-zinc-700 {editor.isActive(
					'blockquote',
				)
					? 'bg-zinc-700 text-cyan-400'
					: 'text-zinc-400'}"
				title="Blockquote"
			>
				""
			</button>
		</div>
	{/if}

	<div
		class="flex-1 overflow-y-auto bg-zinc-800 p-4 cursor-text"
		on:click={() => editor?.chain().focus().run()}
	>
		<div bind:this={element} class="{height} outline-none"></div>
	</div>
</div>

<style>
	/* Custom styles for the editor content to match the theme */
	:global(.ProseMirror) {
		outline: none;
	}
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: #6b7280;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
