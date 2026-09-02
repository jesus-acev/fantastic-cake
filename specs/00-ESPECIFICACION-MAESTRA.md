# Especificación maestra — Web, catálogo y CMS de Donde Betty

Última revisión: 2026-09-01  
Estado: `auditada · gates de propietario pendientes`  
Producto: **Donde Betty · Tortas de Pucura**

## 1. Resumen ejecutivo

Se construirá una web informativa rápida, accesible y orientada a SEO para una pastelería familiar de Pucura especializada en tortas caseras hechas a pedido. La web ayudará a una familia a entender la propuesta, elegir una torta y comenzar el encargo por WhatsApp. No será un ecommerce: la orientación, confirmación, disponibilidad, pago y entrega se resolverán directamente con Betty.

El producto tendrá tres superficies:

1. **Landing pública** con hero, propuesta de valor, selección de tortas, proceso de encargo, historia/origen, contacto, redes y CTA a WhatsApp.
2. **Catálogo público completo** con todas las tortas publicadas y una URL estable por producto.
3. **CMS propio** para que un administrador autorizado cree, edite, ordene, publique y archive tortas, variantes e imágenes sin tocar código.

La arquitectura confirmada es monolítica. La línea base recomendada —todavía sujeta a los gates de [`09-REGISTRO-DECISIONES-GATE.md`](09-REGISTRO-DECISIONES-GATE.md)— es Nuxt/Nitro en TypeScript, PostgreSQL y un único artefacto de aplicación. Debe poder operar en una VPS de 1 vCPU y 1 GB de RAM; por eso se evitarán servicios pesados, builds en producción y procesos duplicados.

## 2. Contexto y problema

La reputación del negocio se construyó por recomendación. Hoy falta una vitrina propia y confiable que:

- explique por qué las tortas son diferentes;
- muestre sabores y datos útiles sin obligar a preguntar todo desde cero;
- convierta el interés en una conversación de WhatsApp contextualizada;
- mantenga la información del catálogo actualizada sin depender de un desarrollador;
- haga visible el origen en Pucura y el alcance hacia localidades cercanas.

El prototipo actual demuestra una dirección visual y SSR, pero muestra otra marca, datos falsos, productos ajenos al foco y un CMS sin funcionalidad ni protección. No se considera una implementación parcial segura.

## 3. Visión de producto

> Una vitrina digital sencilla y apetecible que transmite el oficio de Betty, ayuda a elegir una torta y hace que encargarla por WhatsApp sea natural.

### Trabajo principal de la landing

En menos de un minuto, una persona debe poder responder:

1. ¿Qué vende Donde Betty y dónde trabaja?
2. ¿Por qué debería confiar en sus tortas?
3. ¿Qué sabores hay y para cuántas personas sirven?
4. ¿Con cuánta anticipación debo encargar?
5. ¿Cómo converso con Betty para confirmar mi pedido?

### Resultado de negocio esperado

- Más conversaciones de WhatsApp con contexto suficiente para cotizar.
- Menos preguntas repetidas sobre sabores, porciones y anticipación.
- Mayor descubrimiento orgánico local.
- Capacidad de mantener el catálogo sin desplegar código.

## 4. Objetivos y métricas

### Objetivos del MVP

- Publicar una experiencia real de Donde Betty, sin datos de demostración.
- Mostrar entre 3 y 6 tortas destacadas en la landing y todas las publicadas en `/catalogo`.
- Proporcionar una ficha indexable y compartible por torta.
- Abrir WhatsApp con un mensaje contextual desde hero, catálogo y ficha.
- Permitir a un administrador mantener el catálogo de extremo a extremo.
- Desplegar de forma reproducible y recuperable en la infraestructura definida.

### Indicadores deseados

| Indicador | Definición | Uso |
|---|---|---|
| Intención de contacto | clics en CTA que abren WhatsApp | métrica primaria si se aprueba analítica |
| Conversión por torta | clics a WhatsApp desde una ficha / visitas a la ficha | priorización si se aprueba analítica |
| Catálogo útil | porcentaje de tortas publicadas con foto, porciones, precio o indicación explícita “consultar” | calidad editorial |
| Descubrimiento | visitas orgánicas a landing y fichas | SEO si existe fuente de medición aprobada |
| Frescura editorial | tiempo entre “Publicar” y visibilidad pública | operación del CMS |
| Disponibilidad | éxito de checks de readiness y HTTP público | confiabilidad técnica |

`G-ANALYTICS-01` decide si los indicadores de visita/clic se instrumentan en el MVP. Hasta resolverlo son objetivos, no compromisos medibles. Los clics a WhatsApp miden intención, no pedidos confirmados ni ventas. No se mostrará prueba social o métricas de clientes sin evidencia verificable.

## 5. Usuarios y roles

### Visitante

Persona de Pucura o localidades cercanas, normalmente madre, padre u organizador de una celebración familiar. Puede llegar desde Instagram, Google, un enlace compartido o recomendación. Busca confianza, sabor, precio razonable, facilidad y una respuesta clara sobre el encargo. La cobertura efectiva fuera de Pucura se confirma en `G-PROD-02` antes de publicarla.

No necesita una cuenta. Puede navegar, filtrar, compartir y abrir WhatsApp.

### Administrador

Propietaria o persona de confianza. Su objetivo no es “gestionar una base de datos”, sino mantener vigente lo que un cliente ve. Puede administrar catálogo e información operativa autorizada. El MVP tendrá un solo rol `admin`; no habrá permisos granulares ni registro público.

## 6. Alcance funcional

### 6.1 Sitio público

**RF-PUB-001 — Landing.** La ruta `/` debe incluir navegación, hero, propuesta de valor, tortas destacadas, proceso de encargo, historia/origen, cobertura/retiro, contacto, redes y CTA final.

**RF-PUB-002 — CTA principal.** El CTA principal debe ser “Encargar una torta” y abrir WhatsApp usando el número confirmado y un mensaje prellenado, sin afirmar que el pedido quedó reservado.

**RF-PUB-003 — Consistencia de WhatsApp.** Header, hero, tarjetas, fichas y contacto deben usar el mismo constructor de enlaces y el mismo número activo.

**RF-PUB-004 — Información operativa.** La web solo comunica una política de anticipación validada como vigente. El ADN aporta como línea base documental “al menos un día; mismo día sujeto a disponibilidad”, pendiente de confirmación en `G-PROD-02`.

**RF-PUB-005 — Contacto y redes.** Deben mostrarse únicamente canales confirmados. Un canal no configurado se omite; nunca se enlaza a la portada genérica de una red.

**RF-PUB-006 — Sin datos ficticios.** Teléfonos, direcciones, horarios, precios, ratings, testimonios, cantidades de clientes, ingredientes y certificaciones deben tener fuente confirmada.

### 6.2 Catálogo

**RF-CAT-001 — Selección resumida.** La landing muestra entre 3 y 6 tortas publicadas marcadas como destacadas, en el orden editorial del CMS.

**RF-CAT-002 — Catálogo completo.** `/catalogo` muestra todas las tortas con estado `published`, su portada, nombre, descripción breve, porciones/resumen de variantes y precio desde o “Consultar”.

**RF-CAT-003 — Ficha individual.** `/catalogo/[slug]` muestra descripción, galería, variantes, porciones, precio, personalización, anticipación, conservación/alérgenos cuando estén confirmados y CTA contextual a WhatsApp.

**RF-CAT-004 — Estados públicos.** Los borradores y archivados no aparecen en listados, sitemap, API pública ni acceso anónimo por slug.

**RF-CAT-005 — Slugs.** Cada torta publicada tiene slug único. Si cambia, la URL anterior redirige permanentemente a la nueva.

**RF-CAT-006 — Filtros.** Solo se mostrarán filtros que correspondan a atributos reales y tengan más de una opción útil. Su estado debe poder representarse en la URL.

**RF-CAT-007 — Disponibilidad honesta.** El sitio no debe usar “disponible hoy” ni stock en tiempo real si el CMS no mantiene ese dato. La regla base es “hecha a pedido”.

### 6.3 CMS

**RF-CMS-001 — Acceso privado.** `/admin/**` requiere sesión válida y rol `admin`. Ocultar el enlace en la navegación pública no sustituye la autorización de servidor.

**RF-CMS-002 — Lista editorial.** El administrador puede buscar y filtrar tortas por estado, ver fecha de actualización, destacado y alertas de contenido incompleto.

**RF-CMS-003 — Edición.** El administrador puede crear y editar nombre, slug, descripciones, variantes, porciones, precios CLP, personalización, anticipación, datos de seguridad alimentaria confirmados, SEO e imágenes.

**RF-CMS-004 — Ciclo de publicación.** Debe poder guardar borrador, previsualizar, publicar, despublicar y archivar. No se elimina directamente una torta que alguna vez estuvo publicada.

**RF-CMS-005 — Destacados y orden.** Debe poder marcar destacados y ordenar catálogo e imágenes sin editar números manualmente.

**RF-CMS-006 — Imágenes.** Debe poder subir portada y galería con texto alternativo obligatorio, validación y generación de derivados optimizados.

**RF-CMS-007 — Prevención de pérdida.** Formularios con cambios no guardados deben advertir antes de salir. Una edición basada en una versión antigua no puede sobrescribir silenciosamente otra más reciente.

**RF-CMS-008 — Auditoría.** Publicar, despublicar, archivar, cambiar slug, borrar imagen y modificar accesos debe dejar un evento de auditoría.

**RF-CMS-009 — Ajustes operativos condicionales.** Solo con `G-CMS-01.B`, el CMS mantiene WhatsApp, redes, correo público, retiro, zonas, horarios, anticipación y mensajes operativos según la matriz de `03-CATALOGO-CMS-Y-MODELO-DATOS.md`. Con A, esos valores quedan en configuración versionada. Marca, SEO global, secretos, credenciales e infraestructura nunca se editan desde el CMS MVP.

### 6.4 Autenticación y autorización

**RF-AUTH-001 — Sesión web.** El navegador usa una cookie de sesión `HttpOnly`, `Secure`, `SameSite=Lax` y host-only. No se almacenan tokens de autenticación en `localStorage` o `sessionStorage`.

**RF-AUTH-002 — Identidad cerrada.** No existe registro público. Solo identidades allowlisted y activas pueden obtener rol administrativo.

**RF-AUTH-003 — Cierre y revocación.** Cerrar sesión invalida la sesión en servidor. Desactivar un usuario o revocar sus sesiones debe tener efecto inmediato.

**RF-AUTH-004 — Protección de mutaciones.** Toda escritura valida sesión, rol, origen/CSRF, esquema de entrada y límites en el servidor.

**RF-AUTH-005 — Recuperación.** Debe existir un procedimiento operativo seguro para recuperar acceso sin crear una puerta trasera pública.

## 7. Arquitectura de información y rutas

| Ruta | Audiencia | Renderizado | Indexación | Propósito |
|---|---|---|---|---|
| `/` | pública | SSR | sí | presentar, generar confianza y convertir |
| `/catalogo` | pública | SSR | sí | explorar todas las tortas |
| `/catalogo/[slug]` | pública | SSR | sí si está publicada | informar y llevar a WhatsApp con contexto |
| `/contacto` | pública condicional | SSR/redirect | según `G-PROD-01` | página propia o redirección a la sección |
| `/admin/login` | admin | cliente/servidor | no | iniciar sesión |
| `/admin` | admin | cliente | no | estado editorial y accesos rápidos |
| `/admin/tortas` | admin | cliente | no | listar y mantener catálogo |
| `/admin/tortas/nueva` | admin | cliente | no | crear borrador |
| `/admin/tortas/[id]` | admin | cliente | no | editar, previsualizar y publicar |
| `/admin/tortas/[id]/preview` | admin | cliente/SSR privado | no | previsualizar el borrador autenticado |
| `/api/v1/catalogo/**` | pública | JSON | no como páginas | alimentar clientes controlados |
| `/api/v1/admin/**` | admin | JSON | no | operaciones del CMS |
| `/api/auth/**` | auth | servidor | no | login, callback, sesión y logout |
| `/health/live` | operación | texto/JSON | no | vida del proceso |
| `/health/ready` | operación | texto/JSON | no | capacidad de servir con DB |

La sección de contacto dentro de la landing es requisito. `G-PROD-01` decide si `/contacto` tendrá página propia o redirección estable a `/#contacto`; no se implementan ambas conductas como alternativas implícitas.

## 8. Requisitos no funcionales

### Rendimiento y recursos

- **RNF-PERF-001:** las páginas públicas deben cumplir en producción LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1 en el percentil 75 cuando haya datos suficientes.
- **RNF-PERF-002:** Lighthouse móvil de lanzamiento: Performance, Accessibility, Best Practices y SEO ≥90, sin usarlo como sustituto de pruebas reales.
- **RNF-PERF-003:** una única instancia Node; sin clustering, Redis, buscador externo ni observabilidad pesada en la VPS.
- **RNF-PERF-004:** el build se realiza fuera de la VPS. El servidor recibe un artefacto o imagen ya construida.
- **RNF-PERF-005:** imágenes públicas responsivas, dimensionadas, versionadas y en formatos modernos; transformación bajo demanda deshabilitada en la VPS pequeña.

### SEO

- **RNF-SEO-001:** HTML útil generado en servidor, canonical, title y description únicos.
- **RNF-SEO-002:** sitemap dinámico solo con rutas publicadas; admin y API excluidos.
- **RNF-SEO-003:** JSON-LD `Bakery`/`LocalBusiness` con datos confirmados y `Product` solo cuando los campos visibles lo soporten.
- **RNF-SEO-004:** no declarar compra online ni `Offer` engañosa si el cierre ocurre en WhatsApp.

### Accesibilidad

- **RNF-A11Y-001:** objetivo WCAG 2.2 nivel AA.
- **RNF-A11Y-002:** navegación completa con teclado, foco visible, skip link, landmarks y jerarquía de títulos.
- **RNF-A11Y-003:** controles táctiles de al menos 44 × 44 CSS px como estándar del proyecto.
- **RNF-A11Y-004:** reducción de movimiento respetada y ninguna información transmitida solo por color.

### Seguridad y privacidad

- **RNF-SEC-001:** TLS obligatorio; PostgreSQL no se expone públicamente.
- **RNF-SEC-002:** principio de mínimo privilegio para aplicación, base de datos, storage y CI.
- **RNF-SEC-003:** secretos fuera de Git, imágenes y logs; rotación documentada.
- **RNF-SEC-004:** uploads validados por firma y decodificación, re-encodeados y sin EXIF.
- **RNF-SEC-005:** logs nunca incluyen cookies, tokens, contraseñas ni texto completo de mensajes de WhatsApp.

### Operación

- **RNF-OPS-001:** despliegue reproducible con rollback de aplicación.
- **RNF-OPS-002:** cumplir la matriz RPO/RTO aceptada en `G-OPS-01`; la propuesta inicial es 24 horas/4 horas para DB e imágenes.
- **RNF-OPS-003:** backup offsite cifrado y restauración probada mensualmente.
- **RNF-OPS-004:** monitoreo ligero de disponibilidad, 5xx, latencia, memoria, OOM, disco, certificado y antigüedad del último backup.

## 9. Arquitectura objetivo resumida

```text
Navegador / buscador
        │ HTTPS
        ▼
      Caddy
        │
        ▼
 Nuxt 4 + Nitro (1 proceso)
 ├─ sitio SSR
 ├─ CMS
 ├─ API
 ├─ servicios de dominio
 └─ autenticación/sesiones
        │                    │
        ▼                    ▼
 PostgreSQL              storage (gate)
```

La línea base recomendada mantiene PostgreSQL y el almacenamiento de imágenes fuera de la VPS de 1 GB. `G-INFRA-01` y `G-STORAGE-01` deben confirmarlo o escoger el perfil económico local con los límites y backups de `07-DESPLIEGUE-OPERACION-Y-RECUPERACION.md`.

Supabase se permite únicamente en QA y solo como PostgreSQL/almacenamiento S3-compatible. El navegador nunca usa Supabase directamente; no se adoptan Auth, PostgREST, Realtime ni APIs propietarias.

## 10. Decisiones de autenticación

JWT y OAuth no son sustitutos directos: JWT es un formato de token; OAuth delega autorización y OpenID Connect aporta identidad. `G-AUTH-01` elige la fuente de identidad. La recomendación, aún no aprobada, es mantener la sesión como identificador opaco revocable en PostgreSQL en cualquiera de los dos caminos de identidad razonables.

Línea base propuesta:

- Better Auth integrado con Nuxt y Drizzle;
- Google OpenID Connect como proveedor principal;
- allowlist exacta de cuentas administradoras;
- sesión propia posterior al callback;
- MFA en la cuenta Google;
- contraseña + Argon2id + TOTP solo si se rechaza depender de un proveedor.

Se rechaza almacenar JWT bearer en `localStorage`/`sessionStorage`, habilitar registro público o desplegar un proveedor de identidad self-hosted en la VPS. Un JWT propio solo se reconsidera mediante ADR de amenazas que justifique su complejidad.

## 11. Inventario documental del catálogo

El ADN menciona doce sabores históricos o potenciales. `G-PROD-02` confirma cuáles siguen vigentes antes de crear los borradores iniciales:

1. Tres leches.
2. Selva negra.
3. Piña.
4. Durazno.
5. Mil hojas.
6. Moka.
7. Merengue frambuesa.
8. Panqueque naranja.
9. Pompadour.
10. Trufa.
11. Chocolate/frambuesa.
12. Frutos rojos.

La existencia del nombre no autoriza inventar descripción, precio, porciones, receta, alérgenos o imagen. Frutos rojos es candidata, no confirmada, a producto insignia.

## 12. Fuera del MVP

- Carrito, checkout, pagos online o cálculo automático de despacho.
- Confirmación automática de disponibilidad o fecha.
- Gestión de pedidos, clientes, inventario o recetas.
- Registro/autenticación de clientes.
- Marketplace, reseñas, puntuaciones o testimonios no verificados.
- Blog, newsletter, programa de fidelización o multilenguaje.
- App móvil, PWA offline o notificaciones push.
- Roles editoriales múltiples y aprobaciones complejas.
- Integración directa con Meta/WhatsApp Business API.
- Tema oscuro.
- Alta disponibilidad multiinstancia.

## 13. Etapas de entrega

### Etapa 0 — Cierre de decisiones y contenido

- validar `G-CONTENT-01` y activos;
- aceptar o cambiar las propuestas de DB, auth y storage;
- fijar alcance exacto del CMS;
- eliminar contradicciones documentales;
- preparar inventario inicial de tortas.

**Gate:** ninguna página real puede publicarse con placeholders.

### Etapa 1 — Fundación técnica

- migrar/alinear Nuxt 4 y estructura modular;
- PostgreSQL, Drizzle, migraciones y seeds;
- configuración tipada por entorno;
- CI con lint, typecheck, tests y build;
- base de autenticación y layout admin separado.
- servicio de publicación, auditoría y un importador controlado para cargar/publicar el contenido inicial sin esperar a la UI completa del CMS.
- ingestión mínima de portada, confirmación de derechos y derivados necesarios para que ese contenido sea realmente publicable.

**Gate:** build reproducible, migración limpia, autorización verificada en servidor y al menos tres tortas reales publicadas en QA —con portada/derivados y derechos confirmados— mediante el mismo servicio de dominio que usará el CMS.

### Etapa 2 — Landing y conversión

- identidad Donde Betty;
- hero, propuesta, destacados, proceso, historia, territorio, contacto y redes;
- constructor de WhatsApp;
- responsive y accesibilidad base.

**Gate:** una persona completa el flujo landing → WhatsApp con datos reales.

### Etapa 3 — Catálogo público

- catálogo completo, ficha por slug, filtros útiles;
- SEO dinámico, sitemap, redirects y estados;
- imágenes optimizadas.

**Gate:** solo contenido publicado es visible e indexable.

### Etapa 4 — CMS de catálogo

- login definitivo;
- CRUD, variantes, imágenes, orden, borrador/publicación y auditoría;
- ajustes operativos autorizados.

**Gate:** el propietario puede actualizar una torta sin intervención técnica y sin abrir una brecha de autorización.

### Etapa 5 — Calidad y seguridad

- pruebas E2E, accesibilidad, rendimiento, uploads y abuso;
- hardening de headers, sesiones, rate limiting y logs;
- revisión editorial completa.

**Gate:** matriz de lanzamiento aprobada.

### Etapa 6 — Despliegue y operación

- imagen/artefacto, Caddy, TLS, migraciones de release;
- observabilidad ligera, backups, restauración y rollback;
- ensayo de recuperación.

**Gate:** producción recuperable dentro de RPO/RTO.

## 14. Riesgos principales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Contenido operativo incompleto | impide publicar o induce a error | `G-CONTENT-01` con propietario y bloqueo de placeholders |
| VPS sin margen de memoria | OOM y caída | DB/storage externos preferidos, un proceso, límites y build externo |
| Auth elegida por familiaridad, no por modelo de amenaza | toma de CMS | sesión opaca, allowlist, MFA y ADR antes de implementar |
| Fotos pesadas o sin permiso | lentitud/riesgo legal | pipeline de upload, derivados y confirmación de derechos |
| Supabase se filtra a producción | lock-in o incumplimiento del brief | repositorios server-side y pruebas contra PostgreSQL estándar |
| Precio/porciones quedan ambiguos | baja conversión | variante estructurada o decisión explícita “consultar” |
| Cambios de slug rompen enlaces | pérdida SEO | tabla de redirects y redirección 301 |
| Backup no restaurable | pérdida de catálogo/acceso | prueba mensual y backup offsite |

## 15. Datos de publicación pendientes (`G-CONTENT-01`)

Antes de publicar deben resolverse:

- WhatsApp real en formato internacional y texto inicial preferido.
- Instagram y otras redes realmente activas.
- Dirección pública o modalidad de retiro coordinado.
- Horarios de atención y retiro.
- Zonas, costo, condiciones y responsable de despacho.
- Precios CLP, tamaños, porciones y personalizaciones por torta.
- Ingredientes relevantes, alérgenos/trazas y conservación.
- Anticipación, abono, pago, cambios, cancelaciones y urgencias.
- Logo, fotografías reales y permisos de uso.
- Tortas destacadas y producto insignia.
- Dominio final y correo operativo.
- Cuenta(s) administradora(s), método de login, infraestructura y alcance del CMS se deciden por separado en [`09-REGISTRO-DECISIONES-GATE.md`](09-REGISTRO-DECISIONES-GATE.md).

## 16. Definición global de terminado

El MVP está terminado cuando:

1. todo requisito MVP tiene prueba o evidencia verificable;
2. no quedan datos ficticios visibles ni secretos en el repositorio;
3. landing, catálogo, ficha, contacto, login y edición funcionan en móvil y escritorio;
4. el servidor impide leer borradores y mutar sin autorización;
5. SEO técnico, accesibilidad y presupuestos de rendimiento cumplen sus gates;
6. las migraciones se ejecutan desde cero y sobre una versión anterior respaldada;
7. producción tiene TLS, health checks, logs rotados, alertas y backups offsite;
8. se completó con éxito una restauración de prueba;
9. el propietario validó identidad, textos, catálogo, contacto y flujo de WhatsApp.
