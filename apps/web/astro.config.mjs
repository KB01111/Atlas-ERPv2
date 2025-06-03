// @ts-check
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true, // Enable Tailwind base styles
    }),
  ],
  output: 'server', // Static generation for maximum performance
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion'],
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-slot', '@radix-ui/react-dialog'],
            motion: ['framer-motion'],
            utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
            copilot: ['@copilotkit/react-core', '@copilotkit/react-ui'],
          },
        },
        external: id => {
          // Externalize Node.js built-ins for client-side builds
          if (id.includes('node_modules/node-fetch')) {
            return false; // Let Vite handle node-fetch bundling
          }
          return false;
        },
      },
    },
    define: {
      // Suppress Node.js warnings in browser builds
      global: 'globalThis',
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
