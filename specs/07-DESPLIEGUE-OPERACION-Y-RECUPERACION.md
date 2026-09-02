# Despliegue, operación y recuperación

Última revisión: 2026-09-01  
Estado: `auditada · G-INFRA-01/G-STORAGE-01/G-OPS-01 pendientes`

## 1. Restricción de infraestructura

Producción debe operar en una VPS Linux de **1 vCPU y 1 GB de RAM**. Esta restricción obliga a:

- un solo proceso Nitro;
- build fuera del servidor;
- nada de cluster PM2, Redis, pgAdmin, MinIO, Prometheus o IdP self-hosted;
- pool y concurrencia pequeños;
- límites de contenedor;
- logs rotados;
- almacenamiento y base externos preferidos.

Swap puede evitar un OOM abrupto, pero no se trata como RAM ni justifica sobrecarga sostenida.

## 2. Perfil A — Producción recomendada (`G-INFRA-01.A`)

```text
Internet
   │ 80/443
   ▼
Caddy (VPS)
   │ red privada
   ▼
Nuxt/Nitro :3000 (VPS, 1 instancia)
   ├──────── TLS ───────► PostgreSQL administrado
   └──────── HTTPS ─────► storage según G-STORAGE-01
```

Ventajas:

- PostgreSQL no compite por RAM con SSR/uploads;
- backups/PITR pueden delegarse al proveedor;
- imágenes no consumen disco ni ancho de banda principal;
- la VPS mantiene margen para TLS, Node y sistema.

Condiciones:

- proveedor PostgreSQL no puede ser Supabase en producción según el brief;
- conexión TLS y red/firewall restringidos;
- verificar región, costo, límites, exportación y backup;
- si se elige storage externo, interfaz S3 para portabilidad.

## 3. Perfil B — Producción económica autocontenida (`G-INFRA-01.B`)

```text
Internet → Caddy → Nuxt
                    │ red Docker privada
                    ▼
                PostgreSQL
```

Viable solo con tráfico pequeño y disciplina operativa:

- PostgreSQL sin puerto publicado;
- `shared_buffers=64–96MB`;
- `max_connections=20`;
- pool de aplicación `max=5`;
- `work_mem=2MB`;
- `maintenance_work_mem=32MB`;
- paralelismo de query deshabilitado/limitado para 1 CPU;
- Node heap inicial 256–320 MiB;
- límites de memoria/CPU por contenedor;
- volumen DB persistente y backup offsite;
- imágenes según `G-STORAGE-01`; si son locales, volumen y backup separados;
- prueba de carga y OOM obligatoria.

Estos valores son punto de partida, no configuración universal. Se ajustan con métricas. Si el host no conserva ≥20 % de margen normal, se migra DB/storage fuera o se aumenta la VPS.

## 4. Contenedores y monolito

Docker Compose puede orquestar Caddy y el único contenedor de aplicación; en perfil B agrega PostgreSQL. Sigue siendo un monolito porque existe una sola aplicación/artefacto y no servicios de negocio independientes.

Requisitos de imagen:

- multi-stage build en CI;
- runtime mínimo con versión Node LTS soportada y fijada;
- usuario non-root;
- `.output` y dependencias de runtime solamente;
- tag inmutable por commit y, si es posible, digest;
- nunca `latest` como referencia de rollback;
- filesystem read-only cuando sea viable;
- `tmpfs`/directorio limitado para temporales;
- healthcheck sin herramientas pesadas.

## 5. Caddy y red

- Caddy termina TLS y redirige HTTP a HTTPS;
- solo puertos 22, 80 y 443 públicos;
- SSH solo por clave; root y contraseña deshabilitados;
- aplicación y DB viven en red privada;
- body máximo de upload coordinado con la app;
- timeouts razonables;
- headers de seguridad sin duplicación/conflicto;
- compresión moderna cuando se pruebe compatibilidad;
- certificado y renovación monitorizados.

PostgreSQL jamás escucha en interfaz pública. El firewall no sustituye auth de DB, pero añade defensa.

## 6. Pipeline de entrega

```text
commit/tag
  → CI: lint + typecheck + tests + build
  → construir imagen
  → escanear/publicar imagen inmutable
  → backup si hay migración
  → ejecutar migración controlada
  → desplegar una instancia
  → readiness + smoke
  → promover o rollback
```

La VPS no ejecuta `npm install` ni `nuxt build` para un release normal.

### Migraciones

- expand/contract cuando un cambio no sea compatible;
- comando separado, con lock para evitar doble ejecución;
- backup antes de migración destructiva;
- timeout y log de versión;
- la app no auto-migra en cada arranque;
- no bajar esquema automáticamente si puede perder datos;
- rollback de app exige compatibilidad de la migración o un runbook específico.

## 7. Health checks y ciclo de vida

### `/health/live`

- comprueba que el proceso responde;
- no consulta DB/storage;
- respuesta mínima, sin versiones sensibles.

### `/health/ready`

- query DB liviana con timeout;
- comprueba configuración técnica crítica de runtime y DB; contenido comercial incompleto (por ejemplo WhatsApp) bloquea release, no readiness del proceso;
- storage solo si puede hacerse sin costo/latencia excesiva, o mediante monitor separado;
- devuelve 503 si no puede servir correctamente.

### Shutdown

Al recibir señal:

1. deja de estar ready;
2. deja de aceptar trabajo nuevo;
3. espera requests dentro de timeout;
4. cierra pool DB y flush de logs;
5. termina.

## 8. Observabilidad ligera

### Monitorear

- uptime de `/health/ready` y una página pública;
- HTTP 5xx y latencia p95;
- RSS, heap y reinicios/OOM;
- CPU/load;
- espacio e inodos;
- conexiones/errores DB;
- errores de login/upload/publicación;
- expiración TLS;
- fecha y resultado de último backup/restore test.

### Logs

- JSON a stdout/stderr;
- rotación por tamaño/tiempo del runtime Docker/sistema;
- retención de 14 días si `G-OPS-01` acepta la propuesta; cambiarla exige actualizar capacidad y privacidad;
- requestId y versión de release;
- sin bodies/tokens/cookies/secretos;
- acceso restringido.

No se instala un stack de observabilidad pesado en la VPS. Un monitor externo sencillo puede verificar uptime y certificado.

## 9. Backups

### Base de datos

Línea base si no existe backup administrado equivalente:

- `pg_dump -Fc` diario;
- 7 copias diarias;
- 4 semanales;
- 6 mensuales;
- cifrado antes de storage offsite;
- checksum y registro de resultado;
- cuenta/credencial de backup de mínimo privilegio;
- copia previa a migración destructiva.

### Imágenes

- bucket con versioning/lifecycle si el proveedor lo permite;
- inventario y backup independientes si son locales;
- recordar que un backup de PostgreSQL no incluye objetos de storage;
- las claves de DB deben permitir reconciliar objetos faltantes/sobrantes.

### Configuración

- Compose/Caddyfiles versionados sin secretos;
- secretos respaldados en gestor seguro fuera del repositorio y de la VPS;
- documentar DNS, proveedor, buckets, cuentas y procedimiento de rotación;
- no guardar secretos dentro del dump.

Un snapshot o volumen en la misma VPS no cuenta como único backup.

## 10. Restauración y objetivos

`G-OPS-01` debe aceptar o cambiar esta propuesta:

| Activo | RPO propuesto | RTO propuesto | Evidencia |
|---|---:|---:|---|
| PostgreSQL | 24 h | 4 h | dump/PITR restaurado y checks de integridad |
| Imágenes/derivados | 24 h | 4 h | inventario y muestra de objetos recuperada |
| Configuración no secreta | último commit aprobado | 4 h | checkout/tag desplegable |
| Secretos y accesos | última versión vigente | 4 h | recuperación desde gestor seguro + rotación ensayada |

Un backup administrado se considera equivalente solo si está cifrado, aislado del fallo principal, respeta la retención/RPO, permite exportación y fue restaurado en una prueba. La afirmación del proveedor sin restore test no cierra el gate.

Prueba mensual:

1. crear DB temporal aislada;
2. descargar y verificar backup offsite;
3. restaurar;
4. ejecutar checks de integridad/conteos;
5. purgar todas las sesiones restauradas antes de permitir tráfico; rotar `AUTH_SECRET` si el incidente o acceso al backup pudo exponerlo;
6. levantar app contra restauración sin exponerla;
7. verificar catálogo, usuarios/relaciones y que una cookie previa recibe 401;
8. comprobar muestra de imágenes;
9. destruir entorno temporal de forma segura;
10. registrar duración, resultado y acciones.

Si el negocio necesita menor pérdida que 24 h, se requiere PostgreSQL administrado con PITR/WAL y un RPO nuevo; no se promete con dumps diarios.

Disponibilidad mensual propuesta: 99,5 %, excluyendo mantenimiento anunciado. No es un compromiso hasta que `G-OPS-01` lo acepte y exista un monitor externo con reglas de cálculo definidas.

## 11. Rollback

### Aplicación

- conservar al menos las últimas imágenes estables;
- desplegar tag anterior;
- confirmar readiness y smoke;
- registrar incidente.

### Datos

- evitar “rollback” destructivo automático;
- usar forward fix cuando sea seguro;
- restaurar solo con decisión explícita porque puede perder cambios posteriores;
- antes de restaurar, preservar el estado fallido para análisis.

### Imágenes

- restaurar versión de objeto o backup;
- no reutilizar key mutable sin versión, para evitar caché incoherente.

## 12. Seguridad del host

- actualizaciones de seguridad periódicas con ventana definida;
- usuario de despliegue sin privilegios innecesarios;
- SSH por clave y rate limiting de acceso mediante firewall del proveedor o fail2ban;
- firewall deny-by-default;
- Docker socket no expuesto a la app;
- contenedores non-root y capabilities mínimas;
- secretos con permisos de archivo restrictivos;
- DB y backups cifrados en tránsito;
- cron/systemd timers observables: un job fallido debe alertar.

## 13. Runbooks mínimos

Antes de lanzamiento deben existir procedimientos breves para:

- desplegar una versión;
- hacer rollback;
- ejecutar/verificar migración;
- backup manual y restauración;
- rotar secreto de sesión/OIDC/DB/storage según los gates;
- revocar sesiones y recuperar admin;
- responder a OOM/disco lleno;
- responder a DB caída;
- corregir número de WhatsApp comprometido;
- renovar/diagnosticar TLS;
- mover de perfil B a perfil A.

## 14. Checklist de producción

- dominio/DNS confirmados;
- TLS y redirecciones correctas;
- solo 22/80/443 expuestos;
- DB no pública;
- imagen inmutable/non-root;
- límites de recursos aplicados;
- secrets fuera de imagen/Git;
- QA migrations y suite completa aprobadas;
- backup previo y restauración probada;
- health/alertas activos;
- logs rotados y redactados;
- smoke de landing, catálogo, ficha, WhatsApp y admin;
- sitemap/robots/canonical correctos;
- rollback ensayado;
- propietario valida contenido final.

## 15. Fuentes autoritativas

- [Nuxt 4 — Deployment](https://nuxt.com/docs/4.x/getting-started/deployment)
- [PostgreSQL — Resource consumption](https://www.postgresql.org/docs/current/runtime-config-resource.html)
- [PostgreSQL — Connection settings](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [PostgreSQL — SQL dump](https://www.postgresql.org/docs/17/backup-dump.html)
- [PostgreSQL — pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html)
- [Docker — Resource constraints](https://docs.docker.com/engine/containers/resource_constraints/)
- [Caddy — Automatic HTTPS](https://caddyserver.com/docs/automatic-https)
- [Cloudflare R2 — S3 compatibility](https://developers.cloudflare.com/r2/get-started/s3/)
