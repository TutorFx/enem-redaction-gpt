// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode',
    'nuxt-site-config',
    'nuxt-speedkit',
    '@nuxtseo/module',
    '@nuxt/image',
    'nuxt-icon',
    '@nuxt/ui',
  ],

  runtimeConfig: {
    openai: {
      key: process.env.OPENAI_KEY,
    },
  },

  colorMode: {
    preference: 'light'
  },
  
  ui: {
    global: true,
    icons: ['mdi', 'simple-icons']
  },

  css: ['@/assets/index.scss'],

  srcDir: 'src/',

  routeRules: {
    "/": { isr: true },
  },

  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
    format: ['webp'],
    densities: [1, 2],
  },

  devtools: { enabled: true },

  eslint: {
    emitWarning: false
  },
})
