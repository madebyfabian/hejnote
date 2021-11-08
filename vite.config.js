
import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'

import pkg from './package.json'

process.env.VITE_APP_VERSION = pkg.version
if (process.env.NODE_ENV === 'production') {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString()
}

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
        'favicons/favicon.svg', 'favicon.ico', 'robots.txt', 'favicons/apple-touch-icon.png' 
      ],  
      manifest: {
        name: 'hejnote',
        description: 'hejnote',
        theme_color: '#0A0E1A',
        background_color: '#0A0E1A',
        start_url: '/app',
        icons: [
          {
            src: 'favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'favicons/android-chrome-512x512.png',
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
