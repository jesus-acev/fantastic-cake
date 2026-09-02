# Producto, marca y contenido

Última revisión: 2026-09-01  
Estado: `base documental auditada + vigencia operativa pendiente`

## 1. Fuente y resolución de naming

Esta especificación sintetiza [`internos/ADN-marca.md`](../internos/ADN-marca.md) para que la implementación tenga una referencia versionable y accionable. No sustituye el documento estratégico original. Los identificadores que no deben publicarse están en [`internos/DATOS-PRIVADOS-SPECS.md`](../internos/DATOS-PRIVADOS-SPECS.md), ignorado por Git.

| Elemento | Decisión |
|---|---|
| Razón social | Dato interno; ver [`DATOS-PRIVADOS-SPECS.md`](../internos/DATOS-PRIVADOS-SPECS.md) |
| Marca comercial | Donde Betty |
| Descriptor/slogan | Tortas de Pucura |
| Fundadora y voz humana | Betty, nombre público de la marca; identidad civil en [`DATOS-PRIVADOS-SPECS.md`](../internos/DATOS-PRIVADOS-SPECS.md) |
| Origen | Pucura, Región de La Araucanía, Chile |
| Foco | Tortas caseras hechas a pedido |
| Mercado inicial | Pucura; Lican Ray, Coñaripe y Villarrica figuran como objetivo de crecimiento/despacho, no como cobertura actual garantizada |

La marca comercial fue confirmada después de la versión 1.0 del ADN, que aún presentaba varios nombres candidatos. En contenido público se usa **Donde Betty**. La razón social se usa solo cuando exista una necesidad legal o documental.

## 2. Núcleo estratégico

### Regla de oro

> El sabor no se negocia.

### Esencia

> Una torta de la que quieres otro pedazo.

### Promesa

Una torta casera, fresca y hecha con buenos ingredientes, donde el sabor siempre está primero.

### Propuesta de valor

Tortas caseras, frescas y hechas a pedido, con sabores reconocibles y dulzor equilibrado, pensadas para compartir y para terminar el trozo con ganas de repetir.

### Diferenciadores demostrables

- oficio y experiencia real de Betty;
- preparación ligada al pedido, no a producción masiva;
- sabor antes que decoración;
- dulzor, cremas y rellenos equilibrados;
- estándar mínimo de ingredientes y frescura;
- cercanía y orientación directa;
- posibilidad de usar frambuesa, arándano y murta/murtilla local en preparaciones confirmadas.

No se transformarán estos diferenciadores en afirmaciones absolutas no demostradas como “los mejores ingredientes”, “100 % natural”, “sin conservantes” o “la mejor torta de la región”.

## 3. Público y ocasiones

### Público primario

Familias, especialmente madres y padres que organizan cumpleaños y celebraciones. Buscan una torta:

- rica y confiable;
- de precio razonable;
- bonita sin sacrificar sabor;
- fácil de encargar;
- apropiada para compartir;
- con orientación sobre porciones, sabores y logística.

### Ocasiones primarias

- cumpleaños;
- celebraciones y reuniones familiares;
- encargos para compartir en casa;
- fechas especiales, solo si el negocio confirma capacidad y oferta.

La marca debe sentirse buena y accesible, nunca barata, masiva, lujosa ni pretenciosamente “de autor”.

## 4. Personalidad y voz

| Rasgo | Cómo se expresa | Qué se evita |
|---|---|---|
| Sencilla | frases directas, información concreta | tecnicismos, grandilocuencia |
| Elegante | orden, detalle, buen criterio visual | lujo distante, exceso ornamental |
| Creativa | opciones y adaptación explicadas | prometer personalización ilimitada |
| Generosa | lenguaje de compartir y disfrutar | presión de venta o escasez falsa |
| Tradicional | sabores reconocibles y oficio | nostalgia artificial o aspecto descuidado |
| Sureña | Pucura, frutos, territorio y relato real | clichés turísticos sin relación con el producto |
| Cercana | “Conversemos por WhatsApp” | voz corporativa o trato infantilizado |

### Reglas de redacción

- Escribir desde lo que el cliente necesita decidir.
- Usar verbos concretos: “Ver catálogo”, “Consultar por esta torta”, “Guardar cambios”.
- Hablar de tortas “hechas a pedido”; no de “menú fresco del día”.
- Decir “precio desde” u “orientativo” cuando la personalización puede cambiarlo.
- Separar hechos de posibilidades: “puede personalizarse” solo si el negocio define qué admite.
- Evitar anglicismos y detalles técnicos en la superficie pública.
- No mostrar “CMS”, “Nuxt”, “PostgreSQL”, “VPS” o métricas técnicas al cliente.
- No usar urgencia, stock o prueba social ficticia.

## 5. Catálogo documentado y nivel de información

El ADN confirma la existencia histórica o potencial de estos sabores:

| Torta | Estado inicial en CMS | Información aún requerida |
|---|---|---|
| Tres leches | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Selva negra | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Piña | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Durazno | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Mil hojas | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Moka | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Merengue frambuesa | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Panqueque naranja | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Pompadour | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Trufa | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Chocolate/frambuesa | borrador | descripción, variantes, porciones, precio, foto, personalización |
| Frutos rojos | borrador/candidata a insignia | descripción, composición, origen de frutos, variantes, precio, foto |

Crear seeds en estado `draft` no equivale a autorizar su publicación. Tartaletas, panecillos y otras preparaciones quedan fuera del catálogo principal del MVP salvo decisión expresa posterior.

## 6. Jerarquía de mensajes públicos

### Hero

Debe comunicar, en este orden:

1. marca y origen: Donde Betty · Tortas de Pucura;
2. tesis: “Una torta de la que quieres otro pedazo”;
3. explicación: caseras, hechas a pedido, con sabor y dulzor equilibrado;
4. CTA: “Encargar una torta”;
5. condición de anticipación validada en `G-PROD-02`; la línea documental es al menos un día y mismo día sujeto a disponibilidad;
6. fotografía real de una torta/corte y una ficha de encargo útil.

### Catálogo

Cada tarjeta debe responder rápidamente:

- qué torta es;
- qué sabor o composición principal tiene;
- para cuántas personas o qué tamaños ofrece;
- cuánto cuesta desde, o que el precio debe consultarse;
- cómo iniciar la consulta.

### Historia

Relato base permitido, sujeto a revisión de Betty:

- formación técnica en gastronomía y pastelería;
- experiencia profesional en Tavelli hace aproximadamente 25 años;
- alrededor de 10 años preparando tortas por encargo;
- crecimiento por recomendación;
- formalización para llegar a más familias sin perder calidad.

Si se publican cifras de años, deben redactarse de forma que no queden falsamente exactas con el paso del tiempo o actualizarse desde contenido administrable.

### Territorio

Pucura se expresa mediante origen, entrega, ingredientes locales cuando correspondan, fotografía y vida cotidiana. No se inventarán proveedores ni se usarán volcanes, maderas rústicas o símbolos mapuche como decoración si no existe una relación real y autorizada.

## 7. Flujo y copy de WhatsApp

### Constructor único

Formato técnico:

```text
https://wa.me/<numero_E164_solo_digitos>?text=<mensaje_codificado>
```

El número se obtiene de configuración validada. Si falta, los CTA no se publican como enlaces rotos y el lanzamiento queda bloqueado.

### Mensajes base

Hero/contacto, sin pedir al visitante que edite placeholders:

```text
Hola, Betty. Vi tu página y quisiera encargar una torta. ¿Me puedes orientar con sabores, porciones y disponibilidad?
```

Ficha de torta:

```text
Hola, Betty. Vi la torta “[nombre real de la torta]” en tu catálogo. ¿Me puedes confirmar opciones, porciones, precio y disponibilidad?
```

El constructor reemplaza únicamente el nombre real de la torta. No envía `[fecha]`, `[personas]` ni otros marcadores literales. La fecha y cantidad de personas se conversan dentro de WhatsApp porque el MVP no incorpora formulario previo. Nunca se inserta información personal del visitante sin una acción explícita.

### Etiquetas coherentes

- Hero/header: `Encargar una torta`.
- Tarjeta: `Consultar por esta torta`.
- Ficha: `Consultar disponibilidad por WhatsApp`.
- Contacto: `Conversar por WhatsApp`.

Abrir WhatsApp significa iniciar una conversación, no reservar, comprar ni confirmar.

## 8. Matriz de contenido obligatorio

### Negocio

| Dato | Estado | Responsable | Bloquea publicación |
|---|---|---|---|
| WhatsApp E.164 | pendiente | propietario | sí |
| Instagram real | pendiente | propietario | no; se omite si falta |
| Facebook/TikTok u otras redes | pendiente | propietario | no; se omiten |
| correo público | pendiente | propietario | no |
| ubicación pública exacta | pendiente | propietario | sí para mapa/dirección; no si se declara retiro coordinado |
| horario de consultas | pendiente | propietario | sí para mostrar horario |
| horario/modalidad de retiro | pendiente | propietario | sí para prometer retiro |
| zonas de despacho actuales | pendiente; el ADN solo documenta objetivos | propietario | sí para detalle operativo |
| costo/condición de despacho | pendiente | propietario | sí para prometer precio |
| dominio | pendiente | propietario/desarrollo | sí para producción/SEO |

### Comercial

| Dato | Estado | Bloquea la torta |
|---|---|---|
| nombre | disponible para 12 sabores | sí |
| descripción breve real | pendiente | sí |
| descripción completa | pendiente | sí para ficha indexable |
| variantes/tamaños | pendiente | sí |
| porciones | pendiente | sí o indicar explícitamente “consultar” |
| precio CLP | pendiente | sí o marcar deliberadamente “consultar” |
| personalización permitida | pendiente | no, si se omite la promesa |
| anticipación específica | pendiente | no; hereda la política global una vez validada en `G-PROD-02` |
| portada real y permiso | pendiente | sí |
| galería | pendiente | no |
| ingredientes/alérgenos/trazas | pendiente | sí para afirmar detalles alimentarios |
| conservación | pendiente | sí para mostrar recomendaciones |
| destacada/orden | pendiente | sí para landing, no para catálogo completo |

### Marca y activos

- logo en SVG y variantes permitidas;
- fotografía hero horizontal y recorte móvil;
- fotografías por torta, idealmente corte y exterior;
- consentimiento de personas reconocibles;
- guía de uso del nombre y razón social;
- favicon e imagen social por defecto.

## 9. Política de placeholders

Se permiten placeholders solo en desarrollo y deben ser inequívocos, por ejemplo `PENDIENTE_WHATSAPP`; no se permiten números plausibles, precios ficticios, perfiles genéricos ni fotos de banco presentadas como producto real.

En producción:

- un campo opcional ausente se omite;
- un campo comercial requerido impide publicar esa torta;
- un ajuste crítico ausente falla el checklist de release;
- nunca se reemplaza un vacío con una afirmación inventada.

## 10. Criterios de aceptación editorial

- Todo texto puede rastrearse al ADN y, cuando describe operación vigente, a una validación actual del propietario.
- La página se centra en tortas; productos ocasionales no compiten visualmente.
- El tono es cercano, claro y chileno sin caricatura regional.
- Todos los precios usan `Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })`.
- Ningún CTA promete disponibilidad o confirmación automática.
- Cada fotografía tiene permiso, propósito y texto alternativo útil.
- El nombre Donde Betty, el descriptor Tortas de Pucura y el origen se usan de manera consistente.
