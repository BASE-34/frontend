import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name is required (min 2 characters)')
    .max(100, 'Name is too long (max 100 characters)'),

  email: z
    .string()
    .trim()
    .email('Valid email is required')
    .max(254, 'Email is too long'),

  subject: z
    .string()
    .trim()
    .min(2, 'Subject is required')
    .max(200, 'Subject is too long (max 200 characters)'),

  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long (max 5000 characters)'),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Convert Zod errors to a flat Record<field, message> */
export function flattenZodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0]?.toString() ?? '_';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
