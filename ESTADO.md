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
| Ola 2: Sonrisa Clara, Titán Gym, Tu Casa Inmobiliaria, Pan de la Casa, Rojas & Duarte | 5 de 6. Falta la app de fidelización |
| Ola 3: bot de WhatsApp, asistente con IA, catálogo B2B, reservas de hotel, facturación DIAN | Sin empezar |
| Pruebas E2E | 313 en escritorio y celular, incluida WCAG AA |
| Medición del embudo | Propia: visitas, aperturas de demo y clics a WhatsApp en la base (`lib/eventos`) |

## Hoja de ruta

En orden. Cada punto se cierra con pruebas, despliegue y verificación en producción.

| # | Tarea | Por qué va en este orden | Estado |
|---|---|---|---|
| 1 | **Footer**: la columna de soluciones crece con cada demo y desborda | Rompe todas las páginas del sitio; arreglo corto | **Hecho**: los sectores van en una franja propia, en columnas |
| 2 | **Open Graph**: tarjeta y texto al compartir el enlace, y una tarjeta por ficha | El enlace se comparte por WhatsApp todos los días; hoy describe el portafolio viejo | **Hecho**: texto nuevo, tarjeta general, una por ficha y por demo (`npm run og`, `lib/metadatos.ts`) |
| 3 | **Brisas del Mar**: el scroll se siente trabado y la imagen pierde calidad. Medir, encontrar la causa e investigar una técnica mejor para las páginas cinematográficas | Es un plan que se vende ($ 1.800.000): la demo tiene que ser la mejor del catálogo | Pendiente |
| 4 | **SEO**: revisar metadatos, sitemap, datos estructurados y rendimiento; dejar pasos de Search Console, Bing y analítica | Depende de 2 (la tarjeta nueva) y conviene hacerlo con el sitio ya corregido | Pendiente |
| 5 | App de fidelización (última de la ola 2) | Después de dejar sano lo que ya existe | Pendiente |
| 6 | Ola 3 | Según los datos del embudo | Pendiente |

## Pendientes del dueño del sitio

Cosas que solo se pueden hacer desde tus cuentas. Cada una tiene sus pasos en el documento que se
indica.

| Tarea | Dónde están los pasos |
|---|---|
| Registro DMARC en el DNS de Hostinger | `docs/correo-dominio.md` |
| Search Console: enviar el sitemap y pedir indexación de las fichas | `SEO.md` |
| Bing Webmaster Tools | `SEO.md` |
