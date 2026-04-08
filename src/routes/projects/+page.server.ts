import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project, Stats } from '$lib/types';

export const load: PageServerLoad = async () => {
  const [projects, stats] = await Promise.all([
    apiFetch<Project[]>('/api/projects'),
    apiFetch<Stats>('/api/stats'),
  ]);

  return {
    projects,
    stats,
    meta: {
      title: 'Our Projects',
      description:
        'Explore the B.A.S.E.34 engineering portfolio: robotics, embedded systems, UAV platforms, and SCADA integration.',
      image: 'https://base34.org.ua/og/projects.png',
      keywords: ['robotics', 'UAV', 'embedded', 'SCADA', 'engineering projects'],
    },
  };
};
