<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { marked } from "marked";
    import { browser } from "$app/environment";
    import hljs from "highlight.js/lib/core"; // Import core
    import javascript from "highlight.js/lib/languages/javascript"; // Example languages
    import xml from "highlight.js/lib/languages/xml"; // For HTML
    import css from "highlight.js/lib/languages/css";
    import python from "highlight.js/lib/languages/python";
    import markdown from "highlight.js/lib/languages/markdown";
    import json from "highlight.js/lib/languages/json";
    import 'highlight.js/styles/github-dark.css'; // Or your preferred dark theme

    // Register languages you want to support
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('xml', xml); // For html
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('markdown', markdown);
    hljs.registerLanguage('json', json);
    // Add more languages as needed, e.g., 'java', 'csharp', 'php', 'ruby', 'go', 'rust', 'typescript', 'bash' etc.
    // import java from 'highlight.js/lib/languages/java'; hljs.registerLanguage('java', java);

    // Props
    export let content = "";
    export let title = "";
    export let height = "h-[calc(100vh-220px)]"; // Default height

    // State variables
    let previewHtml = "";
    let editHtml = ""; // This will be populated by converting markdown 'content'
    let isDragging = false;
    let splitPosition = 50; // Initial split position in percentage
    let containerWidth;
    let startX;
    let editableElement; // Bound to the contenteditable div
    let DOMPurify;
    let isUpdatingFromContent = false; // Flag to prevent update loops
    let savedRange = null; // To save and restore cursor position

    // Generate a short hash for an image (if needed, though not used for storage now)
    function generateImageHash() {
        const chars = "abcdefghijklmnopqrstuvwxyz0000000000";
        const timestamp = Date.now().toString(36);
        let hash = "img_" + timestamp;
        for (let i = 0; i < 4; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    }

    // Get file size from base64
    function getBase64Size(base64) {
        const base64Data = base64.split(",")[1] || base64;
        return Math.round((base64Data.length * 3) / 4);
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    // Convert markdown to HTML suitable for the contenteditable div
    function markdownToEditHtml(markdown) {
        if (!markdown) return "";
        try {
            // Use marked to parse markdown to HTML
            let html = marked.parse(markdown);

            // Enhance images for editing: make them non-editable themselves but part of editable flow
            html = html.replace(
                /<img([^>]*?)src="(data:image\/[^"]+)"([^>]*?)>/g,
                (match, before, src, after) => {
                    const altMatch = match.match(/alt="([^"]*)"/);
                    const alt = altMatch ? altMatch[1] : "";
                    const filenameMatch = match.match(/data-filename="([^"]*)"/);
                    const filename = filenameMatch ? filenameMatch[1] : "";

                    return `<img${before}src="${src}"${after} contenteditable="false" data-base64="${src}" data-alt="${alt}" data-filename="${filename}" style="max-width: 200px; height: auto; margin: 10px 0; border: 2px solid #4a5568; border-radius: 8px; cursor: pointer;">`;
                },
            );

            // Enhance code blocks for editing: ensure language classes are present
            // This relies on marked producing <pre><code> elements.
            html = html.replace(
                /<pre><code([^>]*)class="language-(\S+)"([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
                (match, beforeClass, lang, afterClass, codeContent) => {
                    // Ensure the language class is correctly applied and HTML entities are handled
                    const escapedCode = codeContent
                        .replace(/&amp;/g, "&")
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">");
                    return `<pre><code${beforeClass}class="language-${lang}"${afterClass}>${escapedCode}</code></pre>`;
                },
            );

            return html;
        } catch (error) {
            console.error("Error parsing markdown for editing:", error);
            return `<p>Error parsing markdown: ${error.message}</p>`;
        }
    }

    // Convert HTML from contenteditable back to markdown
    function htmlToMarkdown(html) {
        if (!html) return "";
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        let markdown = "";

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                switch (tagName) {
                    case "h1":
                        return `# ${processChildren(node)}\n\n`;
                    case "h2":
                        return `## ${processChildren(node)}\n\n`;
                    case "h3":
                        return `### ${processChildren(node)}\n\n`;
                    case "h4":
                        return `#### ${processChildren(node)}\n\n`;
                    case "h5":
                        return `##### ${processChildren(node)}\n\n`;
                    case "h6":
                        return `###### ${processChildren(node)}\n\n`;
                    case "p":
                        const pContent = processChildren(node);
                        return pContent ? `${pContent}\n\n` : "\n"; // Handle empty p tags from new lines
                    case "strong":
                    case "b":
                        return `**${processChildren(node)}**`;
                    case "em":
                    case "i":
                        return `*${processChildren(node)}*`;
                    case "code":
                        // Check if it's an inline code or part of a pre block
                        if (
                            node.parentElement &&
                            node.parentElement.tagName.toLowerCase() === "pre"
                        ) {
                            return node.textContent; // Return raw text content for code within pre
                        }
                        return `\`${processChildren(node)}\``;
                    case "pre":
                        const codeBlock = node.querySelector("code");
                        const langMatch =
                            codeBlock &&
                            codeBlock.className.match(/language-(\S+)/);
                        const lang = langMatch ? langMatch[1] : "";
                        const codeContent = codeBlock
                            ? codeBlock.textContent
                            : processChildren(node); // Fallback if no code tag
                        return `\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;
                    case "blockquote":
                        return `> ${processChildren(node).replace(/\n/g, "\n> ")}\n\n`; // Ensure multi-line blockquotes are correct
                    case "ul":
                        return `${processChildren(node)}\n`;
                    case "ol":
                        return `${processChildren(node)}\n`;
                    case "li":
                        const parent = node.parentNode.tagName.toLowerCase();
                        if (parent === "ul") {
                            return `- ${processChildren(node)}\n`;
                        } else if (parent === "ol") {
                            const index =
                                Array.from(node.parentNode.children).indexOf(
                                    node,
                                ) + 1;
                            return `${index}. ${processChildren(node)}\n`;
                        }
                        return processChildren(node); // Should not happen for valid HTML
                    case "a":
                        const href = node.getAttribute("href") || "";
                        const text = processChildren(node);
                        // Check if it's a file link (base64 data URL with filename)
                        if (href.startsWith("data:") && node.hasAttribute("data-filename")) {
                            return `[${node.getAttribute("data-filename")}](${href})`;
                        }
                        return `[${text}](${href})`;
                    case "img":
                        const src =
                            node.getAttribute("data-base64") ||
                            node.getAttribute("src") ||
                            "";
                        const alt =
                            node.getAttribute("data-alt") ||
                            node.getAttribute("alt") ||
                            "";
                        // Use data-filename if available, otherwise fallback to alt
                        const filename = node.getAttribute("data-filename") || alt;
                        return `![${filename}](${src})`; // Use filename for the alt text in markdown
                    case "br":
                        return "\n";
                    case "hr":
                        return "\n---\n\n";
                    default:
                        return processChildren(node); // Process children of other wrapper elements
                }
            }
            return "";
        }

        function processChildren(node) {
            let result = "";
            for (let child of node.childNodes) {
                result += processNode(child);
            }
            return result;
        }

        markdown = processChildren(tempDiv);
        // Clean up: remove leading/trailing whitespace and reduce all newlines to a maximum of one
        return markdown.replace(/\n{2,}/g, "\n\n").trim(); // Allow maximum of two newlines
    }

    // Save current cursor position
    function saveSelection() {
        if (browser && editableElement) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                savedRange = selection.getRangeAt(0).cloneRange();
            } else {
                savedRange = null;
            }
        }
    }

    // Restore saved cursor position
    function restoreSelection() {
        if (browser && savedRange && editableElement) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedRange);
            // Ensure the restored selection is within the editable element
            if (!editableElement.contains(savedRange.startContainer) || !editableElement.contains(savedRange.endContainer)) {
                // If not, clear the selection or move to end
                selection.removeAllRanges();
                const range = document.createRange();
                range.selectNodeContents(editableElement);
                range.collapse(false); // Move cursor to the end
                selection.addRange(range);
            }
            savedRange = null; // Clear after use
        }
    }

    // Reactive statement: Update editHtml when content prop changes (e.g., loaded from outside)
    // This should only run if the change isn't coming from the editor itself
    $: {
        if (!isUpdatingFromContent && editableElement) {
            saveSelection(); // Save before update
            const currentEditorMarkdown = htmlToMarkdown(editableElement.innerHTML);
            if (currentEditorMarkdown !== content) {
                editHtml = markdownToEditHtml(content);
            }
        } else if (!editableElement && content) {
            // Initial load before editableElement is bound
            editHtml = markdownToEditHtml(content);
        }
    }

    // Reactive statement: Update previewHtml whenever content changes
    $: {
        try {
            if (browser && DOMPurify) {
                const parsedHtml = marked.parse(
                    content || "",
                );
                previewHtml = DOMPurify.sanitize(parsedHtml);

                // Apply syntax highlighting after DOMPurify.sanitize
                // Use afterUpdate for this, as the elements need to be in the DOM
            } else {
                previewHtml = marked.parse(
                    content || "",
                );
            }
        } catch (error) {
            console.error("Error parsing markdown for preview:", error);
            previewHtml = `<p>Error parsing markdown: ${error.message}</p>`;
        }
    }

    // After Svelte has updated the DOM, apply highlight.js
    afterUpdate(() => {
        if (browser) {
            // Only highlight code blocks within the preview area
            const previewElement = document.querySelector('.preview-area');
            if (previewElement) {
                previewElement.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }
    });


    // Handle input in the contenteditable div (typing, deleting, etc.)
    function handleEditableInput() {
        if (!editableElement) return;

        // Save selection *before* updating content, as content update re-renders HTML
        saveSelection();

        // Set flag to indicate the 'content' prop is being updated from the editor itself
        isUpdatingFromContent = true;

        const currentHtml = editableElement.innerHTML;
        const newMarkdown = htmlToMarkdown(currentHtml);

        // Update the Svelte 'content' prop. This will trigger the preview update.
        content = newMarkdown;

        // Reset the flag after Svelte has processed the changes.
        // Use a microtask to ensure it happens after the current sync updates.
        Promise.resolve().then(() => {
            isUpdatingFromContent = false;
            restoreSelection(); // Restore selection after Svelte updates are complete
        });
    }

    // Resizable split functionality
    function handleDragStart(event) {
        event.preventDefault(); // Prevent text selection during drag
        isDragging = true;
        startX = event.clientX;
        document.body.style.cursor = "col-resize"; // Indicate resize cursor globally
        document.body.classList.add("select-none"); // Prevent text selection globally
    }

    function handleDrag(event) {
        if (!isDragging || !containerWidth) return;
        const dx = event.clientX - startX;
        // Calculate new position based on pixel delta, then convert back to percentage
        const currentEditorWidthPx = (splitPosition / 100) * containerWidth;
        let newEditorWidthPx = currentEditorWidthPx + dx;

        // Clamp the position between 20% and 80%
        const minWidthPx = 0.2 * containerWidth;
        const maxWidthPx = 0.8 * containerWidth;
        newEditorWidthPx = Math.max(
            minWidthPx,
            Math.min(newEditorWidthPx, maxWidthPx),
        );

        splitPosition = (newEditorWidthPx / containerWidth) * 100;
        startX = event.clientX; // Update startX for next delta calculation
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = "default"; // Reset cursor
        document.body.classList.remove("select-none");
    }

    // Function to insert plain text at the current cursor position
    function insertTextAtCursor(text) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents(); // Delete selected content if any

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move cursor after inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Handle paste events
    async function handlePaste(event) {
        event.preventDefault(); // Crucially prevent default paste behavior

        const items = event.clipboardData?.items;
        if (!items) return;

        let pastedContentHandled = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.indexOf("image") === 0) {
                const blob = item.getAsFile();
                if (!blob) continue;

                try {
                    const base64 = await blobToBase64(blob);
                    const fileExtension = blob.type.split("/")[1] || "png";
                    const filename = `pasted-image-${Date.now()}.${fileExtension}`;

                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents(); // Clear any selected text before inserting image

                        const img = document.createElement("img");
                        img.src = base64;
                        img.alt = filename;
                        img.setAttribute("data-base64", base64); // Store base64 for markdown conversion
                        img.setAttribute("data-alt", filename);
                        img.setAttribute("data-filename", filename); // Store original filename
                        img.contentEditable = "false"; // Make the image itself not directly editable
                        img.style.cssText =
                            "max-width: 200px; height: auto; margin: 10px 0; border: 2px solid #4a5568; border-radius: 8px; cursor: pointer;";

                        range.insertNode(img);

                        // Move cursor after the inserted image
                        range.setStartAfter(img);
                        range.setEndAfter(img);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        pastedContentHandled = true;
                    }
                } catch (error) {
                    console.error("Failed to process pasted image:", error);
                    // Optionally insert plain text error or notify user
                }
            } else if (item.type === "text/plain") {
                const text = await new Promise((resolve) =>
                    item.getAsString(resolve),
                );
                insertTextAtCursor(text); // Use helper to insert text correctly
                pastedContentHandled = true;
            }
            // Add handling for other types like text/html if desired
        }

        if (pastedContentHandled) {
            handleEditableInput(); // Manually trigger input to update content and preview
        }
    }

    // Handle drag and drop files
    async function handleDrop(event) {
        event.preventDefault(); // Prevent default browser file handling
        event.stopPropagation(); // Stop event from bubbling up

        if (!editableElement) return;

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return;

        let filesHandled = false;
        const selection = window.getSelection();
        const originalRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filename = file.name;

            try {
                const base64 = await blobToBase64(file);
                const isImage = file.type.startsWith("image/");

                if (originalRange) {
                    selection.removeAllRanges(); // Clear existing selection before inserting
                    selection.addRange(originalRange); // Restore to insert at drop point
                } else {
                    // If no existing selection, try to put at end of content
                    const range = document.createRange();
                    range.selectNodeContents(editableElement);
                    range.collapse(false); // Move cursor to the end
                    selection.removeAllRanges();
                    selection.addRange(range);
                }


                if (isImage) {
                    const img = document.createElement("img");
                    img.src = base64;
                    img.alt = filename;
                    img.setAttribute("data-base64", base64);
                    img.setAttribute("data-alt", filename);
                    img.setAttribute("data-filename", filename); // Store original filename
                    img.contentEditable = "false";
                    img.style.cssText = "max-width: 200px; height: auto; margin: 10px 0; border: 2px solid #4a5568; border-radius: 8px; cursor: pointer;";
                    insertNodeAtCursor(img);
                } else {
                    // For non-image files, insert a markdown link with data URL
                    const linkText = `[${filename}](${base64})`;
                    insertTextAtCursor(linkText);
                }
                filesHandled = true;
            } catch (error) {
                console.error(`Failed to process dropped file ${filename}:`, error);
                insertTextAtCursor(`[Error processing ${filename}]`); // Inform user
            }
        }

        if (filesHandled) {
            handleEditableInput(); // Trigger content update
        }
    }

    function insertNodeAtCursor(node) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents(); // Delete selected content if any
        range.insertNode(node);

        // Move cursor after inserted node
        range.setStartAfter(node);
        range.setEndAfter(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }


    // Convert blob to base64
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
        });
    }

    // Export functions (if needed by parent components)
    export function getContentWithImages() {
        return content; // Returns the current markdown content
    }

    export function getStorageInfo() {
        // This function is a no-op as local storage for images is removed
        return {
            imageCount: 0,
            totalSize: 0,
            formattedSize: "0 B",
        };
    }

    export function clearImageData() {
        // No-op
    }

    onMount(async () => {
        if (browser) {
            try {
                const DOMPurifyModule = await import("dompurify");
                DOMPurify = DOMPurifyModule.default;
            } catch (e) {
                console.error("Failed to load DOMPurify:", e);
                // Fallback or error handling if DOMPurify doesn't load
            }
            // Initial population of editHtml if content is already set
            // and editableElement is available
            if (content && editableElement) {
                editHtml = markdownToEditHtml(content);
            } else if (content) {
                editHtml = markdownToEditHtml(content); // For initial render if element not yet bound
            }
        }
        // Add mousemove and mouseup listeners to the window for drag functionality
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup", handleDragEnd);
    });

    onDestroy(() => {
        // Clean up global event listeners
        if (browser) {
            window.removeEventListener("mousemove", handleDrag);
            window.removeEventListener("mouseup", handleDragEnd);
        }
    });
</script>

<svelte:window bind:innerWidth={containerWidth} />

<div class="w-full flex flex-col bg-zinc-900 text-zinc-100">
    <div
        class={`flex ${height} border border-zinc-700 rounded-lg overflow-hidden shadow-lg`}
    >
        <div
            class="h-full overflow-hidden relative"
            style="width: {splitPosition}%;"
        >
            <div
                bind:this={editableElement}
                contenteditable="true"
                on:input={handleEditableInput}
                on:paste={handlePaste}
                on:drop={handleDrop}
                on:dragover|preventDefault
                class="w-full h-full p-4 bg-zinc-800 text-zinc-100 overflow-auto focus:outline-none prose prose-invert max-w-none editor-area"
                style="white-space: pre-wrap; word-break: break-word; caret-color: #06b6d4; line-height: 1.4;"
                data-placeholder="Write your markdown here..."
                aria-label="Markdown editor"
            >
                {@html editHtml}
            </div>
        </div>

        <button
            type="button"
            class="w-2 h-full bg-zinc-700 hover:bg-blue-600 focus:bg-blue-500 transition-colors duration-150 cursor-col-resize flex items-center justify-center group focus:outline-none"
            on:mousedown={handleDragStart}
            on:keydown={(e) => {
                if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                    e.preventDefault();
                    const delta = e.key === "ArrowLeft" ? -1 : 1; // Adjust sensitivity as needed
                    const newPosition = Math.max(
                        20,
                        Math.min(80, splitPosition + delta * 2),
                    ); // Increase step for arrow keys
                    splitPosition = newPosition;
                }
            }}
            aria-label="Resize editor panels"
            title="Drag to resize or use arrow keys"
        >
            <div
                class="w-0.5 h-8 bg-zinc-500 group-hover:bg-blue-300 rounded-full"
            ></div>
        </button>

        <div
            class="h-full overflow-auto bg-zinc-800 preview-area"
            style="width: calc(100% - {splitPosition}% - 0.5rem); margin-left: 0.5rem;"
            aria-live="polite"
        >
            <div class="p-4">
                <h2
                    class="text-2xl font-semibold pb-2 mb-4 border-b border-zinc-700 text-zinc-200"
                >
                    {title || "Untitled Post"}
                </h2>
                <div class="prose prose-invert max-w-none">
                    {@html previewHtml}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Import highlight.js theme */
    @import 'highlight.js/styles/github-dark.css'; /* Choose a dark theme that matches your zinc-900 background */


    :global(.prose) {
        color: inherit; /* Or specific color for prose content */
    }
    :global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
        color: inherit;
    }
    :global(.prose a) {
        color: #38bdf8; /* Example link color */
    }
    :global(.prose code) {
        background-color: #374151; /* bg-zinc-700 */
        color: #e5e7eb; /* text-zinc-200 */
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 85%;
        border-radius: 3px;
    }
    :global(.prose pre) {
        background-color: #1f2937; /* bg-zinc-800 or a darker shade */
        color: #d1d5db; /* text-zinc-300 */
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
    }
    /* Highlight.js will add its own classes to pre code blocks */
    :global(.prose pre code) {
        background-color: transparent;
        padding: 0;
        font-size: inherit;
        color: inherit;
    }

    /* Editor-specific line height adjustments */
    .editor-area {
        line-height: 1.4 !important;
    }

    /* Override prose line heights in editor */
    :global(.editor-area .prose),
    :global(.editor-area .prose p),
    :global(.editor-area .prose div) {
        line-height: 1.4 !important;
    }

    :global(.editor-area .prose h1) {
        line-height: 1.2 !important;
        margin-top: 0.5em !important;
        margin-bottom: 0.5em !important;
    }

    :global(.editor-area .prose h2) {
        line-height: 1.2 !important;
        margin-top: 0.5em !important;
        margin-bottom: 0.5em !important;
    }

    :global(.editor-area .prose h3) {
        line-height: 1.2 !important;
        margin-top: 0.5em !important;
        margin-bottom: 0.5em !important;
    }

    :global(
        .editor-area .prose h4,
        .editor-area .prose h5,
        .editor-area .prose h6
    ) {
        line-height: 1.3 !important;
        margin-top: 0.5em !important;
        margin-bottom: 0.5em !important;
    }

    /* Placeholder for contenteditable div */
    [contenteditable="true"]:empty:before {
        content: attr(data-placeholder);
        color: #6b7280; /* zinc-500 */
        font-style: italic;
        pointer-events: none; /* Important so clicks pass through */
        display: block; /* Ensure it takes up space */
    }

    [contenteditable="true"]:focus {
        outline: none; /* Handled by Tailwind's focus rings if needed */
    }

    /* Styles for images within the contenteditable area (already in your code, kept for consistency) */
    :global([contenteditable] img) {
        max-width: 200px !important; /* Keep editor images smaller for manageability */
        height: auto;
        margin: 10px 0;
        border: 2px solid #4a5568; /* zinc-600 */
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    /* General image styling for preview (prose plugin might handle this) */
    :global(.prose img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    :global(.prose img:hover),
    :global([contenteditable] img:hover) {
        outline: 2px solid #06b6d4; /* cyan-500 for hover effect */
        transform: scale(1.01); /* Slight zoom on hover */
    }

</style>