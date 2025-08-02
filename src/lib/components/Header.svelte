<script>
    export let title = "junsang.dev";

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function onClickLogo() {
        window.location.href = "/";
    }
</script>

<header class="bg-zinc-950 text-zinc-100 p-4">
    <div class="container mx-auto flex justify-between items-center">
        <!-- Logo or Title -->
        <h1 class="text-2xl font-bold" on:click={onClickLogo} on:mouseenter={() => (document.body.style.cursor = "pointer")} on:mouseleave={() => (document.body.style.cursor = "default")}>{title}</h1>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-4">
            <a
                href="/"
                class="text-zinc-100 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
                >Home</a
            >
            <a
                href="/about"
                class="text-zinc-100 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
                >About</a
            >
            <a
                href="/contact"
                class="text-zinc-100 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
                >Contact</a
            >
        </nav>

        <!-- Burger Menu for Mobile -->
        <button
            class="md:hidden flex items-center text-zinc-100 hover:text-cyan-400 focus:outline-none"
            on:click={toggleMenu}
            aria-label="Toggle menu"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                class="h-6 w-6"
            >
                <rect width="256" height="256" fill="none" />
                <line
                    x1="40"
                    y1="128"
                    x2="216"
                    y2="128"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                />
                <line
                    x1="40"
                    y1="64"
                    x2="216"
                    y2="64"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                />
                <line
                    x1="40"
                    y1="192"
                    x2="216"
                    y2="192"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                />
            </svg>
        </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    {#if isMenuOpen}
        <nav
            class="md:hidden bg-zinc-950 text-zinc-100 p-4 space-y-2 border-t border-zinc-800"
        >
            <a
                href="/"
                class="block text-zinc-100 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
                >Home</a
            >
            <a
                href="/about"
                class="block text-zinc-100 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
                >About</a
            >
            <a
                href="/contact"
                class="block text-zinc-100 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
                >Contact</a
            >
        </nav>
    {/if}
</header>
