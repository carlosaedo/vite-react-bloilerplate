import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      legacy({
        targets: ['defaults', 'not IE 11', 'Android >= 5'],
      }),
    ],
    base: '/shipping-portal/',
    build: {
      outDir: './dist',
      // Increase warning limit if you want (optional)
      chunkSizeWarningLimit: 1500, // in KB (e.g. 1000 = 1MB)
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'react-vendor';
              }
              if (id.includes('@mui')) {
                return 'mui-vendor';
              }
              if (id.includes('lodash')) {
                return 'lodash';
              }
              if (id.includes('leaflet') || id.includes('react-leaflet')) {
                return 'leaflet-vendor';
              }
              if (id.includes('framer-motion')) {
                return 'framer-motion';
              }
              if (id.includes('@microsoft/signalr')) {
                return 'signalr';
              }
              // Put other big libs in 'vendor'
              return 'vendor';
            }
          },
        },
      },
    },
    define: {
      __BUILD_TYPE__: JSON.stringify(env.VITE_BUILD_TYPE),
    },
  };
});

/// HOW TO RUN
// vite --mode internal
// vite --mode external
//
// vite build --mode internal
// vite build --mode external
