<script>
    export let title;
    export let summary;
    export let date;
    export let link;
</script>

<article class="bg-zinc-800 shadow-md rounded-lg overflow-hidden">
    <div class="p-4">
        <h2 class="text-xl font-bold mb-2">
            <a
                href={link}
                class="text-cyan-600 hover:underline hover:text-cyan-400"
                >{title}</a
            >
        </h2>
        <p class="text-zinc-300 mb-4">{summary}</p>
        <div class="text-zinc-400 text-sm">{date}</div>
    </div>
</article>
