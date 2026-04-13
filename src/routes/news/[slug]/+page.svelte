<script lang="ts">
  import { t, lang } from '$lib/i18n';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { reveal, revealLeft } from '$lib/actions/reveal';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const article = $derived(data.article);

  const categoryLabels: Record<string, { en: string; ua: string }> = {
    project: { en: 'PROJECT UPDATE', ua: 'ОНОВЛЕННЯ ПРОЕКТУ' },
    research: { en: 'RESEARCH', ua: 'ДОСЛІДЖЕННЯ' },
    workshop: { en: 'WORKSHOP', ua: 'ВОРКШОП' },
    report: { en: 'REPORT', ua: 'ЗВІТ' },
    event: { en: 'EVENT', ua: 'ПОДІЯ' },
  };

  const title = $derived($lang === 'ua' ? article.title_ua : article.title);
  const excerpt = $derived($lang === 'ua' ? article.excerpt_ua : article.excerpt);
  const content = $derived($lang === 'ua' ? (article.content_ua ?? article.excerpt_ua) : (article.content ?? article.excerpt));
</script>

<Seo
  {title}
  description={excerpt}
  image={article.image}
  type="article"
/>

<!-- Hero -->
<section class="relative overflow-hidden" style="min-height: 420px">
  {#if article.image}
    <img
      src={article.image}
      alt={title}
      class="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
    />
  {/if}
  <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/40"></div>

  <div class="relative z-10 container mx-auto px-6 md:px-8 max-w-4xl pt-32 pb-16">
    <!-- Back link -->
    <div use:reveal class="mb-8">
      <a
        href="/news"
        class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant
               hover:text-primary transition-colors group"
      >
        <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        {$lang === 'ua' ? 'Назад до новин' : 'Back to News'}
      </a>
    </div>

    <!-- Meta -->
    <div use:reveal={{ delay: 100 }} class="flex flex-wrap items-center gap-3 mb-6">
      <span class="text-[9px] font-bold tracking-widest text-primary uppercase bg-primary-container/20 px-2 py-0.5">
        {categoryLabels[article.category]?.[$lang] ?? article.category.toUpperCase()}
      </span>
      <span class="text-[10px] text-on-surface-variant font-mono">{article.date} // UTC+2</span>
      <span class="text-[9px] font-mono text-outline/50">ID: {article.log_id}</span>
      {#if article.breaking}
        <span class="text-[9px] font-black px-2 py-0.5 border border-primary/40 uppercase tracking-[0.2em] text-primary">
          {$t.news.breaking}
        </span>
      {/if}
    </div>

    <!-- Title -->
    <h1 use:reveal={{ delay: 200 }} class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
      {title}
    </h1>

    <!-- Excerpt -->
    <p use:reveal={{ delay: 300 }} class="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
      {excerpt}
    </p>
  </div>
</section>

<div class="pcb-line"></div>

<!-- Article Content -->
<section class="py-16 bg-surface-container-lowest">
  <div class="container mx-auto px-6 md:px-8 max-w-4xl">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Main content -->
      <article use:reveal class="lg:col-span-9 prose-content">
        {@html renderMarkdown(content)}
      </article>

      <!-- Sidebar -->
      <aside class="lg:col-span-3" use:revealLeft>
        <div class="sticky top-24 space-y-6">
          <!-- Article metadata -->
          <div class="bg-surface-container p-5">
            <div class="text-[9px] font-black uppercase tracking-[0.3em] text-outline mb-4">
              Article Metadata
            </div>
            <div class="space-y-3">
              {#each [
                ['LOG_ID', article.log_id],
                ['CATEGORY', article.category.toUpperCase()],
                ['DATE', article.date],
                ['STATUS', article.featured ? 'FEATURED' : 'STANDARD'],
              ] as [key, value]}
                <div class="flex justify-between items-center">
                  <span class="text-[9px] font-mono text-on-surface-variant/50 uppercase">{key}</span>
                  <span class="text-[9px] font-mono text-primary uppercase">{value}</span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Back button -->
          <a
            href="/news"
            class="w-full py-3 border border-outline-variant/30 hover:bg-primary hover:text-on-primary
                   hover:border-primary transition-all text-center text-[10px] font-bold uppercase
                   tracking-[0.2em] block"
          >
            {$lang === 'ua' ? 'ВСІ НОВИНИ' : 'ALL NEWS'}
          </a>
        </div>
      </aside>
    </div>
  </div>
</section>

<script lang="ts" module>
  /**
   * Simple markdown-to-HTML renderer.
   * Handles: headings, bold, italic, code blocks, tables, lists, links, images, horizontal rules.
   */
  function renderMarkdown(md: string): string {
    if (!md) return '';
    let html = md;

    // Escape HTML first (prevent XSS)
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks (fenced)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Tables
    html = html.replace(
      /^(\|.+\|)\n(\|[-:| ]+\|)\n((?:\|.+\|\n?)*)/gm,
      (_match, headerRow, _separator, bodyRows) => {
        const headers = headerRow
          .split('|')
          .filter((c: string) => c.trim())
          .map((c: string) => `<th>${c.trim()}</th>`)
          .join('');
        const rows = bodyRows
          .trim()
          .split('\n')
          .map((row: string) => {
            const cells = row
              .split('|')
              .filter((c: string) => c.trim())
              .map((c: string) => `<td>${c.trim()}</td>`)
              .join('');
            return `<tr>${cells}</tr>`;
          })
          .join('');
        return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      }
    );

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />');

    // Bold & italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Unordered list
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered list
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Paragraphs — wrap remaining lines
    html = html
      .split('\n\n')
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (
          trimmed.startsWith('<h') ||
          trimmed.startsWith('<pre') ||
          trimmed.startsWith('<table') ||
          trimmed.startsWith('<ul') ||
          trimmed.startsWith('<ol') ||
          trimmed.startsWith('<hr') ||
          trimmed.startsWith('<li')
        ) {
          return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');

    return html;
  }
</script>

<style>
  :global(.prose-content h1) {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    margin: 2rem 0 1rem;
    color: var(--color-on-surface);
  }
  :global(.prose-content h2) {
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    margin: 2.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgb(var(--color-outline-variant-rgb, 128 128 128) / 0.15);
    color: var(--color-on-surface);
  }
  :global(.prose-content h3) {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    margin: 1.5rem 0 0.75rem;
    color: var(--color-primary);
  }
  :global(.prose-content p) {
    margin: 1rem 0;
    line-height: 1.75;
    color: var(--color-on-surface-variant);
    font-size: 0.95rem;
  }
  :global(.prose-content strong) {
    color: var(--color-on-surface);
    font-weight: 700;
  }
  :global(.prose-content ul) {
    margin: 1rem 0;
    padding-left: 1.25rem;
  }
  :global(.prose-content li) {
    position: relative;
    padding-left: 0.75rem;
    margin: 0.5rem 0;
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--color-on-surface-variant);
  }
  :global(.prose-content li::before) {
    content: '▹';
    position: absolute;
    left: -0.5rem;
    color: var(--color-primary);
    font-weight: 700;
  }
  :global(.prose-content pre) {
    background: var(--color-surface-container);
    border-left: 3px solid var(--color-primary);
    padding: 1.25rem;
    margin: 1.5rem 0;
    overflow-x: auto;
    font-size: 0.8rem;
    line-height: 1.6;
  }
  :global(.prose-content code) {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.85em;
  }
  :global(.prose-content :not(pre) > code) {
    background: var(--color-surface-container-high);
    padding: 0.15rem 0.4rem;
    font-size: 0.8em;
  }
  :global(.prose-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.85rem;
  }
  :global(.prose-content th) {
    text-align: left;
    padding: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
    background: var(--color-surface-container);
  }
  :global(.prose-content td) {
    padding: 0.65rem 0.75rem;
    border-bottom: 1px solid rgb(var(--color-outline-variant-rgb, 128 128 128) / 0.1);
    color: var(--color-on-surface-variant);
  }
  :global(.prose-content tr:hover td) {
    background: var(--color-surface-container-low);
  }
  :global(.prose-content hr) {
    border: none;
    height: 1px;
    background: rgb(var(--color-outline-variant-rgb, 128 128 128) / 0.2);
    margin: 2rem 0;
  }
  :global(.prose-content a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.2s;
  }
  :global(.prose-content a:hover) {
    opacity: 0.8;
  }
  :global(.prose-content em) {
    font-style: italic;
    color: var(--color-on-surface-variant);
    opacity: 0.8;
  }
</style>
