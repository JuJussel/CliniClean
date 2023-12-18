import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
        "/home/localaa/dev/CliniClean"
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
