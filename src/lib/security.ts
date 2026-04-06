import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const VERIFIED_KEY = 'base34_verified';
const VERIFIED_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function createSecurityStore() {
  const { subscribe, set } = writable<boolean>(false);

  return {
    subscribe,
    checkStatus: () => {
      if (!browser) return;
      
      const stored = localStorage.getItem(VERIFIED_KEY);
      if (!stored) {
        set(false);
        return;
      }

      try {
        const { timestamp } = JSON.parse(stored);
        const now = Date.now();
        
        if (now - timestamp < VERIFIED_TTL) {
          set(true);
        } else {
          // Expired
          localStorage.removeItem(VERIFIED_KEY);
          set(false);
        }
      } catch (e) {
        localStorage.removeItem(VERIFIED_KEY);
        set(false);
      }
    },
    markVerified: () => {
      if (!browser) return;
      const data = { timestamp: Date.now() };
      localStorage.setItem(VERIFIED_KEY, JSON.stringify(data));
      set(true);
    }
  };
}

export const security = createSecurityStore();
