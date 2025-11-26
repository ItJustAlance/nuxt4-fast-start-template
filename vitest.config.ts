/// <reference types="vitest" />

import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import path from 'path';

// внимание, конфиг не используется
// настройки см. в nuxt.config.ts -> vite: {...}
export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app/'),
      '@': path.resolve(__dirname, 'app/'),
    },
  },
});
