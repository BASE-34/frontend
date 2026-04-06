import type { PageServerLoad } from './$types';
import { newsItems } from '$lib/data/news';

export const load: PageServerLoad = () => {
  return {
    newsItems,
    meta: {
      title: 'News & Updates',
      description:
        'Technical research, workshop reports, and engineering updates from the B.A.S.E.34 student association.',
      image: 'https://base34.org.ua/og/news.png',
      keywords: ['news', 'updates', 'research', 'engineering', 'workshop']
    },
  };
};
