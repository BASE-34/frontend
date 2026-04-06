import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { en } from './en';
import { ua } from './ua';

export type Lang = 'en' | 'ua';

const translations = { en, ua };

function createLangStore() {
  const { subscribe, set, update } = writable<Lang>('ua');

  return {
    subscribe,
    /**
     * Initialize the store.
     * On server: set to serverLang.
     * On client: prioritize localStorage, fallback to serverLang.
     */
    init: (serverLang: Lang) => {
      if (!browser) {
        set(serverLang);
        return;
      }

      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved) {
        set(saved);
        document.documentElement.lang = saved;
        return;
      }

      // No saved choice: use server detected lang
      set(serverLang);
      localStorage.setItem('lang', serverLang);
      document.documentElement.lang = serverLang;
    },
    set: (val: Lang) => {
      if (browser) {
        localStorage.setItem('lang', val);
        document.documentElement.lang = val;
      }
      set(val);
    },
    toggle: () =>
      update((l: Lang) => {
        const next: Lang = l === 'ua' ? 'en' : 'ua';
        if (browser) {
          localStorage.setItem('lang', next);
          document.documentElement.lang = next;
        }
        return next;
      }),
  };
}

export const lang = createLangStore();

export const t = derived(lang, ($lang: Lang) => translations[$lang]);
