import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { en } from './en';
import { ua } from './ua';

export type Lang = 'en' | 'ua';

const translations = { en, ua };

function createLangStore() {
  const defaultLang: Lang =
    browser
      ? ((localStorage.getItem('lang') as Lang) ?? 'ua')
      : 'ua';

  const { subscribe, set, update } = writable<Lang>(defaultLang);

  return {
    subscribe,
    set: (lang: Lang) => {
      if (browser) localStorage.setItem('lang', lang);
      set(lang);
    },
    toggle: () =>
      update((l) => {
        const next: Lang = l === 'ua' ? 'en' : 'ua';
        if (browser) localStorage.setItem('lang', next);
        return next;
      }),
  };
}

export const lang = createLangStore();

export const t = derived(lang, ($lang) => translations[$lang]);
