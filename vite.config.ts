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
              ],
              /* Android: Aliada aparece en "Compartir" de otras apps (ver public/sw-compartir.js) */
              share_target: {
                action: './compartir', method: 'POST', enctype: 'multipart/form-data',
                params: { title: 'title', text: 'text', url: 'url', files: [{ name: 'archivos', accept: ['image/*', 'application/pdf', 'text/csv', 'text/plain', '.csv', '.pdf'] }] }
              }
            },
            workbox: {
              globPatterns: ['**/*.{js,css,html,png,svg,woff2,webp}'],
              /* El lector de fotos y el de PDF pesan varios MB: se bajan recién cuando se usan, no al instalar */
              globIgnores: ['ocr/**', 'sw-compartir.js', 'assets/pdf*', 'assets/tesseract*'],
              importScripts: ['sw-compartir.js'],
              runtimeCaching: [
                { urlPattern: /\/ocr\//i, handler: 'CacheFirst', options: { cacheName: 'lector', expiration: { maxEntries: 8 } } },
                { urlPattern: /\/assets\/(pdf|tesseract)[^/]*$/i, handler: 'CacheFirst', options: { cacheName: 'lector', expiration: { maxEntries: 8 } } },

                { urlPattern: /\/intro\/.*\.(mp4|webm)$/i, handler: 'CacheFirst', options: { cacheName: 'intro', rangeRequests: true, expiration: { maxEntries: 4 } } },
                { urlPattern: /\/audio\/[0-9a-f]+\.mp3$/i, handler: 'CacheFirst', options: { cacheName: 'audio', rangeRequests: true, expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 } } }
              ]
            }
          })
    ]
  };
});
