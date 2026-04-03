import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'Contact — B.A.S.E.34',
      description:
        'Get in touch with the B.A.S.E.34 student engineering association at Taras Shevchenko National University of Kyiv.',
    },
  };
};
