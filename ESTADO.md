# Estado del proyecto y hoja de ruta

Documento vivo: qué hay en producción, qué falta y en qué orden se hace. Lo que cambia de estado se
actualiza aquí el mismo día. El plan de fondo sigue en `REESTRUCTURACION.md`; el detalle de SEO,
en `SEO.md`.

Última actualización: 28 de septiembre de 2026.

## Dónde estamos

axchisan.com vende páginas web, tiendas y sistemas a pymes de Colombia con un catálogo de demos
funcionales por sector. Producción: Next.js 16 en Vercel, Postgres en Neon, archivos en R2, correo
por Resend.

| Pieza | Estado |
|---|---|
| Sitio comercial (portada, soluciones, planes, proceso, a medida, empresa, cotizar, guías) | En producción |
| Ola 1 de demos: Canela, Look & Estilo, Brisas del Mar, Sabor de Casa, La Principal, Linaza, Jabones Mari (real) | Completa |
| Ola 2: Sonrisa Clara, Titán Gym, Tu Casa Inmobiliaria, Pan de la Casa, Rojas & Duarte, Café del Barrio | Completa |
| Ola 3: bot de WhatsApp, asistente con IA, catálogo B2B, reservas de hotel, facturación DIAN | Sin empezar |
| Pruebas E2E | 337 en escritorio y celular, incluida WCAG AA |
| Medición del embudo | Propia: visitas, aperturas de demo y clics a WhatsApp en la base (`lib/eventos`) |

## Hoja de ruta

En orden. Cada punto se cierra con pruebas, despliegue y verificación en producción.

| # | Tarea | Por qué va en este orden | Estado |
|---|---|---|---|
| 0 | **Fuentes locales**: `next/font/google` hacía caer compilaciones de producción al azar (vercel/next.js#99114) | Un despliegue fallido bloquea todo lo demás | **Hecho**: 20 archivos en `app/fuentes/`, `scripts/fuentes-locales.py` |
| 1 | **Footer**: la columna de soluciones crece con cada demo y desborda | Rompe todas las páginas del sitio; arreglo corto | **Hecho**: los sectores van en una franja propia, en columnas |
| 2 | **Open Graph**: tarjeta y texto al compartir el enlace, y una tarjeta por ficha | El enlace se comparte por WhatsApp todos los días; hoy describe el portafolio viejo | **Hecho**: texto nuevo, tarjeta general, una por ficha y por demo (`npm run og`, `lib/metadatos.ts`) |
| 3 | **Brisas del Mar**: el scroll se siente trabado y la imagen pierde calidad. Medir, encontrar la causa e investigar una técnica mejor para las páginas cinematográficas | Es un plan que se vende ($ 1.800.000): la demo tiene que ser la mejor del catálogo | **Hecho**: video con fotogramas clave cada 6 en vez de 627 imágenes; 22 MB en vez de 53, resolución nativa, vertical en celular. Ver `docs/demos/brisas-del-mar.md` |
| 4 | **SEO**: revisar metadatos, sitemap, datos estructurados y rendimiento; dejar pasos de Search Console, Bing y analítica | Depende de 2 (la tarjeta nueva) y conviene hacerlo con el sitio ya corregido | **Hecho** en el código: Lighthouse 96–100, `lastmod` corregido, Vercel Analytics y Speed Insights. Pasos de cuentas en `SEO.md` |
| 5 | App de fidelización (última de la ola 2) | Después de dejar sano lo que ya existe | **Hecho**: Café del Barrio, `/soluciones/programa-de-puntos` |
| 6 | Ola 3 | Según los datos del embudo | Pendiente |

## Pendientes del dueño del sitio

Cosas que solo se pueden hacer desde tus cuentas. Cada una tiene sus pasos en el documento que se
indica.

| Tarea | Dónde están los pasos |
|---|---|
| Registro DMARC en el DNS de Hostinger | `docs/correo-dominio.md` |
| Search Console: enviar el sitemap y pedir la indexación en dos días | `SEO.md`, parte 2 |
| Bing Webmaster Tools: importar desde Search Console | `SEO.md`, parte 3 |
| Perfil de Empresa de Google | `SEO.md`, parte 4 |
| Activar Vercel Web Analytics y Speed Insights | `SEO.md`, parte 6.1 |
| Refrescar la tarjeta de WhatsApp con el depurador de Facebook | `SEO.md`, parte 6.2 |
