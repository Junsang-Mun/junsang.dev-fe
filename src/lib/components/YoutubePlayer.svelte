
<script>
  export let videoIds = [];
  export let visible = false;
  export let onClose = () => {};
  let isOpen = false;
  $: isOpen = visible ? true : isOpen;
  let showMiniButton = true;

  function handleClose() {
    isOpen = false;
    showMiniButton = true;
    onClose();
  }

  function handleOpen() {
    isOpen = true;
    showMiniButton = false;
  }
  let currentIdx = 0;

  $: currentVideoId = videoIds && videoIds.length > 0 ? videoIds[currentIdx] : '';
  let isPlaying = true;
  let playerKey = 0; // Used to force iframe reload for replay

  // Store fetched titles for each videoId
  let ytTitles = [];
  $: currentTitle = ytTitles[currentIdx] || `Track ${currentIdx + 1}`;

  // Fetch YouTube video title for a given videoId
  async function fetchTitle(videoId, idx) {
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          ytTitles[idx] = data.title;
        }
      }
    } catch (e) {
      // fallback: do nothing
    }
  }

  // Fetch all titles on mount or when videoIds change
  import { onMount, afterUpdate } from 'svelte';
  function fetchAllTitles() {
    ytTitles = Array(videoIds.length).fill('');
    videoIds.forEach((id, idx) => fetchTitle(id, idx));
  }
  onMount(fetchAllTitles);
  $: if (videoIds) fetchAllTitles();

  function nextVideo() {
    if (videoIds.length > 1) {
      currentIdx = (currentIdx + 1) % videoIds.length;
      isPlaying = true;
      playerKey++;
    }
  }
  function prevVideo() {
    if (videoIds.length > 1) {
      currentIdx = (currentIdx - 1 + videoIds.length) % videoIds.length;
      isPlaying = true;
      playerKey++;
    }
  }
  function stopPlayback() {
    isPlaying = false;
  }
  function playPlayback() {
    if (!isPlaying) {
      isPlaying = true;
      playerKey++;
    }
  }
  function replayPlayback() {
    isPlaying = false;
    setTimeout(() => {
      isPlaying = true;
      playerKey++;
    }, 50);
  }
</script>

{#if isOpen && currentVideoId}
  <div class="yt-float-player music-mode">
    <div class="yt-float-header">
      <span>🎵 {currentTitle}</span>
      <button class="yt-float-close" on:click={handleClose} aria-label="Close">×</button>
    </div>
    <div class="yt-float-audio-wrap">
      {#if isPlaying}
        <!-- Use a hidden iframe for audio-only playback -->
        <iframe
          key={playerKey}
          style="width:0;height:0;border:0;visibility:hidden;"
          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          title="YouTube audio player"
          frameborder="0"
          allow="autoplay"
          allowfullscreen
        ></iframe>
      {/if}
      <div class="yt-music-controls">
        {#if isPlaying}
          <button class="yt-float-nav" on:click={stopPlayback} aria-label="Pause">⏸️</button>
        {:else}
          <button class="yt-float-nav" on:click={playPlayback} aria-label="Play">▶️</button>
        {/if}
        {#if videoIds.length > 1}
          <button class="yt-float-nav" on:click={prevVideo} aria-label="Previous">⟨</button>
        {/if}
        <span class="yt-float-index">{currentIdx + 1} / {videoIds.length}</span>
        {#if videoIds.length > 1}
          <button class="yt-float-nav" on:click={nextVideo} aria-label="Next">⟩</button>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if showMiniButton}
  <button class="yt-mini-btn" on:click={handleOpen} aria-label="Open Music Player">
    🎵
  </button>
{/if}

<style>
/* Music player mode */
.yt-float-player.music-mode {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background: #18181b;
  border: 1px solid #333;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  width: 320px;
  max-width: 90vw;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.yt-float-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.5rem 0 0.5rem;
  font-size: 1rem;
  color: #fff;
}
.yt-float-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}
.yt-float-audio-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}
.yt-music-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.yt-float-nav {
  background: #23272f;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
  outline: none;
}
.yt-float-nav:hover {
  background: #333;
}
.yt-float-index {
  color: #bbb;
  font-size: 1rem;
}
/* Mini button */
.yt-mini-btn {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 1001;
  background: #23272f;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.yt-mini-btn:hover {
  background: #333;
}
</style>
