<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import SecurityGate from '$lib/components/SecurityGate.svelte';
  import { security } from '$lib/security';
  import { navigating } from '$app/stores';
  import { onNavigate } from '$app/navigation';
  import { lang } from '$lib/i18n/store';
  import { browser } from '$app/environment';
  import type { LayoutData } from './$types';

  let { children, data }: { children: any; data: LayoutData } = $props();

  // Seed store from server data on first load
  // LocalStorage in store.ts will handle persistence
  $effect(() => {
    if (data.lang) {
      lang.init(data.lang as 'ua' | 'en');
    }
    // Check security status on client mount/navigation
    security.checkStatus();
  });

  // View Transitions API for smooth page navigation (like YouTube)
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<Seo 
  title={data.meta?.title} 
  description={data.meta?.description} 
  image={data.meta?.image}
/>

{#if !$security}
  <SecurityGate />
{/if}

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    rel="stylesheet"
  />
</svelte:head>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <!-- Navigation progress bar -->
  {#if $navigating}
    <div
      class="fixed top-0 left-0 z-[9999] h-0.5 bg-primary"
      style="width: 100%; animation: progress-bar 1s ease-in-out infinite"
    ></div>
  {/if}

  <main class="flex-1 page-enter">
    {@render children()}
  </main>

  <Footer />
</div>

<style>
  /* View Transitions */
  :global(::view-transition-old(root)) {
    animation: 220ms ease-out both vt-fade-out;
  }
  :global(::view-transition-new(root)) {
    animation: 320ms ease-out both vt-fade-in;
  }
  @keyframes vt-fade-out {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-6px); }
  }
  @keyframes vt-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Nav progress bar */
  @keyframes progress-bar {
    0%   { transform: scaleX(0); transform-origin: left; }
    50%  { transform: scaleX(0.7); transform-origin: left; }
    100% { transform: scaleX(1); transform-origin: left; }
  }
</style>
