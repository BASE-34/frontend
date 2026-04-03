import type { PageServerLoad } from './$types';
import { newsItems } from '$lib/data/news';

export const load: PageServerLoad = () => {
  return {
    newsItems,
    meta: {
      title: 'Field Notes & News — B.A.S.E.34',
      description:
        'Technical updates, research notes, workshop reports and events from the B.A.S.E.34 student engineering association.',
    },
  };
};
