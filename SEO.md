# SEO — qué está hecho y qué te toca a ti

> **Actualizado tras el cambio de enfoque.** El sitio pasó de portafolio personal a estudio que
> vende servicios de desarrollo. Eso cambia las consultas objetivo, y con ellas la parte 5.

## Punto de partida

Search Console reportaba, a 7 de septiembre de 2026: **0 páginas indexadas, 7 no indexadas.**

No es un misterio ni un castigo de Google. El sitio estuvo caído meses tras vencer el VPS: cuando el
rastreador encuentra un dominio que no responde, reintenta durante un tiempo y acaba retirando las
páginas del índice. Se parte de cero, y conviene asumirlo antes de mirar métricas.

Los 7 clics del gráfico son residuo de cuando el sitio estaba vivo.

---

## Parte 1 — Lo que ya hace el código

Nada de esto requiere acción tuya. Está y se mantiene solo.

| Pieza | Dónde | Qué hace |
|---|---|---|
| `sitemap.xml` | `app/sitemap.ts` | Se genera en cada petición con las páginas fijas más cada proyecto y artículo publicado |
| `robots.txt` | `app/robots.ts` | Permite el sitio, bloquea `/admin`, `/api/` y `/auth`, y apunta al sitemap |
| Metadatos por página | cada `page.tsx` | Título y descripción propios; nada hereda el genérico |
| Canónicos | `alternates.canonical` | URL única por página; evita que se cuente contenido duplicado |
| Open Graph | `public/og.png` | Tarjeta al compartir en LinkedIn y WhatsApp. Es un archivo fijo: generarla en cada petición costaba 0,6 MB de motor de render |
| Datos estructurados | `layout.tsx`, fichas, artículos | `ProfessionalService` global con dirección y teléfono, `SoftwareSourceCode` por proyecto, `BlogPosting` por artículo |
| Fichas por sector | `/soluciones/veterinarias`, `/soluciones/salones-y-barberias` | Una página por intención de búsqueda, con `Service`, precio desde y `FAQPage` |
| Datos de la oferta | `app/planes/page.tsx` | `OfferCatalog` con el precio mínimo de cada plan: Google ve un catálogo con precios, no un texto |
| Demos fuera del índice | `app/demo/layout.tsx` | Las demos son negocios ficticios: `noindex, follow` y fuera del sitemap |
| Redirecciones de la reestructuración | `next.config.ts` | `/servicios`, `/trabajo`, `/sobre`, `/contacto` y `/blog` redirigen en un solo salto |
| Redirecciones heredadas | `next.config.ts` | `/about`, `/projects`, `/contact`… del sitio anterior redirigen con 308 |
| `www` → dominio principal | Vercel | Un solo dominio canónico |
| Renderizado en servidor | todo el sitio | Google ve el contenido en el HTML inicial, sin ejecutar JavaScript |

---

## Parte 2 — Search Console, paso a paso

### 2.1 Deja una sola propiedad

Tienes dos: `axchisan.com` (propiedad de dominio) y `https://axchisan.com/` (prefijo de URL).

**Usa la de dominio** (`axchisan.com`, la del icono de tu marca). Cubre `http`, `https`, `www` y
todos los subdominios en un solo sitio; la de prefijo solo cubre exactamente esa forma. Trabaja
siempre sobre ella para no partir los datos en dos.

La de prefijo no estorba: déjala, pero ignórala.

### 2.2 Envía el sitemap

1. Menú izquierdo → **Sitemaps**
2. Si aparece uno anterior, bórralo: apuntaba a URLs que ya no existen
3. En *Añadir un sitemap nuevo* escribe: **`sitemap.xml`**
4. **Enviar**

En minutos debe decir *Correcto* y mostrar el número de URLs descubiertas. Si dice *No se ha podido
obtener*, espera una hora y actualiza — suele ser que aún no lo ha leído.

### 2.3 Pide indexación de las páginas clave

Barra superior → pega la URL → Enter → espera el análisis → **Solicitar indexación**.

Hazlo con estas, **de una en una** (hay cuota diaria, unas 10-12):

```
https://axchisan.com/
https://axchisan.com/soluciones
https://axchisan.com/soluciones/veterinarias
https://axchisan.com/soluciones/salones-y-barberias
https://axchisan.com/planes
https://axchisan.com/soluciones/tiendas-de-cosmeticos
https://axchisan.com/cotizar
```

Las fichas van antes que las páginas generales: son las que resuelven la búsqueda de alguien que
ya sabe qué negocio tiene. Cada vez que se publique una ficha nueva, se pide su indexación el mismo
día. Las URLs antiguas (`/trabajo/...`, `/servicios`) no se piden: Google las irá cambiando solo al
encontrar la redirección.

### 2.4 Revisa el informe de cobertura a los 3–4 días

**Indexación → Páginas**. Lo que importa:

- **Páginas indexadas** subiendo: va bien.
- *"Descubierta: actualmente sin indexar"*: Google la conoce y no ha pasado. Normal en un sitio nuevo. Paciencia.
- *"Rastreada: actualmente sin indexar"*: la leyó y decidió no indexarla. Suele significar contenido escaso. Es el aviso de que esa página necesita más sustancia.
- *"Página alternativa con etiqueta canónica adecuada"*: correcto, no es un error.
- **Error de servidor o 404**: eso sí hay que mirarlo. Avísame.

---

## Parte 3 — Bing, que casi nadie hace

Bing alimenta también a DuckDuckGo y a ChatGPT cuando busca. Cuesta dos minutos:

1. [bing.com/webmasters](https://www.bing.com/webmasters)
2. Entra con Google
3. **Importar desde Google Search Console** y autoriza

Importa propiedad, verificación y sitemap de golpe. Con la competencia que hay en Bing, un
sitio bien hecho posiciona bastante más fácil que en Google.

---

## Parte 4 — Lo que de verdad mueve la aguja

Para un sitio nuevo, el factor decisivo no son los metadatos —ya están bien— sino que
**existan enlaces desde sitios que Google ya visita a diario**. Cada uno de estos vale más que
cualquier ajuste técnico:

| Dónde | Qué hacer | Por qué importa |
|---|---|---|
| **Perfil de GitHub** | Campo *Website* → `https://axchisan.com` | Google rastrea GitHub constantemente |
| **README de tu perfil** (`axchisan/axchisan`) | Enlaza el sitio y tus 3 mejores proyectos | Es la primera página que ve quien te evalúa |
| **LinkedIn** | Sección *Destacado* y campo *Sitio web* del perfil | Alta autoridad de dominio |
| **Perfil de WhatsApp Business e Instagram** | El enlace a la ficha del sector al que le vendes, no a la portada | Quien llega desde ahí ya está en la página que lo convence |
| **Instagram / firma de correo** | El enlace, sin más | Tráfico directo |

Ese último punto de la tabla es el que más se descuida: **apuntar cada repositorio a su ficha en tu
web** crea una red de enlaces coherente entre dos sitios tuyos que hablan de lo mismo.

---

## Parte 5 — Las consultas que ahora importan

Con el enfoque comercial, el objetivo deja de ser posicionar por tu nombre y pasa a ser aparecer
cuando alguien busca **contratar**. Son dos intenciones distintas y se atacan distinto.

### Las que puedes ganar

Búsquedas de dueños de negocio, locales y específicas. Cada una tiene su página:

| Consulta | Dónde se ataca |
|---|---|
| página web para veterinaria | `/soluciones/veterinarias` |
| software para veterinarias Colombia | `/soluciones/veterinarias` |
| sistema de citas para veterinaria | `/soluciones/veterinarias` |
| página web para barbería | `/soluciones/salones-y-barberias` |
| sistema de reservas para salón de belleza | `/soluciones/salones-y-barberias` |
| programa para cuadrar caja y comisiones salón | `/soluciones/salones-y-barberias` |
| tienda en línea para cosméticos / jabones artesanales | `/soluciones/tiendas-de-cosmeticos` |
| cuánto cuesta una página web en Colombia | `/planes` |
| página web por mensualidad | `/planes#suscripciones` |

Cada demo nueva suma su sector a esta tabla. La regla: **una intención, una página**. No se crean
dos fichas que compitan por la misma búsqueda.

### Las que no vas a ganar, y está bien

"Desarrollo de software", "software empresarial", "app móvil" a secas: las dominan agencias con
presupuesto de anuncios. Perseguirlas es quemar meses. La palanca real de un estudio pequeño es la
**especificidad**: *quién*, *dónde* y *para qué problema*.

### El artículo que falta

El que más conversión traería no existe todavía: **"cuánto cuesta desarrollar una aplicación a medida en Colombia"**.

Es la pregunta que escribe en Google exactamente quien está a punto de contratar, casi nadie la
responde con cifras honestas, y responderla con rangos reales y lo que hace variar el precio te
posiciona como alguien que no tiene nada que esconder. Vale más que diez artículos técnicos.

### Ficha de Google Business

Si vas a vender servicios locales, una ficha de empresa en Google —aunque no tengas oficina, se
puede registrar como área de servicio— te mete en el mapa y en el panel lateral para búsquedas con
"Bogotá". Es gratis y es de las cosas con mejor relación esfuerzo/resultado que quedan.

## Parte 6 — Plazos realistas

| Cuándo | Qué esperar |
|---|---|
| 24–72 h | La home aparece al buscar `site:axchisan.com` |
| 1–2 semanas | Las páginas principales indexadas; empiezas a salir por "Axchi" |
| 1–2 meses | Las fichas de proyecto indexadas; primeras impresiones por términos técnicos |
| 3–6 meses | Los artículos empiezan a traer tráfico, si los publicas |
| 6+ meses | Consultas comerciales con intención de contratar, que son las que convierten |

No mires Search Console a diario: los datos llegan con 2–3 días de retraso y sacarás conclusiones de
ruido. Una revisión semanal es suficiente.

---

## Parte 7 — Comprobar que sigue bien

Cuando cambies algo importante:

```bash
curl -s https://axchisan.com/robots.txt
curl -s https://axchisan.com/sitemap.xml | grep -c "<loc>"
npx playwright test e2e/publico.spec.ts   # incluye las redirecciones heredadas
```

Y en el navegador:

- [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results) — pega una ficha de proyecto
- [PageSpeed Insights](https://pagespeed.web.dev/) — mide Core Web Vitals reales
- [Validador de OpenGraph](https://www.opengraph.xyz/) — comprueba cómo se ve el enlace al compartirlo

## Lo que no hay que hacer

- **No compres enlaces.** Es la forma más rápida de recibir una penalización manual.
- **No repitas palabras clave** en los textos. Google lo detecta y una página forzada se lee peor.
- **No cambies las URLs otra vez** sin añadir su redirección en `next.config.ts`.
- **No borres una ficha** una vez indexada; si sobra, redirige a la ficha más cercana o a `/soluciones`.
