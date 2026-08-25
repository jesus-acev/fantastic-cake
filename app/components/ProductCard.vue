<template>
  <div class="card product-card">
    <div class="card-image-wrapper">
      <img :src="product.imageUrl" :alt="product.name" class="product-image" loading="lazy" />
      <span v-if="product.isFeatured" class="badge badge-gold featured-badge">
        ★ Destacado
      </span>
      <span class="category-tag">{{ product.category }}</span>
    </div>

    <div class="card-content">
      <div class="product-header">
        <h3 class="heading-md product-title">{{ product.name }}</h3>
        <div class="product-rating">
          <span>★</span> {{ product.rating.toFixed(1) }}
        </div>
      </div>

      <p class="product-desc">{{ product.shortDescription }}</p>

      <div class="product-meta">
        <span class="prep-badge">⏱️ {{ product.prepTime }}</span>
      </div>

      <div class="card-footer">
        <div class="price-container">
          <span class="price-currency">$</span>
          <span class="price-value">{{ product.price.toFixed(2) }}</span>
        </div>

        <a 
          :href="`https://wa.me/51999999999?text=Hola,%20quisiera%20pedir%20el%20producto:%20${encodeURIComponent(product.name)}`" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-primary btn-sm product-btn"
        >
          Pedir
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiProduct } from '~/server/api/products.get'

defineProps<{
  product: ApiProduct
}>()
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background-color: var(--accent-cream);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.category-tag {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(44, 29, 23, 0.8);
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.product-title {
  font-size: 1.15rem;
  line-height: 1.3;
  color: var(--text-main);
}

.product-rating {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  gap: 0.2rem;
  background: rgba(200, 141, 55, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
}

.product-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  margin-top: auto;
  margin-bottom: 1rem;
}

.prep-badge {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-primary);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px dashed var(--border-color);
}

.price-container {
  display: flex;
  align-items: baseline;
  color: var(--text-main);
}

.price-currency {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-gold);
  margin-right: 0.15rem;
}

.price-value {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
}

.product-btn {
  padding: 0.4rem 1.1rem;
}
</style>
