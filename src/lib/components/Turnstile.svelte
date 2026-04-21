<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { env } from '$env/dynamic/public';

  interface Props {
    sitekey?: string;
    action?: string;
    theme?: 'light' | 'dark' | 'auto';
    appearance?: 'always' | 'execute' | 'interaction-only';
    onVerify?: (token: string) => void;
    onError?: (error: any) => void;
  }

  let { 
    sitekey = env.PUBLIC_TURNSTILE_SITE_KEY, 
    action = 'sitewide',
    theme = 'dark',
    appearance = 'always',
    onVerify,
    onError
  }: Props = $props();

  let container: HTMLElement;
  let widgetId: string;

  onMount(() => {
    if (!browser) return;

    // Dynamically load Turnstile script if not already present
    function loadTurnstileScript(): Promise<void> {
      return new Promise((resolve) => {
        // @ts-ignore
        if (window.turnstile) { resolve(); return; }
        
        const existing = document.querySelector('script[src*="turnstile"]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    const checkTurnstile = () => {
      // @ts-ignore
      if (window.turnstile) {
        // @ts-ignore
        widgetId = window.turnstile.render(container, {
          sitekey,
          action,
          theme,
          appearance,
          callback: (token: string) => {
            if (onVerify) onVerify(token);
          },
          'error-callback': (err: any) => {
            if (onError) onError(err);
          }
        });
      } else {
        setTimeout(checkTurnstile, 100);
      }
    };

    loadTurnstileScript().then(checkTurnstile);

    return () => {
      // @ts-ignore
      if (widgetId && window.turnstile) {
        // @ts-ignore
        window.turnstile.remove(widgetId);
      }
    };
  });
</script>

<div bind:this={container} class="turnstile-container"></div>

<style>
  .turnstile-container {
    display: inline-block;
  }
</style>
