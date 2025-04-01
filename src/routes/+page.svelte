<script>
    import Header from "$lib/componenets/Header.svelte";
    import Footer from "$lib/componenets/Footer.svelte";
    import Card from "$lib/componenets/Card.svelte";

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
    ];
</script>

<Header title="My Blog" />

<main class="container mx-auto h-svh p-4">
    <h1 class="text-3xl font-bold mb-6">Latest Posts</h1>
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
