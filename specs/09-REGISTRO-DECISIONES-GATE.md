# Registro de decisiones gate

Última revisión: 2026-09-01  
Estado: `auditoría cruzada completada · decisiones del propietario pendientes`

Este documento evita que una recomendación técnica se convierta en decisión por omisión. Todo gate requiere una respuesta explícita y luego un ADR breve con fecha, responsable, alternativa elegida y consecuencias.

## 1. Regla de decisión

- `PENDIENTE_PROPIETARIO`: no se implementa el bloque dependiente.
- `RECOMENDADO`: alternativa sugerida, todavía no aprobada.
- `DECIDIDO`: respuesta explícita registrada con fecha.
- `REVISAR`: decisión tomada que debe reevaluarse ante una condición concreta.

El silencio no acepta una propuesta. Si un gate no está resuelto, solo puede avanzarse en trabajo que no dependa de él.

## 2. Orden recomendado

1. Identidad, sesión y recuperación del CMS.
2. Número de administradores y alta/baja de cuentas.
3. PostgreSQL de producción y responsable operativo.
4. Almacenamiento de imágenes.
5. Alcance editable del CMS.
6. Producto/contenido público.
7. Analítica y privacidad.
8. Objetivos de recuperación y disponibilidad.

## 3. G-AUTH-01 — Fuente de identidad del CMS

Estado: `PENDIENTE_PROPIETARIO`  
Bloquea: autenticación, administración y recuperación de acceso.

### Alternativa A — Google OpenID Connect + sesión opaca

**Recomendada**, si la cuenta pertenece al negocio y tiene recuperación y verificación en dos pasos bajo control.

Ventajas:

- la aplicación no almacena contraseñas;
- Google aporta login, detección de riesgo, recuperación y factores resistentes al phishing si se usa passkey/llave;
- menos código crítico y menor consumo en la VPS;
- la sesión local en PostgreSQL puede revocarse inmediatamente.

Costos/riesgos:

- Google es necesario para iniciar sesiones nuevas;
- un bloqueo o caída del proveedor puede impedir entrar hasta recuperar acceso;
- exige proyecto OAuth, dominio/callback, pantalla de consentimiento y propiedad operativa clara;
- usar OIDC no garantiza por sí solo que Google haya exigido MFA en ese login;
- los términos y costos pueden cambiar.

Costo: Better Auth self-hosted usa licencia MIT. Para el flujo OIDC directo no se asume una garantía contractual de gratuidad perpetua; se registra como “sin costo de licencia observado para este uso, sujeto a términos vigentes”. No se necesita Google Identity Platform.

Condiciones mínimas:

- proyecto Google Auth propiedad del negocio, no únicamente del desarrollador;
- scopes `openid email`, sin acceso offline ni APIs Google;
- signup público y linking implícito deshabilitados;
- primera asociación por email verificado preaprobado; desde entonces autorización por `issuer + sub` y usuario local activo;
- sesión opaca PostgreSQL sin cookie cache;
- cuenta con 2SV; passkey o llave recomendada;
- runbook para sustituir la identidad y revocar sesiones.

### Alternativa B — Email/contraseña local + TOTP + sesión opaca

Ventajas:

- independencia de Google para iniciar sesión;
- control local completo;
- funciona mientras aplicación y PostgreSQL estén disponibles.

Costos/riesgos:

- el proyecto asume hashing, rate limiting, TOTP, códigos de recuperación y respuesta a incidentes;
- Argon2id consume memoria y debe limitarse/medirse;
- TOTP sigue siendo susceptible a phishing en tiempo real;
- un reset cómodo por email introduce otro proveedor; sin email, la recuperación depende de un operador con SSH/CI.

Condiciones mínimas:

- Argon2id configurado explícitamente; no depender del hash por defecto de la librería;
- TOTP obligatorio y códigos de recuperación de un solo uso;
- registro público deshabilitado;
- alta/reset mediante procedimiento seguro y ensayado;
- misma sesión opaca PostgreSQL.

### Alternativa C — JWT propio

No recomendada para este CMS.

JWT no resuelve la identidad: todavía habría que elegir Google o contraseña. Como sesión completamente stateless dificulta la revocación inmediata. Añadir denylist, refresh tokens rotatorios o una consulta a DB elimina la simplicidad buscada y agrega gestión de claves, algoritmos, `iss`, `aud`, `exp` y replay. Con una sola instancia y PostgreSQL disponible no aporta una ventaja material.

Si se exigiera, nunca se almacenaría en `localStorage`; requeriría cookies seguras, access token corto, refresh token rotatorio persistido, revocación y un ADR de amenazas específico.

### Decisión requerida

Elegir A, B o solicitar una justificación nueva para C. También confirmar si se acepta que no exista simultáneamente una contraseña web “de respaldo” cuando Google sea el método principal.

## 4. G-AUTH-02 — Administradores, bootstrap y recuperación

Estado: `PENDIENTE_PROPIETARIO`

Decidir:

- una sola administradora o varias cuentas individuales;
- quién controla el proyecto Google/códigos de recuperación;
- quién tendrá acceso SSH/CI de emergencia;
- alta de nuevas administradoras por procedimiento manual o invitación desde CMS;
- tiempo operativo aceptable para recuperar el acceso.

Recomendación: cuentas individuales, ningún usuario compartido, alta manual en MVP y al menos dos responsables del procedimiento de emergencia aunque solo una persona edite contenido.

## 5. G-AUTH-03 — Política de sesión y MFA

Estado: `PENDIENTE_PROPIETARIO`

### Expiración

- **A. TTL fijo 8–12 h:** simple y predecible; puede dejar una sesión ociosa abierta hasta vencer.
- **B. TTL deslizante 60 min:** cómoda durante uso activo; sin máximo adicional puede prolongarse indefinidamente.
- **C. Inactividad 60 min + máximo absoluto 12 h:** mejor equilibrio, pero requiere seguimiento/validación adicional porque Better Auth no ofrece ambos límites únicamente con `expiresIn/updateAge`.

Recomendación: C para el CMS; requiere tests explícitos.

### MFA con Google

- **Operativo:** la cuenta debe tener 2SV y se audita antes de lanzamiento/periódicamente. Más simple; el monolito no prueba cada login.
- **Verificado por login:** la aplicación solicita/preserva `amr` y exige evidencia aceptada. Más fuerte, pero requiere comprobar soporte, callbacks y recuperación.
- **Segundo paso local para acciones sensibles:** mayor independencia, pero duplica alta y recuperación.

Recomendación MVP: requisito operativo con passkey/llave y sesión reciente (`freshAge`) para cambiar WhatsApp o administradores. La verificación técnica de `amr` queda como hardening posterior salvo que el propietario la exija.

## 6. G-TECH-01 — Framework objetivo

Estado: `PENDIENTE_PROPIETARIO`  
Recomendación: Nuxt 4 + Nitro + TypeScript.

Razones: el prototipo ya es Nuxt/Vue, Nuxt 3 terminó soporte el 2026-07-31 y migrar ahora es menos costoso que después del CMS. Cambiar a otro framework JavaScript/TypeScript reinicia parte del prototipo sin una ventaja demostrada para este alcance.

Alternativa: mantener temporalmente Nuxt 3. Reduce cambio inmediato, pero acepta una base fuera de soporte y una migración posterior más cara. No recomendada para producción nueva.

Decisión requerida: aceptar Nuxt 4 + Nitro + TypeScript o solicitar otra alternativa SSR JavaScript/TypeScript mediante un ADR que compare migración, SEO, consumo y mantenimiento. Mantener Nuxt 3 no es una opción productiva de largo plazo.

## 7. G-DATA-01 — Persistencia y acceso a datos

Estado: `PENDIENTE_PROPIETARIO`  
Recomendación: PostgreSQL + Drizzle ORM + node-postgres.

Ventajas: misma tecnología relacional en local/QA/producción, migraciones portables, sesiones revocables y mejor soporte de concurrencia que el SQLite nominal del prototipo. Drizzle conserva SQL/migraciones explícitas y encaja con TypeScript/Better Auth.

Alternativas:

- SQLite: menor consumo y operación local, pero diverge de Supabase QA/PostgreSQL, complica pruebas equivalentes y el crecimiento de sesiones/edición concurrente.
- Otro ORM o driver: requiere ADR con compatibilidad Nuxt/Nitro, Better Auth, migraciones, consumo y portabilidad.

Decisión requerida: aceptar PostgreSQL + Drizzle o pedir una comparación de otra pareja concreta. Esta decisión es distinta de `G-INFRA-01`, que decide dónde corre PostgreSQL.

## 8. G-INFRA-01 — PostgreSQL de producción

Estado: `PENDIENTE_PROPIETARIO`

### A. PostgreSQL administrado externo

Recomendado para una VPS de 1 GB. Libera RAM, simplifica backup/PITR y reduce competencia con Node. Implica costo recurrente, dependencia de proveedor y conexión remota.

### B. PostgreSQL local en Docker/host

Menor costo externo y mayor control. Comparte 1 GB con Node/Caddy, exige tuning, backup offsite, pruebas de OOM y mayor responsabilidad operativa.

Supabase continúa reservado solo para QA y no es alternativa productiva según el brief actual.

Decidir presupuesto mensual, proveedor/responsable y si se acepta aumentar la VPS cuando el perfil local no conserve margen.

## 9. G-STORAGE-01 — Imágenes de producción

Estado: `PENDIENTE_PROPIETARIO`

- **A. S3-compatible externo:** recomendado; mejor entrega, persistencia y escalabilidad. Tiene costo/dependencia y requiere backup/versionado.
- **B. Volumen local:** simple al inicio, pero consume disco/ancho de banda y obliga a backup separado; complica reemplazar la VPS.

El pipeline y modelo de derivados son iguales para ambos mediante un adaptador. Debe definirse además si los originales se conservan privados o se eliminan tras generar derivados.

## 10. G-CMS-01 — Alcance editable

Estado: `PENDIENTE_PROPIETARIO`

- **A. Solo catálogo:** tortas, variantes, imágenes, publicación y SEO por torta. Menor riesgo y superficie.
- **B. Catálogo + ajustes operativos:** además WhatsApp, redes, horarios, cobertura, anticipación y mensajes. Más autonomía; cambiar WhatsApp/cobertura requiere sesión reciente, validación y auditoría reforzada.

Recomendación: B si la propietaria realmente modificará esos datos; de lo contrario A y configuración versionada por desarrollo.

## 11. G-PROD-01 — Página de contacto

Estado: `PENDIENTE_PROPIETARIO`

- **A. Sección en landing solamente:** menos contenido duplicado y navegación más simple.
- **B. Sección + `/contacto`:** URL compartible y mejor espacio para cobertura/retiro, pero requiere contenido suficiente y mantenimiento consistente.

Recomendación inicial: A; crear B solo cuando existan horarios, cobertura y modalidad de retiro confirmados.

## 12. G-PROD-02 — Política comercial vigente

Estado: `PENDIENTE_PROPIETARIO`

Confirmar explícitamente:

- si sigue vigente “al menos 1 día; mismo día sujeto a disponibilidad”;
- si la política de mismo día es global o depende de cada torta;
- zonas atendidas hoy versus objetivo futuro entre Pucura, Lican Ray, Coñaripe y Villarrica;
- cuáles de las doce tortas del ADN se venden actualmente;
- si porciones y precio pueden quedar “a consultar”;
- si una torta puede mezclar variantes con precio visible y otras a consultar;
- domicilio público o retiro coordinado sin publicar dirección.

El modelo soportará herencia y variantes mixtas, pero la interfaz no mostrará opciones que el negocio no use.

## 13. G-ANALYTICS-01 — Medición y privacidad

Estado: `PENDIENTE_PROPIETARIO`

- **A. Sin analítica en MVP:** menor peso y privacidad; los indicadores de clic/visita quedan como objetivos futuros no medibles.
- **B. First-party mínima:** registrar eventos agregados de CTA en el servidor, con retención y aviso definidos. Más control; requiere diseñar abuso, bots y privacidad.
- **C. Proveedor externo privacy-friendly:** instalación rápida y mejor reporteo; agrega tercero, posibles cookies/costo y revisión legal/técnica.

No se implementan eventos ni banners hasta decidir. Nunca se interpreta un clic como venta confirmada.

## 14. G-OPS-01 — Recuperación, disponibilidad y retención

Estado: `PENDIENTE_PROPIETARIO`

Propuesta actual:

- DB: RPO 24 h, RTO 4 h;
- imágenes: RPO 24 h, RTO 4 h si son esenciales para operación;
- configuración/secretos: recuperación ≤4 h desde copia segura;
- disponibilidad mensual propuesta: 99,5 %, excluyendo mantenimiento anunciado.

Retenciones propuestas:

- auditoría editorial y de acciones sensibles: 12 meses;
- logs técnicos/seguridad: 14 días con rotación;
- sesiones expiradas: purga dentro de 7 días;
- backups: 7 diarios, 4 semanales y 6 mensuales.

Confirmar si la pérdida potencial de hasta 24 h de cambios, una recuperación de hasta 4 h, disponibilidad y retenciones propuestas son aceptables. Un objetivo menor exige más frecuencia, PITR y normalmente mayor costo.

## 15. G-CONTENT-01 — Datos de publicación

Estado: `PENDIENTE_PROPIETARIO`

Bloquea lanzamiento, aunque no todo el desarrollo:

- WhatsApp E.164;
- redes reales;
- horarios y modalidad de retiro;
- cobertura/costos de despacho;
- precios, porciones, personalización y políticas;
- ingredientes relevantes, alérgenos/trazas y conservación;
- logo, fotografías y confirmación de derechos/consentimiento;
- dominio y cuentas administradoras.

## 16. Decisiones técnicas ya corregidas por auditoría

No requieren decisión comercial:

- no se aceptan propuestas por silencio;
- los slugs actuales e históricos comparten un namespace único;
- porciones/precios usan estados estructurados, nunca ceros o números ficticios;
- los derivados de imagen tienen manifiesto relacional y formatos definidos;
- el MVP no cachea HTML/datos públicos en aplicación; el siguiente request ve el commit;
- una restauración purga sesiones antes de exponer el servicio;
- preview tiene ruta autenticada y no pública;
- operaciones reintentables usan idempotencia explícita;
- readiness técnico no depende de que WhatsApp/contenido estén completos.

## 17. Fuentes de la decisión de autenticación

- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Google — OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Better Auth — Nuxt integration](https://better-auth.com/docs/integrations/nuxt)
- [Better Auth — Session management](https://better-auth.com/docs/concepts/session-management)
- [Better Auth — Users and accounts](https://better-auth.com/docs/concepts/users-accounts)
- [Better Auth — Security](https://better-auth.com/docs/reference/security)
- [Better Auth — Pricing](https://better-auth.com/pricing)
