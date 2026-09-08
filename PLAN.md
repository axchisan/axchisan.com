# Plan de reconstrucción — axchisan.com

**Contexto:** el VPS que alojaba el sitio se dio de baja, la base de datos se perdió y el sitio
lleva meses caído. El frontend actual se lee como generado por IA. El historial del proyecto está
partido en dos repositorios. Este documento es el plan para resolver las cuatro cosas.

**Objetivo real:** un portafolio que consiga entrevistas. Todo lo demás se subordina a eso.

---

## Estado encontrado (7 de septiembre de 2026)

| Cosa | Estado |
|---|---|
| Dominio `axchisan.com` | Registrado en Hostinger, vigente hasta 2027-08-01. Apunta a `147.93.178.204` (VPS muerto). Nameservers `ns1/ns2.dns-parking.com` |
| Sitio en vivo | Caído. HTTP 404 de la página de parking, HTTPS no conecta |
| Base de datos | Perdida. Sin dumps locales, sin Docker, sin snapshots en Wayback Machine |
| Cuenta AWS `612216903994` | Creada 2026-06-21, **Free Plan por créditos** (no el free tier de 12 meses). `aws freetier` solo reporta cuotas *Always Free*. Caduca ~2026-12-21 |
| Repo `axchisan.com` | Privado, 19 commits (2026-06-28 → 2026-06-29), Next 16 + React 19 + Tailwind v4 + Prisma 7 |
| Repo `miWebPersonal` | Público, 42 commits (2025-09-26 → 2026-06-09). **Sin ancestro común** con el anterior |
| Secreto expuesto | `***REMOVED***` hardcodeada en `scripts/setup-database.ts` del repo **público** |
| Uploads | Escritos a `public/uploads` del sistema de archivos local — incompatible con cualquier hosting serverless |

### Por qué no alojamos en AWS

La cuenta está en el plan gratuito nuevo de AWS, que es un saldo de créditos con caducidad, no una
cuota permanente. En diciembre de 2026 el sitio volvería a caerse por la misma razón que cayó el
VPS. AWS queda para experimentos, no para el sitio.

---

## Arquitectura destino

Todas las piezas tienen cuota gratuita permanente, no ensayos con fecha de vencimiento.

```
                    axchisan.com  (Hostinger DNS)
                          │
                          ▼
                   ┌─────────────┐
                   │   Vercel    │  Next.js 16 · SSR + ISR · HTTPS
                   │   (Hobby)   │  100 GB transferencia/mes
                   └──────┬──────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
   ┌────────────┐  ┌─────────────┐  ┌────────────┐
   │    Neon    │  │ Cloudflare  │  │   Resend   │
   │  Postgres  │  │     R2      │  │   correo   │
   │  0.5 GB    │  │  10 GB      │  │ 3.000/mes  │
   │ 100 CU-h/mes│  │ egress $0   │  │ 100/día    │
   └────────────┘  └─────────────┘  └────────────┘
                    media.axchisan.com
```

| Pieza | Servicio | Cuota gratuita | Reemplaza a |
|---|---|---|---|
| Hosting | Vercel Hobby | 100 GB transferencia, 1M invocaciones, 1M edge requests | VPS + Coolify + Docker |
| Base de datos | Neon Postgres | 0.5 GB, 100 CU-h/mes, 10 ramas | Postgres del VPS |
| Archivos | Cloudflare R2 | 10 GB, 1M escrituras, 10M lecturas, sin egress | volumen Docker |
| Correo | Resend | 3.000/mes, 1 dominio | nodemailer + SMTP |
| CI | GitHub Actions | 2.000 min/mes en repo público: ilimitado | GHA → GHCR → Coolify |

**Salvedad del plan Hobby de Vercel:** prohíbe el uso comercial y lo hace cumplir con suspensión de
cuenta. Un portafolio personal con blog encaja sin problema; un sitio que venda servicios, no. Esto
obliga a un cambio de posicionamiento en el copy —y resulta que ese cambio también es el correcto
para el objetivo de conseguir trabajo. Ver Fase 3.

---

## Fases

Cada fase se cierra con su verificación antes de empezar la siguiente.

### F0 · Base local y saneamiento

1. `npm install` sobre Node 24; leer `node_modules/next/dist/docs` (Next 16 tiene rupturas frente a lo que doy por sabido).
2. Sacar la contraseña hardcodeada del seed → variable de entorno `ADMIN_PASSWORD`. Purgar el secreto del historial en F5.
3. `.env.example` con todas las variables documentadas.
4. Levantar el proyecto contra una rama de Neon y confirmar `npm run build` y `npm run dev` en verde.

**Cierre:** el sitio corre en `localhost:3000` con datos reales.

### F1 · Infraestructura

1. **Neon** — proyecto `axchisan`, ramas `main` (prod) y `dev`. `prisma migrate deploy` + seed.
2. **R2** — bucket `axchisan-media`, token S3, dominio público `media.axchisan.com`.
3. **Migración de uploads a R2** — reescribir `/api/upload`, `/api/admin/upload-image`,
   `/api/admin/upload-file` y `/api/files/[...path]`. Sin esto el panel admin no funciona en Vercel:
   el sistema de archivos es efímero y de solo lectura.
4. **Resend** — dominio verificado, sustituir nodemailer en el flujo de contacto.
5. **Vercel** — proyecto ligado al repo, variables de entorno, despliegue de preview.
6. **Copias de seguridad** — GitHub Action semanal con `pg_dump` cifrado. La BD ya se perdió una vez.

**Cierre:** despliegue en `*.vercel.app` con BD, subida de archivos y correo funcionando. El dominio
todavía no se toca.

### F2 · Contenido

1. Perfil, skills, servicios y settings desde el seed existente.
2. **Proyectos** — curar 6–8 de tus ~50 repos de GitHub, leyendo READMEs y commits para escribir
   casos reales con resultado, no descripciones genéricas.
3. **Blog** — 2–3 artículos de arranque. Es la jugada de autoridad: lo que un reclutador lee.
4. Verificar el panel admin de punta a punta para que puedas seguir publicando tú.

**Cierre:** el sitio tiene contenido real, no *lorem ipsum*.

### F3 · Rediseño — "Grafito minimal"

Lo que hay hoy es exactamente el patrón que la guía de diseño cataloga como delator de IA: fondo
casi negro (`#0A0B0D`) con un único acento verde ácido (`#C6F24E`). A eso se suman constelación
reactiva en el hero, `hero-glow` con `radial-gradient` difuminado, spotlight cards, contadores
animados, etiquetas monoespaciadas en mayúsculas con `letter-spacing`, y flechas `→` pegadas al
texto de los botones. Todo eso sale.

1. **Brief y plan de tokens** antes de escribir una línea: paleta de 4–6 hex nombrados, tipografías
   con sus roles, concepto de retícula, principios. Revisión explícita contra los patrones por
   defecto: si algo se parece a lo que produciría para cualquier otro portafolio, se cambia.
2. **Sistema** — tokens en OKLCH, escala tipográfica según *The Elements of Typographic Style*,
   modo claro y oscuro reales, componentes base.
3. **Reposicionamiento del copy** — de "Axchi Studio, estudio de software que vende servicios" a
   portafolio profesional de Duvan Yair Arciniegas. Resuelve la restricción de Vercel Hobby y es lo
   que de verdad convierte cuando quien lee es un reclutador o un CTO.
4. **Páginas públicas** — home, trabajo (+ detalle), blog (+ detalle), sobre, contacto, 404, legales.
5. **Panel admin** con el mismo sistema.
6. **Piso de calidad** — responsive hasta móvil, foco de teclado visible, `prefers-reduced-motion`
   respetado, contraste WCAG AA, una sola pieza de movimiento orquestado en toda la página.

**Cierre:** revisión visual en escritorio y móvil, en claro y oscuro, sobre el preview real.

### F4 · Pruebas

1. **Playwright E2E** — cada ruta, cada enlace, cada botón: navegación, cambio de tema, menú móvil,
   formulario de contacto (envío correcto y validaciones), paginación y filtros de blog y trabajo,
   descargas de archivos.
2. **Admin E2E** — login, CRUD de proyectos, blog y skills, subida de imagen y de archivo, gestor de
   medios, mensajes, perfil, ajustes, cierre de sesión.
3. **Auditoría** — Lighthouse y axe en las rutas principales; enlaces rotos; metadatos OG y JSON-LD.
4. **Revisión manual** en navegador real de los recorridos que un test no juzga: cómo se ve.

**Cierre:** suite en verde y captura de cada página en ambos temas.

### F5 · Un solo repositorio

Hoy son dos historias sin ancestro común: 42 commits de `miWebPersonal` y 19 de `axchisan.com`.

1. Injertar el primer commit de `axchisan.com` sobre el último de `miWebPersonal`
   (`git replace --graft` + `git filter-repo` para materializarlo), preservando autores y fechas.
2. Purgar en la misma reescritura la contraseña del historial.
3. Verificar: ~61 commits + los nuevos, cronología coherente, y el árbol resultante **idéntico** al
   actual (el injerto no puede cambiar ni un byte del código).
4. `force-push` a `axchisan.com` y pasarlo a público.
5. `miWebPersonal`: README que apunta al repo nuevo, y archivar.
6. Alinear descripción, topics y homepage.

**Cierre:** un repo, una historia lineal desde septiembre de 2025, trazabilidad intacta.

### F6 · Salida a producción

1. DNS en Hostinger → Vercel (apex + www), `media` → R2.
2. HTTPS, redirección `www` → apex, verificación de certificado.
3. Sitemap, robots, OG e indexación comprobados en producción.
4. Smoke test completo sobre el dominio real.
5. README, `CLAUDE.md` y runbooks de despliegue y de restauración de copia.

**Cierre:** `https://axchisan.com` en vivo, con copias de seguridad automáticas.

---

## Puntos donde me detengo a preguntar

Acciones difíciles de revertir. No las ejecuto sin confirmación explícita:

- `force-push` sobre `axchisan.com` (F5)
- pasar el repo a público (F5)
- archivar `miWebPersonal` (F5)
- cambiar el DNS del dominio (F6)

## Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| Vercel Hobby y uso comercial | Posicionar como portafolio personal (F3). Si algún día vendes desde el sitio, Pro son 20 USD/mes o se migra a Cloudflare Workers |
| Neon suspende el compute al agotar 100 CU-h | Escala a cero a los 5 min de inactividad; un portafolio no se acerca al límite. Alerta de uso configurada |
| 0.5 GB de BD | El contenido pesado (imágenes, APKs, binarios) vive en R2, no en Postgres |
| Perder la BD otra vez | Copia semanal automática desde F1 |
| Contraseña filtrada en repo público | Se purga del historial en F5; **cámbiala en todos los sitios donde la reutilices** |
