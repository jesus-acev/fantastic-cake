# Donde Betty — Web, catálogo y CMS

Repositorio de **Donde Betty · Tortas de Pucura**. `app/` contiene actualmente un prototipo Nuxt 3 con datos simulados; no debe considerarse una implementación de producción.

La arquitectura objetivo es un monolito con sitio público, catálogo, CMS y API. Nuxt 4, PostgreSQL, autenticación y storage continúan como decisiones explícitas en los gates del proyecto; no se asumen por silencio.

- [Arquitectura de alto nivel](docs/ARQUITECTURA.md)
- [Plan visual](docs/PLAN_VISUAL.md)
- [Stack tecnológico](docs/STACK.md)
- [Índice de especificaciones](specs/README.md)
- [Registro de decisiones gate](specs/09-REGISTRO-DECISIONES-GATE.md)

---

## 📁 Directorio Principal: `app/`

Prototipo visual basado en Nuxt/Vue/Nitro. La persistencia SQLite declarada todavía no está conectada y `/admin` no tiene autenticación ni CRUD.

- **Puerto Dev**: `http://localhost:3000`
- **Comandos**:
  ```bash
  cd app
  npm install
  npm run dev
  ```

---

## 📁 Directorios del Proyecto

| Directorio | Descripción |
|------------|-------------|
| `app/` | Prototipo Nuxt 3 (sitio público, catálogo, admin) |
| `specs/` | Especificaciones técnicas del proyecto |
| `docs/` | Documentación general (arquitectura, plan visual, stack) |
| `.codex/` | Configuración de agentes para Codex |
| `.opencode/` | Configuración de agentes para OpenCode |
| `.playwright/` | Screenshots de auditorías de accesibilidad |

---

## ⚙️ Configuración de Agentes

El proyecto usa agentes especializados para diferentes tareas:

- **Frontend Developer** (`app/`)
- **Fullstack Developer** (integración)
- **UI Designer** (diseño visual)
- **AI Engineer** (lógica de negocio, backend)
- **Code Reviewer** (calidad de código)
- **DevOps Engineer** (infraestructura, deployment)
- **Vue Expert** (optimización Vue/Nuxt)

Ver `.codex/agents/` y `.opencode/agents/` para detalles.

---

## 📋 Guía de Orquestación

Consultar `AGENTS.md` para las reglas de orquestación entre agentes.

---

## Licencia

Pendiente de definir por el propietario del proyecto.
