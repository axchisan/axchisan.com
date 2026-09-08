# axchisan.com

Portafolio y blog de **Duvan Yair Arciniegas**, desarrollador de software en Bogotá.
Sitio público con panel de administración propio: proyectos, artículos, mensajes de contacto y
gestión de archivos, sin depender de un CMS externo.

**En vivo:** [axchisan.com](https://axchisan.com)

## Arquitectura

Todo el sistema corre sobre cuotas gratuitas **permanentes**, no sobre créditos con fecha de
caducidad. Es una restricción de diseño, no una casualidad: la versión anterior de este sitio murió
cuando venció el VPS que la alojaba.

```
                      axchisan.com
                            │
                            ▼
                    ┌───────────────┐
                    │    Vercel     │   Next.js 16 · React 19
                    │   (Hobby)     │   SSR + caché de datos
                    └───────┬───────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
     ┌────────────┐  ┌─────────────┐  ┌───────────┐
     │    Neon    │  │ Cloudflare  │  │  Resend   │
     │  Postgres  │  │     R2      │  │  correo   │
     │  Prisma 7  │  │ subidas por │  │ avisos de │
     │            │  │  URL firmada│  │ contacto  │
     └────────────┘  └─────────────┘  └───────────┘
```

| Capa | Elección | Por qué |
|---|---|---|
| Framework | Next.js 16 · React 19 | Server Components y caché de datos con etiquetas |
| Estilos | Tailwind v4 con tokens propios | Ver [`DESIGN.md`](DESIGN.md) |
| Base de datos | PostgreSQL en Neon · Prisma 7 con adapter `pg` | Escala a cero; ramas para pruebas |
| Archivos | Cloudflare R2 (API S3) | Sin cobro de salida; el hosting no tiene disco persistente |
| Autenticación | NextAuth (credenciales) | Un solo administrador; sin proveedor externo |
| Correo | Resend | Aviso inmediato al recibir un mensaje |
| Pruebas | Playwright + axe-core | 66 pruebas: funcionales, de panel y de accesibilidad |

### Dos decisiones que condicionan el resto

**Las subidas no pasan por el servidor.** El cuerpo de una petición en un entorno serverless está
limitado a unos pocos megabytes, así que un APK o un instalador no cabría. El navegador pide una URL
prefirmada a `/api/admin/upload-url`, sube el archivo **directo a R2**, y solo entonces el servidor
registra los metadatos. Ver [`lib/storage.ts`](lib/storage.ts).

**Cada mutación invalida su etiqueta de caché.** Las consultas públicas están cacheadas con
`unstable_cache` y etiquetas por dominio (`projects`, `blog`, `skills`…). Cada ruta que escribe llama
a `invalidate()`, de modo que publicar desde el panel se refleja en la siguiente visita y no cinco
minutos después. Ver [`lib/cache.ts`](lib/cache.ts).

## Desarrollo

```bash
npm install
cp .env.example .env.local     # rellenar los valores
npx prisma migrate deploy      # crear el esquema
npm run db:seed                # perfil, skills y servicios
npm run db:seed:content        # proyectos y artículos
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción, con verificación de tipos |
| `npm run typecheck` | Solo `tsc --noEmit` |
| `npm test` | Suite Playwright completa |
| `npm run test:prepare` | Siembra la rama de pruebas de Neon |
| `npm run db:studio` | Prisma Studio |

### Pruebas

La suite **no toca la base de producción**: corre contra una rama dedicada de Neon en el puerto 3100,
con la configuración de [`.env.test`](.env.example), y sin clave de Resend para no enviar correos
reales.

```bash
npm run test:prepare   # una vez
npm test
```

Cubre las rutas públicas en escritorio y móvil, la navegación completa, el conmutador de tema, el
formulario de contacto, el ciclo completo de proyecto y de artículo en el panel, y una auditoría
WCAG 2.1 AA con axe en los dos temas.

## Copias de seguridad

Un workflow semanal vuelca la base, la cifra con AES-256 y la guarda como artefacto
([`.github/workflows/backup.yml`](.github/workflows/backup.yml)). Los artefactos de un repositorio
público son descargables por cualquiera: el volcado nunca se sube en claro.

Para restaurar:

```bash
gh run download <run-id> --repo axchisan/axchisan.com
gpg --batch --pinentry-mode loopback --passphrase "$BACKUP_PASSPHRASE" \
    --decrypt axchisan-AAAAMMDD.sql.gz.gpg > volcado.sql.gz
gunzip volcado.sql.gz
psql "$DIRECT_DATABASE_URL" < volcado.sql
```

`BACKUP_PASSPHRASE` es el secreto del repositorio; sin él el volcado es irrecuperable.

## Estructura

```
app/            Rutas (App Router): público, panel y API
components/     UI — site/, ui/, admin/, work/, contact/
lib/            data (consultas cacheadas), storage (R2), cache, mail, auth
prisma/         Esquema, migraciones y seeds
e2e/            Suite Playwright
DESIGN.md       Sistema de diseño y el razonamiento detrás
```

## Historia

Este repositorio contiene el proyecto completo desde **septiembre de 2025**. La primera versión
vivía en `axchisan/miWebPersonal` sobre un VPS con Docker y Coolify; al rehacerse el sitio en 2026 su
historia se injertó aquí para conservar la trazabilidad en una sola línea de commits.
