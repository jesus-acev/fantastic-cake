# Prompt de arquitectura y desarrollo

Actúa como un desarrollador senior especializado en **Nuxt, Vue, Node.js y aplicaciones monolíticas**.

Debes desarrollar una aplicación web monolítica para un restaurante/pastelería utilizando exclusivamente el siguiente stack principal:

## Stack obligatorio

* **Nuxt 4**
* **Vue 3**
* **TypeScript**
* **Node.js**
* **SQLite**
* **Nginx**
* **Nitro** como servidor de Nuxt
* **Drizzle ORM** para acceso a SQLite

El proyecto debe funcionar correctamente en un VPS pequeño con:

* 1 OCPU
* 1 GB RAM
* Linux
* Nginx
* Node.js LTS

## Arquitectura

La aplicación debe ser un **monolito full-stack**.

No crear microservicios ni separar frontend y backend en proyectos independientes.

La estructura conceptual debe ser:

```text
Internet
   │
   ▼
 Nginx
   │
   ▼
 Nuxt / Nitro
   │
   ├── Sitio público
   ├── CMS / Administración
   ├── API interna
   ├── Autenticación
   ├── Lógica de negocio
   └── Drizzle ORM
           │
           ▼
        SQLite
```

Nuxt debe encargarse tanto de la interfaz como de la lógica server-side mediante Nitro.

## Objetivos principales

La aplicación debe:

1. Tener excelente rendimiento.
2. Tener buen SEO.
3. Ser responsive.
4. Funcionar correctamente en dispositivos móviles.
5. Permitir administrar un catálogo desde un CMS.
6. Permitir crear, editar, eliminar y ocultar productos.
7. Permitir subir imágenes.
8. Optimizar automáticamente las imágenes.
9. Tener autenticación para administradores.
10. Mantener una arquitectura sencilla de desplegar y mantener.
11. Minimizar el consumo de RAM y CPU.
12. Evitar dependencias innecesarias.

## Sitio público

El sitio debe incluir:

* Inicio
* Menú/Catálogo
* Categorías
* Página individual de producto
* Información del restaurante/pastelería
* Galería
* Horarios
* Dirección
* Contacto
* Redes sociales
* Información de pedidos/reservas

Las páginas públicas deben utilizar SSR o generación estática cuando sea conveniente.

El HTML entregado al buscador debe contener el contenido principal de la página para favorecer el SEO.

## Catálogo

Cada producto debe poder tener:

* Nombre
* Slug
* Descripción corta
* Descripción completa
* Precio
* Imagen principal
* Galería de imágenes
* Categoría
* Etiquetas
* Orden
* Estado publicado/no publicado
* Producto destacado
* Fecha de creación
* Fecha de actualización

Ejemplos:

```text
Tortas
 ├── Torta de Chocolate
 ├── Torta Tres Leches
 └── Cheesecake

Pasteles
 ├── Brownie
 ├── Pie de Limón
 └── Tarta de Frutas

Panadería
 ├── Croissant
 └── Pan Artesanal
```

## CMS

Crear un panel administrativo protegido.

Ruta sugerida:

```text
/admin
```

El CMS debe permitir:

* Login/logout
* Dashboard
* Gestión de productos
* Gestión de categorías
* Gestión de imágenes
* Gestión de información del negocio
* Gestión de horarios
* Gestión de SEO
* Publicar/despublicar productos
* Ordenar productos
* Eliminar productos
* Previsualizar productos

La interfaz administrativa debe estar desarrollada con Vue/Nuxt.

## Base de datos

Utilizar:

```text
SQLite
+
Drizzle ORM
```

No utilizar PostgreSQL, MongoDB, Redis ni otros servidores de base de datos salvo que exista una justificación técnica explícita.

Diseñar correctamente:

* claves primarias
* claves foráneas
* índices
* restricciones
* timestamps
* migraciones

## Imágenes

Las imágenes subidas mediante el CMS deben procesarse antes de ser utilizadas públicamente.

Utilizar formatos modernos cuando sea conveniente:

* WebP
* AVIF

Generar tamaños adecuados para:

* móvil
* tablet
* desktop

Evitar enviar imágenes originales gigantes al navegador.

No almacenar imágenes como BLOB dentro de SQLite.

Guardar archivos en filesystem o almacenamiento externo y guardar solamente sus referencias/metadatos en SQLite.

## SEO

Implementar como mínimo:

* `<title>` dinámico
* meta description
* canonical
* Open Graph
* Twitter Cards
* sitemap.xml
* robots.txt
* URLs amigables
* slugs
* encabezados semánticos
* datos estructurados JSON-LD

Utilizar Schema.org cuando corresponda para:

* Restaurant
* LocalBusiness
* Product
* BreadcrumbList

Cada producto publicado debe poder tener metadata SEO propia.

## Seguridad

Implementar como mínimo:

* contraseñas hasheadas
* sesiones seguras
* cookies HttpOnly
* protección CSRF cuando corresponda
* validación de entradas
* validación de archivos
* límite de tamaño de uploads
* validación MIME
* control de acceso al CMS
* protección de rutas administrativas

Nunca confiar en datos enviados por el cliente.

## Rendimiento

Optimizar para un VPS de:

```text
1 OCPU
1 GB RAM
```

Evitar:

* servicios innecesarios
* workers excesivos
* procesos residentes innecesarios
* dependencias pesadas
* consultas innecesarias
* imágenes sin optimizar

Preferir:

* SSR/SSG cuando corresponda
* caching
* lazy loading
* imágenes responsive
* consultas SQLite eficientes
* assets minificados
* compresión HTTP
* Nginx como reverse proxy

## Nginx

Nginx debe actuar como reverse proxy:

```text
Internet
   │
   ▼
Nginx :80/:443
   │
   ▼
Nuxt/Nitro :3000
```

Configurar:

* HTTPS
* HTTP/2 o HTTP/3 si corresponde
* compresión
* cache de assets
* headers de seguridad
* proxy hacia Nuxt

## Desarrollo

Utilizar:

```text
TypeScript
ESLint
Prettier
Git
npm
```

El código debe ser modular y fácil de mantener.

Separar claramente:

```text
pages/
components/
layouts/
server/
  api/
  services/
  utils/
  middleware/
  database/
  auth/
public/
```

No introducir patrones arquitectónicos complejos sin necesidad.

## Principio fundamental

La aplicación debe permanecer como un **monolito modular**.

No crear:

* microservicios
* Docker por defecto
* Kubernetes
* Redis
* colas externas
* PostgreSQL
* servicios Node separados

salvo que exista una necesidad concreta y documentada.

La prioridad es:

```text
Simplicidad
>
Mantenibilidad
>
Seguridad
>
Rendimiento
>
Escalabilidad futura
```

La aplicación debe poder desplegarse en un VPS pequeño y posteriormente migrarse a una infraestructura mayor sin tener que reescribir completamente el sistema.
