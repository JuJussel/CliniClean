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
  css: ['~/assets/css/main.css'],
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
})