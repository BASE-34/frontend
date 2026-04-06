import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const site = 'https://base34.org.ua';
  const pages = [
    '',
    '/news',
    '/projects',
    '/protocol',
    '/contact'
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pages
    .map((page) => {
      return `
  <url>
    <loc>${site}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="uk" href="${site}${page}" />
    <xhtml:link rel="alternate" hreflang="en" href="${site}${page}" />
  </url>`;
    })
    .join('')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
