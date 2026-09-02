# Arquitectura técnica y contratos API

Última revisión: 2026-09-01  
Estado: `monolito confirmado · stack sujeto a gates`

## 1. Decisión de arquitectura

Se adopta un **monolito modular**. La recomendación de `G-TECH-01` es Nuxt/Nitro en TypeScript: sitio público, CMS, endpoints, autenticación y lógica de negocio vivirían en el mismo repositorio y generarían un único artefacto desplegable. Nuxt 4 no se considera decidido hasta registrar el gate.

PostgreSQL, Caddy y object storage son infraestructura; que se ejecuten fuera del proceso Node no convierte la aplicación en microservicios.

### Razones

- el prototipo ya usa Vue/Nuxt y el equipo no necesita dos stacks;
- SSR ofrece HTML útil para SEO local y fichas compartibles;
- Nitro cubre rutas, middleware y API sin un backend separado;
- una sola unidad simplifica CI, despliegue, logs y tipos compartidos;
- el catálogo pequeño no justifica cachés, colas o buscadores externos.

### Alternativas evaluadas y no recomendadas

| Alternativa | Motivo |
|---|---|
| SPA + API separada | peor base SEO y dos despliegues sin beneficio |
| microservicios | sobrecosto operativo y de memoria |
| WordPress/headless CMS | otro runtime/superficie y no cumple CMS propio |
| SQLite en producción | simple, pero la necesidad declarada, QA Supabase y sesiones/concurrencia favorecen PostgreSQL |
| Supabase directo desde cliente | acopla auth/API/RLS y viola “solo QA” |
| GraphQL | catálogo pequeño, contratos REST suficientes |
| Redis | una instancia y datos pequeños; memoria/coste innecesarios |

## 2. Stack objetivo

| Capa | Decisión |
|---|---|
| Framework | Nuxt 4 estable, versión exacta fijada en lockfile |
| UI | Vue 3 + TypeScript estricto |
| Servidor | Nitro preset `node-server` |
| Base de datos | PostgreSQL, mismo major exacto en dev/QA/prod; el release bloquea si divergen |
| ORM/migraciones | Drizzle ORM + drizzle-kit |
| Driver | `pg`/node-postgres con pool limitado |
| Validación | Zod, versión exacta fijada y schemas compartidos |
| Auth | Better Auth + adapter Drizzle/PostgreSQL |
| Imágenes | adaptador de storage; S3-compatible o volumen local según `G-STORAGE-01` |
| Estilos | CSS propio con tokens; sin framework obligatorio |
| Proxy/TLS | Caddy |
| Tests | unit/integration + Nuxt test utilities/Vitest + Playwright |

El repositorio actual usa Nuxt 3, SQLite/better-sqlite3 y mocks. La migración a esta base ocurre antes de desarrollar el CMS para no mantener dos modelos.

## 3. Capas y dependencias

```text
pages/components
      │
      ▼
server routes / server page loaders
      │
      ▼
application services (casos de uso)
      │
      ├──────────► auth/storage ports
      ▼
repositories
      ▼
PostgreSQL
```

Reglas:

- componentes no importan el esquema de DB;
- endpoints no contienen consultas complejas ni reglas editoriales;
- servicios coordinan autorización, validación, transacciones y auditoría;
- repositorios encapsulan Drizzle;
- tipos públicos/DTO no se exportan desde archivos de ruta;
- el servidor SSR llama servicios/repositorios directamente, no hace HTTP contra su propia API;
- ningún módulo server-only termina en el bundle cliente.

## 4. Estructura propuesta

```text
app/
├── app/ o estructura Nuxt 4 equivalente
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/default.vue
│   ├── layouts/admin.vue
│   ├── middleware/
│   └── pages/
├── public/
├── server/
│   ├── api/v1/catalogo/
│   ├── api/v1/admin/
│   ├── api/auth/
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema/
│   │   └── migrations/
│   ├── repositories/
│   ├── services/
│   ├── middleware/
│   ├── storage/
│   └── utils/
├── shared/
│   ├── contracts/
│   ├── schemas/
│   └── types/
└── tests/
```

Se ajustará al layout oficial de Nuxt 4 al migrar; la intención de capas prevalece sobre nombres exactos.

## 5. Acceso a PostgreSQL

- Un pool por proceso, creado lazy/singleton en servidor.
- Pool máximo inicial: 5 conexiones.
- Timeout de conexión y query definidos; ningún request espera indefinidamente.
- Consultas parametrizadas mediante Drizzle/driver.
- Transacciones para publicación y cambios multi-entidad.
- La cuenta de aplicación no crea roles, bases ni extensiones.
- La cuenta de migración se separa de runtime cuando la infraestructura lo permita.
- Todas las timestamps se guardan con zona/UTC y se presentan en `America/Santiago`.

Las migraciones son la única fuente de verdad del esquema. No se usa `push` destructivo en producción.

## 6. Entornos y portabilidad

| Entorno | DB | Storage | Regla |
|---|---|---|---|
| local | PostgreSQL Docker | adaptador local o S3 de desarrollo | mismo major y migrations |
| test | PostgreSQL efímero | fake/temporal | aislamiento por suite |
| QA | Supabase PostgreSQL | S3-compatible de QA | nunca datos reales ni APIs propietarias |
| producción A | PostgreSQL administrado recomendado | storage según gate | sujeto a `G-INFRA-01` y `G-STORAGE-01` |
| producción B | PostgreSQL local privado | storage según gate | fallback con tuning y backups |

Para evitar lock-in con Supabase:

- el navegador habla solo con Nitro;
- no usar Supabase Auth, Realtime, PostgREST, Edge Functions ni RLS como capa de aplicación;
- no usar extensiones exclusivas;
- probar migraciones en PostgreSQL estándar;
- usar TLS en conexiones remotas.

## 7. Configuración

Validar al iniciar y fallar rápido si falta un valor crítico.

### Servidor/secreto

- `DATABASE_URL`
- `AUTH_SECRET`
- credenciales OIDC solo con `G-AUTH-01.A`
- endpoint/región/bucket/keys S3 solo con `G-STORAGE-01.A`
- origen canónico permitido
- configuración de correo solo si una función futura lo requiere

### Pública no secreta

- URL canónica del sitio;
- marca/locale por defecto cuando no provengan del CMS;
- flags de analítica solo después de resolver `G-ANALYTICS-01`.

WhatsApp y redes viven en `business_settings` solo con `G-CMS-01.B`; con la opción A provienen de configuración versionada. Ninguna variable pública contiene credenciales.

Debe existir `.env.example` sin valores secretos y una tabla que indique qué variable requiere cada entorno.

## 8. Convenciones de API

- prefijo `/api/v1` para contratos de aplicación;
- JSON UTF-8;
- IDs opacos UUID;
- timestamps ISO 8601 UTC;
- propiedades JSON en `camelCase`;
- `Content-Type` estricto;
- body máximo por ruta;
- `requestId` en respuesta de error y logs;
- no exponer stack traces, SQL o detalles internos.

### Respuesta de éxito

```json
{
  "data": {},
  "meta": {
    "requestId": "..."
  }
}
```

### Respuesta de error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los campos indicados.",
    "fields": {
      "name": "Ingresa un nombre."
    },
    "requestId": "..."
  }
}
```

`message` es seguro para usuario. El detalle diagnóstico se registra en servidor con el mismo `requestId`.

### Códigos

- `200`: lectura/actualización exitosa.
- `201`: creación.
- `204`: acción sin body.
- `400`: request mal formado.
- `401`: sin sesión.
- `403`: sesión sin permiso/origen inválido.
- `404`: entidad inexistente o no pública.
- `409`: slug/versión/conflicto.
- `413`: upload demasiado grande.
- `415`: media type no permitido.
- `422`: validación semántica.
- `429`: rate limit.
- `500`: error no esperado.
- `503`: dependencia no disponible/readiness.

## 9. API pública

### `GET /api/v1/catalogo`

Query permitida:

- `featured=true|false`;
- `category=<slug>` solo si hay categorías activas;
- `limit` entre 1 y 100, default 100;

Siempre filtra `published`. Orden: destacado solicitado o `sortOrder`, con desempate estable por ID. `meta.total` es la cantidad total posterior a filtros y anterior a `limit`; `meta.returned` es la longitud de `data`. No hay cursor/paginación en el contrato MVP.

Respuesta conceptual:

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "selva-negra",
      "name": "Selva negra",
      "shortDescription": "...",
      "cover": {
        "src": "https://...",
        "alt": "...",
        "width": 800,
        "height": 600
      },
      "servings": { "mode": "range", "min": 10, "max": 25 },
      "price": { "mode": "from", "amount": 32000, "currency": "CLP" },
      "featured": true,
      "updatedAt": "2026-09-01T12:00:00Z"
    }
  ],
  "meta": { "total": 12, "returned": 12, "requestId": "..." }
}
```

`servings` es una unión: `{ "mode": "range", "min": 10, "max": 25 }` o `{ "mode": "onRequest" }`. `price` es `{ "mode": "from", "amount": 32000, "currency": "CLP" }`, `{ "mode": "onRequest", "currency": "CLP" }` o `{ "mode": "mixed", "fromAmount": 32000, "currency": "CLP" }`. Nunca se usan ceros ni números ficticios.

### `GET /api/v1/catalogo/:slug`

Devuelve ficha completa publicada, variantes disponibles, galería y ajustes necesarios para el CTA. Si el slug API es histórico, responde `301` con `Location: /api/v1/catalogo/<slug-actual>` y sin DTO duplicado. La página pública responde de igual forma hacia `/catalogo/<slug-actual>`.

La API no devuelve campos de auditoría interna, storage privado, borradores o identidad de administradores.

## 10. API administrativa

Todas las rutas exigen sesión, rol, CSRF/origin y validación.

| Método/ruta | Acción |
|---|---|
| `GET /api/v1/admin/tortas` | lista editorial con filtros |
| `POST /api/v1/admin/tortas` | crea borrador |
| `GET /api/v1/admin/tortas/:id` | obtiene editor DTO |
| `PATCH /api/v1/admin/tortas/:id` | actualiza con `version` |
| `POST /api/v1/admin/tortas/:id/publicar` | valida y publica |
| `POST /api/v1/admin/tortas/:id/despublicar` | vuelve a draft |
| `POST /api/v1/admin/tortas/:id/archivar` | archiva |
| `POST /api/v1/admin/tortas/:id/restaurar` | restaura a draft |
| `DELETE /api/v1/admin/tortas/:id` | elimina solo un draft nunca publicado y sin referencias |
| `PUT /api/v1/admin/tortas/orden` | reordena en transacción |
| `POST /api/v1/admin/tortas/:id/imagenes` | sube/procesa imagen |
| `PATCH /api/v1/admin/imagenes/:id` | alt, orden, portada |
| `DELETE /api/v1/admin/imagenes/:id` | elimina con reglas |
| `GET/PATCH /api/v1/admin/ajustes` | condicional a `G-CMS-01.B` |

Crear/actualizar variantes puede ser parte del DTO agregado de torta para guardar todo en una transacción. No se exponen escrituras públicas.

### Idempotencia y concurrencia

- `PATCH` incluye `version`.
- Upload y publicación aceptan `Idempotency-Key`; servidor persiste actor, operación, hash del request y respuesta durante 24 h.
- Repetir clave y body devuelve el resultado previo; la misma clave con body distinto devuelve 409.
- Reintentos de upload/publicar no duplican objetos o auditorías de éxito.
- Acciones de publicación son idempotentes cuando el estado ya coincide, o devuelven conflicto claro.
- El cliente deshabilita doble envío, pero el servidor sigue siendo seguro ante duplicados.

## 11. Caching y frescura

Línea base MVP:

- `/`, `/catalogo`, `/catalogo/**` y JSON público dinámico: sin caché de aplicación/SWR; leen el estado comprometido en PostgreSQL;
- el siguiente request iniciado después del commit debe observar la publicación, despublicación o slug nuevo;
- assets versionados: caché pública larga e `immutable`;
- admin, auth y respuestas autenticadas: privadas/`no-store`;
- el reverse proxy no cachea HTML/JSON dinámico;
- sin Redis, una sola instancia.

Si la carga futura exige cachear HTML/datos, será un ADR nuevo con invalidación explícita que cubra páginas, API, sitemap, metadatos y JSON-LD. Un TTL/SWR por sí solo no satisface un máximo contractual de frescura.

Nunca cachear una respuesta que pueda mezclar contenido admin y público.

## 12. Observabilidad de aplicación

Cada request registra en JSON:

- timestamp, nivel, requestId;
- método, ruta normalizada, status y duración;
- usuario solo como ID interno en rutas admin;
- clase de error segura;
- versión de despliegue.

No registrar query strings completos de WhatsApp/auth, bodies de login, cookies, tokens ni archivos. Métricas mínimas: requests, 5xx, latencia, pool DB, RSS/heap y resultado de uploads/publicaciones.

## 13. Pruebas de arquitectura

- imports server-only no entran en cliente;
- todas las consultas públicas filtran `published`;
- rutas admin rechazan 401/403 aun invocadas sin UI;
- migraciones suben desde vacío y desde versión anterior;
- repositorios pasan contra PostgreSQL local y QA;
- contrato API se valida con esquemas compartidos;
- no existe caché dinámica que conserve publicados ya despublicados o slugs antiguos;
- pool no supera el límite bajo carga;
- shutdown deja de aceptar tráfico y cierra pool dentro del timeout.

## 14. Fuentes autoritativas

- [Nuxt 4 — Server](https://nuxt.com/docs/4.x/getting-started/server)
- [Nuxt 4 — Deployment](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Nuxt 4 — Rendering modes and route rules](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [node-postgres — Pooling](https://node-postgres.com/features/pooling)
- [node-postgres — Pool sizing](https://node-postgres.com/guides/pool-sizing)
- [Supabase — Database overview](https://supabase.com/docs/guides/database/overview)
- [Supabase Storage — S3 compatibility](https://supabase.com/docs/guides/storage/s3/compatibility)
