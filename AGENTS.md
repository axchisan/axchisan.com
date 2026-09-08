<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Notas del proyecto

Antes de tocar nada, leer `README.md` (arquitectura) y `DESIGN.md` (sistema de diseño y por qué cada
decisión). Trampas ya pisadas en este repositorio:

- **`unstable_cache` serializa el resultado.** Un campo de fecha llega como `Date` en la primera
  visita y como `string` a partir de la segunda. Todo lo que formatee una fecha pasa por `toDate()`
  de `lib/utils.ts`; saltárselo produce un 500 que solo aparece al acertar la caché.
- **Toda ruta que escribe debe llamar a `invalidate()`** (`lib/cache.ts`) con su etiqueta. Sin eso el
  sitio público sirve datos viejos hasta cinco minutos después de publicar.
- **Nada escribe en disco.** El hosting es serverless: los archivos van a R2 por URL prefirmada
  (`lib/storage.ts`), nunca a `public/`.
- **La suite E2E corre contra una rama de Neon**, no contra producción. Ver `playwright.config.ts`.
- **El contraste está calculado, no elegido a ojo.** Cambiar un color de `globals.css` obliga a
  reejecutar `npx playwright test e2e/accesibilidad.spec.ts`.
- **Patrones prohibidos en la interfaz** (ver DESIGN.md): versalitas monoespaciadas como etiqueta,
  flechas pegadas al texto de un botón, cadenas de metadatos unidas por `·`, una palabra del titular
  en otro color, animaciones de entrada por sección al hacer scroll.
