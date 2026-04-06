import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'Contact Us',
      description:
        'Get in touch with the B.A.S.E.34 student engineering association at Taras Shevchenko National University of Kyiv.',
      image: 'https://base34.org.ua/og/contact.png',
      keywords: ['contact', 'engineering association', 'TNU', 'Kyiv', 'collaboration']
    },
  };
};
