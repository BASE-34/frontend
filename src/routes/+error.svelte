<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { t } from "$lib/i18n/store";

  let timeString = $state("—");
  let isoString = $state("—");
  let protocol = $state("—");
  let uri = $state("—");

  function pad(n: number) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    isoString = now.toISOString();
  }

  onMount(() => {
    tick();
    const interval = setInterval(tick, 1000);
    
    // Fill diagnostics
    uri = page.url.pathname || "/unknown";
    protocol = page.url.protocol.replace(":", "").toUpperCase() + " / HTTP/1.1";

    return () => clearInterval(interval);
  });

  const tickerItems = [
    ["SYS", "Route resolver returned null — aborting navigation"],
    ["NET", "No matching endpoint registered at this path"],
    ["LOG", "Error 404 — resource not found"],
    ["SYS", "Fallback handler activated"],
    ["CLK", new Date().toUTCString()],
    ["NET", "Connection secure — path invalid"],
    ["SYS", "Please verify the requested URL and retry"],
  ];
</script>

<div class="relative flex flex-col items-center justify-center py-20 px-6 overflow-hidden min-h-[calc(100vh-200px)]">
  <!-- Scan line overlay -->
  <div class="scanline-fx"></div>

  <!-- Corner markers -->
  <div class="corner-marker cm-tl top-12 left-8"></div>
  <div class="corner-marker cm-tr top-12 right-8 transform scale-x-[-1]"></div>
  <div class="corner-marker cm-bl bottom-12 left-8 transform scale-y-[-1]"></div>
  <div class="corner-marker cm-br bottom-12 right-8 transform scale-[-1]"></div>

  <!-- Ambient glow -->
  <div class="fixed top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(164,209,174,0.06)_0%,transparent_65%)] pointer-events-none z-0"></div>

  <main class="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-start page-enter">
    <!-- Left: giant 404 -->
    <div class="flex flex-col lg:pr-12 lg:pt-4">
      <div class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-8">
        <div class="w-6 h-[1px] bg-primary"></div>
        HTTP Status Code
      </div>
      <div class="text-[clamp(8rem,16vw,14rem)] font-black leading-[0.88] tracking-tighter bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent select-none error-flicker">
        404
      </div>
    </div>

    <!-- Right: info + diagnostic -->
    <div class="flex flex-col lg:pl-12 lg:border-l border-outline-variant/10 min-h-[400px]">
      <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-4">
        Diagnostic / Route Resolution
      </div>
      <h1 class="text-5xl lg:text-7xl font-black tracking-tighter text-on-surface mb-6 leading-none">
        Page<br />Not Found
      </h1>
      <p class="text-base text-on-surface-variant/80 max-w-md mb-10 leading-relaxed">
        The requested resource does not exist at this address. It may have been
        removed, relocated, or the path entered is incorrect.
      </p>

      <div class="diagnostic-panel">
        <div class="diag-row">
          <span class="diag-key">Request URI</span>
          <span class="diag-val error">{uri}</span>
        </div>
        <div class="diag-row">
          <span class="diag-key">Status</span>
          <span class="diag-val error">404 NOT FOUND</span>
        </div>
        <div class="diag-row">
          <span class="diag-key">Timestamp</span>
          <span class="diag-val uppercase tracking-tighter">{isoString}</span>
        </div>
        <div class="diag-row">
          <span class="diag-key">Protocol</span>
          <span class="diag-val">{protocol}</span>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="lg:col-span-2 flex flex-wrap gap-4 mt-16">
      <a href="/" class="btn-primary">
        <span class="material-symbols-outlined !text-sm">arrow_back</span> 
        Return to Base
      </a>
      <button onclick={() => history.back()} class="btn-outline">
        <span class="material-symbols-outlined !text-sm">history</span>
        Go Back
      </button>
    </div>
  </main>

  <!-- Ticker -->
  <div class="ticker-strip !bottom-0">
    <div class="ticker-inner">
      {#each [...tickerItems, ...tickerItems] as [tag, msg]}
        <div class="ticker-item"><span>[{tag}]</span>{msg}</div>
      {/each}
    </div>
  </div>
</div>
