# SEO, accesibilidad, rendimiento y calidad

Última revisión: 2026-09-01  
Estado: `gates de calidad propuestos`

## 1. Estrategia SEO

La oportunidad es local y de producto. El sitio debe ayudar a encontrar “tortas en Pucura” y búsquedas relacionadas con sabores/zonas, sin crear páginas puerta ni repetir localidades artificialmente.

### Principios

- HTML completo desde servidor para contenido público.
- Una intención clara por URL.
- Contenido real y útil antes que densidad de palabras clave.
- Slugs estables y redirects al cambiarlos.
- Datos estructurados idénticos a lo visible.
- Admin, preview, auth y API fuera del índice.

## 2. Metadatos por ruta

### `/`

- title propuesto: `Donde Betty | Tortas por encargo en Pucura`;
- description basada en tortas caseras, Pucura, dulzor equilibrado y WhatsApp;
- canonical absoluto;
- Open Graph con imagen real horizontal;
- `Bakery` o subtipo apropiado de `LocalBusiness`.

### `/catalogo`

- title: `Catálogo de tortas | Donde Betty, Pucura`;
- description con sabores, porciones y encargo;
- canonical sin filtros irrelevantes;
- `ItemList` cuando el catálogo tenga al menos una torta; debe reflejar exactamente el listado visible.

### `/catalogo/[slug]`

- title y description únicos;
- canonical al slug vigente;
- OG con portada real;
- `Product` solo si nombre, imagen, descripción y datos declarados son reales;
- no usar merchant listing/checkout si la compra se confirma por WhatsApp;
- `Offer` solo tras validar que el marcado no presenta disponibilidad/precio engañosos. La línea base es omitirlo si el precio final depende de conversación.

### `/contacto` (solo con `G-PROD-01.B`)

- datos de contacto/cobertura confirmados;
- canonical;
- sin repetir dirección privada.

### Privado

`/admin/**`, `/api/**`, preview y callbacks incluyen `noindex`; además no aparecen en sitemap ni navegación pública. `robots.txt` ayuda a rastreo, pero la seguridad depende de auth, no de robots.

## 3. Sitemap, robots y canonical

- sitemap generado con `/`, `/catalogo`, `/contacto` solo si es página propia y tortas `published`;
- `lastmod` desde `updatedAt` relevante de contenido;
- sin query params, drafts, archivos o redirects antiguos;
- robots permite assets requeridos y excluye rutas privadas por higiene;
- canonical construido desde una única `SITE_URL` validada;
- combinaciones de filtros por query no entran al sitemap, usan canonical `/catalogo` y `noindex,follow` en el MVP; páginas de taxonomía indexables requieren ADR SEO propio;
- dominio HTTP, `www`/sin `www` y slash final convergen con 301;
- cambios de slug usan el namespace único `cake_slugs`; los históricos redirigen directamente al actual y no forman cadenas.

## 4. SEO local y contenido

- nombre, teléfono y ubicación consistentes entre web y perfiles externos confirmados;
- mencionar Pucura y cobertura donde aporta información, no en cada párrafo;
- textos alternativos describen producto, no acumulan keywords;
- fotografías propias con nombres/metadata operativos, sin depender de EXIF;
- no crear páginas por Lican Ray, Coñaripe o Villarrica sin contenido y servicio real diferenciable;
- incluir historia/oficio porque respalda confianza, no como relleno SEO.

## 5. Datos estructurados

Reglas:

- serialización segura en servidor;
- una fuente de configuración para nombre, URL, teléfono, redes y logo;
- `sameAs` solo perfiles reales;
- horario solo si está confirmado;
- dirección solo si es pública;
- `priceRange` solo si el negocio acepta mostrarlo;
- tortas borrador/archivadas nunca generan JSON-LD público;
- validar en Rich Results Test/Schema validator y revisar warnings manualmente;
- no declarar ratings, reviews o disponibilidad inexistentes.

## 6. Rendimiento: objetivos

### Core Web Vitals de producción

| Métrica | Objetivo p75 |
|---|---:|
| LCP | ≤2,5 s |
| INP | ≤200 ms |
| CLS | ≤0,1 |

Se segmenta móvil/escritorio y se espera suficiente muestra antes de afirmar cumplimiento real.

En laboratorio se ejecutan tres corridas Lighthouse sobre build de producción con preset móvil; se registra la mediana de LCP y CLS, y TBT como proxy de capacidad de respuesta. INP contractual se evalúa solo con datos de campo suficientes o una prueba de interacción específica, no se infiere directamente de Lighthouse.

### Presupuestos internos de lanzamiento

| Recurso | Presupuesto inicial |
|---|---:|
| JS inicial público por ruta (gzip) | ≤180 KB, revisar por bundle |
| CSS inicial (gzip) | ≤45 KB |
| TBT de laboratorio, mediana móvil | ≤200 ms |
| imagen hero móvil | objetivo ≤220 KB |
| imagen hero escritorio | objetivo ≤350 KB |
| imagen de tarjeta habitual | objetivo ≤120 KB al tamaño servido |
| fuentes | máximo 2 familias y pesos usados; WOFF2 local |
| scripts/trackers de terceros antes de interacción | 0; CDN/storage de assets aprobado queda exceptuado |

Son gates del proyecto, no promesas universales. Si una imagen real necesita superar el valor, debe justificarse con evidencia visual y no descargar el mismo archivo a todos los viewports.

### Recursos del proceso

En perfil recomendado con DB/storage externos:

- un proceso Node;
- heap máximo inicial 256–320 MiB, validado bajo carga;
- RSS idle objetivo ≤220 MiB;
- RSS pico controlado objetivo ≤400 MiB;
- pool DB máximo 5;
- transformación de imagen concurrente 1;
- margen de memoria del host ≥20 % en operación normal.

Los números se miden en el artefacto real. Un fallo de OOM en la prueba bloquea el release aunque Lighthouse sea alto.

## 7. Estrategia de carga

- hero con `fetchpriority="high"`, dimensiones y preload solo para el recurso exacto necesario;
- imágenes bajo el fold con lazy loading;
- `srcset`/`sizes` correctos y formatos modernos;
- no transformar originales grandes por cada request en la VPS;
- autoalojar fuentes, usar `font-display` apropiado y preload mínimo;
- cargar JS del CMS únicamente en `/admin`;
- evitar librerías de carrusel/iconos si CSS/SVG resuelve;
- acceso SSR a servicios directo, sin llamada HTTP interna;
- HTML/JSON público dinámico sin caché de aplicación en MVP, assets inmutables y admin `no-store`;
- no third-party chat widget: WhatsApp es un enlace.

## 8. Accesibilidad objetivo WCAG 2.2 AA

### Estructura y teclado

- skip link visible al foco;
- landmarks y H1 único;
- orden DOM coincide con lectura visual;
- todos los controles operables con teclado;
- foco visible y nunca tapado por header/modal;
- diálogos controlan foco y Escape;
- menú cerrado no contiene elementos enfocables;
- no hay keyboard trap.

### Visual

- texto normal ≥4,5:1; texto grande según WCAG;
- componentes, bordes esenciales y foco ≥3:1;
- zoom 200 % y reflow 400 % sin pérdida;
- blanco táctil estándar 44 × 44 px;
- no depender solo de color, posición o icono;
- texto sobre foto requiere superficie/contraste medido.

### Contenido y medios

- alt útil por imagen de producto;
- decoraciones ignoradas;
- iconos SVG accesibles y emojis no usados como único significado;
- idioma `es-CL`;
- moneda y fechas localizadas;
- links externos identificables por texto/contexto;
- mensajes comprensibles, sin jerga del stack.

### Formularios CMS

- label persistente por control;
- instrucciones antes del error;
- error asociado con `aria-describedby`;
- resumen de errores al intentar publicar;
- no borrar datos tras error;
- autosave solo si es confiable y visible; fuera del MVP, guardar manualmente;
- advertencia de cambios no guardados;
- reordenamiento accesible con botones alternativos a drag-and-drop.

### Movimiento

`prefers-reduced-motion: reduce` desactiva scroll suave, zooms, reveals y transiciones no esenciales. No hay autoplay.

## 9. Estrategia de pruebas

### Unitarias

- formateo CLP;
- constructor WhatsApp y URL encoding;
- validación/normalización de slug;
- reglas de publicación;
- cálculo de precio y porciones;
- sanitización/Markdown;
- transición de estados;
- autorización de casos de uso;
- redacción de logs.

### Integración con PostgreSQL

- migrations desde cero;
- restricciones e índices;
- CRUD y transacciones;
- filtro `published`;
- slug redirects;
- concurrencia optimista;
- sesiones/revocación;
- auditoría;
- rollback de error de storage/DB.

No se sustituye toda la DB con mocks; las consultas críticas corren contra PostgreSQL efímero.

### Contrato/API

- schemas de éxito/error;
- estados 401/403/404/409/413/415/422/429;
- límites de query/body;
- contenido privado ausente;
- no-store en admin;
- idempotencia/reintentos relevantes.

### Componentes

- tarjeta con precio desde y a consultar;
- estados de carga/error/vacío;
- formulario y mensajes;
- menú móvil/foco;
- galería e imágenes faltantes;
- confirmaciones de acciones peligrosas.

### E2E críticos

1. Landing → torta → WhatsApp correcto.
2. Catálogo → filtro/URL → ficha.
3. Login OIDC simulado/controlado → admin.
4. Anónimo intenta API admin → 401.
5. Crear borrador → completar → publicar → visible en el siguiente request posterior al commit.
6. Editar precio/porciones → web actualizada.
7. Conflicto de versión → 409 sin pérdida.
8. Cambiar slug → URL anterior 301.
9. Upload válido → derivados; upload malicioso → rechazo.
10. Despublicar → desaparece de web/sitemap.
11. Logout/revocación → acceso denegado.
12. Error DB → readiness falla y página responde sin filtrar detalles.

### Visual y accesibilidad

- capturas en 375, 390, 768, 1024 y 1440;
- comparación en Chrome y al menos Firefox/WebKit donde CI permita;
- axe automatizado como red, más revisión manual teclado/lector;
- contraste medido;
- reducción de movimiento;
- contenido largo, imagen vertical y datos ausentes.

### Rendimiento y resiliencia

- Lighthouse CI sobre build de producción;
- prueba de carga ligera en catálogo, ficha y login sin brute force real;
- observación de RSS/heap/pool durante SSR y upload;
- proceso recibe señal y cierra de forma limpia;
- DB lenta/no disponible produce timeout controlado;
- disco/storage lleno falla sin corrupción.

## 10. Matriz de CI

En cada PR:

1. instalación reproducible con lockfile;
2. lint;
3. typecheck estricto;
4. unit/component;
5. integración PostgreSQL;
6. build Nuxt de producción;
7. smoke E2E;
8. escaneo de dependencias/secretos;
9. Lighthouse/axe en cambios relevantes o rama principal.

En release:

- suite E2E completa;
- migración dry-run/QA;
- revisión de bundle;
- backup previo si hay migración de producción;
- smoke post-deploy y validación de sitemap/robots/JSON-LD.

## 11. Gate de lanzamiento

Rúbrica común: `crítico` impide completar un flujo, expone datos/seguridad o bloquea tecnologías de asistencia; `serio` incumple WCAG AA o degrada sustancialmente un flujo principal sin alternativa; `moderado` tiene alternativa usable pero requiere corrección; `menor` es cosmético o de baja fricción. La clasificación manual debe incluir impacto, usuarios afectados y evidencia, no solo la etiqueta de una herramienta.

- cero fallos críticos/serios de accesibilidad conocidos;
- todos los E2E críticos en verde;
- build/typecheck/lint sin errores;
- CWV de laboratorio y budgets internos dentro de objetivo; una excepción solo puede aprobarla el responsable de producto, identificando métrica/ruta/dispositivo, evidencia, impacto, mitigación, responsable y fecha de vencimiento; no se exceptúan seguridad ni accesibilidad que impidan una tarea crítica;
- sin datos ficticios, enlaces rotos ni 404 desde navegación;
- admin no indexable y no accesible anónimamente;
- prueba manual de WhatsApp en Android/iOS o web;
- Rich Results/Schema sin errores que invaliden el marcado;
- restore y rollback ensayados según spec operativa.

## 12. Fuentes autoritativas

- [Nuxt 4 — Rendering modes](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [Nuxt 4 — SEO meta](https://nuxt.com/docs/4.x/getting-started/seo-meta)
- [Nuxt 4 — Performance guidance](https://nuxt.com/docs/4.x/guide/best-practices/performance)
- [Google Search — Product structured data / merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Nuxt Sitemap module](https://nuxt.com/modules/sitemap)
- [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
