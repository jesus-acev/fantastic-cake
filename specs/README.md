# Especificaciones de producto — Donde Betty

Última revisión: 2026-09-01  
Estado: `auditoría cruzada completada · gates del propietario pendientes`

Este directorio es la fuente de verdad para construir la web informativa, el catálogo y el CMS de **Donde Betty · Tortas de Pucura**. Las especificaciones describen el producto objetivo; el código actual en `app/` es un prototipo y no prevalece cuando existe una contradicción.

## Orden de lectura

1. [`00-ESPECIFICACION-MAESTRA.md`](00-ESPECIFICACION-MAESTRA.md): alcance, requisitos, decisiones y etapas.
2. [`01-PRODUCTO-MARCA-Y-CONTENIDO.md`](01-PRODUCTO-MARCA-Y-CONTENIDO.md): ADN de marca, catálogo conocido y datos pendientes.
3. [`02-EXPERIENCIA-PUBLICA-Y-DISENO.md`](02-EXPERIENCIA-PUBLICA-Y-DISENO.md): rutas, secciones, contenido e interacción pública.
4. [`03-CATALOGO-CMS-Y-MODELO-DATOS.md`](03-CATALOGO-CMS-Y-MODELO-DATOS.md): flujo editorial, entidades y reglas del CMS.
5. [`04-ARQUITECTURA-TECNICA-Y-API.md`](04-ARQUITECTURA-TECNICA-Y-API.md): monolito, PostgreSQL, módulos y contratos HTTP.
6. [`05-AUTENTICACION-Y-SEGURIDAD.md`](05-AUTENTICACION-Y-SEGURIDAD.md): login, sesiones, autorización y hardening.
7. [`06-SEO-RENDIMIENTO-Y-CALIDAD.md`](06-SEO-RENDIMIENTO-Y-CALIDAD.md): SEO, accesibilidad, presupuestos y pruebas.
8. [`07-DESPLIEGUE-OPERACION-Y-RECUPERACION.md`](07-DESPLIEGUE-OPERACION-Y-RECUPERACION.md): VPS, entornos, backups y operación.
9. [`08-ROADMAP-Y-ACEPTACION.md`](08-ROADMAP-Y-ACEPTACION.md): plan ejecutable, gates y trazabilidad.
10. [`09-REGISTRO-DECISIONES-GATE.md`](09-REGISTRO-DECISIONES-GATE.md): alternativas, trade-offs y decisiones pendientes.

Documentos preexistentes:

- [`PLAN_VISUAL.md`](PLAN_VISUAL.md) conserva la auditoría visual del prototipo. Es material de apoyo; las nuevas specs prevalecen si hay diferencias de alcance.
- [`docs/architecture.md`](../docs/architecture.md) presenta la arquitectura de alto nivel.
- [`docs/STACK.md`](../docs/STACK.md) resume el stack objetivo y la brecha con el prototipo.

## Precedencia de fuentes

Cuando dos documentos difieran, se usa este orden:

1. decisión explícita y más reciente del propietario, registrada en un ADR/gate;
2. especificación maestra para alcance y objetivos;
3. especificación especializada para el detalle de su tema, siempre que no cambie el alcance;
4. estrategia de marca original en [`internos/ADN-marca.md`](../internos/ADN-marca.md);
5. plan visual y reportes de auditoría;
6. implementación actual.

Una contradicción entre la maestra y una especializada no se resuelve silenciosamente por precedencia: abre un gate o una corrección editorial. La estrategia original dejó el naming abierto; los identificadores legales y personales se conservan en [`internos/DATOS-PRIVADOS-SPECS.md`](../internos/DATOS-PRIVADOS-SPECS.md), fuera de Git. Una decisión posterior registrada en `PLAN_VISUAL.md` fijó la marca comercial **Donde Betty** y el descriptor **Tortas de Pucura**.

## Convenciones

- `FUENTE_DOCUMENTAL`: aparece en el brief o ADN, pero puede requerir confirmación de vigencia.
- `VALIDADO_PROPIETARIO`: decisión explícita con fecha/evidencia.
- `PROPUESTO`: línea base recomendada que requiere aceptación explícita si es gate.
- `PENDIENTE`: dato que debe entregar o validar el propietario.
- `FUERA DE MVP`: no se implementa en la primera entrega.
- Los requisitos tienen identificadores estables (`RF-*`, `RNF-*`) para vincular tareas y pruebas.
- Ningún dato ficticio puede publicarse para completar un vacío de contenido.

## Decisiones base

| Tema | Estado | Decisión |
|---|---|---|
| Producto | Fuente documental | Web informativa y catálogo de tortas por encargo; WhatsApp continúa la conversación. |
| Marca | Validado propietario (2026-08-28) | Donde Betty · Tortas de Pucura. |
| Mercado | Fuente documental | Chile/CLP y origen en Pucura; cobertura actual por confirmar. |
| Arquitectura | Confirmado por brief | Monolito con sitio, CMS y API en un solo proyecto/despliegue. |
| Framework objetivo | Propuesto | Nuxt 4 + Nitro `node-server`; migrar el prototipo Nuxt 3 antes de ampliar funcionalidad. |
| Persistencia | Propuesto | PostgreSQL + Drizzle sujeto a `G-DATA-01`; Supabase solo QA. |
| Autenticación | Propuesto | Sesión opaca en cookie segura; Google OIDC allowlisted como login principal. |
| Imágenes | Propuesto | Object storage S3-compatible en producción; volumen local solo como fallback documentado. |
| Tema visual | Validado propietario (2026-08-28) | Solo modo claro. |

Las filas `Propuesto` continúan abiertas en [`09-REGISTRO-DECISIONES-GATE.md`](09-REGISTRO-DECISIONES-GATE.md). No se aceptan por silencio.

## Estado del prototipo

El repositorio actual sirve como referencia visual, pero aún no es una base de producción:

- usa Nuxt 3 y contenido ficticio de “Dulce Arte”;
- el endpoint de productos devuelve mocks;
- el esquema SQLite no está conectado;
- `/admin` no tiene login, autorización ni CRUD;
- no existen migraciones, uploads, pruebas, CI ni despliegue productivo.

La implementación debe avanzar siguiendo `08-ROADMAP-Y-ACEPTACION.md`, no intentando endurecer los mocks como si fueran datos reales.
