-- URL legible para los proyectos.
-- Se añade como nullable: la restricción de unicidad en Postgres permite
-- varios NULL, así que las filas existentes no bloquean la migración. El
-- relleno lo hace prisma/backfill-slugs.ts inmediatamente después.
ALTER TABLE "projects" ADD COLUMN "slug" TEXT;

CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
