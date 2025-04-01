<script>
    export let title;
    export let summary;
    export let date;
    export let link;
</script>

<article class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-4">
        <h2 class="text-xl font-bold mb-2">
            <a href={link} class="text-blue-600 hover:underline">{title}</a>
        </h2>
        <p class="text-gray-600 mb-4">{summary}</p>
        <div class="text-gray-500 text-sm">{date}</div>
    </div>
</article>
