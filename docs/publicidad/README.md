# Publicidad de Axchi

Regla de toda la publicidad: **sin precios**; cada pieza lleva a la web a averiguarlo. Es poca
y general a propósito: dos piezas impresas, y la variedad por sector va en redes.

| Para qué | Qué usar | Dónde |
|---|---|---|
| Entregar en persona | Tarjeta de dos caras, 9 × 5 cm | `impresos/tarjeta-cara.pdf` y `impresos/tarjeta-reverso.pdf` |
| Dejar en mostradores o repartir | Volante de una cara, media carta | `impresos/volante.pdf` |
| Instagram y Facebook | 12 publicaciones del primer mes, con su calendario y pie de foto | `redes/` y `redes.md` |
| Perfil de Google | Guía paso a paso | `perfil-de-google.md` |
| Fotos de la oficina | Prompts para Gemini (el único material que se hace con IA) | `prompts-gemini.md` |

## Imprimir

| Pieza | Cantidad para empezar | Papel |
|---|---|---|
| Tarjeta | 200 | Propalcote 300 g, plastificado mate por ambas caras |
| Volante | 300 | Propalcote 150 g brillante (o 250 g mate si va a mostradores) |

Los PDF traen 3 mm de sangrado y el texto queda a 5 mm del corte. Pide una prueba de color: el
verde azulado sale más apagado en papel. Al recibir el tiraje, escanea el QR con el celular.

Cada QR lleva su origen (`tarjeta/general`, `volante/general`) y el panel `/admin`, en
**Visitas por publicidad**, cuenta las visitas que trae cada pieza.

## Regenerar

| Comando | Qué hace |
|---|---|
| `npx tsx scripts/impresos.ts` | Tarjeta y volante |
| `npx tsx scripts/redes.ts` | Las 12 publicaciones |
| `npx tsx scripts/publicidad.ts` | Los adjuntos para Gemini y `prompts-gemini.md` |
