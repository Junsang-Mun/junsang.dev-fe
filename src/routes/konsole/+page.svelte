<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Card from "$lib/components/Card.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    export let data;
    const user = data.user;

    let posts = [];

    onMount(async () => {
        const res = await fetch("/api/allPosts");
        if (!res.ok) return;
        const data = await res.json();
        posts = data.map((post) => ({
            ...post,
            date: new Date(post.createdAt).toLocaleDateString(),
            link: `/posts/${post.id}`,
            summary: post.content?.slice(0, 100) ?? "",
        }));
    });
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="Konsole" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        <div
            class="bg-zinc-800 p-4 mb-4 rounded-lg flex justify-between items-center"
        >
            <div class="flex items-center">
                <img
                    src={user.avatar}
                    alt={user.login}
                    class="w-8 h-8 rounded-full mr-2"
                />
                <span class="text-zinc-100">Welcome, {user.login}</span>
            </div>
            <a href="/auth/logout" class="text-cyan-500 hover:text-cyan-400"
                >Logout</a
            >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div class="bg-zinc-800 p-4 rounded-lg col-span-1">
                <nav class="flex flex-col space-y-2">
                    <a
                        href="/konsole"
                        class="text-zinc-100 hover:text-cyan-400 py-2"
                        >Dashboard</a
                    >
                    <a
                        href="/konsole/new"
                        class="text-zinc-100 hover:text-cyan-400 py-2"
                        >Write a new post</a
                    >
                </nav>
            </div>

            <div class="bg-zinc-800 p-4 rounded-lg col-span-1 md:col-span-3">
                <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
                >
                    <h1 class="text-2xl font-bold text-zinc-100 mb-2 md:mb-0">
                        Edit posts
                    </h1>
                    <div class="md:w-1/2">
                        <SearchBar
                            isKonsole={true}
                            placeholder="Search your drafts and posts..."
                        />
                    </div>
                </div>

                {#if posts.length === 0}
                    <p class="text-zinc-400 text-center py-20">
                        No posts yet. Time to write!
                    </p>
                {:else}
                    <div class="space-y-4">
                        {#each posts as post}
                            <div class="relative">
                                <Card
                                    title={post.title}
                                    date={post.date}
                                    link={`/konsole/edit/${post.id}`}
                                    className="hover:ring hover:ring-cyan-500 cursor-pointer"
                                />
                                {#if !post.published}
                                    <span
                                        class="absolute top-2 right-2 text-red-400 text-xs bg-red-900/40 px-2 py-1 rounded-full"
                                    >
                                        Unpublished
                                    </span>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </main>
    <Footer />
</div>
