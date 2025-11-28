<script>
    import { goto } from "$app/navigation";
    import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
    import TagInput from "$lib/components/TagInput.svelte";

    // Post data
    export let title = "";
    export let content = "";
    export let tags = [];

    // Prepare payload for API
    function preparePostPayload(isPublished) {
        return {
            title: title,
            content: content,
            tags: tags,
            published: isPublished,
        };
    }

    // Generic save handler
    async function savePost(isPublished) {
        if (!title.trim()) {
            alert("Please enter a title for your post");
            return;
        }

        const action = isPublished ? "Publishing" : "Saving";
        const payload = preparePostPayload(isPublished);

        console.log(`${action} post: ` + JSON.stringify(payload));

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert(
                    `Post ${isPublished ? "published" : "saved as draft"} successfully!`,
                );
                goto("/konsole");
            } else {
                const errorData = await response.text();
                throw new Error(
                    `Failed to ${action.toLowerCase()} post: ${errorData}`,
                );
            }
        } catch (error) {
            console.error(`Error ${action.toLowerCase()} post:`, error);
            alert(`Failed to ${action.toLowerCase()} post. Please try again.`);
        }
    }
</script>

<div class="flex flex-col h-screen bg-zinc-900 text-zinc-100">
    <main class="flex-1 overflow-hidden container mx-auto p-4 flex flex-col">
        <div
            class="bg-zinc-800 p-6 rounded-lg flex flex-col h-full shadow-xl border border-zinc-700"
        >
            <!-- Header Section -->
            <div class="flex justify-between items-center mb-6 shrink-0">
                <div class="w-2/3">
                    <input
                        type="text"
                        placeholder="Post Title"
                        bind:value={title}
                        class="w-full p-3 bg-zinc-700 border border-zinc-600 rounded text-2xl font-bold focus:outline-none focus:border-cyan-500 text-zinc-100 placeholder-zinc-500"
                    />
                </div>
                <div class="flex space-x-2">
                    <button
                        on:click={() => savePost(false)}
                        class="bg-zinc-700 text-zinc-100 px-4 py-2 rounded hover:bg-zinc-600 transition-colors font-medium"
                    >
                        Save Draft
                    </button>
                    <button
                        on:click={() => savePost(true)}
                        class="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500 transition-colors font-medium shadow-lg shadow-cyan-900/20"
                    >
                        Publish
                    </button>
                </div>
            </div>

            <!-- Metadata Section -->
            <div class="mb-6 shrink-0">
                <TagInput bind:tags />
            </div>

            <!-- Editor Section -->
            <div class="flex-1 min-h-0">
                <MarkdownEditor
                    bind:content
                    {title}
                    height="h-full"
                    placeholder="Write your masterpiece..."
                />
            </div>
        </div>
    </main>
</div>
