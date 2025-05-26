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
      applyBaseStyles: false, // We'll use our own base styles
    }),
  ],
  output: 'static', // Static generation for maximum performance
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-slot', '@radix-ui/react-dialog'],
            motion: ['framer-motion'],
            utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          },
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
