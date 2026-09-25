/**
 * Modelo de Linaza, ropa de lino y algodón (negocio ficticio). Variantes,
 * bolsa y envío vienen del motor de catálogo; aquí vive lo que es de la marca.
 */
import type { Ciudad, LineaBolsa, ProductoVariantes } from "@/demos/motores/catalogo/variantes"

const u = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

export const CATEGORIAS = ["Camisas", "Pantalones", "Vestidos", "Básicos"] as const
export type Categoria = (typeof CATEGORIAS)[number]

export type Prenda = ProductoVariantes & {
  categoria: Categoria
  para: "Mujer" | "Hombre" | "Unisex"
  descripcion: string
  /** Composición y cuidado, en una línea cada uno. */
  tela: string
  cuidado: string
  /** Cómo le queda a quien sale en la foto. */
  modelo?: string
  guia: "camisa" | "mujer"
  autor: string
}

export const PRENDAS: Prenda[] = [
  {
    id: "camisa-manga-corta",
    nombre: "Camisa de lino manga corta",
    categoria: "Camisas",
    para: "Hombre",
    precio: 159_000,
    descripcion: "Cuello camisero, bolsillo al pecho y un corte recto que se lleva por fuera. Se arruga poco y se seca rápido.",
    tela: "100 % lino europeo, 160 g/m²",
    cuidado: "Lavar a mano o en ciclo delicado con agua fría. Secar a la sombra.",
    guia: "camisa",
    tallas: ["S", "M", "L", "XL"],
    colores: [
      { id: "gris", nombre: "Gris jaspe", hex: "#9a9c9b", fotos: [{ src: u("photo-1693443688057-85f57b872a3c"), alt: "Camisa de lino gris jaspe colgada de una rama" }] },
      { id: "crudo", nombre: "Crudo", hex: "#eee7da", fotos: [{ src: u("photo-1713881676551-b16f22ce4719"), alt: "Camisa de lino color crudo colgada de una rama" }] },
      { id: "azul-noche", nombre: "Azul noche", hex: "#2b3a52", fotos: [{ src: u("photo-1713881649391-a1c8ddaf83cd"), alt: "Camisa de lino azul noche colgada de una rama" }] },
    ],
    autor: "tian dayong",
  },
  {
    id: "camisa-neru",
    nombre: "Camisa cuello nerú",
    categoria: "Camisas",
    para: "Hombre",
    precio: 149_000,
    descripcion: "Sin cuello, con botones escondidos. La camisa para un matrimonio en la playa o un viernes de oficina.",
    tela: "100 % lino europeo, 160 g/m²",
    cuidado: "Lavar a mano o en ciclo delicado con agua fría. Planchar húmeda.",
    guia: "camisa",
    tallas: ["S", "M", "L", "XL"],
    colores: [{ id: "blanco", nombre: "Blanco", hex: "#f7f7f5", fotos: [{ src: u("photo-1713881587420-113c1c43e28a"), alt: "Camisa blanca cuello nerú colgada de una rama" }] }],
    autor: "tian dayong",
  },
  {
    id: "camisa-rayas",
    nombre: "Camisa a rayas",
    categoria: "Camisas",
    para: "Hombre",
    precio: 165_000,
    descripcion: "Raya fina azul sobre blanco, tejida en el hilo y no estampada. Cuello mao y manga corta.",
    tela: "55 % lino, 45 % algodón",
    cuidado: "Lavadora en ciclo delicado. No usar blanqueador.",
    guia: "camisa",
    tallas: ["S", "M", "L", "XL"],
    colores: [{ id: "rayas-azul", nombre: "Rayas azules", hex: "#8fa3c4", fotos: [{ src: u("photo-1713881842156-3d9ef36418cc"), alt: "Camisa de rayas azules colgada de una rama" }] }],
    autor: "tian dayong",
  },
  {
    id: "pantalon-tobillero",
    nombre: "Pantalón tobillero con cordón",
    categoria: "Pantalones",
    para: "Mujer",
    precio: 169_000,
    descripcion: "Tiro alto, pierna recta hasta el tobillo y cordón en la cintura. El que se pone con todo.",
    tela: "100 % lino lavado",
    cuidado: "Lavadora en ciclo delicado con agua fría. Secar a la sombra.",
    modelo: "La modelo mide 1,70 m y usa talla S.",
    guia: "mujer",
    tallas: ["XS", "S", "M", "L"],
    colores: [
      { id: "mostaza", nombre: "Mostaza", hex: "#d6a53a", fotos: [{ src: u("photo-1789110520143-9f54f069b43f"), alt: "Pantalón de lino mostaza con cordón, de frente" }] },
      { id: "rosa-palo", nombre: "Rosa palo", hex: "#d9b8bd", fotos: [{ src: u("photo-1789110520406-ebee1a8b4f23"), alt: "Pantalón de lino rosa palo con cordón, de frente" }] },
      { id: "menta", nombre: "Menta", hex: "#b9d8c6", fotos: [{ src: u("photo-1789110520410-4fce7246f844"), alt: "Pantalón de lino menta con cordón, de frente" }] },
    ],
    autor: "engin akyurt",
  },
  {
    id: "pantalon-recto",
    nombre: "Pantalón recto de pinzas",
    categoria: "Pantalones",
    para: "Mujer",
    precio: 159_000,
    antes: 199_000,
    descripcion: "Pinzas al frente, bolsillos laterales y bota recta. Queda igual de bien con tenis que con sandalias.",
    tela: "100 % lino lavado",
    cuidado: "Lavadora en ciclo delicado con agua fría. Planchar al revés.",
    modelo: "La modelo mide 1,70 m y usa talla S.",
    guia: "mujer",
    tallas: ["XS", "S", "M", "L"],
    colores: [{ id: "rojo", nombre: "Rojo tierra", hex: "#c8483b", fotos: [{ src: u("photo-1789110854331-6d3cabfef781"), alt: "Pantalón recto de lino rojo tierra con blusa beige" }] }],
    autor: "engin akyurt",
  },
  {
    id: "vestido-lazo",
    nombre: "Vestido corto con lazo",
    categoria: "Vestidos",
    para: "Mujer",
    precio: 189_000,
    descripcion: "Manga corta, botones al frente y un lazo trenzado que marca la cintura. Largo sobre la rodilla.",
    tela: "100 % lino lavado",
    cuidado: "Lavar a mano con agua fría. Secar a la sombra.",
    modelo: "La modelo mide 1,70 m y usa talla S.",
    guia: "mujer",
    tallas: ["XS", "S", "M", "L"],
    colores: [
      { id: "blanco", nombre: "Blanco", hex: "#f7f7f5", fotos: [{ src: u("photo-1789110520302-3df8ce0410f0"), alt: "Vestido corto de lino blanco con lazo trenzado" }] },
      { id: "terracota", nombre: "Terracota", hex: "#c9674d", fotos: [{ src: u("photo-1789110853872-f416085557fa"), alt: "Vestido corto terracota con botones y lazo" }] },
    ],
    autor: "engin akyurt",
  },
  {
    id: "vestido-tiras",
    nombre: "Vestido de tiras fruncido",
    categoria: "Vestidos",
    para: "Mujer",
    precio: 175_000,
    descripcion: "Escote recto con resorte, tiras delgadas y falda amplia a media pierna. Para el calor de verdad.",
    tela: "Algodón y lino, 50/50",
    cuidado: "Lavadora en ciclo delicado. Secar colgado.",
    modelo: "La modelo mide 1,70 m y usa talla S.",
    guia: "mujer",
    tallas: ["XS", "S", "M", "L"],
    colores: [{ id: "menta", nombre: "Menta", hex: "#b9d8c6", fotos: [{ src: u("photo-1789110519607-6176d668fb72"), alt: "Vestido de tiras menta, fruncido en el busto" }] }],
    autor: "engin akyurt",
  },
  {
    id: "vestido-arena",
    nombre: "Vestido recto sin mangas",
    categoria: "Vestidos",
    para: "Mujer",
    precio: 219_000,
    descripcion: "Corte recto, escote redondo y bolsillos escondidos en las costuras. Lino grueso que cae con peso.",
    tela: "100 % lino europeo, 200 g/m²",
    cuidado: "Lavar a mano con agua fría. Planchar húmedo.",
    modelo: "La modelo mide 1,68 m y usa talla S.",
    guia: "mujer",
    tallas: ["XS", "S", "M", "L"],
    colores: [{ id: "arena", nombre: "Arena", hex: "#d5c3a5", fotos: [{ src: u("photo-1747396206869-75ea57b325ce"), alt: "Vestido recto de lino color arena" }] }],
    autor: "Reistor",
  },
  {
    id: "camiseta-pima",
    nombre: "Camiseta de algodón pima",
    categoria: "Básicos",
    para: "Unisex",
    precio: 69_000,
    descripcion: "Algodón pima peruano, cuello redondo que no se estira y costuras laterales. La de todos los días.",
    tela: "100 % algodón pima, 180 g/m²",
    cuidado: "Lavadora con agua fría, al revés. No usar secadora.",
    guia: "camisa",
    tallas: ["S", "M", "L", "XL"],
    colores: [{ id: "blanco", nombre: "Blanco", hex: "#f7f7f5", fotos: [{ src: u("photo-1778671394516-8270eac13c42"), alt: "Camiseta blanca de algodón en un gancho de madera" }] }],
    autor: "Avtar Singh",
  },
  {
    id: "blazer-lino",
    nombre: "Blazer de lino sin forro",
    categoria: "Básicos",
    para: "Hombre",
    precio: 289_000,
    descripcion: "Dos botones, sin forro ni hombreras: una chaqueta que se puede usar en tierra caliente.",
    tela: "100 % lino europeo, 220 g/m²",
    cuidado: "Lavado en seco o a mano con agua fría. Colgar en gancho ancho.",
    guia: "camisa",
    tallas: ["S", "M", "L", "XL"],
    colores: [{ id: "azul", nombre: "Azul", hex: "#2f4468", fotos: [{ src: u("photo-1740710748146-a15d840d6f40"), alt: "Dos blazers de lino azul colgados" }] }],
    autor: "Robert Richman",
  },
]

export const prendaPorId = (id: string) => PRENDAS.find((p) => p.id === id)

export const FOTOS = {
  portada: { src: u("photo-1776633734216-26b0dbcf61d1", 1600), alt: "Mujer con camisa blanca de lino frente al mar", autor: "Margo Evardson" },
  telas: { src: u("photo-1596433904747-e8b061219a71", 1200), alt: "Telas de lino dobladas sobre una tabla", autor: "Svitlana" },
}

export const MARCA = {
  nombre: "Linaza",
  lema: "Lino y algodón, hechos en Medellín",
  taller: "Taller y tienda en Provenza, Medellín (dirección de ejemplo)",
  whatsappVisible: "300 000 0000",
  instagram: "@linaza.co (ejemplo)",
  correo: "hola@linaza.example",
}

export const GRATIS_DESDE = 250_000

export const CIUDADES: Ciudad[] = [
  { id: "medellin", nombre: "Medellín y área metropolitana", costo: 9_900, dias: "1 a 2 días hábiles" },
  { id: "bogota", nombre: "Bogotá", costo: 12_900, dias: "2 a 3 días hábiles" },
  { id: "cali", nombre: "Cali", costo: 12_900, dias: "2 a 3 días hábiles" },
  { id: "barranquilla", nombre: "Barranquilla", costo: 14_900, dias: "3 a 4 días hábiles" },
  { id: "cartagena", nombre: "Cartagena", costo: 14_900, dias: "3 a 4 días hábiles" },
  { id: "otra", nombre: "Otra ciudad o municipio", costo: 16_900, dias: "3 a 6 días hábiles" },
]

/** Guía de tallas en centímetros. */
export const GUIAS = {
  camisa: {
    titulo: "Camisas y básicos",
    columnas: ["Talla", "Pecho", "Largo", "Hombro"],
    filas: [
      ["S", "96 a 100", "72", "44"],
      ["M", "101 a 106", "74", "46"],
      ["L", "107 a 112", "76", "48"],
      ["XL", "113 a 118", "78", "50"],
    ],
  },
  mujer: {
    titulo: "Pantalones y vestidos",
    columnas: ["Talla", "Busto", "Cintura", "Cadera"],
    filas: [
      ["XS", "80 a 84", "62 a 66", "88 a 92"],
      ["S", "85 a 89", "67 a 71", "93 a 97"],
      ["M", "90 a 95", "72 a 77", "98 a 103"],
      ["L", "96 a 101", "78 a 83", "104 a 109"],
    ],
  },
} as const

// ─── Estado de la demo ────────────────────────────────────────────────────

export type LineaPedido = LineaBolsa & { nombre: string; colorNombre: string; precio: number }

export type MetodoPago = "pse" | "nequi" | "tarjeta" | "whatsapp"

export const PAGO: Record<MetodoPago, string> = {
  pse: "PSE",
  nequi: "Nequi",
  tarjeta: "Tarjeta de crédito",
  whatsapp: "Por confirmar en WhatsApp",
}

export type EstadoPedido = "por-confirmar" | "pagado" | "alistado" | "enviado" | "entregado" | "cancelado"

export const ESTADO: Record<EstadoPedido, string> = {
  "por-confirmar": "Por confirmar",
  pagado: "Pagado",
  alistado: "Empacado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

export type Pedido = {
  id: string
  numero: number
  fecha: string
  cliente: { nombre: string; correo?: string; telefono: string }
  direccion: string
  ciudadId: string
  lineas: LineaPedido[]
  envio: number
  pago: MetodoPago
  estado: EstadoPedido
  guia?: string
}

export type EstadoTienda = {
  referencia: string
  existencias: Record<string, number>
  pedidos: Pedido[]
  siguientePedido: number
}
