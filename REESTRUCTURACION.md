# Plan de reestructuración comercial — axchisan.com

> **Estado:** aprobado con las decisiones de la sección 8, 24 de septiembre de 2026. Los precios
> se rigen por [`PRECIOS.md`](PRECIOS.md). Sustituye como guía de trabajo a `PLAN.md` (ahora en `docs/historial/`,
> reconstrucción ya cumplida) y a `ROADMAP.md` (borrado). Nada se desarrolla fuera de este
> documento sin actualizarlo primero.

## Avance

| Fase | Estado |
|---|---|
| F0 · Saneamiento | **Hecha** (24 sep 2026): nombre "Axchi", WhatsApp en una sola constante, documentos obsoletos retirados, hooks y 6 dependencias sin uso eliminados, ajustes muertos del panel retirados, iconos y OG generados desde el logo (`npm run iconos`, `npm run og`), `/favicon.ico` servido. Pendiente: 13 errores de lint anteriores a esta fase (`any` en rutas de API y `setState` en efectos), se corrigen al tocar esos archivos |
| Precios | **Revisado el 24 sep 2026**: techo de $3.000.000 y suscripciones desde $39.900 al mes (`PRECIOS.md`, `lib/catalogo/planes.ts`) |
| F1 · Documentos | **Hecha**: `DESIGN.md` y `MARCA.md` reescritos, guía de voz en `DESIGN.md`, brief de Canela, licencias, `README.md`. Pendiente: `SEO.md` parte 5 (consultas por sector) |
| F2 · Infraestructura | **Hecha**: demos comunes, catálogo en código, plantilla de ficha, capturas reales, cotización con campos propios en la base y medición del embudo (visitas, demos, WhatsApp, cotizaciones) en el tablero del panel |
| F3 · Sitio comercial | **Hecha** (24 sep 2026): portada, `/soluciones` y fichas, `/planes`, `/a-medida`, `/proceso`, `/empresa`, `/cotizar` con formulario calificado, `/guias`, redirecciones 308 en un salto, sitemap nuevo, WhatsApp flotante en celular. Proyectos de GitHub retirados del sitio público (siguen en el panel) |
| Correo `@axchisan.com` | **Hecho**: `contacto@axchisan.com` en Zoho Mail, en el sitio y como destino de los avisos. Falta el registro DMARC (`docs/correo-dominio.md`) |
| F4a · Canela | **Hecha**: portada, reserva en cuatro pasos, panel con Hoy, Agenda, Pacientes, ficha clínica, consulta con fórmula imprimible, Recordatorios y Resumen. 20 pruebas E2E en escritorio y celular, incluida WCAG AA |
| F4b · Peine Fino | **Hecha**: segunda demo del motor de agenda (`demos/motores/agenda/`, extraído de Canela). Salón y barbería con reserva de varios servicios, agenda por profesional, caja con comisiones, fórmulas de color y clientes que no vuelven. Ficha `/soluciones/salones-y-barberias`. 18 pruebas E2E |

## 0. En cinco líneas

1. El sitio deja de demostrar **quién es el desarrollador** y pasa a demostrar **qué recibe el negocio**.
2. El centro del sitio es un **catálogo de demostraciones funcionales por tipo de negocio**: el dueño de un restaurante, una tienda o una veterinaria entra, abre la demo de su sector y la usa como si fuera suya.
3. Las demos se construyen sobre **motores reutilizables con pieles por sector**. Así un catálogo amplio es sostenible, y el mismo motor es lo que después se entrega al cliente, más rápido y más barato.
4. Los proyectos de GitHub salen del sitio. La única muestra externa que se conserva es **Jabones Mari** (`jabonesmari.shop`), como ejemplo real de tienda de cosméticos.
5. Antes de construir nada, se limpian los residuos (documentación contradictoria, iconos desactualizados, código muerto, pruebas rotas) y se resuelve el hosting comercial.

---

## 1. Diagnóstico

### 1.1 Posicionamiento

| Hallazgo | Evidencia | Consecuencia |
|---|---|---|
| El sistema de diseño está escrito para otro público | `DESIGN.md` define la audiencia como "CTOs, líderes de ingeniería, reclutadores" y el principio "sin hero de marketing" | Toda decisión que se tome con ese documento en la mano empuja hacia un portafolio, no hacia una tienda de servicios |
| La prueba del sitio son proyectos personales | Home: "0,01 USD al mes", "1 paso manual", "10 sistemas" (`app/page.tsx:57-75`), todos de proyectos propios | A un dueño de restaurante no le dice nada que una app de finanzas personal cueste un centavo al mes |
| El copy sin commit se volvió corporativo y abstracto | "Soluciones de software listas para operar", "orquestación", "trazabilidad", "criterios de operación" | Lenguaje de proveedor B2B. El cliente objetivo (pyme) no busca eso ni lo entiende. Además rompe el principio de `DESIGN.md` de que cada afirmación lleve un número |
| La voz está mezclada | "Escríbeme" (`header.tsx:105`, `sobre/page.tsx:122`, `blog/[slug]/page.tsx:113`), "Cuéntame un poco más" y "Te respondo pronto" (`contact-form.tsx`), "Evaluaré" (`app/page.tsx`), junto a "Axchi Software Solutions revisará" | Se lee como sitio a medio migrar |
| El nombre no es uno | `SITE_NAME` = "Axchi Software Solutions", pero `og.png`, `manifest.short_name`, panel y login dicen "Axchi" | Ver decisión D2 |
| "Agendar una llamada" no agenda nada | `footer.tsx:95` y todos los botones a `/contacto#agendar` llevan a un formulario | Promesa incumplida en el primer clic |

### 1.2 Contenido

Los 10 proyectos publicados (`prisma/refresh-portfolio.ts`) se dividen así:

| Grupo | Proyectos | Propuesta |
|---|---|---|
| Todos los proyectos de GitHub | Los 10 publicados | Salen del sitio, con redirección 308 (decisión D4) |
| Muestra externa | Jabones Mari, tienda de cosméticos en producción | Entra al catálogo como ejemplo real del motor Catálogo |

### 1.3 Iconos e imagen de marca

| Pieza | Estado | Qué hacer |
|---|---|---|
| `LogoMark` (`components/site/logo.tsx`) | Correcto: la cinta de tres caras | Es la fuente de verdad; todo lo demás se deriva de él |
| `public/icon-512.png`, `apple-icon.png`, `favicon-64.png` | Coinciden con la cinta | Regenerar desde el SVG por script para que no vuelvan a divergir |
| `/favicon.ico` | **404 en producción** (comprobado con `curl`) | Muchos rastreadores y lectores de RSS lo piden a ciegas. Generarlo con 16, 32 y 48 px |
| Icono SVG | No existe | Añadir `app/icon.svg` para una pestaña nítida a cualquier densidad |
| Icono enmascarable | El 512 solo declara `purpose: "any"` | Añadir variante `maskable` con zona segura, para Android |
| `public/og.png` | Dice "Axchi — Software a medida para empresas — Alcance y precio cerrados antes de empezar" | Desactualizada frente al copy y al nombre. Regenerar, y crear una por sector |
| `LogoMarkPlano` | Exportado y sin ningún uso | Usarlo donde corresponde (impresión, fondo claro) o borrarlo |
| Panel y login | "Axchi admin" / "Axchi" | Alinear con D2 |
| Iconografía de interfaz | lucide-react, sin regla escrita | Fijar regla (sección 6.3) antes de añadir iconos de sector |

### 1.4 Residuos técnicos y documentales

| Tipo | Elemento | Acción |
|---|---|---|
| Documento obsoleto | `ROADMAP.md` (Coolify, "blog como objetivo #1", repo privado) | Borrar |
| Documento cumplido | `PLAN.md` (reconstrucción) — además recomienda "posicionar como portafolio" | Mover a `docs/historial/` |
| Documento desactualizado | `MARCA.md` §2 y §6 describen el logo como "A con vértice plano, marcador de posición" | Reescribir como guía de marca final |
| Documento desactualizado | `DESIGN.md`: acento azul `#3454D1`, modo claro y oscuro, audiencia técnica | Reescribir (sección 6) |
| Documento desactualizado | `README.md`: "Portafolio y blog de Duvan" | Actualizar |
| Documento a revisar | `SEO.md` parte 5: consultas genéricas | Rehacer por sector (sección 5.7) |
| Archivo temporal | `.tmp-l.mjs` (script para renderizar el logo) | Convertir en `scripts/iconos.ts` o borrar |
| Comentarios de otra plataforma | "presupuesto del Worker", "runtime de Workers" en `app/layout.tsx:36`, `lib/storage.ts:14,116,218`, `lib/prisma.ts:8` | Reescribir para Vercel (D1) |
| Hooks sin uso | Los 5 archivos de `hooks/` no se importan en ningún sitio | Borrar |
| Dependencias sin uso | `geist`, `motion`, `@neondatabase/serverless`, `react-hook-form`, `date-fns` | Desinstalar |
| Modelos sin uso | `Like`, `Favorite`, `SiteAnalytics` sin lecturas; `Comment` solo se cuenta; `User.role VISITOR` | Retirar con migración, o reutilizar `SiteAnalytics` para la analítica de demos (5.6) |
| Doble fuente de verdad | Servicios en `lib/servicios.ts` **y** en la tabla `Service` (`getServices` en `lib/data.ts:140` no se usa en ninguna página) | Una sola fuente: el catálogo en código (5.2) |
| Ajustes que no llegan a ningún sitio | `years_experience` y `clients_count` se editan en el panel; ninguna página pública los lee. El texto de ayuda habla de "Detrás del studio" | Borrar o conectar |
| Número de WhatsApp en cuatro formatos | `lib/site.ts` (con 57), BD (sin 57, concatenado en `contacto/page.tsx:57`), `footer.tsx:37` (constante propia), JSON-LD de `layout.tsx` (literal) | Una sola constante normalizada en E.164 |
| Pruebas rotas | `e2e/publico.spec.ts:114-115` espera "Ideas" y "Quién está detrás" en la navegación | Se actualizan con la nueva navegación |
| Seeds con texto viejo | `prisma/seed.ts:135` "Portafolio personal…", `seed-content.ts:10` | Actualizar o retirar |
| Tipos de Node | `@types/node ^20` con Node 24 en local y en Vercel | Subir a `^24` |
| Cambios sin commit | 18 archivos con el cambio de nombre y el tono corporativo | Ver F0: se conserva lo que sirve, el copy se reescribe en F3 |

### 1.5 Infraestructura

**Vercel Hobby prohíbe el uso comercial**, y el sitio ahora vende servicios. `PLAN.md` ya lo había
anotado como riesgo cuando el sitio iba a ser un portafolio. Con el catálogo el riesgo pasa a ser
un incumplimiento, y la cuenta puede suspenderse sin aviso.

**Decisión (D1): se mantiene Vercel Hobby.** Riesgo aceptado. Si llega un aviso de Vercel, el paso
a Pro (20 USD/mes) es inmediato y no requiere cambiar código. Mientras tanto, las páginas de
clientes **no** se alojan en esta cuenta: van en la cuenta de cada cliente (ver `PRECIOS.md` §5).

---

## 2. Estrategia comercial

### 2.1 A quién le vende el sitio

Por orden de volumen probable:

1. **Dueño de un negocio pequeño o mediano** (restaurante, tienda, salón de belleza, veterinaria, consultorio). No técnico. Llega desde Google, Instagram o una recomendación, casi siempre desde el celular. Se pregunta: *¿esto me sirve a mí? ¿cuánto cuesta? ¿es de fiar?*
2. **Negocio con una operación que se le desborda** (inventario en Excel, pedidos por WhatsApp que se pierden, citas en cuaderno). Busca un sistema, no una página.
3. **Empresa con un proyecto a medida** (integración, automatización, app). Es el cliente actual de `/servicios`: se mantiene, pero ya no es la puerta principal.

### 2.2 La promesa

> **Mira funcionando lo que tendría tu negocio, antes de pagar nada.**

El diferencial frente a otros desarrolladores o agencias no es la tecnología, que el cliente no
evalúa. Es que **no tiene que imaginarse el resultado**: lo abre, lo toca en su celular y se lo
enseña a su socio. Una demo que funciona vale más que diez capturas y que cualquier texto de venta.

### 2.3 El recorrido que el sitio debe provocar

```
Llega (Google / Instagram / WhatsApp)
  → se reconoce en su sector            "Páginas y sistemas para restaurantes"
  → abre la demo y la usa               pide un plato, reserva, ve el panel
  → entiende qué incluye y cuánto vale  planes con precio desde y plazo
  → escribe                             WhatsApp con la demo ya nombrada en el mensaje
```

Cada página se juzga por si mueve a la persona un paso en esa cadena.

### 2.4 Voz

- **Lenguaje de negocio, no de ingeniería.** "Tus clientes piden desde el celular y el pedido te llega completo por WhatsApp", no "flujo de pedidos con integración de mensajería".
- **Concreta y con cifras**, que es lo que sí se conserva del sistema actual: plazos en semanas, precios desde, costo mensual de operación.
- **Honesta sobre el tamaño.** Axchi es un estudio de una persona. No se escribe "nuestro equipo". La marca habla ("En Axchi…", "Te entregamos…" solo si se decide así en D3), y la página de empresa dice con claridad quién está detrás: para una pyme, hablar con quien construye es una ventaja, no una debilidad.
- La parte técnica existe, pero en un segundo nivel ("Detalles técnicos" desplegable en cada ficha, `/servicios` para empresas).

---

## 3. Arquitectura de información

### 3.1 Mapa de rutas

| Ruta | Qué es | Indexa | Sustituye a |
|---|---|---|---|
| `/` | Inicio orientado a sectores y demos | Sí | — |
| `/soluciones` | Catálogo completo, filtrable por sector y por tipo de solución | Sí | — |
| `/soluciones/[slug]` | **Ficha**: una por sector (`restaurantes`, `tiendas-de-ropa`…) o por sistema transversal (`inventario-y-ventas`) | Sí | — |
| `/demo/[slug]` y subrutas | **La demo en vivo** de un negocio ficticio, con su propio diseño | No (`noindex, follow`, canónica a la ficha) | — |
| `/planes` | Tipos de solución con precio desde, plazo, qué incluye y costo mensual | Sí | `/servicios` (redirección 308) |
| `/a-medida` | Desarrollo a medida para empresas: automatización, IA, integraciones, infraestructura. Lo que hoy es `/servicios` | Sí | — |
| — | No hay sección de casos mientras no existan clientes que mostrar. Jabones Mari vive dentro del catálogo | — | `/trabajo` → `/soluciones` (308) |
| `/proceso` | Cómo se trabaja, en lenguaje de cliente, con garantías | Sí | — |
| `/empresa` | Quién está detrás, cómo trabaja el estudio | Sí | `/sobre` (308) |
| `/guias` y `/guias/[slug]` | Artículos para dueños de negocio ("¿cuánto cuesta una página para mi restaurante?") | Sí | `/blog` (308) |
| `/cotizar` | Formulario calificado + WhatsApp | Sí | `/contacto` (308) |
| `/privacidad`, `/terminos` | Legales | Sí | — |

Las URLs de proyectos personales ya indexadas (`/trabajo/tecnobichos`…) redirigen con 308 a
`/soluciones` o a la ficha más cercana, nunca a un 404 (regla de `SEO.md`).

> Los nombres de ruta en español y en plural siguen la convención actual. Si en D5 se prefiere
> conservar `/servicios` y `/contacto` por la poca antigüedad que tienen en el índice, se cambia
> solo esta tabla.

### 3.2 Navegación

- **Cabecera:** Soluciones · Planes · Proceso · botón principal **Cotizar** · botón WhatsApp.
  (El punto medio aquí es notación del documento; en la interfaz van como enlaces separados.)
- **Soluciones** abre un panel con los sectores agrupados y su icono, más "Ver todo el catálogo".
- **Pie:** sectores, planes, a medida, guías, empresa, legales, contacto directo.
- **Móvil:** botón fijo de WhatsApp en la esquina inferior, porque es el canal que la pyme colombiana ya usa. Se oculta dentro de las demos, que tienen su propia barra.

### 3.3 Inicio

1. **Apertura:** la promesa (2.2) en una frase, subtítulo con qué se hace (páginas, tiendas, sistemas, apps) y dos acciones: *Ver demos por sector* y *Cotizar por WhatsApp*.
2. **Elige tu tipo de negocio:** rejilla de sectores con icono, cada uno a su ficha. Es la pieza principal de la página.
3. **Demos destacadas:** 3–4 con captura real (escritorio y celular) y botón para abrirlas.
4. **Qué tipo de solución necesitas:** los planes resumidos con precio desde. Ayuda a quien no sabe si necesita una página o un sistema.
5. **Cómo funciona:** el proceso en 4 pasos, con plazos.
6. **Ya en producción:** Jabones Mari, con enlace a la tienda real. Cuando haya clientes, esta sección pasa a ser de casos.
7. **Preguntas frecuentes:** precio, plazos, dominio y hosting, quién lo administra, qué pasa si algo falla.
8. **Cierre:** Cotizar.

`DESIGN.md` decía "el trabajo abre la página". El principio se conserva cambiando el objeto:
**las demos abren la página.**

---

## 4. El catálogo de demostraciones

### 4.1 Motores y pieles

Construir 20 demos independientes es inviable y además no se parece a lo que se venderá. La
propuesta:

| Motor | Qué resuelve | Sectores que lo usan |
|---|---|---|
| **Pedidos** | Menú o carta, carrito, pedido a WhatsApp o pago, reservas de mesa, panel de pedidos | Restaurante, cafetería, panadería, comidas rápidas |
| **Catálogo y tienda** | Productos con variantes (talla, color, tono), filtros, carrito, checkout, pedido a WhatsApp | Ropa, cosméticos, calzado, accesorios, ferretería |
| **Agenda** | Servicios, profesionales, disponibilidad, reserva, recordatorio, panel de citas | Salón y barbería, veterinaria, consultorio, spa, gimnasio |
| **Gestión** | Inventario, ventas o caja, clientes, reportes, alertas | Inventario y ventas, historia clínica veterinaria, cocina |
| **Listados** | Fichas con filtros, mapa, galería, solicitud de visita | Inmobiliaria, concesionario, turismo |
| **Presencia** | Página de servicios profesionales con autoridad y contacto | Abogados, contadores, constructoras, consultorios |

Cada demo = **motor + piel + módulo propio del sector**:

- **Motor:** lógica, estado, componentes funcionales. Se escribe una vez.
- **Piel:** paleta, tipografías, composición de secciones, fotografía y textos. Una por demo. Las pieles deben diferenciarse en **composición**, no solo en color: dos demos del mismo motor no pueden parecer la misma plantilla recoloreada.
- **Módulo del sector:** lo que hace creíble la demo para ese dueño en concreto (tonos de base en cosméticos, carnet de vacunas en veterinaria, tabla de tallas en ropa).

El motor es también **el producto**: cuando un cliente contrata, se parte del motor ya probado.
Eso justifica plazos y precios que una agencia que empieza de cero no puede ofrecer, y es un
argumento de venta en sí mismo.

### 4.2 Anatomía de cada solución

Cada entrada del catálogo tiene cuatro piezas:

1. **Demo en vivo** (`/demo/[slug]`): un negocio ficticio completo, navegable y funcional.
2. **Recorrido guiado:** un modo *Cómo funciona* que, al activarse, numera los elementos de la pantalla y explica cada uno en lenguaje de negocio: *"3 · Tu cliente elige la hora libre; tú no contestas mensajes para cuadrar la cita."* Resuelve el "que los clientes realmente sepan qué es lo que buscan".
3. **Mockups:** capturas en marcos de escritorio, tablet y celular. **Siempre son capturas de la demo real**, generadas por script (4.6), nunca maquetas aparte que prometan algo que no existe.
4. **Ficha** (`/soluciones/[slug]`): la página que vende y la que indexa Google (plantilla en 4.3).

**Barra de demo.** Toda demo lleva una barra fija, discreta, fuera del diseño del negocio ficticio:
indica que es una demostración de Axchi con un negocio ficticio, y ofrece *Cómo funciona*
(activa el recorrido), *Ver planes y precio* (a la ficha) y *Quiero una así* (WhatsApp con el
mensaje "Hola, vi la demo de [nombre] y me interesa algo similar para mi negocio"). Plegable, y
en celular se reduce a un botón.

**Profundidad funcional.** Tres niveles, declarados en la ficha para no prometer de más:

| Nivel | Qué funciona | Ejemplo |
|---|---|---|
| **Navegable** | Todas las páginas, enlaces y formularios con validación; el envío se simula | Página de abogados |
| **Funcional** | El flujo principal completo, con estado: carrito, reserva, pedido | Tienda de ropa, reservas de salón |
| **Sistema** | Parte pública + panel de administración con datos que cambian y persisten en el navegador | Inventario y ventas, veterinaria con fichas |

Los datos de una demo **viven solo en el navegador del visitante** (`localStorage`), sembrados con
datos de ejemplo verosímiles y con botón *Restablecer demo*. Sin backend: coste cero, sin abuso
posible, sin datos personales que proteger, y el visitante puede romperla sin afectar a nadie.
Un "inicio de sesión" de panel es simulado y viene prellenado.

### 4.3 Plantilla de ficha

Orden fijo, para que todas se lean igual y se puedan comparar:

1. **Para quién** — el sector y tres síntomas reconocibles. *"Los pedidos llegan por WhatsApp y se mezclan con los mensajes de la familia. Cambiar un precio del menú es reimprimir la carta."*
2. **Qué obtienes** — tres resultados concretos, con cifra cuando la haya.
3. **Pruébala** — botón a la demo y capturas en escritorio y celular.
4. **Cómo se usa en el día a día** — 3–4 pasos con captura: qué hace tu cliente, qué haces tú.
5. **Qué incluye y qué no** — lista corta y honesta.
6. **Planes** — 2–3 niveles (p. ej. *Página*, *Página + pedidos*, *Sistema completo*) con precio desde, plazo en semanas y costo mensual de operación (dominio, hosting, pasarela).
7. **Tu negocio es el dueño** — dominio, código y datos quedan a nombre del cliente; qué cuesta mantenerlo.
8. **Preguntas frecuentes del sector** — ¿puedo cambiar los precios yo mismo? ¿recibo pagos con Nequi? ¿sirve si no tengo local?
9. **Detalles técnicos** (plegado) — stack, hosting, integraciones. Para quien quiera verlos.
10. **Cotizar** — WhatsApp y formulario con el sector y la demo ya seleccionados.

**Ejemplo, ficha de restaurantes:** síntomas (pedidos perdidos en WhatsApp, carta en PDF que nadie
abre, reservas por teléfono en horas pico); demo *Pedidos* con carta por categorías, platos con
foto y opciones, carrito, pedido armado a WhatsApp con dirección y método de pago, reserva de
mesa, QR para las mesas y panel de cocina con estados *recibido, preparando, enviado*; planes
*Carta digital con QR*, *Carta + pedidos*, *Sistema con panel de cocina*.

### 4.4 Catálogo por olas

Las marcas son **provisionales y ficticias**. Antes de publicar cada una se comprueba que no exista
un negocio real con ese nombre en Colombia (búsqueda en Google Maps y en el RUES).

**Ola 1 — lanzamiento.** Los sectores con más demanda y los tres motores que cubren más sectores.

| # | Sector | Negocio ficticio | Motor | Nivel | Qué se puede hacer |
|---|---|---|---|---|---|
| 1 | Restaurante | *Fogón 45* | Pedidos | Sistema | Carta, pedido a WhatsApp, reservas, QR de mesa, panel de cocina |
| 2 | Tienda de ropa | *Trama* | Catálogo | Funcional | Colecciones, filtros por talla y color, guía de tallas, carrito, checkout simulado con PSE/Nequi |
| 3 | Cosméticos | **Jabones Mari** (real, `jabonesmari.shop`) | Catálogo | En producción | Ya existe: se enlaza y se documenta en su ficha, no se reconstruye |
| 4 | Salón de belleza y barbería | *Navaja & Tijera* | Agenda | Funcional | Servicios con duración y precio, elegir profesional y hora, confirmación |
| 5 | Veterinaria | *Canela* | Agenda + Gestión | Sistema | Citas, ficha de la mascota, carnet de vacunas, recordatorios, panel |
| 6 | Comercio en general | *Inventario y ventas* (sistema, sin marca de sector) | Gestión | Sistema | Productos y stock, caja, ventas del día, alertas de bajo stock, reportes, exportar a Excel |

**Ola 2 — ampliar sectores reutilizando motores.**

| # | Sector | Motor | Nivel |
|---|---|---|---|
| 7 | Consultorio odontológico o médico | Agenda | Funcional |
| 8 | Gimnasio y centro deportivo | Agenda (clases y planes) | Funcional |
| 9 | Inmobiliaria | Listados | Funcional |
| 10 | Servicios profesionales (abogados, contadores) | Presencia | Navegable |
| 11 | Panadería o cafetería | Pedidos (piel distinta al restaurante) | Funcional |
| 12 | App de fidelización (puntos y cupones) | Mockups + PWA a ancho de celular | Funcional |

**Ola 3 — sistemas y automatización**, que son los de mayor ticket.

| # | Solución | Nivel |
|---|---|---|
| 13 | Bot de WhatsApp para pedidos y citas (simulador de conversación) | Funcional |
| 14 | Asistente con IA que responde con la información del negocio (limitado y con coste acotado) | Funcional |
| 15 | Ferretería o distribuidora: catálogo B2B con cotizador | Funcional |
| 16 | Hotel u hostal: disponibilidad y reservas | Funcional |
| 17 | Flujo de facturación electrónica DIAN (vía proveedor autorizado, simulado) | Navegable |
| 18 | Academia o colegio: inscripciones y pagos | Funcional |

Una ola no empieza hasta que la anterior está publicada con sus fichas. Publicar seis demos
excelentes vende más que dieciocho a medias.

### 4.5 Detalles que hacen creíble una demo en Colombia

- Precios en COP con formato local (`$ 38.000`), direcciones tipo Bogotá, horarios reales.
- Métodos de pago que la gente usa: Nequi, Daviplata, PSE, tarjeta, contraentrega. El checkout nombra una pasarela real (Wompi, Bold o Mercado Pago) marcada como simulada.
- WhatsApp como canal por defecto: el pedido o la reserva genera el mensaje armado.
- Domicilios con barrio y costo de envío; Google Maps en la sección de ubicación.
- Textos escritos para ese negocio, no genéricos. Nada de *lorem ipsum* ni de frases que valgan para cualquier sector.

### 4.6 Mockups

Un script de Playwright (`scripts/capturas.ts`) abre cada demo en tres anchos (1440, 820, 390),
en las pantallas declaradas en el catálogo, y guarda las capturas. Otro paso las compone en
marcos de dispositivo en SVG (sin logos de marcas de hardware). Se regeneran con un comando cuando
cambia una demo, así las fichas nunca muestran una versión vieja.

### 4.7 Criterios de aceptación de cada demo

Una demo no se publica hasta cumplir todo esto:

- [ ] Responsive desde 360 px, probada en celular real
- [ ] Flujo principal completo según su nivel declarado
- [ ] Recorrido *Cómo funciona* con al menos 5 puntos explicados
- [ ] Barra de demo con los tres enlaces; el de WhatsApp lleva el nombre de la demo
- [ ] Botón *Restablecer demo* (si guarda estado)
- [ ] Axe sin violaciones AA; Lighthouse ≥ 90 en rendimiento y accesibilidad en móvil
- [ ] Imágenes con licencia registrada (5.5) y servidas optimizadas
- [ ] Nombre ficticio verificado; aviso de negocio ficticio visible
- [ ] Capturas generadas y ficha completa con los 10 bloques
- [ ] Prueba E2E de humo y del flujo principal

### 4.8 Especificación de la primera demo: Canela, clínica veterinaria

**Contexto.** Una veterinaria pidió "algo", sin tener claro si una página o un sistema. La demo
tiene que responder esa duda por sí sola: **enseña los tres niveles en un mismo lugar** y deja
ver qué entra en cada precio.

**Negocio ficticio.** *Canela, clínica veterinaria*, Bogotá. Perros y gatos. Consulta general,
vacunación, desparasitación, cirugía, laboratorio, peluquería y urgencias con horario extendido.
Dirección y teléfono marcados como ficticios.

**Selector de plan.** La barra de demo incluye *Ver como: Página · Página + citas · Sistema
clínico*. Cada opción muestra solo lo que incluye ese plan, con su precio desde. Es la
herramienta de venta para un cliente que no sabe qué necesita: lo decide mirando.

| Parte | Ruta | Plan en el que entra | Qué hace |
|---|---|---|---|
| **A. Página** | `/demo/canela` | Presencia ($300.000) en versión reducida; Página profesional ($600.000) completa | Portada, servicios con precio de referencia, equipo, horarios y urgencias, paquete de salud para cachorros, preguntas frecuentes, ubicación con mapa, WhatsApp |
| **B. Citas en línea** | `/demo/canela/agendar` | Citas en línea ($1.400.000 o $79.900 al mes) | Servicio → mascota (nueva o reconocida por el teléfono) → día, hora y profesional libres → confirmación con resumen y archivo para agregar al calendario |
| **C. Panel clínico** | `/demo/canela/panel` | Sistema de gestión ($2.400.000 o $129.900 al mes); con pagos y recordatorios automáticos, sistema completo ($3.000.000) | Ver abajo |

**Panel clínico (C):**

- **Entrar:** acceso simulado con usuario prellenado; roles *recepción* y *veterinario*.
- **Hoy:** citas del día por estado (*agendada, en sala, atendida, no asistió*), cambio de estado con un toque, siguiente paciente.
- **Agenda:** semana por veterinario, con huecos libres; las citas creadas en B aparecen aquí.
- **Pacientes:** búsqueda por mascota, propietario o teléfono.
- **Ficha de la mascota:** datos, foto, especie, raza, edad calculada, peso con su curva, alergias y alertas, historia clínica en orden cronológico, carnet de vacunas con estado (*al día, próxima, vencida*).
- **Nueva consulta:** motivo, anamnesis, examen físico, diagnóstico, tratamiento y fórmula médica imprimible.
- **Recordatorios:** vacunas y controles por vencer; botón que abre WhatsApp con el mensaje escrito para el propietario. (La versión automática por API es un módulo aparte, ver `PRECIOS.md` §4.2.)
- **Resumen del mes:** citas atendidas, servicios más pedidos, pacientes nuevos, ausencias.

**Datos de ejemplo.** ~40 mascotas con propietarios, 3 veterinarios, 2 semanas de agenda alrededor
de la fecha de visita (se generan relativas a hoy, para que la demo nunca parezca vieja), historias
con consultas verosímiles. Nada de datos de personas reales.

**Fuera de esta primera versión** (quedan para cuando el cliente lo pida): inventario de farmacia,
facturación, hospitalización, peluquería con su propia agenda.

**Lo que se le dice al cliente con la demo en la mano:** *"Esto es todo lo que podría tener.
Podemos empezar solo por la página, por $300.000 o $39.900 al mes, y crecer después sin rehacer nada."*

---

## 5. Arquitectura técnica

### 5.1 Estructura de carpetas

```
app/
  (sitio)/                 sitio de Axchi: cabecera, pie y sistema de diseño propio
    page.tsx
    soluciones/            catálogo y fichas
    planes/  a-medida/  proceso/  empresa/  guias/  cotizar/
  demo/                    fuera del grupo: sin cabecera ni pie de Axchi
    layout.tsx             barra de demo, noindex, recorrido guiado
    fogon-45/              cada demo con su layout, fuentes y paleta
    trama/
    ...
  admin/  api/  auth/      sin cambios de ubicación
demos/
  motores/                 pedidos/, catalogo/, agenda/, gestion/, listados/
  comun/                   barra de demo, recorrido, restablecer, formato COP
  datos/                   datos ficticios por demo (tipados)
lib/catalogo/
  tipos.ts                 Sector, Solucion, Plan, Demo, NivelDemo
  soluciones/*.ts          una ficha por archivo
  index.ts                 lista, filtros, slugs para sitemap
scripts/
  capturas.ts  iconos.ts  og.ts
```

Los grupos de rutas permiten que cada demo tenga su propio `layout` con sus propias fuentes
(`next/font`) sin cargar nada del sitio de Axchi, y que el sitio no cargue nada de las demos.

### 5.2 El catálogo vive en código

Fichas, planes y metadatos de demos son **archivos TypeScript tipados**, no filas en la base de
datos. Razones: van versionados junto al código de la demo que describen, el compilador detecta
una ficha incompleta, y no requieren panel. Esto elimina también la tabla `Service`, que hoy
duplica `lib/servicios.ts` sin usarse. La base de datos queda para lo que de verdad cambia desde el
panel: guías, mensajes y analítica.

Cada `Solucion` declara `estado: "publicada" | "en-construccion"`. Solo las publicadas aparecen en
el catálogo y el sitemap; así se puede fusionar trabajo a medias sin exponerlo.

### 5.3 Rendimiento

- Cada demo es su propio segmento de ruta: su JavaScript no entra en el sitio ni en otras demos.
- Fichas y demos se generan estáticas en build (`generateStaticParams`); no consultan la base.
- Presupuesto por demo: LCP < 2,5 s en 4G simulada, JS inicial < 150 kB comprimido.

### 5.4 SEO

- Las **fichas** son las páginas que compiten: "página web para restaurantes en Bogotá", "sistema de inventario para tiendas", "software para veterinarias". Una intención por ficha.
- Las **demos** llevan `noindex, follow` y canónica a su ficha: un restaurante ficticio no debe aparecer en Google como si existiera.
- Datos estructurados: `Service` con `offers` (precio desde) por ficha, `FAQPage` para las preguntas frecuentes, `ProfessionalService` global.
- Imagen OG por ficha generada por `scripts/og.ts` a partir de la captura de la demo.
- `SEO.md` parte 5 se rehace con estas consultas, y la ficha de Google Business se registra como área de servicio.

### 5.5 Imágenes

- Fotografía con licencia de uso comercial (Unsplash, Pexels) o generada por IA. Cada imagen se anota en `docs/licencias.md` con fuente, autor y licencia.
- Se sirven desde R2 bajo el prefijo `demos/` del bucket `axchisan-media`, no desde `public/`, para no inflar el repositorio. Formato AVIF/WebP vía `next/image`.
- Ninguna foto de personas reconocibles asociadas a un negocio ficticio si la licencia no lo permite.

### 5.6 Analítica y embudo

Sin medir no se sabe qué sector convierte. Se registra, en la tabla `SiteAnalytics` (hoy sin uso)
ampliada con un campo `evento`:

- visita a ficha, apertura de demo, activación del recorrido
- clic en *Quiero una así*, clic en WhatsApp, envío de cotización (con sector y demo de origen)

El panel muestra por solución: visitas, aperturas de demo y contactos. Con eso se decide qué
ola priorizar y qué demo rehacer.

### 5.7 Cotización y panel

- **Formulario `/cotizar`:** tipo de negocio, qué necesita (opciones múltiples), demo de referencia (prellenada por `?demo=`), rango de presupuesto en COP, plazo deseado, nombre, WhatsApp y correo. Menos de un minuto de rellenar.
- **Modelo:** `ContactMessage` suma `sector`, `solucion`, `demo`, `presupuesto`, `plazo`, `origen`. Migración aditiva, sin tocar los mensajes existentes.
- **Estados:** `MessageStatus` pasa de estados de soporte a los de un embudo: *nuevo, contactado, cotizado, ganado, perdido*.
- **Aviso por correo** (Resend) con todos los campos, y botón para responder por WhatsApp.
- **Agendar:** o se integra un calendario real (Cal.com tiene plan gratuito) o desaparece la palabra "agendar" del sitio (D6).
- **Panel:** *Proyectos* se oculta hasta que haya clientes que mostrar; *Skills* sale de la navegación pública (a una pyme no le dice nada) y puede quedar solo en `/empresa` o desaparecer.

---

## 6. Diseño

### 6.1 Dos sistemas, con frontera clara

- **Sitio de Axchi:** sobrio, claro, confiable. Conserva lo que funciona: tokens de `globals.css`, Instrument Sans, la banda oscura con acento cian, contraste calculado. `DESIGN.md` se reescribe con la nueva audiencia (dueño de pyme, en celular), los nuevos principios y la paleta real (hoy el documento dice azul `#3454D1`, el código usa `#0EA5A5`).
- **Demos:** cada una con su propio mini-brief (sector, sensación buscada, paleta, tipografías, composición). Un restaurante necesita fotografía apetitosa y tipografía con carácter; una veterinaria, calidez; un sistema de inventario, densidad y claridad. Los patrones prohibidos de `AGENTS.md` siguen aplicando: un cliente juzga la calidad de lo que recibirá por estas demos.

### 6.2 Principios nuevos para el sitio

1. **Las demos abren la página.** Lo primero que se puede hacer es probar algo.
2. **Cada afirmación lleva una cifra o una demo que la respalde.**
3. **El cliente entiende cada frase sin saber de software.** Lo técnico va plegado.
4. **El precio no se esconde.** "Desde $300.000" es visible en la portada, en planes y en cada ficha.
5. **Un solo momento de movimiento** al cargar; las demos pueden tener el suyo, dentro de su piel.

### 6.3 Iconografía

- **Una sola familia en el sitio:** lucide-react, trazo 1,75, tamaños 16/20/24. Nada de emojis como icono.
- **Iconos de sector** (utensilios, percha, gota, tijeras, huella, caja…) definidos en un único mapa en `lib/catalogo`, para que el mismo sector use el mismo icono en inicio, catálogo, menú y ficha.
- **Marcas de terceros** (WhatsApp, Instagram, métodos de pago) como SVG propios en `components/site/social-icons.tsx`, que ya existe para eso.
- **Iconos de la aplicación** derivados del `LogoMark` por `scripts/iconos.ts`: `app/icon.svg`, `favicon.ico` (16/32/48), `apple-icon.png`, `icon-512.png` y `icon-maskable-512.png`. Una sola fuente, cero divergencias.

---

## 7. Fases de ejecución

Cada fase termina con su verificación antes de empezar la siguiente.

### Orden

La demo de veterinaria tiene prioridad porque hay un cliente potencial esperándola. Por eso el
orden no es estrictamente numérico:

```
F0 saneamiento → F1 documentos (brief de Canela primero) → F2 infraestructura
  → F4a Canela → F3 sitio comercial → F4b resto de la ola 1 → F5 → F6
```

Canela puede enseñarse al cliente con su enlace directo aunque el sitio comercial todavía no esté
renovado.

### F0 · Saneamiento

1. Cambios sin commit: nombre público a "Axchi" (D2); el copy corporativo se reescribe en F3.
2. Limpieza completa de la tabla 1.4: documentos, hooks, dependencias, comentarios, constante única de WhatsApp, `@types/node`.
3. Iconos y OG regenerados desde el logo (1.3, 6.3); `/favicon.ico` responde 200.
4. Pruebas E2E en verde con la navegación actual.

**Cierre:** `npm run build`, `npm run typecheck` y `npm test` en verde; `curl` a `/favicon.ico` devuelve 200.

### F1 · Documentos rectores

1. `DESIGN.md` reescrito (6.1–6.3).
2. `MARCA.md` convertido en guía de marca final (nombre, logo, usos, colores, voz).
3. Guía de voz con 10 pares *así sí / así no*.
4. Brief de cada demo de la ola 1 (media página cada uno).
5. `README.md` y `SEO.md` actualizados.

**Cierre:** revisión tuya de los documentos antes de escribir interfaz.

### F2 · Infraestructura del catálogo

1. Tipos y datos del catálogo (`lib/catalogo`).
2. Grupos de rutas `(sitio)` y `demo`; layout de demo con `noindex`.
3. Componentes comunes: barra de demo, recorrido guiado, restablecer, formato COP, mensaje de WhatsApp.
4. Scripts de capturas, OG e iconos.
5. Plantilla de ficha y página de catálogo con filtros.
6. Migración de `ContactMessage` y `SiteAnalytics`; eventos del embudo.

**Cierre:** una demo mínima de prueba recorre el ciclo completo: ficha → demo → recorrido → WhatsApp → evento registrado → captura generada.

### F3 · Sitio comercial

1. Nueva navegación, inicio, planes, a medida, proceso, empresa, cotizar, legales.
2. Copy completo según la guía de voz.
3. Redirecciones 308 de todas las URLs antiguas, incluidas las de proyectos retirados.
4. Proyectos de GitHub despublicados y redirigidos; ficha de Jabones Mari.
5. Formulario de cotización y panel con estados de embudo.

**Cierre:** recorrido completo en celular y escritorio; ninguna URL del sitemap anterior devuelve 404.

### F4a · Canela, clínica veterinaria

Motores **Agenda** y **Gestión**, según la especificación de 4.8.

**Cierre:** Canela cumple los criterios de 4.7 y se puede enseñar desde un celular.

### F4b · Resto de la ola 1

Por motor, para que el segundo sector de cada motor salga casi gratis:

1. Motor **Agenda** → Navaja & Tijera (reutiliza lo de Canela).
2. Motor **Gestión** → Inventario y ventas (reutiliza lo de Canela).
3. Motor **Pedidos** → Fogón 45.
4. Motor **Catálogo** → Trama; Jabones Mari ya cubre cosméticos.

**Cierre:** las demos cumplen los criterios de 4.7 y sus fichas están publicadas.

### F5 · Calidad y lanzamiento

1. E2E: humo de cada demo, flujos principales, redirecciones, formulario.
2. Axe y Lighthouse sobre fichas y demos, en móvil.
3. Revisión manual en celular real.
4. Sitemap, Search Console (reenvío), ficha de Google Business.
5. Primeras guías: "¿Cuánto cuesta una página web para un restaurante en Colombia?" y equivalentes por sector de la ola 1.

**Cierre:** en producción, con el embudo midiendo.

### F6 · Olas 2 y 3

Se ordenan según los datos del embudo de las primeras semanas, no según esta lista.

---

## 8. Decisiones

| # | Decisión | Resultado |
|---|---|---|
| **D1** | Hosting | **Se mantiene Vercel Hobby.** Riesgo aceptado (1.5); el paso a Pro no exige cambios de código |
| **D2** | Nombre público | **Axchi.** "Axchi Software Solutions" solo en legales y datos estructurados |
| **D3** | Voz | La marca habla como empresa ("te respondemos"); primera persona del singular solo en `/empresa`. Sin "nuestro equipo" |
| **D4** | Proyectos | **Ningún proyecto de GitHub** en el sitio. Solo Jabones Mari, como ejemplo de tienda de cosméticos |
| **D5** | Renombrar rutas | Sí, con redirecciones 308 |
| **D6** | Agendar llamadas | Pendiente: Cal.com gratuito, o retirar la palabra "agendar". Mientras tanto, se retira |
| **D7** | Precios | **"Desde", con $300.000 como entrada muy visible, techo de $3.000.000 y suscripción mensual desde $39.900.** Revisado el 24 sep 2026; modelo en [`PRECIOS.md`](PRECIOS.md) |
| **D8** | Primera demo | **Veterinaria.** Los demás sectores se deciden durante el desarrollo |

## 9. Riesgos

| Riesgo | Mitigación |
|---|---|
| El catálogo se come meses sin vender | Canela primero y enseñable por enlace; olas cortas; se mide antes de seguir |
| Demos que parecen plantillas recoloreadas | Pieles que difieren en composición; brief por demo; revisión contra patrones prohibidos |
| Prometer en la demo algo que luego no se entrega en el plan básico | Nivel funcional declarado en cada ficha; "qué incluye y qué no" por plan |
| Un negocio ficticio coincide con uno real | Verificación en Maps y RUES antes de publicar; aviso visible |
| Imágenes sin licencia | Registro obligatorio en `docs/licencias.md` |
| Suspensión de Vercel por uso comercial | Riesgo aceptado (D1). Pasar a Pro es un cambio de plan, no de código |
| Costes de la demo con IA | Límite de peticiones, respuestas cortas, modelo pequeño y tope de gasto mensual |
