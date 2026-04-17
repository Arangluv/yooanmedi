import { config } from 'dotenv';
import path from 'path';
import { vi } from 'vitest';

config({
  path: path.resolve(__dirname, '.env.test'),
});
