<script lang="ts">
  import { t, lang } from '$lib/i18n';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { reveal, revealLeft } from '$lib/actions/reveal';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let searchQuery = $state('');
  let openItems = $state<Set<string>>(new Set(['recruitment-0']));

  function toggleItem(id: string) {
    const next = new Set(openItems);
    next.has(id) ? next.delete(id) : next.add(id);
    openItems = next;
  }

  const filteredSections = $derived(
    $t.protocol.sections
      .map((section) => ({
        ...section,
        faqs: section.faqs.filter(
          (faq) =>
            searchQuery.trim() === '' ||
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((s) => s.faqs.length > 0)
  );
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
</svelte:head>

<PageHeader
  badge={$t.protocol.badge}
  h1line1={$t.protocol.h1_1}
  h1line2={$t.protocol.h1_2}
  body={$t.protocol.body}
  metaLines={[$t.protocol.version, $t.protocol.last_update, $t.protocol.status]}
/>

<div class="container mx-auto px-6 md:px-8 max-w-7xl pb-24">
  <!-- Search bar -->
  <div use:reveal class="mb-14">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span class="material-symbols-outlined text-outline">search</span>
      </div>
      <input
        bind:value={searchQuery}
        type="text"
        placeholder={$t.protocol.search_placeholder}
        class="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/50
               focus:border-primary focus:ring-0 focus:outline-none text-on-surface
               placeholder:text-outline/50 font-bold tracking-wider py-5 pl-12 pr-24
               uppercase transition-colors"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-4">
        <span class="text-[10px] font-bold text-outline uppercase tracking-widest px-2 py-1 bg-surface-container-highest hidden sm:block">
          {$t.protocol.shortcut}
        </span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
    <!-- Sticky category sidebar -->
    <aside class="hidden lg:block lg:col-span-3">
      <div class="sticky top-24">
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-outline mb-6">
          {$t.protocol.classifications}
        </p>
        <nav class="flex flex-col gap-1">
          {#each $t.protocol.sections as section}
            <a
              href="#{section.id}"
              class="group flex items-center justify-between py-3 px-4 transition-all
                     border-l-4 border-transparent hover:border-outline-variant
                     hover:bg-surface-container-high text-on-surface-variant
                     font-medium uppercase text-xs tracking-wider"
            >
              <span>{section.title}</span>
              <span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                arrow_forward_ios
              </span>
            </a>
          {/each}
        </nav>

        <!-- Version metadata -->
        <div class="mt-8 bg-surface-container-low p-4">
          <div class="space-y-2">
            {#each [[$t.protocol.version, 'text-primary'], [$t.protocol.last_update, 'text-on-surface-variant/50'], [$t.protocol.status, 'text-primary']] as [val, cls]}
              <div class="text-[9px] font-mono {cls} uppercase">{val}</div>
            {/each}
          </div>
        </div>
      </div>
    </aside>

    <!-- FAQ accordions -->
    <div class="lg:col-span-9 space-y-16">
      {#each filteredSections as section}
        <section id={section.id} use:reveal>
          <div class="flex items-baseline gap-4 mb-8">
            <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tight whitespace-nowrap">
              {section.title}
            </h2>
            <div class="h-px flex-grow bg-outline-variant/20"></div>
          </div>

          <div class="space-y-2">
            {#each section.faqs as faq, i}
              {@const itemId = `${section.id}-${i}`}
              <div class="bg-surface-container border-b border-outline-variant/10">
                <button
                  onclick={() => toggleItem(itemId)}
                  class="w-full flex justify-between items-start gap-4 p-6 cursor-pointer
                         hover:bg-surface-container-high transition-colors text-left"
                >
                  <span class="text-base font-bold tracking-tight uppercase
                               {openItems.has(itemId) ? 'text-primary' : 'text-on-surface'}">
                    {faq.q}
                  </span>
                  <span
                    class="material-symbols-outlined text-primary flex-shrink-0 transition-transform duration-300
                           {openItems.has(itemId) ? 'rotate-45' : ''}"
                  >
                    add
                  </span>
                </button>

                {#if openItems.has(itemId)}
                  <div class="px-6 pb-6 text-on-surface-variant leading-relaxed text-sm border-l-2 border-primary/30 ml-6">
                    {faq.a}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </section>
      {/each}

      {#if filteredSections.length === 0}
        <div class="text-center py-20">
          <span class="material-symbols-outlined text-4xl mb-4 block text-outline">search_off</span>
          <p class="font-bold uppercase tracking-widest text-sm text-on-surface-variant">
            {$lang === 'ua' ? 'Нічого не знайдено' : 'No results found'}
          </p>
          <button
            onclick={() => (searchQuery = '')}
            class="mt-6 btn-ghost mx-auto"
          >
            {$lang === 'ua' ? 'Скинути пошук' : 'Clear search'}
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
