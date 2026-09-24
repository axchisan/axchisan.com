/**
 * Geometría de la marca, sin React: la comparten el componente `LogoMark` y
 * `scripts/iconos.ts`, que genera favicon, iconos de app e imagen social. Así
 * ningún archivo de icono puede divergir del logo que se ve en el sitio.
 *
 * Orden de pintado = orden de la cinta: pata derecha al fondo, barra encima,
 * pata izquierda delante. De ahí sale el tejido imposible.
 */
export const VIEWBOX = { x: -1, y: 0, w: 140, h: 100 } as const

export const CARAS = [
  { puntos: "58.20,0.00 80.50,0.00 124.50,100.00 102.20,100.00", color: "#0a7676" },
  { puntos: "13.00,52.00 125.70,52.00 138.80,70.00 -0.10,70.00", color: "#12a5a5" },
  { puntos: "58.20,0.00 80.50,0.00 36.50,100.00 14.20,100.00", color: "#3fc9c2" },
] as const

/** Fondo oscuro de la marca: favicon, iconos de app y banda del sitio. */
export const FONDO_MARCA = "#0b0f14"
