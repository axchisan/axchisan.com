# SEO y medición: estado y pasos

Qué hace ya el código, qué se configura en cada cuenta y cómo comprobar que sigue bien. Los pasos
marcados **Tú** solo se pueden hacer desde tus cuentas.

Última revisión: 28 de septiembre de 2026.

## Estado actual

| Qué | Resultado |
|---|---|
| Lighthouse en celular, portada | Rendimiento 96, accesibilidad 100, buenas prácticas 100, SEO 100. LCP 2,8 s, CLS 0 |
| Lighthouse en celular, ficha de veterinarias | Rendimiento 98, accesibilidad 100, buenas prácticas 100, SEO 100. LCP 2,4 s, CLS 0 |
| Páginas en el sitemap | 9 fijas, 12 fichas y las guías publicadas |
| Datos estructurados | `ProfessionalService` en todo el sitio, `Service` con `AggregateOffer` y `FAQPage` en cada ficha, `OfferCatalog` con precios en planes, `BlogPosting` en guías |
| `www` y `http` | Redirigen con 308 a `https://axchisan.com` |
| Demos | `noindex, follow` y fuera del sitemap: son negocios ficticios |

Search Console reportaba el 7 de septiembre **0 páginas indexadas**: el sitio estuvo caído meses
cuando venció el VPS y Google retiró las páginas. Se parte de cero; lo que sigue es para acelerar
la reindexación.

---

## Parte 1: lo que ya hace el código

Nada de esto requiere acción. Está y se mantiene solo.

| Pieza | Dónde | Qué hace |
|---|---|---|
| `sitemap.xml` | `app/sitemap.ts` | Páginas fijas, una entrada por ficha y las guías publicadas. Solo las guías llevan fecha (`lastmod`): poner la fecha de cada petición en todas le enseña a Google que el dato miente |
| `robots.txt` | `app/robots.ts` | Permite el sitio, bloquea `/admin`, `/api/` y `/auth`, apunta al sitemap |
| Título, descripción y canónico | `lib/metadatos.ts` | Cada página los declara completos. En Next, `openGraph` no se mezcla entre segmentos: sin esto, todas mostraban la tarjeta y el título de la portada al compartirse |
| Tarjetas al compartir | `public/og.png`, `public/og/*.png` | Una general, una para planes y una por ficha con las capturas de su demo. Las demos usan la de su ficha. Pensadas para el recorte cuadrado de WhatsApp: marca, titular y precio en el centro. Se regeneran con `npm run og` |
| Fichas por sector | `/soluciones/<sector>` | Una página por intención de búsqueda, con precio desde, demo y preguntas frecuentes |
| Redirecciones | `next.config.ts` | URLs del sitio anterior y de las demos renombradas, con 308 |
| Renderizado en servidor | todo el sitio | Google ve el contenido en el HTML inicial |
| Fuentes locales | `app/fuentes/` | Sin peticiones a Google Fonts: carga más rápida y compilaciones que no fallan por la red |

**Al publicar una ficha nueva:** correr `npm run og` para crear su tarjeta, y pedir su indexación
en Search Console el mismo día (parte 2.3).

---

## Parte 2: Search Console (Tú)

### 2.1 Trabaja sobre la propiedad de dominio

Tienes dos propiedades: `axchisan.com` (dominio) y `https://axchisan.com/` (prefijo de URL). Usa
siempre la de **dominio**: cubre `http`, `https`, `www` y los subdominios en un solo informe. La
otra no estorba; ignórala.

### 2.2 Envía el sitemap

1. Menú izquierdo → **Sitemaps**.
2. Si aparece uno anterior con errores, elimínalo: apuntaba a URLs del sitio viejo.
3. En *Añadir un sitemap nuevo* escribe **`sitemap.xml`** y pulsa **Enviar**.
4. Debe decir *Correcto* y unas 22 URLs descubiertas. Si dice *No se ha podido obtener*, espera una
   hora y actualiza.

### 2.3 Pide la indexación de las páginas que venden

Barra superior de Search Console → pega la URL → Enter → espera el análisis → **Solicitar
indexación**. Hay una cuota de unas 10 por día: repártelas en dos días, en este orden.

**Día 1**

```
https://axchisan.com/
https://axchisan.com/soluciones
https://axchisan.com/planes
https://axchisan.com/soluciones/restaurantes
https://axchisan.com/soluciones/veterinarias
https://axchisan.com/soluciones/salones-y-barberias
https://axchisan.com/soluciones/consultorios-odontologicos
https://axchisan.com/soluciones/inventario-y-ventas
https://axchisan.com/soluciones/tiendas-de-ropa
https://axchisan.com/soluciones/inmobiliarias
```

**Día 2**

```
https://axchisan.com/soluciones/gimnasios-y-estudios
https://axchisan.com/soluciones/panaderias-y-cafeterias
https://axchisan.com/soluciones/abogados-y-contadores
https://axchisan.com/soluciones/hoteles-y-turismo
https://axchisan.com/soluciones/tiendas-de-cosmeticos
https://axchisan.com/cotizar
https://axchisan.com/a-medida
https://axchisan.com/proceso
```

Las URLs viejas (`/trabajo/...`, `/servicios`, `/demo/fogon-45`…) no se piden: Google las cambia
solo al encontrar la redirección.

### 2.4 Qué mirar y cuándo

Una vez por semana, no a diario: los datos llegan con 2 o 3 días de retraso.

| Informe | Dónde | Qué significa |
|---|---|---|
| Páginas indexadas | Indexación → Páginas | Tiene que subir semana a semana |
| *Descubierta: actualmente sin indexar* | mismo informe | Google la conoce y aún no pasa. Normal en un sitio que vuelve. Paciencia |
| *Rastreada: actualmente sin indexar* | mismo informe | La leyó y decidió no indexarla: contenido escaso. Avísame con la URL |
| *Página alternativa con etiqueta canónica adecuada* | mismo informe | Correcto, no es un error (son las redirecciones) |
| *Excluida por la etiqueta noindex* | mismo informe | Correcto si son `/demo/...` |
| Error de servidor o 404 | mismo informe | Sí hay que mirarlo. Avísame |
| Consultas y clics | Rendimiento → Resultados de búsqueda | Qué búsquedas te muestran y cuáles traen clics. Compara con la tabla de la parte 5 |
| Fragmentos de reseñas, preguntas frecuentes | Mejoras | Errores en los datos estructurados. Hoy no hay |

---

## Parte 3: Bing Webmaster Tools (Tú, dos minutos)

Bing alimenta también a DuckDuckGo y a las búsquedas de ChatGPT y Copilot.

1. Entra a [bing.com/webmasters](https://www.bing.com/webmasters) con tu cuenta de Google.
2. Elige **Importar desde Google Search Console** y autoriza.

Importa la propiedad, la verificación y el sitemap de una vez.

---

## Parte 4: Perfil de Empresa de Google (Tú)

Es lo que más rinde para búsquedas con "Bogotá" o "cerca de mí": te pone en el mapa y en el panel
lateral.

1. [business.google.com](https://business.google.com) → **Agregar empresa**.
2. Nombre: **Axchi**. Categoría principal: *Diseñador de sitios web*; secundarias: *Desarrollador
   de software*, *Servicio de marketing en Internet*.
3. Ubicación: si no atiendes en un local, elige **no tengo ubicación que los clientes puedan
   visitar** y marca como zona de servicio Bogotá y "Colombia".
4. Teléfono: el WhatsApp (+57 318 303 8190). Sitio web: `https://axchisan.com`.
5. Google verifica con un video o una llamada. Después agrega: descripción (la de la portada), los
   servicios con precio desde (los de `/planes`) y fotos de capturas de las demos.
6. Pide reseñas a cada cliente al entregar: es lo que más pesa en el mapa.

---

## Parte 5: las búsquedas que importan

El objetivo es aparecer cuando alguien busca **contratar** para su negocio, no por tu nombre. Una
intención, una página: no se crean dos fichas que compitan por la misma búsqueda.

| Búsqueda | Página |
|---|---|
| página web para restaurante, carta digital QR, pedidos en línea restaurante | `/soluciones/restaurantes` |
| página web para veterinaria, software veterinaria, citas veterinaria | `/soluciones/veterinarias` |
| página para barbería, reservas salón de belleza, agenda peluquería | `/soluciones/salones-y-barberias` |
| software consultorio odontológico, odontograma, citas odontología | `/soluciones/consultorios-odontologicos` |
| software de inventario, punto de venta ferretería, sistema para cuadrar caja | `/soluciones/inventario-y-ventas` |
| tienda en línea de ropa, tienda virtual con PSE y Nequi | `/soluciones/tiendas-de-ropa` |
| página web para inmobiliaria, portal de inmuebles propio | `/soluciones/inmobiliarias` |
| software para gimnasio, reservas de clases, control de membresías | `/soluciones/gimnasios-y-estudios` |
| página web panadería, pedidos en línea panadería, tortas por encargo | `/soluciones/panaderias-y-cafeterias` |
| página web para abogados, página web para contador | `/soluciones/abogados-y-contadores` |
| página web para hotel, página de hotel con video | `/soluciones/hoteles-y-turismo` |
| tienda en línea cosméticos, jabones artesanales tienda virtual | `/soluciones/tiendas-de-cosmeticos` |
| cuánto cuesta una página web en Colombia, página web por mensualidad | `/planes` |
| desarrollo de software a medida Bogotá | `/a-medida` |

Las que no vas a ganar, y está bien: "desarrollo de software", "app móvil" a secas. Las dominan
agencias con presupuesto de anuncios. La palanca de un estudio pequeño es la especificidad:
quién, dónde y para qué problema.

### Contenido que falta

La única guía publicada ("Una aplicación completa por un centavo al mes") es técnica: le habla a
desarrolladores, no a dueños de negocio. Las guías que traerían clientes responden lo que un dueño
pregunta antes de contratar, con cifras:

1. ¿Cuánto cuesta una página web para un restaurante en Colombia?
2. ¿Cuánto cuesta un software para veterinaria? (y el equivalente por cada sector con ficha)
3. Página web por mensualidad o de un solo pago: cuál conviene.
4. Cómo recibir pagos con PSE y Nequi en una tienda en línea.

Cada guía enlaza a su ficha, y la ficha a la guía.

---

## Parte 6: medición

Tres capas, cada una para una pregunta distinta. Ninguna usa cookies de seguimiento, que es lo que
promete la política de privacidad; por eso no se usa Google Analytics, que pondría cookies de
Google y obligaría a un aviso de consentimiento.

| Capa | Responde | Dónde se ve |
|---|---|---|
| **Search Console** | Qué búsquedas te muestran en Google, cuántos clics, qué está indexado | search.google.com/search-console |
| **Embudo propio** (`components/medicion.tsx`) | Visitas por página, demos abiertas, clics a WhatsApp y cotizaciones | `/admin` |
| **Vercel Web Analytics y Speed Insights** | De dónde llegan las visitas (sitio, país, dispositivo) y la velocidad real en los celulares de los visitantes | Panel de Vercel → proyecto `axchisan-com` |

### 6.1 Activar Vercel Web Analytics y Speed Insights (Tú)

El código ya está (`app/layout.tsx`); falta encenderlo en el proyecto:

1. [vercel.com](https://vercel.com) → equipo *axchisan923-2669's projects* → proyecto **axchisan-com**.
2. Pestaña **Analytics** → **Enable**. En el plan gratuito incluye 50.000 eventos al mes.
3. Pestaña **Speed Insights** → **Enable**.
4. Se activa con el siguiente despliegue: cualquier cambio publicado en `main` (o **Redeploy** en
   el último despliegue). Los primeros datos aparecen al día siguiente.

Para comprobarlo: abre la portada, luego DevTools → Red, y busca una petición a
`/_vercel/insights/view` con estado 200.

### 6.2 Ver cómo se ve un enlace al compartirlo

WhatsApp, Facebook y LinkedIn guardan la tarjeta de cada URL varios días. Después de cambiar una
tarjeta:

- [Depurador de Facebook](https://developers.facebook.com/tools/debug/): pega la URL y pulsa
  **Volver a extraer**. WhatsApp suele tomar la versión nueva después de esto.
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/): pega la URL.
- Para probar en WhatsApp sin esperar, comparte la URL con un parámetro nuevo, por ejemplo
  `https://axchisan.com/?v=2`.

---

## Parte 7: plazos realistas

| Cuándo | Qué esperar |
|---|---|
| 24 a 72 h | La portada aparece al buscar `site:axchisan.com` |
| 1 a 2 semanas | Portada, soluciones y planes indexadas; sales al buscar "Axchi" |
| 3 a 6 semanas | Las fichas indexadas; primeras impresiones por búsquedas de sector |
| 3 a 6 meses | Las guías traen tráfico, si se publican |
| 6 meses o más | Búsquedas con intención de contratar, que son las que convierten |

---

## Parte 8: comprobar que sigue bien

Después de un cambio grande:

```bash
curl -s https://axchisan.com/robots.txt
curl -s https://axchisan.com/sitemap.xml | grep -c "<loc>"
curl -s https://axchisan.com/soluciones/restaurantes | grep -oE '<meta property="og:(title|image)"[^>]*>'
npx playwright test e2e/publico.spec.ts e2e/accesibilidad.spec.ts
```

Y en el navegador:

- [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results): pega una ficha.
- [PageSpeed Insights](https://pagespeed.web.dev/): velocidad real de los visitantes.
- [opengraph.xyz](https://www.opengraph.xyz/): cómo se ve el enlace al compartirlo.

## Lo que no hay que hacer

- **No compres enlaces.** Es la forma más rápida de recibir una penalización manual.
- **No repitas palabras clave** en los textos: Google lo detecta y la página se lee peor.
- **No cambies una URL** sin agregar su redirección en `next.config.ts`.
- **No borres una ficha indexada.** Si sobra, redirígela a la más cercana o a `/soluciones`.
