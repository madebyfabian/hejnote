
import path from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        plugins: [
          { name: 'removeViewBox', active: false },
        ],
      }
    }),
    VitePWA({
      includeAssets: [ 
        'favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png' 
      ],  
      manifest: {
        name: 'noter',
        description: 'noter app',
        theme_color: '#111827',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: false,
    fs: {
      strict: true,
    },
  },
})
