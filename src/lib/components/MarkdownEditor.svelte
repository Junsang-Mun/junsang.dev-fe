<script>
    import { onMount } from "svelte";
    import { marked } from "marked";
    import { browser } from "$app/environment";

    // Import DOMPurify conditionally
    let DOMPurify;

    // Props
    export let content = "";
    export let title = "";
    export let height = "h-[calc(100vh-220px)]"; // Adjustable height

    // State variables
    let previewHtml = "";
    let isDragging = false;
    let splitPosition = 50; // Default split at 50%
    let containerWidth;
    let startX;

    // Update preview whenever content changes
    $: {
        if (browser && DOMPurify) {
            previewHtml = DOMPurify.sanitize(marked.parse(content));
        } else {
            previewHtml = marked.parse(content);
        }
    }

    // Resizable split functionality
    function handleDragStart(event) {
        isDragging = true;
        startX = event.clientX;
        document.body.classList.add("select-none"); // Prevent text selection during drag
    }

    function handleDrag(event) {
        if (!isDragging) return;

        const dx = event.clientX - startX;
        const newPosition =
            (((splitPosition * containerWidth) / 100 + dx) / containerWidth) *
            100;

        // Keep within bounds
        if (newPosition > 20 && newPosition < 80) {
            splitPosition = newPosition;
            startX = event.clientX;
        }
    }

    function handleDragEnd() {
        isDragging = false;
        document.body.classList.remove("select-none");
    }

    onMount(async () => {
        // Dynamically import DOMPurify in browser
        const DOMPurifyModule = await import("dompurify");
        DOMPurify = DOMPurifyModule.default;

        // Re-sanitize the content now that DOMPurify is available
        previewHtml = DOMPurify.sanitize(marked.parse(content));

        // Set up autosave - only for content, title is handled by parent
        const autosaveInterval = setInterval(() => {
            if (content) {
                const savedDraft = localStorage.getItem("blog-draft");
                let draftObj = {};

                if (savedDraft) {
                    try {
                        draftObj = JSON.parse(savedDraft);
                    } catch (e) {
                        console.error("Failed to parse saved draft", e);
                    }
                }

                localStorage.setItem(
                    "blog-draft",
                    JSON.stringify({
                        ...draftObj,
                        savedContent: content,
                    }),
                );
            }
        }, 10000); // Save every 10 seconds

        return () => {
            clearInterval(autosaveInterval);
        };
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
            <textarea
                bind:value={content}
                placeholder="Write your markdown here..."
                class="w-full h-full p-4 bg-zinc-800 text-zinc-100 resize-none focus:outline-none font-mono"
            ></textarea>
        </div>

        <div
            class="w-1.5 h-full bg-zinc-700 cursor-col-resize hover:bg-blue-500 transition-colors"
            on:mousedown={handleDragStart}
        ></div>

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
