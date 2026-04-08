import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { NewsItem } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
  const article = await apiFetch<NewsItem>(`/api/news/${params.slug}`);

  return {
    article,
    meta: {
      title: article.title,
      description: article.excerpt,
      image: article.image ?? 'https://base34.org.ua/og/news.png',
      keywords: ['news', article.category, 'B.A.S.E.34'],
    },
  };
};
