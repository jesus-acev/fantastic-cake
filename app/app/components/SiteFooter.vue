<template>
  <footer class="site-footer">
    <div class="shell footer-grid">
      <div>
        <a class="brand footer-brand" href="#inicio" aria-label="Dulce Arte, volver al inicio">
          <span class="brand-mark" aria-hidden="true">DA</span>
          <span class="brand-copy">
            <strong>Dulce Arte</strong>
            <small>Tortas hechas en Pucura</small>
          </span>
        </a>
        <p>Caseras, frescas y hechas para compartir.</p>
      </div>
      <nav aria-label="Navegación del pie de página">
        <a href="#tortas">Tortas</a>
        <a href="#historia">Nuestra historia</a>
        <a href="#pedidos">Pedidos</a>
      </nav>
      <div class="footer-note">
        <p>Una torta de la que quieres otro pedazo.</p>
        <small>© {{ new Date().getFullYear() }} Dulce Arte</small>
      </div>
    </div>
  </footer>
</template>
