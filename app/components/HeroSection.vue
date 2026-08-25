<template>
  <section class="hero-section">
    <div class="container hero-grid">
      <div class="hero-content animate-fade-in">
        <div class="hero-badge badge badge-gold">
          ✨ Pastelería 100% Artesanal
        </div>
        <h1 class="heading-xl hero-title">
          El sabor de la buena repostería en cada detalle
        </h1>
        <p class="subheading hero-subtitle">
          Tortas personalizadas, croissants crujientes de manteca pura y postres elaborados diariamente con recetas tradicionales e ingredientes seleccionados.
        </p>

        <div class="hero-actions">
          <a href="#catalogo" class="btn btn-primary">
            🍰 Ver Catálogo Completo
          </a>
          <a href="#nosotros" class="btn btn-secondary">
            Conócenos
          </a>
        </div>

        <div class="hero-highlights">
          <div class="highlight-item">
            <span class="highlight-number">07:00 AM</span>
            <span class="highlight-label">Horneado Diario</span>
          </div>
          <div class="highlight-divider"></div>
          <div class="highlight-item">
            <span class="highlight-number">100%</span>
            <span class="highlight-label">Mantequilla Pura</span>
          </div>
          <div class="highlight-divider"></div>
          <div class="highlight-item">
            <span class="highlight-number">4.9 ★</span>
            <span class="highlight-label">+1,200 Clientes Felices</span>
          </div>
        </div>
      </div>

      <div class="hero-media">
        <div class="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80" 
            alt="Torta Selva Negra artesanal de Dulce Arte" 
            class="hero-image"
          />
          <div class="floating-card glass-card">
            <div class="floating-icon">👩‍🍳</div>
            <div class="floating-info">
              <strong>Especial de Hoy</strong>
              <span>Selva Negra Royale</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 4rem 0 6rem 0;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 80% 20%, rgba(200, 141, 55, 0.08) 0%, transparent 60%);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-badge {
  margin-bottom: 1.25rem;
}

.hero-title {
  margin-bottom: 1.25rem;
  color: var(--text-main);
}

.hero-subtitle {
  margin-bottom: 2rem;
  font-size: 1.15rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.hero-highlights {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  width: 100%;
}

.highlight-item {
  display: flex;
  flex-direction: column;
}

.highlight-number {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--accent-gold);
}

.highlight-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.highlight-divider {
  width: 1px;
  height: 35px;
  background-color: var(--border-color);
}

.hero-media {
  position: relative;
}

.hero-image-wrapper {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.hero-image {
  width: 100%;
  height: 480px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hero-image-wrapper:hover .hero-image {
  transform: scale(1.03);
}

.floating-card {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-md);
}

.floating-icon {
  font-size: 1.75rem;
}

.floating-info {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.floating-info strong {
  color: var(--text-main);
  font-family: var(--font-serif);
}

.floating-info span {
  color: var(--accent-gold);
  font-weight: 600;
}

@media (max-width: 968px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .hero-image {
    height: 360px;
  }

  .hero-highlights {
    gap: 1rem;
    justify-content: space-between;
  }
}
</style>
