import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'B.A.S.E.34 — Bureau of Advanced Systems & Electronics',
      description:
        'Student engineering association of Taras Shevchenko National University of Kyiv. Hardware, automation, AI, drones — from idea to working prototype.',
      ogImage: '/og-home.png',
    },
  };
};
