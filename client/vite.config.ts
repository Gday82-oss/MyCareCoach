import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Scope restreint à /client/ — évite le conflit avec sw-coach.js (scope /app/)
      scope: '/client/',
      includeAssets: ['icon-192x192.png', 'icon-512x512.png', 'apple-touch-icon.png'],
      manifest: false, // On utilise notre propre manifest.json dans public/
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        // sw.js (client) ne gère que /client/* — /app/* est géré par sw-coach.js
        navigateFallbackAllowlist: [/^\/client\//],
        navigateFallbackDenylist: [/^\/api/, /^\/app/],
        runtimeCaching: [
          // Routes Coach — NetworkFirst pour avoir le contenu frais
          {
            urlPattern: /^\/app\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'coach-routes',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Routes Client — NetworkFirst pour avoir le contenu frais
          {
            urlPattern: /^\/client\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'client-routes',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Supabase — NetworkFirst
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        index: 'index.html',
        coach: 'coach.html',
        client: 'client.html',
      },
      output: {
        manualChunks: {
          'recharts-vendor': ['recharts'],
          'framer-vendor': ['framer-motion'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
})
