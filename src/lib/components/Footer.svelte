<script lang="ts">
  import { t } from '$lib/i18n';
  import Turnstile from './Turnstile.svelte';
</script>

<footer class="bg-surface-container-lowest border-t border-outline-variant/10 pt-16 pb-8">
  <div class="container mx-auto px-6 md:px-8">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
      <!-- Brand block -->
      <div class="md:col-span-5">
        <div class="text-3xl font-black tracking-tighter text-primary mb-3">B.A.S.E.34</div>
        <div class="text-[10px] text-on-surface-variant uppercase tracking-[0.25em] mb-6">
          {$t.footer.tagline}
        </div>
        <div class="pcb-line mb-6"></div>
        <p class="text-xs text-outline leading-relaxed max-w-xs">
          {$t.footer.coords}
        </p>
      </div>

      <!-- Nav -->
      <div class="md:col-span-3">
        <h4 class="meta-label mb-5">{$t.footer.nav_title}</h4>
        <nav class="flex flex-col gap-3">
          <a href="/projects" class="text-sm text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider">
            {$t.nav.projects}
          </a>
          <a href="/news" class="text-sm text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider">
            {$t.nav.news}
          </a>
          <a href="/protocol" class="text-sm text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider">
            {$t.nav.protocol}
          </a>
          <a href="/contact" class="text-sm text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider">
            {$t.nav.contact}
          </a>
        </nav>
      </div>

      <!-- Legal -->
      <div class="md:col-span-2">
        <h4 class="meta-label mb-5">{$t.footer.legal_title}</h4>
        <nav class="flex flex-col gap-3">
          <a href="/protocol" class="text-sm text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider">
            {$t.footer.statute}
          </a>
          <a href="/protocol" class="text-sm text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider">
            {$t.footer.privacy}
          </a>
        </nav>
      </div>

      <!-- Status block -->
      <div class="md:col-span-2">
        <h4 class="meta-label mb-5">System</h4>
        <div class="bg-surface-container-low p-4 flex flex-col gap-4">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span class="text-[9px] font-mono text-primary uppercase tracking-widest">ONLINE</span>
            </div>
            <div class="text-[9px] font-mono text-on-surface-variant/60 space-y-1">
              <div>VER: 1.0.2_BETA</div>
              <div>UPTIME: 99.8%</div>
              <div>NODE: KNU_PRIMARY</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="pcb-line mb-6"></div>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <p class="text-[10px] text-outline uppercase tracking-widest">{$t.footer.copy}</p>
      <div class="flex gap-6">
        <a href="https://t.me/sa_base34" target="_blank" rel="noopener"
           class="text-[10px] font-bold text-outline hover:text-primary transition-colors uppercase tracking-widest">
          Telegram
        </a>
        <a href="https://github.com/BASE-34" target="_blank" rel="noopener"
           class="text-[10px] font-bold text-outline hover:text-primary transition-colors uppercase tracking-widest">
          GitHub
        </a>
      </div>
    </div>
  </div>
</footer>
