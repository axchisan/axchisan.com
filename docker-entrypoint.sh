#!/bin/sh
set -e

# El volumen persistente de uploads se monta sobre /app/public/uploads y suele
# pertenecer a root, mientras la app corre como 'nextjs' (uid 1001). Sin esto,
# escribir nuevos archivos falla con EACCES. Aseguramos las carpetas y el dueño
# en cada arranque (es idempotente y rapido).
UPLOADS_DIR=/app/public/uploads
mkdir -p \
  "$UPLOADS_DIR/images" \
  "$UPLOADS_DIR/videos" \
  "$UPLOADS_DIR/documents" \
  "$UPLOADS_DIR/archives" \
  "$UPLOADS_DIR/executables" \
  "$UPLOADS_DIR/mobile-apps" \
  "$UPLOADS_DIR/source-code" \
  "$UPLOADS_DIR/other"
chown -R nextjs:nodejs "$UPLOADS_DIR"

# Bajamos privilegios a 'nextjs' y arrancamos la app (node server.js via CMD).
exec su-exec nextjs:nodejs "$@"
