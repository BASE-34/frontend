<script lang="ts">
  import { t, lang } from '$lib/i18n';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { reveal, revealLeft } from '$lib/actions/reveal';
  import { countUp } from '$lib/actions/countUp';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const projects = $derived(data.projects);
  const stats = $derived(data.stats);
</script>

<Seo 
  title={data.meta.title}
/>

<PageHeader
  badge={$t.projects.badge}
  h1line1={$t.projects.h1_1}
  h1line2={$t.projects.h1_2}
  body={$t.projects.body}
  metaLines={['VERSION_6.0_ACTIVE', 'NODE: KNU_PRIMARY', 'STATUS: ONLINE']}
/>

<!-- Projects Grid -->
<section class="py-16 bg-surface-container-lowest">
  <div class="container mx-auto px-6 md:px-8">
    <div use:reveal class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12">
      <div>
        <span class="text-primary text-xs tracking-[0.3em] uppercase font-bold block mb-3">
          {$t.projects.registry}
        </span>
        <h2 class="text-4xl font-black uppercase tracking-tighter">{$t.projects.current}</h2>
      </div>
      <div class="text-right hidden md:block">
        <span class="text-[10px] text-on-surface-variant uppercase font-mono">{$t.projects.filter_all}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each projects as project, i}
        <ProjectCard {project} delay={i * 80} />
      {/each}

      <!-- Open slot for new project -->
      <div
        use:reveal={{ delay: projects.length * 80 }}
        class="bg-surface-container-low/50 border border-dashed border-outline-variant/40
               flex flex-col items-center justify-center p-10 opacity-40 min-h-[280px]"
      >
        <span class="material-symbols-outlined text-4xl mb-4 text-outline">add_circle</span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-outline text-center">
          {$t.projects.awaiting}
        </span>
      </div>
    </div>
  </div>
</section>

<!-- Stats bar -->
<section class="py-16 border-y border-outline-variant/15">
  <div class="container mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
    {#each [
      { label: $t.projects.stat_active, value: stats.active },
      { label: $t.projects.stat_hw, value: stats.hardware },
      { label: $t.projects.stat_workshops, value: stats.workshops },
      { label: $t.projects.stat_members, value: stats.members },
    ] as stat, i}
      <div use:reveal={{ delay: i * 80 }} class="flex flex-col">
        <span class="text-[10px] font-bold tracking-[0.3em] uppercase text-outline mb-2">{stat.label}</span>
        <span class="text-4xl font-black tracking-tighter text-primary" use:countUp={{ target: stat.value, duration: 2500, suffix: "+" }}>0+</span>
      </div>
    {/each}
  </div>
</section>

<!-- CTA strip -->
<section class="py-16 bg-surface-container-lowest">
  <div class="container mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
    <div use:revealLeft>
      <h3 class="text-2xl font-black uppercase tracking-tighter mb-2">
        {$lang === 'ua' ? 'Маєш ідею проекту?' : 'Have a project idea?'}
      </h3>
      <p class="text-on-surface-variant text-sm">
        {$lang === 'ua' ? 'Подай заявку через нашу форму контакту.' : 'Submit a proposal through our contact form.'}
      </p>
    </div>
    <div use:reveal>
      <a href="/contact" class="btn-primary flex-shrink-0">
        {$lang === 'ua' ? 'Запропонувати проект _' : 'Propose a Project _'}
      </a>
    </div>
  </div>
</section>
