export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'es-CL' },
      meta: [
        { name: 'theme-color', content: '#f3ebe6' },
        { name: 'color-scheme', content: 'light' },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
})
