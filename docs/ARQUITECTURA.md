# Arquitectura del sistema — Donde Betty

Última revisión: 2026-09-01  
Estado: `estilo monolítico confirmado · decisiones tecnológicas pendientes de gate`

## 1. Propósito

Este documento describe la arquitectura de alto nivel para la web informativa, catálogo público y CMS de **Donde Betty · Tortas de Pucura**. Resume cómo se separan responsabilidades, datos, seguridad y despliegue sin reemplazar los contratos detallados de `specs/`.

Las recomendaciones técnicas no se consideran aprobadas por aparecer aquí. Las decisiones abiertas se registran en [`specs/09-REGISTRO-DECISIONES-GATE.md`](../specs/09-REGISTRO-DECISIONES-GATE.md) y requieren confirmación explícita.

## 2. Contexto y restricciones

### Producto

- Landing pública con hero, propuesta de valor, tortas destacadas, proceso, historia, contacto y CTA a WhatsApp.
- Catálogo completo y ficha indexable por torta.
- CMS privado para administrar catálogo, variantes, imágenes y publicación.
- WhatsApp inicia la conversación; el MVP no tiene carrito, checkout, pagos ni gestión de pedidos.

### Restricciones

- VPS objetivo: 1 vCPU y 1 GB de RAM.
- Un solo proyecto y artefacto de aplicación.
- SEO y rendimiento público prioritarios.
- Supabase permitido únicamente en QA.
- Sin Redis, cluster Node, proveedor de identidad self-hosted ni stack pesado de observabilidad.
- Build fuera de la VPS.
- Los datos comerciales no confirmados no se sustituyen con mocks plausibles.

## 3. Decisiones confirmadas y abiertas

| Tema | Estado | Resultado actual |
|---|---|---|
| Estilo | Confirmado | Monolito modular: sitio, CMS, API y dominio en un proyecto/artefacto. |
| Framework | Gate `G-TECH-01` | Nuxt 4 + Nitro + TypeScript recomendado. |
| Persistencia | Gate `G-DATA-01` | PostgreSQL + Drizzle + node-postgres recomendado. |
| Ubicación DB | Gate `G-INFRA-01` | PostgreSQL administrado recomendado; local ajustado como alternativa. |
| Identidad | Gate `G-AUTH-01` | Google OIDC recomendado; contraseña local + TOTP como alternativa. |
| Sesión/MFA | Gate `G-AUTH-03` | Sesión opaca PostgreSQL recomendada; política de expiración pendiente. |
| Imágenes | Gate `G-STORAGE-01` | Storage S3-compatible recomendado; volumen local como alternativa. |
| Ajustes CMS | Gate `G-CMS-01` | Solo catálogo o catálogo + ajustes operativos. |

## 4. Contexto del sistema

```text
┌──────────────────────┐
│ Visitante / buscador │
└──────────┬───────────┘
           │ HTTPS: landing, catálogo, fichas
           ▼
┌───────────────────────────────────────────┐
│ Aplicación monolítica Donde Betty         │
│ sitio SSR + CMS + API + dominio + auth    │
└───────┬────────────────┬──────────────────┘
        │ SQL/TLS        │ objetos HTTPS/S3 o volumen
        ▼                ▼
┌──────────────┐  ┌──────────────────┐
│ PostgreSQL   │  │ Storage imágenes │
└──────────────┘  └──────────────────┘
        ▲
        │ sesión opaca
┌───────┴──────────────┐       ┌──────────────────┐
│ Administrador / CMS │──────►│ Google OIDC      │  condicional G-AUTH-01.A
└──────────────────────┘       └──────────────────┘

El CTA público abre WhatsApp fuera del sistema; no confirma un pedido.
```

## 5. Contenedores de ejecución

### Perfil recomendado

```text
Internet
   │ 80/443
   ▼
┌─────────┐
│ Caddy   │  TLS, redirección HTTPS, límites de body
└────┬────┘
     │ red privada :3000
     ▼
┌──────────────────────────────┐
│ Nuxt/Nitro — 1 proceso Node │
│ SSR + CMS + API + servicios │
└───────┬───────────────┬──────┘
        │ TLS/SQL       │ HTTPS/S3
        ▼               ▼
 PostgreSQL externo   Storage externo
```

Este perfil conserva memoria en la VPS y simplifica recuperación. No está aprobado hasta resolver `G-INFRA-01` y `G-STORAGE-01`.

### Perfil económico

Caddy, aplicación y PostgreSQL comparten la VPS. PostgreSQL permanece en red privada, con pool de aplicación máximo inicial 5, memoria limitada y backups offsite. Se usa únicamente si las pruebas de carga/OOM conservan al menos 20 % de margen normal.

## 6. Módulos del monolito

```text
Aplicación
├── Web pública
│   ├── landing
│   ├── catálogo
│   ├── ficha por slug
│   └── contacto/redirect según gate
├── CMS
│   ├── autenticación
│   ├── listado/editor
│   ├── preview
│   ├── imágenes
│   └── ajustes operativos condicionales
├── API
│   ├── pública, solo lectura publicada
│   ├── administrativa protegida
│   ├── auth/callback/logout
│   └── health live/ready
├── Aplicación/dominio
│   ├── catálogo y publicación
│   ├── slugs y redirects
│   ├── autorización
│   ├── auditoría/idempotencia
│   └── procesamiento de imágenes
└── Infraestructura
    ├── repositorios Drizzle/PostgreSQL
    ├── adaptador de storage
    ├── proveedor de identidad
    ├── configuración
    └── logging/health
```

### Reglas de dependencia

- Páginas y componentes no consultan la base de datos directamente.
- Endpoints validan transporte y delegan los casos de uso a servicios.
- Servicios aplican autorización, invariantes, transacciones y auditoría.
- Repositorios encapsulan SQL/Drizzle.
- El SSR llama servicios internos directamente; no hace HTTP contra su propia API.
- Contratos/DTO públicos no exponen filas de base de datos ni módulos server-only.
- Guards de UI mejoran navegación, pero la autorización se repite en cada mutación de servidor.

## 7. Rutas principales

| Ruta | Responsabilidad | Seguridad/indexación |
|---|---|---|
| `/` | landing y destacadas | pública, SSR, indexable |
| `/catalogo` | todas las tortas publicadas | pública, SSR, indexable |
| `/catalogo/[slug]` | ficha canónica | pública si `published`; histórico responde 301 |
| `/contacto` | página o redirect | depende de `G-PROD-01` |
| `/admin/login` | inicio de sesión | noindex, no-store |
| `/admin/**` | CMS | sesión/rol, noindex, no-store |
| `/admin/tortas/[id]/preview` | preview de borrador | autenticada, sin token público |
| `/api/v1/catalogo/**` | JSON publicado | pública, solo lectura |
| `/api/v1/admin/**` | operaciones CMS | sesión, rol, CSRF/origin y validación |
| `/api/auth/**` | identidad/sesión | callbacks exactos, no-store |
| `/health/live` | vida del proceso | sin DB |
| `/health/ready` | capacidad técnica | DB/config runtime, no contenido comercial |

## 8. Arquitectura de datos

### Agregados principales

- `cakes`: contenido, estado editorial, destacado, anticipación y versionado optimista.
- `cake_variants`: etiqueta, modo/rango de porciones, modo/precio CLP y disponibilidad editorial.
- `cake_slugs`: namespace único para slugs actuales e históricos.
- `cake_images`: original, portada, alt, orden, hash y confirmación de derechos.
- `cake_image_variants`: manifiesto WebP/JPEG 480/800/1200 y social 1200 × 630.
- tablas Better Auth: usuarios, cuentas y sesiones según el gate.
- `audit_log`: acciones editoriales/sensibles sin secretos.
- `idempotency_keys`: evita duplicar uploads/publicaciones al reintentar.
- `business_settings`: solo con `G-CMS-01.B`.

### Estados editoriales

```text
draft ──publicar──► published ──despublicar──► draft
  │                     │
  └──── archivar ───────┴──────────────► archived
```

- La consulta pública siempre filtra `published`.
- Una torta incompleta no puede publicarse.
- Un producto publicado se archiva; no se elimina.
- Un draft nunca publicado y sin referencias puede borrarse.
- Los cambios agregados usan transacción y `version`; una versión obsoleta devuelve 409.

## 9. Flujo de lectura pública

```text
GET página
  → route SSR
  → servicio de catálogo
  → repositorio PostgreSQL (`status=published`)
  → DTO público
  → HTML + metadatos/JSON-LD
```

El MVP no cachea HTML o JSON dinámico en la aplicación. El siguiente request iniciado después de un commit editorial observa el cambio. Assets versionados sí usan caché larga.

## 10. Flujo de publicación

```text
Admin autenticado
  → PATCH borrador con `version`
  → validar DTO + sesión + rol + origin/CSRF
  → validar reglas de publicación
  → transacción: contenido + variantes + slug + auditoría
  → coordinar storage con idempotencia/compensación
  → commit
  → siguiente request público ve el nuevo estado
```

Publicar exige nombre/slug, descripciones, variante estructurada, precio/consulta explícita, porciones/consulta explícita, anticipación vigente y portada procesada con alt y derechos confirmados.

## 11. Imágenes

- Entradas: JPEG, PNG o WebP; máximo 8 MB, 20 megapíxeles y 8000 px por lado.
- Validar firma real y decodificación; rechazar SVG/GIF animado.
- Re-encodear, eliminar EXIF y procesar con concurrencia 1.
- Generar WebP y JPEG en 480/800/1200 sin ampliar.
- Toda portada publicada genera JPEG social 1200 × 630.
- Claves UUID/versionadas; no URLs arbitrarias.
- La política de conservar/eliminar originales depende de `G-STORAGE-01`.
- Un fallo parcial intenta compensación inmediata; `storage:reconcile` corrige huérfanos sin scheduler adicional.

## 12. Autenticación y seguridad

### Recomendación pendiente

Google OIDC + Better Auth + sesión opaca PostgreSQL:

- scopes `openid email`, sin acceso offline;
- signup y linking implícito deshabilitados;
- bootstrap por email verificado preaprobado y asociación posterior por `issuer + sub`;
- rol `admin` propiedad del servidor;
- cookie `HttpOnly`, `Secure`, `SameSite=Lax`, host-only y `Path=/`;
- cookie cache deshabilitada para revocación inmediata;
- 2SV operativo con passkey/llave recomendado;
- acciones sensibles requieren sesión reciente.

Alternativa: email/contraseña local + Argon2id + TOTP + códigos de recuperación, manteniendo la misma sesión opaca.

JWT propio no es una fuente de identidad y no se recomienda para este CMS: revocación, refresh y claves agregan complejidad sin ventaja material en una sola instancia.

### Controles transversales

- TLS obligatorio y PostgreSQL no público.
- Validación Zod en límites del sistema.
- CSRF/origin en mutaciones.
- Markdown restringido/sanitizado; sin HTML libre.
- CSP, HSTS, `nosniff`, `frame-ancestors 'none'` y política de referrer.
- Rate limiting en login, API y uploads.
- Secretos fuera de Git, imagen y logs.
- Request IDs y redacción de cookies, tokens y bodies sensibles.

## 13. Entornos

| Entorno | Datos | Imágenes | Propósito |
|---|---|---|---|
| local | PostgreSQL Docker | adaptador local o dev | desarrollo reproducible |
| test | PostgreSQL efímero | fake/temporal | integración aislada |
| QA | Supabase PostgreSQL | storage QA compatible | validar migraciones/contratos |
| producción | según `G-INFRA-01` | según `G-STORAGE-01` | servicio real |

El navegador nunca accede directamente a Supabase. No se usan Supabase Auth, PostgREST, Realtime, Edge Functions ni RLS como capa de aplicación. Local, QA y producción deben usar el mismo major PostgreSQL exacto.

## 14. Despliegue y operación

- Caddy expone únicamente 80/443; SSH por clave en 22.
- Un contenedor/proceso Node, usuario non-root y límites de recursos.
- Imagen multi-stage construida, probada y etiquetada en CI.
- Migraciones como paso controlado de release; no en cada arranque.
- Readiness antes de promover y smoke posterior.
- Rollback por imagen inmutable compatible con el esquema.
- Logs JSON rotados; monitoreo externo ligero de HTTP, TLS, 5xx, latencia, memoria, OOM, disco y backups.
- Restaurar una DB purga sesiones antes de exponer tráfico.

La matriz RPO/RTO, disponibilidad y retenciones permanece pendiente en `G-OPS-01`.

## 15. Calidad y atributos

| Atributo | Decisión arquitectónica |
|---|---|
| SEO | SSR, URL por torta, canonical, sitemap y JSON-LD con datos reales |
| Rendimiento | un proceso, pool 5, sin caché/servicios pesados, imágenes derivadas, fuentes locales |
| Seguridad | sesión revocable, autorización servidor, mínimo privilegio, uploads re-encodeados |
| Accesibilidad | WCAG 2.2 AA, teclado, foco, contraste, reflow y movimiento reducido |
| Portabilidad | PostgreSQL estándar, repositorios server-side y adaptador de storage |
| Recuperación | backups offsite, restore mensual y rollback documentado |
| Mantenibilidad | capas internas, DTO/schemas compartidos y migrations versionadas |

## 16. Riesgos arquitectónicos

| Riesgo | Mitigación |
|---|---|
| OOM en VPS de 1 GB | DB/storage externos recomendados, build externo, límites y pruebas de memoria |
| Cuenta admin comprometida | identidad cerrada, 2SV/TOTP, sesión corta/revocable y auditoría |
| Borrador filtrado | filtro en repositorio, tests API/SSR y no caché dinámica |
| Imágenes maliciosas/pesadas | límites, magic bytes, decodificación, re-encode y concurrencia 1 |
| Slug rompe SEO | namespace único e histórico con 301 directo |
| Supabase crea lock-in | uso solo server-side como PostgreSQL/S3 estándar en QA |
| Restore reactiva sesiones | purga obligatoria antes de readiness |
| Decisión asumida | gates explícitos; el silencio no aprueba recomendaciones |

## 17. Decisiones pendientes

La arquitectura no puede pasar de diseño a implementación dependiente hasta resolver, al menos:

1. `G-AUTH-01/02/03`: identidad, administradores, recuperación, sesión y MFA.
2. `G-TECH-01`: Nuxt 4 u otra alternativa SSR justificada.
3. `G-DATA-01`: PostgreSQL + Drizzle u otra pareja concreta.
4. `G-INFRA-01`: PostgreSQL administrado o local.
5. `G-STORAGE-01`: S3-compatible o volumen local.
6. `G-CMS-01`: solo catálogo o ajustes operativos editables.
7. `G-PROD-01/02`: contacto y políticas vigentes.
8. `G-ANALYTICS-01`: sin analítica, first-party o proveedor.
9. `G-OPS-01`: RPO/RTO, disponibilidad y retenciones.

## 18. Documentos fuente

- [`specs/00-ESPECIFICACION-MAESTRA.md`](../specs/00-ESPECIFICACION-MAESTRA.md)
- [`specs/03-CATALOGO-CMS-Y-MODELO-DATOS.md`](../specs/03-CATALOGO-CMS-Y-MODELO-DATOS.md)
- [`specs/04-ARQUITECTURA-TECNICA-Y-API.md`](../specs/04-ARQUITECTURA-TECNICA-Y-API.md)
- [`specs/05-AUTENTICACION-Y-SEGURIDAD.md`](../specs/05-AUTENTICACION-Y-SEGURIDAD.md)
- [`specs/07-DESPLIEGUE-OPERACION-Y-RECUPERACION.md`](../specs/07-DESPLIEGUE-OPERACION-Y-RECUPERACION.md)
- [`specs/09-REGISTRO-DECISIONES-GATE.md`](../specs/09-REGISTRO-DECISIONES-GATE.md)
- [`docs/STACK.md`](STACK.md)
