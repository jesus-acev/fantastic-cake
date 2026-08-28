# Repository Guidelines

## Proyecto

Aplicación web de pastelería Dulce Arte. El sitio público y el CMS administrativo se desarrollan como un monolito Nuxt/Nitro. La voz de marca y el contenido deben respetar `specs/adn-marca.md`.

## Estructura del proyecto

`app/` contiene la aplicación Nuxt. Organiza el código según la convención de Nuxt: `pages/` para rutas (incluido `/admin`), `components/` para UI reutilizable, `layouts/` para estructuras compartidas, `server/` para API Nitro y lógica de servidor, `public/` para archivos estáticos y `assets/` para estilos y recursos fuente. `specs/STACK.md` define la arquitectura obligatoria. No edites directorios generados: `.nuxt/`, `.output/` ni `node_modules/`.

## Stack y comandos

- Usa el gestor de paquetes ya presente en el repositorio.
- Ejecuta los comandos desde `app/` cuando exista su manifiesto: `npm install`, `npm run dev`, `npm run build` y `npm run preview`.
- Antes de finalizar cambios, ejecuta las verificaciones disponibles; como mínimo, `npm run build` para cambios funcionales.
- No añadas dependencias sin justificarlo. No asumas scripts de lint o pruebas que no estén definidos en `package.json`.

## Estilo y forma de trabajo

- Usa Nuxt 4, Vue 3 y TypeScript; prefiere componentes pequeños y enfocados.
- Indenta con 2 espacios, usa comillas simples y nombres descriptivos: componentes en PascalCase (`ProductCard.vue`), rutas en kebab-case y variables en camelCase.
- Revisa primero la estructura y los patrones existentes. Haz cambios pequeños y enfocados; no modifiques archivos no relacionados.
- Conserva el idioma español y una voz cercana en los textos de la interfaz. Prioriza accesibilidad, HTML semántico y diseño responsive.
- Mantén un monolito modular con SQLite y Drizzle; evita microservicios, servicios externos y dependencias pesadas.

## Pruebas y seguridad

No hay una suite de pruebas versionada actualmente. Valida manualmente las rutas afectadas y documenta lo ejecutado. Trata entradas y archivos subidos como no confiables, protege `/admin` y nunca subas secretos ni bases de datos locales.

## Commits y entregas

Usa commits breves con formato `<tipo>: <resumen>`, por ejemplo `fix: validar carga de imagen`. Al terminar, resume los cambios, indica los archivos modificados e informa las pruebas o comandos ejecutados y su resultado. Las solicitudes de cambio visual deben incluir capturas de pantalla.
