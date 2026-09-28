#!/usr/bin/env bash
# Prepara los clips de una página cinematográfica para el scrub con video.
#
#   scripts/codificar-cinematico.sh <carpeta-de-clips> <carpeta-de-salida>
#   scripts/codificar-cinematico.sh ~/Documents/Dev/PaginasScroll/hotel-orilla/clips ~/Documents/Dev/PaginasScroll/hotel-orilla/video
#
# Por cada actoN.mp4 (1920×1080) genera:
#   actoN-d.mp4   escritorio, 1920×1080
#   actoN-m.mp4   celular, recorte vertical del centro a 608×1080: resolución
#                 nativa en el teléfono en vez del centro ampliado de la toma
#   actoN-d.png, actoN-m.png   primer fotograma, para el póster
#
# Los ajustes que hacen posible el scrub:
#   -g 6 -keyint_min 6 -sc_threshold 0   un fotograma clave cada 6: saltar a
#                 cualquier instante decodifica como mucho 5 fotogramas
#   -bf 0         sin fotogramas B, que obligan a decodificar hacia adelante
#   -an           sin audio
#   -movflags +faststart   índice al principio del archivo
#   -crf 27 -tune film     medido: la mitad de peso que los WebP de antes y más nitidez
set -euo pipefail
origen="$1"; destino="$2"
mkdir -p "$destino"
comun=(-an -c:v libx264 -preset slow -crf 27 -tune film -pix_fmt yuv420p -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -movflags +faststart)
for clip in "$origen"/acto[0-9].mp4; do
  n=$(basename "$clip" .mp4)
  ffmpeg -v error -y -i "$clip" "${comun[@]}" "$destino/$n-d.mp4"
  ffmpeg -v error -y -i "$clip" -vf "crop=608:1080:(iw-608)/2:0" "${comun[@]}" "$destino/$n-m.mp4"
  for v in d m; do ffmpeg -v error -y -i "$destino/$n-$v.mp4" -frames:v 1 "$destino/$n-$v.png"; done
  echo "$n: $(du -h "$destino/$n-d.mp4" | cut -f1) escritorio, $(du -h "$destino/$n-m.mp4" | cut -f1) celular"
done
