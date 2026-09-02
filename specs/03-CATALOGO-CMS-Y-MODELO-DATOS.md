# Catálogo, CMS y modelo de datos

Última revisión: 2026-09-01  
Estado: `diseño funcional propuesto`

## 1. Alcance del CMS

El CMS es una herramienta interna para mantener la vitrina, no un ERP. El MVP permite administrar:

- tortas y su estado editorial;
- variantes, porciones y precios;
- portada, galería y textos alternativos;
- orden y destacados;
- metadatos SEO;
- canales y datos operativos expresamente autorizados.

No administra pedidos, clientes, pagos, inventario, recetas, costos ni conversaciones de WhatsApp.

## 2. Principios del dominio

1. **Borrador primero.** Crear una torta nunca la publica automáticamente.
2. **Publicación validada.** Lo que no está suficientemente informado permanece privado.
3. **Archivo antes que borrado.** Se conserva historia y enlaces.
4. **Precio explícito.** Hay precio CLP o una decisión consciente de consultar; `0` no significa “sin precio”.
5. **Variante es oferta.** Tamaño, porciones y precio pertenecen a una variante, no a texto libre.
6. **Imagen es contenido.** Tiene orden, portada, dimensiones, derechos y alt.
7. **Servidor como autoridad.** La validación del formulario mejora UX, pero las reglas se vuelven a ejecutar en el servidor.
8. **Historial suficiente.** Las acciones de riesgo quedan auditadas sin guardar secretos ni recetas privadas.

## 3. Estados editoriales

```text
draft ──publicar──> published ──despublicar──> draft
  │                       │
  └────archivar───────────┴────archivar──────> archived
                                      │
                                      └──restaurar──> draft
```

- `draft`: visible solo en CMS/previsualización autenticada.
- `published`: visible en web, API pública y sitemap.
- `archived`: fuera de la web; conservado para auditoría y posibles redirects.

Una torta que nunca se publicó puede borrarse únicamente mediante una acción separada y confirmada si no tiene referencias. Una torta publicada se archiva.

## 4. Modelo relacional

Los nombres son conceptuales; la migración final debe mantenerlos consistentes en inglés o español, no mezclarlos arbitrariamente.

### `cakes`

| Campo | Tipo conceptual | Regla |
|---|---|---|
| `id` | UUID | PK generada en servidor |
| `name` | varchar(120) | requerido |
| `short_description` | varchar(180) | requerida para publicar |
| `description` | text/Markdown restringido | requerida para ficha pública |
| `status` | enum | `draft`, `published`, `archived` |
| `featured` | boolean | default false |
| `sort_order` | integer | orden catálogo |
| `featured_order` | integer nullable | orden en landing |
| `customization_note` | varchar(300) nullable | solo opciones confirmadas |
| `advance_notice_hours` | smallint nullable | hereda ajuste global si null |
| `same_day_policy` | enum | `inherit`, `allowed_subject_to_confirmation`, `not_offered` |
| `ingredients_summary` | text nullable | contenido confirmado |
| `allergen_notice` | text nullable | contenido confirmado, no asesoría médica |
| `storage_instructions` | text nullable | contenido confirmado |
| `seo_title` | varchar(60) nullable | fallback generado si null |
| `seo_description` | varchar(160) nullable | fallback desde descripción breve |
| `first_published_at` | timestamptz nullable | se fija una sola vez en la primera publicación |
| `last_published_at` | timestamptz nullable | se actualiza en cada publicación efectiva |
| `created_at` | timestamptz | servidor/DB |
| `updated_at` | timestamptz | servidor/DB |
| `version` | integer | concurrencia optimista, inicia en 1 |

No se guarda `rating`, stock ni “tiempo de preparación” genérico mientras el negocio no mantenga esos datos.

### `cake_variants`

| Campo | Regla |
|---|---|
| `id`, `cake_id` | PK y FK con borrado restringido/cascada controlada |
| `label` | por ejemplo tamaño/diámetro validado por Betty |
| `servings_mode` | `range` u `on_request` |
| `servings_min`, `servings_max` | requeridos y positivos solo con `range`; min ≤ max |
| `price_mode` | `fixed` u `on_request` |
| `price_clp` | entero positivo solo con `fixed`; null con `on_request` |
| `available` | indica si se ofrece normalmente, no stock en tiempo real |
| `sort_order` | orden visible |
| `created_at`, `updated_at` | auditoría básica |

CLP no usa decimales en la interfaz. Los modos discriminados evitan usar cero o números ficticios. El resumen público es `from` si todas las variantes tienen precio, `onRequest` si ninguna lo tiene y `mixed` si coexisten ambos modos. El modelo admite el caso mixto; `G-PROD-02` confirma si la interfaz del negocio lo utilizará.

### `categories` y `cake_categories`

Las categorías se omiten del MVP por defecto. Solo entran en la primera migración si Betty valida una taxonomía comprensible antes de Etapa 1; añadirlas después requiere una migración aditiva.

- `categories`: `id`, `name`, `slug`, `description`, `sort_order`, `active`.
- `cake_categories`: PK compuesta e índices por ambas FKs.

No se duplica el nombre de categoría en `cakes`.

### `cake_images`

| Campo | Regla |
|---|---|
| `id`, `cake_id` | identificación y pertenencia |
| `source_storage_key` | original privado nullable según política de `G-STORAGE-01` |
| `original_filename` | solo referencia editorial sanitizada |
| `mime_type` | JPEG, PNG o WebP de entrada validado |
| `source_width`, `source_height`, `source_bytes` | metadatos del original validado |
| `alt_text` | requerido para publicar, salvo decoración justificada |
| `sort_order` | orden galería |
| `is_cover` | máximo una portada por torta |
| `content_hash` | SHA-256 requerido para integridad e idempotencia |
| `rights_confirmed_at`, `rights_confirmed_by` | evidencia mínima de revisión de derechos/consentimiento |
| `rights_note` | referencia breve; no almacena documentos personales sensibles |
| `created_at` | auditoría |

### `cake_image_variants`

Manifiesto obligatorio de derivados, no convención implícita:

- `id`, `cake_image_id`, `storage_key` único;
- `format`: `webp` o `jpeg`;
- `width`, `height`, `bytes`;
- `purpose`: `responsive` o `social`;
- unique `(cake_image_id, purpose, format, width)`.

Para `responsive` se generan WebP y JPEG en 480, 800 y 1200 px de ancho, sin ampliar el original. WebP es preferido y JPEG es fallback. Toda portada publicada genera además `social` JPEG 1200 × 630 con recorte editorial previsualizado. AVIF queda fuera del MVP; incorporarlo requiere ADR y medición. La base guarda claves y metadatos, no binarios.

### `cake_slugs`

- `id`, `cake_id`, `slug`, `is_current`, `created_at`.
- `slug` es único globalmente entre actuales e históricos.
- índice único parcial garantiza un solo `is_current=true` por torta.
- cambiar slug marca el anterior como histórico y crea el nuevo actual en la misma transacción.
- una ruta histórica resuelve directamente a la torta y responde 301 al slug actual; no existen cadenas.

### `business_settings`

La implementación es una tabla singleton tipada, no JSON/documento libre. Solo existe endpoint/editor `/admin/ajustes` con `G-CMS-01.B`; con A, estos valores provienen de configuración versionada y la tabla/editor se omiten.

| Campo operativo | Editable en B | En A |
|---|---|---|
| `whatsapp_e164` | sí, con sesión reciente | configuración versionada |
| `instagram_url`, otras redes | sí | configuración versionada |
| `public_email` | sí | configuración versionada |
| `location_label`, `pickup_note` | sí | configuración versionada |
| `service_areas` estructuradas | sí | configuración versionada |
| `contact_hours` | sí | configuración versionada |
| `default_advance_notice_hours` | sí | configuración versionada |
| `default_same_day_policy` | sí | configuración versionada |
| `default_whatsapp_message` | sí | configuración versionada |
| `updated_at`, `version` | sistema | no aplica |

`brand_name`, `tagline`, SEO global e imagen social por defecto quedan siempre en configuración versionada en el MVP. El SEO por torta sí se edita en el catálogo. La tabla no contiene secretos, client IDs, credenciales, DSN ni tokens.

### Autenticación y auditoría

Better Auth administra tablas equivalentes a `user`, `account`, `session`, `verification` y, si corresponde, 2FA. No se rediseñan manualmente sin revisar el adaptador de la versión fijada.

`audit_log`:

- `id`, `actor_user_id`, `action`, `entity_type`, `entity_id`;
- resumen JSON de campos modificados, con allowlist;
- `request_id`, timestamp;
- no persiste IP en auditoría de negocio; el log de seguridad puede usarla temporalmente según la retención operativa.

No registra hashes de contraseña, cookies, tokens, secretos ni contenido binario.

### `idempotency_keys`

Para uploads y acciones de publicación reintentables:

- `key`, `actor_user_id`, `operation`, hash del request, status/response segura y `expires_at`;
- unicidad por `(actor_user_id, operation, key)`;
- una misma clave con body distinto responde 409;
- replay devuelve el resultado previo sin duplicar objeto ni auditoría;
- retención inicial 24 h y purga operativa.

## 5. Índices y restricciones

- índices `(status, sort_order)` y `(featured, status, featured_order)`.
- `cake_variants(cake_id, sort_order)`.
- `cake_images(cake_id, sort_order)`.
- restricción parcial o transacción que garantice una portada por torta.
- `cake_slugs.slug` único y un slug actual por torta.
- checks discriminados de `servings_mode`/`price_mode`.
- FKs con comportamiento explícito.
- checks para precios/porciones/orden y `version > 0`.
- índices de sesiones según exige Better Auth.

La lógica de “lista para publicar” vive en el servicio de dominio y se cubre con tests; constraints de DB cubren invariantes que nunca deben romperse.

## 6. Reglas para publicar

Una torta solo puede pasar a `published` si tiene:

- nombre y slug actual válidos;
- descripción breve y completa;
- al menos una imagen de portada procesada con alt y derechos confirmados;
- al menos una variante disponible;
- `servings_mode` válido por variante, con rango real o `on_request` explícito;
- `price_mode` válido por variante, con CLP real o `on_request` explícito;
- anticipación válida por torta o ajuste global;
- contenido alimentario revisado si se muestra;
- SEO generado o ingresado dentro de límites;
- cero errores de integridad.

Las advertencias no bloqueantes pueden incluir: sin galería adicional, sin personalización o sin SEO manual.

## 7. Flujos del CMS

### 7.1 Dashboard

Muestra tareas de negocio, no tecnología:

- tortas publicadas, borradores y archivadas;
- borradores incompletos;
- tortas sin precio estructurado, alt o portada;
- última actualización;
- accesos a `Nueva torta`, `Ordenar destacadas` y `Ver sitio`.

No muestra “PostgreSQL”, “Drizzle”, “VPS” o “Nuxt” como métricas.

### 7.2 Listado

- búsqueda por nombre;
- filtro por estado y destacado;
- columnas: portada, nombre, estado, precio/resumen, destacado, actualizado;
- acciones: editar, previsualizar, publicar/despublicar, archivar/restaurar;
- acciones peligrosas separadas y confirmadas;
- paginación desde 50 elementos; antes, lista simple.

### 7.3 Crear/editar

Secciones de formulario:

1. Información principal.
2. Variantes, porciones y precio.
3. Imágenes y alt.
4. Encargo, personalización y anticipación.
5. Información alimentaria confirmada.
6. SEO y slug.
7. Estado, destacados y orden.

Acciones persistentes: `Guardar borrador`, `Previsualizar`, `Publicar cambios`. El mismo verbo se mantiene en botón, progreso, éxito y auditoría.

### 7.4 Previsualización

- ruta contractual `/admin/tortas/[id]/preview`;
- requiere sesión y autorización;
- no indexable y no compartible públicamente;
- usa los mismos componentes de la ficha pública;
- deja claro que es un borrador;
- no crea URL pública accesible con token de larga duración en MVP.

### 7.5 Publicar y despublicar

- el servidor ejecuta validación completa;
- la escritura del agregado torta/variantes/metadatos de imágenes ocurre en una transacción; storage se coordina con compensación e idempotencia;
- se incrementa `version`;
- se registra auditoría;
- el MVP no cachea HTML/JSON público en aplicación; el siguiente request posterior al commit debe ver el cambio;
- la interfaz confirma `Cambios publicados` y enlaza a la página.

### 7.6 Conflicto de edición

Cada update incluye la `version` leída. Se actualiza con condición `WHERE id=? AND version=?`. Si no coincide:

- responde `409 CONFLICT`;
- no sobrescribe;
- informa que existe una versión más nueva;
- permite recargar y revisar; el merge automático queda fuera del MVP.

## 8. Pipeline de imágenes

1. Admin selecciona archivo.
2. Cliente valida tamaño básico para feedback, sin ser autoridad.
3. Servidor limita request y autentica antes de procesar.
4. Se valida extensión, firma real y decodificación.
5. Se rechazan SVG, GIF animado, formatos no permitidos y dimensiones abusivas.
6. Se re-encodea, elimina EXIF y genera derivados con concurrencia 1.
7. Se suben usando una clave UUID/versionada.
8. Se guardan metadatos solo si storage termina correctamente.
9. En fallo parcial se limpia el objeto de forma síncrona; si la limpieza falla, se registra una alerta y el comando operativo `storage:reconcile` permite listar/corregir huérfanos. No existe scheduler oculto en el MVP.

Línea base de entrada: JPEG, PNG o WebP, máximo 8 MB, máximo 20 megapíxeles y máximo 8000 px por lado. Salida definida por `cake_image_variants`: WebP + JPEG en 480/800/1200 sin upscale y, para toda portada publicada, social JPEG 1200 × 630. Los límites se reducen si la medición de memoria no conserva el margen operativo; ampliarlos requiere actualizar pruebas y spec.

No se aceptan URLs remotas arbitrarias ni nombres de archivo como ruta final.

## 9. Ajustes del negocio

Este bloque solo se implementa con `G-CMS-01.B`. Los cambios a WhatsApp, redes, cobertura y horarios son menos frecuentes pero afectan toda la web. Reglas:

- URL y E.164 validados;
- previsualización del link de WhatsApp;
- canal vacío se omite;
- cambiar WhatsApp exige confirmación reforzada y auditoría;
- no se publican horarios o cobertura sin valor explícito;
- los ajustes también usan `version`.

## 10. Seed inicial

El seed crea:

- configuración de marca no sensible;
- únicamente los nombres que `G-PROD-02` confirme como vigentes, en estado `draft`;
- ningún precio, rating, imagen remota o descripción inventada;
- usuario admin solo mediante comando separado y secreto, nunca dentro del seed general.

El seed debe ser idempotente en desarrollo/QA y no sobrescribir contenido editorial existente.

## 11. Criterios de aceptación

- Una torta incompleta no puede publicarse mediante UI ni API directa.
- El administrador puede crear, editar, previsualizar, publicar, despublicar y archivar.
- Dos ediciones concurrentes producen 409, no pérdida silenciosa.
- Cambiar slug conserva una redirección canónica.
- La landing respeta orden y destacados del CMS.
- Las variantes calculan `Desde` correctamente y nunca muestran `$0` por ausencia.
- Borradores y archivados son inaccesibles anónimamente.
- El upload rechaza contenido falso/malicioso y no ejecuta SVG.
- Toda mutación sensible queda auditada.
- El modelo funciona sin APIs exclusivas de Supabase.
