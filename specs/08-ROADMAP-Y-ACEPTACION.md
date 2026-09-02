# Roadmap, gates y criterios de aceptación

Última revisión: 2026-09-01  
Estado: `secuencia auditada · gates abiertos`

## 1. Forma de trabajo

- Cada etapa produce una entrega revisable y termina con un gate.
- Un requisito no está terminado solo porque la UI existe; necesita prueba y contenido válido.
- Las decisiones abiertas se cierran antes de la etapa que dependa de ellas.
- Los IDs de esta hoja no sustituyen los `RF-*`/`RNF-*`; los agrupan en trabajo ejecutable.
- No se publica parcialmente con mocks plausibles.

Estados sugeridos para seguimiento: `pending`, `in_progress`, `blocked`, `done`, con enlace a PR/evidencia.

## 2. Etapa 0 — Descubrimiento y decisiones

### Tareas

- **E0-01 — Cerrar `G-CONTENT-01`.** WhatsApp, redes, ubicación/retiro, horarios, despachos, precios, porciones, personalización, políticas, alérgenos, conservación, fotos y dominio.
- **E0-02 — Inventario editorial.** Una ficha validada por cada torta y selección de 3–6 destacadas.
- **E0-03 — Activos.** Logo fuente, favicon, hero, fotos por producto y permisos.
- **E0-04 — Auth ADR.** Resolver `G-AUTH-01/02/03`: identidad, administradores, recuperación, sesión y MFA.
- **E0-05 — Infra ADR.** Elegir perfil A administrado o perfil B autocontenido, con costo y responsable.
- **E0-06 — Storage ADR.** S3-compatible recomendado o volumen local con backup.
- **E0-07 — CMS scope.** Confirmar si ajustes operativos se editan en el CMS.
- **E0-08 — Dominio y SEO local.** Confirmar URL canónica y datos públicos.
- **E0-09 — Framework ADR.** Confirmar `G-TECH-01` antes de migrar.
- **E0-10 — Datos ADR.** Confirmar `G-DATA-01` antes del esquema y migraciones.
- **E0-11 — Producto/medición/operación.** Resolver `G-PROD-01/02`, `G-ANALYTICS-01` y aceptar/cambiar `G-OPS-01` antes de sus etapas dependientes.

### Gate G0

- todas las decisiones de `09-REGISTRO-DECISIONES-GATE.md` necesarias para Etapa 1 registradas; ninguna se acepta por silencio;
- WhatsApp real disponible;
- al menos 3 tortas con contenido publicable y foto;
- cero dependencia de datos ficticios para construir la primera experiencia;
- propietario aprueba marca, tono y dirección visual.

Si no hay suficiente contenido, se puede continuar con infraestructura usando marcadores técnicos inequívocos, pero no cerrar Etapa 2 ni desplegar públicamente.

## 3. Etapa 1 — Fundación técnica

### Tareas

- **E1-01 — Baseline.** Aplicar el framework decidido en `G-TECH-01`; si es Nuxt 4, fijar Node compatible, lockfile y estructura Nuxt 4.
- **E1-02 — Limpiar prototipo.** Retirar SQLite, mocks y declaraciones Nuxt/Tailwind contradictorias.
- **E1-03 — PostgreSQL.** Compose local, cliente/pool, Drizzle config, migrations y seed draft.
- **E1-04 — Capas.** Contratos, schemas, servicios, repositorios y errores tipados.
- **E1-05 — Config.** Validación de entorno y `.env.example`.
- **E1-06 — Calidad.** lint, format, typecheck, unit, integración, build y CI.
- **E1-07 — Auth base.** Better Auth, tablas, sesión, allowlist y flujo elegido.
- **E1-08 — Admin shell.** Layout separado, noindex y guards UX.
- **E1-09 — Seguridad base.** headers, requestId, redacción de logs y límites.
- **E1-10 — Slice de publicación.** Implementar reglas/servicio de crear, actualizar y publicar, auditoría e importador controlado para cargar las tortas iniciales en QA; la UI completa llega en Etapa 4.
- **E1-11 — Imágenes mínimas.** Implementar el adaptador elegido, validación, derechos y derivados de portada necesarios para que el slice E1 publique contenido real; la UI completa de upload llega en Etapa 4.

### Gate G1

- migraciones funcionan desde DB vacía y upgrade probado;
- seed crea solo drafts confirmados, sin datos inventados;
- build de producción reproducible;
- API admin sin sesión devuelve 401 y sin rol 403;
- cookie/session cumple flags en HTTPS de QA;
- al menos tres tortas reales se importan y publican en QA mediante el mismo servicio de dominio del CMS, sin publicar desde el seed;
- CI verde.

## 4. Etapa 2 — Landing y conversión

### Tareas

- **E2-01 — Sistema visual.** Tokens, tipografía local, SVG y estados.
- **E2-02 — Navegación.** Desktop/móvil accesible, skip link y CTA.
- **E2-03 — Hero.** Tesis, origen, anticipación, foto y ficha de encargo.
- **E2-04 — Valor.** Sabor, equilibrio, hecho a pedido y oficio.
- **E2-05 — Destacadas.** Consulta SSR a servicio real y tarjetas.
- **E2-06 — Proceso.** Elegir → conversar → confirmar → elaborar/entregar.
- **E2-07 — Historia/territorio.** Betty, Pucura y frutos solo confirmados.
- **E2-08 — Contacto/redes/footer.** Canales reales y sin contenido técnico.
- **E2-09 — WhatsApp.** Constructor central y encoding; eventos solo si `G-ANALYTICS-01` los aprueba.
- **E2-10 — Responsive/a11y.** matriz, foco, contraste y movimiento reducido.

### Gate G2

- landing usa marca/contenido real y no contiene “Dulce Arte”/Perú/mocks;
- CTA abre el número y mensaje correcto en móvil/web;
- destacadas provienen de PostgreSQL y filtran `published`;
- flujo completo solo con teclado;
- auditoría visual 390/1440 aprobada;
- Lighthouse/axe sin bloqueos de lanzamiento.

## 5. Etapa 3 — Catálogo público y SEO

### Tareas

- **E3-01 — Listado.** `/catalogo`, estados y filtros útiles.
- **E3-02 — Ficha.** `/catalogo/[slug]`, variantes, galería y CTA.
- **E3-03 — Redirects.** slug histórico y canonical.
- **E3-04 — Imágenes.** storage, derivados, `srcset`, cache y fallback.
- **E3-05 — SEO.** metadatos, JSON-LD, sitemap y robots.
- **E3-06 — Frescura.** Sin caché de HTML/JSON dinámico en el MVP; assets inmutables y privado `no-store`.
- **E3-07 — Contratos.** API pública tipada y tests.
- **E3-08 — Contacto.** ruta o redirect decidido, cobertura real.

### Gate G3

- todas y solo las tortas publicadas aparecen;
- una ficha comparte URL/OG correctos;
- draft/archived dan 404 anónimo y no aparecen en sitemap ni respuestas públicas;
- cambio de slug responde 301;
- precio/porciones se muestran sin ambigüedad;
- datos estructurados no afirman checkout, stock o reviews inexistentes;
- el siguiente request iniciado después del commit observa cambios de publicación, despublicación y slug;

## 6. Etapa 4 — CMS de catálogo

### Tareas

- **E4-01 — Dashboard editorial.** métricas/tareas de contenido.
- **E4-02 — Listado admin.** búsqueda, estados y acciones.
- **E4-03 — Editor.** campos, variantes y validación.
- **E4-04 — Upload.** validación, procesamiento, storage y alt.
- **E4-05 — Preview.** autenticado y noindex.
- **E4-06 — Publicación.** UI sobre reglas/servicio de Etapa 1, transacción, auditoría e idempotencia.
- **E4-07 — Orden/destacados.** accesible sin depender de drag.
- **E4-08 — Archivo/restore.** confirmaciones y redirects.
- **E4-09 — Concurrencia.** version/409 y aviso de cambios sin guardar.
- **E4-10 — Ajustes.** solo con `G-CMS-01.B`; campos aprobados y protección reforzada de WhatsApp.

### Gate G4

- administradora completa crear → guardar → previsualizar → publicar;
- torta incompleta no se publica por UI ni API;
- upload válido genera derivados y uno inválido se rechaza;
- edición concurrente no pierde datos;
- toda acción sensible deja auditoría;
- CMS usable a 390 px, teclado y lector de pantalla;
- logout/revocación corta el acceso inmediatamente.

## 7. Etapa 5 — Hardening y QA integral

### Tareas

- **E5-01 — Seguridad.** CSRF/origin, CSP, headers, rate limits, secrets y dependency scan.
- **E5-02 — Auth abuse.** login, callback, allowlist, revocación y recuperación.
- **E5-03 — Upload abuse.** MIME falso, SVG, tamaño, píxeles, EXIF y concurrencia.
- **E5-04 — A11y manual.** teclado, foco, reflow, contraste, lector y reducción.
- **E5-05 — Performance.** bundles, CWV lab, imágenes, fuentes, RSS/heap/pool.
- **E5-06 — Resiliencia.** DB/storage lento/caído, timeouts y shutdown.
- **E5-07 — Contenido.** revisión propietaria, ortografía, enlaces y políticas.
- **E5-08 — Navegadores/dispositivos.** matriz completa y WhatsApp real.

### Gate G5

- checklist de seguridad aprobado;
- E2E críticos verdes;
- cero issue crítico/serio de accesibilidad conocido;
- budgets cumplidos o excepción firmada con mitigación;
- sin secretos/PII sensible en logs;
- propietario aprueba contenido final.

## 8. Etapa 6 — Producción y operación

### Tareas

- **E6-01 — Infra.** Caddy, red, contenedores, límites y firewall.
- **E6-02 — Release.** imagen inmutable, migrations y smoke.
- **E6-03 — Monitoreo.** uptime, 5xx, latencia, memoria, disco, TLS y backup.
- **E6-04 — Backups.** DB, imágenes, cifrado, offsite y retención.
- **E6-05 — Restore drill.** restauración temporal cronometrada.
- **E6-06 — Rollback drill.** volver a imagen compatible.
- **E6-07 — Runbooks.** accesos, OOM, DB, secretos, WhatsApp y TLS.
- **E6-08 — Handoff.** capacitación breve del CMS y responsables.

### Gate G6 / lanzamiento

- solo 22/80/443 públicos y DB privada;
- TLS/headers/canonical correctos;
- health y alertas activos;
- backup offsite exitoso y restore dentro de los objetivos aceptados en `G-OPS-01`;
- rollback ensayado;
- smoke público/admin correcto;
- contenido, contacto, dominio y redes validados en producción;
- la propietaria puede editar y publicar una torta.

## 9. Matriz de trazabilidad

| Área | Requisitos principales | Etapa/gate |
|---|---|---|
| Landing/WhatsApp | RF-PUB-001..006 | E2 / G2 |
| Catálogo público | RF-CAT-001..007 | E3 / G3 |
| CMS | RF-CMS-001..009 | E4 / G4 |
| Auth | RF-AUTH-001..005 | E1, E5 / G1, G5 |
| Rendimiento | RNF-PERF-001..005 | E2, E3, E5 / G5 |
| SEO | RNF-SEO-001..004 | E3 / G3 |
| Accesibilidad | RNF-A11Y-001..004 | E2–E5 / G5 |
| Seguridad | RNF-SEC-001..005 | E1, E4, E5 / G5 |
| Operación | RNF-OPS-001..004 | E6 / G6 |

## 10. Orden recomendado de slices

Dentro de cada etapa, entregar verticalmente:

1. lectura pública desde PostgreSQL con una torta real;
2. CTA contextual y ficha accesible;
3. editor del mismo campo de punta a punta;
4. publicación/frescura/auditoría;
5. ampliar al resto de campos/productos.

Esto valida temprano el recorrido completo sin construir primero todas las pantallas aisladas.

## 11. Definición de terminado por tarea

Una tarea se marca `done` cuando:

- cumple requisito y criterio observable;
- tiene pruebas en proporción al riesgo;
- pasa lint/typecheck/build;
- incluye estados loading/error/empty/success si aplican;
- funciona a 390 y 1440 px;
- es operable con teclado y foco visible;
- no agrega datos ficticios ni secrets;
- actualiza contrato, migration/runbook/spec si cambia una decisión;
- fue revisada en build de producción, no solo dev.

## 12. Decisiones que bloquean etapas

| Decisión | Bloquea |
|---|---|
| `G-AUTH-01/02/03` | E1-07 y CMS |
| `G-TECH-01` | E1-01 y migración |
| `G-DATA-01` | E1-03, esquema y migraciones |
| `G-INFRA-01` | E6 y backup/monitor |
| `G-STORAGE-01` | uploads y backup de imágenes |
| WhatsApp real | G2/lanzamiento |
| contenido/fotos de tortas | G2/G3 |
| taxonomía real | filtros del catálogo; si falta, se omiten |
| `G-PROD-01/02` | contacto, mapa, catálogo y mensajes |
| `G-CMS-01` | E4-10 y modelo de ajustes |
| `G-ANALYTICS-01` | métricas, privacidad y scripts/eventos |
| `G-OPS-01` | backup, restore, disponibilidad y lanzamiento |

Ninguna de estas decisiones justifica inventar un valor. La alternativa segura por defecto es omitir la función pública hasta confirmarla.
