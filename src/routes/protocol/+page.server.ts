import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'Protocol & Statute — B.A.S.E.34',
      description:
        'B.A.S.E.34 information protocol, statute, FAQ, technical standards and membership workflows.',
    },
  };
};
