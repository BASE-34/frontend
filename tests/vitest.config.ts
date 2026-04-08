import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '$lib': resolve('./src/lib'),
      '$env/dynamic/private': resolve('./tests/mocks/env-private.ts'),
      '$env/dynamic/public': resolve('./tests/mocks/env-public.ts'),
      '@sveltejs/kit': resolve('./tests/mocks/svelte-kit.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
});
