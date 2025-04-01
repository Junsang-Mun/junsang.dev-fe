<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Card from "$lib/components/Card.svelte";

    const posts = [
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
    ];
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="My Blog" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6 text-zinc-100">Latest Posts</h1>
        {#each posts as post}
            <Card
                title={post.title}
                summary={post.summary}
                date={post.date}
                link={post.link}
            />
        {/each}
    </main>
    <Footer />
</div>
