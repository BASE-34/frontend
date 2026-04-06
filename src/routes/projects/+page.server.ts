import type { PageServerLoad } from './$types';
import { projects, stats } from '$lib/data/projects';

export const load: PageServerLoad = () => {
  return {
    projects,
    stats,
    meta: {
      title: 'Our Projects',
      description:
        'Explore the B.A.S.E.34 engineering portfolio: robotics, embedded systems, UAV platforms, and SCADA integration.',
      image: 'https://base34.org.ua/og/projects.png',
      keywords: ['robotics', 'UAV', 'embedded', 'SCADA', 'engineering projects']
    },
  };
};
