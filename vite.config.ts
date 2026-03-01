import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'School Attendance',
        short_name: 'Attendance',
        description: "Track your child's school attendance",
        theme_color: '#16A34A',
        background_color: '#F0FDF4',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        importScripts: ['/sw-push.js'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/v1\/parent\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'parent-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
})
