<script lang="ts">
  import { t, lang } from "$lib/i18n";
  import { reveal, revealLeft } from "$lib/actions/reveal";
  import { countUp } from "$lib/actions/countUp";
  import { decode } from "$lib/actions/decode";
  import { tilt } from "$lib/actions/tilt";
  import CubeMatrix from "$lib/components/CubeMatrix.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const stats = $derived(data.stats);
</script>

<Seo 
  title="B.A.S.E.34 — Bureau of Advanced Systems & Electronics"
/>

<!-- HERO -->
<section class="relative min-h-screen flex items-center overflow-hidden">
  <div class="absolute inset-0 z-0 pointer-events-none">
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] animate-breath"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-container/10 blur-[120px] animate-breath"
      style="animation-delay: -4s"
    ></div>
  </div>

  <div
    class="container mx-auto px-6 md:px-8 grid grid-cols-12 gap-8 relative z-10 py-28"
  >
    <div class="col-span-12 lg:col-span-8 flex flex-col justify-center">
      <div use:reveal={{ delay: 0 }} class="mb-5 flex items-center gap-4">
        <span class="h-px w-12 bg-primary flex-shrink-0"></span>
        <span class="text-primary text-xs tracking-[0.3em] uppercase font-bold"
          >{$t.home.badge}</span
        >
      </div>

      <div use:reveal={{ delay: 100 }}>
        <h1
          class="text-5xl sm:text-7xl lg:text-8xl font-black font-headline leading-[0.88] tracking-tighter mb-8 uppercase italic"
        >
          {$t.home.hero_h1_1}<br />
          <span class="text-primary">{$t.home.hero_h1_2}</span><br />
          {$t.home.hero_h1_3}
        </h1>
      </div>

      <div use:reveal={{ delay: 200 }}>
        <p
          class="text-lg text-on-surface-variant max-w-xl font-body leading-relaxed mb-10"
        >
          {$t.home.hero_body}
        </p>
      </div>

      <div use:reveal={{ delay: 300 }} class="flex flex-wrap gap-4">
        <a href="/contact" class="btn-primary">{$t.home.cta_primary}</a>
        <a href="/protocol" class="btn-outline">{$t.home.cta_secondary}</a>
      </div>

      <div
        use:reveal={{ delay: 420 }}
        class="flex flex-wrap gap-10 mt-12 pt-8 border-t border-outline-variant/15"
      >
        <div>
          <div
            class="text-3xl font-black text-primary tracking-tighter"
            use:countUp={{ target: stats.members, duration: 2000, suffix: "+" }}
          >
            0+
          </div>
          <div
            class="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1"
          >
            {$t.home.stat_members}
          </div>
        </div>
        <div>
          <div
            class="text-3xl font-black text-primary tracking-tighter"
            use:countUp={{ target: stats.active, duration: 2000, suffix: "+" }}
          >
            0+
          </div>
          <div
            class="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1"
          >
            {$t.home.stat_projects}
          </div>
        </div>
        <div>
          <div
            class="text-3xl font-black text-primary tracking-tighter"
            use:countUp={{ target: stats.founded, duration: 2500, delay: 300 }}
          >
            0
          </div>
          <div
            class="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1"
          >
            Founded
          </div>
        </div>
      </div>
    </div>

    <div
      class="hidden lg:col-span-4 lg:flex flex-col justify-end items-end gap-4"
    >
      <div
        use:reveal={{ delay: 180 }}
        class="bg-surface-container-low p-6 w-full border-l-4 border-primary"
      >
        <div class="flex justify-between items-start mb-4">
          <span
            class="text-[9px] text-on-surface-variant uppercase tracking-tighter"
            >Lat: 50.4501 N</span
          >
          <span
            class="text-[9px] text-on-surface-variant uppercase tracking-tighter"
            >Lon: 30.5234 E</span
          >
        </div>
        <div
          class="h-1 bg-surface-container-highest w-full overflow-hidden mb-2"
        >
          <div
            class="h-full bg-primary"
            style="width:0%"
            aria-hidden="true"
            use:countUp={{
              target: 100,
              duration: 5000,
              delay: 400,
              updateWidth: true,
            }}
          ></div>
        </div>
        <div class="flex justify-between text-[9px] font-mono text-primary">
          <span>{$t.home.status_label}</span><span
            use:countUp={{
              target: 100,
              duration: 5000,
              delay: 400,
              suffix: "%",
            }}>0%</span
          >
        </div>
      </div>

      <div
        use:reveal={{ delay: 280 }}
        class="w-full bg-surface-container p-8 flex flex-col items-center gap-6"
      >
        <div
          class="text-[9px] font-mono text-primary/70 uppercase tracking-widest"
        >
          // SYSTEM MATRIX //
        </div>

        <CubeMatrix />

        <div class="text-[9px] font-mono text-outline">B.A.S.E.34 // KNU</div>
      </div>
    </div>
  </div>
</section>

<div class="pcb-line"></div>

<!-- MISSION -->
<section class="py-24 bg-surface-container-lowest">
  <div class="container mx-auto px-6 md:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div class="relative">
        <div use:revealLeft>
          <div
            class="text-primary text-xs tracking-[0.3em] uppercase mb-3 font-bold"
          >
            {$t.home.mission_eyebrow}
          </div>
          <h2 class="text-4xl font-black uppercase tracking-tighter mb-6">
            {$t.home.mission_h2_1}<br />
            <span class="text-primary italic">{$t.home.mission_h2_2}</span>
          </h2>
          <p class="text-on-surface-variant text-base leading-relaxed">
            {$t.home.mission_body}
          </p>
        </div>
      </div>

      <div use:reveal class="flex flex-col gap-px bg-outline-variant/10">
        <div
          class="bg-surface p-6 border-l-4 border-primary/20 hover:border-primary transition-colors duration-300 glow-hover"
        >
          <div class="flex items-center gap-4 mb-3">
            <span
              class="material-symbols-outlined text-primary"
              style="font-size:26px">build</span
            >
            <h3 class="font-bold uppercase tracking-tight text-sm">
              {$t.home.pillar_1_title}
            </h3>
          </div>
          <p class="text-sm text-on-surface-variant">{$t.home.pillar_1_body}</p>
        </div>
        <div
          class="bg-surface p-6 border-l-4 border-primary/20 hover:border-primary transition-colors duration-300 glow-hover"
        >
          <div class="flex items-center gap-4 mb-3">
            <span
              class="material-symbols-outlined text-primary"
              style="font-size:26px">groups</span
            >
            <h3 class="font-bold uppercase tracking-tight text-sm">
              {$t.home.pillar_2_title}
            </h3>
          </div>
          <p class="text-sm text-on-surface-variant">{$t.home.pillar_2_body}</p>
        </div>
        <div
          class="bg-surface p-6 border-l-4 border-primary/20 hover:border-primary transition-colors duration-300 glow-hover"
        >
          <div class="flex items-center gap-4 mb-3">
            <span
              class="material-symbols-outlined text-primary"
              style="font-size:26px">school</span
            >
            <h3 class="font-bold uppercase tracking-tight text-sm">
              {$t.home.pillar_3_title}
            </h3>
          </div>
          <p class="text-sm text-on-surface-variant">{$t.home.pillar_3_body}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- EXPERTISE BENTO -->
<section class="py-24">
  <div class="container mx-auto px-6 md:px-8">
    <div class="mb-14" use:revealLeft>
      <div
        class="text-primary text-xs tracking-[0.3em] uppercase mb-3 font-bold"
      >
        {$t.home.expertise_badge}
      </div>
      <h2 class="text-4xl font-black uppercase tracking-tighter">
        {$t.home.expertise_title}
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {#each $t.home.expertise_items as item, i}
        <div
          use:reveal={{ delay: i * 70 }}
          class="bg-surface-container p-8 border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-high transition-all duration-300 group glow-hover"
        >
          <span
            class="material-symbols-outlined text-primary mb-5 block"
            style="font-size:36px">{item.icon}</span
          >
          <h3
            class="font-bold uppercase tracking-tight text-sm mb-3 group-hover:text-primary transition-colors"
          >
            {item.title}
          </h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            {item.body}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA -->
<section
  class="py-24 bg-surface-container-lowest border-y border-outline-variant/10"
>
  <div class="container mx-auto px-6 md:px-8">
    <div use:reveal class="max-w-2xl mx-auto text-center">
      <div
        class="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-bold"
      >
        // Join_Us
      </div>
      <h2
        class="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6"
      >
        {$t.home.cta_section_title}
      </h2>
      <p class="text-on-surface-variant leading-relaxed mb-10">
        {$t.home.cta_section_body}
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/contact" class="btn-primary">{$t.home.cta_join}</a>
        <a href="/projects" class="btn-outline">
          {$t.home.cta_projects_link}
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
    </div>
  </div>
</section>
