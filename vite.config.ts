import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
  const preview = mode === 'preview';
  return {
    base: './',
    define: { __PREVIEW__: JSON.stringify(preview) },
    build: preview ? { outDir: 'dist-preview', assetsInlineLimit: 100000000 } : { outDir: 'dist' },
    plugins: [
      react(),
      preview
        ? viteSingleFile()
        : VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/apple-touch-icon.png'],
            manifest: {
              name: 'Aliada Digital',
              short_name: 'Aliada',
              description: 'Tu plata, tus inversiones y el mundo digital, a tu ritmo y con calma.',
              lang: 'es-AR',
              start_url: './',
              scope: './',
              display: 'standalone',
              background_color: '#13201B',
              theme_color: '#13201B',
              icons: [
                { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
              ]
            },
            workbox: {
              globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
              runtimeCaching: [
                { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i, handler: 'CacheFirst', options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } } },
                { urlPattern: /\/audio\/[0-9a-f]+\.mp3$/i, handler: 'CacheFirst', options: { cacheName: 'audio', rangeRequests: true, expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 } } }
              ]
            }
          })
    ]
  };
});
