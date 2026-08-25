<template>
  <footer class="footer-component">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="brand-logo">
            <span class="logo-icon">🍰</span>
            <span class="brand-name">Dulce Arte</span>
          </div>
          <p class="brand-desc">
            Pastelería y repostería artesanal creada con pasión. Monolito de alto rendimiento construido sobre la arquitectura definida en STACK.md.
          </p>
          <div class="tech-stack-badges">
            <span class="tech-badge">⚡ Nuxt 4</span>
            <span class="tech-badge">🟢 Vue 3</span>
            <span class="tech-badge">🚀 Nitro</span>
            <span class="tech-badge">🗄️ SQLite</span>
            <span class="tech-badge">🌧️ Drizzle ORM</span>
          </div>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">Navegación</h4>
          <ul>
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#horarios">Horarios</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">Categorías</h4>
          <ul>
            <li><a href="#catalogo">Tortas Personalizadas</a></li>
            <li><a href="#catalogo">Pasteles & Postres</a></li>
            <li><a href="#catalogo">Panadería de Hojaldre</a></li>
            <li><a href="#catalogo">Especiales del Día</a></li>
          </ul>
        </div>

        <div class="footer-social">
          <h4 class="footer-heading">Síguenos</h4>
          <p class="social-text">Compartimos fotos de nuestras creaciones horneadas cada mañana.</p>
          <div class="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">📸 Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">📘 Facebook</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">🎵 TikTok</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Dulce Arte Pastelería Artesanal. Todos los derechos reservados.</p>
        <p class="vps-note">Optimizado para VPS 1 OCPU / 1GB RAM • Nginx + Nuxt SSR</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer-component {
  background: var(--bg-dark);
  color: var(--text-light);
  padding: 4rem 0 2rem 0;
  border-top: 1px solid var(--border-color);
}

.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand .brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.footer-brand .logo-icon {
  font-size: 1.75rem;
}

.footer-brand .brand-name {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFF;
}

.brand-desc {
  font-size: 0.9rem;
  color: #BAAAA3;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.tech-stack-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-badge {
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent-gold);
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(200, 141, 55, 0.2);
}

.footer-heading {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: #FFFFFF;
  margin-bottom: 1.25rem;
}

.footer-links ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.footer-links a {
  font-size: 0.9rem;
  color: #BAAAA3;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--accent-gold);
}

.social-text {
  font-size: 0.85rem;
  color: #BAAAA3;
  margin-bottom: 1rem;
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-icons a {
  font-size: 0.85rem;
  color: var(--accent-cream);
  transition: var(--transition);
}

.social-icons a:hover {
  color: var(--accent-gold);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  font-size: 0.85rem;
  color: #BAAAA3;
  flex-wrap: wrap;
  gap: 1rem;
}

.vps-note {
  font-size: 0.8rem;
  color: var(--accent-gold);
}

@media (max-width: 968px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 576px) {
  .footer-top {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
