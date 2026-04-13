<script lang="ts">
  import { t, lang } from '$lib/i18n';
  import NewsCard from '$lib/components/NewsCard.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { reveal } from '$lib/actions/reveal';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const newsItems = $derived(data.newsItems);

  type Category = 'all' | 'project' | 'research' | 'workshop' | 'report' | 'event';
  let activeFilter = $state<Category>('all');

  const featured = $derived(newsItems.find((n: any) => n.featured));
  const secondary = $derived(newsItems.filter((n: any) => !n.featured).slice(0, 2));

  const filtered = $derived(
    activeFilter === 'all'
      ? newsItems.filter((n: any) => !n.featured)
      : newsItems.filter((n: any) => !n.featured && n.category === activeFilter)
  );

  const filters: { key: Category; label: () => string }[] = [
    { key: 'all', label: () => $t.news.filter_all },
    { key: 'project', label: () => $t.news.filter_project },
    { key: 'research', label: () => $t.news.filter_research },
    { key: 'workshop', label: () => $t.news.filter_workshop },
    { key: 'report', label: () => $t.news.filter_report },
    { key: 'event', label: () => $t.news.filter_event },
  ];
</script>

<Seo 
  title={data.meta.title}
/>

<PageHeader
  badge={$t.news.badge}
  h1line1={$t.news.h1_1}
  h1line2={$t.news.h1_2}
  body={$t.news.body}
/>

<!-- Featured bento -->
{#if featured}
  <section class="px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-1 mb-16">
    <!-- Main featured article -->
    <article class="md:col-span-8 bg-surface-container relative group overflow-hidden" style="min-height:480px">
      {#if featured.image}
        <img
          src={featured.image}
          alt={$lang === 'ua' ? featured.title_ua : featured.title}
          class="absolute inset-0 w-full h-full object-cover opacity-50 grayscale
                 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
      {/if}
      <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-8 md:p-10 w-full">
        <div class="flex flex-wrap gap-3 items-center mb-4">
          {#if featured.breaking}
            <span class="text-[9px] font-black px-2 py-0.5 border border-primary/40 uppercase tracking-[0.2em] text-primary">
              {$t.news.breaking}
            </span>
          {/if}
          <span class="text-on-surface-variant text-[10px] font-medium tracking-widest uppercase">
            {featured.date} // UTC+2
          </span>
        </div>
        <h2 class="text-2xl md:text-4xl font-bold tracking-tight text-on-surface mb-4 max-w-2xl">
          {$lang === 'ua' ? featured.title_ua : featured.title}
        </h2>
        <p class="text-on-surface-variant max-w-lg text-sm leading-relaxed mb-6 hidden md:block">
          {$lang === 'ua' ? featured.excerpt_ua : featured.excerpt}
        </p>
        <a href="/news/{featured.id}" class="btn-primary">
          {$t.news.read_full}
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
    </article>

    <!-- Secondary quick-update sidebar -->
    <div class="md:col-span-4 flex flex-col gap-1">
      <div class="px-6 py-4 bg-surface-container-high border-b border-outline-variant/10">
        <h4 class="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">{$t.news.quick_updates}</h4>
      </div>
      {#each secondary as item}
        <a href="/news/{item.id}" class="bg-surface-container-high p-6 flex-1 group cursor-pointer hover:bg-surface-container-highest transition-colors flex flex-col">
          <div class="text-[10px] text-primary/60 font-bold tracking-widest uppercase mb-3">
            {item.category.toUpperCase()}
          </div>
          <h3 class="text-lg font-bold leading-tight mb-4 group-hover:text-primary transition-colors flex-1">
            {$lang === 'ua' ? item.title_ua : item.title}
          </h3>
          <div class="flex justify-between items-center">
            <span class="text-[10px] text-on-surface-variant/50 font-mono">ID: {item.log_id}</span>
            <span class="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">north_east</span>
          </div>
        </a>
      {/each}
    </div>
  </section>
{/if}

<!-- Archive with filters -->
<section class="px-6 md:px-8 max-w-7xl mx-auto border-t border-outline-variant/15 pt-16 pb-24">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
    <h3 use:reveal class="text-3xl font-black tracking-tighter uppercase text-primary">
      {$t.news.latest}
    </h3>
    <div use:reveal={{ delay: 80 }} class="flex flex-wrap gap-2 items-center">
      <span class="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mr-2">Filter:</span>
      {#each filters as f}
        <button
          onclick={() => (activeFilter = f.key)}
          class="px-3 py-1 text-[10px] font-bold border uppercase tracking-widest transition-colors
            {activeFilter === f.key
              ? 'border-primary text-primary bg-primary/10'
              : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}"
        >
          {f.label()}
        </button>
      {/each}
    </div>
  </div>

  {#if filtered.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filtered as item, i (item.id)}
        <NewsCard {item} delay={i * 60} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-20 text-on-surface-variant">
      <span class="material-symbols-outlined text-4xl mb-4 block text-outline">filter_list_off</span>
      <p class="font-bold uppercase tracking-widest text-sm">
        {$lang === 'ua' ? 'Немає результатів' : 'No results for this filter'}
      </p>
    </div>
  {/if}

  <button
    use:reveal
    class="mt-12 w-full py-5 border border-outline-variant/20 hover:border-primary/40
           text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant
           transition-all hover:text-primary"
  >
    {$t.news.load_more}
  </button>
</section>
