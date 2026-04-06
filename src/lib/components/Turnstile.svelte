<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { env } from '$env/dynamic/public';

  interface Props {
    sitekey?: string;
    action?: string;
    theme?: 'light' | 'dark' | 'auto';
    onVerify?: (token: string) => void;
    onError?: (error: any) => void;
  }

  let { 
    sitekey = env.PUBLIC_TURNSTILE_SITE_KEY, 
    action = 'sitewide',
    theme = 'dark',
    onVerify,
    onError
  }: Props = $props();

  let container: HTMLElement;
  let widgetId: string;

  onMount(() => {
    if (!browser) return;

    const checkTurnstile = () => {
      // @ts-ignore
      if (window.turnstile) {
        // @ts-ignore
        widgetId = window.turnstile.render(container, {
          sitekey,
          action,
          theme,
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

    checkTurnstile();

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
