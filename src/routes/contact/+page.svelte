<script lang="ts">
  import { t, lang } from '$lib/i18n';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { reveal, revealLeft } from '$lib/actions/reveal';
  import { decode } from '$lib/actions/decode';
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form: any } = $props();

  const submitted = $derived(form?.success === true);
  const errors = $derived(form?.errors ?? {});
  const values = $derived(form?.values ?? {});
  let loading = $state(false);

  function resetForm() {
    // Navigate to same page to clear form state
    window.location.reload();
  }
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
</svelte:head>

<PageHeader
  badge={$t.contact.badge}
  h1line1={$t.contact.h1_1}
  h1line2={$t.contact.h1_2}
  body={$t.contact.body}
  metaLines={['VERSION_4.0.2_BETA', 'LAST_UPDATE: 2026.03.02', 'Status: Online']}
/>

<div class="container mx-auto px-6 md:px-8 max-w-7xl pb-24">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

    <!-- Form panel -->
    <div class="lg:col-span-7" use:reveal>
      {#if submitted}
        <div class="bg-surface-container border-l-4 border-primary p-12 flex flex-col items-center text-center">
          <span class="material-symbols-outlined text-primary mb-4" style="font-size:48px">check_circle</span>
          <h3 class="text-2xl font-black uppercase tracking-tighter mb-3">
            {$lang === 'ua' ? 'Повідомлення надіслано' : 'Message Transmitted'}
          </h3>
          <p class="text-on-surface-variant text-sm mb-8">
            {$lang === 'ua' ? 'Ми відповімо протягом 24-48 годин.' : "We'll respond within 24–48 hours."}
          </p>
          <button onclick={resetForm} class="btn-outline">
            {$lang === 'ua' ? 'Надіслати ще' : 'Send Another'}
          </button>
        </div>
      {:else}
        <form
          method="POST"
          use:enhance={() => {
            loading = true;
            return async ({ update }) => {
              loading = false;
              await update();
            };
          }}
          class="space-y-6"
        >
          {#if errors.server}
            <div class="bg-error/10 border-l-4 border-error p-4 text-sm text-error font-bold">
              {errors.server}
            </div>
          {/if}

          {#if errors.turnstile}
            <div class="bg-error/10 border-l-4 border-error p-4 text-sm text-error font-bold">
              {errors.turnstile}
            </div>
          {/if}

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant block mb-2" for="name">
                {$t.contact.form_name}
              </label>
              <input
                id="name" name="name" required type="text"
                value={values.name ?? ''}
                class="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/50
                       focus:border-primary focus:ring-0 focus:outline-none text-on-surface
                       placeholder:text-outline/40 py-4 px-4 font-bold transition-colors
                       {errors.name ? 'border-error' : ''}"
                placeholder="Ім'я Прізвище"
              />
              {#if errors.name}
                <span class="text-[10px] text-error mt-1 block">{errors.name}</span>
              {/if}
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant block mb-2" for="email">
                {$t.contact.form_email}
              </label>
              <input
                id="email" name="email" required type="email"
                value={values.email ?? ''}
                class="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/50
                       focus:border-primary focus:ring-0 focus:outline-none text-on-surface
                       placeholder:text-outline/40 py-4 px-4 font-bold transition-colors
                       {errors.email ? 'border-error' : ''}"
                placeholder="you@knu.ua"
              />
              {#if errors.email}
                <span class="text-[10px] text-error mt-1 block">{errors.email}</span>
              {/if}
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant block mb-2" for="subject">
              {$t.contact.form_subject}
            </label>
            <input
              id="subject" name="subject" required type="text"
              value={values.subject ?? ''}
              class="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/50
                     focus:border-primary focus:ring-0 focus:outline-none text-on-surface
                     placeholder:text-outline/40 py-4 px-4 font-bold transition-colors
                     {errors.subject ? 'border-error' : ''}"
              placeholder="Membership / Collaboration / Other"
            />
            {#if errors.subject}
              <span class="text-[10px] text-error mt-1 block">{errors.subject}</span>
            {/if}
          </div>

          <div>
            <label class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant block mb-2" for="message">
              {$t.contact.form_message}
            </label>
            <textarea
              id="message" name="message" required rows={6}
              class="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/50
                     focus:border-primary focus:ring-0 focus:outline-none text-on-surface
                     placeholder:text-outline/40 py-4 px-4 font-bold transition-colors resize-none
                     {errors.message ? 'border-error' : ''}"
              placeholder={$lang === 'ua' ? 'Опишіть ваш запит...' : 'Describe your inquiry...'}
            >{values.message ?? ''}</textarea>
            {#if errors.message}
              <span class="text-[10px] text-error mt-1 block">{errors.message}</span>
            {/if}
          </div>

          <button type="submit" disabled={loading} class="btn-primary disabled:opacity-60">
            {#if loading}
              <span class="material-symbols-outlined text-sm" style="animation: spin 1s linear infinite">refresh</span>
              {$lang === 'ua' ? 'Надсилається...' : 'Transmitting...'}
            {:else}
              {$t.contact.form_submit}
              <span class="material-symbols-outlined text-sm">send</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <!-- Info sidebar -->
    <div class="lg:col-span-5 flex flex-col gap-5" use:revealLeft>
      <div class="bg-surface-container-low p-8 border-l-4 border-primary">
        <h3 class="font-black uppercase tracking-tight text-lg mb-8 text-primary">
          {$t.contact.info_title}
        </h3>
        <div class="space-y-6">
          {#each [
            { icon: 'location_on', label: $t.contact.info_location, value: $t.contact.info_location_val },
            { icon: 'mail', label: $t.contact.info_email, value: $t.contact.info_email_val },
            { icon: 'send', label: $t.contact.info_telegram, value: $t.contact.info_telegram_val },
          ] as info}
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-primary flex-shrink-0" style="font-size:20px">{info.icon}</span>
              <div>
                <div class="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-1">{info.label}</div>
                <div class="text-sm text-on-surface-variant">{info.value}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- System telemetry block -->
      <div class="bg-surface-container p-6">
        <div class="text-[10px] font-black uppercase tracking-[0.3em] text-outline mb-5">System Telemetry</div>
        <div class="space-y-2.5">
          {#each [
            ['NODE', 'KNU_PRIMARY'],
            ['COORDINATES', '50.4501°N / 30.5234°E'],
            ['STATUS', 'ONLINE'],
            ['RESPONSE_TIME', '24-48h'],
            ['ENCRYPTION', 'TLS_1.3'],
          ] as [k, v], i}
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-mono text-on-surface-variant/50 uppercase">{k}</span>
              <span class="text-[9px] font-mono text-primary uppercase" use:decode={{ targetText: v, duration: 1000 }}>{v}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Map placeholder -->
      <div class="bg-surface-container-low p-6 border-l-4 border-outline-variant/30 flex items-center gap-4">
        <span class="material-symbols-outlined text-primary" style="font-size:32px">map</span>
        <div>
          <div class="text-xs font-bold uppercase tracking-wider mb-1">
            {$lang === 'ua' ? 'Університет Шевченка' : 'Shevchenko University'}
          </div>
          <div class="text-[10px] text-on-surface-variant">
            {$lang === 'ua' ? 'Київ, пр-т Глушкова 4Г' : 'Kyiv, Hlushkova avenue 4G'}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
</style>
