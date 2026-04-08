<script lang="ts">
  import type { NewsItem } from '$lib/types';
  import { t, lang } from '$lib/i18n';
  import { reveal } from '$lib/actions/reveal';

  interface Props {
    item: NewsItem;
    delay?: number;
  }

  let { item, delay = 0 }: Props = $props();

  const categoryLabels: Record<NewsItem['category'], { en: string; ua: string }> = {
    project: { en: 'PROJECT UPDATE', ua: 'ОНОВЛЕННЯ ПРОЕКТУ' },
    research: { en: 'RESEARCH', ua: 'ДОСЛІДЖЕННЯ' },
    workshop: { en: 'WORKSHOP', ua: 'ВОРКШОП' },
    report: { en: 'REPORT', ua: 'ЗВІТ' },
    event: { en: 'EVENT', ua: 'ПОДІЯ' },
  };
</script>

<article
  use:reveal={{ delay }}
  class="surface-card group flex flex-col h-full"
>
  {#if item.image}
    <a href="/news/{item.id}" class="aspect-video overflow-hidden block">
      <img
        src={item.image}
        alt={$lang === 'ua' ? item.title_ua : item.title}
        class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        loading="lazy"
      />
    </a>
  {:else}
    <a href="/news/{item.id}" class="aspect-video bg-surface-container-high flex items-center justify-center block">
      <span class="material-symbols-outlined text-outline-variant text-4xl">article</span>
    </a>
  {/if}

  <div class="p-6 flex flex-col flex-1">
    <div class="flex items-center gap-3 mb-4">
      <span class="text-[9px] font-mono text-primary/60">{item.date}</span>
      <span class="text-[9px] font-bold tracking-widest text-primary uppercase bg-primary-container/20 px-2 py-0.5">
        {categoryLabels[item.category][$lang]}
      </span>
    </div>

    <a href="/news/{item.id}" class="block flex-1">
      <h4 class="text-lg font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
        {$lang === 'ua' ? item.title_ua : item.title}
      </h4>
    </a>
    <p class="text-on-surface-variant text-sm line-clamp-2 mb-6">
      {$lang === 'ua' ? item.excerpt_ua : item.excerpt}
    </p>

    <div class="flex items-center justify-between mt-auto">
      <a href="/news/{item.id}" class="btn-ghost text-primary">
        {$t.news.read_full}
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
      <span class="text-[9px] font-mono text-outline/50">{item.log_id}</span>
    </div>
  </div>
</article>
