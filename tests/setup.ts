/**
 * Global test setup for B.A.S.E.34 test suite.
 * Runs before all tests.
 */

// Mock $app/environment
vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
  building: false,
}));

// Mock $app/stores
vi.mock('$app/stores', () => {
  const { writable } = require('svelte/store');
  return {
    page: writable({
      url: new URL('http://localhost'),
      params: {},
      status: 200,
    }),
    navigating: writable(null),
  };
});

// Mock $env/dynamic/private
vi.mock('$env/dynamic/private', () => ({
  env: {
    API_BASE_URL: 'http://localhost:4000',
    TURNSTILE_SECRET_KEY: 'test-secret-key',
    PUBLIC_ENABLE_TURNSTILE: 'false',
  },
}));

// Mock $env/dynamic/public
vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key',
    PUBLIC_ENABLE_TURNSTILE: 'false',
  },
}));
