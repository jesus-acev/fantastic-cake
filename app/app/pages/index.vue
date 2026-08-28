<script setup lang="ts">
const title = 'Dulce Arte | Tortas caseras hechas a pedido en Pucura'
const description = 'Tortas caseras, frescas y hechas a pedido en Pucura. Sabores tradicionales, frutos del sur y dulzor equilibrado para compartir en familia.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogLocale: 'es_CL',
  ogImage: '/images/torta-frutos-del-sur.png',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Bakery',
        name: 'Dulce Arte',
        description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Pucura',
          addressRegion: 'La Araucanía',
          addressCountry: 'CL',
        },
        areaServed: ['Pucura', 'Lican Ray', 'Coñaripe', 'Villarrica'],
        servesCuisine: 'Pastelería chilena',
      }),
    },
  ],
})
</script>

<template>
  <div class="page-wrap">
    <AppHeader />
    <main id="contenido">
      <HeroSection />
      <CakeMenu />
      <CraftSection />
      <OrderSection />
      <LocationSection />
    </main>
    <SiteFooter />
  </div>
</template>
