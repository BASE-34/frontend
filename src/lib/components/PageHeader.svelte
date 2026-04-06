<script lang="ts">
  import { typewriter } from '$lib/actions/typewriter';
  import { decode } from '$lib/actions/decode';

  interface Props {
    badge?: string;
    h1line1: string;
    h1line2?: string;
    body?: string;
    metaLines?: string[];
    accentLine?: boolean;
  }

  let { badge, h1line1, h1line2, body, metaLines = [], accentLine = true }: Props = $props();
</script>

<header class="px-6 md:px-8 pt-24 pb-16 max-w-7xl mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
    <div class="md:col-span-8">
      {#if badge}
        <div class="inline-block bg-primary-container text-on-primary-container px-3 py-1
                    text-[10px] font-bold tracking-[0.3em] uppercase mb-5">
          {badge}
        </div>
      {/if}
      <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase mb-6 min-h-[1.2em]">
        <span use:typewriter={{ text: h1line1, speed: 40, cursor: false }}></span>
        {#if h1line2}
          <br /><span class="text-primary" use:typewriter={{ text: h1line2, speed: 40, delay: h1line1.length * 40, cursor: true }}></span>
        {/if}
      </h1>
      {#if body}
        {#if accentLine}
          <p class="text-on-surface-variant text-lg max-w-xl leading-relaxed border-l-2 border-outline-variant/30 pl-6">
            {body}
          </p>
        {:else}
          <p class="text-on-surface-variant text-lg max-w-xl leading-relaxed">{body}</p>
        {/if}
      {/if}
    </div>

    {#if metaLines.length > 0}
      <div class="md:col-span-4 flex flex-col gap-1.5 border-l border-outline-variant/30 pl-6 pb-2">
        {#each metaLines as line, i}
          <span class="text-[10px] font-mono text-on-surface-variant/60" use:decode={{ targetText: line, duration: 1500, delay: i * 350 }}>{line}</span>
        {/each}
      </div>
    {/if}
  </div>
</header>
