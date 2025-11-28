<script>
    export let tags = [];
    let tagInput = "";

    function addTag(event) {
        if (event.key === "Enter" && tagInput.trim()) {
            event.preventDefault();

            const newTag = tagInput.trim();

            if (!tags.includes(newTag) && newTag) {
                tags = [...tags, newTag];
            }

            tagInput = "";
        }
    }

    function removeTag(tagToRemove) {
        tags = tags.filter((tag) => tag !== tagToRemove);
    }
</script>

<div class="mb-6">
    <div class="flex items-center gap-2 mb-2">
        <label for="tags" class="text-zinc-400">Tags:</label>
        <input
            id="tags"
            type="text"
            placeholder="Add tags (press Enter)"
            bind:value={tagInput}
            on:keydown={addTag}
            class="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-cyan-500 text-zinc-100 placeholder-zinc-500"
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
