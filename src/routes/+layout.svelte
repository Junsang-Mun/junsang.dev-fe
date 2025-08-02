<script>
    import "../app.css";
    import YoutubePlayer from "$lib/components/YoutubePlayer.svelte";

    // Example: you can control these from a store or context for global control
    let videoIds = ["4rxcBIBu118", "qeJAcqTobEs", "0ad7f0H5wmY", "zuC_wTi7O5o", "Tf3uPT-fV2Y"];
</script>

<YoutubePlayer videoIds={videoIds} onClose={() => (showPlayer = false)} />
<slot />