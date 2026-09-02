# Plan visual editable — Donde Betty

Última revisión: 2026-08-28  
Estado general: `brief actualizado · implementación no iniciada`  
Alcance revisado: landing pública existente, catálogo, tema oscuro heredado, responsive a 390 px y 1440 px, menú móvil y `/admin`.  
Fuente de verdad implementable de marca: [`01-PRODUCTO-MARCA-Y-CONTENIDO.md`](01-PRODUCTO-MARCA-Y-CONTENIDO.md), derivada de [`internos/ADN-marca.md`](../internos/ADN-marca.md), más decisiones confirmadas por el propietario el 2026-08-28.

> Documento histórico de auditoría visual. Para alcance, CMS, gates y aceptación prevalecen `00-ESPECIFICACION-MAESTRA.md` a `09-REGISTRO-DECISIONES-GATE.md`. Las tareas incompatibles fueron marcadas/corregidas en la auditoría 2026-09-01.

## Cómo trabajar con este archivo

- `[ ]` pendiente
- `[x]` terminado
- `DECISIÓN:` requiere una respuesta antes de implementar ese bloque
- Cada tarea tiene un criterio de aceptación observable para poder revisarla y cerrarla.
- Las decisiones D1–D4 ya están registradas. Antes de implementar contenido comercial debe cerrarse `G-CONTENT-01`.

## Objetivo confirmado

**Negocio:** pastelería real, casera, pequeña y emergente.  
**Marca:** **Donde Betty**.  
**Slogan:** **Tortas de Pucura**.  
**Origen:** Pucura, Región de La Araucanía, Chile.  
**Zona documental:** Pucura; Lican Ray, Coñaripe y Villarrica son objetivos de crecimiento/despacho cuya cobertura actual se valida en `G-PROD-02`.  
**Audiencia principal:** familias —especialmente madres y padres— que necesitan una torta confiable para cumpleaños y otras celebraciones.  
**Trabajo principal de la landing:** ayudar a elegir una torta y comenzar un encargo por WhatsApp con claridad sobre sabor, porciones, precio orientativo, personalización y anticipación.

**Recorrido esperado:** catálogo → elección → WhatsApp → orientación → pedido → elaboración → retiro o despacho.

## Base estratégica de marca

- **Regla de oro:** “El sabor no se negocia.”
- **Esencia:** una torta de la que quieres otro pedazo.
- **Promesa:** torta casera, fresca, hecha a pedido y con buenos ingredientes, donde el sabor siempre está primero.
- **Diferencia:** dulzor equilibrado, sabores tradicionales, atención directa, oficio de Betty y uso posible de frutos locales como frambuesa, arándano y murta.
- **Personalidad:** sencilla, elegante, creativa, generosa, tradicional y sureña.
- **Posicionamiento:** buena y accesible, nunca barata ni pretenciosamente lujosa.
- **Foco inicial:** tortas por encargo. Tartaletas, panecillos u otras preparaciones son ocasionales y no deben diluir ese posicionamiento.
- **Condición documental por validar (`G-PROD-02`):** anticipación recomendada de al menos 1 día; encargos para el mismo día sujetos a disponibilidad.

## Evidencia de la revisión

- La app cargó en `/` y `/admin`, mostró contenido significativo y no presentó overlay ni errores de ejecución detectados.
- En tema claro no hay desborde horizontal a 390 px ni a 1440 px.
- Capturas generadas para comparar durante el trabajo:
  - [Landing — escritorio claro](../.playwright/audit-desktop-1440-light.png)
  - [Landing — móvil claro](../.playwright/audit-mobile-390-light.png)
  - [Menú móvil abierto](../.playwright/audit-mobile-menu-light.png)
  - [Landing — escritorio oscuro](../.playwright/audit-desktop-1440-dark.png)
  - [Admin — escritorio claro](../.playwright/audit-admin-1440-light.png)

## Diagnóstico resumido

### Lo que ya funciona

- Jerarquía principal clara: propuesta, catálogo, información del negocio y contacto.
- Fotografía de producto atractiva y tarjetas consistentes.
- Layout claro estable en escritorio y móvil; grilla legible y sin scroll horizontal real.
- Hay estados de carga, error y vacío, y las imágenes incluyen texto alternativo.
- La paleta cálida encaja con alimentos y la llamada a WhatsApp es visible.

### Problemas que más afectan el resultado

1. **El tema oscuro está roto.** El encabezado conserva un fondo claro mientras su texto pasa a casi blanco; el contraste medido es aproximadamente `1.03:1`. La tarjeta flotante del hero repite el problema.
2. **El CTA dorado no alcanza contraste.** Blanco sobre `#C88D37` mide aproximadamente `2.87:1`, por debajo de `4.5:1` para el tamaño usado.
3. **La identidad se siente genérica.** Crema + Playfair + dorado + píldoras + glassmorphism es una combinación muy frecuente y no cuenta algo propio del obrador.
4. **La interfaz pública habla de la implementación.** “CMS Admin”, “Nuxt”, “SQLite”, “VPS” y `STACK.md` compiten con el pedido y reducen la sensación de negocio real.
5. **El contenido comercial actual es ficticio.** Debe reemplazarse por el ADN real de Donde Betty, mercado chileno y datos operativos confirmados; no deben publicarse métricas, testimonios o contactos de muestra.
6. **El menú móvil necesita semántica y mejor tactilidad.** No comunica `aria-expanded`/`aria-controls`; su botón mide cerca de `40 × 18 px`, y los enlaces cerrados siguen siendo enfocables.
7. **Movimiento, foco e imágenes necesitan una pasada de calidad.** No se respeta `prefers-reduced-motion`, se usa `transition: all` y las imágenes no reservan dimensiones.

## Hallazgos verificables por archivo

### `app/assets/css/main.css`

- `app/assets/css/main.css:43` — `transition: all` global; declarar solo propiedades animadas.
- `app/assets/css/main.css:47` — tema oscuro parcial, sin tratamiento integral de superficies ni `color-scheme`.
- `app/assets/css/main.css:71` — `scroll-behavior: smooth` sin alternativa para movimiento reducido.
- `app/assets/css/main.css:144` — CTA blanco sobre dorado con contraste aproximado `2.87:1`.
- `app/assets/css/main.css:201` — tarjetas heredan la transición global de todas las propiedades.
- `app/assets/css/main.css:223` — animación de entrada sin `prefers-reduced-motion`.

### `app/layouts/default.vue`

- `app/layouts/default.vue:3` — falta enlace “Saltar al contenido”.
- `app/layouts/default.vue:4` — `main` no tiene un destino identificable para el enlace de salto.
- `app/layouts/default.vue:3` — `/admin` hereda navegación y footer comerciales; necesita layout propio si será un CMS real.

### `app/components/Navbar.vue`

- `app/components/Navbar.vue:5` — emoji usado como logotipo; reemplazar por marca o SVG coherente.
- `app/components/Navbar.vue:17` — acceso a CMS visible dentro de la navegación pública.
- `app/components/Navbar.vue:29` — emoji usado como icono de acción.
- `app/components/Navbar.vue:32` — botón móvil sin `aria-expanded` ni `aria-controls`.
- `app/components/Navbar.vue:74` — fondo claro fijo rompe el contraste en tema oscuro.
- `app/components/Navbar.vue:78` — transición heredada de `all`.
- `app/components/Navbar.vue:168` — área táctil del botón móvil menor a `44 × 44 px`.
- `app/components/Navbar.vue:217` — menú cerrado solo con `clip-path`; sus enlaces permanecen en el orden de tabulación.
- `app/components/Navbar.vue:228` — animación del menú sin alternativa de movimiento reducido.

### `app/components/HeroSection.vue`

- `app/components/HeroSection.vue:6` — decoración con emoji en vez de sistema de iconos.
- `app/components/HeroSection.vue:8` — titular correcto estructuralmente, pero genérico y sin beneficio inmediato de pedido/disponibilidad.
- `app/components/HeroSection.vue:36` — “+1,200 clientes” parece prueba social no verificada.
- `app/components/HeroSection.vue:44` — imagen principal sin `width`/`height` y sin prioridad explícita.
- `app/components/HeroSection.vue:49` — tarjeta flotante tipo glassmorphism poco distintiva.
- `app/components/HeroSection.vue:152` — zoom de imagen sin alternativa de movimiento reducido.
- `app/components/HeroSection.vue:168` — superficie clara fija con texto que pasa a claro en modo oscuro.

### `app/pages/index.vue`

- `app/pages/index.vue:18` — filtros sin `aria-pressed`; la selección tampoco queda reflejada en la URL.
- `app/pages/index.vue:31` — carga sin `role="status"`/`aria-live`.
- `app/pages/index.vue:33` — usar `…` y lenguaje orientado al cliente; “Nitro API” es detalle interno.
- `app/pages/index.vue:37` — error sin acción real de reintento ni anuncio accesible.
- `app/pages/index.vue:52` — emoji usado como ilustración del estado vacío.
- `app/pages/index.vue:163` — filtro hereda `transition: all`.
- `app/pages/index.vue:199` — spinner sin alternativa para movimiento reducido.

### `app/components/ProductCard.vue`

- `app/components/ProductCard.vue:4` — imagen sin dimensiones reservadas; `loading="lazy"` sí está presente.
- `app/components/ProductCard.vue:5` — destacado y rating repiten estrellas decorativas.
- `app/components/ProductCard.vue:22` — emoji usado como icono de disponibilidad.
- `app/components/ProductCard.vue:27` — moneda codificada sin configuración regional; debe formatearse como CLP para Chile.
- `app/components/ProductCard.vue:28` — precio formateado con `toFixed`; usar `Intl.NumberFormat`.
- `app/components/ProductCard.vue:31` — CTA debería anunciar el producto completo a lectores de pantalla.
- `app/components/ProductCard.vue:71` — zoom sin alternativa para movimiento reducido.

### `app/components/BusinessInfo.vue`

- `app/components/BusinessInfo.vue:18` — emojis usados como iconos de atributos.
- `app/components/BusinessInfo.vue:42` — horarios con formato y datos no confirmados.
- `app/components/BusinessInfo.vue:56` — dirección, teléfono y correo requieren validación antes de publicar.
- `app/components/BusinessInfo.vue:199` — emojis usados como iconos de contacto.

### `app/components/Footer.vue`

- `app/components/Footer.vue:11` — copy público menciona arquitectura y `STACK.md`.
- `app/components/Footer.vue:13` — badges de tecnologías compiten con la marca comercial.
- `app/components/Footer.vue:23` — jerarquía salta a `h4`.
- `app/components/Footer.vue:46` — enlaces sociales genéricos, no perfiles reales.
- `app/components/Footer.vue:55` — especificaciones de VPS visibles al cliente.
- `app/components/Footer.vue:138` — transición heredada de `all`.

### `app/pages/admin/index.vue`

- `app/pages/admin/index.vue:8` — copy describe un prototipo y detalles técnicos, no una tarea del administrador.
- `app/pages/admin/index.vue:14` — emojis como iconos de métricas.
- `app/pages/admin/index.vue:30` — una tecnología aparece como métrica de negocio.
- `app/pages/admin/index.vue:37` — el único CTA abandona el panel; todavía no hay flujo de gestión.

## Dirección visual recomendada

### Concepto de trabajo: “La mesa de Betty”

Una identidad casera y sureña contemporánea: cercana como una recomendación entre familias, ordenada como el trabajo de una pastelera con oficio y apetecible sin pretender lujo. La marca debe sentirse personal y generosa, con aire, luz y fotografías reales de tortas; no como cafetería genérica ni como souvenir turístico del sur.

**Lockup verbal de marca:** `Donde Betty` + `Tortas de Pucura`.  
**Tesis sugerida para el hero:** “Una torta de la que quieres otro pedazo.”  
**CTA principal sugerido:** “Encargar una torta”.  
**Mensaje operativo propuesto, sujeto a `G-PROD-02`:** “Pide con al menos 1 día de anticipación.”

### Firma visual

**Ficha de encargo de Betty:** una pieza inspirada en la tarjeta de pedido de cocina, con sabor, porciones, fecha, personalización y retiro/despacho. En el hero explica cómo encargar; en cada torta ordena la información que la familia necesita antes de abrir WhatsApp. Es el único gesto gráfico fuerte y reemplaza el glassmorphism, los badges decorativos y la lógica incorrecta de “horneado diario”.

### Tokens propuestos

| Rol | Nombre | Valor inicial | Uso |
|---|---|---:|---|
| Fondo | Nata | `#FFFDFC` | lienzo claro principal |
| Texto | Cacao | `#2B1915` | texto, títulos y superficies de alto contraste |
| Primario | Frambuesa | `#A23B55` | pedido/CTA; blanco alcanza ~`6.38:1` |
| Acento | Mantequilla | `#F1C36D` | porciones y resaltados; usar texto cacao |
| Territorio | Bosque | `#48604C` | origen, despacho y frutos locales; blanco alcanza ~`6.88:1` |
| Borde | Miga | `#EAD9C7` | divisores y superficies secundarias |

**Tipografía propuesta:** `Fraunces Variable` para titulares y nombres de torta; `Public Sans` para cuerpo, navegación, formularios y controles. Precios, porciones y fechas usarán números tabulares, sin sumar una tercera familia. Fraunces aporta suavidad y tradición sin la rigidez de una tipografía de lujo; Public Sans mantiene la compra simple y legible.

**Forma:** interfaz clara, radios contenidos (`6–12 px`), menos píldoras, bordes finos y sombras suaves solo cuando expresen elevación real.  
**Iconos:** SVG de un solo sistema; el logotipo debe ser un activo propio de Donde Betty, no un emoji.  
**Fotografía:** luz natural, cortes que muestren bizcocho y relleno, momentos de compartir y frutos locales cuando correspondan; evitar fondos de banco incoherentes.  
**Movimiento:** mínimo (`180–260 ms`, `opacity/transform`), concentrado en la ficha de encargo y con estado final inmediato bajo `prefers-reduced-motion`. No habrá tema oscuro.

### Estructura propuesta

```text
ESCRITORIO
┌────────────────────────────────────────────────────────────┐
│ Donde Betty · Tortas de Pucura     Sabores  Betty  [Pedir]│
├────────────────────────────────┬───────────────────────────┤
│ “Una torta de la que quieres  │ fotografía real del corte│
│ otro pedazo” + promesa        │ + ficha de encargo       │
│ [Encargar una torta]          │ anticipación confirmada  │
├────────────────────────────────┴───────────────────────────┤
│ Tortas: sabores · porciones · precios orientativos         │
├────────────────────────────────────────────────────────────┤
│ Cómo encargar: elegir → conversar → elaborar → entregar    │
├───────────────────────────────┬────────────────────────────┤
│ Betty, oficio y sabor         │ Pucura + zonas de despacho│
├───────────────────────────────┴────────────────────────────┤
│ Frutos del sur / torta insignia + CTA final                │
│ Footer comercial corto                                    │
└────────────────────────────────────────────────────────────┘

MÓVIL
┌──────────────────────────────┐
│ Donde Betty   [Pedir] [Menú] │
│ Tortas de Pucura             │
│ Promesa + CTA                │
│ Foto real del corte          │
│ Ficha: sabor/porciones/fecha │
│ Sabores de torta             │
│ Cómo encargar                │
│ Betty + origen               │
│ Despachos + WhatsApp         │
└──────────────────────────────┘
```

### Autocrítica de la propuesta

- El riesgo de `Fraunces` sobre fondo cálido es volver a una estética gastronómica genérica. Se compensa con un fondo mucho más claro, color frambuesa, estructura funcional de encargo y fotografía documental propia; si esas piezas no existen, deberá revisarse la tipografía.
- La identidad sureña se expresará mediante Pucura, frutos locales, luz, paisaje cotidiano y relato de origen; se excluyen clichés de volcanes, madera rústica o iconografía turística sin función.
- La ficha solo será distintiva si contiene información útil y real. Si se convierte en adorno o falsa letra manuscrita, debe simplificarse.
- “Casera” no significa artesanal desordenada: espaciado, fotografía, redacción y presentación deben ser consistentes.
- La oferta inicial debe concentrarse en tortas; mostrar croissants, pan o cupcakes como si tuvieran el mismo peso debilita el posicionamiento definido en el ADN.

## Decisiones abiertas

- [x] **D1 — Naturaleza del proyecto:** negocio real, casero, pequeño y emergente; la web debe vender y generar confianza, no presentar una demo técnica.
- [x] **D2 — Mercado:** Chile, precios en CLP y origen en Pucura. La cobertura vigente hacia Lican Ray, Coñaripe y Villarrica queda en `G-PROD-02`.
- [x] **D3 — Tema:** experiencia clara; retirar el tema oscuro automático incompleto.
- [x] **D4 — Marca:** `Donde Betty`; slogan `Tortas de Pucura`. La síntesis implementable está en [`01-PRODUCTO-MARCA-Y-CONTENIDO.md`](01-PRODUCTO-MARCA-Y-CONTENIDO.md) y el ADN original en [`internos/ADN-marca.md`](../internos/ADN-marca.md).
- [ ] **G-CONTENT-01 — Datos operativos y activos:** confirmar WhatsApp, Instagram, condiciones/tarifas de despacho, lista de precios, tamaños/porciones, logo y fotografías reales disponibles.
  - El ADN define estrategia, productos, territorio y experiencia, pero no incluye todos estos datos de publicación.

## Backlog priorizado

### P0 — Integridad, contraste y accesibilidad

- [ ] **V-001 — Retirar el tema oscuro automático** (`S`)
  - Eliminar el override incompleto y declarar una experiencia clara coherente con Donde Betty.
  - Ajustar `theme-color` y superficies del navegador al fondo Nata.
  - Aceptación: encabezado, hero, tarjetas, estados, controles nativos y footer conservan contraste en modo claro aunque el sistema operativo prefiera oscuro.
- [ ] **V-002 — Corregir contraste de CTA, badges y filtros** (`S`)
  - Aceptación: texto normal alcanza `4.5:1`; foco alcanza `3:1` contra colores adyacentes.
- [ ] **V-003 — Menú móvil accesible** (`M`)
  - Añadir `aria-expanded`, `aria-controls`, cierre con Escape y al navegar.
  - Retirar enlaces del foco cuando está cerrado y asegurar blanco táctil de `44 × 44 px`.
  - Aceptación: recorrido completo solo con teclado y lector de pantalla anuncia el estado.
- [ ] **V-004 — Foco, salto y anclas** (`S`)
  - Añadir skip link, destino `main`, `:focus-visible` y `scroll-margin-top`.
  - Aceptación: ningún foco queda oculto por el header sticky.
- [ ] **V-005 — Movimiento reducido y transiciones explícitas** (`S`)
  - Reemplazar `transition: all`; desactivar smooth scroll, zooms, fade y menú animado bajo reducción.
  - Aceptación: emulación `prefers-reduced-motion: reduce` no inicia movimiento no esencial.
- [ ] **V-006 — Imágenes estables y prioritarias** (`M`)
  - Reservar relación/dimensiones, priorizar hero y mantener lazy loading bajo el fold.
  - Evaluar `@nuxt/image` antes de añadir dependencia.
  - Aceptación: sin salto visible de layout; imágenes con tamaños correctos a 390/768/1024/1440.
- [ ] **V-007 — Estados y filtros accesibles** (`M`)
  - `aria-pressed`, estado de categoría en URL, `role=status`, error con reintento y copy sin detalles internos.
  - Aceptación: filtro enlazable/recargable y actualizaciones anunciadas.

### P1 — Contenido, conversión e identidad

- [ ] **V-101 — Limpiar la experiencia pública** (`M`)
  - Sacar CMS del header y retirar stack/VPS/`STACK.md` del footer.
  - Crear acceso administrativo fuera del flujo comercial.
  - Aceptación: cada bloque público ayuda a elegir, confiar, visitar o pedir.
- [ ] **V-102 — Migrar contenido a la marca real** (`M`, depende de G-CONTENT-01)
  - Sustituir Dulce Arte y los datos ficticios por Donde Betty, `Tortas de Pucura` y la estrategia de `specs/01-PRODUCTO-MARCA-Y-CONTENIDO.md`.
  - Incorporar solo teléfono, redes, precios y condiciones operativas confirmadas.
  - Aceptación: cero datos de muestra presentados como reales.
- [ ] **V-103 — Formatear precios y condiciones de encargo** (`S`, depende de G-CONTENT-01)
  - Usar `Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })`, números tabulares, porciones y precios orientativos confirmados.
  - Comunicar la anticipación y disponibilidad validadas en `G-PROD-02`.
  - Aceptación: mismo formato en cards, mensajes de WhatsApp y futuros detalles.
- [ ] **V-104 — Implementar tokens “La mesa de Betty”** (`M`)
  - Colores semánticos, tipografía, escala, bordes, radios, sombras y estados.
  - Aceptación: ningún color estructural queda codificado dentro de componentes.
- [ ] **V-105 — Reemplazar emojis por identidad/SVG** (`M`, depende de G-CONTENT-01)
  - Logotipo, navegación, contacto, disponibilidad y admin.
  - Aceptación: decorativos con `aria-hidden`; acciones con nombre accesible.
- [ ] **V-106 — Rediseñar hero y navegación** (`L`)
  - Lockup `Donde Betty · Tortas de Pucura`, un único CTA principal, fotografía real, ficha de encargo y copy basado en sabor/dulzor equilibrado.
  - Aceptación: a 390 px se entienden marca, tortas por encargo, origen, anticipación y acción sin desplazarse más de un viewport y medio.
- [ ] **V-107 — Mejorar catálogo y cards** (`L`)
  - Centrar el catálogo en tortas reales del ADN; aclarar sabor, tamaño/porciones, precio orientativo, personalización y ampliar el CTA móvil.
  - Dar protagonismo potencial a frutos rojos/locales sin convertir productos ocasionales en el foco principal.
  - Aceptación: sabor, porciones, precio y encargo se escanean en menos de 3 segundos por tarjeta.
- [ ] **V-108 — Simplificar negocio y footer** (`M`)
  - Resumir la historia y oficio de Betty, proceso de encargo, Pucura, zonas de despacho y datos accionables; cerrar con footer comercial corto.
  - Aceptación: no hay contenido técnico ni enlaces de muestra.

### P2 — Panel administrativo

- [ ] **V-201 — Crear layout de admin independiente** (`M`)
  - Sin header/footer comercial; navegación contextual y salida clara al sitio.
- [ ] **V-202 — Convertir métricas técnicas en tareas de negocio** (`M`)
  - Tortas publicadas, borradores incompletos, fichas sin portada/alt/precio y última actualización. Pedidos, clientes y fechas de entrega están fuera del CMS MVP.
- [ ] **V-203 — Diseñar flujo mínimo de catálogo** (`L`)
  - Lista, alta/edición, imagen, disponibilidad, validación y feedback.
  - Aceptación: el panel deja de ser una maqueta estática y permite completar una tarea real.

### P3 — Verificación final

- [ ] **V-301 — Matriz responsive**: 375, 390, 768, 1024 y 1440 px.
- [ ] **V-302 — Tema claro**: contraste y controles correctos incluso cuando el sistema operativo prefiera oscuro.
- [ ] **V-303 — Interacción**: mouse, teclado, touch, menú, filtros, WhatsApp y reintento.
- [ ] **V-304 — Accesibilidad**: contraste, headings, landmarks, nombres accesibles, reducción de movimiento.
- [ ] **V-305 — Rendimiento visual**: CLS, carga de fuentes, peso/formato de imágenes y estados lentos.
- [ ] **V-306 — Contenido**: datos reales, moneda, enlaces, ortografía y consistencia de etiquetas.
- [ ] **V-307 — Build**: `npm run build` y revisión visual posterior sin errores.

## Primer bloque recomendado

Después de cerrar `G-CONTENT-01`, sin iniciar cambios adicionales fuera del alcance aprobado:

1. V-001 a V-007: reparar la base sin cambiar todavía la identidad completa.
2. V-101 a V-105: limpiar contenido y fijar el sistema visual.
3. V-106 a V-108: rediseñar landing y catálogo sobre esa base.
4. V-201 a V-203: abordar admin como producto separado.
5. V-301 a V-307: cerrar con verificación completa.

## Definición de terminado

Una tarea visual se cierra solo cuando:

- cumple su criterio de aceptación;
- funciona en 390 px y 1440 px;
- tiene estados hover, active, focus y disabled cuando aplican;
- no introduce desborde horizontal ni saltos visibles de layout;
- respeta contraste y reducción de movimiento;
- usa contenido confirmado por el ADN o por datos operativos entregados por el propietario;
- pasa build y revisión visual del flujo afectado.
