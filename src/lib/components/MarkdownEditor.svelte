<script>
    import { onMount, onDestroy } from "svelte";
    import { marked } from "marked";
    import { browser } from "$app/environment";

    // Props
    export let content = "";
    export let title = "";
    export let height = "h-[calc(100vh-220px)]";

    // Storage key
    const IMAGE_MAP_KEY = "blog-image-map";

    // State variables
    let previewHtml = "";
    let editHtml = "";
    let isDragging = false;
    let splitPosition = 50;
    let containerWidth;
    let startX;
    let editableElement;
    let imageStore = new Map();
    let DOMPurify;
    let isUpdatingFromContent = false;

    // Generate a short hash for an image
    function generateImageHash() {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        const timestamp = Date.now().toString(36);
        let hash = "img_" + timestamp;

        for (let i = 0; i < 4; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return hash;
    }

    // Load image store from localStorage
    function loadImageStore() {
        if (!browser) return new Map();
        try {
            const savedStore = localStorage.getItem(IMAGE_MAP_KEY);
            if (savedStore) {
                const entries = JSON.parse(savedStore);
                return new Map(
                    entries.map(([hash, data]) => [
                        hash,
                        {
                            base64: data.base64,
                            filename: data.filename || `image-${hash}.png`,
                            size: data.size || 0,
                        },
                    ]),
                );
            }
        } catch (error) {
            console.error("Failed to load image store:", error);
        }
        return new Map();
    }

    // Save image store to localStorage
    function saveImageStore() {
        if (!browser) return;
        try {
            const entries = Array.from(imageStore.entries()).map(
                ([hash, data]) => [
                    hash,
                    {
                        base64: data.base64,
                        filename: data.filename,
                        size: data.size,
                    },
                ],
            );
            localStorage.setItem(IMAGE_MAP_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error("Failed to save image store:", error);
        }
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

    // Convert markdown to HTML for editing
    function markdownToEditHtml(markdown) {
        if (!markdown) return "";

        try {
            // Parse markdown to HTML
            let html = marked.parse(markdown);

            // Make images editable by adding contenteditable="false" and data attributes
            html = html.replace(
                /<img([^>]*?)src="(data:image\/[^"]+)"([^>]*?)>/g,
                (match, before, src, after) => {
                    const altMatch = match.match(/alt="([^"]*)"/);
                    const alt = altMatch ? altMatch[1] : "";
                    return `<img${before}src="${src}"${after} contenteditable="false" data-base64="${src}" data-alt="${alt}" style="max-width: 200px; height: auto; margin: 10px 0; border: 2px solid #4a5568; border-radius: 8px; cursor: pointer;">`;
                },
            );

            return html;
        } catch (error) {
            console.error("Error parsing markdown for editing:", error);
            return `<p>Error parsing markdown: ${error.message}</p>`;
        }
    }

    // Convert HTML back to markdown
    function htmlToMarkdown(html) {
        if (!html) return "";

        // Create a temporary div to parse HTML
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
                        return pContent ? `${pContent}\n\n` : "\n";
                    case "strong":
                    case "b":
                        return `**${processChildren(node)}**`;
                    case "em":
                    case "i":
                        return `*${processChildren(node)}*`;
                    case "code":
                        return `\`${processChildren(node)}\``;
                    case "pre":
                        return `\`\`\`\n${processChildren(node)}\n\`\`\`\n\n`;
                    case "blockquote":
                        return `> ${processChildren(node)}\n\n`;
                    case "ul":
                        return `${processChildren(node)}\n`;
                    case "ol":
                        return `${processChildren(node)}\n`;
                    case "li":
                        return `- ${processChildren(node)}\n`;
                    case "a":
                        const href = node.getAttribute("href") || "";
                        return `[${processChildren(node)}](${href})`;
                    case "img":
                        const src =
                            node.getAttribute("data-base64") ||
                            node.getAttribute("src") ||
                            "";
                        const alt =
                            node.getAttribute("data-alt") ||
                            node.getAttribute("alt") ||
                            "";
                        return `![${alt}](${src})`;
                    case "br":
                        return "\n";
                    case "hr":
                        return "\n---\n\n";
                    default:
                        return processChildren(node);
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

        // Clean up extra newlines
        markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();

        return markdown;
    }

    // Update edit HTML when content changes
    $: if (!isUpdatingFromContent) {
        editHtml = markdownToEditHtml(content);
    }

    // Update preview whenever content changes
    $: {
        try {
            if (browser && DOMPurify) {
                previewHtml = DOMPurify.sanitize(marked.parse(content || ""));
            } else {
                previewHtml = marked.parse(content || "");
            }
        } catch (error) {
            console.error("Error parsing markdown:", error);
            previewHtml = `<p>Error parsing markdown: ${error.message}</p>`;
        }
    }

    // Handle content changes in the editable div
    function handleEditableInput() {
        if (!editableElement) return;

        isUpdatingFromContent = true;

        // Small delay to ensure DOM is updated
        setTimeout(() => {
            const newMarkdown = htmlToMarkdown(editableElement.innerHTML);
            content = newMarkdown;

            setTimeout(() => {
                isUpdatingFromContent = false;
            }, 10);
        }, 0);
    }

    // Resizable split functionality
    function handleDragStart(event) {
        event.preventDefault();
        isDragging = true;
        startX = event.clientX;
        document.body.classList.add("select-none");
    }

    function handleDrag(event) {
        if (!isDragging) return;

        const dx = event.clientX - startX;
        const newPosition =
            (((splitPosition * containerWidth) / 100 + dx) / containerWidth) *
            100;

        if (newPosition > 20 && newPosition < 80) {
            splitPosition = newPosition;
            startX = event.clientX;
        }
    }

    function handleDragEnd() {
        isDragging = false;
        document.body.classList.remove("select-none");
    }

    // Image paste handler
    // Image paste handler - FIXED VERSION
    async function handlePaste(event) {
        event.preventDefault();
        const items = event.clipboardData?.items;
        if (!items) return;

        let hasImage = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                hasImage = true;
                break;
            }
        }

        if (!hasImage) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.indexOf("image") === 0) {
                const blob = item.getAsFile();
                if (!blob) continue;

                try {
                    const base64 = await blobToBase64(blob);
                    const hash = generateImageHash();
                    const size = getBase64Size(base64);
                    const fileExtension = blob.type.split("/")[1] || "png";
                    const filename = `pasted-image-${Date.now()}.${fileExtension}`;

                    imageStore.set(hash, {
                        base64: base64,
                        filename: filename,
                        size: size,
                    });

                    saveImageStore();

                    // Insert image at cursor position
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const img = document.createElement("img");
                        img.src = base64;
                        img.alt = filename;
                        img.setAttribute("data-base64", base64);
                        img.setAttribute("data-alt", filename);
                        img.contentEditable = "false";
                        img.style.cssText =
                            "max-width: 200px; height: auto; margin: 10px 0; border: 2px solid #4a5568; border-radius: 8px; cursor: pointer;";

                        range.deleteContents();
                        range.insertNode(img);

                        // Move cursor after image
                        range.setStartAfter(img);
                        range.setEndAfter(img);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        // Update the content after inserting the image
                        handleEditableInput();
                    }
                } catch (error) {
                    console.error("Failed to process image:", error);
                }
            }
        }
    }

    // Convert blob to base64
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Export functions
    export function getContentWithImages() {
        return content;
    }

    export function getStorageInfo() {
        const totalSize = Array.from(imageStore.values()).reduce(
            (sum, data) => sum + data.size,
            0,
        );
        return {
            imageCount: imageStore.size,
            totalSize: totalSize,
            formattedSize: formatFileSize(totalSize),
        };
    }

    export function clearImageData() {
        imageStore.clear();
        if (browser) {
            localStorage.removeItem(IMAGE_MAP_KEY);
        }
    }

    onMount(async () => {
        if (browser) {
            const DOMPurifyModule = await import("dompurify");
            DOMPurify = DOMPurifyModule.default;
            imageStore = loadImageStore();
        }
    });

    onDestroy(() => {
        saveImageStore();
    });
</script>

<svelte:window
    on:mousemove={handleDrag}
    on:mouseup={handleDragEnd}
    bind:innerWidth={containerWidth}
/>

<div class="w-full flex flex-col">
    <div
        class={`flex ${height} border border-zinc-700 rounded overflow-hidden`}
    >
        <div class="h-full overflow-hidden" style="width: {splitPosition}%">
            <div
                bind:this={editableElement}
                contenteditable="true"
                on:input={handleEditableInput}
                on:paste={handlePaste}
                on:drop|preventDefault
                on:dragover|preventDefault
                class="w-full h-full p-4 bg-zinc-800 text-zinc-100 overflow-auto focus:outline-none"
                style="white-space: pre-wrap; word-break: break-word;"
                data-placeholder="Write your markdown here..."
            >
                {@html editHtml}
            </div>
        </div>

        <button
            type="button"
            class="w-1.5 h-full bg-zinc-700 cursor-col-resize hover:bg-blue-500 transition-colors border-0 p-0 flex items-center justify-center"
            on:mousedown={handleDragStart}
            on:keydown={(e) => {
                if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                    e.preventDefault();
                    const delta = e.key === "ArrowLeft" ? -1 : 1;
                    const newPosition = Math.max(
                        20,
                        Math.min(80, splitPosition + delta),
                    );
                    splitPosition = newPosition;
                }
            }}
            aria-label="Resize editor panels"
            title="Drag to resize or use arrow keys"
        >
            <span class="sr-only"
                >Resize editor panels, use left and right arrow keys to adjust</span
            >
        </button>

        <div
            class="h-full overflow-auto bg-zinc-800"
            style="width: calc(100% - {splitPosition}%)"
        >
            <div class="p-4">
                <h2
                    class="text-2xl font-bold pb-2 mb-4 border-b border-zinc-700"
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
    /* Styles for the editable area */
    [contenteditable="true"]:empty:before {
        content: attr(data-placeholder);
        color: #6b7280;
        font-style: italic;
        pointer-events: none;
    }

    [contenteditable="true"]:focus {
        outline: none;
    }

    /* Styles for images in both edit and preview areas */
    :global(.prose img),
    :global([contenteditable] img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s;
    }

    :global(.prose img:hover),
    :global([contenteditable] img:hover) {
        transform: scale(1.02);
        outline: 2px solid #06b6d4;
    }

    /* Edit area specific styles */
    :global([contenteditable] img) {
        max-width: 200px !important;
        margin: 10px 0;
        border: 2px solid #4a5568;
        cursor: pointer;
    }

    :global([contenteditable] h1) {
        font-size: 2em;
        font-weight: bold;
        margin: 0.67em 0;
    }

    :global([contenteditable] h2) {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0.75em 0;
    }

    :global([contenteditable] h3) {
        font-size: 1.17em;
        font-weight: bold;
        margin: 0.83em 0;
    }

    :global([contenteditable] p) {
        margin: 1em 0;
    }

    :global([contenteditable] strong) {
        font-weight: bold;
    }

    :global([contenteditable] em) {
        font-style: italic;
    }

    :global([contenteditable] code) {
        background-color: #374151;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
    }

    :global([contenteditable] pre) {
        background-color: #374151;
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
        white-space: pre;
    }

    :global([contenteditable] blockquote) {
        border-left: 4px solid #6b7280;
        padding-left: 1em;
        margin: 1em 0;
        font-style: italic;
    }

    :global([contenteditable] ul, [contenteditable] ol) {
        padding-left: 2em;
        margin: 1em 0;
    }

    :global([contenteditable] li) {
        margin: 0.5em 0;
    }
</style>
