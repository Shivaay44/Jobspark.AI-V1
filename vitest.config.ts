import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // setupFiles: ['./src/test/setup.ts'], // Only needed for jsdom tests usually
  },
});
