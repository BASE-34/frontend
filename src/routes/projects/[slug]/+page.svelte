<script lang="ts">
  import { t, lang } from '$lib/i18n';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { reveal, revealLeft } from '$lib/actions/reveal';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const project = $derived(data.project);

  const statusLabels: Record<string, { en: string; ua: string }> = {
    active: { en: 'ACTIVE', ua: 'АКТИВНИЙ' },
    dev: { en: 'IN DEV', ua: 'В РОЗРОБЦІ' },
    mock: { en: 'MOCK', ua: 'ПРОТОТИП' },
    completed: { en: 'COMPLETED', ua: 'ЗАВЕРШЕНО' },
  };

  const statusColors: Record<string, string> = {
    active: 'text-primary bg-primary/10 border-primary/20',
    dev: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    mock: 'text-primary bg-primary/10 border-primary/20',
    completed: 'text-outline bg-outline/10 border-outline/20',
  };

  const title = $derived($lang === 'ua' ? project.title_ua : project.title);
  const description = $derived($lang === 'ua' ? project.description_ua : project.description);
  const content = $derived(
    $lang === 'ua'
      ? (project.full_description_ua ?? project.description_ua)
      : (project.full_description ?? project.description)
  );
  const tags = $derived($lang === 'ua' ? project.tags_ua : project.tags);
</script>

<Seo
  {title}
  {description}
  image={project.image}
  type="article"
/>

<!-- Hero -->
<section class="relative overflow-hidden" style="min-height: 380px">
  {#if project.image}
    <img
      src={project.image}
      alt={title}
      class="absolute inset-0 w-full h-full object-cover opacity-25 grayscale"
    />
  {/if}
  <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/40"></div>

  <div class="relative z-10 container mx-auto px-6 md:px-8 max-w-5xl pt-32 pb-16">
    <!-- Back link -->
    <div use:reveal class="mb-8">
      <a
        href="/projects"
        class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant
               hover:text-primary transition-colors group"
      >
        <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        {$lang === 'ua' ? 'Назад до проектів' : 'Back to Projects'}
      </a>
    </div>

    <!-- Status badge -->
    <div use:reveal={{ delay: 100 }} class="mb-6">
      <span class="inline-flex items-center gap-1.5 px-2 py-1 border {statusColors[project.status]}">
        <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow"></span>
        <span class="text-[9px] font-bold tracking-widest uppercase">
          {statusLabels[project.status]?.[$lang] ?? project.status.toUpperCase()}
        </span>
      </span>
    </div>

    <!-- Title -->
    <h1 use:reveal={{ delay: 200 }} class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-6 uppercase">
      {title}
    </h1>

    <!-- Description -->
    <p use:reveal={{ delay: 300 }} class="text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
      {description}
    </p>

    <!-- Tags -->
    <div use:reveal={{ delay: 400 }} class="flex flex-wrap gap-2">
      {#each tags as tag}
        <span class="text-[9px] font-mono text-outline px-2 py-1 border border-outline-variant/30 uppercase tracking-wider">
          {tag}
        </span>
      {/each}
    </div>
  </div>
</section>

<div class="pcb-line"></div>

<!-- Project Content -->
<section class="py-16 bg-surface-container-lowest">
  <div class="container mx-auto px-6 md:px-8 max-w-5xl">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Main content -->
      <article use:reveal class="lg:col-span-8 prose-content">
        {@html renderMarkdown(content)}
      </article>

      <!-- Sidebar -->
      <aside class="lg:col-span-4" use:revealLeft>
        <div class="sticky top-24 space-y-6">
          <!-- Key Metric -->
          <div class="bg-surface-container p-6 border-l-4 border-primary">
            <div class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/60 mb-2">
              {$lang === 'ua' ? project.metric_label_ua : project.metric_label}
            </div>
            <div class="text-3xl font-black tracking-tighter text-primary">
              {project.metric_value}
            </div>
          </div>

          <!-- Project Info -->
          <div class="bg-surface-container p-5">
            <div class="text-[9px] font-black uppercase tracking-[0.3em] text-outline mb-4">
              Project Info
            </div>
            <div class="space-y-3">
              {#each [
                ['STATUS', statusLabels[project.status]?.[$lang] ?? project.status],
                ['ID', project.id],
                ['TAGS', tags.length.toString()],
              ] as [key, value]}
                <div class="flex justify-between items-center">
                  <span class="text-[9px] font-mono text-on-surface-variant/50 uppercase">{key}</span>
                  <span class="text-[9px] font-mono text-primary uppercase">{value}</span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Icon -->
          {#if project.icon}
            <div class="bg-surface-container-high p-8 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary" style="font-size: 64px">
                {project.icon}
              </span>
            </div>
          {/if}

          <!-- Back button -->
          <a
            href="/projects"
            class="w-full py-3 border border-outline-variant/30 hover:bg-primary hover:text-on-primary
                   hover:border-primary transition-all text-center text-[10px] font-bold uppercase
                   tracking-[0.2em] block"
          >
            {$lang === 'ua' ? 'ВСІ ПРОЕКТИ' : 'ALL PROJECTS'}
          </a>
        </div>
      </aside>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="py-16 border-t border-outline-variant/15">
  <div class="container mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
    <div use:revealLeft>
      <h3 class="text-2xl font-black uppercase tracking-tighter mb-2">
        {$lang === 'ua' ? 'Хочеш долучитись?' : 'Want to contribute?'}
      </h3>
      <p class="text-on-surface-variant text-sm">
        {$lang === 'ua' ? 'Приєднуйся до команди цього проекту.' : 'Join this project\'s team.'}
      </p>
    </div>
    <div use:reveal>
      <a href="/contact" class="btn-primary flex-shrink-0">
        {$lang === 'ua' ? 'Зв\'язатись з нами _' : 'Get In Touch _'}
      </a>
    </div>
  </div>
</section>

<script lang="ts" module>
  function renderMarkdown(md: string): string {
    if (!md) return '';
    let html = md;

    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(
      /^(\|.+\|)\n(\|[-:| ]+\|)\n((?:\|.+\|\n?)*)/gm,
      (_match, headerRow, _sep, bodyRows) => {
        const headers = headerRow.split('|').filter((c: string) => c.trim()).map((c: string) => `<th>${c.trim()}</th>`).join('');
        const rows = bodyRows.trim().split('\n').map((row: string) => {
          const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td>${c.trim()}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      }
    );
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^---$/gm, '<hr />');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.split('\n\n').map((block) => {
      const t = block.trim();
      if (!t) return '';
      if (t.startsWith('<h') || t.startsWith('<pre') || t.startsWith('<table') || t.startsWith('<ul') || t.startsWith('<ol') || t.startsWith('<hr') || t.startsWith('<li')) return t;
      return `<p>${t.replace(/\n/g, '<br />')}</p>`;
    }).join('\n');

    return html;
  }
</script>

<style>
  :global(.prose-content h1) { font-size: 2rem; font-weight: 900; letter-spacing: -0.03em; text-transform: uppercase; margin: 2rem 0 1rem; }
  :global(.prose-content h2) { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgb(var(--color-outline-variant-rgb, 128 128 128) / 0.15); }
  :global(.prose-content h3) { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.01em; text-transform: uppercase; margin: 1.5rem 0 0.75rem; color: var(--color-primary); }
  :global(.prose-content p) { margin: 1rem 0; line-height: 1.75; color: var(--color-on-surface-variant); font-size: 0.95rem; }
  :global(.prose-content strong) { color: var(--color-on-surface); font-weight: 700; }
  :global(.prose-content ul) { margin: 1rem 0; padding-left: 1.25rem; }
  :global(.prose-content li) { position: relative; padding-left: 0.75rem; margin: 0.5rem 0; font-size: 0.95rem; line-height: 1.65; color: var(--color-on-surface-variant); }
  :global(.prose-content li::before) { content: '▹'; position: absolute; left: -0.5rem; color: var(--color-primary); font-weight: 700; }
  :global(.prose-content pre) { background: var(--color-surface-container); border-left: 3px solid var(--color-primary); padding: 1.25rem; margin: 1.5rem 0; overflow-x: auto; font-size: 0.8rem; line-height: 1.6; }
  :global(.prose-content code) { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.85em; }
  :global(.prose-content :not(pre) > code) { background: var(--color-surface-container-high); padding: 0.15rem 0.4rem; font-size: 0.8em; }
  :global(.prose-content table) { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.85rem; }
  :global(.prose-content th) { text-align: left; padding: 0.75rem; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em; color: var(--color-primary); border-bottom: 2px solid var(--color-primary); background: var(--color-surface-container); }
  :global(.prose-content td) { padding: 0.65rem 0.75rem; border-bottom: 1px solid rgb(var(--color-outline-variant-rgb, 128 128 128) / 0.1); color: var(--color-on-surface-variant); }
  :global(.prose-content hr) { border: none; height: 1px; background: rgb(var(--color-outline-variant-rgb, 128 128 128) / 0.2); margin: 2rem 0; }
  :global(.prose-content a) { color: var(--color-primary); text-decoration: underline; text-underline-offset: 2px; }
  :global(.prose-content em) { font-style: italic; color: var(--color-on-surface-variant); opacity: 0.8; }
</style>
