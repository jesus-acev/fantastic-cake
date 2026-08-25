// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Dulce Arte | Pastelería & Repostería Artesanal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Pastelería y repostería artesanal en la ciudad. Tortas personalizadas, croissants frescos, brownies y tartas elaboradas diariamente con ingredientes de primera calidad.'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:title', content: 'Dulce Arte | Pastelería Artesanal' },
        {
          property: 'og:description',
          content: 'Tortas, pasteles y panadería fina. Descubre nuestros sabores artesanales y realiza tu pedido.'
        },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true
  }
})
