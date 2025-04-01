<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="junsang.dev" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6 text-zinc-100">Get in Touch</h1>
        <form class="bg-zinc-800 p-6 rounded-lg shadow-md">
            <div class="mb-4">
                <label for="name" class="block text-zinc-100 mb-2">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    class="w-full p-2 rounded bg-zinc-700 text-zinc-100 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    required
                />
            </div>
            <div class="mb-4">
                <label for="email" class="block text-zinc-100 mb-2">Email</label
                >
                <input
                    type="email"
                    id="email"
                    name="email"
                    class="w-full p-2 rounded bg-zinc-700 text-zinc-100 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    required
                />
            </div>
            <div class="mb-4">
                <label for="message" class="block text-zinc-100 mb-2"
                    >Message</label
                >
                <textarea
                    id="message"
                    name="message"
                    rows="4"
                    class="w-full p-2 rounded bg-zinc-700 text-zinc-100 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    required
                ></textarea>
            </div>
            <button
                type="submit"
                class="w-full p-2 rounded bg-zinc-600 text-zinc-100 hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >Submit</button
            >
        </form>
    </main>
    <Footer />
</div>
