import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        {
          '@/stores/encounter.js': ['useEncounterStore'],
          '@/stores/list.js': ['useListStore'],
          // '@/stores/medical.js': ['useMedicalStore'],
          // '@/stores/notification.js': ['useNotificationStore'],
          // '@/stores/order.js': ['useOrderStore'],
          '@/stores/patient.js': ['usePatientStore'],
          '@/stores/setting.js': ['useSettingStore'],
          '@/stores/ui.js': ['useUiStore'],
          '@/stores/user.js': ['useUserStore'],
          '@/lang/jp.js': [['default', 'lang']],
          'vue-i18n': ['useI18n']
        }
      ]
    })
  ],
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
