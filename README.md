# Dulce Arte - Web & CMS para Pastelería Artesanal

Plataforma web monolítica de alto rendimiento para una pastelería y repostería artesanal, diseñada para ofrecer un sitio público optimizado para SEO y un panel de administración (CMS) ligero y fácil de mantener.

---

## 🎯 Objetivo del Proyecto

El objetivo principal es proveer una solución web completa, moderna y amigable para buscadores que permita:
- Presentar el menú y catálogo de productos (tortas, pasteles, panadería).
- Permitir la gestión de productos, imágenes y horarios mediante un panel CMS protegido (`/admin`).
- Operar eficientemente con un consumo mínimo de recursos en servidores VPS pequeños (**1 OCPU, 1 GB RAM**).

---

## ⚡ Stack Tecnológico

El proyecto está desarrollado como un **monolito modular** sin dependencias externas pesadas:

- **Frontend & SSR**: [Nuxt 4](https://nuxt.com/) / [Vue 3](https://vuejs.org/) (TypeScript)
- **Servidor Web & API**: [Nitro Engine](https://nitro.unjs.io/)
- **Base de Datos**: [SQLite](https://www.sqlite.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Estilos**: Vanilla CSS modular (Sistema de diseño responsivo y sin frameworks pesados)
- **Despliegue**: Node.js + Nginx como Reverse Proxy

---

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js LTS (v18+ o v20+)
- npm

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install
```

### 2. Modo Desarrollo

Inicia el servidor local de desarrollo con hot-reload:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Compilación para Producción

Para construir la versión optimizada de producción (Server Engine):

```bash
npm run build
```

Ejecutar la compilación en producción:

```bash
npm run preview
# o directamente: node .output/server/index.mjs
```

---

## 📂 Estructura del Proyecto

```text
├── pages/             # Páginas del sitio público y panel CMS (/admin)
├── components/        # Componentes Vue (Navbar, Hero, ProductCard, Footer)
├── layouts/           # Plantillas de diseño principal
├── server/            # Endpoints Nitro (API interna) y modelos SQLite (Drizzle ORM)
├── assets/css/        # Estilos CSS y sistema de tokens de diseño
└── STACK.md           # Especificaciones detalladas de arquitectura
```

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
