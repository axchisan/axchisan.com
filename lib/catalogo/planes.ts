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
  incluye: string[]
  noIncluye: string[]
}

export const PLANES: Record<PlanId, Plan> = {
  presencia: {
    id: "presencia",
    nombre: "Presencia",
    desde: 300_000,
    entrega: "3 días hábiles",
    resumen: "Una página con tus servicios, horario, ubicación y botón de WhatsApp.",
    incluye: ["Una página con tus servicios, horario y ubicación con mapa", "Galería de fotos y botón de WhatsApp", "Se ve bien en celular y aparece en Google", "Plantilla de Axchi con tus colores", "Una ronda de ajustes"],
    noIncluye: ["Dominio (unos $ 60.000 al año, a tu nombre)", "Textos y fotos: los entregas tú", "Diseño a medida y panel para editar"],
  },
  "pagina-profesional": {
    id: "pagina-profesional",
    nombre: "Página profesional",
    desde: 900_000,
    entrega: "1 a 2 semanas",
    resumen: "Diseño propio con tu marca, formulario, analítica y ficha de Google.",
    incluye: ["Diseño propio con tu marca", "Hasta 8 secciones", "Formulario que llega a tu correo", "Analítica de visitas", "Ficha de Google Business", "Dos rondas de ajustes"],
    noIncluye: ["Panel para editar", "Tienda o reservas"],
  },
  "sitio-con-panel": {
    id: "sitio-con-panel",
    nombre: "Sitio con panel",
    desde: 1_800_000,
    entrega: "2 a 3 semanas",
    resumen: "Varias páginas y un panel para cambiar textos, fotos y precios tú mismo.",
    incluye: ["Varias páginas", "Panel para cambiar textos, fotos y precios tú mismo", "Todo lo de la página profesional"],
    noIncluye: ["Ventas en línea"],
  },
  "catalogo-whatsapp": {
    id: "catalogo-whatsapp",
    nombre: "Catálogo con pedidos por WhatsApp",
    desde: 2_200_000,
    entrega: "2 a 3 semanas",
    resumen: "Productos, carrito y pedido que te llega completo por WhatsApp.",
    incluye: ["Productos con fotos, variantes y combos", "Carrito que se conserva", "Pedido que llega armado por WhatsApp y queda guardado", "Panel de productos y pedidos", "Carga de hasta 50 productos"],
    noIncluye: ["Cobro en línea"],
  },
  "citas-en-linea": {
    id: "citas-en-linea",
    nombre: "Citas en línea",
    desde: 2_500_000,
    entrega: "3 semanas",
    resumen: "Tus clientes reservan desde el celular y tú ves la agenda del día.",
    incluye: ["Servicios, profesionales y horarios", "Reserva desde el celular solo en horas libres", "Panel con la agenda del día y de la semana", "Confirmación por correo"],
    noIncluye: ["Recordatorios automáticos por WhatsApp (módulo aparte)"],
  },
  "tienda-con-pagos": {
    id: "tienda-con-pagos",
    nombre: "Tienda con pagos",
    desde: 3_500_000,
    entrega: "3 a 5 semanas",
    resumen: "Cobro en línea con PSE, Nequi o tarjeta, inventario y estados de pedido.",
    incluye: ["Todo lo del catálogo", "Cobro con PSE, Nequi o tarjeta", "Inventario y estados de pedido", "Correos al comprador"],
    noIncluye: ["Comisión de la pasarela, que se descuenta de cada venta"],
  },
  "sistema-de-gestion": {
    id: "sistema-de-gestion",
    nombre: "Sistema de gestión",
    desde: 6_000_000,
    entrega: "5 a 7 semanas",
    resumen: "El sistema de tu negocio: usuarios, módulos propios, reportes y Excel.",
    incluye: ["Usuarios con roles y permisos", "Los módulos de tu negocio: inventario, historias, pedidos…", "Reportes y exportación a Excel", "Copias de seguridad automáticas", "Capacitación para tu equipo"],
    noIncluye: ["Facturación electrónica y migración de datos (módulos aparte)"],
  },
  "app-movil": {
    id: "app-movil",
    nombre: "App móvil",
    desde: 8_000_000,
    entrega: "6 a 10 semanas",
    resumen: "Una app instalable sobre un sistema nuevo o existente.",
    incluye: ["App instalable sobre un sistema nuevo o existente", "Funciona en Android y iPhone"],
    noIncluye: ["Publicación en tiendas: las cuentas de desarrollador son del cliente"],
  },
}

/** Módulos que se suman a cualquier plan. Razones en PRECIOS.md §4.2. */
export const MODULOS: { nombre: string; precio: string }[] = [
  { nombre: "Diagnóstico de un proyecto a medida (se descuenta si contratas)", precio: "$ 450.000" },
  { nombre: "Recordatorios automáticos por WhatsApp", precio: "$ 900.000 más el consumo de mensajes" },
  { nombre: "Pasarela de pagos en un plan que no la trae", precio: "$ 900.000" },
  { nombre: "Facturación electrónica con proveedor autorizado", precio: "$ 1.350.000 más la suscripción del proveedor" },
  { nombre: "Migración de datos desde Excel", precio: "desde $ 450.000" },
  { nombre: "Productos por encima de los incluidos", precio: "$ 3.000 por producto" },
  { nombre: "Textos redactados para tu sitio", precio: "$ 300.000" },
  { nombre: "Segundo idioma", precio: "30 % del plan" },
  { nombre: "Hora de cambios fuera del alcance", precio: "$ 60.000" },
]

/** Lo que cuesta tener el sitio en línea después de la entrega. */
export const COSTOS_DESPUES: { concepto: string; costo: string }[] = [
  { concepto: "Dominio .co o .com", costo: "unos $ 60.000 al año" },
  { concepto: "Hosting de una página sin panel", costo: "$ 0: se aloja en un plan gratuito que permite uso comercial" },
  { concepto: "Hosting de un sistema con base de datos", costo: "de $ 0 a $ 90.000 al mes; para un negocio pequeño, casi siempre menos de $ 20.000" },
  { concepto: "Correo con tu dominio", costo: "$ 0 con reenvío; unos $ 25.000 por persona al mes con Google Workspace" },
  { concepto: "Pasarela de pagos", costo: "2,65 % + $ 700 + IVA por venta exitosa (Wompi)" },
  { concepto: "WhatsApp automático", costo: "unos $ 3 por recordatorio y $ 46 por mensaje de promoción" },
]

export const MANTENIMIENTO: { nombre: string; precio: string; incluye: string }[] = [
  { nombre: "Sin plan", precio: "$ 0", incluye: "Cambios a $ 60.000 la hora cuando los necesites. Garantía de 30 días sobre fallas, como en todo plan." },
  { nombre: "Esencial", precio: "$ 90.000 al mes", incluye: "Renovaciones, copias de seguridad, monitoreo, actualizaciones de seguridad, corrección de fallas y 30 minutos de cambios." },
  { nombre: "Crecimiento", precio: "$ 250.000 al mes", incluye: "Lo del esencial, 3 horas de cambios y un reporte mensual de visitas y contactos." },
]

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
