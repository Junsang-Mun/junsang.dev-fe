<script>
    export let title = "My Blog";
</script>

<header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">{title}</h1>
        <nav>
            <a
                href="/"
                class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >Home</a
            >
            <a
                href="/about"
                class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >About</a
            >
            <a
                href="/contact"
                class="text-white px-3 py-2 rounded-md text-sm font-medium"
                >Contact</a
            >
        </nav>
    </div>
</header>
