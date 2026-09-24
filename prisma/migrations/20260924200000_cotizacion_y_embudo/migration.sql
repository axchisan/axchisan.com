-- Datos propios de la cotización. Todas opcionales: los mensajes previos no los tienen.
ALTER TABLE "contact_messages"
  ADD COLUMN "telefono" TEXT,
  ADD COLUMN "sector" TEXT,
  ADD COLUMN "necesidad" TEXT,
  ADD COLUMN "presupuesto" TEXT,
  ADD COLUMN "plazo" TEXT,
  ADD COLUMN "origen" TEXT;

-- Embudo: cada fila de analítica es un evento. Las filas previas eran visitas.
ALTER TABLE "site_analytics"
  ADD COLUMN "evento" TEXT NOT NULL DEFAULT 'visita',
  ADD COLUMN "detalle" TEXT;

CREATE INDEX "site_analytics_evento_createdAt_idx" ON "site_analytics"("evento", "createdAt");
