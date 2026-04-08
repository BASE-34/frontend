import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
  const project = await apiFetch<Project>(`/api/projects/${params.slug}`);

  return {
    project,
    meta: {
      title: project.title,
      description: project.description,
      image: project.image ?? 'https://base34.org.ua/og/projects.png',
      keywords: ['project', ...project.tags.slice(0, 3), 'B.A.S.E.34'],
    },
  };
};
