<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { marked } from "marked";

    let post = null;
    let loading = true;
    let error = null;

    $: id = $page.params.id;

    onMount(async () => {
        try {
            const res = await fetch(`/api/posts/${id}`);
            if (!res.ok) throw new Error("Post not found");

            const data = await res.json();
            post = data;
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    let postContent;

    $: if (post && postContent) {
        postContent.innerHTML = marked.parse(post.content || "");
    }
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="junsang.dev" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        {#if loading}
            <p class="text-zinc-400">Loading post...</p>
        {:else if error}
            <p class="text-red-400">Error: {error}</p>
        {:else if post}
            {#if post.tags && post.tags.length > 0}
                <div class="mb-4 flex flex-wrap gap-2">
                    {#each post.tags as tag}
                        <span
                            class="bg-zinc-700 text-sm text-zinc-100 px-3 py-1 rounded-full"
                            >{tag}</span
                        >
                    {/each}
                </div>
            {/if}
            <h1 class="text-3xl font-bold mb-2 text-zinc-100">{post.title}</h1>
            <p class="text-sm text-zinc-300 mb-6">
                {new Date(post.createdAt).toLocaleString()}
                {#if post.updatedAt !== post.createdAt}
                    &nbsp;• updated {new Date(post.updatedAt).toLocaleString()}
                {/if}
            </p>
            <div
                class="prose prose-invert max-w-none"
                bind:this={postContent}
            ></div>
        {/if}
    </main>
    <Footer />
</div>
