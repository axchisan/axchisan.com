-- CRM de prospectos: negocios que pueden ser clientes y su historial de contacto.
CREATE TABLE "prospectos" (
    "id" TEXT NOT NULL,
    "placeId" TEXT,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "ficha" TEXT,
    "ciudad" TEXT NOT NULL,
    "zona" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "web" TEXT,
    "estadoWeb" TEXT NOT NULL DEFAULT 'sin-pagina',
    "calificacion" DOUBLE PRECISION,
    "resenas" INTEGER NOT NULL DEFAULT 0,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "mapsUrl" TEXT,
    "distanciaKm" DOUBLE PRECISION,
    "prioridad" TEXT NOT NULL DEFAULT 'C',
    "puntaje" INTEGER NOT NULL DEFAULT 0,
    "fortalezas" TEXT,
    "falta" TEXT,
    "plan" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'por-contactar',
    "proximo" TIMESTAMP(3),
    "notas" TEXT,
    "fuente" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "prospectos_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "prospectos_placeId_key" ON "prospectos"("placeId");
CREATE INDEX "prospectos_estado_prioridad_idx" ON "prospectos"("estado", "prioridad");
CREATE INDEX "prospectos_ciudad_zona_idx" ON "prospectos"("ciudad", "zona");

CREATE TABLE "prospecto_eventos" (
    "id" TEXT NOT NULL,
    "prospectoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "prospecto_eventos_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "prospecto_eventos_prospectoId_createdAt_idx" ON "prospecto_eventos"("prospectoId", "createdAt");
ALTER TABLE "prospecto_eventos" ADD CONSTRAINT "prospecto_eventos_prospectoId_fkey" FOREIGN KEY ("prospectoId") REFERENCES "prospectos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
