<script setup lang="ts">
import { classicFlavours, featuredCakes } from '~/data/cakes'
</script>

<template>
  <section id="tortas" class="menu-section section" aria-labelledby="menu-title">
    <div class="shell">
      <div class="section-heading menu-heading">
        <div>
          <p class="eyebrow">Para celebrar y compartir</p>
          <h2 id="menu-title">Tortas que saben a torta</h2>
        </div>
        <p>
          Sabores reconocibles, rellenos generosos y una preparación dedicada a cada pedido.
        </p>
      </div>

      <div class="cake-list">
        <article
          v-for="cake in featuredCakes"
          :key="cake.name"
          class="cake-row"
          :class="{ 'is-featured': cake.featured }"
        >
          <div class="cake-name">
            <h3>{{ cake.name }}</h3>
            <span v-if="cake.featured">Favorita de la casa</span>
          </div>
          <p>{{ cake.description }}</p>
          <div class="cake-notes">{{ cake.notes }}</div>
        </article>
      </div>

      <div class="classics">
        <p>También preparamos</p>
        <ul aria-label="Otros sabores disponibles">
          <li v-for="flavour in classicFlavours" :key="flavour">{{ flavour }}</li>
        </ul>
        <a class="text-link" href="#pedidos">Consultar tamaños y valores <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</template>
