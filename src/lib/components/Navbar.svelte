<script lang="ts">
  import { page } from '$app/stores';
  import { t, lang } from '$lib/i18n';
  import { derived } from 'svelte/store';

  const navLinks = derived(t, ($t) => [
    { href: '/projects', label: $t.nav.projects },
    { href: '/news', label: $t.nav.news },
    { href: '/protocol', label: $t.nav.protocol },
    { href: '/contact', label: $t.nav.contact },
  ]);

  let mobileOpen = $state(false);

  function toggleLang() {
    lang.toggle();
  }

  function closeMobile() {
    mobileOpen = false;
  }
</script>

<nav class="nav-glass sticky top-0 z-50 border-b border-outline-variant/10">
  <div class="flex items-center justify-between w-full px-6 md:px-8 py-4">
    <!-- Logo -->
    <a href="/" class="flex flex-col leading-none" onclick={closeMobile}>
      <span class="text-2xl font-black tracking-tighter text-primary">B.A.S.E.34</span>
      <span class="text-[8px] text-on-surface-variant uppercase tracking-[0.2em] hidden sm:block">
        Bureau of Advanced Systems & Electronics
      </span>
    </a>

    <!-- Desktop Nav -->
    <div class="hidden md:flex items-center gap-8 font-headline tracking-tight uppercase font-bold text-sm">
      {#each $navLinks as link}
        <a
          href={link.href}
          class="relative py-1 transition-colors duration-200
            {$page.url.pathname === link.href
              ? 'text-primary border-b-2 border-primary'
              : 'text-primary/60 hover:text-primary'}"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <!-- Right controls -->
    <div class="flex items-center gap-3">
      <button
        onclick={toggleLang}
        class="flex items-center gap-1.5 text-primary font-bold text-xs tracking-widest uppercase
               hover:bg-surface-container-high px-2 py-1.5 transition-all"
        aria-label="Toggle language"
      >
        <span class="material-symbols-outlined" style="font-size:16px">language</span>
        <span>{$t.nav.lang}</span>
      </button>

      <!-- Mobile burger -->
      <button
        class="md:hidden text-primary p-1"
        onclick={() => (mobileOpen = !mobileOpen)}
        aria-label="Toggle menu"
      >
        <span class="material-symbols-outlined">
          {mobileOpen ? 'close' : 'menu'}
        </span>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if mobileOpen}
    <div class="md:hidden bg-surface-container border-t border-outline-variant/10 py-4">
      {#each $navLinks as link}
        <a
          href={link.href}
          onclick={closeMobile}
          class="block px-6 py-3 font-bold uppercase tracking-widest text-sm transition-colors
            {$page.url.pathname === link.href
              ? 'text-primary bg-surface-container-high border-l-4 border-primary'
              : 'text-primary/60 hover:text-primary hover:bg-surface-container-high'}"
        >
          {link.label}
        </a>
      {/each}
    </div>
  {/if}
</nav>
