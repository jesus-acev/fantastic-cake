<template>
  <section id="nosotros" class="section-padding business-section">
    <div class="container">
      <div class="grid-2-col">
        <!-- About & Process -->
        <div class="info-card card">
          <span class="badge badge-rose">Nuestra Filosofía</span>
          <h2 class="heading-lg section-title">Tradición artesanal y obsesión por la calidad</h2>
          <p class="info-text">
            En <strong>Dulce Arte</strong> creemos que un gran postre comienza con respeto a la materia prima. No utilizamos premezclas, grasas hidrogenadas ni conservantes artificiales. 
          </p>
          <p class="info-text">
            Cada madrugada, nuestros maestros pasteleros amasan el hojaldre, baten los merengues y preparan los rellenos desde cero para llevar a tu mesa un producto fresco y de nivel gastronómico.
          </p>

          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">🌿</span>
              <div>
                <strong>Ingredientes Naturales</strong>
                <p>Mantequilla 100% de vaca, cacao de origen y frutas de temporada.</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎂</span>
              <div>
                <strong>Tortas Personalizadas</strong>
                <p>Diseños exclusivos para cumpleaños, bodas y eventos especiales.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Hours & Location -->
        <div id="horarios" class="info-card card dark-info-card">
          <span class="badge badge-gold">Visítanos & Horarios</span>
          <h2 class="heading-lg section-title light-text">Estamos listos para endulzar tu día</h2>

          <div class="hours-schedule">
            <div class="schedule-row">
              <span>Lunes a Viernes</span>
              <strong>07:00 AM - 08:30 PM</strong>
            </div>
            <div class="schedule-row">
              <span>Sábados</span>
              <strong>08:00 AM - 09:00 PM</strong>
            </div>
            <div class="schedule-row highlight-row">
              <span>Domingos & Feriados</span>
              <strong>08:30 AM - 07:00 PM</strong>
            </div>
          </div>

          <div id="contacto" class="contact-details">
            <div class="contact-item">
              <span class="icon">📍</span>
              <div>
                <strong>Ubicación Principal</strong>
                <p>Av. Principal Los Rosales 452, Miraflores</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="icon">📞</span>
              <div>
                <strong>Teléfono / WhatsApp Pedidos</strong>
                <p>+51 999 999 999 | (01) 456-7890</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="icon">📧</span>
              <div>
                <strong>Correo Electrónico</strong>
                <p>pedidos@dulceartepasteleria.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.business-section {
  background: var(--accent-cream);
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.info-card {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dark-info-card {
  background: var(--bg-dark);
  color: var(--text-light);
  border: none;
}

.section-title {
  margin: 1rem 0;
  color: var(--text-main);
}

.light-text {
  color: #FFFFFF;
}

.info-text {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.feature-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.feature-icon {
  font-size: 1.75rem;
  line-height: 1;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
}

.feature-item strong {
  display: block;
  font-size: 1rem;
  color: var(--text-main);
}

.feature-item p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.hours-schedule {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin: 1.5rem 0 2rem 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.schedule-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.schedule-row span {
  color: #BAAAA3;
}

.schedule-row strong {
  color: var(--accent-gold);
}

.highlight-row {
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.contact-item .icon {
  font-size: 1.5rem;
}

.contact-item strong {
  display: block;
  font-size: 0.9rem;
  color: #FFFFFF;
}

.contact-item p {
  font-size: 0.85rem;
  color: #BAAAA3;
}

@media (max-width: 868px) {
  .grid-2-col {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 2rem 1.5rem;
  }
}
</style>
