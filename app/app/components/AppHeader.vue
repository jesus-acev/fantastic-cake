<script setup lang="ts">
const menuOpen = ref(false)

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <a class="skip-link" href="#contenido">Ir al contenido</a>
    <div class="shell header-inner">
      <a class="brand" href="#inicio" aria-label="Dulce Arte, ir al inicio" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true">DA</span>
        <span class="brand-copy">
          <strong>Dulce Arte</strong>
          <small>Tortas de la Bea</small>
        </span>
      </a>

      <nav class="desktop-nav" aria-label="Navegación principal">
        <a href="#tortas">Nuestras tortas</a>
        <a href="#historia">La Bea</a>
        <a href="#pedidos">Cómo pedir</a>
      </nav>

      <a class="header-cta" href="#pedidos">Encargar una torta</a>

      <button
        class="menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        @click="menuOpen = !menuOpen"
      >
        <span>{{ menuOpen ? 'Cerrar' : 'Menú' }}</span>
        <span class="menu-lines" aria-hidden="true" />
      </button>
    </div>

    <nav v-if="menuOpen" id="mobile-navigation" class="mobile-nav" aria-label="Navegación móvil">
      <a href="#tortas" @click="closeMenu">Nuestras tortas</a>
      <a href="#historia" @click="closeMenu">La Bea</a>
      <a href="#pedidos" @click="closeMenu">Cómo pedir</a>
      <a href="#pedidos" class="mobile-order" @click="closeMenu">Encargar una torta</a>
    </nav>
  </header>
</template>
