import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { NewsItem } from '$lib/types';

export const load: PageServerLoad = async () => {
  const newsItems = await apiFetch<NewsItem[]>('/api/news');

  return {
    newsItems,
    meta: {
      title: 'News & Updates',
      description:
        'Technical research, workshop reports, and engineering updates from the B.A.S.E.34 student association.',
      image: 'https://base34.org.ua/og/news.png',
      keywords: ['news', 'updates', 'research', 'engineering', 'workshop'],
    },
  };
};
