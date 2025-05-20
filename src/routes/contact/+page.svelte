<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<div
    class="flex flex-col h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-zinc-100"
>
    <Header title="junsang.dev" />
    <main
        class="flex-1 container mx-auto p-6 flex flex-col items-center justify-center"
    >
        <h1 class="text-4xl font-extrabold mb-8 text-center">
            Let's Get in Touch!
        </h1>
        <p class="text-lg text-center mb-12 max-w-2xl">
            I'd love to hear from you! Whether you have a question, a project
            idea, or just want to say hi, feel free to reach out through any of
            the platforms below.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
            <!-- Email Card -->
            <a
                href="mailto:iam@junsang.dev"
                class="flex items-center p-6 bg-zinc-700 rounded-lg shadow-lg hover:bg-zinc-600 transition"
            >
                <div class="flex-shrink-0 text-4xl mr-4">📧</div>
                <div>
                    <h2 class="text-2xl font-bold">Email</h2>
                    <p class="text-zinc-300">iam@junsang.dev</p>
                </div>
            </a>
            <!-- GitHub Card -->
            <a
                href="https://github.com/Junsang-Mun"
                target="_blank"
                class="flex items-center p-6 bg-zinc-700 rounded-lg shadow-lg hover:bg-zinc-600 transition"
            >
                <div class="flex-shrink-0 text-4xl mr-4">🐙</div>
                <div>
                    <h2 class="text-2xl font-bold">GitHub</h2>
                    <p class="text-zinc-300">github.com/Junsang-Mun</p>
                </div>
            </a>
        </div>
    </main>
    <Footer />
</div>
