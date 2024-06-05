import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [vue(), Components({
    resolvers: [
      PrimeVueResolver()
    ]
  })],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    https: {
      key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
      cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
    },
    fs: {
      allow: [
        "/home/localaa/dev/clini-ui-lib",
        "/home/localaa/dev/CliniClean",
        "/home/localaa/.nvm"
      ]
    },
    proxy: {
      '^/api': {
        target: 'https://localhost:3003',
        changeOrigin: true,
        secure: false
      },
      '^/assets': {
        target: 'https://localhost:3003',
        changeOrigin: true,
        secure: false
      },
      '^/files': {
        target: 'https://localhost:3003',
        changeOrigin: true,
        secure: false
      }
    }
  },

})
