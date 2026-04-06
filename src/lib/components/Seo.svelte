<script lang="ts">
  import { lang, t } from '$lib/i18n/store';
  import { page } from '$app/state';

  interface Props {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    keywords?: string[];
    canonical?: string;
    jsonLd?: any;
  }

  let {
    title,
    description,
    image = '/og/default.png',
    type = 'website',
    keywords = [],
    canonical,
    jsonLd
  }: Props = $props();

  // Combine title with site name if provided
  const siteName = 'B.A.S.E.34';
  const fullTitle = $derived(title ? `${title} | ${siteName}` : siteName);
  const currentUrl = $derived(`https://base34.org.ua${page.url.pathname}`);
  const displayCanonical = $derived(canonical || currentUrl);

  // JSON-LD default for Organization
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'B.A.S.E.34',
    'alternateName': 'Bureau of Advanced Systems & Electronics',
    'url': 'https://base34.org.ua',
    'logo': 'https://base34.org.ua/favicon.png',
    'sameAs': [
      'https://github.com/base34',
      'https://t.me/base34'
    ]
  };

  const finalJsonLd = $derived(jsonLd ? [organizationJsonLd, jsonLd] : organizationJsonLd);
  
  // Ensure image URL is absolute for OG and Twitter
  const absoluteImageUrl = $derived(image.startsWith('http') ? image : `https://base34.org.ua${image}`);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description || $t.home.hero_body} />
  {#if keywords.length > 0}
    <meta name="keywords" content={keywords.join(', ')} />
  {/if}
  <link rel="canonical" href={displayCanonical} />

  <!-- Open Graph -->
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description || $t.home.hero_body} />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:image" content={absoluteImageUrl} />
  <meta property="og:type" content={type} />
  <meta property="og:locale" content={$lang === 'ua' ? 'uk_UA' : 'en_US'} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description || $t.home.hero_body} />
  <meta name="twitter:image" content={absoluteImageUrl} />

  <!-- Hreflang (for state-based, technically both exist at same URL) -->
  <link rel="alternate" hreflang="uk-UA" href={currentUrl} />
  <link rel="alternate" hreflang="en-US" href={currentUrl} />
  <link rel="alternate" hreflang="x-default" href={currentUrl} />

  <!-- JSON-LD -->
  {@html `<script type="application/ld+json">${JSON.stringify(finalJsonLd)}<\/script>`}
</svelte:head>
