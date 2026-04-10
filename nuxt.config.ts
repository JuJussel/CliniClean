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
   '@nuxt/ui',
   'nuxt-file-storage',
   '@nuxt/eslint',
   '@nuxtjs/i18n'
  ],
  css: ['~/assets/css/main.css'],
    fileStorage: {
        mount: process.env.mount,
  },
  i18n: {
    locales: [{
      code: 'ja',
      name: 'Japanese',
      file: 'ja.json'
    }],
    defaultLocale: 'ja', 
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