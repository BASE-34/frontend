<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { security } from '$lib/security';
  import Turnstile from './Turnstile.svelte';

  let visible = $state(false);
  let status = $state('initializing security protocol...');
  let logs = $state<string[]>([]);

  function addLog(msg: string) {
    logs = [msg, ...logs].slice(0, 5);
  }

  onMount(() => {
    visible = true;
    setTimeout(() => {
      status = 'analyzing connection signature...';
      addLog('network: inbound request detected');
    }, 1000);
    setTimeout(() => {
      status = 'verification required: please verify humanity';
      addLog('sys: automated screening active');
    }, 2500);
  });

  function handleVerify(token: string) {
    status = 'signature confirmed. accessing mainframe...';
    addLog('auth: token signature valid');
    
    setTimeout(() => {
      security.markVerified();
    }, 1500);
  }

  function handleError(err: any) {
    status = 'verification error. please retry.';
    addLog('err: signature failed');
  }
</script>

{#if visible}
  <div 
    class="fixed inset-0 z-[1000] bg-surface flex flex-col items-center justify-center overflow-hidden"
    transition:fade={{ duration: 600 }}
  >
    <!-- Background FX -->
    <div class="scanline-fx opacity-40"></div>
    <div class="fixed inset-0 bg-[url('/grid.png')] opacity-[0.03] pointer-events-none"></div>
    
    <!-- Ambient glow -->
    <div class="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(164,209,174,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-lg px-8 flex flex-col items-center text-center">
      <!-- Badge -->
      <div class="flex items-center gap-2 mb-8" in:fly={{ y: -20, delay: 400 }}>
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">Security Screening</span>
      </div>

      <!-- Main brand -->
      <h1 class="text-4xl lg:text-5xl font-black tracking-tighter text-primary mb-2 error-flicker">
        B.A.S.E.34
      </h1>
      <p class="text-[10px] text-on-surface-variant uppercase tracking-[0.25em] mb-12">
        Bureau of Advanced Systems & Electronics
      </p>

      <!-- Status & Widget -->
      <div class="w-full bg-surface-container-low border border-outline-variant/10 p-10 mb-8 relative group">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-surface-container-low">
            <span class="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40">Auth_Node_Beta</span>
        </div>

        <p class="text-xs font-bold uppercase tracking-widest text-on-surface mb-8 min-h-[1.5em]">
          {status}
        </p>

        <div class="flex justify-center">
          <Turnstile onVerify={handleVerify} onError={handleError} />
        </div>
      </div>

      <!-- Logs -->
      <div class="w-full max-w-[280px] h-24 overflow-hidden text-left opacity-30 select-none">
        {#each logs as log, i}
          <div class="text-[9px] font-mono leading-relaxed" transition:fly={{ x: -10, duration: 300 }}>
            <span class="text-primary mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        {/each}
      </div>
    </div>

    <!-- Corner markers -->
    <div class="corner-marker top-12 left-12"></div>
    <div class="corner-marker top-12 right-12 transform scale-x-[-1]"></div>
    <div class="corner-marker bottom-12 left-12 transform scale-y-[-1]"></div>
    <div class="corner-marker bottom-12 right-12 transform scale-[-1]"></div>
  </div>
{/if}
