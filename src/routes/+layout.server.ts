import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/public';

export const load: LayoutServerLoad = ({ request }) => {
  // Detect preferred language from Accept-Language header for SSR
  const acceptLang = request.headers.get('accept-language') ?? '';
  const preferUa = acceptLang.toLowerCase().indexOf('uk') !== -1 || acceptLang.toLowerCase().indexOf('ua') !== -1;
  const lang = preferUa ? 'ua' : 'en';

  const enableTurnstile = env.PUBLIC_ENABLE_TURNSTILE !== 'false';

  return { 
    lang,
    enableTurnstile,
    meta: {
      title: 'B.A.S.E.34',
      description: 'Bureau of Advanced Systems & Electronics',
      image: 'https://base34.org.ua/og/default.png'
    }
  };
};

