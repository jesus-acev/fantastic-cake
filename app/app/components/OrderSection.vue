<script setup lang="ts">
const whatsappMessage = encodeURIComponent('Hola Bea, quisiera consultar por una torta. Mi fecha es: ')
const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`
</script>

<template>
  <section id="pedidos" class="order-section section" aria-labelledby="order-title">
    <div class="shell order-shell">
      <div class="order-intro">
        <p class="eyebrow">Tu pedido, sin vueltas</p>
        <h2 id="order-title">Cuéntanos qué quieres celebrar.</h2>
        <p>Con al menos un día de anticipación podemos orientarte mejor con sabor, tamaño y decoración.</p>
      </div>

      <ol class="order-steps">
        <li>
          <span>Elige</span>
          <p>Revisa los sabores y piensa para cuántas personas necesitas.</p>
        </li>
        <li>
          <span>Conversemos</span>
          <p>Escríbenos por WhatsApp con la fecha y lo que tienes en mente.</p>
        </li>
        <li>
          <span>Disfruta</span>
          <p>La preparamos fresca para retiro o despacho sujeto a coordinación.</p>
        </li>
      </ol>

      <div class="order-action">
        <a class="button button-light" :href="whatsappUrl" target="_blank" rel="noopener noreferrer">
          Conversar por WhatsApp
        </a>
        <small>Pedidos para el mismo día sujetos a disponibilidad.</small>
      </div>
    </div>
  </section>
</template>
