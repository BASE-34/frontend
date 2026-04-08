<script lang="ts">
  import type { Project } from '$lib/types';
  import { t, lang } from '$lib/i18n';
  import { reveal } from '$lib/actions/reveal';

  interface Props {
    project: Project;
    delay?: number;
  }

  let { project, delay = 0 }: Props = $props();

  const statusColors = {
    active: 'text-primary bg-primary/10 border-primary/20',
    mock: 'text-primary bg-primary/10 border-primary/20',
    dev: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    completed: 'text-outline bg-outline/10 border-outline/20',
  };
</script>

<a
  href="/projects/{project.id}"
  use:reveal={{ delay }}
  class="surface-card group glow-hover flex flex-col block"
>
  <!-- Image / Icon area -->
  <div class="aspect-video bg-surface-container-low overflow-hidden relative">
    <!-- Status badge -->
    <div class="absolute top-3 left-3 z-10 px-2 py-1 flex items-center gap-1.5
                border backdrop-blur-sm {statusColors[project.status]}">
      <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow"></span>
      <span class="text-[9px] font-bold tracking-widest uppercase">
        {$lang === 'ua' ? (project.status === 'active' ? 'АКТИВНИЙ' : project.status === 'dev' ? 'В РОЗРОБЦІ' : 'MOCK') : project.status.toUpperCase()}
      </span>
    </div>

    {#if project.image}
      <img
        src={project.image}
        alt={$lang === 'ua' ? project.title_ua : project.title}
        class="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center">
        <span class="material-symbols-outlined text-outline-variant text-5xl group-hover:text-primary transition-colors duration-300">
          {project.icon ?? 'precision_manufacturing'}
        </span>
      </div>
    {/if}
  </div>

  <!-- Content -->
  <div class="p-6 flex flex-col flex-1">
    <h3 class="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">
      {$lang === 'ua' ? project.title_ua : project.title}
    </h3>
    <p class="text-sm text-on-surface-variant mb-4 line-clamp-2 flex-1">
      {$lang === 'ua' ? project.description_ua : project.description}
    </p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1.5 mb-4">
      {#each project.tags as tag}
        <span class="text-[9px] font-mono text-outline px-1.5 py-0.5 border border-outline-variant/30 uppercase tracking-wider">
          {tag}
        </span>
      {/each}
    </div>

    <!-- Metric -->
    <div class="flex justify-between items-center py-3 border-t border-outline-variant/10 mb-4">
      <span class="text-[10px] font-bold uppercase text-on-surface-variant/60 tracking-widest">
        {$lang === 'ua' ? project.metric_label_ua : project.metric_label}:
      </span>
      <span class="text-sm font-mono text-primary">{project.metric_value}</span>
    </div>

    <span
      class="w-full py-3 border border-outline-variant/30 group-hover:bg-primary group-hover:text-on-primary
             group-hover:border-primary transition-all text-center text-[10px] font-bold uppercase
             tracking-[0.2em] block"
    >
      {$t.projects.access_docs}
    </span>
  </div>
</a>
