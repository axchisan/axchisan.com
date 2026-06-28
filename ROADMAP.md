# Roadmap — Axchi Studio (axchisan.com)

Rediseño desde cero del sitio personal/comercial. Repo nuevo, **mismo backend/DB** que la versión anterior (`miWebPersonal`).

## Norte del proyecto
- **Posicionamiento:** Axchi = *studio de software* (founder en segundo plano).
- **Objetivo #1:** marca + autoridad + **blog**. Servicios presentes pero secundarios.
- **Problema a corregir:** la web vieja se sentía "biografía personal" en vez de marca/negocio.
- **Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Motion · Prisma (Postgres existente) · NextAuth.

## Sistema de diseño (anti-slop)
Apoyado en skills: `impeccable`, `ui-ux-pro-max`, `design-taste-frontend`, `emil-design-eng`, `brandkit`.
Dials objetivo: **VARIANCE 6 · MOTION 5 · DENSITY 3** (premium, editorial, sobrio).
Evitar: gradiente violeta→cian genérico, hero centrado reflex, glassmorphism por defecto, grid de 3 cards, Inter genérica.

## Arquitectura de información (home)
1. Hero studio (propuesta de valor de marca)
2. Barra de confianza / métricas como resultados
3. Qué hacemos (servicios productizados)
4. Trabajo / casos de estudio
5. **Insights / Blog** ⭐ (jugada de autoridad)
6. Detrás de Axchi (founder condensado)
7. CTA + contacto

Rutas: `/` · `/servicios` · `/trabajo` (+`/[slug]`) · `/blog` (+`/[slug]`) · `/sobre` · `/contacto` · `/admin/*` · legales.

## Fases
- [ ] **F0 — Fundaciones:** repo + scaffold Next 16 + port backend (Prisma/lib/API/admin/auth) + misma DB + dev local.
- [ ] **F1 — Marca + design system:** tokens, paleta OKLCH, tipografía, logo, componentes base.
- [ ] **F2 — IA + copy:** sitemap, copy de studio, mapeo contenido DB → ofertas/casos/blog.
- [ ] **F3 — Build frontend:** todas las páginas públicas + reuso admin.
- [ ] **F4 — Pulido:** motion, a11y WCAG AA, SEO (Organization), OG, performance.
- [ ] **F5 — Deploy:** CI GitHub Actions → Coolify staging (subdominio) → cutover dominio.

## Infra
- GitHub: `axchisan/axchisan.com` (privado).
- Coolify: staging primero en subdominio; cutover al final. App prod actual: "Mi web Personal" (`zp9al83h220641m1o68czcib`).
- DB Postgres compartida con la versión anterior (no se migra el esquema).
