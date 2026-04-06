import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'Protocol & Statute',
      description:
        'Information protocol, statute, technical standards, and membership workflows of B.A.S.E.34.',
      image: 'https://base34.org.ua/og/protocol.png',
      keywords: ['protocol', 'statute', 'standards', 'membership', 'FAQ']
    },
  };
};
