# Stack tecnológico objetivo — Donde Betty

Última revisión: 2026-09-01  
Estado: `resumen propuesto; G-TECH/G-DATA/G-AUTH/G-INFRA/G-STORAGE pendientes`

La visión de alto nivel vive en [`architecture.md`](architecture.md) y el detalle en [`specs/04-ARQUITECTURA-TECNICA-Y-API.md`](../specs/04-ARQUITECTURA-TECNICA-Y-API.md). Este archivo es solo un resumen. Cuando contradiga a la especificación maestra, prevalece la maestra.

---

## Núcleo de la aplicación

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | [Nuxt](https://nuxt.com) | Nuxt 4 recomendado en `G-TECH-01`, fijado por lockfile si se acepta |
| UI runtime | [Vue 3](https://vuejs.org) | versión compatible fijada |
| Server engine | [Nitro](https://nitro.unjs.io) | preset `node-server` |
| Lenguaje | TypeScript estricto | versión compatible fijada |
| Arquitectura | Monolito modular | sitio + CMS + API en un artefacto |

## Persistencia

| Capa | Tecnología | Versión |
|---|---|---|
| Base de datos | PostgreSQL recomendado | tecnología pendiente de `G-DATA-01`; ubicación pendiente de `G-INFRA-01` |
| ORM | [Drizzle ORM](https://orm.drizzle.team) | versión fijada |
| Driver/pool | node-postgres (`pg`) | pool máximo inicial 5 |
| Migraciones | drizzle-kit | versionadas; nunca `push` destructivo en producción |
| QA | Supabase PostgreSQL | solo QA, acceso únicamente desde Nitro |
| Imágenes | Adaptador portable | S3-compatible o volumen local según `G-STORAGE-01` |
| Sesiones | Better Auth + PostgreSQL recomendado | identidad/sesión pendiente de `G-AUTH-01/03` |

## Estilos

| Capa | Tecnología | Notas |
|---|---|---|
| CSS | Vanilla CSS (`main.css`) | Sin framework de utilidades |
| Fuentes | WOFF2 autoalojadas | Fraunces + Public Sans propuestas |

## Herramientas de desarrollo

| Herramienta | Uso |
|---|---|
| Playwright | E2E, responsive y capturas |
| Vitest/Nuxt test utilities | unitarias, componentes e integración |
| Lint + typecheck | gate en CI |
| Caddy | reverse proxy y TLS |
| Docker Compose | desarrollo e infraestructura de despliegue |

## Estructura del repositorio

```
web-pasteleria/
├── app/                  # Aplicación Nuxt (fuente principal)
│   ├── assets/css/       # main.css — estilos globales
│   ├── components/       # Navbar, HeroSection, ProductCard, BusinessInfo, Footer…
│   ├── layouts/          # default.vue
│   ├── pages/            # index.vue, admin/index.vue
│   └── server/           # API, servicios, auth, repositorios y PostgreSQL
├── docs/                 # Arquitectura y resumen tecnológico
│   ├── architecture.md   # Arquitectura de alto nivel
│   └── STACK.md          # Este resumen
├── specs/                # Especificaciones de proyecto
│   ├── README.md         # Índice y precedencia
│   ├── 00-...08-...      # Producto y contratos técnicos
│   ├── 09-...             # Registro de decisiones gate
│   └── PLAN_VISUAL.md    # Auditoría visual histórica
└── internos/
    └── ADN-marca.md      # Estrategia y ADN de marca de Donde Betty
```

## Decisiones relevantes

- **Monolito**: frontend, CMS, API y dominio conviven en un solo proyecto y artefacto; Nuxt/Nitro sigue pendiente de `G-TECH-01`.
- **PostgreSQL portable**: local Docker, Supabase solo QA y producción sin APIs propietarias de Supabase.
- **VPS pequeña**: un proceso Node; build fuera de producción; sin Redis, cluster ni IdP self-hosted.
- **Auth propuesta**: sesión opaca en cookie; OIDC Google allowlisted recomendado, password + TOTP alternativo. Requiere decisión explícita.
- **Migraciones controladas**: se ejecutan como paso de release, no en cada arranque.
- **CSS propio**: tokens de marca sin dependencia obligatoria de utilidades.
- **Sin tema oscuro**: experiencia únicamente clara.

## Brecha del prototipo

`app/package.json` todavía declara Nuxt 3, SQLite/better-sqlite3 y no incluye auth, PostgreSQL, migraciones operativas, tests ni CI. `app/server/api/products.get.ts` devuelve mocks. Estas dependencias describen el estado actual, no el objetivo aprobado por este documento.
