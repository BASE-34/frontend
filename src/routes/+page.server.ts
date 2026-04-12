import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Stats } from '$lib/types';

export const load: PageServerLoad = async () => {
  const stats = await apiFetch<Stats>('/api/stats');
  return {
    stats,
    meta: {
      title: 'Home',
      description:
        'Bureau of Advanced Systems & Electronics — Student engineering association of Taras Shevchenko National University of Kyiv. Hardware, automation, AI, drones.',
      image: 'https://base34.org.ua/og/home.png',
      keywords: ['engineering', 'robotics', 'AI', 'SvelteKit', 'Kyiv', 'University']
    },
  };
};
