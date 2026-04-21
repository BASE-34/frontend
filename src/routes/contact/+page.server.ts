import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { apiFetch } from '$lib/server/api';
import { env } from '$env/dynamic/private';

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
  default: async ({ request }) => {
    const formData = await request.formData();

    const name = formData.get('name')?.toString()?.trim() ?? '';
    const email = formData.get('email')?.toString()?.trim() ?? '';
    const subject = formData.get('subject')?.toString()?.trim() ?? '';
    const message = formData.get('message')?.toString()?.trim() ?? '';
    const turnstileToken = formData.get('cf-turnstile-response')?.toString() ?? '';

    // Server-side validation
    const errors: Record<string, string> = {};

    if (!name || name.length < 2) {
      errors.name = 'Name is required (min 2 characters)';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Valid email is required';
    }
    if (!subject || subject.length < 2) {
      errors.subject = 'Subject is required';
    }
    if (!message || message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, values: { name, email, subject, message } });
    }

    // Optional Turnstile verification
    const enableTurnstile = env.ENABLE_TURNSTILE === 'true';
    if (enableTurnstile && env.TURNSTILE_SECRET_KEY) {
      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        });
        const result = await verifyRes.json();
        if (!result.success) {
          return fail(400, {
            errors: { turnstile: 'Security verification failed. Please try again.' },
            values: { name, email, subject, message },
          });
        }
      } catch {
        console.error('Turnstile verification error');
        // In case of network failure, we let the form through
      }
    }

    // Forward to API backend
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: { name, email, subject, message },
      });
    } catch (err) {
      console.error('Contact API error:', err);
      return fail(500, {
        errors: { server: 'Failed to send message. Please try again later.' },
        values: { name, email, subject, message },
      });
    }

    return { success: true };
  },
};
