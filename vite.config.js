// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // This enables the new JSX Transform → no need to import React in most files
      jsxRuntime: 'automatic',
    }),
  ],
});