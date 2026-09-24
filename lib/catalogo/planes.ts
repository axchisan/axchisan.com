/**
 * Planes públicos de Axchi. Única fuente de precios del sitio y de las demos:
 * cambiar un precio es cambiar una línea aquí. El razonamiento detrás de cada
 * cifra está en PRECIOS.md; si cambia una, cambia el documento también.
 *
 * Dos formas de pagar lo mismo: un pago único, o una suscripción mensual sin
 * pago inicial que ya incluye dominio, alojamiento y soporte.
 */

const formato = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

/** `$ 300.000`: formato colombiano, sin decimales. */
export function pesos(valor: number) {
  return formato.format(valor)
}

export type PlanId =
  | "presencia"
  | "pagina-profesional"
  | "sitio-con-panel"
  | "catalogo-whatsapp"
  | "citas-en-linea"
  | "tienda-con-pagos"
  | "sistema-de-gestion"
  | "sistema-completo"

export type Plan = {
  id: PlanId
  nombre: string
  /** En pesos colombianos, sin decimales. Es el precio "desde". */
  desde: number
  /** Plazo de entrega, en lenguaje de cliente. */
  entrega: string
  /** Una línea: qué obtiene el cliente. */
  resumen: string
  incluye: string[]
  noIncluye: string[]
  /** La suscripción que da lo mismo pagando por mes, si existe. */
  suscripcion?: SuscripcionId
}

export const PLANES: Record<PlanId, Plan> = {
  presencia: {
    id: "presencia",
    nombre: "Presencia",
    desde: 300_000,
    entrega: "3 días hábiles",
    resumen: "Una página con tus servicios, horario, ubicación y botón de WhatsApp.",
    incluye: [
      "Una página con tus servicios, horario y ubicación con mapa",
      "Galería de fotos y botón de WhatsApp",
      "Se ve bien en celular y aparece en Google",
      "Plantilla de Axchi con tus colores",
      "Una ronda de ajustes",
    ],
    noIncluye: ["Dominio (unos $ 60.000 al año, a tu nombre)", "Textos y fotos: los entregas tú", "Diseño a medida y panel para editar"],
    suscripcion: "pagina-mensual",
  },
  "pagina-profesional": {
    id: "pagina-profesional",
    nombre: "Página profesional",
    desde: 600_000,
    entrega: "1 a 2 semanas",
    resumen: "Diseño propio con tu marca, formulario, analítica y ficha de Google.",
    incluye: [
      "Diseño propio con tu marca",
      "Hasta 8 secciones",
      "Formulario que llega a tu correo",
      "Analítica de visitas",
      "Ficha de Google Business",
      "Dos rondas de ajustes",
    ],
    noIncluye: ["Panel para editar", "Tienda o reservas"],
    suscripcion: "pagina-mensual",
  },
  "sitio-con-panel": {
    id: "sitio-con-panel",
    nombre: "Sitio con panel",
    desde: 900_000,
    entrega: "2 semanas",
    resumen: "Varias páginas y un panel para cambiar textos, fotos y precios tú mismo.",
    incluye: ["Varias páginas", "Panel para cambiar textos, fotos y precios tú mismo", "Todo lo de la página profesional"],
    noIncluye: ["Ventas en línea"],
    suscripcion: "negocio-mensual",
  },
  "catalogo-whatsapp": {
    id: "catalogo-whatsapp",
    nombre: "Catálogo con pedidos por WhatsApp",
    desde: 1_200_000,
    entrega: "2 a 3 semanas",
    resumen: "Productos, carrito y pedido que te llega completo por WhatsApp.",
    incluye: [
      "Productos con fotos, variantes y combos",
      "Carrito que se conserva",
      "Pedido que llega armado por WhatsApp y queda guardado",
      "Panel de productos y pedidos",
      "Carga de hasta 50 productos",
    ],
    noIncluye: ["Cobro en línea"],
    suscripcion: "negocio-mensual",
  },
  "citas-en-linea": {
    id: "citas-en-linea",
    nombre: "Citas en línea",
    desde: 1_400_000,
    entrega: "2 a 3 semanas",
    resumen: "Tus clientes reservan desde el celular y tú ves la agenda del día.",
    incluye: [
      "Página con tus servicios y precios",
      "Reserva desde el celular solo en horas libres",
      "Panel con la agenda del día y de la semana",
      "Confirmación por correo",
    ],
    noIncluye: ["Recordatorios automáticos por WhatsApp (módulo aparte)"],
    suscripcion: "negocio-mensual",
  },
  "tienda-con-pagos": {
    id: "tienda-con-pagos",
    nombre: "Tienda con pagos",
    desde: 1_800_000,
    entrega: "3 a 4 semanas",
    resumen: "Cobro en línea con PSE, Nequi o tarjeta, inventario y estados de pedido.",
    incluye: ["Todo lo del catálogo", "Cobro con PSE, Nequi o tarjeta", "Inventario y estados de pedido", "Correos al comprador"],
    noIncluye: ["Comisión de la pasarela, que se descuenta de cada venta"],
    suscripcion: "negocio-mensual",
  },
  "sistema-de-gestion": {
    id: "sistema-de-gestion",
    nombre: "Sistema de gestión",
    desde: 2_400_000,
    entrega: "4 a 5 semanas",
    resumen: "El sistema de tu negocio: usuarios, módulos propios, reportes y Excel.",
    incluye: [
      "Usuarios con roles y permisos",
      "Los módulos de tu negocio: agenda, historias, inventario, pedidos…",
      "Reportes y exportación a Excel",
      "Copias de seguridad automáticas",
      "Capacitación para tu equipo",
    ],
    noIncluye: ["Cobro en línea y automatizaciones (están en el sistema completo)"],
    suscripcion: "sistema-mensual",
  },
  "sistema-completo": {
    id: "sistema-completo",
    nombre: "Sistema completo",
    desde: 3_000_000,
    entrega: "5 a 6 semanas",
    resumen: "El sistema de gestión con pagos en línea, automatizaciones y app instalable.",
    incluye: [
      "Todo lo del sistema de gestión",
      "Cobro en línea con PSE, Nequi o tarjeta",
      "Recordatorios y avisos automáticos por WhatsApp y correo",
      "App instalable en el celular de tu equipo y de tus clientes",
    ],
    noIncluye: ["Facturación electrónica (módulo aparte)", "Consumo de la pasarela y de los mensajes"],
    suscripcion: "sistema-mensual",
  },
}

export type SuscripcionId = "pagina-mensual" | "negocio-mensual" | "sistema-mensual"

export type Suscripcion = {
  id: SuscripcionId
  nombre: string
  /** Pesos por mes. */
  mensual: number
  resumen: string
  /** Lo que se obtiene, además del plan equivalente. */
  incluye: string[]
}

/**
 * Suscripciones: sin pago inicial, con permanencia mínima. Incluyen lo que en
 * el pago único se paga aparte: dominio, alojamiento, soporte y cambios.
 */
export const PERMANENCIA_MESES = 12

export const SUSCRIPCIONES: Record<SuscripcionId, Suscripcion> = {
  "pagina-mensual": {
    id: "pagina-mensual",
    nombre: "Página mensual",
    mensual: 39_900,
    resumen: "Tu página en línea sin pagar la construcción de una vez.",
    incluye: [
      "La página del plan Presencia",
      "Dominio y alojamiento incluidos",
      "Un cambio de contenido al mes",
      "Soporte por WhatsApp",
    ],
  },
  "negocio-mensual": {
    id: "negocio-mensual",
    nombre: "Negocio en línea",
    mensual: 79_900,
    resumen: "Catálogo con pedidos, citas en línea o sitio con panel, pagando por mes.",
    incluye: [
      "Catálogo con pedidos por WhatsApp, citas en línea o sitio con panel",
      "Dominio, alojamiento y copias de seguridad incluidos",
      "Una hora de cambios al mes",
      "Soporte por WhatsApp",
    ],
  },
  "sistema-mensual": {
    id: "sistema-mensual",
    nombre: "Sistema mensual",
    mensual: 129_900,
    resumen: "El sistema de tu negocio, con todo lo necesario para operarlo, pagando por mes.",
    incluye: [
      "El sistema de gestión con sus usuarios y módulos",
      "Dominio, alojamiento, base de datos y copias de seguridad",
      "Una hora de cambios al mes",
      "Soporte prioritario por WhatsApp",
    ],
  },
}

/** Para suscripciones: pagos en línea o automatizaciones se suman por mes. */
export const EXTRA_SUSCRIPCION = 20_000

export const PRECIO_RECORDATORIOS = 400_000

/** Módulos que se suman a cualquier plan de pago único. Razones en PRECIOS.md. */
export const MODULOS: { nombre: string; precio: string }[] = [
  { nombre: "Diagnóstico de un proyecto a medida (se descuenta si contratas)", precio: "$ 150.000" },
  { nombre: "Recordatorios automáticos por WhatsApp", precio: `${pesos(PRECIO_RECORDATORIOS)} más el consumo de mensajes` },
  { nombre: "Pasarela de pagos en un plan que no la trae", precio: "$ 400.000" },
  { nombre: "Facturación electrónica con proveedor autorizado", precio: "$ 600.000 más la suscripción del proveedor" },
  { nombre: "Migración de datos desde Excel", precio: "desde $ 200.000" },
  { nombre: "Productos por encima de los incluidos", precio: "$ 2.000 por producto" },
  { nombre: "Textos redactados para tu sitio", precio: "$ 150.000" },
  { nombre: "Segundo idioma", precio: "25 % del plan" },
  { nombre: "Hora de cambios fuera del alcance", precio: "$ 40.000" },
]

/** Lo que cuesta tener el sitio en línea después de un pago único. */
export const COSTOS_DESPUES: { concepto: string; costo: string }[] = [
  { concepto: "Dominio .co o .com", costo: "unos $ 60.000 al año" },
  { concepto: "Alojamiento de una página sin panel", costo: "$ 0: se aloja en un plan gratuito que permite uso comercial" },
  { concepto: "Alojamiento de un sistema con base de datos", costo: "de $ 0 a $ 90.000 al mes; para un negocio pequeño, casi siempre menos de $ 20.000" },
  { concepto: "Correo con tu dominio", costo: "$ 0 con reenvío o con un plan gratuito; unos $ 25.000 por persona al mes con Google Workspace" },
  { concepto: "Pasarela de pagos", costo: "2,65 % + $ 700 + IVA por venta exitosa (Wompi)" },
  { concepto: "WhatsApp automático", costo: "unos $ 3 por recordatorio y $ 46 por mensaje de promoción" },
]

export const MANTENIMIENTO: { nombre: string; precio: string; incluye: string }[] = [
  { nombre: "Sin plan", precio: "$ 0", incluye: "Cambios a $ 40.000 la hora cuando los necesites. Garantía de 30 días sobre fallas, como en todo plan." },
  { nombre: "Esencial", precio: "$ 40.000 al mes", incluye: "Renovaciones, copias de seguridad, monitoreo, actualizaciones de seguridad y corrección de fallas." },
  { nombre: "Crecimiento", precio: "$ 90.000 al mes", incluye: "Lo del esencial, 2 horas de cambios y un reporte mensual de visitas y contactos." },
]

/** El plan de entrada: se muestra en todo el sitio. */
export const PRECIO_ENTRADA = PLANES.presencia.desde
/** El precio más bajo pagando por mes. */
export const MENSUAL_ENTRADA = SUSCRIPCIONES["pagina-mensual"].mensual
/** Ningún plan del catálogo pasa de aquí. Lo más grande se divide en etapas. */
export const TECHO = PLANES["sistema-completo"].desde

