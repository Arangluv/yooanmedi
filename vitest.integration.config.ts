import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.integration.test.ts'],
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    coverage: {
      exclude: ['**/__test__/**', '**/collections/**', '**/index.ts', '**/ui', '**/api'],
    },
    pool: 'forks',
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@shared': path.resolve(__dirname, './src/shared'),
      'server-only': path.resolve(__dirname, './src/shared/__mock__/empty-server-only.ts'),
    },
  },
});
