/**
 * In-memory sliding-window rate limiter.
 * Works per-IP. Safe for single-instance deployments (Docker single container).
 *
 * Usage:
 *   const result = rateLimit(ip, { limit: 5, windowMs: 60_000 });
 *   if (!result.ok) return fail(429, { errors: { server: result.message } });
 */

interface Window {
  timestamps: number[];
}

const store = new Map<string, Window>();

// Cleanup stale keys every 10 minutes to avoid memory leaks
setInterval(
  () => {
    const now = Date.now();
    for (const [key, win] of store) {
      if (win.timestamps.length === 0 || now - win.timestamps[win.timestamps.length - 1] > 10 * 60_000) {
        store.delete(key);
      }
    }
  },
  10 * 60_000,
);

export interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  message: string;
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let win = store.get(key);
  if (!win) {
    win = { timestamps: [] };
    store.set(key, win);
  }

  // Drop timestamps outside the window
  win.timestamps = win.timestamps.filter((t) => t > cutoff);

  if (win.timestamps.length >= limit) {
    return {
      ok: false,
      remaining: 0,
      message: 'Too many requests. Please wait a minute and try again.',
    };
  }

  win.timestamps.push(now);

  return {
    ok: true,
    remaining: limit - win.timestamps.length,
    message: '',
  };
}
