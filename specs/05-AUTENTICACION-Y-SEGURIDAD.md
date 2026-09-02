# Autenticación y seguridad del CMS

Última revisión: 2026-09-01  
Estado: `auditada · G-AUTH-01/02/03 pendientes`

## 1. Modelo de amenaza resumido

Activos:

- capacidad de cambiar lo publicado y los enlaces de contacto;
- catálogo, imágenes y metadatos;
- cuentas/sesiones administrativas;
- credenciales de DB, OIDC y storage;
- disponibilidad de la web y backups.

Amenazas prioritarias:

- toma de cuenta por phishing o contraseña reutilizada;
- sesión robada o fijada;
- bypass de autorización llamando la API directamente;
- CSRF en una sesión activa;
- abuso del login y uploads;
- archivo malicioso o agotamiento de memoria;
- inyección/XSS mediante descripciones;
- secretos expuestos en Git/logs/cliente;
- cambio fraudulento del número de WhatsApp;
- DB o panel expuestos a Internet;
- pérdida de datos sin restauración.

El CMS pequeño no requiere infraestructura de identidad pesada, pero sí controles completos en servidor.

## 2. Aclaración: JWT, OAuth y OIDC

- **JWT** es un formato de token. No define por sí solo login, almacenamiento seguro o revocación.
- **OAuth 2.0** delega autorización a recursos.
- **OpenID Connect (OIDC)** agrega identidad/login sobre OAuth.
- Tras un login OIDC, el monolito todavía necesita su propia sesión.

Por tanto, la decisión correcta no es “JWT u OAuth”, sino:

1. cómo se verifica la identidad;
2. cómo mantiene la aplicación una sesión;
3. cómo autoriza cada operación.

## 3. Decisión recomendada

### Identidad

Google OIDC mediante Authorization Code Flow, usando Better Auth y una lista cerrada de cuentas, es la recomendación de `G-AUTH-01`. Solo es apropiado si la propietaria mantiene una cuenta Google estable, recuperación controlada y 2SV. No se considera elegido hasta registrarlo.

Requisitos:

- scopes mínimos `openid email`; `profile` solo si la UI usa nombre/foto;
- `state`, `nonce` y PKCE gestionados por una librería probada;
- callback exacto por entorno;
- no pedir acceso offline ni APIs de Google;
- validar issuer, audience, expiración y firma del ID token;
- bootstrap inicial por email verificado preaprobado y asociación posterior por `issuer + sub` inmutable;
- `user.validateUserInfo`/hook equivalente antes de emitir sesión, usuario local activo y rol propiedad del servidor;
- registro abierto deshabilitado;
- linking implícito por email deshabilitado salvo ADR específico;
- tokens OAuth persistidos cifrados y sin refresh token/acceso offline;
- 2SV activada como requisito operativo o `amr` validado por login, según `G-AUTH-03`; OIDC por sí solo no garantiza MFA;
- revisar términos/costos vigentes del proveedor antes de producción; no asumir gratuidad perpetua.

### Sesión

Better Auth con sesión opaca persistida en PostgreSQL y cookie:

- `HttpOnly`;
- `Secure` en todos los entornos HTTPS;
- `SameSite=Lax` para callback OIDC;
- host-only, sin atributo `Domain`;
- cookie `Path=/`, necesario para `/admin`, `/api/v1/admin` y `/api/auth`; host-only limita el dominio;
- identificador aleatorio, sin datos sensibles en el cliente;
- política de expiración elegida en `G-AUTH-03`: fija, deslizante o inactividad + máximo absoluto;
- rotación al autenticar y al cambiar privilegio;
- revocación inmediata en logout/desactivación;
- cookie cache de Better Auth deshabilitado inicialmente para preservar revocación inmediata.

Better Auth no expresa simultáneamente inactividad 60 min y máximo absoluto 12 h solo con `expiresIn/updateAge`; si se elige ambos, un guard de servidor mantiene `createdAt/lastSeen` y tests de expiración. Aumentar comodidad no puede convertir la sesión en indefinida.

### Autorización

- rol único `admin` en MVP;
- cada endpoint administrativo verifica sesión activa y rol;
- los guards/middleware de página solo mejoran navegación, no son barrera;
- identidad no allowlisted recibe 403 y no se crea como admin;
- un nuevo admin se habilita mediante procedimiento autenticado/operativo y queda auditado.

## 4. Alternativa local

Si se rechaza Google OIDC, se usa email/contraseña con:

- registro público deshabilitado;
- admin creado por comando de bootstrap ejecutado en entorno seguro;
- reemplazar explícitamente el hash por defecto de Better Auth por Argon2id mínimo `m=19 MiB`, `t=2`, `p=1`, revisado según hardware;
- contraseña larga y comprobación contra políticas razonables, sin reglas arbitrarias de composición;
- TOTP obligatorio y códigos de recuperación de un solo uso;
- secretos TOTP cifrados en reposo;
- rate limit, backoff y bloqueo temporal;
- recuperación mediante proceso operativo verificado, no preguntas de seguridad;
- misma sesión opaca posterior al login.

La transformación de Argon2 se limita en concurrencia para no agotar 1 GB. Nunca se envía ni registra la contraseña.

## 5. Opciones rechazadas

- JWT bearer guardado en `localStorage` o `sessionStorage`.
- JWT de larga duración sin revocación.
- registro público seguido de “ocultar” admin.
- confiar en email sin validar `sub`/issuer del proveedor.
- Basic Auth como protección definitiva del CMS.
- compartir una sola contraseña sin identidad/auditoría.
- Keycloak, Authentik u otro IdP self-hosted en esta VPS.
- Supabase Auth, porque Supabase está limitado a QA y crearía acoplamiento.

## 6. Flujo OIDC

```text
Admin → /admin/login
      → servidor inicia OIDC (state/nonce/PKCE)
      → Google autentica; el control 2SV/MFA depende de G-AUTH-03
      → callback server valida respuesta
      → verifica allowlist/usuario activo
      → crea/rota sesión opaca en PostgreSQL
      → set-cookie segura
      → /admin
```

Si falla allowlist, el sistema no revela qué emails son válidos. El error ofrece volver al sitio o reintentar, sin crear cuenta.

El primer acceso, reemplazo y baja de identidad se definen en `G-AUTH-02`: preaprobar email, validar callback, guardar `issuer + sub`, asignar `admin` solo en servidor y revocar sesiones al reemplazar. Nunca se deriva el rol de claims enviados por cliente.

## 7. CSRF, CORS y origen

- SameSite ayuda, pero las mutaciones también validan `Origin`/`Host` y el mecanismo CSRF recomendado por la librería.
- Solo orígenes exactos configurados; nunca `*` con credenciales.
- Métodos GET/HEAD no mutan estado.
- JSON/content types inesperados se rechazan.
- callbacks OIDC usan allowlist exacta, sin redirect arbitrario.
- enlaces externos usan `rel="noopener noreferrer"` cuando corresponda.

## 8. XSS y contenido editorial

- descripciones usan Markdown restringido o estructura tipada; no HTML libre;
- render server/client con escape por defecto;
- si se permite Markdown, sanitizar con allowlist tras convertir;
- no permitir scripts, iframes, styles, event handlers o URLs `javascript:`;
- CSP inicialmente estricta y ajustada por necesidad observada;
- nunca interpolar contenido CMS dentro de JSON-LD sin serialización segura.

## 9. Uploads

Además del pipeline funcional:

- auth y autorización antes de leer/procesar el cuerpo completo cuando el stack lo permita;
- límites en Caddy y aplicación;
- JPEG/PNG/WebP únicamente; SVG rechazado;
- validar magic bytes y decodificar;
- limitar dimensiones/píxeles para evitar decompression bombs;
- re-encodear y quitar metadatos;
- nombre UUID, no ruta del usuario;
- derivados públicos, originales privados o eliminados por política;
- object storage con credencial limitada al bucket/prefijo;
- no servir uploads desde el mismo origen con tipos ejecutables;
- rate limit y concurrencia 1 para procesamiento.

## 10. Rate limiting

Línea base por IP + identificador de cuenta cuando exista:

| Superficie | Política inicial |
|---|---|
| inicio/callback fallido | 5 intentos por 15 min, backoff; ajustar sin bloquear el callback legítimo |
| password login alternativo | 5 por 15 min por IP/cuenta, respuesta uniforme |
| uploads | 10 por hora por admin y una transformación concurrente |
| mutaciones CMS | 120 por minuto por admin, además de idempotencia/concurrencia |
| API pública | 120 por minuto por IP, ajustable tras observar tráfico legítimo |

Sin Redis, el rate limit local sirve en una sola instancia. Los límites son valores de partida y se prueban para no bloquear el flujo normal. Better Auth/Caddy solo confían en la IP que entrega un proxy explícitamente configurado; Caddy sobrescribe los headers reenviados y la app no confía ciegamente en `X-Forwarded-For` del cliente.

## 11. Headers y transporte

- HTTP redirige a HTTPS.
- HSTS después de validar dominio y subdominios.
- CSP con `default-src 'self'` y orígenes mínimos para imágenes/auth.
- CSP `frame-ancestors 'none'`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin` o más estricta según medición.
- `Permissions-Policy` para deshabilitar capacidades no usadas.
- admin y auth: `Cache-Control: no-store`.
- cookies sin ámbito de subdominio.

La CSP se prueba contra Nuxt, OIDC, storage e imágenes; no se resuelve con `unsafe-eval` en producción.

## 12. Secretos y privilegios

- secretos en variables/secret store del host o CI, nunca Git;
- `.env` ignorado y `.env.example` sin valores;
- separar credencial runtime de migración si es posible;
- usuario DB sin superuser, create role o create db;
- credencial S3 limitada al bucket/prefix y operaciones necesarias;
- secretos distintos por local, QA y producción;
- rotar OIDC, session secret, DB y storage con runbook;
- no imprimir configuración completa al iniciar.

## 13. Cambio de WhatsApp y acciones sensibles

Cambiar el número puede desviar todos los clientes. Debe:

- requerir sesión reciente mediante `freshAge`/validación equivalente; umbral propuesto 15 minutos, sujeto a `G-AUTH-03`;
- mostrar número anterior y nuevo normalizados;
- exigir confirmación explícita;
- registrar auditoría;
- el siguiente request público lee el valor comprometido; no existe caché dinámica en el MVP;
- una notificación operativa queda fuera del MVP y solo se añade mediante un canal confiable definido.

Agregar/desactivar admins, regenerar códigos de recuperación y rotar credenciales también son acciones sensibles.

## 14. Logs, privacidad y retención

- logs de auth registran resultado y clase de error, nunca token/cookie/código OIDC;
- query params sensibles se redactan;
- IDs internos pueden usarse para auditoría;
- IP completa solo si existe propósito, base legal y retención definida; por defecto, no persistirla en auditoría de negocio;
- auditoría editorial: 12 meses si `G-OPS-01` acepta la retención propuesta;
- sesiones expiradas: purga dentro de 7 días si `G-OPS-01` acepta la retención propuesta;
- cuentas desactivadas no se borran si romperían auditoría, pero se minimizan datos.

## 15. Recuperación de acceso

### OIDC

1. Recuperar la cuenta Google mediante el proveedor y sus factores.
2. Si cambia la identidad autorizada, ejecutar comando de administración desde VPS/CI con acceso controlado.
3. Revocar sesiones anteriores.
4. Registrar actor, motivo y resultado fuera de la interfaz pública.

### Password alternativo

Usar código de recuperación TOTP o comando seguro de reset. No enviar contraseñas temporales por canales inseguros ni crear endpoint público de “primer admin”.

El procedimiento se ensaya antes del lanzamiento.

## 16. Checklist de pruebas de seguridad

- anónimo recibe 401 en cada mutación;
- usuario autenticado no allowlisted recibe 403;
- borrador no sale por API ni caché pública;
- logout y revocación invalidan en servidor;
- cookie cumple flags y no es legible desde JS;
- CSRF/origen incorrecto es rechazado;
- redirect OIDC externo no autorizado falla;
- brute force alcanza 429 sin revelar existencia de cuenta;
- HTML/script en descripciones se neutraliza;
- SVG, MIME falso, archivo sobredimensionado y bomba de píxeles se rechazan;
- conflictos de versión no sobrescriben;
- secrets y tokens se redactan de logs;
- DB y puertos internos no son accesibles desde Internet;
- dependencies y contenedor se escanean antes de release;
- el runbook de restore purga todas las sesiones antes de exponer el servicio y una cookie previa recibe 401.

## 17. Criterio para aceptar la decisión

En `G-AUTH-01` el propietario debe elegir una de dos fuentes de identidad razonables:

1. **Recomendada:** Google OIDC + control 2SV definido + allowlist + sesión opaca.
2. **Independiente:** email/contraseña + Argon2id + TOTP + sesión opaca.

En ambos casos se recomienda sesión opaca y se rechaza JWT en almacenamiento del navegador. JWT propio no es una tercera fuente de identidad y requiere un ADR adicional. Si la cuenta Google no puede mantener 2SV o su recuperación no está controlada por la propietaria, se elige la alternativa local.

## 18. Fuentes autoritativas

- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP — File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP — HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [Google — OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Better Auth — Nuxt integration](https://better-auth.com/docs/integrations/nuxt)
- [Better Auth — Drizzle adapter](https://better-auth.com/docs/adapters/drizzle)
- [Better Auth — Security](https://better-auth.com/docs/reference/security)
- [Better Auth — Session management](https://better-auth.com/docs/concepts/session-management)
- [Better Auth — Users and accounts](https://better-auth.com/docs/concepts/users-accounts)
- [Better Auth — Two-factor authentication](https://better-auth.com/docs/plugins/2fa)
- [Better Auth — Rate limiting](https://better-auth.com/docs/concepts/rate-limit)
