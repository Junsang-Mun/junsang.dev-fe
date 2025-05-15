<script>
    import { onMount } from "svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Card from "$lib/components/Card.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";

    let posts = [];
    let selectedTag = null;
    let allTags = [];
    let loading = true; // Track loading state

    onMount(async () => {
        try {
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
            posts.forEach((post) =>
                post.tags.forEach((tag) => tagSet.add(tag)),
            );
            allTags = Array.from(tagSet).sort();
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            loading = false; // Set loading to false after fetching
        }
    });

    function filterByTag(tag) {
        selectedTag = selectedTag === tag ? null : tag;
    }

    $: filteredPosts = selectedTag
        ? posts.filter((p) => p.tags.includes(selectedTag))
        : posts;
</script>

<svelte:head>
    <title>Junsang.dev</title>
    <meta property="og:title" content="junsang.dev" />
    <meta property="og:description" content="a Personal Blog" />
    <meta property="og:image" content={`/images/og_default.png`} />
    <meta property="og:url" content={`https://junsang.dev/`} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="junsang.dev" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="junsang.dev" />
    <meta name="twitter:description" content="a Personal Blog" />
    <meta name="twitter:image" content={`/images/og_default.png`} />
</svelte:head>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="junsang.dev" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="md:col-span-2">
                <h1 class="text-3xl font-bold mb-2 text-zinc-100">
                    Latest Posts
                </h1>
            </div>
            <div class="md:col-span-1">
                <SearchBar placeholder="Search articles..." />
            </div>
        </div>

        {#if loading}
            <!-- Skeleton Loading -->
            <div class="space-y-4">
                {#each Array(3) as _, i}
                    <div
                        class="bg-zinc-800 p-4 rounded-lg animate-pulse"
                        key={i}
                    >
                        <div class="h-6 bg-zinc-700 rounded w-3/4 mb-2"></div>
                        <div class="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
                        <div class="h-4 bg-zinc-700 rounded w-1/3"></div>
                    </div>
                {/each}
            </div>
        {:else}
            <!-- Tags Filter -->
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

            <!-- Posts -->
            {#if filteredPosts.length > 0}
                {#each filteredPosts as post}
                    <Card
                        {...post}
                        className="mb-4 hover:ring hover:ring-cyan-500 cursor-pointer"
                    />
                {/each}
            {:else if posts.length === 0}
                <p class="text-lg text-zinc-300">
                    If you're seeing this, it means I haven't written a single
                    word.
                </p>
            {:else}
                <p class="text-lg text-zinc-300">
                    No posts match your selected tag.
                </p>
            {/if}
        {/if}
    </main>
    <Footer />
</div>
