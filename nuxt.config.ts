// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    'nuxt-auth-utils',
    'nuxt-mongoose',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@nuxt/ui',
    'nuxt-file-storage',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    'dayjs-nuxt',
    'nuxt-qrcode',
  ],
  css: ['~/assets/css/main.css', '~/assets/css/calendar.css'],
    fileStorage: {
        mount: process.env.mount,
  },
  piniaPluginPersistedstate: {
    storage: "localStorage",
  },
  // hooks: {
  //   'app:error': (error) => {
  //     console.error('[Global App Error]:', error);
  //   }
  // },
  nitro: {
    routeRules: {
      '/api/**': { cache: false, swr:false },
    },
    experimental: {
      websocket: true
    }
  },
  i18n: {
    locales: [{
      code: 'ja',
      name: 'Japanese',
      file: 'ja.json'
    }],
    defaultLocale: 'ja', 
  },
  dayjs: {
    locales: ['ja'],
    plugins: ['relativeTime', 'isBetween', 'localizedFormat', 'timezone'],
    defaultLocale: 'ja',
    defaultTimezone: 'Asia/Tokyo',
  },
  qrcode: {
    options: {
      variant: 'circle',
      radius: 1,
    },
  },
  app: {
    head: {
      title: 'CliniClean',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  }
})
