import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'Home',
      description:
        'Bureau of Advanced Systems & Electronics — Student engineering association of Taras Shevchenko National University of Kyiv. Hardware, automation, AI, drones.',
      image: 'https://base34.org.ua/og/home.png',
      keywords: ['engineering', 'robotics', 'AI', 'SvelteKit', 'Kyiv', 'University']
    },
  };
};
