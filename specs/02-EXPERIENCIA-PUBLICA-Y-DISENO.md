# Experiencia pública y dirección de diseño

Última revisión: 2026-09-01  
Estado: `especificación funcional y visual`

## 1. Tesis de experiencia

**Sujeto:** Donde Betty, una pastelería familiar de Pucura especializada en tortas por encargo.  
**Audiencia:** familias que necesitan elegir una torta confiable para una celebración.  
**Trabajo único de la página:** llevar a una conversación de WhatsApp con suficiente contexto para orientar el pedido.

La interfaz no debe parecer una cafetería genérica ni una demo tecnológica. Debe sentirse como acercarse a la mesa de trabajo de una pastelera con oficio: apetecible, ordenada, personal y útil.

## 2. Principios de interacción

1. **La decisión antes que la decoración.** Sabor, porciones, precio y anticipación aparecen antes de detalles secundarios.
2. **WhatsApp como continuidad.** El CTA no interrumpe ni simula checkout; continúa una elección ya contextualizada.
3. **Hecho a pedido.** No se usa lenguaje de stock, envío inmediato o “hoy” sin datos reales.
4. **Una acción principal.** “Encargar una torta” domina; Instagram y navegación son secundarios.
5. **Contenido real.** La fotografía documental y los datos confirmados son parte del diseño.
6. **Móvil primero.** La mayoría de los flujos debe resolverse cómodamente desde un teléfono y una mano.
7. **Estado explícito.** Carga, vacío, error, borrador o ausencia de precio se explican con una acción útil.

## 3. Dirección visual: “La ficha de encargo de Betty”

La firma del sistema será una **ficha de encargo** inspirada en las anotaciones reales de una cocina: sabor, porciones, fecha, personalización y retiro/despacho. No es un adorno manuscrito; organiza los datos que una familia necesita antes de escribir.

Se usa:

- en el hero, para explicar el proceso;
- en tarjetas/fichas, para agrupar porciones, anticipación y precio;
- en el CMS, como previsualización del contenido público.

No se repite como fondo decorativo en todas las secciones. Ese es el único gesto visual fuerte; el resto se mantiene sobrio.

### Paleta propuesta

| Token | Valor | Uso |
|---|---:|---|
| Nata | `#FFFDFC` | fondo principal luminoso |
| Cacao | `#2B1915` | texto y superficies de alto contraste |
| Frambuesa | `#A23B55` | CTA y foco de conversión |
| Mantequilla | `#F1C36D` | datos, porciones y acentos con texto cacao |
| Bosque | `#48604C` | territorio, cobertura y origen |
| Miga | `#EAD9C7` | bordes y superficies secundarias |

Antes de codificar, los pares de color se validan contra WCAG. No se usa blanco sobre Mantequilla. No hay tema oscuro.

### Tipografía propuesta

- **Titulares y nombres de torta:** Fraunces Variable, con uso contenido.
- **Cuerpo, navegación y formularios:** Public Sans.
- **Datos:** Public Sans con números tabulares; no se agrega una tercera familia.

Las fuentes se autoalojan en WOFF2, con subconjuntos y pesos mínimos. Si las fotografías reales y la ficha no sostienen una identidad propia, se debe revisar Fraunces antes de implementar, porque serif + fondo cálido puede caer en un patrón gastronómico genérico.

### Forma y movimiento

- radios moderados de 6–12 px;
- bordes finos y sombras solo para elevación real;
- no glassmorphism, píldoras decorativas, emojis como iconos ni degradados sin función;
- transiciones de `opacity` y `transform` entre 180–260 ms;
- ninguna animación esencial y estado final inmediato bajo `prefers-reduced-motion: reduce`.

## 4. Navegación global

### Escritorio

- marca: `Donde Betty` + `Tortas de Pucura`;
- enlaces: `Tortas`, `Cómo encargar`, `Betty`, `Contacto`;
- CTA persistente: `Encargar una torta`;
- sin enlace público al CMS.

### Móvil

- marca legible, CTA breve y botón de menú con área 44 × 44 px;
- `aria-expanded`, `aria-controls`, cierre con Escape y al navegar;
- al cerrar, los enlaces quedan fuera del orden de foco;
- el CTA flotante inferior solo se usa si no tapa contenido, banners o foco; de lo contrario se mantiene en header y secciones.

Todas las anclas consideran el header sticky mediante `scroll-margin-top`. Debe existir “Saltar al contenido”.

## 5. Landing `/`

### 5.1 Hero

Contenido mínimo:

- `Donde Betty · Tortas de Pucura`;
- H1: `Una torta de la que quieres otro pedazo`;
- apoyo: tortas caseras, frescas, hechas a pedido, con sabor primero y dulzor equilibrado;
- CTA principal: `Encargar una torta`;
- CTA secundario: `Ver todas las tortas`;
- nota de anticipación confirmada en `G-PROD-02`; como base documental: `Pide con al menos 1 día de anticipación. Mismo día sujeto a disponibilidad.`;
- fotografía real prioritaria con dimensiones reservadas;
- ficha de encargo como explicación funcional.

No se incluyen ratings, número de clientes, “horneado diario”, promociones ni disponibilidad ficticia.

**Aceptación:** en viewport 390 × 844 CSS px, marca, producto, origen, política de anticipación y CTA aparecen antes de 1266 px de desplazamiento vertical y sin scroll horizontal.

### 5.2 Motivos para elegir

Un bloque breve, no una colección de badges:

- sabor antes que apariencia;
- dulce en equilibrio;
- fresco y hecho para el pedido;
- oficio, buenos ingredientes y atención cercana.

Cada punto debe tener una frase concreta, no lenguaje publicitario vacío.

### 5.3 Tortas destacadas

- 3–6 tarjetas según contenido disponible;
- orden definido en CMS;
- la primera puede ser el producto insignia confirmado;
- CTA de tarjeta contextual;
- enlace claro a `/catalogo`.

La landing no duplica todo el catálogo ni muestra filtros innecesarios.

### 5.4 Cómo encargar

Secuencia real, por lo que la numeración sí comunica orden:

1. Elige una torta o cuéntanos qué celebración tienes.
2. Conversa por WhatsApp sobre sabor, porciones, fecha y personalización.
3. Betty confirma disponibilidad, precio y condiciones.
4. Se prepara a pedido y se coordina retiro o despacho.

No se afirma que abrir WhatsApp confirme el paso 3.

### 5.5 Betty y el oficio

- fotografía real de Betty o de su trabajo, con consentimiento;
- historia resumida y verificable;
- foco en experiencia, recomendación y cuidado del sabor;
- enlace opcional a una historia ampliada solo si existe contenido suficiente.

### 5.6 Pucura y frutos del sur

- origen y cobertura;
- frutos locales solo vinculados a productos que realmente los usan;
- mapa solo si la ubicación es pública y aporta valor;
- si el retiro se coordina de forma privada, no revelar domicilio.

### 5.7 Contacto y redes

- WhatsApp como acción primaria;
- Instagram como descubrimiento;
- otras redes solo si hay perfil real y activo;
- horarios y cobertura confirmados;
- CTA final con el mismo constructor centralizado.

### 5.8 Footer

Footer comercial corto con marca, origen, navegación, canales reales, copyright y enlaces legales que correspondan. Sin stack, VPS, CMS, badges tecnológicos o perfiles genéricos.

## 6. Catálogo `/catalogo`

### Encabezado

- H1 descriptivo: `Tortas hechas a pedido`;
- explicación de anticipación y precios orientativos;
- acceso rápido a WhatsApp sin competir con exploración.

### Exploración

- grid de todas las tortas publicadas;
- orden editorial estable;
- filtros únicamente si hay una taxonomía real (por ejemplo, bizcocho/hojarasca/merengue) validada por Betty;
- búsqueda de texto opcional si supera aproximadamente 20 productos;
- filtro y orden representados en query string;
- resultado y cambios anunciados a tecnologías de asistencia.

Con doce tortas iniciales, la línea base es una sola lista ordenada sin paginación. La API puede aceptar `limit` por seguridad, pero la UI no muestra paginador innecesario.

### Tarjeta de torta

- relación de imagen consistente y dimensiones reservadas;
- nombre como enlace a la ficha;
- descripción breve de máximo aproximado 160 caracteres;
- variantes/porciones resumidas;
- `Desde $X` o `Precio a consultar` como decisión explícita;
- etiqueta `Destacada` solo cuando tiene significado editorial;
- `Consultar por esta torta` con nombre accesible completo.

No se muestran estrellas, ratings, stock, tiempo “24h” por producto ni etiquetas inventadas.

### Estados

- **Carga:** esqueleto con espacio reservado, no spinner con detalles técnicos.
- **Error:** mensaje concreto y botón `Intentar de nuevo`; WhatsApp permanece disponible.
- **Vacío por filtro:** explica qué filtro no tuvo resultados y permite limpiarlo.
- **Catálogo vacío:** no se lanza a producción; en contingencia, muestra contacto y no una pantalla rota.

## 7. Ficha `/catalogo/[slug]`

Orden recomendado:

1. breadcrumb accesible;
2. nombre y descripción breve;
3. portada/galería;
4. ficha de encargo: variantes, porciones, precio, anticipación y personalización;
5. descripción completa y datos confirmados;
6. conservación y alérgenos/trazas si fueron validados;
7. CTA contextual a WhatsApp;
8. tortas relacionadas, solo con criterio real y máximo 3.

El CTA debe permanecer cerca de la información de decisión en móvil. Si una torta deja de publicarse, la ruta no muestra datos privados; se usa 404 o redirect según exista reemplazo editorial.

## 8. Contacto y ruta `/contacto`

La sección `#contacto` en la landing es obligatoria. `G-PROD-01` decide si `/contacto` renderiza una página propia con el contenido siguiente o redirige de forma estable a la sección. Contenido:

- WhatsApp y horario de respuesta;
- Instagram y otras redes confirmadas;
- Pucura como origen;
- localidades y condiciones de despacho verificadas;
- modalidad y horario de retiro;
- anticipación;
- aclaración de que disponibilidad y precio final se confirman en conversación.

No se implementa formulario de contacto en MVP: añadiría datos personales, spam y otra bandeja operativa sin mejorar el flujo preferido. Si solo existe la sección de landing, canonical y sitemap no incluirán una página `/contacto` independiente.

## 9. Comportamiento responsive

Matriz mínima: 375, 390, 768, 1024 y 1440 px.

- El layout fluye por contenido; no se diseña solo para puntos exactos.
- Sin scroll horizontal a zoom 400 %.
- Textos no se truncan si contienen precio, porciones o acciones.
- La galería y los controles mantienen orden de foco lógico.
- No se oculta información comercial esencial solo en móvil.
- Hover nunca es la única forma de revelar acciones.

Wireframe conceptual:

```text
ESCRITORIO
┌──────────────────────────────────────────────────────────┐
│ Donde Betty · Tortas de Pucura   Tortas  Betty  [Pedir]│
├──────────────────────────────┬───────────────────────────┤
│ Tesis + promesa + CTA        │ foto real + ficha pedido │
├──────────────────────────────┴───────────────────────────┤
│ Sabor / equilibrio / a pedido / oficio                  │
├──────────────────────────────────────────────────────────┤
│ Destacadas (resumen)                         [Ver todas]│
├──────────────────────────────────────────────────────────┤
│ Elegir → conversar → confirmar → preparar/entregar      │
├──────────────────────────┬───────────────────────────────┤
│ Betty y su oficio        │ Pucura y cobertura           │
├──────────────────────────┴───────────────────────────────┤
│ Contacto + CTA final + footer                           │
└──────────────────────────────────────────────────────────┘

MÓVIL
┌──────────────────────────────┐
│ Donde Betty  [Pedir] [Menú] │
│ Tesis + promesa             │
│ [Encargar] [Ver tortas]     │
│ Foto real                   │
│ Ficha de encargo            │
│ Motivos                     │
│ Tortas destacadas           │
│ Cómo encargar               │
│ Betty / Pucura / contacto   │
└──────────────────────────────┘
```

## 10. Accesibilidad funcional

- Un solo H1 por página y headings sin saltos arbitrarios.
- Landmarks `header`, `nav`, `main`, `footer` y etiquetas accesibles.
- `alt` describe la torta o acción visible; las decoraciones usan `alt=""`/`aria-hidden`.
- Carrusel, si se usa, debe funcionar sin autoplay; se prefiere galería simple.
- Filtros usan botones con `aria-pressed` o controles nativos coherentes.
- Estados asíncronos usan `aria-live` sin anunciar cada tecla.
- El foco se mueve de forma predecible tras login, guardado, error y apertura/cierre de diálogos.
- Mensajes de formulario identifican campo, problema y corrección.
- Contraste de texto normal ≥4,5:1 y foco/componentes ≥3:1.

## 11. Criterios de aceptación de experiencia

- Un visitante entiende la especialización en tortas sin inferirla desde imágenes.
- Puede pasar de landing a una torta y abrir WhatsApp con el producto correcto.
- La navegación pública no expone el CMS.
- Toda acción tiene etiqueta basada en su resultado, no `Ver más` repetido sin contexto.
- No hay contenido técnico o ficticio en páginas públicas.
- La experiencia funciona con teclado, touch, lector de pantalla y reducción de movimiento.
- La ficha de encargo aporta datos reales; si no los hay, no se usa como decoración vacía.
- La implementación visual deriva de estos tokens o documenta un cambio aprobado.
