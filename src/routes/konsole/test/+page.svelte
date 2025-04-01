<script>
    import { onMount } from "svelte";
    import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";

    // Post data
    export let title = "";
    export let content = "";
    export let tags = [];
    let tagInput = "";

    // Tag handling functions
    function addTag(event) {
        // Add tag on Enter key press, prevent form submission
        if (event.key === "Enter" && tagInput.trim()) {
            event.preventDefault();

            // Don't add if the tag already exists
            if (!tags.includes(tagInput.trim())) {
                tags = [...tags, tagInput.trim()];
            }

            tagInput = ""; // Clear the input
        }
    }

    function removeTag(tagToRemove) {
        tags = tags.filter((tag) => tag !== tagToRemove);
    }

    // Save and load functionality
    async function handleSave() {
        const payload = {
            title,
            content,
            tags,
            published: false, // Save as draft
        };

        // Log the complete payload
        console.log("Saving post: " + JSON.stringify(payload));

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Post saved successfully!");
                localStorage.removeItem("blog-draft");
            } else {
                throw new Error("Failed to save post");
            }
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Failed to save post. Please try again.");
        }
    }

    async function handlePublish() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    tags,
                    published: true,
                }),
            });

            if (response.ok) {
                alert("Post published successfully!");
                localStorage.removeItem("blog-draft");
            } else {
                throw new Error("Failed to publish post");
            }
        } catch (error) {
            console.error("Error publishing post:", error);
            alert("Failed to publish post. Please try again.");
        }
    }

    onMount(() => {
        // Load saved draft if available
        const savedDraft = localStorage.getItem("blog-draft");
        if (savedDraft) {
            try {
                const { savedTitle, savedContent, savedTags } =
                    JSON.parse(savedDraft);
                title = savedTitle || "";
                content = savedContent || "";
                tags = savedTags || [];
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }

        // Set up autosave for title and tags only (content is handled by editor)
        const autosaveInterval = setInterval(() => {
            if (title || tags.length > 0) {
                const savedDraft = localStorage.getItem("blog-draft") || "{}";
                let draftObj = {};

                try {
                    draftObj = JSON.parse(savedDraft);
                } catch (e) {
                    console.error("Failed to parse saved draft", e);
                }

                localStorage.setItem(
                    "blog-draft",
                    JSON.stringify({
                        ...draftObj,
                        savedTitle: title,
                        savedTags: tags,
                    }),
                );
            }
        }, 10000); // Save every 10 seconds

        return () => {
            clearInterval(autosaveInterval);
        };
    });
</script>

<div class="flex flex-col h-screen bg-zinc-900 text-zinc-100">
    <main class="flex-1 overflow-auto container mx-auto p-4">
        <div class="bg-zinc-800 p-6 rounded-lg">
            <div class="flex justify-between items-center mb-6">
                <div class="w-2/3">
                    <input
                        type="text"
                        placeholder="Post Title"
                        bind:value={title}
                        class="w-full p-3 bg-zinc-700 border border-zinc-600 rounded text-2xl font-bold focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div class="flex space-x-2">
                    <button
                        on:click={handleSave}
                        class="bg-zinc-700 text-zinc-100 px-4 py-2 rounded hover:bg-zinc-600 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        on:click={handlePublish}
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                    >
                        Publish
                    </button>
                </div>
            </div>

            <!-- Tags section -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-2">
                    <label for="tags" class="text-zinc-400">Tags:</label>
                    <input
                        id="tags"
                        type="text"
                        placeholder="Add tags (press Enter)"
                        bind:value={tagInput}
                        on:keydown={addTag}
                        class="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>

                {#if tags.length > 0}
                    <div class="flex flex-wrap gap-2">
                        {#each tags as tag}
                            <div
                                class="flex items-center bg-zinc-600 text-zinc-100 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                                <button
                                    on:click={() => removeTag(tag)}
                                    class="ml-2 text-zinc-400 hover:text-zinc-100"
                                    aria-label="Remove tag"
                                >
                                    ×
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Markdown editor component - now without title input -->
            <div class="h-[calc(100vh-280px)]">
                <MarkdownEditor
                    bind:content
                    {title}
                    height="h-[calc(100vh-280px)]"
                />
            </div>
        </div>
    </main>
</div>
