import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['**/*.integration.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['**/*.e2e.test.ts'],
        },
      },
    ],
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@shared': path.resolve(__dirname, './src/shared'),
      'server-only': path.resolve(__dirname, './src/shared/__mock__/empty-server-only.ts'),
    },
  },
});
