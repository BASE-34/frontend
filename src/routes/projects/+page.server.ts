import type { PageServerLoad } from './$types';
import { projects, stats } from '$lib/data/projects';

export const load: PageServerLoad = () => {
  return {
    projects,
    stats,
    meta: {
      title: 'Projects & Deployments — B.A.S.E.34',
      description:
        'An archive of B.A.S.E.34 engineering projects: robotics, embedded systems, UAV platforms, SCADA integration and more.',
    },
  };
};
