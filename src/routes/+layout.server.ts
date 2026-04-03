import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ request }) => {
  // Detect preferred language from Accept-Language header for SSR
  const acceptLang = request.headers.get('accept-language') ?? '';
  const preferUa = acceptLang.toLowerCase().includes('uk') || acceptLang.toLowerCase().includes('ua');
  const lang = preferUa ? 'ua' : 'en';

  return { lang };
};
