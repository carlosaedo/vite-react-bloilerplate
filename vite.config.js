// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // This is crucial - it makes all asset paths relative
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets', // This puts all assets in a predictable folder
    rollupOptions: {
      output: {
        // Make sure the asset filenames are predictable
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Configure server to avoid CORS issues during development
  server: {
    port: 5173,
    strictPort: true,
  },
});
