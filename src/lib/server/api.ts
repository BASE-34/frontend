import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { ApiResponse } from '$lib/types';

/**
 * Server-only API client for communicating with the backend.
 * Used exclusively in +page.server.ts / +server.ts load/action functions.
 *
 * Reads API_BASE_URL from environment variables.
 */
function getBaseUrl(): string {
  const url = env.API_BASE_URL;
  if (!url) {
    throw new Error('API_BASE_URL environment variable is not set');
  }
  return url.replace(/\/+$/, '');
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Unified fetch wrapper for API calls.
 * Automatically handles JSON serialization, error responses, and timeouts.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, timeout = 10_000 } = options;
  const url = `${getBaseUrl()}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        error(404, 'Resource not found');
      }
      const errorBody = await res.text().catch(() => 'Unknown error');
      console.error(`API error [${res.status}] ${method} ${url}: ${errorBody}`);
      error(res.status, `API error: ${res.statusText}`);
    }

    const data: T = await res.json();
    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    // Re-throw SvelteKit errors as-is
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error(`API timeout: ${method} ${url}`);
      error(504, 'API request timed out');
    }

    console.error(`API fetch failed: ${method} ${url}`, err);
    error(502, 'Failed to connect to API backend');
  }
}
