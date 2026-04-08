import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The $env and @sveltejs/kit mocks are resolved automatically via vitest.config.ts aliases

describe('API Client', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should construct correct URL from base + endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'test' }]),
    });
    globalThis.fetch = mockFetch;

    const { apiFetch } = await import('$lib/server/api');
    await apiFetch('/api/news');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/news',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should send JSON content type header', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    globalThis.fetch = mockFetch;

    const { apiFetch } = await import('$lib/server/api');
    await apiFetch('/api/stats');

    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[1].headers['Content-Type']).toBe('application/json');
    expect(fetchCall[1].headers['Accept']).toBe('application/json');
  });

  it('should send POST body as JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
    globalThis.fetch = mockFetch;

    const { apiFetch } = await import('$lib/server/api');
    const body = { name: 'Test', email: 'test@knu.ua', subject: 'Test', message: 'Hello test' };
    await apiFetch('/api/contact', { method: 'POST', body });

    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[1].method).toBe('POST');
    expect(fetchCall[1].body).toBe(JSON.stringify(body));
  });

  it('should throw 404 for not found responses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { apiFetch } = await import('$lib/server/api');

    await expect(apiFetch('/api/news/nonexistent')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('should throw 502 on network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

    const { apiFetch } = await import('$lib/server/api');

    await expect(apiFetch('/api/news')).rejects.toMatchObject({
      status: 502,
    });
  });
});
