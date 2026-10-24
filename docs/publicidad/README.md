# Publicidad de Axchi

Todo lo que hace falta para salir a buscar clientes: impresos listos para la imprenta, piezas para
redes y la guía del Perfil de Google. Regla de toda la publicidad: **sin precios**; cada pieza lleva
a la web a averiguarlo.

| Carpeta o archivo | Qué hay | Cómo se genera |
|---|---|---|
| `impresos/` | Tarjetas y volantes en PDF para la imprenta y PNG para revisar | `npx tsx scripts/impresos.ts` |
| `prompts-gemini.md` | 34 prompts para historias, publicaciones, portada y fotos de la oficina | `npx tsx scripts/publicidad.ts` |
| `adjuntos/` | Lo que se sube a Gemini: logo, capturas de cada demo sin la barra de precio, foto base de la oficina | `npx tsx scripts/publicidad.ts` |
| `generadas/` | Lo que se descargó de Gemini, con su código (fuera de git) | A mano |
| `qr/` | Los QR sueltos, por si hacen falta para otra pieza (stickers, menús) | `npx tsx scripts/qr-publicidad.ts` |
| `perfil-de-google.md` | El Perfil de Empresa de Google, paso a paso | A mano |

## Impresos

Cada QR lleva su origen (`tarjeta/restaurantes`, `volante/general`…) y el panel `/admin`, en
**Visitas por publicidad**, cuenta cuántas visitas trae cada uno. Todos se verificaron con un
lector de QR.

| Pieza | Archivo | Medida final | Para qué |
|---|---|---|---|
| Tarjeta de presentación | `tarjeta-cara.pdf` + `tarjeta-reverso.pdf` | 9 × 5 cm | La tuya: con tu nombre, WhatsApp y correo |
| Tarjeta para dejar en un negocio | `tarjeta-<sector>.pdf`, reverso `tarjeta-reverso.pdf` | 9 × 5 cm | Una pregunta para ese dueño y el QR a la demo de su sector |
| Volante general | `volante-general.pdf` + `volante-reverso.pdf` | Media carta, 14 × 21,6 cm | Para repartir en una zona con negocios variados |
| Volante por sector | `volante-<sector>.pdf`, reverso `volante-reverso.pdf` | Media carta | Para una calle o un gremio concreto |

Los PDF traen 3 mm de sangrado por lado (la tarjeta mide 9,6 × 5,6 cm con sangrado) y el texto
queda a 5 mm del corte.

### Qué pedir a la imprenta para empezar

| Pieza | Cantidad | Papel |
|---|---|---|
| Tarjeta de presentación | 200 | Propalcote 300 g, plastificado mate por ambas caras |
| Tarjetas por sector: restaurantes, peluquerías, panaderías, ferreterías, veterinarias, consultorios | 100 de cada una | Igual |
| Volante general | 300 | Propalcote 150 g brillante |
| Volantes de restaurantes y peluquerías | 200 de cada uno | Igual |

Pide una prueba de color antes del tiraje: el verde azulado suele salir más apagado en papel. Al
recibirlas, escanea una de cada tipo con el celular.

## Piezas de Gemini hechas

| Código | Pieza |
|---|---|
| H01 | Historia general: prueba antes de contratar |
| H02 | Historia: ¿cuánto cuesta una página? |
| H03 | Historia: veterinarias |
| G01 | Portada para Google y redes |
| O01 | Foto base de la oficina (`adjuntos/oficina-base.jpg`) |

Las demás están en `prompts-gemini.md`.
