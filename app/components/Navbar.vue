<template>
  <header class="navbar-header" :class="{ 'scrolled': isScrolled }">
    <div class="container navbar-container">
      <NuxtLink to="/" class="brand-logo">
        <div class="logo-icon">🍰</div>
        <div class="logo-text">
          <span class="brand-name">Dulce Arte</span>
          <span class="brand-tagline">Pastelería Artesanal</span>
        </div>
      </NuxtLink>

      <nav class="nav-menu" :class="{ 'active': isMobileMenuOpen }">
        <a href="#catalogo" class="nav-link" @click="closeMenu">Catálogo</a>
        <a href="#nosotros" class="nav-link" @click="closeMenu">Nosotros</a>
        <a href="#horarios" class="nav-link" @click="closeMenu">Horarios</a>
        <a href="#contacto" class="nav-link" @click="closeMenu">Contacto</a>
        <NuxtLink to="/admin" class="nav-link nav-admin-badge" @click="closeMenu">
          ⚡ CMS Admin
        </NuxtLink>
      </nav>

      <div class="navbar-actions">
        <a 
          href="https://wa.me/51999999999?text=Hola%20Dulce%20Arte,%20quisiera%20hacer%20un%20pedido" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-primary btn-sm cta-whatsapp"
        >
          <span>📲</span> Haz tu Pedido
        </a>

        <button 
          class="mobile-toggle" 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :aria-label="isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        >
          <span class="hamburger" :class="{ 'open': isMobileMenuOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const closeMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(250, 246, 240, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(232, 221, 211, 0.6);
  transition: var(--transition);
  padding: 1rem 0;
}

.navbar-header.scrolled {
  box-shadow: var(--shadow-sm);
  padding: 0.75rem 0;
  background: rgba(250, 246, 240, 0.95);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
  line-height: 1;
  background: var(--accent-cream);
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.1;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--accent-gold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  color: var(--text-main);
  transition: var(--transition);
  position: relative;
  padding: 0.25rem 0;
}

.nav-link:hover {
  color: var(--accent-gold);
}

.nav-admin-badge {
  background: rgba(200, 141, 55, 0.12);
  color: var(--accent-gold);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(200, 141, 55, 0.25);
}

.nav-admin-badge:hover {
  background: var(--accent-gold);
  color: #FFFFFF;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-main);
  position: relative;
  transition: var(--transition);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: var(--text-main);
  transition: var(--transition);
}

.hamburger::before { top: -7px; }
.hamburger::after { top: 7px; }

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.open::after {
  transform: rotate(-45deg);
  top: 0;
}

@media (max-width: 868px) {
  .mobile-toggle {
    display: block;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--bg-surface);
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
    box-shadow: var(--shadow-md);
    border-bottom: 1px solid var(--border-color);
    clip-path: circle(0% at 100% 0);
    transition: clip-path 0.4s ease-in-out;
  }

  .nav-menu.active {
    clip-path: circle(140% at 100% 0);
  }

  .cta-whatsapp {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
