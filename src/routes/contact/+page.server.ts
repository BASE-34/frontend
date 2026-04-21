import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { apiFetch } from '$lib/server/api';
import { rateLimit } from '$lib/server/rate-limit';
import { contactSchema, flattenZodErrors } from '$lib/schemas/contact';

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'Contact Us',
      description:
        'Get in touch with the B.A.S.E.34 student engineering association at Taras Shevchenko National University of Kyiv.',
      image: 'https://base34.org.ua/og/contact.png',
      keywords: ['contact', 'engineering association', 'TNU', 'Kyiv', 'collaboration'],
    },
  };
};

export const actions: Actions = {
  default: async ({ request, getClientAddress }) => {
    // ── 1. Rate limiting ──────────────────────────────────────────────────────
    const ip = getClientAddress();
    const rl = rateLimit(ip, { limit: 5, windowMs: 60_000 }); // 5 req/min per IP
    if (!rl.ok) {
      return fail(429, {
        errors: { server: rl.message },
        values: {},
      });
    }

    // ── 2. Parse form data ────────────────────────────────────────────────────
    const formData = await request.formData();

    const raw = {
      name:    formData.get('name')?.toString() ?? '',
      email:   formData.get('email')?.toString() ?? '',
      subject: formData.get('subject')?.toString() ?? '',
      message: formData.get('message')?.toString() ?? '',
    };

    const turnstileToken = formData.get('cf-turnstile-response')?.toString() ?? '';

    // ── 3. Zod validation ─────────────────────────────────────────────────────
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        errors: flattenZodErrors(parsed.error),
        values: raw,
      });
    }

    const { name, email, subject, message } = parsed.data;

    // ── 4. Turnstile verification (optional) ──────────────────────────────────
    // Enabled only when ENABLE_TURNSTILE=true AND secret key is provided.
    // Falls back gracefully: if env var is missing/undefined → disabled.
    const enableTurnstile = env.ENABLE_TURNSTILE === 'true';

    if (enableTurnstile && env.TURNSTILE_SECRET_KEY) {
      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret:   env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        });
        const result = await verifyRes.json();
        if (!result.success) {
          return fail(400, {
            errors: { turnstile: 'Security verification failed. Please try again.' },
            values: raw,
          });
        }
      } catch (err) {
        // Network failure → let the form through, log on server
        console.error('[CONTACT] Turnstile verification network error:', err);
      }
    }

    // ── 5. Forward to API backend ─────────────────────────────────────────────
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: { name, email, subject, message },
      });
    } catch (err) {
      console.error('[CONTACT] API error:', err);
      return fail(500, {
        errors: { server: 'Failed to send message. Please try again later.' },
        values: raw,
      });
    }

    return { success: true };
  },
};
