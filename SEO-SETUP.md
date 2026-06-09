# Guía de configuración SEO — axchisan.com

Esta guía explica qué se implementó en el código y qué debes configurar TÚ (fuera del código)
para que el SEO se aplique a la perfección tras el despliegue.

## 1. Lo que ya hace el código (no requiere acción)
- **Sitemap dinámico**: `https://axchisan.com/sitemap.xml` (páginas estáticas + cada proyecto y artículo).
- **robots.txt**: `https://axchisan.com/robots.txt` (permite indexar, bloquea /admin /api /auth /messages /saved, apunta al sitemap).
- **Metadata por página**: título y descripción propios en home, about, services, projects, blog, contact, privacy, terms.
- **Metadata dinámica**: cada `/blog/[slug]` y `/projects/[id]` genera su título, descripción, canonical y Open Graph propios.
- **JSON-LD**: `Person` (global) + `Article` (blog) + `CreativeWork/SoftwareApplication` (proyectos).
- **SSR**: blog y proyectos se renderizan en el servidor → Google ve el contenido en el HTML inicial.
- **metadataBase + canonical**: URLs absolutas correctas en OG/canonical.

## 2. Variable de entorno (IMPORTANTE — configúrala en Coolify)
El código usa `NEXT_PUBLIC_SITE_URL` para construir todas las URLs de SEO (sitemap, canonical, OG).
Si no está, usa por defecto `https://axchisan.com` (que es tu dominio, así que funciona). Aun así,
**añádela explícitamente** en Coolify → tu app → Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://axchisan.com
```

Tras añadirla, vuelve a desplegar (rebuild) para que tome efecto. Verifica que tu deploy ya tiene
`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://axchisan.com`.

## 3. Verificación post-despliegue (hazlo cuando termine el deploy)
Abre en el navegador y confirma que cargan:
- `https://axchisan.com/sitemap.xml` → debe listar tus páginas, proyectos y artículos.
- `https://axchisan.com/robots.txt` → debe terminar con `Sitemap: https://axchisan.com/sitemap.xml`.
- Abre un proyecto/artículo y mira el código fuente (Ctrl+U): el `<title>` debe ser el del proyecto, no genérico.

## 4. Google Search Console (lo principal para aparecer en Google)
1. Entra a https://search.google.com/search-console y añade una propiedad.
2. Elige **"Prefijo de la URL"** → escribe `https://axchisan.com`.
3. **Verifica la propiedad** (la forma más fácil con Coolify es por DNS):
   - Opción DNS: añade el registro TXT que te da Google en tu proveedor de dominio (Hostinger/donde tengas el DNS).
   - Opción alternativa (meta tag): si prefieres, dímelo y te añado la etiqueta de verificación de Google en el `<head>` del sitio (campo `verification` de Next.js).
4. Una vez verificado, ve a **Sitemaps** (menú izquierdo) → escribe `sitemap.xml` → Enviar.
5. Usa **Inspección de URLs** (barra superior) para pegar `https://axchisan.com/` y pulsar **"Solicitar indexación"**. Repite con 3-4 URLs clave (home, about, projects, blog).

> La indexación tarda de unas horas a varios días. No es inmediata.

## 5. Validar los datos estructurados (rich snippets)
- Ve a https://search.google.com/test/rich-results
- Pega la URL de un artículo del blog (ej. `https://axchisan.com/blog/<slug>`) y de un proyecto.
- Debe detectar `Article` / `CreativeWork` y `Person` sin errores.
  - Nota: el JSON-LD por-proyecto se incluye desde el servidor; si el test no lo detecta en algún caso, avísame y ajusto la estrategia.

## 6. Mejora recomendada (opcional): imagen Open Graph
Hoy no hay una imagen por defecto al compartir el sitio en redes/WhatsApp. Para que se vea una
tarjeta con imagen, conviene añadir una `opengraph-image` (1200×630). Si quieres, te la genero
(con tu marca Axchi) y la integro — dímelo.

## 7. Extra (opcional)
- **Bing Webmaster Tools** (https://www.bing.com/webmasters): puedes importar directamente desde Search Console y enviar el mismo sitemap.
- **Velocidad/Core Web Vitals**: ya optimizado (SSR, fuentes self-hosted, animaciones GPU). Puedes medir en https://pagespeed.web.dev con tu URL.
- Pendiente técnico conocido: `images.unoptimized:true` sigue activo (no afecta SEO, sí un poco el peso de imágenes). Se puede abordar aparte.

## Resumen de acciones para ti
1. Añadir `NEXT_PUBLIC_SITE_URL=https://axchisan.com` en Coolify y redeploy.
2. Verificar propiedad en Google Search Console (DNS TXT).
3. Enviar `sitemap.xml` y solicitar indexación de las páginas clave.
4. Validar rich results de un artículo y un proyecto.
5. (Opcional) Pedirme la imagen Open Graph.
