<script>
    import { onMount } from "svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Card from "$lib/components/Card.svelte";

    let posts = [];
    let selectedTag = null;
    let allTags = [];

    onMount(async () => {
        const res = await fetch("/api/posts");
        const data = await res.json();

        posts = data.map((post) => ({
            ...post,
            tags: post.tags ?? [],
            summary: post.content?.slice(0, 100) ?? "",
            date: new Date(post.createdAt).toLocaleDateString(),
            link: `/posts/${post.id}`,
        }));

        const tagSet = new Set();
        posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
        allTags = Array.from(tagSet).sort();
    });

    function filterByTag(tag) {
        selectedTag = selectedTag === tag ? null : tag;
    }

    $: filteredPosts = selectedTag
        ? posts.filter((p) => p.tags.includes(selectedTag))
        : posts;
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="junsang.dev" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6 text-zinc-100">Latest Posts</h1>
        {#if allTags.length > 0}
            <div class="mb-4 flex flex-wrap gap-2">
                {#each allTags as tag}
                    <button
                        class="px-3 py-1 rounded-full text-sm border transition
                {selectedTag === tag
                            ? 'bg-cyan-600 border-cyan-500 text-white'
                            : 'bg-zinc-700 border-zinc-600 text-zinc-200'}"
                        on:click={() => filterByTag(tag)}
                    >
                        {tag}
                    </button>
                {/each}
            </div>
        {/if}
        {#if filteredPosts.length > 0}
            {#each filteredPosts as post}
                <Card {...post} className="mb-4" />
            {/each}
        {:else if posts.length === 0}
            <p class="text-lg text-zinc-300">
                If you're seeing this, it means I haven’t written a single word.
            </p>
        {:else}
            {#each posts as post}
                <Card
                    title={post.title}
                    summary={post.summary}
                    date={post.date}
                    link={post.link}
                    className="mb-4"
                />
            {/each}
        {/if}
    </main>
    <Footer />
</div>
