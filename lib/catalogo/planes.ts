/**
 * Planes públicos de Axchi. Única fuente de precios del sitio y de las demos:
 * cambiar un precio es cambiar una línea aquí. El razonamiento detrás de cada
 * cifra está en PRECIOS.md; si cambia una, cambia el documento también.
 */

export type PlanId =
  | "presencia"
  | "pagina-profesional"
  | "sitio-con-panel"
  | "catalogo-whatsapp"
  | "citas-en-linea"
  | "tienda-con-pagos"
  | "sistema-de-gestion"
  | "app-movil"

export type Plan = {
  id: PlanId
  nombre: string
  /** En pesos colombianos, sin decimales. Es el precio "desde". */
  desde: number
  /** Plazo de entrega, en lenguaje de cliente. */
  entrega: string
  /** Una línea: qué obtiene el cliente. */
  resumen: string
}

export const PLANES: Record<PlanId, Plan> = {
  presencia: {
    id: "presencia",
    nombre: "Presencia",
    desde: 300_000,
    entrega: "3 días hábiles",
    resumen: "Una página con tus servicios, horario, ubicación y botón de WhatsApp.",
  },
  "pagina-profesional": {
    id: "pagina-profesional",
    nombre: "Página profesional",
    desde: 900_000,
    entrega: "1 a 2 semanas",
    resumen: "Diseño propio con tu marca, formulario, analítica y ficha de Google.",
  },
  "sitio-con-panel": {
    id: "sitio-con-panel",
    nombre: "Sitio con panel",
    desde: 1_800_000,
    entrega: "2 a 3 semanas",
    resumen: "Varias páginas y un panel para cambiar textos, fotos y precios tú mismo.",
  },
  "catalogo-whatsapp": {
    id: "catalogo-whatsapp",
    nombre: "Catálogo con pedidos por WhatsApp",
    desde: 2_200_000,
    entrega: "2 a 3 semanas",
    resumen: "Productos, carrito y pedido que te llega completo por WhatsApp.",
  },
  "citas-en-linea": {
    id: "citas-en-linea",
    nombre: "Citas en línea",
    desde: 2_500_000,
    entrega: "3 semanas",
    resumen: "Tus clientes reservan desde el celular y tú ves la agenda del día.",
  },
  "tienda-con-pagos": {
    id: "tienda-con-pagos",
    nombre: "Tienda con pagos",
    desde: 3_500_000,
    entrega: "3 a 5 semanas",
    resumen: "Cobro en línea con PSE, Nequi o tarjeta, inventario y estados de pedido.",
  },
  "sistema-de-gestion": {
    id: "sistema-de-gestion",
    nombre: "Sistema de gestión",
    desde: 6_000_000,
    entrega: "5 a 7 semanas",
    resumen: "El sistema de tu negocio: usuarios, módulos propios, reportes y Excel.",
  },
  "app-movil": {
    id: "app-movil",
    nombre: "App móvil",
    desde: 8_000_000,
    entrega: "6 a 10 semanas",
    resumen: "Una app instalable sobre un sistema nuevo o existente.",
  },
}

/** El plan de entrada: se muestra en todo el sitio. */
export const PRECIO_ENTRADA = PLANES.presencia.desde

const formato = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

/** `$ 300.000`: formato colombiano, sin decimales. */
export function pesos(valor: number) {
  return formato.format(valor)
}
