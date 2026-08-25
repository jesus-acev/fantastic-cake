<template>
  <div class="admin-page section-padding container">
    <div class="admin-card card">
      <div class="admin-header">
        <span class="badge badge-gold">Panel CMS / Administración</span>
        <h1 class="heading-lg">Gestión de Catálogo & Pastelería</h1>
        <p class="subheading">
          Prototipo de panel administrativo protegido para administrar productos, imágenes y horarios en SQLite según STACK.md.
        </p>
      </div>

      <div class="admin-grid">
        <div class="stat-card">
          <span class="stat-icon">🍰</span>
          <div class="stat-info">
            <span class="stat-value">07</span>
            <span class="stat-label">Productos Publicados</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🏷️</span>
          <div class="stat-info">
            <span class="stat-value">03</span>
            <span class="stat-label">Categorías Activas</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🗄️</span>
          <div class="stat-info">
            <span class="stat-value">SQLite</span>
            <span class="stat-label">Drizzle ORM Engine</span>
          </div>
        </div>
      </div>

      <div class="admin-actions">
        <NuxtLink to="/" class="btn btn-primary btn-sm">
          ← Volver a la Landing Page Pública
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'CMS Admin - Dulce Arte Pastelería',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
.admin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.admin-card {
  padding: 3rem;
  width: 100%;
  max-width: 900px;
  background: var(--bg-surface);
}

.admin-header {
  margin-bottom: 2.5rem;
}

.admin-header h1 {
  margin: 0.75rem 0 0.5rem 0;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-gold);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.admin-actions {
  display: flex;
  justify-content: flex-start;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}
</style>
