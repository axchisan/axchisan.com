# SEO — qué está hecho y qué te toca a ti

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
| Open Graph | `app/opengraph-image.tsx` | Tarjeta al compartir en LinkedIn y WhatsApp, generada por código |
| Datos estructurados | `layout.tsx`, fichas, artículos | `Person` global, `SoftwareSourceCode` por proyecto, `BlogPosting` por artículo |
| URLs legibles | `/trabajo/tecnobichos` | Antes eran identificadores opacos |
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

Hazlo con estas seis, **de una en una** (hay cuota diaria, unas 10-12):

```
https://axchisan.com/
https://axchisan.com/trabajo
https://axchisan.com/sobre
https://axchisan.com/blog
https://axchisan.com/trabajo/tecnobichos
https://axchisan.com/trabajo/calculadora-de-gastos
```

Al día siguiente repite con el resto de fichas. No sirve de nada pedirlo dos veces para la misma URL.

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
portafolio bien hecho posiciona bastante más fácil que en Google.

---

## Parte 4 — Lo que de verdad mueve la aguja

Para un sitio personal nuevo, el factor decisivo no son los metadatos —ya están bien— sino que
**existan enlaces desde sitios que Google ya visita a diario**. Cada uno de estos vale más que
cualquier ajuste técnico:

| Dónde | Qué hacer | Por qué importa |
|---|---|---|
| **Perfil de GitHub** | Campo *Website* → `https://axchisan.com` | Google rastrea GitHub constantemente |
| **README de tu perfil** (`axchisan/axchisan`) | Enlaza el sitio y tus 3 mejores proyectos | Es la primera página que ve un reclutador técnico |
| **LinkedIn** | Sección *Destacado* y campo *Sitio web* del perfil | Alta autoridad de dominio |
| **Cada repo destacado** | Campo *Website* → la ficha correspondiente, p. ej. `axchisan.com/trabajo/tecnobichos` | Enlaces temáticos, que pesan más que los genéricos |
| **Instagram / firma de correo** | El enlace, sin más | Tráfico directo |

Ese último punto de la tabla es el que más se descuida: **apuntar cada repositorio a su ficha en tu
web** crea una red de enlaces coherente entre dos sitios tuyos que hablan de lo mismo.

---

## Parte 5 — Contenido, que es la parte lenta

Un portafolio con diez proyectos posiciona por tu nombre. Para posicionar por algo más hace falta que
haya páginas que respondan preguntas que la gente escribe en Google.

Ahí están los dos artículos en borrador. **"Una aplicación completa por un centavo al mes"** apunta a
búsquedas reales —costo de AWS Lambda, SnapStart, alternativas gratuitas a un VPS— y esas búsquedas
las hace justo el tipo de persona que contrata.

Revísalos, ajústalos a tu voz y publícalos desde el panel. Uno bueno al mes vale más que diez
apresurados.

---

## Parte 6 — Plazos realistas

| Cuándo | Qué esperar |
|---|---|
| 24–72 h | La home aparece al buscar `site:axchisan.com` |
| 1–2 semanas | Las páginas principales indexadas; empiezas a salir por "Duvan Arciniegas" |
| 1–2 meses | Las fichas de proyecto indexadas; primeras impresiones por términos técnicos |
| 3–6 meses | Los artículos empiezan a traer tráfico, si los publicas |

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
- **No borres la página de un proyecto** una vez indexada; si sobra, redirige a `/trabajo`.
