<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    export let data;
    const user = data.user;
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="junsang.dev - Konsole" />
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
                        href="/konsole/posts"
                        class="text-zinc-100 hover:text-cyan-400 py-2">Posts</a
                    >
                    <a
                        href="/konsole/new-post"
                        class="text-zinc-100 hover:text-cyan-400 py-2"
                        >New Post</a
                    >
                    <a
                        href="/konsole/blank"
                        class="text-zinc-100 hover:text-cyan-400 py-2">Blank</a
                    >
                </nav>
            </div>

            <div class="bg-zinc-800 p-4 rounded-lg col-span-1 md:col-span-3">
                <h1 class="text-2xl font-bold mb-4 text-zinc-100">Dashboard</h1>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-zinc-700 p-4 rounded-lg">
                        <h2 class="text-xl font-bold mb-2 text-zinc-100">
                            Recent Posts
                        </h2>
                        <p class="text-zinc-400">
                            View and manage your recent posts.
                        </p>
                        <a
                            href="/konsole/posts"
                            class="text-cyan-500 hover:text-cyan-400 mt-2 inline-block"
                            >View Posts</a
                        >
                    </div>

                    <div class="bg-zinc-700 p-4 rounded-lg">
                        <h2 class="text-xl font-bold mb-2 text-zinc-100">
                            Create New Post
                        </h2>
                        <p class="text-zinc-400">
                            Create a new blog post with markdown support.
                        </p>
                        <a
                            href="/konsole/new-post"
                            class="text-cyan-500 hover:text-cyan-400 mt-2 inline-block"
                            >Create Post</a
                        >
                    </div>

                    <div class="bg-zinc-700 p-4 rounded-lg">
                        <h2 class="text-xl font-bold mb-2 text-zinc-100">
                            Blank Page
                        </h2>
                        <p class="text-zinc-400">
                            A blank page for future functionality.
                        </p>
                        <a
                            href="/konsole/blank"
                            class="text-cyan-500 hover:text-cyan-400 mt-2 inline-block"
                            >Go to Blank Page</a
                        >
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
