<template>
  <div>
    <!-- Hero Banner Component -->
    <HeroSection />

    <!-- Main Catalog Section -->
    <section id="catalogo" class="section-padding catalog-section">
      <div class="container">
        <div class="catalog-header">
          <span class="badge badge-gold">Nuestras Especialidades</span>
          <h2 class="heading-lg catalog-title">Explora nuestro Menú Fresco del Día</h2>
          <p class="subheading text-center">
            Selecciona una categoría para filtrar nuestras tortas, pasteles de hojaldre y panes recién horneados.
          </p>

          <!-- Category Filter Buttons -->
          <div class="category-filters">
            <button 
              v-for="cat in categories" 
              :key="cat"
              class="filter-btn"
              :class="{ 'active': selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando postres frescos desde Nitro API...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container card">
          <p>⚠️ No se pudieron cargar los productos. Por favor intenta de nuevo.</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="productsList.length > 0" class="products-grid">
          <ProductCard 
            v-for="product in productsList" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state card">
          <div class="empty-icon">🍰</div>
          <h3>No hay productos en esta categoría por hoy</h3>
          <p>Te invitamos a seleccionar otra categoría o consultar por WhatsApp pedidos especiales.</p>
          <button class="btn btn-secondary btn-sm" @click="selectedCategory = 'Todos'">
            Ver todos los productos
          </button>
        </div>
      </div>
    </section>

    <!-- Business Info Section (About, Hours, Address) -->
    <BusinessInfo />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ApiProduct } from '~/server/api/products.get'

const selectedCategory = ref('Todos')

// Fetch products from Nitro Server API via SSR
const { data: apiResponse, pending, error } = await useFetch('/api/products')

const categories = computed(() => apiResponse.value?.categories || ['Todos', 'Tortas', 'Pasteles', 'Panadería'])

const productsList = computed(() => {
  const all = apiResponse.value?.data || []
  if (selectedCategory.value === 'Todos') {
    return all
  }
  return all.filter((p: ApiProduct) => p.category.toLowerCase() === selectedCategory.value.toLowerCase())
})

// Dynamic SEO Meta
useSeoMeta({
  title: 'Dulce Arte | Pastelería & Repostería Artesanal',
  description: 'Tortas personalizadas, croissants crujientes de manteca pura y postres elaborados diariamente en nuestra pastelería artesanal.',
  ogTitle: 'Dulce Arte - Pastelería Artesanal',
  ogDescription: 'Descubre nuestro menú de tortas, pasteles y panadería fina. Haz tu pedido online.',
  ogImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
})

// Schema.org Structured Data for Bakery / Restaurant SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Bakery',
        'name': 'Dulce Arte Pastelería',
        'image': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Av. Principal Los Rosales 452',
          'addressLocality': 'Miraflores',
          'addressRegion': 'Lima',
          'addressCountry': 'PE'
        },
        'telephone': '+51999999999',
        'openingHours': [
          'Mo-Fr 07:00-20:30',
          'Sa 08:00-21:00',
          'Su 08:30-19:00'
        ],
        'priceRange': '$$'
      })
    }
  ]
})
</script>

<style scoped>
.catalog-section {
  background: var(--bg-primary);
}

.catalog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3.5rem;
}

.catalog-title {
  margin: 0.85rem 0 0.5rem 0;
  text-align: center;
}

.text-center {
  text-align: center;
}

.category-filters {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  background: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 0.55rem 1.35rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn:hover {
  background: var(--accent-cream);
  color: var(--text-main);
}

.filter-btn.active {
  background: var(--accent-gold);
  color: #FFFFFF;
  border-color: var(--accent-gold);
  box-shadow: 0 4px 12px rgba(200, 141, 55, 0.3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 3rem;
}

.empty-state h3 {
  font-family: var(--font-serif);
  color: var(--text-main);
}

.empty-state p {
  color: var(--text-muted);
  max-width: 450px;
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
